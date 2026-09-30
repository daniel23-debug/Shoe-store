/* ---------------- Product data ---------------- */
const PRODUCTS = [
  { id: 1, name: "Court Classic Low", brand: "Stride Originals", price: 6500, oldPrice: 7800, cat: "sneakers", gender: "unisex", rating: 4.8, reviews: 214, badge: "Bestseller", img: "assets/shoe-1.jpg", colors: ["#f4f1ea", "#1b1b1b", "#c9a27e"], sizes: [38, 39, 40, 41, 42, 43, 44, 45], soldOut: [45], desc: "A timeless white leather low-top with a gum sole. Full-grain leather upper, cushioned insole and a silhouette that goes with everything." },
  { id: 2, name: "Velocity Run 3", brand: "Apex", price: 9200, oldPrice: null, cat: "running", gender: "men", rating: 4.7, reviews: 168, badge: "New", img: "assets/shoe-2.jpg", colors: ["#1b1b1b", "#d4ff3f", "#3b5bdb"], sizes: [40, 41, 42, 43, 44, 45, 46], soldOut: [], desc: "Engineered mesh, responsive foam midsole and a rocker geometry that keeps you rolling forward mile after mile." },
  { id: 3, name: "Heritage Chelsea Boot", brand: "Marlowe & Co.", price: 11800, oldPrice: 13500, cat: "boots", gender: "men", rating: 4.9, reviews: 96, badge: "Sale", img: "assets/shoe-3.jpg", colors: ["#7a4a2b", "#1b1b1b"], sizes: [40, 41, 42, 43, 44, 45], soldOut: [41], desc: "Burnished full-grain leather, Goodyear-welted sole and elastic side gussets. A boot that gets better with every wear." },
  { id: 4, name: "Aurora Pointed Pump", brand: "Lumière", price: 8400, oldPrice: null, cat: "heels", gender: "women", rating: 4.6, reviews: 142, badge: null, img: "assets/shoe-4.jpg", colors: ["#d9b99b", "#1b1b1b", "#b3202f"], sizes: [36, 37, 38, 39, 40, 41], soldOut: [], desc: "Nude suede stiletto with a 95mm heel and padded footbed. Elegant enough for the gala, comfortable enough for the whole night." },
  { id: 5, name: "Skyline High-Top", brand: "Stride Originals", price: 7900, oldPrice: null, cat: "sneakers", gender: "unisex", rating: 4.7, reviews: 187, badge: "New", img: "assets/shoe-5.jpg", colors: ["#b3202f", "#1b1b1b", "#2f5d8a"], sizes: [38, 39, 40, 41, 42, 43, 44], soldOut: [], desc: "Premium red suede high-top with a padded collar and vulcanised white sole. Courtside heritage, street-ready attitude." },
  { id: 6, name: "Kensington Brogue Oxford", brand: "Marlowe & Co.", price: 12500, oldPrice: null, cat: "formal", gender: "men", rating: 4.9, reviews: 73, badge: null, img: "assets/shoe-6.jpg", colors: ["#a8683a", "#1b1b1b"], sizes: [40, 41, 42, 43, 44, 45], soldOut: [], desc: "Hand-finished tan calf leather with classic wingtip broguing and a leather sole. Boardroom essential." },
  { id: 7, name: "Cloud Slide", brand: "Apex", price: 2900, oldPrice: 3500, cat: "sandals", gender: "unisex", rating: 4.5, reviews: 320, badge: "Sale", img: "assets/shoe-7.jpg", colors: ["#1b1b1b", "#f4f1ea", "#7e8a97"], sizes: [37, 38, 39, 40, 41, 42, 43, 44, 45], soldOut: [], desc: "Ultra-cushioned EVA slides with an anatomical footbed. Recovery days, pool days, every day." },
  { id: 8, name: "Riviera Espadrille", brand: "Lumière", price: 4800, oldPrice: null, cat: "sandals", gender: "women", rating: 4.6, reviews: 88, badge: null, img: "assets/shoe-8.jpg", colors: ["#9aa887", "#f4f1ea", "#1b1b1b"], sizes: [36, 37, 38, 39, 40, 41], soldOut: [36], desc: "Sage canvas slip-on with a braided jute sole. Light, breathable and made for long sunny afternoons." },
];

const FEATURED_IDS = [1, 3, 4, 2];

