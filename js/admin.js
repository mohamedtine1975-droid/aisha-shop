/* ============================================
   AÏSHA-T SHOP — Admin Panel JavaScript
   ============================================ */

'use strict';

/* ===== AUTH CONFIG ===== */
const AUTH = {
  username: 'aisha',
  password: 'aisha2025',
  sessionKey: 'aisha_admin_session'
};

/* ===== DATA ===== */
const AdminStore = {
  products: JSON.parse(localStorage.getItem('aisha_products') || 'null') || [
    { id:1, name:"Robe Fleurie Bohème",    cat:"robe",       emoji:"👗", price:18500, old:25000, badge:"Nouveau", stock:15, desc:"Magnifique robe fleurie légère, parfaite pour l'été." },
    { id:2, name:"Robe Soirée Velours",    cat:"robe",       emoji:"🥻", price:34000, old:48000, badge:"Promo",   stock:8,  desc:"Robe longue pour soirée en velours satiné." },
    { id:3, name:"Top Crochet Tendance",   cat:"top",        emoji:"👚", price:8500,  old:null,  badge:"Nouveau", stock:20, desc:"Top crochet tendance, style boho chic." },
    { id:4, name:"Blouse Romantique",      cat:"top",        emoji:"👕", price:12000, old:16000, badge:"Promo",   stock:12, desc:"Blouse avec détails brodés, coupe loose." },
    { id:5, name:"Jean Taille Haute",      cat:"jean",       emoji:"👖", price:22000, old:null,  badge:null,      stock:10, desc:"Jean skinny taille haute très tendance." },
    { id:6, name:"Pantalon Large Chic",    cat:"jean",       emoji:"🩱", price:19500, old:28000, badge:"Promo",   stock:7,  desc:"Pantalon wide leg élégant." },
    { id:7, name:"Sac Bandoulière Mini",   cat:"accessoire", emoji:"👜", price:14000, old:null,  badge:"Nouveau", stock:18, desc:"Mini sac tendance, chaîne dorée." },
    { id:8, name:"Ensemble Deux Pièces",   cat:"robe",       emoji:"💃", price:28000, old:38000, badge:"Promo",   stock:5,  desc:"Set coordonné top + jupe, couleurs pastels." },
    { id:9, name:"Veste Oversize",         cat:"top",        emoji:"🧥", price:24000, old:null,  badge:"Nouveau", stock:9,  desc:"Veste oversize moderne et polyvalente." },
    { id:10,name:"Lunettes de Soleil",     cat:"accessoire", emoji:"🕶️", price:6500,  old:null,  badge:null,      stock:25, desc:"Lunettes mode protection UV400." },
    { id:11,name:"Robe Mini Imprimée",     cat:"robe",       emoji:"🌸", price:15000, old:20000, badge:"Promo",   stock:11, desc:"Robe mini imprimée vivante, style estival." },
    { id:12,name:"Ceinture Dorée Large",   cat:"accessoire", emoji:"✨", price:5500,  old:null,  badge:null,      stock:30, desc:"Ceinture dorée large pour sublimer vos tenues." },
  ],
  orders: [
    { id:'#0023', client:'Aminata Diallo',  tel:'77 123 45 67', items:'Robe Fleurie × 1', total:18500, status:'done',    date:'28 Jan 2025' },
    { id:'#0022', client:'Fatou Mbaye',     tel:'76 987 65 43', items:'Blouse × 2, Top × 1', total:32500, status:'pending', date:'27 Jan 2025' },
    { id:'#0021', client:'Mariama Ba',      tel:'78 456 78 90', items:'Jean × 1',          total:22000, status:'done',    date:'26 Jan 2025' },
    { id:'#0020', client:'Rokhaya Seck',    tel:'70 321 09 87', items:'Sac × 1, Ceinture × 1', total:19500, status:'done', date:'25 Jan 2025' },
    { id:'#0019', client:'Sokhna Ndiaye',   tel:'77 654 32 10', items:'Robe Soirée × 1',   total:34000, status:'pending', date:'24 Jan 2025' },
  ],
  messages: [
    { id:1, name:'Khadija Fall',   preview:'Bonjour, est-ce que la robe fleurie est disponible en taille XL ?', time:'10:23', read:false },
    { id:2, name:'Aissatou Sy',    preview:'Combien coûtent les frais de livraison pour Thiès ?',                 time:'09:15', read:false },
    { id:3, name:'Ndéye Gaye',     preview:'J\'ai validé mon panier Shein, quand est-ce que vous pouvez commander ?', time:'Hier',  read:true  },
    { id:4, name:'Bineta Diop',    preview:'Merci pour la livraison rapide, j\'adore ma robe !',                 time:'Hier',  read:true  },
    { id:5, name:'Coumba Ndir',    preview:'Vous avez des ensembles pour un mariage ?',                           time:'Lun',   read:true  },
  ],
  nextId: 13,
  currentPage: 'dashboard',
  editingId: null,
  filterCat: 'tout',
  selectedEmoji: '👗',
  selectedImageBase64: null,

  save() { localStorage.setItem('aisha_products', JSON.stringify(this.products)); }
};

