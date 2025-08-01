// --- Product Data (with image paths) ---
const products = [
  { id: 1, name: 'Wireless Headphones', price: 29.99, image: 'images/wireless-headphones.jpg' },
  { id: 2, name: 'Organic Fruit Basket', price: 15.99, image: 'images/organic-fruit-basket.png' },
  { id: 3, name: 'Smart LED Bulb', price: 9.49, image: 'images/smart-led-bulb.jpg' },
  { id: 4, name: 'Running Shoes', price: 42.5, image: 'images/running-shoes.webp' },
];

// --- Cart state ---
let cart = [];

// --- DOM Elements ---
const productsContainer = document.querySelector('.products');
const cartSidebar = document.getElementById('cart-sidebar');
const cartToggleBtn = document.getElementById('cart-toggle');
const cartCloseBtn = document.getElementById('cart-close');
const cartItemsContainer = document.getElementById('cart-items');
const cartTotalElem = document.getElementById('cart-total');
const cartCountElem = document.getElementById('cart-count');
const checkoutBtn = document.getElementById('checkout-btn');

const authModal = document.getElementById('auth-modal');
const authCloseBtn = document.getElementById('auth-close');
const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
const showRegisterLink = document.getElementById('show-register');
const showLoginLink = document.getElementById('show-login');

// --- Render Products ---
function renderProducts() {
  productsContainer.innerHTML = '';
  products.forEach(product => {
    const card = document.createElement('div');
    card.className = 'product-card';
    
    card.innerHTML = `
      <img src="${product.image}" alt="${product.name}" loading="lazy" />
      <h2>${product.name}</h2>
      <p class="price">$${product.price.toFixed(2)}</p>
      <button class="btn-add" data-id="${product.id}">Add to Cart</button>
    `;
    productsContainer.appendChild(card);
  });
}

// --- Cart Operations ---
function addToCart(id) {
  const product = products.find(p => p.id === id);
  if (!product) return;

  const existingItem = cart.find(item => item.id === id);
  if (existingItem) {
    existingItem.qty += 1;
  } else {
    cart.push({ ...product, qty: 1 });
  }
  updateCartDisplay();
  alert(`Added "${product.name}" to cart!`);
}

function updateCartDisplay() {
  const totalItems = cart.reduce((acc, item) => acc + item.qty, 0);
  cartCountElem.textContent = totalItems;
  checkoutBtn.disabled = totalItems === 0;

  cartItemsContainer.innerHTML = '';

  if (totalItems === 0) {
    cartItemsContainer.innerHTML = '<p>Your cart is empty.</p>';
    cartTotalElem.textContent = '0.00';
    return;
  }

  cart.forEach(item => {
    const itemElem = document.createElement('div');
    itemElem.className = 'cart-item';
    itemElem.innerHTML = `
      <div class="cart-item-name">${item.name}</div>
      <div class="cart-controls">
        <button class="btn-decrease" data-id="${item.id}" aria-label="Decrease quantity">−</button>
        <div class="cart-qty">${item.qty}</div>
        <button class="btn-increase" data-id="${item.id}" aria-label="Increase quantity">+</button>
        <button class="btn-remove" data-id="${item.id}" title="Remove item">×</button>
      </div>
    `;
    cartItemsContainer.appendChild(itemElem);
  });

  const totalPrice = cart.reduce((acc, item) => acc + item.price * item.qty, 0);
  cartTotalElem.textContent = totalPrice.toFixed(2);
}

// --- Cart Sidebar Controls ---
function openCart() {
  cartSidebar.classList.add('open');
}

function closeCart() {
  cartSidebar.classList.remove('open');
}

// --- Event Listeners ---

// Add to cart buttons
productsContainer.addEventListener('click', e => {
  if (e.target.classList.contains('btn-add')) {
    const id = Number(e.target.getAttribute('data-id'));
    addToCart(id);
  }
});

// Cart controls (increase, decrease, remove)
cartItemsContainer.addEventListener('click', e => {
  const id = Number(e.target.getAttribute('data-id'));
  if (!id) return;

  const index = cart.findIndex(item => item.id === id);
  if (index === -1) return;

  if (e.target.classList.contains('btn-increase')) {
    cart[index].qty += 1;
  } else if (e.target.classList.contains('btn-decrease')) {
    if (cart[index].qty > 1) {
      cart[index].qty -= 1;
    } else {
      cart.splice(index, 1);
    }
  } else if (e.target.classList.contains('btn-remove')) {
    cart.splice(index, 1);
  }
  updateCartDisplay();
});

// Cart open/close
cartToggleBtn.addEventListener('click', openCart);
cartCloseBtn.addEventListener('click', closeCart);

// Close cart clicking outside
document.addEventListener('click', e => {
  if (
    !cartSidebar.contains(e.target) &&
    e.target !== cartToggleBtn &&
    !cartToggleBtn.contains(e.target)
  ) {
    closeCart();
  }
});

// --- Authentication Modal Controls ---
function openAuthModal() {
  authModal.classList.remove('hidden');
  showLoginForm();
}

function closeAuthModal() {
  authModal.classList.add('hidden');
}

authCloseBtn.addEventListener('click', closeAuthModal);

// Switch forms
function showRegisterForm() {
  loginForm.classList.remove('active');
  registerForm.classList.add('active');
  loginForm.classList.add('hidden');
  registerForm.classList.remove('hidden');
  document.getElementById('auth-title').textContent = 'Register at Vendel';
}

function showLoginForm() {
  registerForm.classList.remove('active');
  loginForm.classList.add('active');
  registerForm.classList.add('hidden');
  loginForm.classList.remove('hidden');
  document.getElementById('auth-title').textContent = 'Login to Vendel';
}

showRegisterLink.addEventListener('click', e => {
  e.preventDefault();
  showRegisterForm();
});

showLoginLink.addEventListener('click', e => {
  e.preventDefault();
  showLoginForm();
});

// Open auth modal when clicking nav login link
document.querySelectorAll('nav a').forEach(anchor => {
  if (anchor.textContent.toLowerCase() === 'login') {
    anchor.addEventListener('click', e => {
      e.preventDefault();
      openAuthModal();
    });
  }
});

// Handle login form submission (demo only)
loginForm.addEventListener('submit', e => {
  e.preventDefault();
  const email = loginForm.email.value.trim();
  const password = loginForm.password.value.trim();

  if (email && password.length >= 6) {
    alert('Login successful! (Demo)');
    closeAuthModal();
  } else {
    alert('Please enter a valid email and password (6+ characters).');
  }
});

// Handle register form submission (demo only)
registerForm.addEventListener('submit', e => {
  e.preventDefault();
  const name = registerForm.name.value.trim();
  const email = registerForm.email.value.trim();
  const password = registerForm.password.value.trim();

  if (name.length >= 3 && email && password.length >= 6) {
    alert('Registration successful! (Demo)');
    closeAuthModal();
  } else {
    alert('Please fill all fields correctly.');
  }
});

// Initialize product display and cart count on page load
renderProducts();
updateCartDisplay();
