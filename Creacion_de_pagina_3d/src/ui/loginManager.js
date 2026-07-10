import { audioController } from '../core/audioController.js';
import { mockUsers } from '../core/gamesData.js';

class LoginManager {
  constructor() {
    this.loginModal = document.getElementById('login-modal');
    this.loginTriggerBtn = document.getElementById('login-trigger-btn');
    this.closeLoginBtn = document.getElementById('close-login-btn');
    this.loginForm = document.getElementById('login-form');
    this.loginErrorMsg = document.getElementById('login-error-msg');
    this.logoutBtn = document.getElementById('logout-btn');

    this.setupListeners();
    this.updateAuthUI();
  }

  setupListeners() {
    // Escuchar cambios de autenticación
    window.addEventListener('nebula_auth_change', () => {
      this.updateAuthUI();
    });

    // Abrir Modal de Login
    if (this.loginTriggerBtn) {
      this.loginTriggerBtn.addEventListener('click', () => {
        audioController.playSelect();
        if (this.loginErrorMsg) this.loginErrorMsg.classList.add('hidden');
        if (this.loginModal) this.loginModal.classList.remove('hidden');
      });
    }

    // Cerrar Modal de Login
    if (this.closeLoginBtn) {
      this.closeLoginBtn.addEventListener('click', () => {
        audioController.playSelect();
        if (this.loginModal) this.loginModal.classList.add('hidden');
      });
    }

    // Enviar Formulario de Login
    if (this.loginForm) {
      this.loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const emailInput = document.getElementById('login-email');
        const email = emailInput ? emailInput.value.trim().toLowerCase() : '';
        const user = mockUsers.find(u => u.email === email);
        
        if (user) {
          // Conexión exitosa
          localStorage.setItem('nebula_user_session', JSON.stringify(user));
          if (this.loginModal) this.loginModal.classList.add('hidden');
          if (emailInput) emailInput.value = '';
          
          window.dispatchEvent(new Event('nebula_auth_change'));
          audioController.playPurchase();
        } else {
          // Error de credenciales
          if (this.loginErrorMsg) this.loginErrorMsg.classList.remove('hidden');
          audioController.playHover();
        }
      });
    }

    // Desconexión (Logout)
    if (this.logoutBtn) {
      this.logoutBtn.addEventListener('click', () => {
        audioController.playSelect();
        localStorage.removeItem('nebula_user_session');
        
        window.dispatchEvent(new Event('nebula_auth_change'));
        window.dispatchEvent(new Event('nebula_close_details'));
      });
    }
  }

  updateAuthUI() {
    const loginTriggerBtn = document.getElementById('login-trigger-btn');
    const userProfileHud = document.getElementById('user-profile-hud');
    const hudUserName = document.getElementById('hud-user-name');
    const hudUserPlan = document.getElementById('hud-user-plan');
    
    try {
      const session = localStorage.getItem('nebula_user_session');
      if (session) {
        const user = JSON.parse(session);
        
        if (loginTriggerBtn) loginTriggerBtn.classList.add('hidden');
        if (userProfileHud) userProfileHud.classList.remove('hidden');
        
        if (hudUserName) hudUserName.innerText = user.name;
        if (hudUserPlan) {
          hudUserPlan.innerText = user.plan.toUpperCase();
          if (user.plan === 'vip') {
            hudUserPlan.style.background = 'var(--secondary-glow)';
            hudUserPlan.style.boxShadow = '0 0 8px var(--secondary-glow)';
          } else if (user.plan === 'premium') {
            hudUserPlan.style.background = '#3a86c8';
            hudUserPlan.style.boxShadow = '0 0 8px #3a86c8';
          } else if (user.plan === 'pro') {
            hudUserPlan.style.background = 'var(--primary-glow)';
            hudUserPlan.style.boxShadow = '0 0 8px var(--primary-glow)';
            hudUserPlan.style.color = '#000';
          } else {
            hudUserPlan.style.background = '#94a3b8';
            hudUserPlan.style.boxShadow = 'none';
            hudUserPlan.style.color = '#fff';
          }
        }
      } else {
        if (loginTriggerBtn) loginTriggerBtn.classList.remove('hidden');
        if (userProfileHud) userProfileHud.classList.add('hidden');
      }
    } catch (e) {
      console.warn("Fallo al actualizar la interfaz de autenticación", e);
    }
  }
}

export const loginManager = new LoginManager();
