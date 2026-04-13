 document.addEventListener("DOMContentLoaded", function () {
  // === ELEMENT REFERENCES ===
  const hero = document.querySelector('.hero');
  const chatWindow = document.querySelector('.chat-window');
  const sendBtn = document.querySelector('.send-btn');
  const chatbox = document.querySelector('.chatbox');
  const inputArea = document.querySelector('.input-box');
  const footer = document.querySelector('.footer');
  const uploadDropdown = document.getElementById("uploadDropdown");
  const avatarIcon = document.getElementById("avatarIcon");
  const dropdownMenu = document.getElementById("dropdownMenu");
  const plusBtn = document.getElementById("plusBtn");
  const screenshotBtn = document.getElementById("screenshotBtn");
  const historyList = document.getElementById("historyList");
  const toggleHistoryBtn = document.getElementById("toggleHistory");


chatbox.addEventListener("input", () => {
  chatbox.style.height = "auto"; // reset height
  chatbox.style.height = chatbox.scrollHeight + "px"; // set to full content height
});


  document.getElementById("editLogoBtn").addEventListener("click", () => {
  window.location.href = "index.html";
  });

const voiceBtn = document.querySelector('.voice-icon');

// Check if browser supports speech recognition
if ('webkitSpeechRecognition' in window) {
  const recognition = new webkitSpeechRecognition();
  recognition.continuous = false;
  recognition.interimResults = false;
  recognition.lang = 'en-US';

  voiceBtn.addEventListener('click', () => {
    recognition.start();
    voiceBtn.style.color = '#00e1ff'; // glowing when active
  });

  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    chatbox.value += (chatbox.value ? ' ' : '') + transcript;
    voiceBtn.style.color = '#fff';
  };

  recognition.onerror = (event) => {
    console.error('Speech recognition error:', event.error);
    voiceBtn.style.color = '#fff';
  };

  recognition.onend = () => {
    voiceBtn.style.color = '#fff';
  };
} else {
  alert('Speech Recognition not supported in this browser 😞');
}



  // === MESSAGE SEND EVENTS ===
  sendBtn.addEventListener('click', sendMessage);
  chatbox.addEventListener('keydown', function (event) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  });

  // === SEND MESSAGE ===
  function sendMessage() {
    const userMessage = chatbox.value.trim();
    if (userMessage) {
      addMessageToChat(userMessage);
      chatbox.value = "";
    }

    // Hide hero and set layout
    hero.style.display = "none";
    inputArea.style.position = "fixed";
    chatWindow.style.marginTop = "80px";
    inputArea.style.bottom = "31px";
    inputArea.style.left = "50%";
    inputArea.style.transform = "translateX(-50%)";
    uploadDropdown.style.bottom = "35px";
    uploadDropdown.style.left = "0px";
    uploadDropdown.style.marginTop = "0px";
    chatbox.style.height = "50px";
    footer.style.marginTop = "0px";
    chatWindow.style.display = "flex";
    footer.style.fontSize = "10px";
    footer.innerHTML = "⚡ Bravexa Verify important details.";
  
  }

   // Show messages inside chat window
 function addMessageToChat(message) {
  // --- 1. User Message ---
  const newMessage = document.createElement("div");
  newMessage.classList.add("message", "user-message");
  newMessage.textContent = message;
  chatWindow.appendChild(newMessage);
  makeMessageVisible(newMessage);

  // --- 2. Bravexa AI Loader (Gemini Style) ---
  const aiMessage = document.createElement("div");
  aiMessage.classList.add("message", "ai-message", "loading"); // 'loading' class for special styling

  aiMessage.innerHTML = `
    <div class="gemini-loader">
      <div class="ai-icon-wrapper">
        <img src="chat.png" class="ai-pulse-icon">
      </div>
      <div class="shimmer-container">
        <div class="shimmer-line"></div>
        <div class="shimmer-line short"></div>
      </div>
    </div>
  `;
  
  chatWindow.appendChild(aiMessage);
  makeMessageVisible(aiMessage);
  
  // --- 3. Trigger Response ---
  setTimeout(async () => {
    const response = await generateAIResponse(message);
    
    // Remove the loading class and clear the loader
    aiMessage.classList.remove("loading");
    aiMessage.innerHTML = "";
    
    // Smoothly type the response
    typeText(aiMessage, response);
  }, 1500);
}

 // === SCROLL TO SHOW MESSAGES ===
  function makeMessageVisible(messageElement) {
    setTimeout(() => {
      messageElement.classList.add("visible");
      window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
    }, 10);
  }

  // === BRAVEXA TYPE EFFECT ===  
