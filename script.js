const cart = [];
const cartLauncher = document.querySelector(".cart-launcher");
const cartPanel = document.querySelector(".cart-panel");
const cartItems = document.querySelector(".cart-items");
const cartEmpty = document.querySelector(".cart-empty");
const cartCount = document.querySelector(".cart-count");
const cartTotal = document.querySelector(".cart-total");
const checkoutButton = document.querySelector(".checkout-button");

function openCart() {
  document.body.classList.add("cart-open");
  cartLauncher.setAttribute("aria-expanded", "true");
  cartPanel.setAttribute("aria-hidden", "false");
}

function closeCart() {
  document.body.classList.remove("cart-open");
  cartLauncher.setAttribute("aria-expanded", "false");
  cartPanel.setAttribute("aria-hidden", "true");
}

function renderCart() {
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  cartCount.textContent = totalItems;
  cartTotal.textContent = `₹${totalPrice.toLocaleString("en-IN")}`;
  cartEmpty.hidden = cart.length > 0;
  checkoutButton.disabled = cart.length === 0;
  cartItems.innerHTML = cart.map((item) => `
    <article class="cart-item">
      <div class="cart-item-image" style="background-image: url('${item.image}')"></div>
      <div class="cart-item-info"><h3>${item.name}</h3><span>${item.category}</span><strong>₹${item.price.toLocaleString("en-IN")}</strong></div>
      <div class="quantity-controls"><button type="button" data-action="decrease" data-id="${item.id}" aria-label="Decrease ${item.name}">−</button><span>${item.quantity}</span><button type="button" data-action="increase" data-id="${item.id}" aria-label="Increase ${item.name}">+</button></div>
    </article>
  `).join("");
}

function addToCart(product) {
  const existing = cart.find((item) => item.id === product.id);
  if (existing) existing.quantity += 1;
  else cart.push({ ...product, quantity: 1 });
  renderCart();
  openCart();
}

cartLauncher.addEventListener("click", openCart);
document.querySelectorAll("[data-cart-close]").forEach((element) => element.addEventListener("click", closeCart));
cartItems.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-action]");
  if (!button) return;
  const item = cart.find((entry) => entry.id === button.dataset.id);
  if (!item) return;
  if (button.dataset.action === "increase") item.quantity += 1;
  if (button.dataset.action === "decrease") item.quantity -= 1;
  if (item.quantity <= 0) cart.splice(cart.indexOf(item), 1);
  renderCart();
});

document.addEventListener("click", (event) => {
  const button = event.target.closest("[data-add-to-cart]");
  if (!button) return;
  addToCart({
    id: button.dataset.id,
    name: button.dataset.name,
    category: button.dataset.category,
    price: Number(button.dataset.price),
    image: button.dataset.image,
  });
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeCart();
});

renderCart();