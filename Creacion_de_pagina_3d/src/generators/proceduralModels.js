import * as THREE from 'three';

// 1. Nave Espacial (Sci-Fi)
export function createSpaceshipModel(color) {
  const group = new THREE.Group();
  
  const bodyGeom = new THREE.ConeGeometry(0.5, 1.8, 8);
  const bodyMat = new THREE.MeshStandardMaterial({ color: 0x444455, roughness: 0.2, metalness: 0.8 });
  const body = new THREE.Mesh(bodyGeom, bodyMat);
  body.rotation.x = Math.PI / 2; // Apuntar hacia adelante
  group.add(body);
  
  // Cabina
  const cabinGeom = new THREE.SphereGeometry(0.24, 8, 8);
  const cabinMat = new THREE.MeshStandardMaterial({ color: color, roughness: 0.1, metalness: 0.1 });
  const cabin = new THREE.Mesh(cabinGeom, cabinMat);
  cabin.position.set(0, 0.2, 0.2);
  cabin.scale.set(1, 1, 1.8);
  group.add(cabin);
  
  // Alas
  const wingGeom = new THREE.BoxGeometry(2.0, 0.05, 0.6);
  const wingMat = new THREE.MeshStandardMaterial({ color: 0x222233, roughness: 0.3, metalness: 0.9 });
  const wings = new THREE.Mesh(wingGeom, wingMat);
  wings.position.set(0, -0.1, -0.2);
  group.add(wings);
  
  // Alerones brillantes en las puntas de las alas
  const tipGeom = new THREE.BoxGeometry(0.1, 0.3, 0.5);
  const tipMat = new THREE.MeshStandardMaterial({ color: color, emissive: color, emissiveIntensity: 0.8 });
  const tipLeft = new THREE.Mesh(tipGeom, tipMat);
  tipLeft.position.set(-1.0, 0, -0.2);
  const tipRight = tipLeft.clone();
  tipRight.position.x = 1.0;
  group.add(tipLeft);
  group.add(tipRight);

  // Motor propulsor con luz LED trasera
  const engineGeom = new THREE.CylinderGeometry(0.25, 0.2, 0.4, 8);
  const engineMat = new THREE.MeshStandardMaterial({ color: 0x111111 });
  const engine = new THREE.Mesh(engineGeom, engineMat);
  engine.rotation.x = Math.PI / 2;
  engine.position.set(0, 0, -0.9);
  group.add(engine);
  
  const fireGeom = new THREE.ConeGeometry(0.18, 0.6, 8);
  const fireMat = new THREE.MeshBasicMaterial({ color: color });
  const fire = new THREE.Mesh(fireGeom, fireMat);
  fire.rotation.x = -Math.PI / 2;
  fire.position.set(0, 0, -1.3);
  group.add(fire);

  return group;
}

// 2. Espada del Destino (RPG)
export function createSwordModel(color) {
  const group = new THREE.Group();
  
  // Hoja (Cian/Orange neón)
  const bladeGeom = new THREE.BoxGeometry(0.15, 2.2, 0.03);
  const bladeMat = new THREE.MeshStandardMaterial({ 
    color: 0xffffff, 
    emissive: color, 
    emissiveIntensity: 1.0, 
    roughness: 0.1 
  });
  const blade = new THREE.Mesh(bladeGeom, bladeMat);
  blade.position.y = 0.8;
  group.add(blade);
  
  // Guardia
  const guardGeom = new THREE.BoxGeometry(0.7, 0.1, 0.12);
  const guardMat = new THREE.MeshStandardMaterial({ color: 0x33333b, roughness: 0.4, metalness: 0.8 });
  const guard = new THREE.Mesh(guardGeom, guardMat);
  guard.position.y = -0.3;
  group.add(guard);
  
  // Mango
  const gripGeom = new THREE.CylinderGeometry(0.06, 0.06, 0.5, 8);
  const gripMat = new THREE.MeshStandardMaterial({ color: 0x1a1105, roughness: 0.9 });
  const grip = new THREE.Mesh(gripGeom, gripMat);
  grip.position.y = -0.55;
  group.add(grip);
  
  // Pomo
  const pommelGeom = new THREE.SphereGeometry(0.09, 8, 8);
  const pommelMat = new THREE.MeshStandardMaterial({ color: 0x33333b, metalness: 0.9 });
  const pommel = new THREE.Mesh(pommelGeom, pommelMat);
  pommel.position.y = -0.82;
  group.add(pommel);

  // Ajustar pivote para que rote equilibrada
  group.position.y = -0.2;
  return group;
}

