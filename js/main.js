/* ============================================
   AÏSHA-T SHOP — Main JavaScript
   Stockage cloud : JSONBin.io
   ============================================ */

'use strict';

const WA_NUMBER = '221772520411';

/* ===== JSONBIN CONFIG ===== */
// 👉 Remplis ces 2 valeurs après avoir créé ton compte sur jsonbin.io
const JSONBIN = {
  BIN_ID:  '69a771b7d0ea881f40ec0aba',       // ex: 6650abc123def456
  API_KEY: '$2a$10$sJrZvuA9gNKn3Wjsrq1DN.iKGriaDfJb9DvoM1l4n6ORHPKuFSz8a',       // ex: $2a$10$xxxxxxxxxxxx
  get URL() { return `https://api.jsonbin.io/v3/b/${this.BIN_ID}`; }
};

/* ===== PRODUITS PAR DÉFAUT (utilisés si JSONBin inaccessible) ===== */
const DEFAULT_PRODUCTS = [
  { id:1,  name:"Robe Fleurie Bohème",   cat:"robe",       emoji:"👗", price:18500, old:25000, badge:"Nouveau", desc:"Magnifique robe fleurie légère, parfaite pour l'été. Tissu respirant, coupe flatteuse.", stock:15 },
  { id:2,  name:"Robe Soirée Velours",   cat:"robe",       emoji:"🥻", price:34000, old:48000, badge:"Promo",   desc:"Robe longue pour soirée en velours satiné, disponible en noir et bordeaux.", stock:8 },
  { id:3,  name:"Top Crochet Tendance",  cat:"top",        emoji:"👚", price:8500,  old:null,  badge:"Nouveau", desc:"Top crochet tendance, style boho chic. Se porte avec jean ou jupe fluide.", stock:20 },
  { id:4,  name:"Blouse Romantique",     cat:"top",        emoji:"👕", price:12000, old:16000, badge:"Promo",   desc:"Blouse avec détails brodés, coupe loose confortable et féminine.", stock:12 },
  { id:5,  name:"Jean Taille Haute",     cat:"jean",       emoji:"👖", price:22000, old:null,  badge:null,      desc:"Jean skinny taille haute très tendance. Tissu stretch confortable.", stock:10 },
  { id:6,  name:"Pantalon Large Chic",   cat:"jean",       emoji:"🩱", price:19500, old:28000, badge:"Promo",   desc:"Pantalon wide leg élégant, parfait pour le bureau ou une sortie.", stock:7 },
  { id:7,  name:"Sac Bandoulière Mini",  cat:"accessoire", emoji:"👜", price:14000, old:null,  badge:"Nouveau", desc:"Mini sac tendance, chaîne dorée, plusieurs coloris disponibles.", stock:18 },
  { id:8,  name:"Ensemble Deux Pièces",  cat:"robe",       emoji:"💃", price:28000, old:38000, badge:"Promo",   desc:"Set coordonné top + jupe, couleurs pastels tendance.", stock:5 },
  { id:9,  name:"Veste Oversize",        cat:"top",        emoji:"🧥", price:24000, old:null,  badge:"Nouveau", desc:"Veste oversize moderne, polyvalente et tendance.", stock:9 },
  { id:10, name:"Lunettes de Soleil",    cat:"accessoire", emoji:"🕶️", price:6500,  old:null,  badge:null,      desc:"Lunettes mode protection UV400, montures tendance.", stock:25 },
  { id:11, name:"Robe Mini Imprimée",    cat:"robe",       emoji:"🌸", price:15000, old:20000, badge:"Promo",   desc:"Robe mini imprimée vivante, style estival et coloré.", stock:11 },
  { id:12, name:"Ceinture Dorée Large",  cat:"accessoire", emoji:"✨", price:5500,  old:null,  badge:null,      desc:"Ceinture dorée large pour sublimer toutes vos tenues.", stock:30 },
];

