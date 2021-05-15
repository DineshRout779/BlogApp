const closeAlert = document.querySelector(".close-alert");
const alert = document.querySelector(".alert");
const preView = document.querySelectorAll(".blog-body p");
const maxLen = 200;

// shorten the blog preview text
for (let i = 0; i < preView.length; i++) {
  preView[i].textContent = preView[i].textContent.slice(0, maxLen) + "...";
}

closeAlert.addEventListener("click", () => (alert.style.display = "none"));