// 3. Vehículo Retro Neón (Racing)
export function createCarModel(color) {
  const group = new THREE.Group();
  
  // Carrocería
  const bodyGeom = new THREE.BoxGeometry(1.0, 0.35, 2.0);
  const bodyMat = new THREE.MeshStandardMaterial({ color: 0x11111a, roughness: 0.1, metalness: 0.9 });
  const body = new THREE.Mesh(bodyGeom, bodyMat);
  group.add(body);
  
  // Cabina
  const cabGeom = new THREE.BoxGeometry(0.7, 0.25, 0.8);
  const cabMat = new THREE.MeshStandardMaterial({ color: color, roughness: 0.1, metalness: 0.2, transparent: true, opacity: 0.6 });
  const cab = new THREE.Mesh(cabGeom, cabMat);
  cab.position.set(0, 0.25, -0.15);
  group.add(cab);
  
  // Neones inferiores flotantes (Tiras de luz)
  const neonGeom = new THREE.BoxGeometry(1.1, 0.02, 1.8);
  const neonMat = new THREE.MeshBasicMaterial({ color: color });
  const neon = new THREE.Mesh(neonGeom, neonMat);
  neon.position.y = -0.18;
  group.add(neon);
  
  // Cuatro ruedas
  const wheelGeom = new THREE.CylinderGeometry(0.24, 0.24, 0.18, 12);
  const wheelMat = new THREE.MeshStandardMaterial({ color: 0x050505, roughness: 0.8 });
  
  const wheels = [];
  const positions = [
    [-0.55, -0.1, 0.6],  // DL
    [0.55, -0.1, 0.6],   // DR
    [-0.55, -0.1, -0.6], // TL
    [0.55, -0.1, -0.6]   // TR
  ];
  
  positions.forEach(pos => {
    const w = new THREE.Mesh(wheelGeom, wheelMat);
    w.rotation.z = Math.PI / 2;
    w.position.set(...pos);
    group.add(w);
    wheels.push(w);
  });

  return group;
}

// 4. Castillo Vóxel (Estrategia/Aventura)
export function createVoxelCastleModel(color) {
  const group = new THREE.Group();
  
  // Base de tierra
  const baseGeom = new THREE.BoxGeometry(1.6, 0.3, 1.6);
  const baseMat = new THREE.MeshStandardMaterial({ color: 0x4d3227, roughness: 0.9 });
  const base = new THREE.Mesh(baseGeom, baseMat);
  base.position.y = -0.6;
  group.add(base);
  
  // Césped
  const grassGeom = new THREE.BoxGeometry(1.6, 0.1, 1.6);
  const grassMat = new THREE.MeshStandardMaterial({ color: 0x228b22, roughness: 0.9 });
  const grass = new THREE.Mesh(grassGeom, grassMat);
  grass.position.y = -0.42;
  group.add(grass);
  
  // Torres de Castillo Vóxel (Bloques)
  const blockMat = new THREE.MeshStandardMaterial({ color: 0x808080, roughness: 0.7 });
  const createVoxel = (w, h, d, x, y, z, matColor) => {
    const g = new THREE.BoxGeometry(w, h, d);
    const m = matColor ? new THREE.MeshStandardMaterial({ color: matColor, roughness: 0.7 }) : blockMat;
    const mesh = new THREE.Mesh(g, m);
    mesh.position.set(x, y, z);
    group.add(mesh);
  };
  
  // Muros principales
  createVoxel(1.2, 0.6, 1.2, 0, -0.1, 0);
  
  // 4 Torres de Esquina
  const tH = 1.0;
  createVoxel(0.3, tH, 0.3, -0.5, 0.1, -0.5);
  createVoxel(0.3, tH, 0.3, 0.5, 0.1, -0.5);
  createVoxel(0.3, tH, 0.3, -0.5, 0.1, 0.5);
  createVoxel(0.3, tH, 0.3, 0.5, 0.1, 0.5);
  
  // Tejados piramidales de las torres (Colores brillantes de neón)
  const roofGeom = new THREE.ConeGeometry(0.24, 0.4, 4);
  const roofMat = new THREE.MeshStandardMaterial({ color: color, emissive: color, emissiveIntensity: 0.5 });
  
  const roofPos = [
    [-0.5, 0.8, -0.5],
    [0.5, 0.8, -0.5],
    [-0.5, 0.8, 0.5],
    [0.5, 0.8, 0.5]
  ];
  
  roofPos.forEach(pos => {
    const roof = new THREE.Mesh(roofGeom, roofMat);
    roof.rotation.y = Math.PI / 4;
    roof.position.set(...pos);
    group.add(roof);
  });

  group.position.y = 0.2;
  return group;
}

