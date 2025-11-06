/* ===== PRODUCTS DATA ===== */
const products = [
  {
    id: 1,
    name: "The Silent Patient",
    author: "Alex Michaelides",
    category: "Thriller",
    price: 399,
    rating: 4,
    image: "images/img1.jpg",
    desc:
      "A celebrated painter. A devoted husband now dead. A woman who won’t speak. The Silent Patient is the story of Alicia Berenson’s brutal act, and of Theo Faber’s quest to make her talk. But this is no simple murder-mystery — set in a claustrophobic psychiatric unit, it examines what it means to be silent, to witness silence, and to be haunted by one’s own past. The twist? It will make you reconsider everything you thought you knew."
  },
  {
    id: 2,
    name: "Atomic Habits",
    author: "James Clear",
    category: "Self-Help",
    price: 899,
    rating: 5,
    image: "images/img2.jpg",
    desc:
      "“Atomic Habits” is a practical guide to how tiny changes build into lasting transformation. Clear explains that real success comes not from huge leaps, but from getting 1% better every day — because improvements compound over time."
  },
  {
    id: 3,
    name: "The Hobbit",
    author: "J.R.R. Tolkien",
    category: "Fiction",
    price: 316,
    rating: 4.8,
    image: "images/img3.jpg",
    desc:
      "In this classic fantasy tale, home-loving Bilbo Baggins is swept into a perilous quest across Middle-earth filled with trolls, goblins, elves, and dragons. What begins as a reluctant journey becomes a story of bravery and self-discovery."
  },
  {
    id: 4,
    name: "Becoming",
    author: "Michelle Obama",
    category: "Biography",
    price: 799,
    rating: 4.6,
    image: "images/img4.jpg",
    desc:
      "A candid memoir tracing Michelle Obama’s journey from a childhood on Chicago’s South Side to her years as First Lady of the United States, exploring identity, family, and service."
  },
  {
    id: 5,
    name: "Can We Be Strangers Again",
    author: "Shrijeet Shandilya",
    category: "Romance",
    price: 299,
    rating: 4.4,
    image: "images/img5.jpg",
    desc:
      "Set against the electric haze of college life, three friends are bound by laughter, late-night talks and unspoken promises—until two cross the line from friendship into love, and everything changes."
  },
  {
    id: 6,
    name: "Sapiens",
    author: "Yuval Noah Harari",
    category: "Historical",
    price: 461,
    rating: 4.7,
    image: "images/img6.jpg",
    desc:
      "Sapiens explores the incredible journey of humankind — from primitive hunter-gatherers to masters of the modern world. Harari explains how shared beliefs, cooperation, and imagination shaped societies, religions, and economies."
  },
  {
    id: 7,
    name: "The Curse of Letting Go",
    author: "Prashant Paras",
    category: "Poetry",
    price: 220,
    rating: 4.2,
    image: "images/img7.jpg",
    desc:
      "A tender, haunting collection of poems that explore the silent ache of unfinished goodbyes and the lingering weight of memories. The author writes: “Because letting go isn’t the end — it’s the beginning of carrying pain differently.”"
  },
  {
    id: 8,
    name: "Dragon Ball Super Vol. 20",
    author: "Akira Toriyama",
    category: "Manga",
    price: 582,
    rating: 4.8,
    image: "images/img8.jpg",
    desc:
      "Goku and Vegeta struggle to hone their ultra forms so they can face the newly crowned strongest warrior in the universe, Gas."
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
  // animate in/out
  requestAnimationFrame(() => toast.classList.add("show"));
  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => toast.remove(), 400);
  }, 3000);
}

function updateCartCount() {
  const countEl = document.getElementById("cartCount");
  if (!countEl) return;
  const total = cart.reduce((sum, item) => sum + item.quantity, 0);
  countEl.textContent = total;
}

