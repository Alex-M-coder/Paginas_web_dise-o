import { audioController } from './audioController.js';

class Cart {
  constructor() {
    this.items = [];
    this.loadFromStorage();
  }

  loadFromStorage() {
    try {
      const saved = localStorage.getItem('nebula_3d_cart');
      if (saved) {
        this.items = JSON.parse(saved);
      }
    } catch (e) {
      console.warn("No se pudo cargar el carrito desde localStorage", e);
    }
  }

  saveToStorage() {
    try {
      localStorage.setItem('nebula_3d_cart', JSON.stringify(this.items));
    } catch (e) {
      console.warn("No se pudo guardar el carrito en localStorage", e);
    }
  }

  getCurrentDiscount() {
    try {
      const session = localStorage.getItem('nebula_user_session');
      if (session) {
        const user = JSON.parse(session);
        return user.discount || 0;
      }
    } catch (e) {
      console.warn(e);
    }
    return 0;
  }

  add(game) {
    // Si es una suscripción, no entra en el carrito normal, se activa al momento
    if (game.id === 'free' || game.id === 'pro' || game.id === 'premium' || game.id === 'vip') {
      const isAnnual = document.getElementById('billing-toggle-checkbox')?.checked || false;
      this.activateSubscription(game, isAnnual);
      return;
    }

    const existing = this.items.find(item => item.id === game.id);
    if (existing) {
      existing.qty += 1;
    } else {
      this.items.push({
        id: game.id,
        title: game.title,
        price: game.price,
        emoji: game.emoji,
        color: game.color,
        qty: 1
      });
    }
    
    this.saveToStorage();
    audioController.playAddToCart();
    this.notifyUpdate();
    
    // Disparar evento de animación para que la UI lo recoja
    window.dispatchEvent(new CustomEvent('nebula_cart_added_effect', { detail: game }));
  }

  // Activar suscripción directamente
  activateSubscription(plan, isAnnual = false) {
    const price = isAnnual ? plan.priceAnnual : plan.priceMonthly;
    
    const sessionData = {
      email: "usuario.invitado@nebula.com",
      name: "Explorador Nebula",
      plan: plan.id,
      billingMode: isAnnual ? "annual" : "monthly",
      discount: plan.id === 'pro' ? 0.20 : plan.id === 'premium' ? 0.35 : plan.id === 'vip' ? 0.50 : 0.00
    };

    // Si ya hay una sesión guardada, mantenemos el nombre del usuario pero actualizamos el plan
    try {
      const existingSession = localStorage.getItem('nebula_user_session');
      if (existingSession) {
        const u = JSON.parse(existingSession);
        sessionData.name = u.name;
        sessionData.email = u.email;
      }
    } catch(e){}

    localStorage.setItem('nebula_user_session', JSON.stringify(sessionData));
    
    // Forzar actualización del HUD de usuario
    window.dispatchEvent(new Event('nebula_auth_change'));
    
    // Disparar éxito de transacción
    window.dispatchEvent(new CustomEvent('nebula_transaction_success', {
      detail: {
        txId: `SUB-${Math.floor(Math.random() * 90000 + 10000)}-NX`,
        delivery: "Vinculación Mental Directa",
        amount: price
      }
    }));
    
    audioController.playPurchase();
    
    this.notifyUpdate();
    
    // Cerrar panel de detalles
    window.dispatchEvent(new Event('nebula_close_details'));
  }

  remove(gameId) {
    this.items = this.items.filter(item => item.id !== gameId);
    this.saveToStorage();
    audioController.playSelect();
    this.notifyUpdate();
  }

  changeQty(gameId, delta) {
    const item = this.items.find(item => item.id === gameId);
    if (!item) return;

    item.qty += delta;
    if (item.qty <= 0) {
      this.remove(gameId);
    } else {
      this.saveToStorage();
      audioController.playHover();
      this.notifyUpdate();
    }
  }

  clear() {
    this.items = [];
    this.saveToStorage();
    this.notifyUpdate();
  }

  // Obtiene el total aplicando el descuento de suscripción del usuario activo
  getTotal() {
    const discount = this.getCurrentDiscount();
    return this.items.reduce((total, item) => {
      const discountedPrice = item.price * (1 - discount);
      return total + (discountedPrice * item.qty);
    }, 0);
  }

  getCount() {
    return this.items.reduce((total, item) => total + item.qty, 0);
  }

  checkout() {
    if (this.items.length === 0) return;

    const total = this.getTotal();
    const txId = `TX-${Math.floor(Math.random() * 900000 + 100000)}-NX`;
    
    window.dispatchEvent(new CustomEvent('nebula_transaction_success', {
      detail: {
        txId: txId,
        delivery: "Descarga Neural Directa",
        amount: total
      }
    }));
    
    audioController.playPurchase();
    this.clear();
    
    window.dispatchEvent(new Event('nebula_cart_checkout_done'));
  }

  notifyUpdate() {
    window.dispatchEvent(new Event('nebula_cart_updated'));
  }
}

export const cart = new Cart();
