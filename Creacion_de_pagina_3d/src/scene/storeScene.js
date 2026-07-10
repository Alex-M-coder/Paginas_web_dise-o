import * as THREE from 'three';
import { gsap } from 'gsap';
import { gamesData, subscriptionsData } from '../core/gamesData.js';
import { audioController } from '../core/audioController.js';
import { createCardTexture, createCardBackTexture } from '../generators/cardCanvas.js';
import {
  createSpaceshipModel,
  createSwordModel,
  createCarModel,
  createVoxelCastleModel,
  createShurikenModel,
  createShieldModel,
  createTrophyModel,
  createOrbModel,
  createCubeModel,
  createOrbitalModel,
  createDiamondModel,
  createCrownModel
} from '../generators/proceduralModels.js';

class StoreScene {
  constructor() {
    this.container = document.body;
    this.canvas = document.getElementById('store-canvas');
    
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    
    this.cardsGroup = null;
    this.showroomGroup = null;
    this.starfield = null;
    
    this.cards = [];
    this.visibleCards = [];
    this.hitboxes = [];
    this.visibleHitboxes = [];
    this.currentCategory = 'all'; // 'all', 'Sci-Fi', 'RPG', etc., o 'subs' para planes
    this.searchQuery = '';
    
    // Configuración del Carrusel
    this.radius = 7;
    this.targetRotationY = 0;
    this.currentRotationY = 0;
    this.selectedCardIndex = -1;
    this.selectedGame = null;
    
    // Estado de interacción de arrastre
    this.isDragging = false;
    this.previousPointerX = 0;
    this.pointerSpeedX = 0;
    this.dragFactor = 0.005;
    
    // Raycasting para selección y hover
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();
    this.hoveredCard = null;
    
    // Elementos HUD vinculados
    this.loadProgressEl = document.getElementById('load-progress');
    this.loadingOverlay = document.getElementById('loading-overlay');
  }

  async init() {
    // 1. Crear Escena y Cámara
    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.FogExp2(0x02020a, 0.015);
    
    this.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
    this.camera.position.set(0, 0, 10);
    
    // 2. Crear Renderizador
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      alpha: false,
      powerPreference: 'high-performance'
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.0;
    
    // 3. Crear Luces
    const ambientLight = new THREE.AmbientLight(0x0d0b21, 1.2);
    this.scene.add(ambientLight);
    
    const blueLight = new THREE.DirectionalLight(0x00f2fe, 1.5);
    blueLight.position.set(-5, 5, 5);
    this.scene.add(blueLight);
    
    const purpleLight = new THREE.DirectionalLight(0x9d4edd, 1.5);
    purpleLight.position.set(5, -3, 5);
    this.scene.add(purpleLight);
    
    const spotLight = new THREE.SpotLight(0xffffff, 2.0);
    spotLight.position.set(0, 8, 2);
    spotLight.angle = Math.PI / 4;
    spotLight.penumbra = 0.5;
    this.scene.add(spotLight);
    
    // 4. Crear Grupos
    this.cardsGroup = new THREE.Group();
    this.scene.add(this.cardsGroup);
    
    this.showroomGroup = new THREE.Group();
    this.showroomGroup.position.set(2.5, 0.5, 0); // Ligeramente desplazado a la derecha
    this.scene.add(this.showroomGroup);
    
    // 5. Crear Polvo Estelar / Partículas
    this.createStarfield();
    
    // 6. Cargar Tarjetas
    await this.generateCards();
    
    // 7. Configurar Eventos
    this.setupEventListeners();
    
    // 8. Ocultar pantalla de carga
    if (this.loadProgressEl) this.loadProgressEl.style.width = '100%';
    setTimeout(() => {
      if (this.loadingOverlay) {
        this.loadingOverlay.classList.add('fade-out');
      }
    }, 500);
    
    // 9. Iniciar Animación
    this.animate();
  }

