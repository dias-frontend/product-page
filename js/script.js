const formOpenBtn = document.querySelector("#form-open"),
  home = document.querySelector(".home"),
  formContainer = document.querySelector(".form_container"),
  formCloseBtn = document.querySelector(".form_close"),
  signupSwitch = document.querySelector("#signup"),
  loginSwitch = document.querySelector("#login"),
  signupBtn = document.querySelector("#signup-btn"),
  loginSubmitBtn = document.querySelector("#login-btn"),
  pwShowHide = document.querySelectorAll(".pw_hide");

function showAlert(message) {
  const alertBox = document.querySelector("#custom-alert");
  const alertText = document.querySelector("#alert-text");

  alertText.textContent = message;
  alertBox.classList.add("show");

  setTimeout(() => {
    alertBox.classList.remove("show");
  }, 3000);
}

formOpenBtn.addEventListener("click", () => home.classList.add("show"));

formCloseBtn.addEventListener("click", () => home.classList.remove("show"));

pwShowHide.forEach((icon) => {
  icon.addEventListener("click", () => {
    let input = icon.parentElement.querySelector("input");

    if (input.type === "password") {
      input.type = "text";
      icon.classList.replace("uil-eye-slash", "uil-eye");
    } else {
      input.type = "password";
      icon.classList.replace("uil-eye", "uil-eye-slash");
    }
  });
});

signupSwitch.addEventListener("click", (e) => {
  e.preventDefault();
  formContainer.classList.add("active");
});

loginSwitch.addEventListener("click", (e) => {
  e.preventDefault();
  formContainer.classList.remove("active");
});

signupBtn.addEventListener("click", (e) => {
  e.preventDefault();

  const email = document.querySelector("#signup-email").value;
  const password = document.querySelector("#signup-password").value;
  const confirmPassword = document.querySelector("#signup-confirm").value;

  if (password !== confirmPassword) {
    showAlert("Пароли не совпадают");
    return;
  }

  let users = JSON.parse(localStorage.getItem("users"));

  if (!users) {
    users = [];
  }

  if (users.some((user) => user.email === email)) {
    showAlert("Пользователь уже существует");
    return;
  }

  const user = {
    email: email,
    password: password,
  };

  users.push(user);

  localStorage.setItem("users", JSON.stringify(users));

  showAlert("Вы успешно зарегистрированы");

  formContainer.classList.remove("active");
});

loginSubmitBtn.addEventListener("click", (e) => {
  e.preventDefault();

  const email = document.querySelector("#login-email").value;
  const password = document.querySelector("#login-password").value;

  const users = JSON.parse(localStorage.getItem("users"));

  if (!users) {
    showAlert("Пользователь не найден");
    return;
  }

  const user = users.find((u) => u.email === email && u.password === password);

  if (user) {
    localStorage.setItem("currentUser", email);
    window.location.href = "product.html";
  } else {
    showAlert("Неверный логин или пароль");
  }
});
