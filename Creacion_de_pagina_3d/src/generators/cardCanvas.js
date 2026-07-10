import * as THREE from 'three';

// Genera texturas Canvas 2D en tiempo real para juegos y suscripciones
export function createCardTexture(item) {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 768;
  const ctx = canvas.getContext('2d');
  
  // Crear la textura de Three.js inmediatamente
  const texture = new THREE.CanvasTexture(canvas);
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.magFilter = THREE.LinearFilter;
  
  // Dibujar estado inicial (con emoji)
  drawCard(canvas, ctx, item, null);
  texture.needsUpdate = true;
  
  // Resolver ruta de la imagen automáticamente si no viene dada en los metadatos y no es suscripción
  let imgUrl = item.image || item.imagen || item.img;
  if (!imgUrl && !item.isSub) {
    const title = item.title || item.nombre || '';
    const filename = title.toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .trim();
    imgUrl = `/img/games/${filename}.jpg`;
  }
  
  // Cargar imagen de forma asíncrona si existe y no es una suscripción
  if (imgUrl && !item.isSub) {
    const img = new Image();
    img.src = imgUrl;
    
    const updateTexture = () => {
      drawCard(canvas, ctx, item, img);
      // Retrasar levemente (50ms) para garantizar que Three.js ya haya vinculado la textura al material en la GPU
      setTimeout(() => {
        texture.needsUpdate = true;
      }, 50);
    };
    
    if (img.complete) {
      updateTexture();
    } else {
      img.onload = updateTexture;
      img.onerror = () => {
        console.warn(`No se pudo cargar la imagen: ${imgUrl}. Usando emoji como respaldo.`);
      };
    }
  }
  
  return texture;
}