/* ===== RENDER PRODUCTS (INDEX) ===== */
if (document.querySelector(".product-grid")) {
  const grid = document.querySelector(".product-grid");
  const searchInput = document.getElementById("searchInput");

  function renderProducts(list) {
    if (!grid) return;
    if (!list || list.length === 0) {
      grid.innerHTML = `<p class="empty-state">No books found.</p>`;
      return;
    }

    grid.innerHTML = list
      .map((p) => {
        const stars = "★".repeat(Math.floor(p.rating)) + "☆".repeat(5 - Math.floor(p.rating));
        return `
      <div class="product-card" data-id="${p.id}">
        <div class="product-media">
          <img src="${p.image}" alt="${p.name}">
        </div>
        <h3>${p.name}</h3>
        <p class="author">${p.author}</p>

        <label class="qty-label">Quantity</label>
        <div class="qty-control">
          <button class="qty-btn minus" data-id="${p.id}" aria-label="decrease">−</button>
          <span class="qty-display" data-id="${p.id}">1</span>
          <button class="qty-btn plus" data-id="${p.id}" aria-label="increase">+</button>
        </div>
        <p id="qtyError-${p.id}" class="input-error" hidden></p>

        <p class="price">₹${p.price.toFixed(2)}</p>
        <div class="rating">${stars}</div>

        <div class="card-buttons">
          <button class="btn add-to-cart" data-id="${p.id}">Add to Cart</button>
          <button class="btn btn-primary view-details" data-id="${p.id}">View Details</button>
        </div>
      </div>`;
      })
      .join("");

    // after rendering, nothing else needed; event delegation below handles qty buttons + add-to-cart
  }

  // initial render
  renderProducts(products);

  // search
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      const q = e.target.value.toLowerCase();
      const filtered = products.filter(
        (p) => p.name.toLowerCase().includes(q) || p.author.toLowerCase().includes(q)
      );
      renderProducts(filtered);
    });
  }

  // event delegation for product-grid (handles qty +/- and add/view)
  grid.addEventListener("click", (e) => {
    const btn = e.target;
    const id = btn.getAttribute && btn.getAttribute("data-id");
    if (!id) return;

    // qty controls
    if (btn.classList.contains("plus") || btn.classList.contains("minus")) {
      const qtyDisplay = document.querySelector(`.qty-display[data-id="${id}"]`);
      if (!qtyDisplay) return;
      let qty = parseInt(qtyDisplay.textContent || "1", 10);
      if (btn.classList.contains("plus")) {
        if (qty < 10) qty++;
      } else {
        if (qty > 1) qty--;
      }
      qtyDisplay.textContent = qty;
      return;
    }

    // add to cart
    if (btn.classList.contains("add-to-cart")) {
      const qtyDisplay = document.querySelector(`.qty-display[data-id="${id}"]`);
      const quantity = parseInt(qtyDisplay?.textContent || "1", 10);
      addToCart(parseInt(id, 10), quantity);
      return;
    }

    // view details
    if (btn.classList.contains("view-details")) {
      viewProduct(parseInt(id, 10));
      return;
    }
  });
}

/* ===== VIEW PRODUCT PAGE ===== */
function viewProduct(id) {
  const product = products.find((p) => p.id === id);
  if (product) {
    localStorage.setItem("selectedProduct", JSON.stringify(product));
    window.location.href = "product.html";
  }
}

/* ===== GLOBAL ADD TO CART ===== */
function addToCart(id, quantity = 1) {
  const product = products.find((p) => p.id === id);
  if (!product) return;

  const existing = cart.find((i) => i.id === id);
  if (existing) {
    existing.quantity = Math.min(10, existing.quantity + quantity);
  } else {
    cart.push({ id: product.id, name: product.name, price: product.price, image: product.image, quantity: Math.min(10, quantity) });
  }

  sessionStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
  showToast(`✅ ${product.name} added to cart`);
}

