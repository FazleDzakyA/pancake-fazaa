/**
 * ====================================================================
 * PANCAKE FAZAA — Core Game Engine
 * Concept: "Flip it. Stack it. Enjoy it."
 * Stack: 6 Fluffy 3D Pancakes
 * Features:
 * - Victory animation in ALL modes (Santai, Tantangan, dll)
 * - Animated Maple Syrup Pitcher & Stream FX
 * - Confetti & Golden Stars Canvas FX
 * - 1 Hint limit per round (reset on shuffle)
 * ====================================================================
 */

(function () {
  'use strict';

  // --- Sound Engine (Web Audio API - Zero-Dependency Procedural) ---
  class SoundManager {
    constructor() {
      this.enabled = true;
      this.ctx = null;
    }

    init() {
      if (!this.ctx) {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (AudioCtx) {
          this.ctx = new AudioCtx();
        }
      }
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
    }

    toggle() {
      this.init();
      this.enabled = !this.enabled;
      return this.enabled;
    }

    playClick() {
      if (!this.enabled) return;
      this.init();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(440, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(160, this.ctx.currentTime + 0.06);

      gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.06);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.07);
    }

    playFlip() {
      if (!this.enabled) return;
      this.init();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(200, now);
      osc.frequency.exponentialRampToValueAtTime(540, now + 0.15);
      osc.frequency.exponentialRampToValueAtTime(280, now + 0.35);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.28, now + 0.12);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.36);

      // Sizzle Noise
      try {
        const bufferSize = this.ctx.sampleRate * 0.18;
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          data[i] = Math.random() * 2 - 1;
        }
        const noise = this.ctx.createBufferSource();
        noise.buffer = buffer;

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(1400, now);
        filter.Q.setValueAtTime(2.2, now);

        const noiseGain = this.ctx.createGain();
        noiseGain.gain.setValueAtTime(0.09, now);
        noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

        noise.connect(filter);
        filter.connect(noiseGain);
        noiseGain.connect(this.ctx.destination);
        noise.start(now);
      } catch (e) {}
    }

    playFlop() {
      if (!this.enabled) return;
      this.init();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(160, now);
      osc.frequency.exponentialRampToValueAtTime(55, now + 0.18);

      gain.gain.setValueAtTime(0.35, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.2);
    }

    playSparkle() {
      if (!this.enabled) return;
      this.init();
      if (!this.ctx) return;

      const notes = [523.25, 659.25, 783.99, 1046.50];
      const now = this.ctx.currentTime;

      notes.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.06);

        gain.gain.setValueAtTime(0.001, now + idx * 0.06);
        gain.gain.linearRampToValueAtTime(0.14, now + idx * 0.06 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.06 + 0.22);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + idx * 0.06);
        osc.stop(now + idx * 0.06 + 0.25);
      });
    }

    playVictory() {
      if (!this.enabled) return;
      this.init();
      if (!this.ctx) return;

      const chords = [523.25, 659.25, 783.99, 1046.5, 1318.5, 1567.98]; // C, E, G, C, E, G
      const now = this.ctx.currentTime;

      chords.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.11);

        gain.gain.setValueAtTime(0.001, now + idx * 0.11);
        gain.gain.linearRampToValueAtTime(0.22, now + idx * 0.11 + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.11 + 0.55);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + idx * 0.11);
        osc.stop(now + idx * 0.11 + 0.6);
      });
    }

    playPop() {
      if (!this.enabled) return;
      this.init();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(680, now);
      osc.frequency.exponentialRampToValueAtTime(200, now + 0.08);

      gain.gain.setValueAtTime(0.22, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.09);
    }
  }

  // --- Ambient Steam & Morning Lighting Canvas ---
  class AmbientCanvas {
    constructor(canvasId) {
      this.canvas = document.getElementById(canvasId);
      this.ctx = this.canvas.getContext('2d');
      this.particles = [];
      this.resize();
      window.addEventListener('resize', () => this.resize());
      this.initParticles(30);
      this.animate = this.animate.bind(this);
      requestAnimationFrame(this.animate);
    }

    resize() {
      this.width = this.canvas.width = window.innerWidth;
      this.height = this.canvas.height = window.innerHeight;
    }

    initParticles(count) {
      for (let i = 0; i < count; i++) {
        this.particles.push({
          x: Math.random() * this.width,
          y: Math.random() * this.height,
          radius: Math.random() * 2.8 + 1,
          speedY: Math.random() * 0.4 + 0.2,
          speedX: (Math.random() - 0.5) * 0.3,
          alpha: Math.random() * 0.4 + 0.2,
          pulse: Math.random() * Math.PI * 2,
          type: Math.random() > 0.4 ? 'gold' : 'steam'
        });
      }
    }

    animate() {
      this.ctx.clearRect(0, 0, this.width, this.height);

      for (let p of this.particles) {
        p.y -= p.speedY;
        p.x += p.speedX;
        p.pulse += 0.02;

        if (p.y < -10) {
          p.y = this.height + 10;
          p.x = Math.random() * this.width;
        }

        const currentAlpha = p.alpha + Math.sin(p.pulse) * 0.15;
        this.ctx.beginPath();
        this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);

        if (p.type === 'gold') {
          this.ctx.fillStyle = `rgba(255, 215, 90, ${Math.max(0, currentAlpha)})`;
        } else {
          this.ctx.fillStyle = `rgba(255, 255, 255, ${Math.max(0, currentAlpha * 0.55)})`;
        }
        this.ctx.fill();
      }

      requestAnimationFrame(this.animate);
    }
  }

  // --- Confetti & Celebration Ribbon Canvas Engine ---
  class ConfettiCanvas {
    constructor(canvasId) {
      this.canvas = document.getElementById(canvasId);
      this.ctx = this.canvas.getContext('2d');
      this.particles = [];
      this.isActive = false;
      this.resize();
      window.addEventListener('resize', () => this.resize());
      this.loop = this.loop.bind(this);
    }

    resize() {
      this.width = this.canvas.width = window.innerWidth;
      this.height = this.canvas.height = window.innerHeight;
    }

    start(count = 90) {
      this.particles = [];
      const colors = ['#FF5A36', '#FFB703', '#FB8500', '#FFD166', '#06D6A0', '#118AB2', '#EF476F'];

      for (let i = 0; i < count; i++) {
        this.particles.push({
          x: Math.random() * this.width,
          y: -20 - Math.random() * 200,
          w: Math.random() * 10 + 6,
          h: Math.random() * 6 + 4,
          color: colors[Math.floor(Math.random() * colors.length)],
          vx: (Math.random() - 0.5) * 3,
          vy: Math.random() * 4 + 2.5,
          angle: Math.random() * 360,
          vAngle: (Math.random() - 0.5) * 8,
          isStar: Math.random() > 0.75
        });
      }

      this.isActive = true;
      requestAnimationFrame(this.loop);

      // Stop auto after 4.5 seconds
      setTimeout(() => {
        this.isActive = false;
        this.ctx.clearRect(0, 0, this.width, this.height);
      }, 4500);
    }

    loop() {
      if (!this.isActive && this.particles.length === 0) return;

      this.ctx.clearRect(0, 0, this.width, this.height);

      for (let i = this.particles.length - 1; i >= 0; i--) {
        const p = this.particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.angle += p.vAngle;

        this.ctx.save();
        this.ctx.translate(p.x, p.y);
        this.ctx.rotate((p.angle * Math.PI) / 180);

        if (p.isStar) {
          this.ctx.fillStyle = '#FFE066';
          this.ctx.font = '14px sans-serif';
          this.ctx.fillText('✨', -7, 5);
        } else {
          this.ctx.fillStyle = p.color;
          this.ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        }
        this.ctx.restore();

        if (p.y > this.height + 20) {
          this.particles.splice(i, 1);
        }
      }

      if (this.isActive || this.particles.length > 0) {
        requestAnimationFrame(this.loop);
      }
    }
  }

  // --- Dynamic Particle Crumbs Emitter ---
  class ParticleEmitter {
    static burst(x, y, count = 16) {
      const container = document.body;
      const colors = ['#E59438', '#C46D1E', '#FFDF85', '#FFF0A5', '#FF4D6D', '#4F5D75'];

      for (let i = 0; i < count; i++) {
        const p = document.createElement('div');
        p.className = 'particle-crumb';

        const size = Math.random() * 8 + 4;
        const color = colors[Math.floor(Math.random() * colors.length)];
        const isStar = Math.random() > 0.6;

        p.style.width = `${size}px`;
        p.style.height = `${size}px`;
        p.style.backgroundColor = isStar ? 'transparent' : color;
        p.style.left = `${x}px`;
        p.style.top = `${y}px`;

        if (isStar) {
          p.innerText = '✨';
          p.style.fontSize = `${size + 8}px`;
          p.style.lineHeight = '1';
        }

        container.appendChild(p);

        const angle = Math.random() * Math.PI * 2;
        const velocity = Math.random() * 110 + 40;
        const dx = Math.cos(angle) * velocity;
        const dy = Math.sin(angle) * velocity - 45;

        p.animate([
          { transform: 'translate(0, 0) scale(1)', opacity: 1 },
          { transform: `translate(${dx}px, ${dy}px) scale(0.3)`, opacity: 0 }
        ], {
          duration: 650 + Math.random() * 250,
          easing: 'cubic-bezier(0.25, 1, 0.5, 1)'
        }).onfinish = () => p.remove();
      }
    }
  }

  // --- Main Pancake Fazaa Game Application ---
  class PancakeFazaaGame {
    constructor() {
      this.sound = new SoundManager();
      this.confetti = new ConfettiCanvas('confetti-canvas');
      this.playerName = 'Pancake Lover';
      this.flipCount = 0;
      this.isFlipping = false;
      this.isChallengeMode = true;
      this.hasWonThisRound = false;

      // 1 Hint limit per round!
      this.hintsRemaining = 1;

      // 6 Distinct, Thick, Fluffy Pancakes
      // Sizes 1 to 6 (1 smallest at top, 6 largest at bottom)
      this.pancakeDefs = {
        1: { size: 1, label: '1 • Mini', cssWidth: 'min(130px, 36vw)' },
        2: { size: 2, label: '2 • Imut', cssWidth: 'min(160px, 44vw)' },
        3: { size: 3, label: '3 • Sedang', cssWidth: 'min(190px, 52vw)' },
        4: { size: 4, label: '4 • Sedang+', cssWidth: 'min(220px, 60vw)' },
        5: { size: 5, label: '5 • Besar', cssWidth: 'min(250px, 68vw)' },
        6: { size: 6, label: '6 • Jumbo', cssWidth: 'min(280px, 76vw)' }
      };

      // Current stack: index 0 is TOP, index 5 is BOTTOM
      // Target sorted order: [1, 2, 3, 4, 5, 6]
      this.stack = [4, 2, 6, 1, 5, 3];

      this.initDOM();
      this.initEvents();
      this.initSpatulaTracker();
      this.renderPancakes();
      this.updateHintButtonUI();
    }

    initDOM() {
      // Screens & Modals
      this.landingScreen = document.getElementById('landing-screen');
      this.gameScreen = document.getElementById('game-screen');
      this.nameModal = document.getElementById('name-modal');
      this.victoryModal = document.getElementById('victory-modal');

      // Buttons
      this.btnPlayNow = document.getElementById('btn-play-now');
      this.btnLetsFlip = document.getElementById('btn-lets-flip');
      this.modalCloseBtn = document.getElementById('modal-close-btn');
      this.btnBackHome = document.getElementById('btn-back-home');
      this.btnResetStack = document.getElementById('btn-reset-stack');
      this.btnModeToggle = document.getElementById('btn-mode-toggle');
      this.btnHint = document.getElementById('btn-hint');
      this.btnVictoryReplay = document.getElementById('btn-victory-replay');
      this.btnVictoryChill = document.getElementById('btn-victory-chill');

      // Sound Buttons
      this.landingSoundBtn = document.getElementById('landing-sound-btn');
      this.gameSoundBtn = document.getElementById('game-sound-btn');
      this.soundIconIndicator = document.getElementById('sound-icon-indicator');

      // Labels & Displays
      this.nameInput = document.getElementById('player-name-input');
      this.playerDisplayName = document.getElementById('player-display-name');
      this.welcomeMsgText = document.getElementById('welcome-msg-text');
      this.welcomeToast = document.getElementById('welcome-toast');
      this.flipCountDisplay = document.getElementById('flip-count-display');
      this.missionTextLabel = document.getElementById('mission-text-label');
      this.modeIcon = document.getElementById('mode-icon');
      this.modeText = document.getElementById('mode-text');

      // Victory Stats
      this.victoryFlips = document.getElementById('victory-flips');
      this.victoryChefRank = document.getElementById('victory-chef-rank');

      // Interactive Stages
      this.pancakeStage = document.getElementById('pancake-stack-stage');
      this.victorySyrupRig = document.getElementById('victory-syrup-rig');
      this.spatulaSlideGuide = document.getElementById('spatula-slide-guide');
      this.heroInteractiveStack = document.getElementById('hero-interactive-stack');
      this.spatulaCursor = document.getElementById('spatula-cursor');
    }

    initEvents() {
      // 1. Landing Screen
      this.btnPlayNow.addEventListener('click', () => {
        this.sound.playClick();
        this.openNameModal();
      });

      this.heroInteractiveStack.addEventListener('click', () => {
        this.sound.playPop();
        const rect = this.heroInteractiveStack.getBoundingClientRect();
        ParticleEmitter.burst(rect.left + rect.width / 2, rect.top + rect.height / 2, 14);
      });

      // 2. Name Modal
      this.modalCloseBtn.addEventListener('click', () => {
        this.sound.playClick();
        this.closeNameModal();
      });

      this.btnLetsFlip.addEventListener('click', () => {
        this.sound.playSparkle();
        this.startFlipingExperience();
      });

      this.nameInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          this.btnLetsFlip.click();
        }
      });

      // 3. Sound Toggles
      const handleSoundToggle = () => {
        const isEnabled = this.sound.toggle();
        this.updateSoundButtons(isEnabled);
        if (isEnabled) this.sound.playPop();
      };

      this.landingSoundBtn.addEventListener('click', handleSoundToggle);
      this.gameSoundBtn.addEventListener('click', handleSoundToggle);

      // 4. Game Controls
      this.btnBackHome.addEventListener('click', () => {
        this.sound.playClick();
        this.goToLandingScreen();
      });

      this.btnResetStack.addEventListener('click', () => {
        this.sound.playSparkle();
        this.shuffleStack();
      });

      this.btnModeToggle.addEventListener('click', () => {
        this.sound.playClick();
        this.toggleGameMode();
      });

      this.btnHint.addEventListener('click', () => {
        this.provideHint();
      });

      // 5. Victory Modal Actions
      this.btnVictoryReplay.addEventListener('click', () => {
        this.sound.playClick();
        this.victoryModal.classList.remove('active');
        this.resetVictoryRig();
        this.shuffleStack();
      });

      this.btnVictoryChill.addEventListener('click', () => {
        this.sound.playClick();
        this.victoryModal.classList.remove('active');
        this.resetVictoryRig();
        this.setMode(false); // Switch to Free Chill Mode
      });
    }

    // --- Custom Spatula Tracker ---
    initSpatulaTracker() {
      let targetX = -100, targetY = -100;
      let currentX = -100, currentY = -100;
      let prevX = -100;

      window.addEventListener('pointermove', (e) => {
        targetX = e.clientX;
        targetY = e.clientY;
      });

      const updateSpatula = () => {
        currentX += (targetX - currentX) * 0.35;
        currentY += (targetY - currentY) * 0.35;

        const deltaX = currentX - prevX;
        prevX = currentX;
        const tilt = Math.max(-28, Math.min(28, -15 + deltaX * 1.8));

        if (!this.spatulaCursor.classList.contains('flipping')) {
          this.spatulaCursor.style.transform = `translate(${currentX - 25}px, ${currentY - 45}px) rotate(${tilt}deg)`;
        }

        requestAnimationFrame(updateSpatula);
      };
      requestAnimationFrame(updateSpatula);
    }

    triggerSpatulaSwoop(x, y) {
      this.spatulaCursor.style.transform = `translate(${x - 30}px, ${y - 30}px) rotate(45deg) scale(1.18)`;
      this.spatulaCursor.classList.add('flipping');
      setTimeout(() => {
        this.spatulaCursor.classList.remove('flipping');
      }, 350);
    }

    // --- Render Fluffy 6 Pancakes ---
    renderPancakes() {
      this.pancakeStage.innerHTML = '';

      const isStackSorted = this.checkSorted();

      this.stack.forEach((pancakeSize, stackIndex) => {
        const def = this.pancakeDefs[pancakeSize];
        const layer = document.createElement('div');
        layer.className = 'pancake-layer';
        layer.dataset.stackIndex = stackIndex;
        layer.dataset.size = pancakeSize;
        layer.style.width = def.cssWidth;
        layer.style.zIndex = this.stack.length - stackIndex;

        // Is this pancake in the right position? (Size 1 at top index 0, size 6 at bottom index 5)
        const isCorrectPosition = (pancakeSize === stackIndex + 1);
        if (isCorrectPosition) {
          layer.classList.add('is-sorted');
        }

        layer.innerHTML = `
          <div class="pancake-body">
            <div class="pancake-surface">
              <span class="pancake-number-pill">${def.label}</span>
              <span class="pancake-check" title="Sudah di posisi yang benar!">✅</span>
            </div>
            <div class="pancake-spots"></div>
            <div class="pancake-side"></div>
          </div>
        `;

        // Mount melting butter, syrup & berries to the TOP pancake (stackIndex 0)
        if (stackIndex === 0) {
          const topping = document.createElement('div');
          topping.className = 'stack-topping-pack';
          topping.innerHTML = `
            <div class="syrup-drip-pool"></div>
            <div class="butter-pat">
              <div class="butter-shine"></div>
            </div>
            <div class="topping-strawberry">🍓</div>
            <div class="topping-blueberry">🫐</div>
          `;
          layer.appendChild(topping);
        }

        // Pointer Enter / Hover
        layer.addEventListener('pointerenter', () => {
          this.showSpatulaGuide(layer);
        });

        // Pointer Leave
        layer.addEventListener('pointerleave', () => {
          this.hideSpatulaGuide();
        });

        // Click / Touch Flip Handler
        layer.addEventListener('pointerdown', (e) => {
          e.stopPropagation();
          this.handlePancakeFlip(stackIndex, e);
        });

        this.pancakeStage.appendChild(layer);
      });

      // Trigger Victory Animation in ALL MODES (Santai & Tantangan)
      if (isStackSorted && this.flipCount > 0 && !this.hasWonThisRound) {
        this.hasWonThisRound = true;
        setTimeout(() => this.triggerVictory(), 380);
      }
    }

    showSpatulaGuide(layerElement) {
      if (this.isFlipping) return;
      const rect = layerElement.getBoundingClientRect();
      const stageRect = this.pancakeStage.getBoundingClientRect();

      const topOffset = rect.bottom - stageRect.top - 6;
      this.spatulaSlideGuide.style.top = `${topOffset}px`;
      this.spatulaSlideGuide.classList.add('active');
    }

    hideSpatulaGuide() {
      this.spatulaSlideGuide.classList.remove('active');
    }

    // --- Core Gameplay: Spatula Flip Sub-stack ---
    handlePancakeFlip(flipIndex, event) {
      if (this.isFlipping) return;
      this.isFlipping = true;
      this.hideSpatulaGuide();

      document.querySelectorAll('.hint-target').forEach(el => el.classList.remove('hint-target'));

      this.flipCount++;
      this.flipCountDisplay.textContent = this.flipCount;

      this.sound.playFlip();

      const rect = event.currentTarget.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      this.triggerSpatulaSwoop(centerX, centerY);

      // Partikel remah & sparkle
      ParticleEmitter.burst(centerX, centerY, 16);

      const layers = Array.from(this.pancakeStage.children);
      const subLayers = layers.slice(0, flipIndex + 1);

      subLayers.forEach((layer, idx) => {
        const height = -120 - (flipIndex - idx) * 18;
        const rot = (idx % 2 === 0 ? 1 : -1) * (12 + idx * 3);
        layer.style.setProperty('--toss-height', `${height}px`);
        layer.style.setProperty('--toss-rot', `${rot}deg`);
        layer.classList.add('flipping-active');
      });

      setTimeout(() => {
        this.sound.playFlop();
        ParticleEmitter.burst(centerX, centerY + 15, 10);
      }, 540);

      setTimeout(() => {
        const flippedPart = this.stack.slice(0, flipIndex + 1).reverse();
        this.stack = [...flippedPart, ...this.stack.slice(flipIndex + 1)];

        this.renderPancakes();
        this.isFlipping = false;
      }, 720);
    }

    // --- Check if Stack is Sorted [1, 2, 3, 4, 5, 6] ---
    checkSorted() {
      for (let i = 0; i < this.stack.length; i++) {
        if (this.stack[i] !== i + 1) return false;
      }
      return true;
    }

    // --- VICTORY CELEBRATION (Triggered in ALL modes!) ---
    triggerVictory() {
      // 1. Play Triumphant Fanfare Sound
      this.sound.playVictory();

      // 2. Activate Maple Syrup Pouring Rig
      this.victorySyrupRig.classList.add('active');

      // 3. Stack does a cheerful rhythmic dance!
      this.pancakeStage.classList.add('celebrating');

      // 4. Confetti & Star shower
      this.confetti.start(100);

      // 5. Bursts of golden stars & crumbs on pancake
      const stageRect = this.pancakeStage.getBoundingClientRect();
      const cx = stageRect.left + stageRect.width / 2;
      const cy = stageRect.top + 30;
      ParticleEmitter.burst(cx, cy, 35);

      setTimeout(() => {
        ParticleEmitter.burst(cx, cy, 25);
      }, 700);

      // 6. Stats & modal display
      this.victoryFlips.textContent = this.flipCount;
      if (this.flipCount <= 6) {
        this.victoryChefRank.textContent = '🌟 Master Chef Legendaris 👨‍🍳';
      } else if (this.flipCount <= 10) {
        this.victoryChefRank.textContent = '⭐ Chef Pancake Handal 🥞';
      } else {
        this.victoryChefRank.textContent = '☕ Pancake Lover Gigih 🍯';
      }

      // Show modal after the syrup pours and stack dances!
      setTimeout(() => {
        this.victoryModal.classList.add('active');
      }, 1900);
    }

    resetVictoryRig() {
      this.victorySyrupRig.classList.remove('active');
      this.pancakeStage.classList.remove('celebrating');
    }

    // --- Shuffle / New Game ---
    shuffleStack() {
      if (this.isFlipping) return;

      this.resetVictoryRig();
      this.hasWonThisRound = false;

      // Reset Hint limit to 1 per round!
      this.hintsRemaining = 1;
      this.updateHintButtonUI();

      // Scramble array until it is NOT already sorted
      let shuffled;
      do {
        shuffled = [...this.stack];
        for (let i = shuffled.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
      } while (shuffled.every((val, idx) => val === idx + 1));

      this.stack = shuffled;
      this.flipCount = 0;
      this.flipCountDisplay.textContent = '0';

      this.renderPancakes();
      this.showToast('🥞 6 Pancake baru siap dibalik!');

      const stageRect = this.pancakeStage.getBoundingClientRect();
      ParticleEmitter.burst(stageRect.left + stageRect.width / 2, stageRect.top + stageRect.height / 2, 22);
    }

    // --- Game Mode Toggle: Challenge vs Chill ---
    toggleGameMode() {
      this.setMode(!this.isChallengeMode);
    }

    setMode(isChallenge) {
      this.isChallengeMode = isChallenge;
      if (this.isChallengeMode) {
        this.modeIcon.textContent = '🏆';
        this.modeText.textContent = 'Tantangan';
        this.missionTextLabel.innerHTML = '<strong>Misi Chef:</strong> Susun 6 pancake dari <strong>TERBESAR (bawah)</strong> ke <strong>TERKECIL (atas)!</strong>';
        this.showToast('🏆 Mode Tantangan Aktif!');
      } else {
        this.modeIcon.textContent = '☕';
        this.modeText.textContent = 'Santai';
        this.missionTextLabel.innerHTML = '<strong>Mode Santai:</strong> Bebas balik 6 pancake sesuka hati, nikmati animasi &amp; aroma sarapan! 🍯';
        this.showToast('☕ Mode Santai Aktif: Rileks & nikmati flip!');
      }
      this.renderPancakes();
    }

    // --- Provide Smart Hint (Limited to 1 time per game round!) ---
    provideHint() {
      if (this.isFlipping) return;

      if (this.hintsRemaining <= 0) {
        this.sound.playClick();
        this.showToast('⚠️ Petunjuk hanya bisa dipakai 1 kali per ronde!');
        return;
      }

      // Find largest unsorted item from bottom up
      let targetIndex = -1;
      for (let i = this.stack.length - 1; i >= 0; i--) {
        const expectedSize = i + 1;
        if (this.stack[i] !== expectedSize) {
          targetIndex = i;
          break;
        }
      }

      if (targetIndex === -1) {
        this.showToast('✨ Tumpukan sudah tersusun sempurna!');
        return;
      }

      // Use up the 1 hint
      this.hintsRemaining--;
      this.updateHintButtonUI();
      this.sound.playSparkle();

      const expectedSize = targetIndex + 1;
      const currentPos = this.stack.indexOf(expectedSize);

      let hintIndexToFlip;
      if (currentPos !== 0) {
        hintIndexToFlip = currentPos;
        this.showToast(`💡 Petunjuk (1x): Balik pancake [${expectedSize}] ke atas!`);
      } else {
        hintIndexToFlip = targetIndex;
        this.showToast(`💡 Petunjuk (1x): Balik sampai dasar [posisi ${targetIndex + 1}]!`);
      }

      const layers = Array.from(this.pancakeStage.children);
      if (layers[hintIndexToFlip]) {
        layers[hintIndexToFlip].classList.add('hint-target');
        this.showSpatulaGuide(layers[hintIndexToFlip]);
      }
    }

    updateHintButtonUI() {
      if (this.hintsRemaining > 0) {
        this.btnHint.innerHTML = '<span>💡</span><span>Petunjuk (1x)</span>';
        this.btnHint.style.opacity = '1';
        this.btnHint.style.cursor = 'pointer';
        this.btnHint.title = 'Minta petunjuk langkah terbaik (1 kali per ronde)';
      } else {
        this.btnHint.innerHTML = '<span>🔒</span><span>Petunjuk (0x)</span>';
        this.btnHint.style.opacity = '0.6';
        this.btnHint.style.cursor = 'not-allowed';
        this.btnHint.title = 'Kesempatan petunjuk habis untuk ronde ini (Acak untuk reset)';
      }
    }

    // --- Screen Transitions ---
    openNameModal() {
      this.nameModal.classList.add('active');
      setTimeout(() => this.nameInput.focus(), 150);
    }

    closeNameModal() {
      this.nameModal.classList.remove('active');
    }

    startFlipingExperience() {
      const inputVal = this.nameInput.value.trim();
      this.playerName = inputVal || 'Pancake Lover';

      this.playerDisplayName.textContent = this.playerName;
      this.welcomeMsgText.textContent = `Welcome, Chef ${this.playerName}!`;

      this.closeNameModal();

      this.landingScreen.classList.remove('active');
      this.gameScreen.classList.add('active');
      document.body.classList.add('in-game-active');

      setTimeout(() => {
        this.showToast(`🥞 Siap memasak 6 pancake, Chef ${this.playerName}!`);
      }, 300);
    }

    goToLandingScreen() {
      this.gameScreen.classList.remove('active');
      this.landingScreen.classList.add('active');
      document.body.classList.remove('in-game-active');
      this.resetVictoryRig();
    }

    showToast(message) {
      this.welcomeMsgText.textContent = message;
      this.welcomeToast.classList.add('show');
      setTimeout(() => {
        this.welcomeToast.classList.remove('show');
      }, 2600);
    }

    updateSoundButtons(isEnabled) {
      if (isEnabled) {
        this.landingSoundBtn.querySelector('.btn-icon').textContent = '🔊';
        this.landingSoundBtn.querySelector('.btn-label').textContent = 'Suara: Nyala';
        this.soundIconIndicator.textContent = '🔊';
      } else {
        this.landingSoundBtn.querySelector('.btn-icon').textContent = '🔇';
        this.landingSoundBtn.querySelector('.btn-label').textContent = 'Suara: Mati';
        this.soundIconIndicator.textContent = '🔇';
      }
    }
  }

  // --- Initialize on DOM ready ---
  window.addEventListener('DOMContentLoaded', () => {
    new AmbientCanvas('ambient-canvas');
    new PancakeFazaaGame();
  });
})();