/* ===== SESSION ===== */
function checkSession() {
  return sessionStorage.getItem(AUTH.sessionKey) === 'valid';
}
function setSession() { sessionStorage.setItem(AUTH.sessionKey, 'valid'); }
function clearSession() { sessionStorage.removeItem(AUTH.sessionKey); }

/* ===== INIT ===== */
window.addEventListener('DOMContentLoaded', () => {
  if (checkSession()) {
    showApp();
  } else {
    document.getElementById('loginPage').style.display = 'flex';
  }
});

/* ===== LOGIN ===== */
function doLogin() {
  const user = document.getElementById('loginUser').value.trim();
  const pass = document.getElementById('loginPass').value;
  const err = document.getElementById('loginError');

  if (user === AUTH.username && pass === AUTH.password) {
    err.classList.remove('show');
    setSession();
    // Animate login card out
    document.querySelector('.login-card').style.animation = 'loginOut 0.4s ease both';
    setTimeout(showApp, 400);
  } else {
    err.classList.add('show');
    err.textContent = '❌ Identifiants incorrects. Réessayez.';
    document.getElementById('loginPass').value = '';
  }
}

document.getElementById('loginForm')?.addEventListener('submit', e => {
  e.preventDefault(); doLogin();
});

document.getElementById('loginPass')?.addEventListener('keydown', e => {
  if (e.key === 'Enter') doLogin();
});

function togglePassword() {
  const inp = document.getElementById('loginPass');
  const btn = document.querySelector('.toggle-pw');
  if (inp.type === 'password') { inp.type = 'text'; btn.textContent = '🙈'; }
  else { inp.type = 'password'; btn.textContent = '👁️'; }
}

function showApp() {
  document.getElementById('loginPage').style.display = 'none';
  const app = document.getElementById('adminApp');
  app.classList.add('active');
  navigateTo('dashboard');
}

function logout() {
  clearSession();
  location.reload();
}

/* ===== NAVIGATION ===== */
function navigateTo(page) {
  AdminStore.currentPage = page;

  // Update sidebar
  document.querySelectorAll('.sidebar-link').forEach(l => {
    l.classList.toggle('active', l.dataset.page === page);
  });

  // Update topbar title
  const titles = {
    dashboard: '📊 Tableau de bord',
    products:  '🛍️ Produits',
    orders:    '📦 Commandes',
    messages:  '💬 Messages',
    settings:  '⚙️ Paramètres'
  };
  document.getElementById('pageTitle').textContent = titles[page] || page;

  // Render content
  const area = document.getElementById('contentArea');
  switch(page) {
    case 'dashboard': area.innerHTML = renderDashboard(); break;
    case 'products':  area.innerHTML = renderProductsPage(); break;
    case 'orders':    area.innerHTML = renderOrdersPage(); break;
    case 'messages':  area.innerHTML = renderMessagesPage(); break;
    case 'settings':  area.innerHTML = renderSettings(); break;
  }
}

/* ===== HELPERS ===== */
function fmt(n) { return n ? n.toLocaleString('fr-FR') + ' F' : '–'; }
function catLabel(cat) {
  return { robe:'Robes', top:'Tops & Blouses', jean:'Jeans & Pantalons', accessoire:'Accessoires' }[cat] || cat;
}