/* ===== PRODUCT DETAIL PAGE (product.html) ===== */
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
            ${"★".repeat(Math.floor(product.rating))}${"☆".repeat(5 - Math.floor(product.rating))}
          </div>
          <p class="desc">${product.desc}</p>
          <p class="price">₹${product.price.toFixed(2)}</p>

          <form id="addToCartForm" novalidate>
            <label class="qty-label">Quantity</label>
            <div class="qty-control">
              <button type="button" class="qty-btn minus" aria-label="decrease">−</button>
              <span id="qtyDisplay" class="qty-display">1</span>
              <button type="button" class="qty-btn plus" aria-label="increase">+</button>
            </div>
            <p id="qtyError" class="input-error" hidden></p>
            <button type="submit" class="btn">Add to Cart</button>
          </form>
        </div>
      </div>
    `;

    let quantity = 1;
    const qtyDisplay = document.getElementById("qtyDisplay");
    const minusBtn = container.querySelector(".qty-btn.minus");
    const plusBtn = container.querySelector(".qty-btn.plus");
    const qtyError = document.getElementById("qtyError");
    const addToCartForm = document.getElementById("addToCartForm");

    if (minusBtn) {
      minusBtn.addEventListener("click", () => {
        if (quantity > 1) {
          quantity--;
          qtyDisplay.textContent = quantity;
        }
      });
    }
    if (plusBtn) {
      plusBtn.addEventListener("click", () => {
        if (quantity < 10) {
          quantity++;
          qtyDisplay.textContent = quantity;
        }
      });
    }
    if (addToCartForm) {
      addToCartForm.addEventListener("submit", (e) => {
        e.preventDefault();
        if (quantity < 1 || quantity > 10) {
          qtyError.textContent = "Quantity must be between 1 and 10.";
          qtyError.hidden = false;
          return;
        }
        qtyError.hidden = true;
        addToCart(product.id, quantity);
      });
    }
  }
}

/* ===== CART PAGE (cart.html) ===== */
if (window.location.pathname.includes("cart.html")) {
  // use the global cart variable (already initialized at top)
  cart = JSON.parse(sessionStorage.getItem("cart")) || [];
  const container = document.getElementById("cartItems");
  const summary = document.getElementById("cartSummary");
  const emptyState = document.getElementById("emptyCart");
  const subtotalEl = document.getElementById("subtotal");
  const taxEl = document.getElementById("tax");
  const totalEl = document.getElementById("total");
  const clearBtn = document.getElementById("clearCart");
  const checkoutBtn = document.getElementById("checkoutBtn");

  function renderCart() {
    if (!container) return;

    if (!cart || cart.length === 0) {
      container.innerHTML = "";
      if (emptyState) emptyState.classList.remove("hidden");
      if (summary) summary.classList.add("hidden");
      updateCartCount();
      return;
    }

    if (emptyState) emptyState.classList.add("hidden");
    if (summary) summary.classList.remove("hidden");

    container.innerHTML = cart
      .map((item) => {
        return `
      <div class="cart-item" data-id="${item.id}">
        <img src="${item.image}" alt="${item.name}">
        <div class="cart-info">
          <h3>${item.name}</h3>
          <p class="price">₹${item.price.toFixed(2)}</p>
        </div>

        <div class="qty-control">
          <button class="qty-btn minus" data-id="${item.id}" aria-label="decrease">−</button>
          <span class="qty-display" data-id="${item.id}">${item.quantity}</span>
          <button class="qty-btn plus" data-id="${item.id}" aria-label="increase">+</button>
        </div>

        <p class="item-total" data-id="${item.id}">₹${(item.price * item.quantity).toFixed(2)}</p>

        <button class="btn btn-danger remove-item" data-remove="${item.id}">Remove</button>
      </div>`;
      })
      .join("");

    updateTotals();
    updateCartCount();
  }

  // event delegation for cart controls (plus/minus/remove)
  if (container) {
    container.addEventListener("click", (e) => {
      const target = e.target;
      // plus/minus
      if (target.classList.contains("plus") || target.classList.contains("minus")) {
        const id = parseInt(target.getAttribute("data-id"), 10);
        const item = cart.find((i) => i.id === id);
        if (!item) return;
        if (target.classList.contains("plus") && item.quantity < 10) item.quantity++;
        if (target.classList.contains("minus") && item.quantity > 1) item.quantity--;
        sessionStorage.setItem("cart", JSON.stringify(cart));
        renderCart();
        return;
      }

      // remove
      if (target.classList.contains("remove-item") || target.classList.contains("btn-danger")) {
        const id = parseInt(target.getAttribute("data-remove"), 10) || parseInt(target.closest(".cart-item")?.dataset.id, 10);
        cart = cart.filter((i) => i.id !== id);
        sessionStorage.setItem("cart", JSON.stringify(cart));
        renderCart();
        showToast("Item removed");
        return;
      }
    });
  }

  function updateTotals() {
    const subtotal = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);
    const tax = 0; // change if you want tax
    const total = subtotal + tax;
    if (subtotalEl) subtotalEl.textContent = `₹${subtotal.toFixed(2)}`;
    if (taxEl) taxEl.textContent = `₹${tax.toFixed(2)}`;
    if (totalEl) totalEl.textContent = `₹${total.toFixed(2)}`;
  }

  if (clearBtn) {
    clearBtn.addEventListener("click", () => {
      cart = [];
      sessionStorage.removeItem("cart");
      renderCart();
      updateCartCount();
      showToast("Cart cleared");
    });
  }

  if (checkoutBtn) {
    checkoutBtn.addEventListener("click", () => {
      // Demo behaviour — integrate real checkout here
      showToast("✅ Checkout complete! (Demo only)");
      cart = [];
      sessionStorage.removeItem("cart");
      renderCart();
      updateCartCount();
    });
  }

  // initial render
  renderCart();
}

/* ===== CONTACT FORM ===== */
const contactForm = document.getElementById("contactForm");
if (contactForm) {
  contactForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = document.getElementById("name")?.value.trim() || "";
    const email = document.getElementById("email")?.value.trim() || "";
    const message = document.getElementById("message")?.value.trim() || "";
    const msgEl = document.getElementById("formMessage");

    if (name.length < 2) {
      if (msgEl) msgEl.textContent = "Name must be at least 2 characters";
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      if (msgEl) msgEl.textContent = "Invalid email format";
      return;
    }
    if (message.length < 10) {
      if (msgEl) msgEl.textContent = "Message must be at least 10 characters";
      return;
    }

    if (msgEl) msgEl.textContent = "Message sent successfully!";
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
