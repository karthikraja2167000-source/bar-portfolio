
const products = [
  {
    id: 1,
    name: "Crimson Reserve",
    category: "Red",
    price: 1499,
    tag: "SIGNATURE",
    description: "A rich, full-bodied red wine.",
    image: "photo-1510812431401-41d2bd2722f3"
  },
  {
    id: 2,
    name: "Golden Chardonnay",
    category: "White",
    price: 1299,
    tag: "WHITE WINE",
    description: "A smooth white wine with fruity notes.",
    image: "photo-1516594915697-87eb3b1c14ea"
  },
  {
    id: 3,
    name: "Rose Garden",
    category: "Rosé",
    price: 1199,
    tag: "ROSÉ",
    description: "A delicate rosé with a fresh character.",
    image: "photo-1514362545857-3bc16c4c7d1b"
  },
  {
    id: 4,
    name: "Midnight Merlot",
    category: "Red",
    price: 1799,
    tag: "RED WINE",
    description: "A deep, smooth wine with a rich finish.",
    image: "photo-1516594915697-87eb3b1c14ea"
  },
  {
    id: 5,
    name: "Silver Spark",
    category: "Sparkling",
    price: 1999,
    tag: "SPARKLING",
    description: "An elegant sparkling wine selection.",
    image: "photo-1513558161293-cdaf765edfd7"
  },
  {
    id: 6,
    name: "Velvet Cabernet",
    category: "Red",
    price: 2199,
    tag: "PREMIUM",
    description: "A bold wine with a lasting finish.",
    image: "photo-1510812431401-41d2bd2722f3"
  }
];

// These are sample products and demonstration prices.
let selectedCategory = "All";
let cart = [];

const productGrid = document.getElementById("productGrid");
const searchInput = document.getElementById("searchInput");
const emptyMessage = document.getElementById("emptyMessage");

function formatPrice(price) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format(price);
}

function getImageUrl(imageId, width = 700) {
  return `https://images.unsplash.com/${imageId}?auto=format&fit=crop&w=${width}&q=80`;
}

// Display products according to category and search.
function renderProducts() {
  const searchTerm = searchInput.value.trim().toLowerCase();

  const filteredProducts = products.filter((product) => {
    const matchesCategory =
      selectedCategory === "All" ||
      product.category === selectedCategory;

    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm) ||
      product.category.toLowerCase().includes(searchTerm) ||
      product.description.toLowerCase().includes(searchTerm);

    return matchesCategory && matchesSearch;
  });

  productGrid.innerHTML = filteredProducts.map((product) => `
    <article class="product-card">
      <div class="product-image">
        <img
          src="${getImageUrl(product.image)}"
          alt="${product.name}"
          loading="lazy"
        />
        <span class="product-tag">${product.tag}</span>
      </div>

      <div class="product-info">
        <p class="product-category">${product.category} Wine</p>
        <h3>${product.name}</h3>
        <p class="product-description">${product.description}</p>

        <div class="product-bottom">
          <span class="product-price">${formatPrice(product.price)}</span>
          <button
            class="add-button"
            data-add="${product.id}"
            aria-label="Add ${product.name} to demo bag"
          >
            + Add to Bag
          </button>
        </div>
      </div>
    </article>
  `).join("");

  emptyMessage.hidden = filteredProducts.length > 0;
}

// Category filter buttons.
document.querySelectorAll(".filter").forEach((button) => {
  button.addEventListener("click", () => {
    selectedCategory = button.dataset.category;

    document.querySelectorAll(".filter").forEach((filter) => {
      filter.classList.toggle("active", filter === button);
    });

    renderProducts();
  });
});

// Search products as the user types.
searchInput.addEventListener("input", renderProducts);

// Demo shopping bag.
function addToCart(productId) {
  const existingItem = cart.find((item) => item.id === productId);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ id: productId, quantity: 1 });
  }

  renderCart();
  document.getElementById("checkoutMessage").textContent = "";
}

function updateQuantity(productId, change) {
  const item = cart.find((entry) => entry.id === productId);

  if (!item) return;

  item.quantity += change;

  if (item.quantity <= 0) {
    cart = cart.filter((entry) => entry.id !== productId);
  }

  renderCart();
}

function removeFromCart(productId) {
  cart = cart.filter((item) => item.id !== productId);
  renderCart();
}

