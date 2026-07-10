class AudioController {
  constructor() {
    this.ctx = null;
    this.muted = true; // Empieza silenciado para cumplir con políticas de autoplay del navegador
    this.ambientOsc = null;
    this.ambientGain = null;
    this.filterNode = null;
    this.lfo = null;
  }

  init() {
    if (this.ctx) return;
    
    // Crear el AudioContext
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    this.ctx = new AudioContextClass();
    
    // Iniciar dron ambiental si no está silenciado
    if (!this.muted) {
      this.startAmbient();
    }
  }

  setMute(state) {
    this.muted = state;
    if (!this.ctx) this.init();
    
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }

    if (this.muted) {
      this.stopAmbient();
    } else {
      this.startAmbient();
    }
  }

  // Sonido corto al pasar el ratón (Hover)
  playHover() {
    if (this.muted || !this.ctx) return;
    if (this.ctx.state === 'suspended') return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, this.ctx.currentTime);
    // Rápida subida de frecuencia para un toque tecnológico
    osc.frequency.exponentialRampToValueAtTime(1400, this.ctx.currentTime + 0.08);

    gain.gain.setValueAtTime(0.02, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.08);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.08);
  }

  // Sonido al seleccionar / hacer clic
  playSelect() {
    if (this.muted || !this.ctx) return;
    if (this.ctx.state === 'suspended') return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(600, this.ctx.currentTime);
    osc.frequency.setValueAtTime(1000, this.ctx.currentTime + 0.05);

    gain.gain.setValueAtTime(0.05, this.ctx.currentTime);
    gain.gain.setValueAtTime(0.05, this.ctx.currentTime + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.15);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.15);
  }

  // Sonido al añadir al carrito
  playAddToCart() {
    if (this.muted || !this.ctx) return;
    if (this.ctx.state === 'suspended') return;

    const t = this.ctx.currentTime;
    
    // Dos notas consecutivas ascendentes armónicas
    const playNote = (freq, delay, duration, volume) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, t + delay);
      
      gain.gain.setValueAtTime(volume, t + delay);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + delay + duration);
      
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      
      osc.start(t + delay);
      osc.stop(t + delay + duration);
    };

    playNote(523.25, 0, 0.12, 0.05);     // Nota C5
    playNote(659.25, 0.08, 0.12, 0.05);  // Nota E5
    playNote(783.99, 0.16, 0.20, 0.05);  // Nota G5
    playNote(1046.50, 0.24, 0.30, 0.04); // Nota C6
  }

  // Sonido al completar compra (Caja registradora espacial)
  playPurchase() {
    if (this.muted || !this.ctx) return;
    if (this.ctx.state === 'suspended') return;

    const t = this.ctx.currentTime;

    // Caja registradora (Arpegio rápido) + Ruido blanco metálico
    const playTone = (freq, delay, duration) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, t + delay);
      gain.gain.setValueAtTime(0.06, t + delay);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + delay + duration);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(t + delay);
      osc.stop(t + delay + duration);
    };

    playTone(987.77, 0, 0.1); // B5
    playTone(1318.51, 0.06, 0.3); // E6

    // Ruido metálico (Monedas)
    const bufferSize = this.ctx.sampleRate * 0.4;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 8000;
    filter.Q.value = 2.0;

    const noiseGain = this.ctx.createGain();
    noiseGain.gain.setValueAtTime(0.0, t);
    noiseGain.gain.linearRampToValueAtTime(0.04, t + 0.06);
    noiseGain.gain.exponentialRampToValueAtTime(0.0001, t + 0.35);

    noise.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(this.ctx.destination);

    noise.start(t + 0.06);
    noise.stop(t + 0.4);
  }

  // Iniciar sonido de fondo (Space Engine Drone)
  startAmbient() {
    if (this.muted) return;
    if (!this.ctx) this.init();
    if (this.ambientOsc) return;

    try {
      this.ambientOsc = this.ctx.createOscillator();
      this.ambientGain = this.ctx.createGain();
      this.filterNode = this.ctx.createBiquadFilter();
      this.lfo = this.ctx.createOscillator();
      const lfoGain = this.ctx.createGain();

      // Oscilador de baja frecuencia para simular motor de nave
      this.ambientOsc.type = 'sine'; // Cambiado de sawtooth a sine para quitar el bajo agresivo
      this.ambientOsc.frequency.setValueAtTime(110, this.ctx.currentTime); // Subido de 55 a 110Hz para mayor suavidad

      // Filtro pasa bajos para atenuar los agudos y dejar solo el zumbido espacial
      this.filterNode.type = 'lowpass';
      this.filterNode.frequency.setValueAtTime(200, this.ctx.currentTime);
      this.filterNode.Q.value = 1.0;

      // LFO para modular la frecuencia del filtro (sonido de pulsación lenta)
      this.lfo.type = 'sine';
      this.lfo.frequency.setValueAtTime(0.2, this.ctx.currentTime); // Ciclo lento de 5 seg
      lfoGain.gain.setValueAtTime(40, this.ctx.currentTime);

      this.lfo.connect(lfoGain);
      lfoGain.connect(this.filterNode.frequency);

      // Conexiones de ganancia
      this.ambientGain.gain.setValueAtTime(0.0, this.ctx.currentTime);
      this.ambientGain.gain.linearRampToValueAtTime(0.02, this.ctx.currentTime + 2.0); // Reducido de 0.08 a 0.02 para suavidad

      // Cablear nodos
      this.ambientOsc.connect(this.filterNode);
      this.filterNode.connect(this.ambientGain);
      this.ambientGain.connect(this.ctx.destination);

      // Arrancar sintetizador ambiental
      this.ambientOsc.start();
      this.lfo.start();
    } catch (e) {
      console.warn("No se pudo iniciar el audio ambiental", e);
    }
  }

  // Detener sonido de fondo
  stopAmbient() {
    const osc = this.ambientOsc;
    const gain = this.ambientGain;
    const lfoOsc = this.lfo;

    if (!osc || !gain) return;

    try {
      const t = this.ctx.currentTime;
      gain.gain.setValueAtTime(gain.gain.value, t);
      gain.gain.linearRampToValueAtTime(0.0001, t + 0.5); // Fade-out en medio segundo

      setTimeout(() => {
        try {
          osc.stop();
          if (lfoOsc) lfoOsc.stop();
        } catch (err) {}
      }, 600);

      this.ambientOsc = null;
      this.ambientGain = null;
      this.filterNode = null;
      this.lfo = null;
    } catch (e) {
      console.error(e);
    }
  }
}

export const audioController = new AudioController();