/* ===== DASHBOARD ===== */
function renderDashboard() {
  const totalRevenu = AdminStore.orders.filter(o=>o.status==='done').reduce((s,o)=>s+o.total,0);
  const totalArticles = AdminStore.products.length;
  const totalStock = AdminStore.products.reduce((s,p)=>s+p.stock,0);
  const commandesEnCours = AdminStore.orders.filter(o=>o.status==='pending').length;

  return `
  <div class="stats-cards">
    <div class="stat-card">
      <div class="stat-top">
        <div class="stat-icon pink">💰</div>
        <span class="stat-trend up">↑ 12%</span>
      </div>
      <div class="stat-value">${fmt(totalRevenu)}</div>
      <div class="stat-label">Revenu total</div>
    </div>
    <div class="stat-card">
      <div class="stat-top">
        <div class="stat-icon wine">🛍️</div>
        <span class="stat-trend up">↑ 5%</span>
      </div>
      <div class="stat-value">${totalArticles}</div>
      <div class="stat-label">Articles en ligne</div>
    </div>
    <div class="stat-card">
      <div class="stat-top">
        <div class="stat-icon green">📦</div>
        <span class="stat-trend ${commandesEnCours > 0 ? 'up' : 'down'}">${commandesEnCours} en cours</span>
      </div>
      <div class="stat-value">${AdminStore.orders.length}</div>
      <div class="stat-label">Total commandes</div>
    </div>
    <div class="stat-card">
      <div class="stat-top">
        <div class="stat-icon gold">📊</div>
        <span class="stat-trend up">Bon</span>
      </div>
      <div class="stat-value">${totalStock}</div>
      <div class="stat-label">Articles en stock</div>
    </div>
  </div>

  <div class="admin-grid-2">
    <div class="admin-card">
      <div class="admin-card-title">
        Commandes récentes
        <button class="view-all" onclick="navigateTo('orders')">Voir tout →</button>
      </div>
      <table class="admin-table">
        <thead><tr><th>N°</th><th>Cliente</th><th>Articles</th><th>Total</th><th>Statut</th></tr></thead>
        <tbody>
          ${AdminStore.orders.slice(0,4).map(o => `
          <tr>
            <td><strong>${o.id}</strong></td>
            <td>${o.client}</td>
            <td style="color:var(--muted);font-size:0.8rem">${o.items}</td>
            <td>${fmt(o.total)}</td>
            <td><span class="status-pill ${o.status}">${o.status==='done'?'✅ Livré':'⏳ En cours'}</span></td>
          </tr>`).join('')}
        </tbody>
      </table>
    </div>
    <div class="admin-card">
      <div class="admin-card-title">
        Stock faible
        <button class="view-all" onclick="navigateTo('products')">Gérer →</button>
      </div>
      ${AdminStore.products.filter(p=>p.stock<=10).map(p=>`
      <div style="display:flex;align-items:center;gap:0.8rem;padding:0.7rem 0;border-bottom:1px solid var(--border)">
        <div style="width:38px;height:44px;background:linear-gradient(145deg,var(--blush),var(--blush-mid));border-radius:4px;display:flex;align-items:center;justify-content:center;font-size:1.3rem;flex-shrink:0">${p.emoji}</div>
        <div style="flex:1">
          <div style="font-size:0.85rem;font-weight:600">${p.name}</div>
          <div style="font-size:0.75rem;color:var(--muted)">${catLabel(p.cat)}</div>
        </div>
        <span class="status-pill ${p.stock<=5?'sold':'pending'}">${p.stock} restants</span>
      </div>`).join('')}
    </div>
  </div>

  <div class="admin-card">
    <div class="admin-card-title">Messages non lus
      <button class="view-all" onclick="navigateTo('messages')">Voir tout →</button>
    </div>
    <div class="messages-list">
      ${AdminStore.messages.filter(m=>!m.read).map(m=>`
      <div class="msg-card unread" onclick="navigateTo('messages')">
        <div class="msg-avatar">🧑🏾</div>
        <div style="flex:1">
          <div class="msg-name">${m.name}</div>
          <div class="msg-preview">${m.preview.substring(0,60)}...</div>
        </div>
        <span class="msg-time">${m.time}</span>
        <div class="unread-dot"></div>
      </div>`).join('') || '<p style="color:var(--muted);font-size:0.85rem">Aucun message non lu</p>'}
    </div>
  </div>`;
}

