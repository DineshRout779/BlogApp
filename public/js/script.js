const menu = document.querySelector(".menu");
const sideBar = document.querySelector(".lg-hide");
const closeAlert = document.querySelector(".close-alert");
const alert = document.querySelector(".alert");
const preView = document.querySelectorAll(".blog-body p");
const addBtn = document.querySelector(".add-post");
const addPost = document.querySelector(".add");
const maxLen = 200;

// shorten the blog preview text
for (let i = 0; i < preView.length; i++) {
  preView[i].textContent = preView[i].textContent.slice(0, maxLen) + "...";
}

menu.addEventListener("click", () => {
  sideBar.classList.toggle("sm-show");
});

closeAlert.addEventListener("click", () => {
  alert.style.display = "none";
});

addBtn.addEventListener("click", () => {
  console.log("hello");
  // addPost.classList.toggle("open");
});