/* ===== STORE ===== */
const Store = {
  products: [],          // chargés depuis JSONBin au démarrage
  cart:     JSON.parse(localStorage.getItem('aisha_cart') || '[]'),
  wishlist: JSON.parse(localStorage.getItem('aisha_wish') || '[]'),
  currentFilter: 'tout',
  currentSort: 'recent',
  searchQuery: '',
  currentProduct: null,

  saveCart() {
    localStorage.setItem('aisha_cart', JSON.stringify(this.cart));
    localStorage.setItem('aisha_wish', JSON.stringify(this.wishlist));
  }
};

/* ===== JSONBIN API ===== */
async function loadProductsFromCloud() {
  // Si la clé n'est pas configurée, utilise les produits par défaut
  if (!JSONBIN.BIN_ID || !JSONBIN.API_KEY) {
    Store.products = DEFAULT_PRODUCTS;
    return;
  }
  try {
    const res = await fetch(JSONBIN.URL + '/latest', {
      headers: { 'X-Master-Key': JSONBIN.API_KEY }
    });
    if (!res.ok) throw new Error('JSONBin fetch failed');
    const data = await res.json();
    Store.products = data.record.products || DEFAULT_PRODUCTS;
    // Cache local pour offline
    localStorage.setItem('aisha_products_cache', JSON.stringify(Store.products));
  } catch(e) {
    console.warn('JSONBin inaccessible, utilisation du cache local');
    try {
      const cache = localStorage.getItem('aisha_products_cache');
      Store.products = cache ? JSON.parse(cache) : DEFAULT_PRODUCTS;
    } catch(e2) {
      Store.products = DEFAULT_PRODUCTS;
    }
  }
}

/* ===== LOADER ===== */
function dismissLoader() {
  const loader = document.getElementById('loader');
  if (!loader) { initReveal(); return; }
  loader.classList.add('hide');
  setTimeout(() => { if (loader.parentNode) loader.parentNode.removeChild(loader); }, 700);
  initReveal();
}

window.addEventListener('load', async () => {
  // Securite : loader disparait TOUJOURS apres 3 secondes max
  const safetyTimer = setTimeout(dismissLoader, 3000);

  try {
    await loadProductsFromCloud();
    renderProducts();
    updateCartUI();
  } catch(e) {
    Store.products = DEFAULT_PRODUCTS;
    renderProducts();
    updateCartUI();
  }

  clearTimeout(safetyTimer);
  setTimeout(dismissLoader, 600);
});

/* ===== CUSTOM CURSOR ===== */
const cursor = document.querySelector('.cursor');
const follower = document.querySelector('.cursor-follower');
let mx = 0, my = 0, fx = 0, fy = 0;

if (cursor && window.innerWidth > 768) {
  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    cursor.style.transform = `translate(${mx - 6}px, ${my - 6}px)`;
  });
  function animFollower() {
    fx += (mx - fx) * 0.12;
    fy += (my - fy) * 0.12;
    follower.style.transform = `translate(${fx - 18}px, ${fy - 18}px)`;
    requestAnimationFrame(animFollower);
  }
  animFollower();

  document.querySelectorAll('a, button, .product-card, .cat-pill').forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.style.width = '6px'; cursor.style.height = '6px';
      follower.style.width = '60px'; follower.style.height = '60px';
    });
    el.addEventListener('mouseleave', () => {
      cursor.style.width = ''; cursor.style.height = '';
      follower.style.width = ''; follower.style.height = '';
    });
  });
}

