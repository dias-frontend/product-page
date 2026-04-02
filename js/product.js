const cart = [];
const cartList = document.querySelector("#cart");
const savedCart = JSON.parse(localStorage.getItem("cart"));

const cartOpen = document.querySelector("#cart-open");
const cartPanel = document.querySelector("#cart-panel");
const cartClose = document.querySelector("#cart-close");

const cartCount = document.querySelector("#cart-count");
const overlay = document.querySelector("#overlay");

const clearCartBtn = document.querySelector("#clear-cart");

const currentUser = localStorage.getItem("currentUser");

const searchInput = document.querySelector("#search");
const categorySelect = document.querySelector("#category");
const priceSelect = document.querySelector("#price");

const userEmail = document.querySelector("#user-email");
const logoutBtn = document.querySelector("#logout");
const loader = document.querySelector("#loader");

const balanceEl = document.querySelector("#balance");

let balance = 5000;

const products = [
  { id: 1, name: "iPhone", price: 900, category: "phone" },
  { id: 2, name: "AirPods", price: 200, category: "audio" },
  { id: 3, name: "Monitor", price: 300, category: "screen" },
  { id: 4, name: "Keyboard", price: 100, category: "accessory" },
];

if (!currentUser) {
  window.location.href = "index.html";
}

userEmail.textContent = "Hello, " + currentUser;

balanceEl.textContent = "Balance: $" + balance;

logoutBtn.addEventListener("click", () => {
  localStorage.removeItem("currentUser");
  window.location.href = "index.html";
});

cartOpen.addEventListener("click", () => {
  cartPanel.classList.toggle("active");
  overlay.classList.toggle("active");
});

cartClose.addEventListener("click", () => {
  cartPanel.classList.remove("active");
  overlay.classList.remove("active");
});

overlay.addEventListener("click", () => {
  cartPanel.classList.remove("active");
  overlay.classList.remove("active");
});

clearCartBtn.addEventListener("click", () => {
  cart.length = 0;
  localStorage.setItem("cart", JSON.stringify(cart));
  renderCart();
});

if (savedCart) {
  cart.push(...savedCart);
}

renderCart();

function showToast(text = "Товар добавлен") {
  const toast = document.querySelector("#toast");
  toast.textContent = text;
  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 2000);
}

function addToCart(name, price) {
  if (balance < price) {
    showToast("Недостаточно средств ❌");
    return;
  }

  const existing = cart.find((item) => item.name === name);

  if (existing) {
    existing.quantity++;
  } else {
    cart.push({ name, price, quantity: 1 });
  }

  balance -= price;
  balanceEl.textContent = "Balance: $" + balance;

  localStorage.setItem("cart", JSON.stringify(cart));
  renderCart();

  showToast("Куплено ✅");
}

function renderProducts(list) {
  const container = document.querySelector("#products");

  loader.style.display = "block";
  container.innerHTML = "";

  setTimeout(() => {
    list.forEach((product) => {
      container.innerHTML += `
        <div class="product">
          <h3>${product.name}</h3>
          <p>${product.price}$</p>
          <button onclick="addToCart('${product.name}', ${product.price})">
            Купить
          </button>
        </div>
      `;
    });

    loader.style.display = "none";
  }, 300);
}

function applyFilters() {
  const searchValue = searchInput.value.toLowerCase();
  const categoryValue = categorySelect.value;
  const priceValue = priceSelect.value;

  let filtered = products;

  filtered = filtered.filter((p) => p.name.toLowerCase().includes(searchValue));

  if (categoryValue !== "all") {
    filtered = filtered.filter((p) => p.category === categoryValue);
  }

  if (priceValue === "low") {
    filtered = filtered.filter((p) => p.price <= 300);
  }

  if (priceValue === "high") {
    filtered = filtered.filter((p) => p.price > 300);
  }

  renderProducts(filtered);
}

searchInput.addEventListener("input", applyFilters);
categorySelect.addEventListener("change", applyFilters);
priceSelect.addEventListener("change", applyFilters);

renderProducts(products);

function renderCart() {
  cartList.innerHTML = "";
  let total = 0;

  cart.forEach((item, index) => {
    total += item.price * item.quantity;

    cartList.innerHTML += `
      <li class="cart-item">
        <div class="cart-info">
          <span>${item.name}</span>
          <span>${item.price}$</span>
          <span>Кол-во: ${item.quantity}</span>
        </div>

        <div>
          <button onclick="increase(${index})">➕</button>
          <button onclick="decrease(${index})">➖</button>
          <button onclick="removeItem(${index})">✖</button>
        </div>
      </li>
    `;
  });

  document.querySelector("#total").textContent = "Сумма: " + total + "$";

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  cartCount.textContent = totalItems;
}

function removeItem(index) {
  cart.splice(index, 1);
  localStorage.setItem("cart", JSON.stringify(cart));
  renderCart();
}

function increase(index) {
  cart[index].quantity++;
  localStorage.setItem("cart", JSON.stringify(cart));
  renderCart();
}

function decrease(index) {
  cart[index].quantity--;

  if (cart[index].quantity <= 0) {
    cart.splice(index, 1);
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  renderCart();
}