// Dibuja el contenido de la tarjeta en el canvas defendido contra valores nulos y español/inglés
export function drawCard(canvas, ctx, item, img = null) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const isSub = !!item.isSub;
  const colorHex = item.color || '#00f2fe';
  const emoji = item.emoji || '🎮';
  const title = item.title || item.nombre || 'Sin título';
  const category = (isSub ? 'Suscripción' : (item.category || item.categoria || 'Otros')).toUpperCase();

  // 1. Fondo degradado
  const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
  if (isSub) {
    grad.addColorStop(0, '#150030');
    grad.addColorStop(0.5, '#080016');
    grad.addColorStop(1, colorHex);
  } else {
    grad.addColorStop(0, '#0a0a1a');
    grad.addColorStop(0.5, '#040410');
    grad.addColorStop(1, colorHex);
  }
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // 2. Líneas Sci-Fi de cuadrícula
  ctx.strokeStyle = isSub ? 'rgba(157, 78, 221, 0.05)' : 'rgba(0, 242, 254, 0.03)';
  ctx.lineWidth = 1;
  for (let i = 0; i < canvas.width; i += 30) {
    ctx.beginPath();
    ctx.moveTo(i, 0);
    ctx.lineTo(i, canvas.height);
    ctx.stroke();
  }
  for (let i = 0; i < canvas.height; i += 30) {
    ctx.beginPath();
    ctx.moveTo(0, i);
    ctx.lineTo(canvas.width, i);
    ctx.stroke();
  }

  // 3. Dibujar Imagen del juego (si ya cargó) o el Emoji
  if (img) {
    const targetW = 380;
    const targetH = 500;
    const x = canvas.width / 2 - targetW / 2;
    const y = canvas.height / 2 - targetH / 2 - 40;
    
    ctx.save();
    ctx.beginPath();
    // Soporte y retrocompatibilidad para navegadores antiguos sin ctx.roundRect
    if (typeof ctx.roundRect === 'function') {
      ctx.roundRect(x, y, targetW, targetH, 16);
    } else {
      ctx.rect(x, y, targetW, targetH);
    }
    ctx.clip();
    ctx.drawImage(img, x, y, targetW, targetH);
    ctx.restore();
    
    // Suave degradado negro inferior sobre la imagen para fundirse con los textos
    const imgGrad = ctx.createLinearGradient(0, y + targetH - 150, 0, y + targetH);
    imgGrad.addColorStop(0, 'rgba(4,4,16,0)');
    imgGrad.addColorStop(0.7, 'rgba(4,4,16,0.7)');
    imgGrad.addColorStop(1, 'rgba(4,4,16,0.95)');
    ctx.fillStyle = imgGrad;
    ctx.fillRect(x, y + targetH - 150, targetW, 150);
  } else {
    // Dibujar Emoji como placeholder
    ctx.shadowColor = colorHex;
    ctx.shadowBlur = 30;
    ctx.font = isSub ? '200px Inter' : '160px Inter';
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(emoji, canvas.width / 2, canvas.height / 2 - (isSub ? 60 : 40));
    ctx.shadowBlur = 0; // Reset
  }

  // 4. Rectángulo interior neón frontal
  ctx.strokeStyle = colorHex;
  ctx.lineWidth = isSub ? 8 : 6;
  ctx.shadowColor = colorHex;
  ctx.shadowBlur = isSub ? 20 : 15;
  ctx.strokeRect(20, 20, canvas.width - 40, canvas.height - 40);
  
  // 5. Detalle de Esquinas HUD
  ctx.fillStyle = '#ffffff';
  ctx.shadowBlur = 0;
  const size = 15;
  ctx.fillRect(20, 20, size, 4);
  ctx.fillRect(20, 20, 4, size);
  ctx.fillRect(canvas.width - 20 - size, 20, size, 4);
  ctx.fillRect(canvas.width - 20, 20, 4, size);
  ctx.fillRect(20, canvas.height - 20, size, 4);
  ctx.fillRect(20, canvas.height - 20 - size, 4, size);
  ctx.fillRect(canvas.width - 20 - size, canvas.height - 20, size, 4);
  ctx.fillRect(canvas.width - 20, canvas.height - 20 - size, 4, size);
  
  // 6. Título
  ctx.shadowBlur = 10;
  ctx.shadowColor = colorHex;
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 28px Orbitron';
  ctx.textAlign = 'center';
  ctx.fillText(title, canvas.width / 2, canvas.height - 180);
  
  // 7. Etiqueta / Categoría
  ctx.font = 'bold 16px Orbitron';
  ctx.fillStyle = colorHex;
  const textWidth = ctx.measureText(category).width;
  ctx.strokeStyle = colorHex;
  ctx.lineWidth = 2;
  ctx.shadowBlur = 5;
  ctx.strokeRect(canvas.width / 2 - textWidth / 2 - 12, canvas.height - 145, textWidth + 24, 30);
  ctx.fillText(category, canvas.width / 2, canvas.height - 125);
  
  // 8. Precio
  ctx.shadowBlur = 15;
  ctx.fillStyle = '#ffffff';
  if (isSub) {
    ctx.font = 'bold 36px Orbitron';
    const priceMonthly = typeof item.priceMonthly !== 'undefined' ? item.priceMonthly : 0;
    const priceStr = priceMonthly === 0 ? "GRATIS" : `$${priceMonthly.toFixed(2)}/mes`;
    ctx.fillText(priceStr, canvas.width / 2, canvas.height - 70);
  } else {
    ctx.font = '900 48px Orbitron';
    const priceVal = typeof item.price !== 'undefined' ? item.price : (typeof item.precio !== 'undefined' ? item.precio : 0);
    const priceStr = priceVal === 0 ? "GRATIS" : `$${priceVal.toFixed(2)}`;
    ctx.fillText(priceStr, canvas.width / 2, canvas.height - 70);
  }
}

// Genera texturas Canvas 2D para el dorso de las tarjetas (Descripción del juego)
export function createCardBackTexture(item) {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 768;
  const ctx = canvas.getContext('2d');
  
  const texture = new THREE.CanvasTexture(canvas);
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.magFilter = THREE.LinearFilter;
  
  drawCardBack(canvas, ctx, item);
  texture.needsUpdate = true;
  
  return texture;
}

