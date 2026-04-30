document.addEventListener("DOMContentLoaded", function () {
  // === ELEMENT REFERENCES ===
  const hero = document.querySelector('.hero');
  const chatWindow = document.querySelector('.chat-window');
  const sendBtn = document.querySelector('.send-btn');
  const chatbox = document.querySelector('.chatbox');
  const inputArea = document.querySelector('.input-box');
  const footer = document.querySelector('.footer');
  const uploadDropdown = document.getElementById("uploadDropdown");
  const plusBtn = document.getElementById("plusBtn");
  const screenshotBtn = document.getElementById("screenshotBtn");
  const historyList = document.getElementById("historyList");
  const toggleHistoryBtn = document.getElementById("toggleHistory");
  const menuToggle = document.getElementById("menuToggle");
  const sidebar = document.getElementById("sidebar");
  const closeSidebarBtn = document.getElementById("closeSidebarBtn");

  // Open sidebar
  menuToggle.addEventListener("click", () => {
    sidebar.classList.add("active");
  });

  document.getElementById("editLogoBtn").addEventListener("click", () => {
  window.location.href = "dashboard.html";
  });

closeSidebarBtn.addEventListener("click", () => {
  sidebar.classList.remove("active");
});

function fillInput(text) {
    const input = document.getElementById("userinput");
    input.value = text;
}

document.getElementById("codeBtn").addEventListener("click", () => {
    fillInput("Fix my code error");
   sendMessage(); 
});

document.getElementById("websiteBtn").addEventListener("click", () => {
    fillInput("Build a website");
   sendMessage(); 
});

document.getElementById("writeBtn").addEventListener("click", () => {
    fillInput("Write a message");
   sendMessage(); 
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
   console.log("Speech Recognition not supported");
  }

 // === LOCAL STORAGE ===
  let conversations = JSON.parse(localStorage.getItem("bravexaChats")) || [];
  let currentChatId = null;
  let activeChatId = null; // ✅ ADD THIS

  // === GREETING & USERNAME ===
const heroEl = document.querySelector(".hero h1");
if (heroEl) {
  heroEl.textContent = "What do you want to create today?";
}
  const sub = document.createElement("p");
sub.className = "subtext";
sub.innerText = "No pressure — just begin";

heroEl.parentNode.appendChild(sub);







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
    inputArea.style.position = "fixed";
    chatWindow.style.marginTop = "50px";
    hero.style.transition = "opacity 0.3s ease";
    hero.style.opacity = "0";
    inputArea.style.bottom = "30px";
    previewContainer.style.display = "none";
    inputArea.style.left = "50%";
    inputArea.style.transform = "translateX(-50%)";
    footer.style.marginTop = "0px";
    chatWindow.style.display = "flex";
    voiceBtn.style.marginTop = "10px";
    footer.style.fontSize = "10px";
    uploadDropdown.style.bottom = "35px";
    uploadDropdown.style.left = "0px";
    uploadDropdown.style.marginTop = "0px";
    footer.innerHTML = "Fast • No login • Runs locally";

    setTimeout(() => {
  hero.style.display = "none";
}, 300);

    // AI typing placeholder
  // AI typing placeholder
  const aiMessage = document.createElement("div");
  aiMessage.classList.add("message", "ai-message", "loading"); // 'loading' class for special styling

  aiMessage.innerHTML = `
    <div class="gemini-loader">
      <div class="ai-icon-wrapper">
         <svg viewBox="0 0 24 24" class="ai-pulse-icon" fill="none" xmlns="http://www.w3.org/2000/svg">
  <!-- Hexagon -->
  <path 
    d="M12 2L20 7V17L12 22L4 17V7L12 2Z" 
    stroke="white" 
    stroke-width="1.5" 
    stroke-linejoin="round"
  />
  
  <!-- Lightning -->
  <path 
    d="M13 6L8 13H12L11 18L16 11H12L13 6Z" 
    fill="white"
  />
</svg>
      </div>
      <div class="shimmer-container">
        <div class="shimmer-line"></div>
        <div class="shimmer-line short"></div>
      </div>
    </div>
  `;
  

chatWindow.appendChild(aiMessage);
makeMessageVisible(aiMessage);

  setTimeout(async () => {
  const response = await generateAIResponse(userMessage, FileForAi);

  // Clear thinking UI smoothly
    aiMessage.classList.remove("loading");
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
      
        if (chat.id === currentChatId) {
      item.classList.add("active"); // ✅ single source of truth
    }


      const titleSpan = document.createElement("span");
      titleSpan.textContent = chat.title;
      titleSpan.addEventListener("click", () => {
  activeChatId = chat.id;   // ✅ store active
  loadConversation(chat.id);
  updateHistorySidebar();   // ✅ re-render
});

const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "✕";
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
    const confirmDelete = confirm("✕ Delete this conversation permanently?");
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
    chatWindow.style.marginTop = "50px";
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
    footer.innerHTML = "Fast • No login • Runs locally";
    activeChatId = chatId;
updateHistorySidebar();

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
 function makeMessageVisible(el) {
  requestAnimationFrame(() => {
    el.classList.add("visible");
    window.scrollTo({
      top: document.body.scrollHeight,
      behavior: "smooth"
    });
  });
}


  // === TYPE EFFECT ===
  // === BRAVEXA SMOOTH TYPE EFFECT ===
function typeText(element, htmlContent) {
  let i = 0;
  const speed = 1.2; // smooth speed

  function type() {
    i += speed * 3;

    element.innerHTML = htmlContent.slice(0, i);

    if (i < htmlContent.length) {
      requestAnimationFrame(type);
    } else {
      element.innerHTML = htmlContent;
    }
  }

  requestAnimationFrame(type);
}

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

async function generateAIResponse(userMessage, selectedFile) {  
  const msg = (userMessage || "").toLowerCase().trim();  
  const hasText = msg !== "";  
  const hasFile = selectedFile !== null;  
  
  // Intent keywords
  const intents = {  
    code: ["code", "python", "javascript", "program"],  
    website: ["website", "html", "css", "web", "page", "frontend"],  
    fix: ["fix", "debug", "error", "solve", "bug", "issue"],  
    write: ["write", "essay", "blog", "story", "content", "draft"]  
  };  
  
  function getBestIntent(m) {  
    let bestMatch = "default";  
    let maxScore = 0;  
    for (const [intentName, keywords] of Object.entries(intents)) {  
      let score = 0;  
      keywords.forEach(k => { if (m.includes(k)) score += k.length; });  
      if (score > maxScore) { maxScore = score; bestMatch = intentName; }  
    }  
    return bestMatch;  
  }  
  
  let intent = getBestIntent(msg);  

  let intro = "", body = "", outro = "";

  // ---------------- VARIATIONS ----------------

  const codeIntros = [
    "Here’s a clean starter snippet.",
    "Let’s begin with a simple example.",
    "Quick code sample ready below.",
    "Starting point generated for you.",
    "Minimal working code prepared."
  ];

  const codeOutros = [
    "You can build on top of this.",
    "Try modifying this to fit your use case.",
    "Want explanation or optimization next?",
    "We can extend this further if needed.",
    "Tell me if you want another language."
  ];

  const websiteIntros = [
    "Basic website structure ready.",
    "Here’s a simple web layout to start.",
    "Frontend boilerplate generated.",
    "Clean HTML setup prepared.",
    "Starting your web project here."
  ];

  const websiteOutros = [
    "Save this as index.html and open it.",
    "You can style this further.",
    "Want responsive version next?",
    "We can add JS interactions too.",
    "Let’s enhance this step by step."
  ];

  const fixIntros = [
    "Let’s debug this together.",
    "Looks like something needs fixing.",
    "Debugging mode active.",
    "Let’s identify the issue.",
    "We’ll solve this step by step."
  ];

  const fixOutros = [
    "Paste your code and I’ll analyze it.",
    "Share the error message next.",
    "We’ll fix it quickly.",
    "I can optimize it too if needed.",
    "Let’s improve it once fixed."
  ];

  const writeIntros = [
    "Let’s start drafting.",
    "Here’s a writing structure for you.",
    "Creative mode ready.",
    "Start expressing your idea here.",
    "Draft template prepared."
  ];

  const writeOutros = [
    "You can reshape this into any format.",
    "Keep writing and refine later.",
    "Want tone change? I can help.",
    "We can improve flow next.",
    "Make it yours."
  ];

  const defaultIntros = [
    "I can help you build, fix, or write.",
    "What would you like to do today?",
    "Let’s get something done.",
    "Ready when you are.",
    "Start typing your task."
  ];

  const defaultOutros = [
    "Try one of the ideas above.",
    "Start simple, we’ll expand.",
    "I’ll guide you step by step.",
    "You’re in control here.",
    "Just type and begin."
  ];

  // ---------------- FILE HANDLING ----------------

  if (hasFile) {  
    const isImg = selectedFile.type.startsWith("image");  

    const fileIntros = [
      "Got your file.",
      "File received.",
      "Processing your upload.",
      "Let me check this file.",
      "File loaded successfully."
    ];

    const fileOutros = [
      "Tell me what you want to do with it.",
      "I can summarize or analyze it.",
      "Give instructions next.",
      "We can extract insights from this.",
      "What should I do with this file?"
    ];

    intro = pick(fileIntros);

    body = `<h2>${isImg ? '🖼️ Image' : '📄 File'} Insight</h2>  
            <p><b>${selectedFile.name}</b></p>  
            <p class="note">File ready for processing</p>`;  

    outro = pick(fileOutros);
  }  

  // ---------------- TEXT INTENTS ----------------
  else {  
    switch (intent) {  

      case "code":  
        let lang = msg.includes("python") ? "python" : "javascript";  

        intro = pick(codeIntros);

        body = `<h2>💻 Code</h2>
        <div class="code-block-container">
        <pre class="code-content"><code>${
          lang === 'python'
            ? 'print("Hello Bravexa")'
            : 'console.log("Hello Bravexa");'
        }</code></pre></div>`;

        outro = pick(codeOutros);
        break;  

      case "website":  
        intro = pick(websiteIntros);

        body = `<h2>🌐 Web Development</h2>
        <div class="code-block-container">
        <pre class="code-content" contenteditable="true">&lt;!DOCTYPE html&gt;
&lt;html&gt;
&lt;body&gt;
  &lt;h1&gt;Welcome&lt;/h1&gt;
&lt;/body&gt;
&lt;/html&gt;</pre></div>`;

        outro = pick(websiteOutros);
        break;  

      case "fix":  
        intro = pick(fixIntros);

        body = `<h2>💻 Fix & Debug</h2>
        <p>I can help find issues in your code.</p>`;

        outro = pick(fixOutros);
        break;  

      case "write":  
        intro = pick(writeIntros);

        body = `<h2>✍️ Writing</h2>
        <div class="code-block-container">
        <pre class="code-content" contenteditable="true">
Title: 
Introduction:
Main Points:
Conclusion:
</pre></div>`;

        outro = pick(writeOutros);
        break;  

      default:  
        intro = pick(defaultIntros);

        body = `<h2>✨ Workspace</h2>
        <ul>
          <li>Create website</li>
          <li>Fix code</li>
          <li>Write content</li>
        </ul>`;

        outro = pick(defaultOutros);
    }  
  }  

  // ---------------- FINAL OUTPUT ----------------

  return `  
    <div class="bravexa-intro">${intro}</div>  
    <hr class="bravexa-divider">  
    <div class="bravexa-body">${body}</div>  
    <hr class="bravexa-divider">  
    <div class="bravexa-outro">${outro}</div>  
  `;  
}


  // === VOICE BUTTON ===
  document.addEventListener("click", function (e) {
    if (e.target.classList.contains("voiceBtn")) {
      const content = e.target.parentElement.innerText || "No text available";
      speakText(content);
    }
  });

document.addEventListener("click", (e) => {
  const block = e.target.closest(".code-block-container");
  if (!block) return;
  const textElement = block.querySelector(".code-content");

  // --- COPY LOGIC ---
  if (e.target.classList.contains("copyBtn")) {
    const text = textElement.textContent.trim();
    navigator.clipboard.writeText(text).then(() => {
      // Small feedback instead of a heavy alert
      e.target.innerText = "✅ Done";
      setTimeout(() => e.target.innerText = "📋 Copy", 2000);
    });
  }

  // --- SEND (MAILTO) LOGIC ---
  if (e.target.classList.contains("sendBtn")) {
    const fullText = textElement.innerText.trim();
    
    // 1. Try to extract Subject line if it exists (e.g., "Subject: Leave Request")
    let subject = "Bravexa AI - Draft";
    const subjectMatch = fullText.match(/Subject:\s*(.*)/i);
    if (subjectMatch) {
      subject = subjectMatch[1];
    }

    // 2. Encode the body text for URL safety
    const encodedBody = encodeURIComponent(fullText);
    const encodedSubject = encodeURIComponent(subject);

    // 3. Open the Mail client
    // Note: You can leave 'to' blank so the user fills it in manually
    window.location.href = `mailto:?subject=${encodedSubject}&body=${encodedBody}`;
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
