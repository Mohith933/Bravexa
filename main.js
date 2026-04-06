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

 // AI typing placeholder
// Create AI message container
const aiMessage = document.createElement("div");
aiMessage.classList.add("message", "ai-message");

// Dynamic texts
const thinkingTexts = [
  "⚡ Thinking",
  "🧠 Analyzing",
  "🔍 Looking deeper",
  "✨ Generating response"
];

const randomText =
  thinkingTexts[Math.floor(Math.random() * thinkingTexts.length)];

// 👉 Proper dots animation structure
aiMessage.innerHTML = `
  <div class="ai-thinking">
    <span class="ai-text">${randomText}</span>
    <span class="dots">
      <span></span><span></span><span></span>
    </span>
  </div>
`;

chatWindow.appendChild(aiMessage);
makeMessageVisible(aiMessage);

// 👉 AI response
setTimeout(async () => {
  const response = await generateAIResponse(message);

  // Smooth fade out thinking
  aiMessage.querySelector(".ai-thinking").style.opacity = "0";

  setTimeout(() => {
    aiMessage.innerHTML = ""; // clear

    // 👉 Typewriter effect
    typeText(aiMessage, response);

    saveMessage(currentChatId, "ai", response);
  }, 300);

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

  // Create temp element to extract text only
  const temp = document.createElement("div");
  temp.innerHTML = htmlContent;
  const textContent = temp.innerText;

  element.innerHTML = "";

  let lastScroll = 0;

  function type() {
    i += 2;
    element.innerText = textContent.slice(0, i);

    const now = Date.now();
    if (now - lastScroll > 120) {
      window.scrollTo({
        top: document.body.scrollHeight,
        behavior: "smooth"
      });
      lastScroll = now;
    }

    if (i < textContent.length) {
      requestAnimationFrame(type);
    } else {
      element.innerHTML = htmlContent; // ✅ final correct render
    }
  }

  requestAnimationFrame(type);
}
// === SIMPLE AI RESPONSES ===
  async function generateAIResponse(userMessage) {
  const msg = (userMessage || "").toLowerCase().trim();

  function section(title, content) {
    return `
      <div class="ai-block">
        <div class="ai-title">${title}</div>
        <div class="ai-content">${content}</div>
      </div>
    `;
  }

  function docBlock(title, content, actions = "") {
    return `
      <div class="ai-doc-block">
        <div class="ai-doc-header">
          <span>${title}</span>
          <div class="ai-actions">${actions}</div>
        </div>
        <pre class="ai-doc">${content}</pre>
      </div>
    `;
  }

  // ========= GREETING =========
  if (msg.includes("hi") || msg.includes("hello")) {
    return `
      ${section("👋 Hello — Bravexa AI",
        "I can help you with writing, coding, resumes, and more.")}
      
      ${section("✨ Try this",
        "• Create resume\n• Write email\n• Fix code\n• Explain topic")}
    `;
  }

  // ========= EMAIL =========
  if (msg.includes("email")) {
    return `
      ${section("📧 Email Generator",
        "Here’s a professional email you can use:")}

      ${docBlock("📄 Email",
`Subject: Request Regarding Project

Dear Sir/Madam,

I hope you are doing well.

I would like to discuss the project progress and next steps.

Thank you.

Best regards,
[Your Name]`,
        `<button class="copyBtn">📋</button>
         <button class="sendBtn">✉️</button>`)}
      
      ${section("👉 Tip",
        "Tell me role or company to personalize this.")}
    `;
  }

  // ========= RESUME =========
  if (msg.includes("resume") || msg.includes("cv")) {
    return `
      ${section("🧾 Resume Builder",
        "Simple clean resume format:")}

      ${docBlock("📄 Resume",
`Name: Your Name
Email: your@email.com

Objective:
To contribute and grow.

Skills:
- Problem Solving
- Teamwork

Education:
B.Tech CSE

Experience:
Fresher`,
        `<button class="copyBtn">📋</button>
         <button class="saveBtn">💾</button>`)}
    `;
  }

  // ========= CODE =========
  if (msg.includes("code") || msg.includes("program")) {
    return `
      ${section("💻 Code Example",
        "Here’s a simple program:")}

      ${docBlock("JavaScript",
`function greet(name){
  console.log("Hello " + name);
}
greet("User");`,
        `<button class="copyBtn">📋</button>`)}
    `;
  }

  // ========= EXPLAIN =========
  if (msg.includes("how") || msg.includes("explain")) {
    return `
      ${section("🧠 Explanation",
        "Let’s break it step by step:")}

      ${section("1️⃣ Input",
        "User gives a request")}

      ${section("2️⃣ Process",
        "System detects intent")}

      ${section("3️⃣ Output",
        "Generates response")}
    `;
  }

  // ========= DEFAULT (GEMINI STYLE) =========
  return `
    ${section("✨ Bravexa AI",
      "I understood your request.")}

    ${section("💡 Answer",
      `${userMessage}`)}

    ${section("🚀 Next",
      "Ask me to generate, explain, or build something.")}
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

