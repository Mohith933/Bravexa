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
  const menuToggle = document.getElementById("menuToggle");
  const sidebar = document.getElementById("sidebar");

  // Open sidebar
  menuToggle.addEventListener("click", () => {
    sidebar.classList.add("active");

    // Push fake state so back button works
    history.pushState({ sidebarOpen: true }, "");
  });

    document.getElementById("editLogoBtn").addEventListener("click", () => {
  window.location.href = "dashboard.html";
  });

  // Handle BACK button
  window.addEventListener("popstate", (event) => {
    if (sidebar.classList.contains("active")) {
      sidebar.classList.remove("active");
    }
  });

  document.addEventListener("click", (e) => {
    if (
      sidebar.classList.contains("active") &&
      !sidebar.contains(e.target) &&
      !menuToggle.contains(e.target)
    ) {
      sidebar.classList.remove("active");
    }
  });



  // === AUTO RESIZE TEXTAREA ===
  chatbox.addEventListener("input", () => {
    chatbox.style.height = "auto";
    chatbox.style.height = chatbox.scrollHeight + "px";
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

 // === LOCAL STORAGE ===
  let conversations = JSON.parse(localStorage.getItem("bravexaChats")) || [];
  let currentChatId = null;

  // === GREETING & USERNAME ===
  const username = localStorage.getItem("username") || "User";
  const hour = new Date().getHours();
  let greeting = "Good evening";
  if (hour < 12) greeting = "Good morning";
  else if (hour < 18) greeting = "Good afternoon";

  const usernameEl = document.querySelector("#username");
  const heroEl = document.querySelector(".hero h1");

  if (usernameEl && heroEl) {
    usernameEl.textContent = username;
    heroEl.textContent = `${greeting}, ${username}!`;
  }

  if (localStorage.getItem("username") && window.location.pathname.includes("index.html")) {
    window.location.href = "dashboard.html";
  }

  // === MESSAGE SEND EVENTS ===
  sendBtn.addEventListener('click', sendMessage);
  chatbox.addEventListener('keydown', function (event) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  });



  let selectedFile = null;

const previewContainer = document.getElementById("previewContainer");

document.querySelectorAll("#imageUpload,#fileUpload").forEach(input => {
  input.addEventListener("change", (event) => {
    const file = event.target.files[0];
    if (!file) return;

    selectedFile = file;
    previewContainer.innerHTML = "";
    previewContainer.style.display = "flex";

    const wrapper = document.createElement("div");
    wrapper.className = "preview-item";

    const type = file.type.split("/")[0];

    let element;

    if (type === "image") {
      element = document.createElement("img");
      element.src = URL.createObjectURL(file);
    } else {
      element = document.createElement("div");
      element.className = "file-preview";
      element.textContent = "📄 " + file.name;
    }

    // ❌ REMOVE BUTTON
    const removeBtn = document.createElement("button");
    removeBtn.textContent = "✖";
    removeBtn.className = "remove-btn";

    removeBtn.onclick = () => {
      selectedFile = null;
      previewContainer.innerHTML = "";
      input.value = ""; // reset input
    };

    wrapper.appendChild(element);
    wrapper.appendChild(removeBtn);
    previewContainer.appendChild(wrapper);
  });
});

  function fileToBase64(file) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.readAsDataURL(file);
  });
}

