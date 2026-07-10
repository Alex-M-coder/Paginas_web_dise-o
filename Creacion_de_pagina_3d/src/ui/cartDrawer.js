import { cart } from '../core/cart.js';

class CartDrawer {
  constructor() {
    this.cartContainer = document.getElementById('cart-items');
    this.totalPriceEl = document.getElementById('cart-total-price');
    this.cartCountEl = document.querySelector('.cart-count');
    this.checkoutBtn = document.getElementById('checkout-btn');
    this.cartBtn = document.getElementById('cart-toggle-btn');
    this.modal = document.getElementById('transaction-modal');

    this.setupListeners();
    this.injectStyles();
    this.render(); // Render inicial
  }

  setupListeners() {
    window.addEventListener('nebula_cart_updated', () => {
      this.render();
    });

    window.addEventListener('nebula_cart_added_effect', (e) => {
      if (this.cartBtn) {
        this.cartBtn.classList.remove('pulse-animation');
        void this.cartBtn.offsetWidth; // Forzar reflow
        this.cartBtn.classList.add('pulse-animation');
      }
      if (e.detail) {
        const title = e.detail.title || e.detail.nombre || 'Juego añadido';
        const emoji = e.detail.emoji || '🎮';
        const color = e.detail.color || 'var(--primary-glow)';
        this.showToast(title, 'Añadido a la cesta de descargas.', color, emoji);
      }
    });

    window.addEventListener('nebula_transaction_success', (e) => {
      const { txId, delivery, amount } = e.detail;
      const txIdEl = document.getElementById('receipt-tx-id');
      const deliveryEl = document.getElementById('receipt-delivery');
      const amountEl = document.getElementById('receipt-amount');
      
      if (txIdEl) txIdEl.innerText = txId;
      if (deliveryEl) deliveryEl.innerText = delivery;
      if (amountEl) amountEl.innerText = `$${amount.toFixed(2)}`;
      
      if (this.modal) {
        this.modal.classList.remove('hidden');
      }
    });

    window.addEventListener('nebula_cart_checkout_done', () => {
      const drawer = document.getElementById('cart-drawer');
      if (drawer) {
        drawer.classList.add('closed');
      }
    });

    if (this.checkoutBtn) {
      this.checkoutBtn.addEventListener('click', () => {
        cart.checkout();
      });
    }
  }

  injectStyles() {
    const style = document.createElement('style');
    style.textContent = `
      .cart-item-price-row {
        display: flex;
        align-items: baseline;
        gap: 8px;
      }
      .cart-item-price-original {
        font-size: 0.72rem;
        color: var(--text-muted);
        text-decoration: line-through;
        opacity: 0.6;
      }
    `;
    document.head.appendChild(style);
  }

  render() {
    if (!this.cartContainer || !this.totalPriceEl || !this.cartCountEl || !this.checkoutBtn) return;

    const count = cart.getCount();
    if (this.cartCountEl) this.cartCountEl.innerText = count;

    const total = cart.getTotal();
    if (this.totalPriceEl) this.totalPriceEl.innerText = `$${total.toFixed(2)}`;

    this.checkoutBtn.disabled = cart.items.length === 0;

    if (cart.items.length === 0) {
      this.cartContainer.innerHTML = `
        <div class="cart-empty-message">
          <p>Tu cesta de compras está vacía.</p>
          <p class="sub">¡Selecciona un juego del escaparate 3D!</p>
        </div>
      `;
      return;
    }

    const discount = cart.getCurrentDiscount();
    let html = '';
    
    cart.items.forEach(item => {
      const finalPrice = item.price * (1 - discount);
      const isDiscounted = discount > 0;
      
      html += `
        <div class="cart-item" style="border-left: 3px solid ${item.color}">
          <div class="cart-item-thumb" style="box-shadow: 0 0 10px ${item.color}33">${item.emoji}</div>
          <div class="cart-item-details">
            <h3 class="cart-item-title">${item.title}</h3>
            <div class="cart-item-price-row">
              ${isDiscounted ? `<span class="cart-item-price-original">$${item.price.toFixed(2)}</span>` : ''}
              <span class="cart-item-price">$${finalPrice.toFixed(2)}</span>
            </div>
            <div class="cart-item-qty">
              <button class="qty-btn" data-id="${item.id}" data-action="decrease">-</button>
              <span class="qty-val">${item.qty}</span>
              <button class="qty-btn" data-id="${item.id}" data-action="increase">+</button>
            </div>
          </div>
          <button class="remove-item-btn" data-id="${item.id}" title="Eliminar">&times;</button>
        </div>
      `;
    });

    this.cartContainer.innerHTML = html;

    // Vincular eventos de botones después de renderizar
    this.cartContainer.querySelectorAll('.qty-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = Number(btn.getAttribute('data-id'));
        const action = btn.getAttribute('data-action');
        cart.changeQty(id, action === 'increase' ? 1 : -1);
      });
    });

    this.cartContainer.querySelectorAll('.remove-item-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = Number(btn.getAttribute('data-id'));
        cart.remove(id);
      });
    });
  }

  showToast(title, msg, colorHex, emoji) {
    const toast = document.createElement('div');
    toast.className = 'nebula-toast';
    toast.style.borderColor = colorHex;
    toast.style.boxShadow = `0 0 15px ${colorHex}44`;
    
    toast.innerHTML = `
      <div class="nebula-toast-icon">${emoji}</div>
      <div class="nebula-toast-body">
        <span class="nebula-toast-title" style="color: ${colorHex}">${title}</span>
        <span class="nebula-toast-msg">${msg}</span>
      </div>
    `;
    
    document.body.appendChild(toast);
    
    void toast.offsetWidth; // Forzar reflow
    toast.classList.add('show');
    
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => {
        toast.remove();
      }, 500);
    }, 2500);
  }
}

export const cartDrawer = new CartDrawer();