// 5. Ciber-Shuriken (Acción Stealth)
export function createShurikenModel(color) {
  const group = new THREE.Group();
  
  // Núcleo central
  const centerGeom = new THREE.CylinderGeometry(0.25, 0.25, 0.1, 8);
  const centerMat = new THREE.MeshStandardMaterial({ color: 0x111116, roughness: 0.1, metalness: 0.9 });
  const center = new THREE.Mesh(centerGeom, centerMat);
  center.rotation.x = Math.PI / 2;
  group.add(center);
  
  // Agujero central
  const holeGeom = new THREE.CylinderGeometry(0.08, 0.08, 0.12, 8);
  const holeMat = new THREE.MeshStandardMaterial({ color: 0x010103, roughness: 0.9 });
  const hole = new THREE.Mesh(holeGeom, holeMat);
  hole.rotation.x = Math.PI / 2;
  group.add(hole);
  
  // 4 Cuchillas neón triangulares
  const bladeGeom = new THREE.ConeGeometry(0.18, 0.8, 4);
  const bladeMat = new THREE.MeshStandardMaterial({ 
    color: 0xffffff, 
    emissive: color, 
    emissiveIntensity: 0.8, 
    roughness: 0.2 
  });
  
  for (let i = 0; i < 4; i++) {
    const angle = (i * Math.PI) / 2;
    const blade = new THREE.Mesh(bladeGeom, bladeMat);
    
    // Orientación y posición radial
    blade.position.x = 0.5 * Math.cos(angle);
    blade.position.y = 0.5 * Math.sin(angle);
    blade.rotation.z = angle - Math.PI / 2;
    blade.scale.set(1, 1, 0.1); // Hacerlas planas
    
    group.add(blade);
  }
  
  return group;
}

// 6. Escudo de Energía (Acción/Aventura)
export function createShieldModel(color) {
  const group = new THREE.Group();
  
  // Cuerpo del Escudo (Hexágono aplanado)
  const shieldGeom = new THREE.CylinderGeometry(0.8, 0.8, 0.12, 6);
  const shieldMat = new THREE.MeshStandardMaterial({ color: 0x222230, roughness: 0.3, metalness: 0.9 });
  const shield = new THREE.Mesh(shieldGeom, shieldMat);
  shield.rotation.x = Math.PI / 2;
  group.add(shield);
  
  // Placas metálicas decorativas traseras
  const crossGeom = new THREE.BoxGeometry(0.18, 1.4, 0.18);
  const crossMat = new THREE.MeshStandardMaterial({ color: 0x050508, roughness: 0.5 });
  
  const cross1 = new THREE.Mesh(crossGeom, crossMat);
  cross1.rotation.z = Math.PI / 4;
  const cross2 = cross1.clone();
  cross2.rotation.z = -Math.PI / 4;
  group.add(cross1);
  group.add(cross2);
  
  // Núcleo brillante neón
  const coreGeom = new THREE.BoxGeometry(0.5, 0.5, 0.05);
  const coreMat = new THREE.MeshStandardMaterial({ color: color, emissive: color, emissiveIntensity: 1.2 });
  const core = new THREE.Mesh(coreGeom, coreMat);
  core.position.z = 0.08;
  core.rotation.z = Math.PI / 4;
  group.add(core);

  return group;
}