  createStarfield() {
    const starsCount = 1500;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(starsCount * 3);
    const colors = new Float32Array(starsCount * 3);
    
    const colorChoices = [
      new THREE.Color(0x00f2fe),
      new THREE.Color(0x9d4edd),
      new THREE.Color(0xffffff)
    ];

    for (let i = 0; i < starsCount * 3; i += 3) {
      const radius = 15 + Math.random() * 25;
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);
      
      positions[i] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i+1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i+2] = radius * Math.cos(phi);
      
      const randColor = colorChoices[Math.floor(Math.random() * colorChoices.length)];
      colors[i] = randColor.r;
      colors[i+1] = randColor.g;
      colors[i+2] = randColor.b;
    }
    
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    
    const material = new THREE.PointsMaterial({
      size: 0.12,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    
    this.starfield = new THREE.Points(geometry, material);
    this.scene.add(this.starfield);
  }

  // Genera meshes de tarjetas para todos los elementos (juegos y suscripciones)
  async generateCards() {
    // Vaciar grupo anterior
    while (this.cardsGroup.children.length > 0) {
      this.cardsGroup.remove(this.cardsGroup.children[0]);
    }
    this.cards = [];
    this.hitboxes = [];
    
    // Unir ambos arrays pero etiquetados en userData
    const allItems = [
      ...gamesData.map(g => ({ ...g, isSub: false })),
      ...subscriptionsData.map(s => ({ ...s, isSub: true }))
    ];
    
    const count = allItems.length;
    
    for (let i = 0; i < count; i++) {
      const item = allItems[i];
      const texture = createCardTexture(item);
      
      const geometry = new THREE.BoxGeometry(2.4, 3.6, 0.1);
      
      const edgeMaterial = new THREE.MeshStandardMaterial({
        color: item.isSub ? 0x220c3a : 0x11111e,
        roughness: 0.3,
        metalness: 0.9
      });
      
      const frontMaterial = new THREE.MeshStandardMaterial({
        map: texture,
        roughness: 0.1,
        metalness: 0.1,
        emissiveMap: texture,
        emissive: new THREE.Color(0xffffff),
        emissiveIntensity: item.isSub ? 0.25 : 0.15
      });

      const backTexture = createCardBackTexture(item);
      const backMaterial = new THREE.MeshStandardMaterial({
        map: backTexture,
        roughness: 0.1,
        metalness: 0.1,
        emissiveMap: backTexture,
        emissive: new THREE.Color(0xffffff),
        emissiveIntensity: item.isSub ? 0.25 : 0.15
      });

      const materials = [
        edgeMaterial,
        edgeMaterial,
        edgeMaterial,
        edgeMaterial,
        frontMaterial,
        backMaterial
      ];
      
      const card = new THREE.Mesh(geometry, materials);
      card.userData = { game: item, index: i, isSub: item.isSub };
      
      this.cardsGroup.add(card);
      this.cards.push(card);

      // Crear hitbox invisible para evitar bucles de hover por rotación
      const hitboxGeometry = new THREE.BoxGeometry(2.4, 3.6, 0.12);
      const hitboxMaterial = new THREE.MeshBasicMaterial({
        transparent: true,
        opacity: 0,
        depthWrite: false
      });
      const hitbox = new THREE.Mesh(hitboxGeometry, hitboxMaterial);
      hitbox.userData = { card: card, index: i };
      
      this.cardsGroup.add(hitbox);
      this.hitboxes.push(hitbox);
    }
    
    // Aplicar filtros iniciales (muestra todos los juegos, oculta suscripciones al inicio)
    this.applyFilters();
  }

  // Reposiciona las tarjetas visibles en órbita circular
  updateCarouselLayout(animate = true) {
    const total = this.visibleCards.length;
    if (total === 0) return;
    
    // Ajustar el radio dinámicamente según la cantidad de tarjetas para dar suficiente separación
    this.radius = Math.max(7.5, total * 0.62);
    
    // Ajustar la cámara para que el carrusel quepa en pantalla
    if (this.selectedCardIndex === -1) {
      gsap.to(this.camera.position, {
        x: 0,
        y: 0,
        z: this.radius + 6.0,
        duration: 0.8,
        ease: 'power3.out'
      });
    }

    const angleStep = (Math.PI * 2) / total;
    
    this.visibleCards.forEach((card, i) => {
      const angle = i * angleStep;
      
      const targetX = this.radius * Math.sin(angle);
      const targetZ = this.radius * Math.cos(angle);
      const targetRotY = angle;
      
      card.visible = true;
      
      const cardIdx = this.cards.indexOf(card);
      const hitbox = this.hitboxes[cardIdx];
      if (hitbox) hitbox.visible = true;
      
      if (animate) {
        gsap.to(card.position, {
          x: targetX,
          y: 0,
          z: targetZ,
          duration: 0.8,
          ease: 'power3.out'
        });
        
        gsap.to(card.rotation, {
          y: targetRotY,
          x: 0,
          z: 0,
          duration: 0.8,
          ease: 'power3.out'
        });

        gsap.to(card.scale, {
          x: 1,
          y: 1,
          z: 1,
          duration: 0.5,
          ease: 'power2.out'
        });

        if (hitbox) {
          gsap.to(hitbox.position, {
            x: targetX,
            y: 0,
            z: targetZ,
            duration: 0.8,
            ease: 'power3.out'
          });
          
          gsap.to(hitbox.rotation, {
            y: targetRotY,
            x: 0,
            z: 0,
            duration: 0.8,
            ease: 'power3.out'
          });

          gsap.to(hitbox.scale, {
            x: 1,
            y: 1,
            z: 1,
            duration: 0.5,
            ease: 'power2.out'
          });
        }
      } else {
        card.position.set(targetX, 0, targetZ);
        card.rotation.set(0, targetRotY, 0);
        card.scale.set(1, 1, 1);
        if (hitbox) {
          hitbox.position.set(targetX, 0, targetZ);
          hitbox.rotation.set(0, targetRotY, 0);
          hitbox.scale.set(1, 1, 1);
        }
      }
      
      card.userData.angle = angle;
    });
    
    // Ocultar las tarjetas no filtradas
    this.cards.forEach((card, idx) => {
      const hitbox = this.hitboxes[idx];
      if (!this.visibleCards.includes(card)) {
        if (animate) {
          gsap.to(card.scale, {
            x: 0.001,
            y: 0.001,
            z: 0.001,
            duration: 0.4,
            ease: 'power2.in',
            onComplete: () => { card.visible = false; if (hitbox) hitbox.visible = false; }
          });
          if (hitbox) {
            gsap.to(hitbox.scale, {
              x: 0.001,
              y: 0.001,
              z: 0.001,
              duration: 0.4,
              ease: 'power2.in'
            });
          }
        } else {
          card.scale.set(0.001, 0.001, 0.001);
          card.visible = false;
          if (hitbox) {
            hitbox.scale.set(0.001, 0.001, 0.001);
            hitbox.visible = false;
          }
        }
      }
    });

    this.targetRotationY = 0;
  }

  // Filtrar catálogo por categoría (también gestiona el modo suscripción)
  filterByCategory(category) {
    this.currentCategory = category;
    this.selectedCardIndex = -1;
    this.selectedGame = null;
    window.dispatchEvent(new Event('nebula_game_deselected'));
    
    this.applyFilters();
  }

  // Filtrar por búsqueda de texto
  searchGames(query) {
    this.searchQuery = query.toLowerCase().trim();
    this.selectedCardIndex = -1;
    this.selectedGame = null;
    window.dispatchEvent(new Event('nebula_game_deselected'));
    
    this.applyFilters();
  }

  // Combina categoría de HUD, búsqueda y modo suscripciones
  applyFilters() {
    const isSubsMode = this.currentCategory === 'subs';
    
    // Notificar cambio de categoría/filtro a los componentes UI
    window.dispatchEvent(new CustomEvent('nebula_filters_applied', {
      detail: { isSubsMode, category: this.currentCategory }
    }));
    
    this.visibleCards = this.cards.filter(card => {
      const item = card.userData.game;
      if (!item) return false;
      
      if (isSubsMode) {
        return card.userData.isSub;
      }
      
      if (card.userData.isSub) {
        return false;
      }
      
      const itemCategory = (item.category || item.categoria || 'Otros').toLowerCase();
      const itemTitle = (item.title || item.nombre || '').toLowerCase();
      const itemDesc = (item.description || item.descripcion || '').toLowerCase();
      
      const matchesCategory = this.currentCategory === 'all' || itemCategory === this.currentCategory.toLowerCase();
      const matchesSearch = itemTitle.includes(this.searchQuery) || itemDesc.includes(this.searchQuery);
      
      return matchesCategory && matchesSearch;
    });
    
    this.updateCarouselLayout(true);
    
    // Actualizar lista de hitboxes visibles
    this.visibleHitboxes = this.hitboxes.filter(h => this.visibleCards.includes(h.userData.card));
  }

  // Configurar event listeners
  setupEventListeners() {
    window.addEventListener('resize', this.onWindowResize.bind(this));
    
    this.canvas.addEventListener('pointerdown', this.onPointerDown.bind(this));
    window.addEventListener('pointermove', this.onPointerMove.bind(this));
    window.addEventListener('pointerup', this.onPointerUp.bind(this));
    
    this.canvas.addEventListener('wheel', this.onWheel.bind(this), { passive: true });
    this.canvas.addEventListener('click', this.onClick.bind(this));
  }

  onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  onPointerDown(e) {
    // Arrastre del carrusel desactivado en favor de rotación individual de cartas
  }

  onPointerMove(e) {
    // Actualizar coordenadas para hover/raycasting
    const rect = this.canvas.getBoundingClientRect();
    this.mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    this.mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
  }

  onPointerUp() {
    // Arrastre desactivado
  }

  onWheel(e) {
    const minZ = this.radius + 1.8;
    const maxZ = this.radius + 12.0;
    
    let zoomTarget = this.camera.position.z + e.deltaY * 0.015;
    zoomTarget = Math.max(minZ, Math.min(maxZ, zoomTarget));
    
    gsap.to(this.camera.position, {
      z: zoomTarget,
      duration: 0.5,
      ease: 'power2.out'
    });
  }

  onClick(e) {
    if (Math.abs(this.pointerSpeedX) > 0.02) return;
    
    this.raycaster.setFromCamera(this.mouse, this.camera);
    
    if (this.selectedCardIndex !== -1) {
      // Si hay una carta seleccionada, solo detectamos si hacemos clic sobre la propia carta seleccionada
      const selectedHitbox = this.hitboxes[this.selectedCardIndex];
      if (selectedHitbox) {
        const intersects = this.raycaster.intersectObject(selectedHitbox);
        if (intersects.length > 0) {
          return; // Mantener seleccionado
        }
      }
      // Clic fuera de la carta seleccionada: deseleccionar
      this.deselectAll();
    } else {
      // Si no hay selección activa, raycasteamos todas las hitboxes visibles para seleccionar una
      const intersects = this.raycaster.intersectObjects(this.visibleHitboxes);
      if (intersects.length > 0) {
        const clickedCard = intersects[0].object.userData.card;
        this.selectCard(clickedCard);
      }
    }
  }

  // Seleccionar elemento y enfocar
  selectCard(card) {
    audioController.playSelect();
    const item = card.userData.game;
    const index = card.userData.index;
    
    this.selectedCardIndex = index;
    this.selectedGame = item;
    
    this.targetRotationY = -card.userData.angle;
    
    gsap.to(this.camera.position, {
      x: 0,
      y: 0.5,
      z: this.radius + 3.8,
      duration: 1.0,
      ease: 'power3.out'
    });

    // Colocar el showroom directamente arriba de la tarjeta activa (efecto holograma)
    this.showroomGroup.position.set(0, 2.3, this.radius);
    
    this.visibleCards.forEach(c => {
      const isSelected = c.userData.index === index;
      
      gsap.to(c.scale, {
        x: isSelected ? 1.15 : 0.8,
        y: isSelected ? 1.15 : 0.8,
        z: isSelected ? 1.15 : 0.8,
        duration: 0.6,
        ease: 'power2.out'
      });
      
      // Asegurar que todas las cartas vuelvan a mirar al frente (0 rotación relativa) al seleccionar una
      gsap.to(c.rotation, {
        y: c.userData.angle,
        x: 0,
        z: 0,
        duration: 0.6,
        ease: 'power2.out'
      });
      
      c.material.forEach(mat => {
        if (mat.map) {
          gsap.to(mat, {
            emissiveIntensity: isSelected ? 0.4 : 0.05,
            duration: 0.6
          });
        }
      });
    });
    
    // Notificar selección a la interfaz
    window.dispatchEvent(new CustomEvent('nebula_game_selected', { detail: item }));
    
    this.loadShowroomModel(item.modelType, item.color);
  }

  deselectAll() {
    this.selectedCardIndex = -1;
    this.selectedGame = null;
    
    gsap.to(this.camera.position, {
      x: 0,
      y: 0,
      z: this.radius + 6.0,
      duration: 1.0,
      ease: 'power3.out'
    });
    
    // Resetear posición del showroom
    this.showroomGroup.position.set(2.5, 0.5, 0);
    
    this.visibleCards.forEach(c => {
      gsap.to(c.scale, {
        x: 1,
        y: 1,
        z: 1,
        duration: 0.6,
        ease: 'power2.out'
      });
      
      // Restaurar rotación frontal de todas las cartas al deseleccionar
      gsap.to(c.rotation, {
        y: c.userData.angle,
        x: 0,
        z: 0,
        duration: 0.6,
        ease: 'power2.out'
      });
      
      c.material.forEach(mat => {
        if (mat.map) {
          gsap.to(mat, {
            emissiveIntensity: 0.15,
            duration: 0.6
          });
        }
      });
    });
    
    // Notificar deselección a la interfaz
    window.dispatchEvent(new Event('nebula_game_deselected'));
    this.clearShowroom();
  }

  navigateCarousel(direction) {
    if (this.visibleCards.length === 0) return;
    
    audioController.playHover();
    const angleStep = (Math.PI * 2) / this.visibleCards.length;
    
    if (this.selectedCardIndex === -1) {
      this.targetRotationY -= angleStep * direction;
    } else {
      const currentVisibleIndex = this.visibleCards.findIndex(c => c.userData.index === this.selectedCardIndex);
      let nextVisibleIndex = currentVisibleIndex + direction;
      
      if (nextVisibleIndex < 0) nextVisibleIndex = this.visibleCards.length - 1;
      if (nextVisibleIndex >= this.visibleCards.length) nextVisibleIndex = 0;
      
      this.selectCard(this.visibleCards[nextVisibleIndex]);
    }
  }

  // Cargar modelo 3D dinámico de exhibición
  loadShowroomModel(type, colorHex) {
    this.clearShowroom();
    this.magicOrbRings = null;
    
    const color = new THREE.Color(colorHex);
    let mesh = null;
    
    if (type === 'spaceship') {
      mesh = createSpaceshipModel(color);
    } else if (type === 'sword') {
      mesh = createSwordModel(color);
    } else if (type === 'car') {
      mesh = createCarModel(color);
    } else if (type === 'voxel') {
      mesh = createVoxelCastleModel(color);
    } else if (type === 'shuriken') {
      mesh = createShurikenModel(color);
    } else if (type === 'shield') {
      mesh = createShieldModel(color);
    } else if (type === 'trophy') {
      mesh = createTrophyModel(color);
    } else if (type === 'orb') {
      mesh = createOrbModel(color);
      if (mesh.userData && mesh.userData.magicOrbRings) {
        this.magicOrbRings = mesh.userData.magicOrbRings;
      }
    } 
    // Modelos para planes de suscripción
    else if (type === 'cube') {
      mesh = createCubeModel();
    } else if (type === 'orbital') {
      mesh = createOrbitalModel(color);
    } else if (type === 'diamond') {
      mesh = createDiamondModel();
    } else if (type === 'crown') {
      mesh = createCrownModel(color);
    }
    
    if (mesh) {
      mesh.position.set(0, -3, 0);
      mesh.scale.set(0.01, 0.01, 0.01);
      
      this.showroomGroup.add(mesh);
      
      gsap.to(mesh.position, {
        y: 0,
        duration: 1.0,
        ease: 'back.out(1.5)'
      });
      
      gsap.to(mesh.scale, {
        x: 1,
        y: 1,
        z: 1,
        duration: 1.0,
        ease: 'back.out(1.5)'
      });
    }
  }

  clearShowroom() {
    while (this.showroomGroup.children.length > 0) {
      const obj = this.showroomGroup.children[0];
      this.showroomGroup.remove(obj);
    }
    this.magicOrbRings = null;
  }

  // Bucle de Animación
  animate() {
    requestAnimationFrame(this.animate.bind(this));
    
    const time = performance.now() * 0.001;
    
    if (!this.isDragging) {
      this.pointerSpeedX *= 0.92;
      this.targetRotationY -= this.pointerSpeedX;
    }
    
    this.currentRotationY += (this.targetRotationY - this.currentRotationY) * 0.08;
    this.cardsGroup.rotation.y = this.currentRotationY;
    
    // Flotación de tarjetas
    this.visibleCards.forEach((card, i) => {
      const offset = i * 0.5;
      card.position.y = Math.sin(time * 1.5 + offset) * 0.06;
      
      if (this.hoveredCard === card && this.selectedCardIndex === -1) {
        card.rotation.x = Math.sin(time * 3) * 0.08;
        card.rotation.z = Math.cos(time * 3) * 0.04;
      } else {
        card.rotation.x += (0 - card.rotation.x) * 0.1;
        card.rotation.z += (0 - card.rotation.z) * 0.1;
      }
    });
    
    // Rotar showroom
    if (this.showroomGroup.children.length > 0) {
      const model = this.showroomGroup.children[0];
      model.rotation.y = time * 0.8;
      model.position.y = Math.sin(time * 2.0) * 0.15;
      
      // Animar anillos del orbe mágico si existen
      if (this.magicOrbRings && this.magicOrbRings.length > 0 && this.selectedGame && this.selectedGame.modelType === 'orb') {
        this.magicOrbRings[0].rotation.z = time * 1.5;
        this.magicOrbRings[1].rotation.z = -time * 1.2;
      }
    }
    
    // Deriva estelar
    if (this.starfield) {
      this.starfield.rotation.y = time * 0.015;
      this.starfield.rotation.x = time * 0.008;
    }
    
    // Raycasting para rotación individual de cartas al pasar el ratón (Hover Flip)
    if (this.selectedCardIndex === -1) {
      this.raycaster.setFromCamera(this.mouse, this.camera);
      const intersects = this.raycaster.intersectObjects(this.visibleHitboxes);
      
      if (intersects.length > 0) {
        const hitCard = intersects[0].object.userData.card;
        if (this.hoveredCard !== hitCard) {
          if (this.hoveredCard) {
            gsap.to(this.hoveredCard.scale, { x: 1, y: 1, z: 1, duration: 0.3 });
            // Volver al frente
            gsap.to(this.hoveredCard.rotation, {
              y: this.hoveredCard.userData.angle,
              x: 0,
              z: 0,
              duration: 0.5,
              ease: 'power2.out',
              overwrite: 'auto'
            });
          }
          audioController.playHover();
          this.hoveredCard = hitCard;
          gsap.to(hitCard.scale, { x: 1.08, y: 1.08, z: 1.08, duration: 0.3 });
          // Girar 180 grados mostrando la descripción
          gsap.to(hitCard.rotation, {
            y: hitCard.userData.angle + Math.PI,
            x: 0,
            z: 0,
            duration: 0.5,
            ease: 'power2.out',
            overwrite: 'auto'
          });
        }
      } else {
        if (this.hoveredCard) {
          gsap.to(this.hoveredCard.scale, { x: 1, y: 1, z: 1, duration: 0.3 });
          gsap.to(this.hoveredCard.rotation, {
            y: this.hoveredCard.userData.angle,
            x: 0,
            z: 0,
            duration: 0.5,
            ease: 'power2.out',
            overwrite: 'auto'
          });
          this.hoveredCard = null;
        }
      }
    }
    
    this.renderer.render(this.scene, this.camera);
  }
}

export const storeScene = new StoreScene();
