// main.js — UI behaviors, rendering products, animations
document.addEventListener('DOMContentLoaded',()=>{
  setupNav();
  setupSearch();
  setupSignIn();
  renderProductsForPage();
  setupFadeInOnScroll();
  updateUserButtonStatus();
  setupHomepageAllProducts();
});

function setupSearch(){
  const searchBtn = document.querySelector('.icon.search');
  const searchInput = document.getElementById('search-input');
  const searchModal = document.getElementById('search-modal');
  
  if(searchBtn) searchBtn.addEventListener('click',()=>{
    searchModal.classList.add('active');
    searchInput.focus();
  });
  
  if(searchInput){
    searchInput.addEventListener('input',(e)=>{
      const query = e.target.value.toLowerCase();
      const results = document.getElementById('search-results');
      if(!query){
        results.innerHTML='<div style="padding:2rem;color:var(--muted);text-align:center">Start typing to search...</div>';
        return;
      }
      const filtered = window.PRODUCTS.filter(p=>
        p.name.toLowerCase().includes(query) || 
        p.category.toLowerCase().includes(query)
      );
      if(filtered.length===0){
        results.innerHTML='<div style="padding:2rem;color:var(--muted);text-align:center">No products found</div>';
        return;
      }
      results.innerHTML=filtered.map(p=>`
        <div class="search-result-item" onclick="location.href='${categoryToPage(p.category)}'">
          <img src="${p.img}" alt="${p.name}">
          <div>
            <div class="search-result-name">${p.name}</div>
            <div class="search-result-category">${p.category}</div>
            <div class="search-result-price">₹${p.price.toFixed(0)}</div>
          </div>
        </div>
      `).join('');
    });
  }
}

function closeSearch(){
  const modal = document.getElementById('search-modal');
  if(modal) modal.classList.remove('active');
}

// close search on escape
document.addEventListener('keydown',e=>{
  if(e.key==='Escape') closeSearch();
});

function setupSignIn(){
  const userBtn = document.querySelector('.icon.user');
  const signinModal = document.getElementById('signin-modal');
  
  if(userBtn) userBtn.addEventListener('click',()=>{
    signinModal.classList.add('active');
    document.getElementById('signin-email').focus();
  });
}

function closeSignIn(){
  const modal = document.getElementById('signin-modal');
  if(modal) modal.classList.remove('active');
  // Reset form
  const form = document.getElementById('signin-form');
  const successDiv = document.getElementById('signin-success');
  if(form) form.style.display = 'block';
  if(successDiv) successDiv.style.display = 'none';
  if(form) form.reset();
}

function handleSignIn(event){
  event.preventDefault();
  const email = document.getElementById('signin-email').value;
  
  // Simple email validation
  if(!email || !email.includes('@')){
    alert('Please enter a valid email address');
    return;
  }
  
  // Store user data in localStorage
  localStorage.setItem('otaku_user', JSON.stringify({
    email: email,
    signedInAt: new Date().toISOString()
  }));
  
  // Show success message
  const form = document.getElementById('signin-form');
  const successDiv = document.getElementById('signin-success');
  if(form) form.style.display = 'none';
  if(successDiv) successDiv.style.display = 'block';
  
  // Update user button
  updateUserButtonStatus();
  
  // Auto close after 2 seconds
  setTimeout(closeSignIn, 2000);
}

function updateUserButtonStatus(){
  const user = JSON.parse(localStorage.getItem('otaku_user') || 'null');
  const userBtn = document.querySelector('.icon.user');
  if(userBtn){
    if(user){
      userBtn.textContent = '✓';
      userBtn.style.color = '#2fe5e5';
      userBtn.title = `Signed in as ${user.email}`;
    } else {
      userBtn.textContent = '👤';
      userBtn.style.color = 'inherit';
      userBtn.title = 'Sign in';
    }
  }
}

