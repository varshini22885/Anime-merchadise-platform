// cart.js — manages cart state in localStorage and exposes addToCart
(function(){
  const KEY = 'otaku_cart_v1';

  function getCart(){
    try{ return JSON.parse(localStorage.getItem(KEY)) || {}; }catch(e){return {}};
  }

  function saveCart(cart){ localStorage.setItem(KEY, JSON.stringify(cart)); }

  function addToCart(id){
    const cart = getCart();
    cart[id] = (cart[id] || 0) + 1;
    saveCart(cart);
    updateCartCount();
    // simple UI feedback
    const el = document.getElementById('cart-count'); if(el) el.classList.add('pulse');
    setTimeout(()=>el && el.classList.remove('pulse'),300);
  }

  function removeFromCart(id){
    const cart=getCart(); delete cart[id]; saveCart(cart); renderCartPage(); updateCartCount();
  }

  function setQty(id,qty){
    const cart=getCart(); if(qty<=0) delete cart[id]; else cart[id]=qty; saveCart(cart); renderCartPage(); updateCartCount();
  }

  function updateCartCount(){
    const cart = getCart(); const total = Object.values(cart).reduce((s,n)=>s+n,0);
    const el = document.getElementById('cart-count'); if(el) el.textContent = total;
    const countSummary = document.getElementById('summary-count'); if(countSummary) countSummary.textContent = total;
  }

  function renderCartPage(){
    if(document.body.dataset.page !== 'cart') return;
    const cart = getCart(); const list = document.getElementById('cart-list'); list.innerHTML='';
    const ids = Object.keys(cart);
    if(ids.length===0){ list.innerHTML='<div class="empty">Your cart is empty.</div>'; document.getElementById('summary-total').textContent='₹0'; return; }
    let total=0; ids.forEach(id=>{
      const p = window.PRODUCTS.find(x=>x.id===id);
      const qty = cart[id];
      if(!p) return;
      total += p.price*qty;
      const item = document.createElement('div'); item.className='cart-item';
      item.innerHTML = `
        <img src="${p.img}" alt="${p.name}">
        <div>
          <div class="product-title">${p.name}</div>
          <div class="muted">${p.category} • ₹${p.price.toFixed(0)}</div>
          <div class="qty-controls">
            <button class="btn ghost" data-action="dec" data-id="${p.id}">-</button>
            <div>${qty}</div>
            <button class="btn ghost" data-action="inc" data-id="${p.id}">+</button>
            <button class="btn" data-action="remove" data-id="${p.id}">Remove</button>
          </div>
        </div>
      `;
      list.appendChild(item);
    });
    document.getElementById('summary-total').textContent = '₹'+Math.round(total);
    document.querySelectorAll('[data-action]').forEach(btn=>{
      btn.onclick = ()=>{
        const id = btn.dataset.id; const action = btn.dataset.action;
        const cart = getCart(); const q = cart[id]||0;
        if(action==='inc') setQty(id,q+1);
        if(action==='dec') setQty(id,q-1);
        if(action==='remove') removeFromCart(id);
      };
    });
  }

  // Expose functions
  window.addToCart = addToCart;
  window._otaku_cart = {getCart,saveCart,addToCart,setQty,removeFromCart,updateCartCount};

  document.addEventListener('DOMContentLoaded',()=>{
    updateCartCount(); renderCartPage();
    const checkout = document.getElementById('checkout-btn'); if(checkout) checkout.addEventListener('click',()=>alert('Checkout is demo-only.')); 
  });

})();
