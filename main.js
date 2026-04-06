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
    if (!userMessage && !selectedFile) return;
    
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
    uploadDropdown.style.bottom = "40px";
    uploadDropdown.style.left = "20px";
    uploadDropdown.style.marginTop = "0px";
    chatbox.style.height = "50px";
    footer.style.marginTop = "0px";
    chatWindow.style.display = "flex";
    footer.style.fontSize = "10px";
    footer.innerHTML = "⚡ Bravexa AI Verify important details.";
  }



   // Show messages inside chat window
  function addMessageToChat(message) {
    // User message
    const newMessage = document.createElement("div");
    newMessage.classList.add("message", "user-message");
    newMessage.textContent = message;
    chatWindow.appendChild(newMessage);
    makeMessageVisible(newMessage);



    // AI typing hearts animation
 // AI typing placeholder
const aiMessage = document.createElement("div");
aiMessage.classList.add("message", "ai-message");

// Dynamic texts
const thinkingTexts = [
  "⚡ Thinking",
  "🧠 Analyzing",
  "🔍 Looking deeper",
  "✨ Generating response"
];

// Pick random text
const randomText =
  thinkingTexts[Math.floor(Math.random() * thinkingTexts.length)];

aiMessage.innerHTML = `
  <div class="ai-thinking">
    <span class="ai-icon"></span>
    <span class="ai-text">${randomText}</span>
    <span class="dots"></span>
  </div>
`;

chatWindow.appendChild(aiMessage);
makeMessageVisible(aiMessage);

  setTimeout(async () => {
  const response = await generateAIResponse(message);

  // Clear thinking UI smoothly
  aiMessage.innerHTML = "";

  // Type effect (your function)
  typeText(aiMessage, response);

  saveMessage(currentChatId, "ai", response);
}, 1000);
    
  }

 // === SCROLL TO SHOW MESSAGES ===
  function makeMessageVisible(messageElement) {
    setTimeout(() => {
      messageElement.classList.add("visible");
      window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
    }, 10);
  }

  // === BRAVEXA TYPE EFFECT ===  