/* ===== PRODUCTS PAGE ===== */
function renderProductsPage() {
  let list = AdminStore.products;
  if (AdminStore.filterCat !== 'tout') list = list.filter(p=>p.cat===AdminStore.filterCat);

  return `
  <div class="page-header">
    <div>
      <h2 style="font-family:'Cormorant Garamond',serif;font-size:1.6rem">Gestion des produits</h2>
      <p style="color:var(--muted);font-size:0.85rem;margin-top:0.3rem">${AdminStore.products.length} articles au total</p>
    </div>
    <button class="btn-add-product" onclick="openProductForm()">+ Ajouter un article</button>
  </div>

  <div class="products-filters">
    <select class="filter-select" onchange="adminFilterCat(this.value)">
      <option value="tout">Toutes catégories</option>
      <option value="robe">Robes</option>
      <option value="top">Tops & Blouses</option>
      <option value="jean">Jeans & Pantalons</option>
      <option value="accessoire">Accessoires</option>
    </select>
    <select class="filter-select" onchange="adminFilterBadge(this.value)">
      <option value="">Tous les statuts</option>
      <option value="Nouveau">Nouveau</option>
      <option value="Promo">Promotion</option>
    </select>
    <div class="search-field">
      <span>🔍</span>
      <input type="text" placeholder="Rechercher un article..." oninput="adminSearch(this.value)">
    </div>
  </div>

  <div class="admin-products-grid" id="adminProductGrid">
    ${list.map(p=>`
    <div class="admin-product-card">
      <div class="admin-prod-img" style="${p.img?'background:#f0d0d4':''}" >
        ${p.badge?`<span class="admin-prod-badge"><span class="status-pill ${p.badge==='Promo'?'promo':'new'}">${p.badge}</span></span>`:''}
        ${p.img
          ? `<img src="${p.img}" alt="${p.name}" style="width:100%;height:100%;object-fit:cover;position:absolute;inset:0;border-radius:0">`
          : `<span style="font-size:4rem">${p.emoji}</span>`}
        <div class="admin-prod-overlay">
          <button class="admin-overlay-btn" onclick="editProduct(${p.id})" title="Modifier">✏️</button>
          <button class="admin-overlay-btn" onclick="deleteProduct(${p.id})" title="Supprimer">🗑️</button>
        </div>
      </div>
      <div class="admin-prod-body">
        <div class="admin-prod-name">${p.name}</div>
        <div class="admin-prod-cat">${catLabel(p.cat)}</div>
        <div class="admin-prod-foot">
          <span class="admin-prod-price">${fmt(p.price)}</span>
          <span class="status-pill ${p.stock<=5?'sold':p.stock<=10?'pending':'active'}">${p.stock} stock</span>
        </div>
      </div>
    </div>`).join('')}
  </div>

  ${renderProductFormModal()}`;
}

function renderProductFormModal() {
  return `
  <div class="form-modal-overlay" id="productFormModal">
    <div class="form-modal">
      <div class="form-modal-head">
        <h3 id="formTitle">Ajouter un article</h3>
        <button class="modal-x" onclick="closeProductForm()">✕</button>
      </div>
      <div class="form-modal-body">
        <div class="form-field">
          <label>📸 Photo du produit</label>
          <div id="imgPreviewBox" style="width:100%;aspect-ratio:3/2;background:linear-gradient(145deg,#f9d9d9,#f2b8b8);border-radius:12px;border:2px dashed #e89090;display:flex;flex-direction:column;align-items:center;justify-content:center;cursor:pointer;position:relative;overflow:hidden;margin-bottom:0.8rem;transition:all 0.3s" onclick="document.getElementById('fImgUpload').click()">
            <div id="imgPreviewContent" style="text-align:center;pointer-events:none">
              <div style="font-size:2.5rem;margin-bottom:0.5rem">📷</div>
              <div style="font-size:0.8rem;font-weight:600;color:#5c1a2e">Cliquer pour uploader une photo</div>
              <div style="font-size:0.7rem;color:#9a7070;margin-top:0.3rem">JPG, PNG — depuis téléphone ou PC</div>
            </div>
          </div>
          <input type="file" id="fImgUpload" accept="image/*" style="display:none" onchange="handleImgUpload(this)">
          <div style="display:flex;gap:0.5rem;align-items:center">
            <span style="font-size:0.7rem;color:#9a7070;font-weight:600">OU LIEN URL :</span>
            <input type="text" id="fImgUrl" placeholder="https://img.shein.com/..." style="flex:1;padding:0.5rem 0.8rem;border:1.5px solid #f0d0d4;border-radius:6px;font-size:0.8rem;outline:none;font-family:Jost,sans-serif" oninput="handleImgUrl(this.value)">
            <button type="button" onclick="clearImg()" style="background:#fef2f2;border:1px solid #fecaca;color:#dc2626;padding:0.5rem 0.8rem;border-radius:6px;font-size:0.75rem;cursor:pointer;font-family:Jost,sans-serif">Effacer</button>
          </div>
        </div>
        <div class="form-field">
          <label>Emoji de remplacement (si pas de photo)</label>
          <div class="emoji-picker" id="emojiPicker">
            ${['👗','🥻','👚','👕','👖','🩱','👜','💃','🧥','🕶️','🌸','✨','👠','💍','🎀','🧣'].map(e=>`
            <span class="emoji-opt ${e===AdminStore.selectedEmoji?'selected':''}" onclick="selectEmoji('${e}',this)">${e}</span>`).join('')}
          </div>
        </div>
        <div class="form-2col">
          <div class="form-field" style="grid-column:1/-1">
            <label>Nom de l'article</label>
            <input type="text" id="fName" placeholder="Ex: Robe Fleurie Bohème">
          </div>
          <div class="form-field">
            <label>Catégorie</label>
            <select id="fCat">
              <option value="robe">Robes</option>
              <option value="top">Tops & Blouses</option>
              <option value="jean">Jeans & Pantalons</option>
              <option value="accessoire">Accessoires</option>
            </select>
          </div>
          <div class="form-field">
            <label>Badge</label>
            <select id="fBadge">
              <option value="">Aucun badge</option>
              <option value="Nouveau">Nouveau</option>
              <option value="Promo">Promo</option>
            </select>
          </div>
          <div class="form-field">
            <label>Prix (FCFA)</label>
            <input type="number" id="fPrice" placeholder="15000">
          </div>
          <div class="form-field">
            <label>Ancien prix (FCFA, optionnel)</label>
            <input type="number" id="fOld" placeholder="20000">
          </div>
          <div class="form-field">
            <label>Stock disponible</label>
            <input type="number" id="fStock" placeholder="10" value="10">
          </div>
          <div class="form-field" style="grid-column:1/-1">
            <label>Description</label>
            <textarea id="fDesc" rows="3" placeholder="Description du produit..."></textarea>
          </div>
        </div>
      </div>
      <div class="form-modal-foot">
        <button class="btn-cancel" onclick="closeProductForm()">Annuler</button>
        <button class="btn-save" onclick="saveProduct()">💾 Enregistrer</button>
      </div>
    </div>
  </div>`;
}

