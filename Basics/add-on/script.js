const themeButton = document.querySelector(".theme-button");
const container = document.querySelector(".container");
const downloadIos = document.querySelector(".download-ios");
const downloadAndriod = document.querySelector(".download-android");

// Load saved theme on page load
const savedTheme = localStorage.getItem("theme");
if (savedTheme === "dark") {
  container.classList.add("dark");
  downloadIos.classList.add("dark-mode-text");
  downloadAndriod.classList.add("dark-mode-text");
  themeButton.classList.add("light");
  themeButton.classList.remove("theme-button");
  themeButton.innerText = "Light Mode";
}

function changeTheme() {
  const isDarkMode = container.classList.toggle("dark");

  if (isDarkMode) {
    // Apply dark mode styles
    downloadIos.classList.add("dark-mode-text");
    downloadAndriod.classList.add("dark-mode-text");
    themeButton.classList.add("light");
    themeButton.classList.remove("theme-button");
    themeButton.innerText = "Light Mode";

    // Save preference
    localStorage.setItem("theme", "dark");
  } else {
    // Apply light mode styles
    downloadIos.classList.remove("dark-mode-text");
    downloadAndriod.classList.remove("dark-mode-text");
    themeButton.classList.remove("light");
    themeButton.classList.add("theme-button");
    themeButton.innerText = "Dark Mode";

    // Save preference
    localStorage.setItem("theme", "light");
  }
}

themeButton.addEventListener("click", changeTheme);