function typeText(element, htmlContent, speed = 1) {
  element.innerHTML = "";
  let i = 0;
  let lastScroll = 0;

  // This creates a "virtual" div to parse the HTML safely
  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = htmlContent;
  const fullText = tempDiv.innerHTML;

  function type() {
    // Increase the step slightly for a "streaming" feel
    // Using a smaller increment with requestAnimationFrame looks smoother
    i += 3; 

    // We use a temporary string to ensure we don't break HTML tags (like <div> or <b>)
    // while they are being typed.
    element.innerHTML = fullText.slice(0, i);

    // Auto-scroll logic: only scrolls if the user is near the bottom
    const now = Date.now();
    const isAtBottom = (window.innerHeight + window.scrollY) >= document.body.offsetHeight - 50;
    
    if (isAtBottom && now - lastScroll > 100) {
      window.scrollTo({
        top: document.body.scrollHeight,
        behavior: "auto" // 'auto' feels more responsive for live typing than 'smooth'
      });
      lastScroll = now;
    }

    if (i < fullText.length) {
      requestAnimationFrame(type);
    } else {
      element.innerHTML = fullText; // Final clean render
    }
  }

  requestAnimationFrame(type);
}
// === SIMPLE AI RESPONSES ===
// === SIMPLE AI RESPONSES ===
// === BRAVEXA CORE INTELLIGENCE ===
async function generateAIResponse(userMessage) {
  const msg = (userMessage || "").toLowerCase().trim();

  // 1. Expanded Intents for a "Smarter" Feel
  const intents = {
    greeting: ["hello", "hi", "hey", "bravexa", "good morning"],
    leave: ["leave", "absent", "permission", "sick"],
    email: ["email", "mail", "compose", "draft"],
    resume: ["resume", "cv", "portfolio", "job"],
    code: ["code", "program", "python", "java", "javascript", "script"],
    dbms: ["dbms", "sql", "database", "table"],
    math: ["math", "calculus", "derivative", "formula"],
    how: ["how it works", "workflow", "architecture", "process"],
    motivate: ["motivate", "inspire", "hard work", "low"]
  };

  // 2. Intent Scoring Logic
  let bestMatch = "default";
  let maxScore = 0;

  for (const [intentName, keywords] of Object.entries(intents)) {
    let score = 0;
    for (const keyword of keywords) {
      if (msg.includes(keyword)) {
        score += keyword.length; // Priority to specific keywords
      }
    }
    if (score > maxScore) {
      maxScore = score;
      bestMatch = intentName;
    }
  }

  let intro = "", body = "", outro = "";

  // 3. Bravexa Styled Responses
  switch (bestMatch) {
    case "greeting":
      intro = "System initialized. Hello! I am Bravexa.";
      body = `<h2>⚡ Status: Online</h2>
              <p>I'm your workspace companion, optimized for <b>productivity</b> and <b>academic support</b>.</p>`;
      outro = "What shall we build or draft today?";
      break;

       case "email":
        intro = "Here is a professional email draft.";
        body = `<h2>📧 Official Email</h2>
                <div class="code-block-container">
                  <div class="code-toolbar"><span class="lang-label">📧 mailto</span>
                    <div class="btn-group"><button class="copyBtn">📋 Copy</button><button class="sendBtn">✉️ Send</button></div>
                  </div>
                  <pre class="code-content" contenteditable="true">Subject: [Topic]\n\nDear [Name],\n\nI hope you're well. I'm writing to discuss [Reason].\n\nBest regards,\n[Your Name]</pre>
                </div>`;
        break;

    case "leave":
      intro = "Generating a formal leave request for you.";
      body = `<h2>📄 Leave Letter Template</h2>
              <div class="code-block-container">
                <div class="code-toolbar"><span class="lang-label">FORMAT: OFFICIAL</span>
                  <div class="btn-group"><button class="copyBtn">📋 Copy</button><button class="sendBtn">✉️ Send</button></div>
                </div>
                <pre class="code-content" contenteditable="true">To\nThe Principal,\n[Institution Name],\n\nSubject: Application for Leave\n\nRespected Sir/Madam,\nI am writing to formally request leave from [Start Date] to [End Date] due to [Reason]. I will ensure my tasks are up to date.\n\nYours faithfully,\n[Your Name]</pre>
              </div>`;
      outro = "Tip: Make sure the reason is clear and concise.";
      break;

    case "code":
      let lang = msg.includes("python") ? "python" : (msg.includes("java") ? "java" : "javascript");
      intro = `Logic sequence initiated for ${lang.toUpperCase()}.`;
      const templates = {
        python: "def bravexa_init():\n    print('Bravexa AI System Active')\n\nbravexa_init()",
        java: "public class Bravexa {\n  public static void main(String[] args) {\n    System.out.println(\"System Online\");\n  }\n}",
        javascript: "const bravexa = () => {\n  console.log('Hello from Bravexa AI');\n};\nbravexa();"
      };
      body = `<h2>💻 ${lang.toUpperCase()} Snippet</h2>
              <div class="code-block-container">
                <div class="code-toolbar"><span class="lang-label">${lang.toUpperCase()}</span>
                  <div class="btn-group"><button class="copyBtn">📋 Copy</button></div>
                </div>
                <pre class="code-content"><code>${templates[lang]}</code></pre>
              </div>`;
      outro = "Logic check complete. Need specific functions added?";
      break;

    case "math":
      intro = "Processing mathematical expression...";
      body = `<h2>📐 Calculation/Rule</h2>
              <p>For the function $f(x) = x^n$, the derivative is:</p>
              <div class="math-card">
                $$\\frac{d}{dx}(x^n) = nx^{n-1}$$
              </div>`;
      outro = "Calculus module active. Send me any equation.";
      break;

    default:
      intro = "Awaiting command...";
      body = `<h2>✨ Bravexa Workspace</h2>
              <p>I can assist with <b>Emails</b>, <b>Resumes</b>, <b>Notes</b>, or <b>Programming</b>. Simply state your requirement.</p>`;
      outro = "Ready when you are.";
  }

  // 4. Final Final Render with "Bravexa" Styling
  return `
    <div class="bravexa-intro">${intro}</div>
    <hr class="bravexa-divider">
    <div class="bravexa-body">${body}</div>
    <hr class="bravexa-divider">
    <div class="bravexa-outro">${outro}</div>
  `;
}
// === GLOBAL EVENT DELEGATION FOR BUTTONS ===
document.addEventListener("click", (e) => {
  const block = e.target.closest(".code-block-container");
  if (!block) return;
  const textElement = block.querySelector(".code-content");

  // Disable editing in main.js (view-only)
  textElement.setAttribute("contenteditable", "false");

  // --- COPY ---
  if (e.target.classList.contains("copyBtn")) {
    const text = textElement.textContent.trim();
    navigator.clipboard.writeText(text);
    alert("📋 Copied to clipboard!");
  }

  // --- SEND (Blocked) ---
  if (e.target.classList.contains("sendBtn")) {
    alert("⚠️ Please login to send emails!");
  }

  // --- SAVE (Blocked) ---
  if (e.target.classList.contains("saveBtn")) {
    alert("⚠️ Please login to save files!");
  }
});

  plusBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    uploadDropdown.style.display =
      uploadDropdown.style.display === "block" ? "none" : "block";
  });

  document.addEventListener("click", (e) => {
    if (!uploadDropdown.contains(e.target) && e.target !== plusBtn) {
      uploadDropdown.style.display = "none";
    }
  });