function typeText(element, htmlContent, speed = 12) {
  let i = 0;
  element.innerHTML = "";

  let lastScroll = 0;

  function type() {
    // increase characters smoothly
    i += 2; // balanced speed (not jumpy)
    element.innerHTML = htmlContent.slice(0, i);

    // auto-scroll only when needed
    const now = Date.now();
    if (now - lastScroll > 120) {
      window.scrollTo({
        top: document.body.scrollHeight,
        behavior: "smooth"
      });
      lastScroll = now;
    }

    if (i < htmlContent.length) {
      requestAnimationFrame(type);
    } else {
      element.innerHTML = htmlContent; // ensure full render
    }
  }

  requestAnimationFrame(type);
}
// === SIMPLE AI RESPONSES ===
 async function generateAIResponse(userMessage) {
  const msg = (userMessage || "").toLowerCase().trim();
  let intent = detectIntent(msg);

  let intro = "";
  let outro = "";
  let body = "";

  // --- RULE-BASED RESPONSES ---
  switch (intent) {
    case "greeting":
      intro = "Hello! It's great to see you today.";
      body = `<h2>👋 Hello — Bravexa AI</h2>
              <p>I'm Bravexa — your workspace assistant. Try: "Generate leave letter" or "Make a resume".</p>`;
      outro = "How can I help you get started?";
      break;

    case "leave":
      intro = "I've prepared a leave letter template for you. Just fill in your details.";
      body = `<h2>📄 Leave Letter</h2>
              <div class="code-block-container">
                <div class="code-toolbar"><span class="lang-label">📧 mailto</span>
                  <div class="btn-group"><button class="copyBtn">📋 Copy</button><button class="sendBtn">✉️ Send</button></div>
                </div>
                <pre class="code-content" contenteditable="true">To\nThe Principal,\n[College],\n\nSubject: Leave Request\n\nRespected Sir/Madam,\nI am [Name]. I request leave from [Start] to [End] due to [Reason].\n\nYours faithfully,\n[Name]</pre>
              </div>`;
      outro = "Make sure to submit this at least a day in advance!";
      break;

    case "email":
      intro = "Here is a professional draft for your project discussion.";
      body = `<h2>📧 Official Email</h2>
              <div class="code-block-container">
                <div class="code-toolbar"><span class="lang-label">📧 mailto</span>
                  <div class="btn-group"><button class="copyBtn">📋 Copy</button><button class="sendBtn">✉️ Send</button></div>
                </div>
                <pre class="code-content" contenteditable="true">Subject: Project Discussion\n\nDear [Name],\nI hope you are well. I'd like to discuss our project progress. Let me know your availability.\n\nBest,\n[Your Name]</pre>
              </div>`;
      outro = "I can help you rewrite this if you need a different tone.";
      break;

    case "resume":
      intro = "A clean resume is the first step to your dream job. Here is a solid template.";
      body = `<h2>🧾 Resume Template</h2>
              <div class="code-block-container">
                <div class="code-toolbar"><span class="lang-label">📄 .docx</span>
                  <div class="btn-group"><button class="copyBtn">📋 Copy</button><button class="saveBtn">💾 Save</button></div>
                </div>
                <pre class="code-content" contenteditable="true"><b>Name:</b> [Your Name]\n<b>Skills:</b> Python, JS, C++\n<b>Education:</b> B.Tech in CSE\n<b>Internship:</b> Web Dev at [Company]</pre>
              </div>`;
      outro = "Pro-tip: Keep your resume to a single page for maximum impact.";
      break;

    case "code":
      let lang = msg.includes("python") ? "python" : (msg.includes("java") ? "java" : "javascript");
      intro = `I've generated a basic ${lang.toUpperCase()} starter for you.`;
      const codeTpl = {
        python: "def main():\n    print('Hello Bravexa')\nmain()",
        java: "public class Main {\n  public static void main(String[] args) {\n    System.out.println(\"Hello\");\n  }\n}",
        javascript: "console.log('Hello Bravexa');"
      };
      body = `<h2>💻 ${lang.toUpperCase()} Code</h2>
              <div class="code-block-container">
                <div class="code-toolbar"><span class="lang-label">${lang.toUpperCase()}</span>
                  <div class="btn-group"><button class="copyBtn">📋 Copy</button></div>
                </div>
                <pre class="code-content"><code>${codeTpl[lang] || codeTpl.javascript}</code></pre>
              </div>`;
      outro = "Happy coding! Let me know if you need specific logic.";
      break;

    case "dbms":
      intro = "Database management is crucial for any application. Here is a quick note.";
      body = `<h2>🗄️ DBMS / SQL</h2>
              <p><b>Note:</b> Focus on JOIN types (Inner, Left, Right) and 3NF Normalization for your exams.</p>`;
      outro = "Would you like me to generate a sample SQL query for you?";
      break;

    case "math":
      intro = "Calculus made easy! Here is the derivative you were looking for.";
      body = `<h2>📐 Mathematics</h2><p>Rule: $$\\frac{d}{dx}(x^2) = 2x$$</p>`;
      outro = "Math is just logic with numbers!";
      break;

    case "how":
      intro = "Curious about how I process your requests? Here is the workflow.";
      body = `<h2>🧠 How Bravexa Works</h2>
              <p>1. <b>Input:</b> You type a message.<br>2. <b>Intent:</b> I detect keywords.<br>3. <b>Logic:</b> I pick the right template.<br>4. <b>Render:</b> I display the result.</p>`;
      outro = "I run entirely on your browser for maximum speed.";
      break;

    case "motivate":
      intro = "Feeling a bit low? Remember this:";
      body = `<h2>🚀 Motivation</h2><p>Small daily steps lead to massive long-term results. Keep going!</p>`;
      outro = "You've got this!";
      break;

    default:
      intro = "I'm ready to help with your workspace tasks.";
      body = `<h2>✨ Bravexa AI</h2>
              <p>Try asking me to <b>write an email</b>, <b>create a resume</b>, or <b>generate code</b>.</p>`;
      outro = "What should we work on next?";
  }

  // --- FINAL DYNAMIC STRUCTURE ---
  return `
    <p>${intro}</p>
    <hr>
    ${body}
    <hr>
    <p>${outro}</p>
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
  const authMessages = [
  "🔐 Please login to continue.",
  "🚀 Sign up to unlock this feature.",
  "👤 Authentication required.",
  "⚡ Login needed for full access."
];

function getAuthMessage() {
  return authMessages[Math.floor(Math.random() * authMessages.length)];
}

// === LIMITED SELECTED FUNCTIONALITY ===
document.querySelectorAll("#imageUpload, #videoUpload, #audioUpload").forEach(input => {
  input.addEventListener("change", (event) => {
    const file = event.target.files[0];

    if (file) {
      alert(`${getAuthMessage}

You're trying to upload:
📁 ${file.name}

To continue:
👉 Please Sign Up or Login to Bravexa AI

(This feature will be enabled after authentication)`);
    }
  });
});

screenshotBtn.addEventListener("click", () => {
  alert(`🚫 Feature Locked

📸 Screenshot is available only for logged-in users.

👉 Please Login / Sign Up to access Bravexa Dashboard.`);
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