// 7. Trofeo de Deportes (Deportes)
export function createTrophyModel(color) {
  const group = new THREE.Group();
  
  // Base negra
  const baseGeom = new THREE.CylinderGeometry(0.4, 0.5, 0.4, 8);
  const baseMat = new THREE.MeshStandardMaterial({ color: 0x111116, roughness: 0.6 });
  const base = new THREE.Mesh(baseGeom, baseMat);
  base.position.y = -0.7;
  group.add(base);
  
  // Tallo dorado
  const stemGeom = new THREE.CylinderGeometry(0.1, 0.15, 0.5, 8);
  const stemMat = new THREE.MeshStandardMaterial({ color: 0xffd700, roughness: 0.1, metalness: 0.9 });
  const stem = new THREE.Mesh(stemGeom, stemMat);
  stem.position.y = -0.25;
  group.add(stem);
  
  // Copa / Recipiente
  const cupGeom = new THREE.CylinderGeometry(0.55, 0.2, 0.7, 8);
  const cup = new THREE.Mesh(cupGeom, stemMat);
  cup.position.y = 0.35;
  group.add(cup);
  
  // Esfera neón flotando encima
  const ballGeom = new THREE.SphereGeometry(0.2, 12, 12);
  const ballMat = new THREE.MeshStandardMaterial({ color: color, emissive: color, emissiveIntensity: 1.0 });
  const ball = new THREE.Mesh(ballGeom, ballMat);
  ball.position.y = 0.9;
  group.add(ball);

  return group;
}

// 8. Orbe Mágico orbital (MOBA/Cooperativo)
// Nota: Devuelve { group, rings } para poder animarlos fuera
export function createOrbModel(color) {
  const group = new THREE.Group();
  
  // Esfera central brillante
  const orbGeom = new THREE.SphereGeometry(0.45, 16, 16);
  const orbMat = new THREE.MeshStandardMaterial({ color: color, emissive: color, emissiveIntensity: 1.5 });
  const orb = new THREE.Mesh(orbGeom, orbMat);
  group.add(orb);
  
  // Dos anillos orbitales inclinados
  const ringGeom = new THREE.TorusGeometry(0.75, 0.03, 8, 32);
  const ringMat = new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: color, emissiveIntensity: 0.8 });
  
  const ring1 = new THREE.Mesh(ringGeom, ringMat);
  ring1.rotation.x = Math.PI / 4;
  ring1.rotation.y = Math.PI / 4;
  
  const ring2 = new THREE.Mesh(ringGeom, ringMat);
  ring2.rotation.x = -Math.PI / 4;
  ring2.rotation.y = -Math.PI / 4;
  
  group.add(ring1);
  group.add(ring2);

  // Retornamos un objeto personalizado que expone los anillos para la animación
  group.userData = { magicOrbRings: [ring1, ring2] };

  return group;
}

// === MODELOS DE SUSCRIPCIONES ===

// 9. Plan Free: Cubo de Bronce
export function createCubeModel() {
  const geom = new THREE.BoxGeometry(0.85, 0.85, 0.85);
  const mat = new THREE.MeshStandardMaterial({ 
    color: 0xcd7f32, // Bronce
    roughness: 0.2, 
    metalness: 0.9,
    bumpScale: 0.05
  });
  return new THREE.Mesh(geom, mat);
}