// On homepage, make the "All Products" trending pill load products below without changing the hero
function setupHomepageAllProducts(){
  const isHome = document.body.dataset.page === 'home';
  const allBtn = document.querySelector('.all-products-home');
  if(!isHome || !allBtn) return;

  allBtn.addEventListener('click', (e) => {
    e.preventDefault();
    const grid = document.getElementById('products-grid');
    if(!grid) return;

    // Clear and render full product list (preserve hero above)
    grid.innerHTML = '';
    window.PRODUCTS.forEach(p => {
      const card = document.createElement('article');
      card.className = 'card product-card';
      const stars = Math.round(p.rating);
      const starChars = '★'.repeat(stars) + '☆'.repeat(5-stars);
      card.innerHTML = `
        <img src="${p.img}" alt="${p.name}">
        <div class="card-body">
          <div style="display:flex;justify-content:space-between;align-items:start;gap:1rem">
            <div>
              <div class="product-title">${p.name}</div>
              <div class="muted">${p.category}</div>
            </div>
            <div style="text-align:right">
              <div class="price">₹${p.price.toFixed(0)}</div>
              <div class="muted">${p.reviews} reviews</div>
            </div>
          </div>
          <div class="product-actions">
            <div class="rating">${starChars} <span class="muted">${p.rating.toFixed(1)}</span></div>
            <div style="margin-left:auto;display:flex;gap:.5rem;align-items:center">
              <button class="btn ghost" onclick="location.href='${categoryToPage(p.category)}'">View</button>
              <button class="btn" onclick="addToCart('${p.id}')">Add to Cart</button>
            </div>
          </div>
        </div>
      `;
      grid.appendChild(card);
    });

    // Smooth scroll to products section without altering hero
    grid.scrollIntoView({behavior: 'smooth'});
  });
}


function setupNav(){
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');
  toggle && toggle.addEventListener('click',()=>{
    links.style.display = links.style.display === 'flex' ? 'none' : 'flex';
  });
  // highlight active category link
  const page = document.body.dataset.page;
  document.querySelectorAll('.nav-links a, .categories a').forEach(a=>{
    if(a.getAttribute('href') && a.getAttribute('href').includes(page)){
      a.classList.add('active');
    }
  });
}

function renderProductsForPage(){
  const grid = document.getElementById('products-grid'); if(!grid) return;
  const page = document.body.dataset.page;
  let list = window.PRODUCTS.slice();
  if(page && page !== 'all-products' && page !== 'home'){
    // Map page identifiers to categories
    const map = {clothing:'Clothing',figures:'Figures',posters:'Posters',accessories:'Accessories'};
    list = list.filter(p=>p.category === map[page]);
  }
  // On home page, show featured subset
  if(page==='home') list = list.slice(0,6);

  grid.innerHTML = '';
  list.forEach(p=>{
    const card = document.createElement('article'); card.className='card product-card';
    // build star display
    const stars = Math.round(p.rating);
    const starChars = '★'.repeat(stars) + '☆'.repeat(5-stars);
    card.innerHTML = `
      <img src="${p.img}" alt="${p.name}">
      <div class="card-body">
        <div style="display:flex;justify-content:space-between;align-items:start;gap:1rem">
          <div>
            <div class="product-title">${p.name}</div>
            <div class="muted">${p.category}</div>
          </div>
          <div style="text-align:right">
            <div class="price">₹${p.price.toFixed(0)}</div>
            <div class="muted">${p.reviews} reviews</div>
          </div>
        </div>
        <div class="product-actions">
          <div class="rating">${starChars} <span class="muted">${p.rating.toFixed(1)}</span></div>
          <div style="margin-left:auto;display:flex;gap:.5rem;align-items:center">
            <button class="btn ghost" onclick="location.href='${categoryToPage(p.category)}'">View</button>
            <button class="btn" onclick="addToCart('${p.id}')">Add to Cart</button>
          </div>
        </div>
      </div>
    `;
    grid.appendChild(card);
  });
}

function categoryToPage(cat){
  return {
    'Clothing':'clothing.html',
    'Figures':'figures.html',
    'Posters':'posters.html',
    'Accessories':'accessories.html'
  }[cat] || 'all-products.html';
}

function setupFadeInOnScroll(){
  const obs = new IntersectionObserver(entries=>{
    entries.forEach(en=>{ if(en.isIntersecting) en.target.classList.add('in-view'); });
  },{threshold:.12});
  document.querySelectorAll('.fade-up').forEach(el=>obs.observe(el));
}