function handleImageUpload(file) {
  const reader = new FileReader();

  reader.onload = function (e) {
    const base64 = e.target.result;

    saveMessage(currentChatId, "user", {
      type: "image",
      content: base64
    });

    displayImage(base64);
  };

  reader.readAsDataURL(file); // ✅ MUST
}

  // === SEND MESSAGE ===
  async function sendMessage() {
    const userMessage = chatbox.value.trim();
    if (!userMessage && !selectedFile) return;

    if (!currentChatId) {
  startNewConversation(userMessage || "No Content");
}

     const FileForAi = selectedFile;

    if (selectedFile) {
   const base64 = await fileToBase64(selectedFile);
  displayFileMessage(selectedFile);

  saveMessage(
    currentChatId,
    "user",
    "",
    base64, // ✅ correct
    selectedFile.type.startsWith("image") ? "image" :
    "file",
    selectedFile.name
  );
selectedFile = null;
  previewContainer.innerHTML = "";
  previewContainer.style.display = "flex";
}

    if (userMessage) {
  addMessageToChat(userMessage, false);
  saveMessage(currentChatId, "user", userMessage);
}
    chatbox.value = "";
    chatbox.style.height = "auto"; // ✅ reset natural height smoothly
    hero.style.display = "none";
    inputArea.style.position = "fixed";
    chatWindow.style.marginTop = "80px";
    inputArea.style.bottom = "30px";
    previewContainer.style.display = "none";
    inputArea.style.left = "50%";
    inputArea.style.transform = "translateX(-50%)";
    footer.style.marginTop = "0px";
    chatWindow.style.display = "flex";
    voiceBtn.style.marginTop = "10px";
    footer.style.fontSize = "10px";
    uploadDropdown.style.bottom = "45px";
    uploadDropdown.style.left = "20px";
    uploadDropdown.style.marginTop = "0px";
    footer.innerHTML = "⚡ Bravexa AI Verify important details.";

    // AI typing placeholder
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
  const response = await generateAIResponse(userMessage, FileForAi);

  // Clear thinking UI smoothly
  aiMessage.innerHTML = "";

  // Type effect (your function)
  typeText(aiMessage, response);

  saveMessage(currentChatId, "ai", response);
}, 1000);
  }


