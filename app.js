const products = [
  {
    id: 1,
    name: "The Silent Patient",
    author: "Alex Michaelides",
    category: "Thriller",
    price: 399,
    rating: 4,
    image: "images/img1.jpg",
    desc: "A celebrated painter. A devoted husband now dead. A woman who won’t speak. The Silent Patient is the story of Alicia Berenson’s brutal act, and of Theo Faber’s quest to make her talk. But this is no simple murder-mystery — set in a claustrophobic psychiatric unit, it examines what it means to be silent, to witness silence, and to be haunted by one’s own past. The twist? It will make you reconsider everything you thought you knew."
  },
  {
    id: 2,
    name: "Atomic Habits",
    author: "James Clear",
    category: "Self-Help",
    price: 899,
    rating: 5,
    image: "images/img2.jpg",
    desc: "“Atomic Habits” is a practical guide to how tiny changes build into lasting transformation. Clear explains that real success comes not from huge leaps, but from getting 1% better every day — because improvements compound over time."
  },
  {
    id: 3,
    name: "The Hobbit",
    author: "J.R.R. Tolkien",
    category: "Fiction",
    price: 316,
    rating: 4.8,
    image: "images/img3.jpg",
    desc: "In this classic fantasy tale, home-loving Bilbo Baggins is swept into a perilous quest across Middle-earth filled with trolls, goblins, elves, and dragons. What begins as a reluctant journey becomes a story of bravery and self-discovery."
  },
  {
    id: 4,
    name: "Becoming",
    author: "Michelle Obama",
    category: "Biography",
    price: 799,
    rating: 4.6,
    image: "images/img4.jpg",
    desc: "A candid memoir tracing Michelle Obama’s journey from a childhood on Chicago’s South Side to her years as First Lady of the United States, exploring identity, family, and service."
  },
  {
    id: 5,
    name: "Can We Be Strangers Again",
    author: "Shrijeet Shandilya",
    category: "Romance",
    price: 299,
    rating: 4.4,
    image: "images/img5.jpg",
    desc: "Set against the electric haze of college life, three friends are bound by laughter, late-night talks and unspoken promises—until two cross the line from friendship into love, and everything changes."
  },
  {
    id: 6,
    name: "Sapiens",
    author: "Yuval Noah Harari",
    category: "Historical",
    price: 461,
    rating: 4.7,
    image: "images/img6.jpg",
    desc: "Sapiens explores the incredible journey of humankind — from primitive hunter-gatherers to masters of the modern world. Harari explains how shared beliefs, cooperation, and imagination shaped societies, religions, and economies."
  },
  {
    id: 7,
    name: "The Curse of Letting Go",
    author: "Prashant Paras",
    category: "Poetry",
    price: 220,
    rating: 4.2,
    image: "images/img7.jpg",
    desc: "A tender, haunting collection of poems that explore the silent ache of unfinished goodbyes and the lingering weight of memories. The author writes: “Because letting go isn’t the end — it’s the beginning of carrying pain differently.”"
  },
  {
    id: 8,
    name: "Dragon Ball Super Vol. 20",
    author: "Akira Toriyama",
    category: "Manga",
    price: 582,
    rating: 4.8,
    image: "images/img8.jpg",
    desc: "Goku and Vegeta struggle to hone their ultra forms so they can face the newly crowned strongest warrior in the universe, Gas."
  }
];

/* ===== GLOBAL STATE ===== */
let cart = JSON.parse(sessionStorage.getItem("cart")) || [];

/* ===== UTILITIES ===== */
function showToast(message, type = "success") {
  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  toast.textContent = message;
  document.body.appendChild(toast);
  setTimeout(() => toast.classList.add("show"), 100);
  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => toast.remove(), 400);
  }, 3000);
}

function updateCartCount() {
  const countEl = document.getElementById("cartCount");
  if (countEl)
    countEl.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
}