function renderCart() {
  const cartItems = document.getElementById("cartItems");

  const totalQuantity = cart.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const totalPrice = cart.reduce((total, item) => {
    const product = products.find((entry) => entry.id === item.id);
    return total + product.price * item.quantity;
  }, 0);

  document.getElementById("cartCount").textContent = totalQuantity;
  document.getElementById("cartHeadingCount").textContent =
    `(${totalQuantity})`;

  document.getElementById("cartTotal").textContent =
    formatPrice(totalPrice);

  if (cart.length === 0) {
    cartItems.innerHTML = `
      <p class="cart-empty">
        Your bag is empty.<br />
        Explore the collection to get started.
      </p>
    `;
    return;
  }

  cartItems.innerHTML = cart.map((item) => {
    const product = products.find((entry) => entry.id === item.id);

    return `
      <article class="cart-item">
        <img src="${getImageUrl(product.image, 200)}" alt="" />

        <div class="cart-item-details">
          <h3>${product.name}</h3>
          <p>${formatPrice(product.price)}</p>

          <div class="quantity-controls">
            <button data-minus="${product.id}" aria-label="Decrease quantity">−</button>
            <span>${item.quantity}</span>
            <button data-plus="${product.id}" aria-label="Increase quantity">+</button>
          </div>

          <button class="remove-button" data-remove="${product.id}">
            Remove
          </button>
        </div>
      </article>
    `;
  }).join("");
}

// Handle product and cart button clicks.
document.addEventListener("click", (event) => {
  const addButton = event.target.closest("[data-add]");
  const plusButton = event.target.closest("[data-plus]");
  const minusButton = event.target.closest("[data-minus]");
  const removeButton = event.target.closest("[data-remove]");

  if (addButton) {
    addToCart(Number(addButton.dataset.add));
  }

  if (plusButton) {
    updateQuantity(Number(plusButton.dataset.plus), 1);
  }

  if (minusButton) {
    updateQuantity(Number(minusButton.dataset.minus), -1);
  }

  if (removeButton) {
    removeFromCart(Number(removeButton.dataset.remove));
  }
});

// Open and close the shopping bag.
const cartOverlay = document.getElementById("cartOverlay");

function openCart() {
  cartOverlay.hidden = false;
  document.body.classList.add("cart-open");
  document.getElementById("closeCart").focus();
}

function closeCart() {
  cartOverlay.hidden = true;
  document.body.classList.remove("cart-open");
  document.getElementById("openCart").focus();
}

document.getElementById("openCart").addEventListener("click", openCart);
document.getElementById("closeCart").addEventListener("click", closeCart);
document.getElementById("closeCartBackdrop").addEventListener("click", closeCart);

// Mobile navigation.
const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");

menuToggle.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
});

navLinks.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
  });
});

// Demonstration-only checkout notice.
document.getElementById("demoCheckout").addEventListener("click", () => {
  document.getElementById("checkoutMessage").textContent =
    "Demo only: no order or payment was placed. No purchase is available through this website.";
});

// Demonstration newsletter form. It does not send or save email addresses.
document.getElementById("newsletterForm").addEventListener("submit", (event) => {
  event.preventDefault();

  document.getElementById("newsletterMessage").textContent =
    "Thanks for your interest! This demo form does not submit or store your email.";

  event.target.reset();
});

// Age notice. This is a front-end acknowledgement, not legal age verification.
const ageOverlay = document.getElementById("ageOverlay");

function closeAgeNotice() {
  ageOverlay.hidden = true;
  document.body.classList.remove("age-open");
}

document.getElementById("ageConfirm").addEventListener("click", () => {
  closeAgeNotice();
  document.getElementById("collection").scrollIntoView({
    behavior: "smooth"
  });
});

document.getElementById("ageExit").addEventListener("click", () => {
  document.getElementById("ageTitle").textContent =
    "Access unavailable";
  document.querySelector(".age-card > p:not(.eyebrow, .age-footnote)").textContent =
    "Please leave this website if you do not meet the legal drinking age in your location.";
  document.getElementById("ageConfirm").hidden = true;
  document.getElementById("ageExit").hidden = true;
});

// Escape key closes the cart.
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !cartOverlay.hidden) {
    closeCart();
  }
});

// Footer year.
document.getElementById("year").textContent = new Date().getFullYear();

// Initial page setup.
renderProducts();
renderCart();
document.body.classList.add("age-open");