// 10. Plan Pro: Esfera de Cian con Anillo
export function createOrbitalModel(color) {
  const group = new THREE.Group();
  
  const coreGeom = new THREE.SphereGeometry(0.45, 16, 16);
  const coreMat = new THREE.MeshStandardMaterial({ color: color, roughness: 0.1, metalness: 0.8 });
  const core = new THREE.Mesh(coreGeom, coreMat);
  group.add(core);
  
  const ringGeom = new THREE.TorusGeometry(0.8, 0.05, 8, 32);
  const ringMat = new THREE.MeshStandardMaterial({ color: color, emissive: color, emissiveIntensity: 0.8 });
  const ring = new THREE.Mesh(ringGeom, ringMat);
  ring.rotation.x = Math.PI / 3;
  group.add(ring);
  
  return group;
}

// 11. Plan Premium: Diamante Dorado
export function createDiamondModel() {
  const group = new THREE.Group();
  
  const geom = new THREE.OctahedronGeometry(0.7);
  const mat = new THREE.MeshStandardMaterial({ 
    color: 0xffd700, // Oro
    emissive: 0xffaa00,
    emissiveIntensity: 0.4,
    roughness: 0.1,
    metalness: 0.9 
  });
  const diamond = new THREE.Mesh(geom, mat);
  group.add(diamond);
  
  // Nube de mini partículas flotantes alrededor
  const pCount = 20;
  const pGeom = new THREE.BufferGeometry();
  const pPos = new Float32Array(pCount * 3);
  for (let i = 0; i < pCount * 3; i += 3) {
    pPos[i] = (Math.random() - 0.5) * 1.5;
    pPos[i+1] = (Math.random() - 0.5) * 1.5;
    pPos[i+2] = (Math.random() - 0.5) * 1.5;
  }
  pGeom.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
  const pMat = new THREE.PointsMaterial({ color: 0xffd700, size: 0.08, transparent: true, opacity: 0.8 });
  const points = new THREE.Points(pGeom, pMat);
  group.add(points);

  return group;
}

// 12. Plan VIP: Corona Dorada Real con Neón
export function createCrownModel(color) {
  const group = new THREE.Group();
  
  // Aro de la corona
  const rimGeom = new THREE.TorusGeometry(0.55, 0.08, 8, 24);
  const goldMat = new THREE.MeshStandardMaterial({ color: 0xffd700, roughness: 0.1, metalness: 0.9 });
  const rim = new THREE.Mesh(rimGeom, goldMat);
  rim.rotation.x = Math.PI / 2;
  rim.position.y = -0.3;
  group.add(rim);
  
  // 5 Puntas con Conos apuntando arriba
  const spikeGeom = new THREE.ConeGeometry(0.08, 0.4, 4);
  const gemGeom = new THREE.SphereGeometry(0.045, 8, 8);
  const gemMat = new THREE.MeshStandardMaterial({ color: color, emissive: color, emissiveIntensity: 1.5 });
  
  for (let i = 0; i < 5; i++) {
    const angle = (i * Math.PI * 2) / 5;
    const radius = 0.52;
    const x = radius * Math.cos(angle);
    const z = radius * Math.sin(angle);
    
    const spike = new THREE.Mesh(spikeGeom, goldMat);
    spike.position.set(x, -0.1, z);
    // Inclinar ligeramente hacia afuera
    spike.rotation.x = z * 0.4;
    spike.rotation.z = -x * 0.4;
    group.add(spike);
    
    // Joya brillante en la punta del cono
    const gem = new THREE.Mesh(gemGeom, gemMat);
    gem.position.set(x * 1.1, 0.15, z * 1.1);
    group.add(gem);
  }
  
  // Gema gigante flotando en el centro
  const centerGemGeom = new THREE.OctahedronGeometry(0.2);
  const centerGem = new THREE.Mesh(centerGemGeom, gemMat);
  centerGem.position.y = -0.1;
  group.add(centerGem);

  return group;
}