/* ===== PARTICLES ===== */
(function initParticles() {
  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  function resize() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
  resize();
  window.addEventListener('resize', resize);
  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x = Math.random() * canvas.width; this.y = Math.random() * canvas.height;
      this.r = Math.random() * 2 + 0.5;
      this.vx = (Math.random() - 0.5) * 0.3; this.vy = -Math.random() * 0.5 - 0.2;
      this.opacity = Math.random() * 0.4 + 0.1;
    }
    update() { this.x += this.vx; this.y += this.vy; if (this.y < -5) this.reset(); }
    draw() {
      ctx.beginPath(); ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(92,26,46,${this.opacity})`; ctx.fill();
    }
  }
  const particles = Array.from({length:60}, () => new Particle());
  function loop() { ctx.clearRect(0,0,canvas.width,canvas.height); particles.forEach(p=>{p.update();p.draw();}); requestAnimationFrame(loop); }
  loop();
})();

/* ===== NAVBAR ===== */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => { navbar && navbar.classList.toggle('scrolled', window.scrollY > 50); });
function toggleNav() { document.getElementById('navLinks')?.classList.toggle('open'); }

/* ===== MARQUEE ===== */
(function() {
  const track = document.querySelector('.marquee-track');
  if (track) track.innerHTML += track.innerHTML;
})();

/* ===== REVEAL ON SCROLL ===== */
function initReveal() {
  const els = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e, i) => {
      if (e.isIntersecting) { setTimeout(() => e.target.classList.add('visible'), i * 80); io.unobserve(e.target); }
    });
  }, { threshold: 0.12 });
  els.forEach(el => io.observe(el));
}

/* ===== CATEGORIES ===== */
function filterCat(cat, el) {
  Store.currentFilter = cat;
  document.querySelectorAll('.cat-pill').forEach(c => c.classList.remove('active'));
  el.classList.add('active');
  renderProducts();
  document.getElementById('boutique')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

/* ===== FILTER / SORT ===== */
function setSort(sort, btn) {
  Store.currentSort = sort;
  document.querySelectorAll('.filter-tab').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  renderProducts();
}

function doSearch(q) { Store.searchQuery = q; renderProducts(); }

/* ===== PRODUCTS RENDER ===== */
function renderProducts() {
  let list = [...Store.products];
  if (Store.currentFilter !== 'tout') list = list.filter(p => p.cat === Store.currentFilter);
  if (Store.searchQuery) list = list.filter(p => p.name.toLowerCase().includes(Store.searchQuery.toLowerCase()));
  if (Store.currentSort === 'promo') list = list.filter(p => p.old);
  if (Store.currentSort === 'prix_asc') list.sort((a,b) => a.price - b.price);
  if (Store.currentSort === 'prix_desc') list.sort((a,b) => b.price - a.price);
  if (Store.currentSort === 'recent') list.reverse();

  const grid = document.getElementById('productsGrid');
  if (!grid) return;

  if (!list.length) {
    grid.innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:4rem 2rem;color:var(--muted)">
      <div style="font-size:3rem;margin-bottom:1rem">🔍</div>
      <p style="font-family:'Cormorant Garamond',serif;font-size:1.3rem">Aucun article trouvé</p>
    </div>`;
    return;
  }

  grid.innerHTML = list.map(p => {
    const inWish = Store.wishlist.includes(p.id);
    const imgHtml = p.img
      ? `<img src="${p.img}" alt="${p.name}" style="width:100%;height:100%;object-fit:cover;position:absolute;inset:0" loading="lazy">`
      : `<div class="product-img-emoji">${p.emoji}</div>`;
    return `
    <div class="product-card reveal" onclick="openProductModal(${p.id})">
      <div class="product-img-wrap">
        ${p.badge ? `<div class="product-badge ${p.badge==='Promo'?'promo':''}">${p.badge}</div>` : ''}
        ${imgHtml}
        <div class="product-overlay">
          <button class="overlay-btn" onclick="toggleWish(event,${p.id})">${inWish?'❤️':'🤍'}</button>
          <button class="overlay-btn" onclick="openProductModal(${p.id})">👁️</button>
          <button class="overlay-btn" onclick="quickAdd(event,${p.id})">🛍️</button>
        </div>
      </div>
      <div class="product-body">
        <div class="product-name">${p.name}</div>
        <div class="product-cat">${catLabel(p.cat)}</div>
        <div class="product-foot">
          <span>
            <span class="product-price">${fmt(p.price)}</span>
            ${p.old ? `<span class="product-old">${fmt(p.old)}</span>` : ''}
          </span>
          <button class="add-btn" onclick="quickAdd(event,${p.id})">+</button>
        </div>
      </div>
    </div>`;
  }).join('');
  initReveal();
}