function openProductForm(id = null) {
  AdminStore.editingId = id;
  const modal = document.getElementById('productFormModal');
  if (!modal) { navigateTo('products'); setTimeout(()=>openProductForm(id),100); return; }
  
  document.getElementById('formTitle').textContent = id ? 'Modifier l\'article' : 'Ajouter un article';

  if (id) {
    const p = AdminStore.products.find(p=>p.id===id);
    if (!p) return;
    document.getElementById('fName').value = p.name;
    document.getElementById('fCat').value = p.cat;
    document.getElementById('fBadge').value = p.badge || '';
    document.getElementById('fPrice').value = p.price;
    document.getElementById('fOld').value = p.old || '';
    document.getElementById('fStock').value = p.stock;
    document.getElementById('fDesc').value = p.desc;
    AdminStore.selectedEmoji = p.emoji;
    AdminStore.selectedImageBase64 = p.img || null;
    document.querySelectorAll('.emoji-opt').forEach(el => {
      el.classList.toggle('selected', el.textContent === p.emoji);
    });
    // Show existing image preview
    if (p.img) {
      showImgPreview(p.img);
      if (p.img.startsWith('http')) document.getElementById('fImgUrl').value = p.img;
    }
  } else {
    document.getElementById('fName').value = '';
    document.getElementById('fPrice').value = '';
    document.getElementById('fOld').value = '';
    document.getElementById('fStock').value = '10';
    document.getElementById('fDesc').value = '';
    AdminStore.selectedImageBase64 = null;
  }

  modal.classList.add('open');
}

function closeProductForm() {
  document.getElementById('productFormModal')?.classList.remove('open');
  AdminStore.selectedImageBase64 = null;
}

/* ===== IMAGE HANDLERS ===== */
function handleImgUpload(input) {
  const file = input.files[0];
  if (!file) return;
  if (file.size > 5 * 1024 * 1024) { showAdminToast('⚠️ Photo trop grande (max 5MB)'); return; }
  const reader = new FileReader();
  reader.onload = e => {
    AdminStore.selectedImageBase64 = e.target.result;
    document.getElementById('fImgUrl').value = '';
    showImgPreview(e.target.result);
    showAdminToast('✅ Photo chargée !');
  };
  reader.readAsDataURL(file);
}

function handleImgUrl(url) {
  if (!url) { clearImg(); return; }
  AdminStore.selectedImageBase64 = null;
  showImgPreview(url);
}

function showImgPreview(src) {
  const box = document.getElementById('imgPreviewBox');
  if (!box) return;
  box.innerHTML = `
    <img src="${src}" style="width:100%;height:100%;object-fit:cover;position:absolute;inset:0;border-radius:10px" onerror="this.style.display='none'">
    <div style="position:absolute;bottom:0.5rem;right:0.5rem;background:rgba(26,8,16,0.7);color:white;font-size:0.7rem;padding:0.3rem 0.6rem;border-radius:4px;cursor:pointer" onclick="document.getElementById('fImgUpload').click()">Changer 📷</div>
  `;
}