function displayFileMessage(file) {
  const type = file.type.split("/")[0];

  if (type === "image") {
    const messageDiv = document.createElement("div");
    messageDiv.classList.add("message", "user-image");

    const img = document.createElement("img");
    const imgURL = URL.createObjectURL(file);

    img.src = imgURL;
    img.style.maxWidth = "200px";
    img.style.borderRadius = "10px";
    img.style.cursor = "pointer"; // 👈 important

    // 👉 CLICK EVENT (OPEN FULL IMAGE)
    img.onclick = () => openImageViewer(imgURL);

    messageDiv.appendChild(img);
    chatWindow.appendChild(messageDiv);
    makeMessageVisible(messageDiv);
  } else {
    const messageDiv = document.createElement("div");
    messageDiv.classList.add("message", "user-message");

    const link = document.createElement("a");
    link.href = URL.createObjectURL(file);
    link.download = file.name;
    link.textContent = "📄 " + file.name;

    link.style.color = "inherit";
    link.style.textDecoration = "none";
    link.style.cursor = "pointer";

    messageDiv.appendChild(link);
    chatWindow.appendChild(messageDiv);
    makeMessageVisible(messageDiv);
  }
}

  function openImageViewer(src) {
  let viewer = document.createElement("div");
  viewer.classList.add("image-viewer");

  viewer.innerHTML = `
    <span class="close-btn">✖</span>
    <img src="${src}" class="full-image"/>
  `;

  document.body.appendChild(viewer);

  // Close on click ❌
  viewer.querySelector(".close-btn").onclick = () => {
    viewer.remove();
  };

  // Close on background click
  viewer.onclick = (e) => {
    if (e.target === viewer) viewer.remove();
  };

  document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    document.querySelector(".image-viewer")?.remove();
  }
});
}

  // === START NEW CONVERSATION ===
  function startNewConversation(firstMessage) {
    chatWindow.innerHTML = "";
    const chatId = Date.now();
    const title = firstMessage.length > 25 ? firstMessage.slice(0, 25) + "..." : firstMessage;
    const newChat = { id: chatId, title, messages: [] };
    conversations.unshift(newChat);
    currentChatId = chatId;
    updateHistorySidebar();
    saveToLocal();
  }

  // === ADD MESSAGE TO CHAT ===
  function addMessageToChat(message, isAI = false) {
    const newMessage = document.createElement("div");
    newMessage.classList.add("message", isAI ? "ai-message" : "user-message");
    newMessage.innerHTML = message;
    chatWindow.appendChild(newMessage);
    makeMessageVisible(newMessage);
  }

  // === SAVE MESSAGE ===
 function saveMessage(chatId, sender, text, fileData = null, fileType = "text", fileName = "") {
  const chat = conversations.find(c => c.id === chatId);
  if (!chat) return;

  chat.messages.push({
    sender,
    type: fileType,
    content: fileData,
    name: fileName,   // ✅ STORE NAME HERE
    text: text
  });

  saveToLocal();
}
  // === TOGGLE HISTORY SIDEBAR ===
  if (toggleHistoryBtn && historyList) {
    toggleHistoryBtn.addEventListener("click", () => {
      const isVisible = historyList.style.display === "block";
      historyList.style.display = isVisible ? "none" : "block";
    });
  }

  // === UPDATE HISTORY SIDEBAR ===
  function updateHistorySidebar() {
    if (!historyList) return;
    historyList.innerHTML = "";

    conversations.forEach(chat => {
      const item = document.createElement("div");
      item.className = "history-item";

      const titleSpan = document.createElement("span");
      titleSpan.textContent = chat.title;
      titleSpan.addEventListener("click", () => loadConversation(chat.id));

      const deleteBtn = document.createElement("button");
      deleteBtn.textContent = "🗑️";
      deleteBtn.className = "delete-btn";
      deleteBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        deleteConversation(chat.id);
      });

      item.appendChild(titleSpan);
      item.appendChild(deleteBtn);
      historyList.appendChild(item);
    });
  }

  // === DELETE CONVERSATION ===
  function deleteConversation(chatId) {
    const confirmDelete = confirm("🗑️ Delete this conversation permanently?");
    if (!confirmDelete) return;

    conversations = conversations.filter(c => c.id !== chatId);
    saveToLocal();
    updateHistorySidebar();

    if (currentChatId === chatId) {
      currentChatId = null;
      chatWindow.innerHTML = "";
     window.location.href = "dashboard.html";
    }
  }

  // === LOAD CONVERSATION ===
  function loadConversation(chatId) {
    const chat = conversations.find(c => c.id === chatId);
    if (!chat) return;
    currentChatId = chatId;

    chatWindow.innerHTML = "";
    hero.style.display = "none";
    inputArea.style.position = "fixed";
    chatWindow.style.marginTop = "80px";
    chatbox.style.height = "auto"; // ✅ keeps resize natural
    inputArea.style.bottom = "30px";
    inputArea.style.left = "50%";
    inputArea.style.transform = "translateX(-50%)";
    footer.style.marginTop = "0px";
    chatWindow.style.display = "flex";
    footer.style.fontSize = "10px";
    voiceBtn.style.marginTop = "10px";
    uploadDropdown.style.bottom = "45px";
    uploadDropdown.style.left = "20px";
    uploadDropdown.style.marginTop = "0px";
    footer.innerHTML = "⚡ Bravexa AI Verify important details.";

    chat.messages.forEach(msg => {
  if (msg.type === "image") {
 const messageDiv = document.createElement("div");
messageDiv.classList.add("message", msg.sender === "ai" ? "ai-message" : "user-image");
const img = document.createElement("img");
img.src = msg.content;
img.style.maxWidth = "200px";
img.style.borderRadius = "10px";
 img.style.cursor = "pointer";
 img.onclick = () => openImageViewer(msg.content);
messageDiv.appendChild(img);
chatWindow.appendChild(messageDiv);
makeMessageVisible(messageDiv);

  }
   else if (msg.type === "file") {
         const messageDiv = document.createElement("div");
messageDiv.classList.add("message", msg.sender === "ai" ? "ai-message" : "user-message");
 const link = document.createElement("a");
  link.href = msg.content;
  link.download = msg.name;
  link.textContent = "📄 " + msg.name;

  // Optional styling (so it looks like message, not blue link)
  link.style.color = "inherit";
  link.style.textDecoration = "none";
  link.style.cursor = "pointer";

  messageDiv.appendChild(link);
    chatWindow.appendChild(messageDiv);
    makeMessageVisible(messageDiv);

  } else {
    addMessageToChat(msg.text, msg.sender === "ai");
  }
});
  }

  // === SAVE TO LOCAL STORAGE ===
  function saveToLocal() {
    localStorage.setItem("bravexaChats", JSON.stringify(conversations));
  }

  // === SMOOTH SCROLL ===
  function makeMessageVisible(messageElement) {
    setTimeout(() => {
      messageElement.classList.add("visible");
      window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
    }, 10);
  }


  // === TYPE EFFECT ===
  // === BRAVEXA SMOOTH TYPE EFFECT ===
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


  // === AI RESPONSE GENERATOR ===
  async function generateAIResponse(userMessage, selectedFile) {
  const msg = (userMessage || "").toLowerCase().trim();
  const hasText = msg !== "";
  const hasFile = selectedFile !== null;
  
  let intent = detectIntent(msg);
  let intro = "Ready to help!", body = "", outro = "Let me know if you need changes.";

  // --- 1. FILE & IMAGE HANDLER ---
  if (hasFile) {
    const isImg = selectedFile.type.startsWith("image");
    const hints = isImg 
      ? (hasText ? "I see your image and note—analyzing now." : "Got the image! What should I do with it?")
      : (hasText ? "File received with your instructions. Processing..." : "File ready. I can summarize or convert it.");
    
    intro = hints;
    body = `<h2>${isImg ? '🖼️ Image' : '📄 File'} Insight</h2><p>File: <b>${selectedFile.name}</b></p>`;
  } 
  
  // --- 2. TEXT INTENTS (The "Heavy" Logic made Light) ---
  else {
    switch (intent) {
      case "greeting":
        intro = "Hello! I'm Bravexa, your workspace assistant.";
        body = `<h2>👋 Welcome</h2><p>I can help with <b>docs, code, and reports</b>.</p>`;
        outro = "Try: 'Write a leave letter' or 'Python code'.";
        break;

      case "email":
        intro = "Here is a professional email draft for you.";
        body = `<h2>📧 Official Email</h2>
                <div class="code-block-container">
                  <div class="code-toolbar"><span class="lang-label">📧 mailto</span>
                    <div class="btn-group"><button class="copyBtn">📋 Copy</button><button class="sendBtn">✉️ Send</button></div>
                  </div>
                  <pre class="code-content" contenteditable="true">Subject: [Topic]\n\nDear [Name],\nI hope you're well. I'm writing to discuss [Reason].\n\nBest regards,\n[Your Name]</pre>
                </div>`;
        break;

      case "leave":
        intro = "Leave letter ready. Just fill in your college details.";
        body = `<h2>📄 Leave Letter</h2>
                <div class="code-block-container">
                  <div class="code-toolbar"><span class="lang-label">📧 mailto</span>
                    <div class="btn-group"><button class="copyBtn">📋 Copy</button><button class="sendBtn">✉️ Send</button></div>
                  </div>
                  <pre class="code-content" contenteditable="true">To\nThe Principal,\n[College Name],\n\nSubject: Leave Request\n\nRespected Sir/Madam,\nI request leave from [Start] to [End] due to [Reason].\n\nYours faithfully,\n[Your Name]</pre>
                </div>`;
        break;

      case "resume":
      case "project":
        intro = `I've generated a structured ${intent} template.`;
        body = `<h2>${intent === 'resume' ? '🧾 Resume' : '📘 Project'} Template</h2>
                <div class="code-block-container">
                  <div class="code-toolbar"><span class="lang-label">📄 .docx</span>
                    <div class="btn-group"><button class="copyBtn">📋 Copy</button><button class="saveBtn">💾 Save</button></div>
                  </div>
                  <pre class="code-content" contenteditable="true"><b>${intent === 'resume' ? 'Name:' : 'Title:'}</b> [Input Here]\n<b>Skills/Modules:</b> [Details]\n<b>Education/Tools:</b> [Details]</pre>
                </div>`;
        break;

      case "code":
        let lang = msg.includes("python") ? "python" : "javascript";
        intro = `Here is your ${lang.toUpperCase()} snippet.`;
        body = `<h2>💻 Code</h2><pre class="code-content"><code>${lang === 'python' ? 'print("Hello Bravexa")' : 'console.log("Hello Bravexa");'}</code></pre>`;
        break;

      case "dbms":
      case "os":
        intro = `Quick notes on ${intent.toUpperCase()} for you.`;
        body = `<h2>🧠 Academic Note</h2><p>Focus on ${intent === 'dbms' ? 'Normalization & Joins' : 'CPU Scheduling & Threads'}.</p>`;
        break;

      default:
        intro = "Bravexa is active.";
        body = `<h2>✨ Workspace AI</h2><p>Try "Apply leave", "Draft mail", or "Create Resume".</p>`;
    }
  }

  // --- FINAL DYNAMIC WRAPPER ---
  return `
    <p>${intro}</p>
    <hr>
    ${body}
    <hr>
    <p>${outro}</p>
  `;
}
  // === ENABLE EDIT + REAL ACTIONS ===
  document.addEventListener("click", (e) => {
    const block = e.target.closest(".code-block-container");
    if (!block) return;
    const textElement = block.querySelector(".code-content");
    textElement.setAttribute("contenteditable", "true");

    // --- COPY ---
    if (e.target.classList.contains("copyBtn")) {
      const text = textElement.textContent.trim();
      navigator.clipboard.writeText(text);
      alert("✅ Copied to clipboard!");
    }

    // --- SEND EMAIL ---
    if (e.target.classList.contains("sendBtn")) {
      const body = encodeURIComponent(textElement.textContent.trim());
      const mailto = `mailto:?subject=Bravexa Document&body=${body}`;
      window.location.href = mailto;
    }

    // --- SAVE TXT / DOCX / XLSX / PPTX ---
    if (e.target.classList.contains("saveBtn")) {
      const text = textElement.textContent.trim();

      // detect file type
      const fileType = block.getAttribute("data-type") || "txt";

      let blob, filename;
      switch (fileType) {
        case "word":
          filename = "document.docx";
          blob = new Blob([text], { type: "application/msword" });
          break;
        case "excel":
          filename = "sheet.xlsx";
          blob = new Blob([text], { type: "application/vnd.ms-excel" });
          break;
        case "ppt":
          filename = "presentation.pptx";
          blob = new Blob([text], { type: "application/vnd.ms-powerpoint" });
          break;
        default:
          filename = "document.txt";
          blob = new Blob([text], { type: "text/plain" });
      }

      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = filename;
      link.click();
      URL.revokeObjectURL(link.href);
    }
  });

  // === VOICE BUTTON ===
  document.addEventListener("click", function (e) {
    if (e.target.classList.contains("voiceBtn")) {
      const content = e.target.parentElement.innerText || "No text available";
      speakText(content);
    }
  });

  function speakText(text) {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    utterance.pitch = 1.0;
    utterance.rate = 1.0;
    utterance.volume = 1.0;
    window.speechSynthesis.speak(utterance);
  }

  // === AVATAR MENU ===
  avatarIcon.addEventListener("click", () => {
    dropdownMenu.classList.toggle("active");
  });

  // === UPLOAD DROPDOWN ===
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
  // === SCREENSHOT CAPTURE ===
screenshotBtn.addEventListener("click", async () => {
  try {
    const stream = await navigator.mediaDevices.getDisplayMedia({ video: true });
    const track = stream.getVideoTracks()[0];
    const imageCapture = new ImageCapture(track);
    const blob = await imageCapture.takePhoto();
    track.stop();

    const reader = new FileReader();

    reader.onload = function () {
      const base64 = reader.result;

      displayImage(base64);

      saveMessage(
  currentChatId,
  "user",
  "",
  base64,
  "image",
  "screenshot.png"   // ✅ give default name
);
    };

    reader.readAsDataURL(blob);

  } catch {
    alert("⚠️ Screenshot failed.");
  }
});

  // === RESPONSIVE LAYOUT ===
  function adjustLayoutForViewport() {
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const isLandscape = viewportWidth > viewportHeight;

    if (viewportWidth <= 420) {
      sendBtn.style.right = isLandscape ? "50px" : "20px";
      inputArea.style.width = "95%";
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
  updateHistorySidebar();
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker
        .register("service-worker.js")
        .then(() => console.log("Service Worker Registered"))
        .catch((err) => console.log("SW Error:", err));
    });
  }
});


