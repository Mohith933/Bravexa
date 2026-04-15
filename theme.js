// theme.js
const currentTheme = localStorage.getItem("theme") || "light";
document.documentElement.setAttribute("data-theme", currentTheme);

const toggleTheme = () => {
  const newTheme =
    document.documentElement.getAttribute("data-theme") === "light"
      ? "dark"
      : "light";
  document.documentElement.setAttribute("data-theme", newTheme);
  localStorage.setItem("theme", newTheme);
};

// Example: Attach to your logo or a toggle button
document.querySelector(".logo").addEventListener("click", toggleTheme);


// Optionally, add a button to toggle themes
document.querySelector('.lang-button').addEventListener('click', toggleTheme);

 function toggleSidebar() {
    const sidebar = document.getElementById("sidebar");
    sidebar.classList.toggle("open");
  }

  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker
        .register("service-worker.js")
        .then(() => console.log("Service Worker Registered"))
        .catch((err) => console.log("SW Error:", err));
    });
  }