/* ---------------- Helpers ---------------- */
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const fmt = (n) => "KSh " + n.toLocaleString("en-KE");
const stars = (r) => "★".repeat(Math.round(r)) + "☆".repeat(5 - Math.round(r));

let toastTimer;
function toast(msg) {
  const t = $("#toast");
  t.textContent = msg;
  t.classList.add("is-open");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove("is-open"), 2200);
}

/* ---------------- State ---------------- */
const state = {
  cat: "all",
  gender: "all",
  sort: "featured",
  query: "",
  cart: JSON.parse(localStorage.getItem("stride_cart") || "[]"),
  modal: { product: null, color: 0, size: null, qty: 1 },
};
const saveCart = () => localStorage.setItem("stride_cart", JSON.stringify(state.cart));

/* ---------------- Rendering ---------------- */
function cardHTML(p) {
  return `
    <article class="card" data-id="${p.id}">
      <div class="card__img">
        <img src="${p.img}" alt="${p.name}" loading="lazy" />
        ${p.badge ? `<span class="badge ${p.badge === "Sale" ? "badge--sale" : ""}">${p.badge}</span>` : ""}
        <button class="card__quick" data-quick="${p.id}">Quick view</button>
      </div>
      <div class="card__body">
        <div class="card__brand">${p.brand}</div>
        <div class="card__name">${p.name}</div>
        <div class="card__price">${fmt(p.price)} ${p.oldPrice ? `<s>${fmt(p.oldPrice)}</s>` : ""}</div>
        <div class="rating">${stars(p.rating)} <span>${p.rating} (${p.reviews})</span></div>
      </div>
    </article>`;
}

function filtered() {
  let list = PRODUCTS.filter((p) => {
    if (state.cat !== "all" && p.cat !== state.cat) return false;
    if (state.gender !== "all" && p.gender !== state.gender && p.gender !== "unisex") return false;
    if (state.query) {
      const q = state.query.toLowerCase();
      if (![p.name, p.brand, p.cat, p.desc].join(" ").toLowerCase().includes(q)) return false;
    }
    return true;
  });
  if (state.sort === "price-asc") list.sort((a, b) => a.price - b.price);
  if (state.sort === "price-desc") list.sort((a, b) => b.price - a.price);
  if (state.sort === "rating") list.sort((a, b) => b.rating - a.rating);
  return list;
}

function renderProducts() {
  const list = filtered();
  $("#productGrid").innerHTML = list.map(cardHTML).join("");
  $("#emptyState").hidden = list.length > 0;
  $("#resultCount").textContent = `${list.length} ${list.length === 1 ? "style" : "styles"}`;
  $$("#catChips .chip").forEach((c) => c.classList.toggle("is-active", c.dataset.cat === state.cat));
}

function renderFeatured() {
  $("#featuredGrid").innerHTML = FEATURED_IDS.map((id) => cardHTML(PRODUCTS.find((p) => p.id === id))).join("");
}

/* ---------------- Cart ---------------- */
function cartTotals() {
  const count = state.cart.reduce((n, i) => n + i.qty, 0);
  const subtotal = state.cart.reduce((n, i) => n + i.price * i.qty, 0);
  const discount = count >= 2 ? Math.round(subtotal * 0.15) : 0;
  return { count, subtotal, discount, total: subtotal - discount };
}

function renderCart() {
  const { count, subtotal, discount, total } = cartTotals();
  const cc = $("#cartCount");
  cc.textContent = count;
  cc.classList.add("bump");
  setTimeout(() => cc.classList.remove("bump"), 200);
  $("#cartHeadCount").textContent = count ? `(${count})` : "";

  const body = $("#cartItems");
  if (!state.cart.length) {
    body.innerHTML = `
      <div class="cart-empty">
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M6 6h15l-1.5 9h-12z"/><path d="M6 6 5 3H2"/><circle cx="9" cy="20" r="1.5"/><circle cx="18" cy="20" r="1.5"/></svg>
        <p>Your bag is empty.</p>
        <button class="btn btn--ghost" id="emptyShop">Start shopping</button>
      </div>`;
    $("#cartFoot").style.display = "none";
    return;
  }
  $("#cartFoot").style.display = "";
  body.innerHTML = state.cart
    .map(
      (i, idx) => `
      <div class="cart-item">
        <img src="${i.img}" alt="${i.name}" />
        <div>
          <div class="cart-item__name">${i.name}</div>
          <div class="cart-item__meta">Size ${i.size} · <span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:${i.color};vertical-align:middle;outline:1px solid #ddd"></span> · ${fmt(i.price)}</div>
          <div class="cart-item__row">
            <div class="qty"><button data-dec="${idx}">−</button><span>${i.qty}</span><button data-inc="${idx}">+</button></div>
            <button class="remove" data-remove="${idx}">Remove</button>
          </div>
        </div>
      </div>`
    )
    .join("");
  $("#cartSubtotal").textContent = fmt(subtotal);
  $("#cartDiscountRow").hidden = !discount;
  $("#cartDiscount").textContent = "− " + fmt(discount);
  $("#cartTotal").textContent = fmt(total);
}

