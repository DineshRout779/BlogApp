const closeAlert = document.querySelector(".close-alert");
const alert = document.querySelector(".alert");

closeAlert.addEventListener("click", () => (alert.style.display = "none"));