function clearImg() {
  AdminStore.selectedImageBase64 = null;
  const url = document.getElementById('fImgUrl');
  if (url) url.value = '';
  const box = document.getElementById('imgPreviewBox');
  if (box) box.innerHTML = `
    <div style="text-align:center;pointer-events:none">
      <div style="font-size:2.5rem;margin-bottom:0.5rem">📷</div>
      <div style="font-size:0.8rem;font-weight:600;color:#5c1a2e">Cliquer pour uploader une photo</div>
      <div style="font-size:0.7rem;color:#9a7070;margin-top:0.3rem">JPG, PNG — depuis téléphone ou PC</div>
    </div>`;
}

function selectEmoji(emoji, el) {
  AdminStore.selectedEmoji = emoji;
  document.querySelectorAll('.emoji-opt').forEach(e => e.classList.remove('selected'));
  el.classList.add('selected');
}

function saveProduct() {
  const name = document.getElementById('fName').value.trim();
  const price = parseInt(document.getElementById('fPrice').value);

  if (!name || !price) { showAdminToast('⚠️ Nom et prix obligatoires'); return; }

  const imgUrl = document.getElementById('fImgUrl')?.value.trim() || '';
  const data = {
    name,
    cat:   document.getElementById('fCat').value,
    badge: document.getElementById('fBadge').value || null,
    price,
    old:   parseInt(document.getElementById('fOld').value) || null,
    stock: parseInt(document.getElementById('fStock').value) || 0,
    desc:  document.getElementById('fDesc').value.trim(),
    emoji: AdminStore.selectedEmoji,
    img:   AdminStore.selectedImageBase64 || (imgUrl || null),
  };

  if (AdminStore.editingId) {
    const idx = AdminStore.products.findIndex(p=>p.id===AdminStore.editingId);
    AdminStore.products[idx] = { ...AdminStore.products[idx], ...data };
    showAdminToast('✅ Article modifié !');
  } else {
    AdminStore.products.push({ id: AdminStore.nextId++, ...data });
    showAdminToast('✅ Article ajouté !');
  }

  AdminStore.save();
  closeProductForm();
  navigateTo('products');
}

function editProduct(id) { openProductForm(id); }

function deleteProduct(id) {
  if (!confirm('Supprimer cet article définitivement ?')) return;
  const idx = AdminStore.products.findIndex(p=>p.id===id);
  if (idx !== -1) { AdminStore.products.splice(idx,1); AdminStore.save(); }
  navigateTo('products');
  showAdminToast('🗑️ Article supprimé');
}

function adminFilterCat(cat) { AdminStore.filterCat = cat; navigateTo('products'); }
function adminSearch(q) {
  const cards = document.querySelectorAll('.admin-product-card');
  cards.forEach(card => {
    const name = card.querySelector('.admin-prod-name').textContent.toLowerCase();
    card.style.display = name.includes(q.toLowerCase()) ? '' : 'none';
  });
}
function adminFilterBadge(badge) {
  const cards = document.querySelectorAll('.admin-product-card');
  cards.forEach(card => {
    if (!badge) { card.style.display=''; return; }
    const hasBadge = card.querySelector('.admin-prod-badge')?.textContent.includes(badge);
    card.style.display = hasBadge ? '' : 'none';
  });
}