function addToCart(product, color, size, qty) {
  const key = `${product.id}-${color}-${size}`;
  const existing = state.cart.find((i) => i.key === key);
  if (existing) existing.qty += qty;
  else state.cart.push({ key, id: product.id, name: product.name, price: product.price, img: product.img, color, size, qty });
  saveCart();
  renderCart();
  toast(`Added ${product.name} (EU ${size}) to your bag`);
}

/* ---------------- Drawer / modal control ---------------- */
function openCart() { $("#cartDrawer").classList.add("is-open"); $("#overlay").classList.add("is-open"); document.body.style.overflow = "hidden"; }
function closeCart() { $("#cartDrawer").classList.remove("is-open"); $("#overlay").classList.remove("is-open"); document.body.style.overflow = ""; }
function closeNav() { $("#nav").classList.remove("is-open"); $("#overlay").classList.remove("is-open"); document.body.style.overflow = ""; }

function openProduct(id) {
  const p = PRODUCTS.find((x) => x.id === id);
  state.modal = { product: p, color: 0, size: null, qty: 1 };
  $("#mImg").src = p.img;
  $("#mImg").alt = p.name;
  $("#mBrand").textContent = p.brand;
  $("#mName").textContent = p.name;
  $("#mRating").innerHTML = `${stars(p.rating)} <span>${p.rating} · ${p.reviews} reviews</span>`;
  $("#mPrice").textContent = fmt(p.price);
  $("#mOldPrice").textContent = p.oldPrice ? fmt(p.oldPrice) : "";
  $("#mDesc").textContent = p.desc;
  $("#mColors").innerHTML = p.colors.map((c, i) => `<button class="swatch ${i === 0 ? "is-active" : ""}" style="background:${c}" data-color="${i}" aria-label="Colour ${i + 1}"></button>`).join("");
  $("#mSizes").innerHTML = p.sizes.map((s) => `<button class="size" data-size="${s}" ${p.soldOut.includes(s) ? "disabled" : ""}>${s}</button>`).join("");
  $("#qtyVal").textContent = 1;
  $("#mAdd").textContent = "Select a size";
  $("#mAdd").disabled = true;
  $("#productModal").classList.add("is-open");
  document.body.style.overflow = "hidden";
}
function closeProduct() { $("#productModal").classList.remove("is-open"); document.body.style.overflow = ""; }

/* ---------------- Checkout ---------------- */
function renderCheckout() {
  const { subtotal, discount } = cartTotals();
  const delivery = Number($("#deliverySelect").value);
  const total = subtotal - discount + delivery;
  $("#summaryItems").innerHTML = state.cart
    .map((i) => `<div class="sum-item"><img src="${i.img}" alt="" /><div>${i.name}<small>Size ${i.size} × ${i.qty}</small></div><span>${fmt(i.price * i.qty)}</span></div>`)
    .join("");
  $("#sumSubtotal").textContent = fmt(subtotal);
  $("#sumDiscountRow").hidden = !discount;
  $("#sumDiscount").textContent = "− " + fmt(discount);
  $("#sumDelivery").textContent = delivery ? fmt(delivery) : "Free";
  $("#sumTotal").textContent = fmt(total);
  $("#checkoutTotal").textContent = fmt(total);
}
function openCheckout() {
  if (!state.cart.length) return;
  closeCart();
  $("#checkoutView").hidden = false;
  $("#successView").hidden = true;
  renderCheckout();
  $("#checkoutModal").classList.add("is-open");
  document.body.style.overflow = "hidden";
}
function closeCheckout() { $("#checkoutModal").classList.remove("is-open"); document.body.style.overflow = ""; }