/* ===== INDEX PAGE ===== */
if (document.querySelector(".product-grid")) {
  const grid = document.querySelector(".product-grid");
  renderProducts(products);

  const searchInput = document.getElementById("searchInput");
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      const query = e.target.value.toLowerCase();
      const filtered = products.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.author.toLowerCase().includes(query)
      );
      renderProducts(filtered);
    });
  }

  function renderProducts(list) {
    if (list.length === 0) {
      grid.innerHTML = `<p class="empty-state">No books found.</p>`;
      return;
    }
    grid.innerHTML = list
      .map(
        (p) => `
        <div class="product-card">
          <img src="${p.image}" alt="${p.name}">
          <h3>${p.name}</h3>
          <p>${p.author}</p>
          <p class="price">₹${p.price.toFixed(2)}</p>
          <div class="rating">${"★".repeat(Math.floor(p.rating))}${"☆".repeat(
          5 - Math.floor(p.rating)
        )}</div>
          <div class="card-buttons">
            <button class="btn" onclick="addToCart(${p.id})">Add to Cart</button>
            <button class="btn btn-primary" onclick="viewProduct(${p.id})">View Details</button>
          </div>
        </div>`
      )
      .join("");
  }
}

/* ===== VIEW PRODUCT ===== */
function viewProduct(id) {
  const product = products.find((p) => p.id === id);
  if (product) {
    localStorage.setItem("selectedProduct", JSON.stringify(product));
    window.location.href = "product.html";
  }
}

/* ===== ADD TO CART ===== */
function addToCart(id, quantity = 1) {
  const product = products.find((p) => p.id === id);
  if (!product) return;

  const existing = cart.find((i) => i.id === id);
  if (existing) existing.quantity += quantity;
  else cart.push({ ...product, quantity });

  sessionStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
  showToast(`✅ ${product.name} added to cart`);
}

/* ===== PRODUCT PAGE ===== */
if (window.location.pathname.includes("product.html")) {
  const product = JSON.parse(localStorage.getItem("selectedProduct"));
  const container = document.getElementById("productDetail");

  if (product && container) {
    container.innerHTML = `
      <div class="product-detail">
        <img src="${product.image}" alt="${product.name}">
        <div class="product-info">
          <h2>${product.name}</h2>
          <p><strong>Author:</strong> ${product.author}</p>
          <p><strong>Category:</strong> ${product.category}</p>
          <div id="productRating" class="rating">
            ${"★".repeat(Math.floor(product.rating))}${"☆".repeat(
      5 - Math.floor(product.rating)
    )}
          </div>
          <p>${product.desc}</p>
          <p class="price">₹${product.price.toFixed(2)}</p>
          <form id="addToCartForm" novalidate>
            <label for="qty" class="qty-label">Quantity</label>
            <input id="qty" name="qty" type="number" inputmode="numeric" min="1" max="10" value="1">
            <p id="qtyError" class="input-error" hidden></p>
            <button type="submit" class="btn">Add to Cart</button>
          </form>
        </div>
      </div>
    `;

    document
      .getElementById("addToCartForm")
      .addEventListener("submit", (e) => {
        e.preventDefault();
        const qty = parseInt(document.getElementById("qty").value);
        if (isNaN(qty) || qty < 1 || qty > 10) {
          const error = document.getElementById("qtyError");
          error.textContent = "Please select between 1 and 10.";
          error.hidden = false;
          return;
        }
        document.getElementById("qtyError").hidden = true;
        addToCart(product.id, qty);
      });
  }
}