/* ===== ORDERS ===== */
function renderOrdersPage() {
  return `
  <div class="page-header">
    <div>
      <h2 style="font-family:'Cormorant Garamond',serif;font-size:1.6rem">Commandes</h2>
      <p style="color:var(--muted);font-size:0.85rem;margin-top:0.3rem">${AdminStore.orders.length} commandes au total</p>
    </div>
    <div style="display:flex;gap:0.8rem">
      <button class="btn-add-product" style="background:var(--green)" onclick="exportOrders()">📥 Exporter</button>
    </div>
  </div>

  <div style="display:flex;gap:1rem;margin-bottom:1.5rem;flex-wrap:wrap">
    <div class="qs-item" style="flex:1;min-width:140px">
      <div class="qs-icon">✅</div>
      <div><div class="qs-val">${AdminStore.orders.filter(o=>o.status==='done').length}</div><div class="qs-lbl">Livrées</div></div>
    </div>
    <div class="qs-item" style="flex:1;min-width:140px">
      <div class="qs-icon">⏳</div>
      <div><div class="qs-val">${AdminStore.orders.filter(o=>o.status==='pending').length}</div><div class="qs-lbl">En cours</div></div>
    </div>
    <div class="qs-item" style="flex:1;min-width:140px">
      <div class="qs-icon">💰</div>
      <div><div class="qs-val">${fmt(AdminStore.orders.filter(o=>o.status==='done').reduce((s,o)=>s+o.total,0))}</div><div class="qs-lbl">Revenu</div></div>
    </div>
  </div>

  <div class="admin-card">
    <table class="admin-table">
      <thead><tr><th>N° Commande</th><th>Cliente</th><th>Téléphone</th><th>Articles</th><th>Total</th><th>Date</th><th>Statut</th><th>Actions</th></tr></thead>
      <tbody>
        ${AdminStore.orders.map(o=>`
        <tr>
          <td><strong style="color:var(--wine)">${o.id}</strong></td>
          <td><strong>${o.client}</strong></td>
          <td style="color:var(--muted)">${o.tel}</td>
          <td style="font-size:0.8rem;color:var(--muted)">${o.items}</td>
          <td><strong>${fmt(o.total)}</strong></td>
          <td style="color:var(--muted);font-size:0.8rem">${o.date}</td>
          <td><span class="status-pill ${o.status}">${o.status==='done'?'✅ Livré':'⏳ En cours'}</span></td>
          <td>
            <div class="action-btns">
              <button class="action-btn edit" onclick="toggleOrderStatus('${o.id}')" title="Changer statut">🔄</button>
              <button class="action-btn" onclick="contactClient('${o.tel}','${o.client}')" style="background:rgba(37,211,102,0.1);color:#16a34a" title="Contacter">📱</button>
            </div>
          </td>
        </tr>`).join('')}
      </tbody>
    </table>
  </div>`;
}

function toggleOrderStatus(id) {
  const o = AdminStore.orders.find(o=>o.id===id);
  if (!o) return;
  o.status = o.status==='done'?'pending':'done';
  showAdminToast('✅ Statut mis à jour');
  navigateTo('orders');
}

function contactClient(tel, name) {
  const msg = `Bonjour ${name} ! Votre commande chez Aïsha-T Shop est prête. 📦✨`;
  window.open(`https://wa.me/${tel.replace(/\s/g,'')}?text=${encodeURIComponent(msg)}`, '_blank');
}