// === LIMITED SELECTED FUNCTIONALITY ===
document.querySelectorAll("#imageUpload, #videoUpload, #audioUpload").forEach(input => {
  input.addEventListener("change", (event) => {
    const file = event.target.files[0];
    if (file) alert(`Selected: ${file.name}`);
  });
});

// === SCREENSHOT DEMO ===
screenshotBtn.addEventListener("click", () => {
  alert("📸 Screenshot feature available only in Bravexa Dashboard.");
});

  // === RESPONSIVE LAYOUT ===
  function adjustLayoutForViewport() {
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const isLandscape = viewportWidth > viewportHeight;

    if (viewportWidth <= 420) {
      sendBtn.style.right = isLandscape ? "50px" : "20px";
      inputArea.style.width = "90%";
    } else if (viewportWidth <= 1024) {
      sendBtn.style.right = isLandscape ? "60px" : "30px";
      inputArea.style.width = "80%";
    } else {
      sendBtn.style.right = "40px";
      inputArea.style.width = "50%";
    }
  }

  window.addEventListener("resize", adjustLayoutForViewport);
  adjustLayoutForViewport();
  if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("service-worker.js")
      .then(() => console.log("Service Worker Registered"))
      .catch((err) => console.log("SW Error:", err));
  });
}
});