// Dibuja el dorso de la tarjeta (Descripción)
export function drawCardBack(canvas, ctx, item) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const isSub = !!item.isSub;
  const colorHex = item.color || '#00f2fe';
  const title = item.title || item.nombre || 'Sin título';
  const desc = item.description || item.descripcion || 'Sin descripción disponible.';
  const rating = item.rating || 'N/A';
  const dev = item.developer || item.desarrollador || 'Desconocido';
  const platforms = item.platforms || item.plataformas || 'Multiplataforma';

  // 1. Fondo degradado invertido
  const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
  if (isSub) {
    grad.addColorStop(0, '#080016');
    grad.addColorStop(1, '#1b003a');
  } else {
    grad.addColorStop(0, '#040410');
    grad.addColorStop(1, '#0e0e28');
  }
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // 2. Rejilla Sci-Fi
  ctx.strokeStyle = isSub ? 'rgba(157, 78, 221, 0.04)' : 'rgba(0, 242, 254, 0.02)';
  ctx.lineWidth = 1;
  for (let i = 0; i < canvas.width; i += 30) {
    ctx.beginPath();
    ctx.moveTo(i, 0);
    ctx.lineTo(i, canvas.height);
    ctx.stroke();
  }
  for (let i = 0; i < canvas.height; i += 30) {
    ctx.beginPath();
    ctx.moveTo(0, i);
    ctx.lineTo(canvas.width, i);
    ctx.stroke();
  }

  // 3. Rectángulo neón exterior
  ctx.strokeStyle = colorHex;
  ctx.lineWidth = 4;
  ctx.shadowColor = colorHex;
  ctx.shadowBlur = 10;
  ctx.strokeRect(20, 20, canvas.width - 40, canvas.height - 40);
  ctx.shadowBlur = 0; // Reset

  // 4. Título en el dorso
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 24px Orbitron';
  ctx.textAlign = 'center';
  ctx.fillText(title.toUpperCase(), canvas.width / 2, 70);

  // Línea divisoria
  ctx.strokeStyle = `${colorHex}66`;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(40, 95);
  ctx.lineTo(canvas.width - 40, 95);
  ctx.stroke();

  // 5. Título de sección
  ctx.fillStyle = colorHex;
  ctx.font = 'bold 16px Orbitron';
  ctx.textAlign = 'left';
  ctx.fillText('TRANSMISIÓN DE DATOS:', 50, 140);

  // 6. Texto de la descripción (Párrafo)
  ctx.fillStyle = '#e2e8f0';
  ctx.font = '300 18px Inter';
  ctx.textAlign = 'left';
  wrapText(ctx, desc, 50, 180, canvas.width - 100, 26);

  // 7. Caja de especificaciones abajo
  const boxY = canvas.height - 240;
  ctx.fillStyle = 'rgba(255, 255, 255, 0.03)';
  ctx.strokeStyle = `${colorHex}33`;
  ctx.lineWidth = 1;
  ctx.fillRect(40, boxY, canvas.width - 80, 180);
  ctx.strokeRect(40, boxY, canvas.width - 80, 180);

  // Rellenar especificaciones
  ctx.textAlign = 'left';
  ctx.font = 'bold 14px Orbitron';
  
  if (isSub) {
    ctx.fillStyle = colorHex;
    ctx.fillText('BENEFICIOS DE ACCESO:', 60, boxY + 35);
    ctx.fillStyle = '#ffffff';
    ctx.font = '14px Inter';
    const features = item.features || [];
    for (let i = 0; i < Math.min(features.length, 4); i++) {
      ctx.fillText(`• ${features[i]}`, 60, boxY + 70 + (i * 28));
    }
  } else {
    ctx.fillStyle = colorHex;
    ctx.fillText('ESPECIFICACIONES:', 60, boxY + 35);
    
    ctx.fillStyle = '#a0aec0';
    ctx.font = '13px Orbitron';
    ctx.fillText('DESARROLLADOR:', 60, boxY + 70);
    ctx.fillText('PLATAFORMAS:', 60, boxY + 110);
    ctx.fillText('VALORACIÓN:', 60, boxY + 150);

    ctx.fillStyle = '#ffffff';
    ctx.font = '14px Inter';
    ctx.fillText(dev, 220, boxY + 70);
    ctx.fillText(platforms, 220, boxY + 110);
    ctx.font = 'bold 14px Orbitron';
    ctx.fillStyle = 'var(--secondary-glow)';
    ctx.fillText(`${rating} ★`, 220, boxY + 150);
  }
}

// Función auxiliar para envolver texto en Canvas
function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
  const words = text.split(' ');
  let line = '';
  let currentY = y;

  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + ' ';
    const metrics = ctx.measureText(testLine);
    const testWidth = metrics.width;
    if (testWidth > maxWidth && n > 0) {
      ctx.fillText(line, x, currentY);
      line = words[n] + ' ';
      currentY += lineHeight;
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line, x, currentY);
}