/* ===== HELPERS ===== */
function catLabel(cat) {
  return { robe:'Robes', top:'Tops & Blouses', jean:'Jeans & Pantalons', accessoire:'Accessoires' }[cat] || cat;
}
function fmt(n) { return n.toLocaleString('fr-FR') + ' F'; }

/* ===== WISHLIST ===== */
function toggleWish(e, id) {
  e.stopPropagation();
  const idx = Store.wishlist.indexOf(id);
  if (idx === -1) { Store.wishlist.push(id); showToast('❤️ Ajouté aux favoris !'); }
  else { Store.wishlist.splice(idx,1); showToast('🤍 Retiré des favoris'); }
  Store.saveCart();
  renderProducts();
}

/* ===== CART ===== */
function addToCart(product, size = 'M') {
  const ex = Store.cart.find(i => i.id === product.id && i.size === size);
  if (ex) ex.qty++;
  else Store.cart.push({ ...product, size, qty:1 });
  Store.saveCart();
  updateCartUI();
  showToast('✅ Ajouté au panier !');
}

function quickAdd(e, id) {
  e.stopPropagation();
  const p = Store.products.find(p => p.id === id);
  if (p) addToCart(p);
}

function changeQty(id, size, delta) {
  const item = Store.cart.find(i => i.id === id && i.size === size);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) Store.cart.splice(Store.cart.indexOf(item), 1);
  Store.saveCart();
  updateCartUI();
}

function removeCartItem(id, size) {
  const idx = Store.cart.findIndex(i => i.id === id && i.size === size);
  if (idx !== -1) { Store.cart.splice(idx, 1); Store.saveCart(); updateCartUI(); }
}

function updateCartUI() {
  const count = Store.cart.reduce((s,i) => s + i.qty, 0);
  const total = Store.cart.reduce((s,i) => s + i.price * i.qty, 0);
  const badge = document.getElementById('cartBadge');
  if (badge) badge.textContent = count;
  const totalEl = document.getElementById('cartTotal');
  if (totalEl) totalEl.textContent = fmt(total);
  const itemsEl = document.getElementById('cartItemsList');
  const footer = document.getElementById('cartFooter');
  if (!itemsEl) return;
  if (!Store.cart.length) {
    itemsEl.innerHTML = `<div class="cart-empty-state"><div class="icon">🛍️</div><p>Votre panier est vide</p></div>`;
    if (footer) footer.style.display = 'none';
    return;
  }
  if (footer) footer.style.display = 'block';
  itemsEl.innerHTML = Store.cart.map(item => `
    <div class="cart-item">
      <div class="ci-img">${item.img ? `<img src="${item.img}" style="width:100%;height:100%;object-fit:cover;border-radius:4px">` : item.emoji}</div>
      <div class="ci-info">
        <div class="ci-name">${item.name}</div>
        <div class="ci-size">Taille : ${item.size}</div>
        <div class="ci-bottom">
          <span class="ci-price">${fmt(item.price)}</span>
          <div class="ci-qty">
            <button class="qty-btn" onclick="changeQty(${item.id},'${item.size}',-1)">−</button>
            <span>${item.qty}</span>
            <button class="qty-btn" onclick="changeQty(${item.id},'${item.size}',1)">+</button>
          </div>
          <button class="ci-del" onclick="removeCartItem(${item.id},'${item.size}')">🗑️</button>
        </div>
      </div>
    </div>`).join('');
  const waText = 'Bonjour Aïsha-T Shop ! 🌸\n\nVoici ma commande :\n' +
    Store.cart.map(i => `• ${i.name} x${i.qty} (Taille ${i.size}) — ${fmt(i.price * i.qty)}`).join('\n') +
    `\n\n💰 Total : ${fmt(total)}\n\nMerci !`;
  const waBtn = document.getElementById('cartWaBtn');
  if (waBtn) waBtn.href = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(waText)}`;
}

function toggleCart() { document.getElementById('cartOverlay')?.classList.toggle('open'); }
document.getElementById('cartOverlay')?.addEventListener('click', e => {
  if (e.target === document.getElementById('cartOverlay')) toggleCart();
});

/* ===== PRODUCT MODAL ===== */
function openProductModal(id) {
  const p = Store.products.find(p => p.id === id);
  if (!p) return;
  Store.currentProduct = p;
  const modalImgEl = document.getElementById('modalImg');
  if (p.img) {
    modalImgEl.innerHTML = `<img src="${p.img}" alt="${p.name}" style="width:100%;height:100%;object-fit:cover">`;
    modalImgEl.style.fontSize = '0';
  } else {
    modalImgEl.textContent = p.emoji;
    modalImgEl.style.fontSize = '';
  }
  document.getElementById('modalName').textContent = p.name;
  document.getElementById('modalCat').textContent = catLabel(p.cat);
  document.getElementById('modalPrice').textContent = fmt(p.price);
  document.getElementById('modalDesc').textContent = p.desc;
  document.querySelectorAll('.size-chip').forEach((el, i) => el.classList.toggle('active', i === 1));
  document.getElementById('productModal')?.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeProductModal() {
  document.getElementById('productModal')?.classList.remove('open');
  document.body.style.overflow = '';
}

function selectSize(btn) {
  document.querySelectorAll('.size-chip').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
}

function getSelectedSize() { return document.querySelector('.size-chip.active')?.textContent || 'M'; }

function addCurrentToCart() {
  if (Store.currentProduct) { addToCart(Store.currentProduct, getSelectedSize()); closeProductModal(); toggleCart(); }
}

function orderCurrentViaWa() {
  if (!Store.currentProduct) return;
  const p = Store.currentProduct;
  const msg = `Bonjour Aïsha-T Shop ! 🌸\n\nJe souhaite commander :\n• ${p.name}\n• Taille : ${getSelectedSize()}\n• Prix : ${fmt(p.price)}\n\nMerci !`;
  window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`, '_blank');
}

