import './style.css';
import { storeScene } from './scene/storeScene.js';
import { cart } from './core/cart.js';
import { audioController } from './core/audioController.js';

// Inicializar la interfaz cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
  // 1. Inicializar escena 3D WebGL
  storeScene.init();

  // 2. Importar de manera implícita los controladores de UI para que registren sus oyentes
  // (detailsPanel, cartDrawer y loginManager se auto-inicializan en sus respectivos archivos)
  import('./ui/detailsPanel.js');
  import('./ui/cartDrawer.js');
  import('./ui/loginManager.js');

  // 3. Inicialización del audio a través de la primera acción del usuario (evita bloqueos de autoplay)
  const initAudioOnUserAction = () => {
    audioController.init();
    document.removeEventListener('click', initAudioOnUserAction);
    document.removeEventListener('pointerdown', initAudioOnUserAction);
    document.removeEventListener('keydown', initAudioOnUserAction);
  };
  document.addEventListener('click', initAudioOnUserAction);
  document.addEventListener('pointerdown', initAudioOnUserAction);
  document.addEventListener('keydown', initAudioOnUserAction);

  // === CONTROLES DEL HUD GENERAL ===

  // Botones de filtro de categorías
  const filterBtns = document.querySelectorAll('.filter-btn');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      audioController.playSelect();
      const category = btn.getAttribute('data-category');
      
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      storeScene.filterByCategory(category);
    });
  });

  // Barra de búsqueda
  const searchInput = document.getElementById('search-input');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      storeScene.searchGames(e.target.value);
    });
    
    // Evitar que el teclado en la búsqueda active rotaciones de la escena
    searchInput.addEventListener('keydown', (e) => {
      e.stopPropagation();
    });
  }

  // Escuchar si la escena aplica filtros para ocultar la búsqueda en planes de suscripción
  window.addEventListener('nebula_filters_applied', (e) => {
    const searchBox = document.getElementById('search-box-container');
    if (searchBox) {
      if (e.detail.isSubsMode) {
        searchBox.classList.add('hidden');
      } else {
        searchBox.classList.remove('hidden');
      }
    }
  });

  // Botón Cerrar Detalle del Juego (HUD inferior)
  const closeDetailsBtn = document.getElementById('close-details-btn');
  if (closeDetailsBtn) {
    closeDetailsBtn.addEventListener('click', () => {
      storeScene.deselectAll();
    });
  }

  // Botones de Navegación por flechas 3D
  const prevBtn = document.getElementById('prev-game-btn');
  const nextBtn = document.getElementById('next-game-btn');
  
  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      storeScene.navigateCarousel(-1); // Anterior (Izquierda)
    });
  }
  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      storeScene.navigateCarousel(1); // Siguiente (Derecha)
    });
  }

  // Teclado para navegar por el carrusel (Izquierda/Derecha o Esc para deseleccionar)
  window.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
      storeScene.navigateCarousel(-1);
    } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
      storeScene.navigateCarousel(1);
    } else if (e.key === 'Escape') {
      storeScene.deselectAll();
      
      const cartDrawer = document.getElementById('cart-drawer');
      if (cartDrawer) cartDrawer.classList.add('closed');
    }
  });

  // Cajón del Carrito (Toggle lateral)
  const cartDrawerEl = document.getElementById('cart-drawer');
  const cartToggleBtn = document.getElementById('cart-toggle-btn');
  const closeCartBtn = document.getElementById('close-cart-btn');

  if (cartToggleBtn && cartDrawerEl) {
    cartToggleBtn.addEventListener('click', () => {
      audioController.playSelect();
      cartDrawerEl.classList.toggle('closed');
    });
  }

  if (closeCartBtn && cartDrawerEl) {
    closeCartBtn.addEventListener('click', () => {
      audioController.playSelect();
      cartDrawerEl.classList.add('closed');
    });
  }

  // Botón de silenciar/activar volumen de sintetizador
  const audioToggleBtn = document.getElementById('audio-toggle');
  if (audioToggleBtn) {
    audioToggleBtn.addEventListener('click', () => {
      const audioIcon = audioToggleBtn.querySelector('.audio-icon');
      const isMuted = audioController.muted;
      const newMuted = !isMuted;
      
      audioController.setMute(newMuted);
      
      if (audioIcon) {
        audioIcon.innerText = newMuted ? '🔇' : '🔊';
      }
      
      if (newMuted) {
        audioToggleBtn.style.borderColor = 'rgba(255, 255, 255, 0.1)';
        audioToggleBtn.style.boxShadow = 'none';
      } else {
        audioToggleBtn.style.borderColor = 'var(--primary-glow)';
        audioToggleBtn.style.boxShadow = '0 0 10px rgba(0, 242, 254, 0.4)';
        audioController.playSelect();
      }
    });
  }

  // Cerrar Modal de Éxito de Transacción
  const closeModalBtn = document.getElementById('close-modal-btn');
  const transactionModal = document.getElementById('transaction-modal');
  if (closeModalBtn && transactionModal) {
    closeModalBtn.addEventListener('click', () => {
      audioController.playSelect();
      transactionModal.classList.add('hidden');
    });
  }
});