/* ---------------- Events ---------------- */
document.addEventListener("click", (e) => {
  const t = e.target;

  // Nav / category links
  const catLink = t.closest("[data-cat]");
  if (catLink && !catLink.classList.contains("chip") && !catLink.classList.contains("swatch")) {
    state.cat = catLink.dataset.cat;
    renderProducts();
    closeNav();
    if (catLink.tagName !== "A") document.getElementById("shop").scrollIntoView({ behavior: "smooth" });
  }

  // Chips
  if (t.classList.contains("chip")) { state.cat = t.dataset.cat; renderProducts(); }

  // Product cards / quick view
  const card = t.closest(".card");
  if (card) openProduct(Number(card.dataset.id));

  // Cart
  if (t.closest("#cartToggle")) openCart();
  if (t.closest("#cartClose") || t.id === "overlay") { closeCart(); closeNav(); }
  if (t.id === "emptyShop") { closeCart(); document.getElementById("shop").scrollIntoView({ behavior: "smooth" }); }
  if (t.dataset.inc !== undefined) { state.cart[t.dataset.inc].qty++; saveCart(); renderCart(); }
  if (t.dataset.dec !== undefined) { const i = state.cart[t.dataset.dec]; i.qty > 1 ? i.qty-- : state.cart.splice(t.dataset.dec, 1); saveCart(); renderCart(); }
  if (t.dataset.remove !== undefined) { state.cart.splice(t.dataset.remove, 1); saveCart(); renderCart(); }
  if (t.id === "checkoutBtn") openCheckout();

  // Modal
  if (t.closest("#modalClose") || t.id === "productModal") closeProduct();
  if (t.classList.contains("swatch")) { $$(".swatch").forEach((s) => s.classList.remove("is-active")); t.classList.add("is-active"); state.modal.color = Number(t.dataset.color); }
  if (t.classList.contains("size") && !t.disabled) { $$(".size").forEach((s) => s.classList.remove("is-active")); t.classList.add("is-active"); state.modal.size = Number(t.dataset.size); $("#mAdd").disabled = false; $("#mAdd").textContent = "Add to bag"; }
  if (t.id === "qtyPlus") { state.modal.qty++; $("#qtyVal").textContent = state.modal.qty; }
  if (t.id === "qtyMinus" && state.modal.qty > 1) { state.modal.qty--; $("#qtyVal").textContent = state.modal.qty; }
  if (t.id === "mAdd") {
    const m = state.modal;
    addToCart(m.product, m.product.colors[m.color], m.size, m.qty);
    closeProduct();
    setTimeout(openCart, 250);
  }

  // Checkout
  if (t.closest("#checkoutClose") || t.id === "checkoutModal") closeCheckout();
  if (t.id === "successDone") { closeCheckout(); window.scrollTo({ top: 0, behavior: "smooth" }); }

  // Misc UI
  if (t.closest("#menuToggle")) { $("#nav").classList.add("is-open"); $("#overlay").classList.add("is-open"); }
  if (t.closest("#searchToggle")) { const sb = $("#searchBar"); sb.classList.toggle("is-open"); if (sb.classList.contains("is-open")) $("#searchInput").focus(); }
  if (t.id === "clearFilters") { state.cat = "all"; state.gender = "all"; state.query = ""; $("#searchInput").value = ""; $("#genderFilter").value = "all"; renderProducts(); }
});

$("#searchInput").addEventListener("input", (e) => {
  state.query = e.target.value.trim();
  renderProducts();
  if (state.query) document.getElementById("shop").scrollIntoView({ behavior: "smooth", block: "start" });
});
$("#genderFilter").addEventListener("change", (e) => { state.gender = e.target.value; renderProducts(); });
$("#sortSelect").addEventListener("change", (e) => { state.sort = e.target.value; renderProducts(); });
$("#deliverySelect").addEventListener("change", renderCheckout);

$("#checkoutForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const data = Object.fromEntries(new FormData(e.target));
  $("#successName").textContent = data.name.split(" ")[0];
  $("#successEmail").textContent = data.email;
  $("#orderNo").textContent = "#STR-" + Math.floor(100000 + Math.random() * 900000);
  $("#checkoutView").hidden = true;
  $("#successView").hidden = false;
  state.cart = [];
  saveCart();
  renderCart();
  e.target.reset();
});

$("#newsletterForm").addEventListener("submit", (e) => {
  e.preventDefault();
  toast("You're on the list — check your inbox for 10% off!");
  e.target.reset();
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") { closeCart(); closeProduct(); closeCheckout(); closeNav(); }
});

/* ---------------- Init ---------------- */
renderFeatured();
renderProducts();
renderCart();
