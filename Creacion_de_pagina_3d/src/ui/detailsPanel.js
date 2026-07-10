import { cart } from '../core/cart.js';

class DetailsPanel {
  constructor() {
    this.panel = document.getElementById('game-details');
    this.setupListeners();
  }

  setupListeners() {
    window.addEventListener('nebula_game_selected', (e) => {
      this.show(e.detail);
    });

    window.addEventListener('nebula_game_deselected', () => {
      this.hide();
    });

    window.addEventListener('nebula_auth_change', () => {
      if (this.selectedItem && !this.selectedItem.isSub) {
        this.show(this.selectedItem);
      }
    });

    // Botón Adquirir / Añadir al Carrito
    const buyBtn = document.getElementById('add-to-cart-btn');
    if (buyBtn) {
      buyBtn.addEventListener('click', () => {
        if (this.selectedItem) {
          cart.add(this.selectedItem);
        }
      });
    }
  }

  show(item) {
    if (!this.panel) return;
    this.selectedItem = item;
    const isSub = !!item.isSub;
    
    // Categoría / Tag
    const categoryEl = document.getElementById('game-category');
    if (categoryEl) {
      categoryEl.innerText = isSub ? "SUSCRIPCIÓN" : item.category.toUpperCase();
      categoryEl.style.borderColor = item.color;
      categoryEl.style.color = item.color;
      categoryEl.style.backgroundColor = `${item.color}22`;
    }
    
    // Título y Descripción
    const titleEl = document.getElementById('game-title');
    if (titleEl) titleEl.innerText = item.title || item.nombre || 'Sin Título';
    
    const descEl = document.getElementById('game-description');
    if (descEl) descEl.innerText = item.description || item.descripcion || '';
    
    // Botón Comprar / Adquirir
    const buyBtn = document.getElementById('add-to-cart-btn');
    if (buyBtn) {
      buyBtn.style.background = `linear-gradient(135deg, ${item.color}, #000)`;
      buyBtn.style.boxShadow = `0 0 20px ${item.color}66`;
      buyBtn.style.color = '#fff';
      buyBtn.innerText = isSub ? "ADQUIRIR PLAN" : "AÑADIR AL CARRITO";
    }

    // Toggles de Metadatos
    const gameMeta = document.getElementById('game-metadata-box');
    const ratingWrap = document.getElementById('rating-wrapper');
    const subFeaturesBox = document.getElementById('sub-features-box');
    const billingToggle = document.getElementById('billing-cycle-toggle');
    const discountTag = document.getElementById('game-discount');
    const priceOriginalEl = document.getElementById('game-price-original');
    const priceEl = document.getElementById('game-price');
    
    if (isSub) {
      if (gameMeta) gameMeta.classList.add('hidden');
      if (ratingWrap) ratingWrap.classList.add('hidden');
      if (discountTag) discountTag.classList.add('hidden');
      if (priceOriginalEl) priceOriginalEl.classList.add('hidden');
      if (subFeaturesBox) {
        subFeaturesBox.classList.remove('hidden');
        const listContainer = document.getElementById('sub-features-list');
        if (listContainer) {
          listContainer.innerHTML = (item.features || []).map(f => `<li>${f}</li>`).join('');
        }
      }
      
      if (billingToggle) {
        billingToggle.classList.remove('hidden');
        const toggleCheckbox = document.getElementById('billing-toggle-checkbox');
        
        const updateSubPrice = () => {
          const isAnnual = toggleCheckbox ? toggleCheckbox.checked : false;
          const price = isAnnual ? item.priceAnnual : item.priceMonthly;
          if (priceEl) {
            priceEl.innerText = price === 0 ? "GRATIS" : `$${price.toFixed(2)}${isAnnual ? '/año' : '/mes'}`;
            priceEl.style.color = item.color;
          }
          const monthlyEl = document.getElementById('monthly-label');
          if (monthlyEl) monthlyEl.classList.toggle('active', !isAnnual);
          
          const annualEl = document.getElementById('annual-label');
          if (annualEl) annualEl.classList.toggle('active', isAnnual);
        };
        
        if (toggleCheckbox) {
          toggleCheckbox.onchange = updateSubPrice;
        }
        updateSubPrice();
      }
    } else {
      if (gameMeta) gameMeta.classList.remove('hidden');
      if (ratingWrap) ratingWrap.classList.remove('hidden');
      if (subFeaturesBox) subFeaturesBox.classList.add('hidden');
      if (billingToggle) billingToggle.classList.add('hidden');
      
      const platformsEl = document.getElementById('game-platforms');
      if (platformsEl) platformsEl.innerText = item.platforms || '';
      
      const devEl = document.getElementById('game-developer');
      if (devEl) devEl.innerText = item.developer || '';
      
      const ratingEl = document.getElementById('game-rating');
      if (ratingEl) ratingEl.innerText = item.rating || '0.0';

      // Calcular descuento por sesión activa
      try {
        const discount = cart.getCurrentDiscount();
        if (discount > 0) {
          const finalPrice = item.price * (1 - discount);
          if (priceOriginalEl) {
            priceOriginalEl.innerText = item.price === 0 ? "GRATIS" : `$${item.price.toFixed(2)}`;
            priceOriginalEl.classList.remove('hidden');
          }
          if (priceEl) {
            priceEl.innerText = finalPrice === 0 ? "GRATIS" : `$${finalPrice.toFixed(2)}`;
            priceEl.style.color = 'var(--primary-glow)';
          }
          if (discountTag) {
            discountTag.innerText = `-${Math.floor(discount * 100)}% DTO`;
            discountTag.classList.remove('hidden');
          }
        } else {
          if (priceOriginalEl) priceOriginalEl.classList.add('hidden');
          if (discountTag) discountTag.classList.add('hidden');
          if (priceEl) {
            priceEl.innerText = item.price === 0 ? "GRATIS" : `$${item.price.toFixed(2)}`;
            priceEl.style.color = item.color;
          }
        }
      } catch (err) {
        if (priceOriginalEl) priceOriginalEl.classList.add('hidden');
        if (discountTag) discountTag.classList.add('hidden');
        if (priceEl) {
          priceEl.innerText = item.price === 0 ? "GRATIS" : `$${item.price.toFixed(2)}`;
          priceEl.style.color = item.color;
        }
      }
    }

    this.panel.classList.remove('hidden');
  }

  hide() {
    if (this.panel) {
      this.panel.classList.add('hidden');
    }
    this.selectedItem = null;
  }
}

export const detailsPanel = new DetailsPanel();