function exportOrders() {
  const rows = ['N°,Cliente,Téléphone,Articles,Total,Date,Statut'];
  AdminStore.orders.forEach(o => {
    rows.push(`${o.id},"${o.client}",${o.tel},"${o.items}",${o.total},${o.date},${o.status==='done'?'Livré':'En cours'}`);
  });
  const blob = new Blob([rows.join('\n')], {type:'text/csv;charset=utf-8;'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a'); a.href=url; a.download='commandes-aisha.csv'; a.click();
  showAdminToast('📥 Export CSV téléchargé !');
}

/* ===== MESSAGES ===== */
function renderMessagesPage() {
  return `
  <div class="page-header">
    <h2 style="font-family:'Cormorant Garamond',serif;font-size:1.6rem">Messages</h2>
    <button class="btn-add-product" onclick="markAllRead()">✅ Tout marquer lu</button>
  </div>
  <div class="messages-list">
    ${AdminStore.messages.map(m=>`
    <div class="msg-card ${m.read?'':'unread'}" onclick="openMsg(${m.id})">
      <div class="msg-avatar">🧑🏾</div>
      <div style="flex:1">
        <div class="msg-name" style="${!m.read?'font-weight:700':''}">${m.name}</div>
        <div class="msg-preview">${m.preview.substring(0,70)}...</div>
      </div>
      <span class="msg-time">${m.time}</span>
      ${!m.read?'<div class="unread-dot"></div>':''}
    </div>`).join('')}
  </div>`;
}

function openMsg(id) {
  const m = AdminStore.messages.find(m=>m.id===id);
  if (!m) return;
  m.read = true;
  alert(`De : ${m.name}\n\n${m.preview}`);
  navigateTo('messages');
}

function markAllRead() {
  AdminStore.messages.forEach(m=>m.read=true);
  navigateTo('messages');
  showAdminToast('✅ Tous les messages marqués comme lus');
}

/* ===== SETTINGS ===== */
function renderSettings() {
  return `
  <div class="page-header">
    <h2 style="font-family:'Cormorant Garamond',serif;font-size:1.6rem">Paramètres</h2>
  </div>
  <div class="admin-grid-2">
    <div class="admin-card">
      <h3 style="font-family:'Cormorant Garamond',serif;font-size:1.2rem;margin-bottom:1.5rem">🔐 Modifier le mot de passe</h3>
      <div class="form-field"><label>Ancien mot de passe</label><input type="password" id="sPwOld" placeholder="••••••••"></div>
      <div class="form-field"><label>Nouveau mot de passe</label><input type="password" id="sPwNew" placeholder="••••••••"></div>
      <div class="form-field"><label>Confirmer</label><input type="password" id="sPwConf" placeholder="••••••••"></div>
      <button class="btn-save" onclick="changePassword()">Changer le mot de passe</button>
    </div>
    <div class="admin-card">
      <h3 style="font-family:'Cormorant Garamond',serif;font-size:1.2rem;margin-bottom:1.5rem">📱 Infos boutique</h3>
      <div class="form-field"><label>Numéro WhatsApp</label><input type="tel" placeholder="+221 77 XXX XX XX" value="+221 77 252 04 11"></div>
      <div class="form-field"><label>Instagram</label><input type="text" placeholder="@aisha_t_shop" value="@aisha_t_shop"></div>
      <div class="form-field"><label>Message de bienvenue WhatsApp</label><textarea rows="3" placeholder="Bonjour ! Bienvenue chez Aïsha-T Shop...">Bonjour ! 🌸 Bienvenue chez Aïsha-T Shop. Comment puis-je vous aider ?</textarea></div>
      <button class="btn-save" onclick="showAdminToast('✅ Informations sauvegardées !')">Sauvegarder</button>
    </div>
    <div class="admin-card">
      <h3 style="font-family:'Cormorant Garamond',serif;font-size:1.2rem;margin-bottom:1.5rem">🛒 Service Shein — Tarifs</h3>
      <div class="form-field"><label>Frais panier < 20 000 F</label><input type="number" value="1000" min="0"></div>
      <div class="form-field"><label>Frais panier 20 000 – 50 000 F</label><input type="number" value="2000" min="0"></div>
      <div class="form-field"><label>Frais panier 50 000 – 100 000 F</label><input type="number" value="3000" min="0"></div>
      <button class="btn-save" onclick="showAdminToast('✅ Tarifs mis à jour !')">Sauvegarder les tarifs</button>
    </div>
    <div class="admin-card">
      <h3 style="font-family:'Cormorant Garamond',serif;font-size:1.2rem;margin-bottom:1.5rem">🎨 Données</h3>
      <p style="color:var(--muted);font-size:0.85rem;line-height:1.7;margin-bottom:1.5rem">Gérez les données de la boutique. La réinitialisation supprime tous les articles personnalisés.</p>
      <button class="btn-save" style="background:var(--red);margin-bottom:0.8rem;width:100%" onclick="resetData()">⚠️ Réinitialiser les données</button>
    </div>
  </div>`;
}

function changePassword() {
  const old = document.getElementById('sPwOld').value;
  const nw = document.getElementById('sPwNew').value;
  const conf = document.getElementById('sPwConf').value;
  if (old !== AUTH.password) { showAdminToast('❌ Ancien mot de passe incorrect'); return; }
  if (nw !== conf) { showAdminToast('❌ Les mots de passe ne correspondent pas'); return; }
  if (nw.length < 6) { showAdminToast('❌ Minimum 6 caractères'); return; }
  AUTH.password = nw;
  showAdminToast('✅ Mot de passe changé !');
}

function resetData() {
  if (!confirm('Supprimer toutes les données personnalisées ? Cette action est irréversible.')) return;
  localStorage.removeItem('aisha_products');
  showAdminToast('✅ Données réinitialisées. Rechargez la page.');
}

/* ===== ADMIN TOAST ===== */
let adminToastTimer;
function showAdminToast(msg) {
  let t = document.getElementById('adminToast');
  if (!t) {
    t = document.createElement('div');
    t.id = 'adminToast';
    t.style.cssText = 'position:fixed;bottom:2rem;left:50%;transform:translateX(-50%) translateY(100px);background:var(--dark);color:white;padding:0.9rem 2rem;border-radius:50px;font-size:0.85rem;font-weight:500;z-index:9999;opacity:0;transition:all 0.4s cubic-bezier(0.34,1.56,0.64,1);pointer-events:none;white-space:nowrap;font-family:Jost,sans-serif';
    document.body.appendChild(t);
  }
  t.textContent = msg;
  t.style.transform = 'translateX(-50%) translateY(0)';
  t.style.opacity = '1';
  clearTimeout(adminToastTimer);
  adminToastTimer = setTimeout(() => {
    t.style.transform = 'translateX(-50%) translateY(100px)';
    t.style.opacity = '0';
  }, 3000);
}

/* ===== SIDEBAR MOBILE ===== */
function toggleSidebar() {
  document.querySelector('.sidebar')?.classList.toggle('open');
}