document.getElementById('productModal')?.addEventListener('click', e => {
  if (e.target === document.getElementById('productModal')) closeProductModal();
});

/* ===== CONTACT ===== */
function handleContact() {
  const fields = document.querySelectorAll('#contactForm input, #contactForm textarea, #contactForm select');
  let ok = true;
  fields.forEach(f => { if (!f.value.trim()) { f.style.borderColor='var(--red)'; ok=false; } else f.style.borderColor=''; });
  if (!ok) { showToast('⚠️ Veuillez remplir tous les champs'); return; }
  const name = document.getElementById('cName')?.value || '';
  const tel  = document.getElementById('cTel')?.value || '';
  const sujet= document.getElementById('cSujet')?.value || '';
  const msg  = document.getElementById('cMsg')?.value || '';
  const waMsg = `Bonjour Aïsha-T Shop ! 🌸\n\nNom : ${name}\nTél : ${tel}\nSujet : ${sujet}\n\n${msg}`;
  window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(waMsg)}`, '_blank');
  showToast('✅ Message envoyé via WhatsApp !');
  fields.forEach(f => f.value = '');
}

/* ===== TOAST ===== */
let toastTimer;
function showToast(msg) {
  const t = document.getElementById('toast');
  if (!t) return;
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('show'), 3000);
}

/* ===== COUNTER ANIMATION ===== */
function animateCounters() {
  document.querySelectorAll('[data-count]').forEach(el => {
    const target = parseInt(el.dataset.count);
    const suffix = el.dataset.suffix || '';
    let current = 0;
    const step = target / 60;
    const timer = setInterval(() => {
      current = Math.min(current + step, target);
      el.textContent = Math.floor(current) + suffix;
      if (current >= target) clearInterval(timer);
    }, 16);
  });
}
const heroObs = new IntersectionObserver(entries => {
  if (entries[0].isIntersecting) { animateCounters(); heroObs.disconnect(); }
}, { threshold: 0.3 });
const heroSection = document.getElementById('hero');
if (heroSection) heroObs.observe(heroSection);