/* ===== CART PAGE ===== */
if (window.location.pathname.includes("cart.html")) {
  let cart = JSON.parse(sessionStorage.getItem("cart")) || [];
  const container = document.getElementById("cartItems");
  const summary = document.getElementById("cartSummary");
  const emptyState = document.getElementById("emptyCart");

  renderCart();

  function renderCart() {
    if (cart.length === 0) {
      container.innerHTML = "";
      emptyState.classList.remove("hidden");
      summary.classList.add("hidden");
      updateCartCount();
      return;
    }

    emptyState.classList.add("hidden");
    summary.classList.remove("hidden");

    container.innerHTML = cart
      .map(
        (item) => `
        <div class="cart-item">
          <img src="${item.image}" alt="${item.name}">
          <div class="cart-info">
            <h3>${item.name}</h3>
            <p class="price">₹${item.price.toFixed(2)}</p>
          </div>
          <input type="number" min="1" max="10" value="${item.quantity}" data-id="${item.id}" class="qty-input">
          <p class="item-total" data-id="${item.id}">₹${(
            item.price * item.quantity
          ).toFixed(2)}</p>
          <button class="btn btn-danger" data-remove="${item.id}">Remove</button>
        </div>`
      )
      .join("");

    updateTotals();
    attachListeners();
  }

  function attachListeners() {
    document.querySelectorAll(".qty-input").forEach((input) =>
      input.addEventListener("input", (e) => {
        const id = parseInt(e.target.dataset.id);
        let qty = parseInt(e.target.value);
        if (isNaN(qty) || qty < 1) qty = 1;
        if (qty > 10) qty = 10;

        const item = cart.find((i) => i.id === id);
        item.quantity = qty;
        sessionStorage.setItem("cart", JSON.stringify(cart));

        const totalEl = document.querySelector(`.item-total[data-id="${id}"]`);
        totalEl.textContent = `₹${(item.price * qty).toFixed(2)}`;
        updateTotals();
        updateCartCount();
      })
    );

    document.querySelectorAll("[data-remove]").forEach((btn) =>
      btn.addEventListener("click", (e) => {
        const id = parseInt(e.target.dataset.remove);
        cart = cart.filter((i) => i.id !== id);
        sessionStorage.setItem("cart", JSON.stringify(cart));
        renderCart();
        updateCartCount();
        showToast("Item removed");
      })
    );
  }

  function updateTotals() {
    const subtotal = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);
    const tax = subtotal * 0;
    const total = subtotal + tax;

    document.getElementById("subtotal").textContent = `₹${subtotal.toFixed(2)}`;
    document.getElementById("tax").textContent = `₹${tax.toFixed(2)}`;
    document.getElementById("total").textContent = `₹${total.toFixed(2)}`;
  }

  document.getElementById("clearCart").addEventListener("click", () => {
    cart = [];
    sessionStorage.removeItem("cart");
    renderCart();
    updateCartCount();
    showToast("Cart cleared");
  });

  document.getElementById("checkoutBtn").addEventListener("click", () => {
    showToast("✅ Checkout complete! (Demo only)");
    cart = [];
    sessionStorage.removeItem("cart");
    renderCart();
    updateCartCount();
  });
}

/* ===== CONTACT FORM ===== */
const contactForm = document.getElementById("contactForm");
if (contactForm) {
  contactForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const message = document.getElementById("message").value.trim();
    const msgEl = document.getElementById("formMessage");

    if (name.length < 2)
      return (msgEl.textContent = "Name must be at least 2 characters");
    if (!/\S+@\S+\.\S+/.test(email))
      return (msgEl.textContent = "Invalid email format");
    if (message.length < 10)
      return (msgEl.textContent = "Message must be at least 10 characters");

    msgEl.textContent = "Message sent successfully!";
    contactForm.reset();
    showToast("Form submitted!");
  });
}

/* ===== MOBILE MENU ===== */
const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");
if (menuToggle && navLinks) {
  menuToggle.addEventListener("click", () => {
    navLinks.classList.toggle("show");
  });
  document.addEventListener("click", (e) => {
    if (!navLinks.contains(e.target) && !menuToggle.contains(e.target)) {
      navLinks.classList.remove("show");
    }
  });
}

/* ===== INITIALIZE ===== */
updateCartCount();