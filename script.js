/* =========================================================
   CUMPLE CHIAVASSA — script.js
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

  /* =======================================================
     1) FONDO ANIMADO DE PARTÍCULAS
     ======================================================= */

  const bgCanvas = document.getElementById("bg-canvas");
  const bgCtx = bgCanvas.getContext("2d");

  const BG_PARTICLE_COUNT = 46;
  const BG_PARTICLE_COLORS = ["#ff4fa3", "#ffc145", "#4fd8ff", "#f5f0ff"];

  let bgParticles = [];
  let bgWidth = 0;
  let bgHeight = 0;

  function resizeBgCanvas() {
    bgWidth = window.innerWidth;
    bgHeight = window.innerHeight;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    bgCanvas.width = bgWidth * dpr;
    bgCanvas.height = bgHeight * dpr;
    bgCanvas.style.width = bgWidth + "px";
    bgCanvas.style.height = bgHeight + "px";
    bgCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function createBgParticles() {
    bgParticles = Array.from({ length: BG_PARTICLE_COUNT }, () => ({
      x: Math.random() * bgWidth,
      y: Math.random() * bgHeight,
      r: 0.8 + Math.random() * 2.1,
      speedY: 0.12 + Math.random() * 0.28,
      drift: (Math.random() - 0.5) * 0.25,
      alpha: 0.25 + Math.random() * 0.45,
      color: BG_PARTICLE_COLORS[Math.floor(Math.random() * BG_PARTICLE_COLORS.length)],
      twinkleSpeed: 0.008 + Math.random() * 0.02,
      twinklePhase: Math.random() * Math.PI * 2,
    }));
  }

  function drawBgParticles() {
    bgCtx.clearRect(0, 0, bgWidth, bgHeight);

    for (const p of bgParticles) {
      p.y -= p.speedY;
      p.x += p.drift;
      p.twinklePhase += p.twinkleSpeed;

      if (p.y < -10) {
        p.y = bgHeight + 10;
        p.x = Math.random() * bgWidth;
      }
      if (p.x < -10) p.x = bgWidth + 10;
      if (p.x > bgWidth + 10) p.x = -10;

      const twinkle = (Math.sin(p.twinklePhase) + 1) / 2;
      const alpha = p.alpha * (0.5 + twinkle * 0.5);

      bgCtx.beginPath();
      bgCtx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      bgCtx.fillStyle = hexToRgba(p.color, alpha);
      bgCtx.fill();
    }

    requestAnimationFrame(drawBgParticles);
  }

  function hexToRgba(hex, alpha) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }

  resizeBgCanvas();
  createBgParticles();
  drawBgParticles();

  window.addEventListener("resize", () => {
    resizeBgCanvas();
    createBgParticles();
  });

  /* =======================================================
     2) EFECTOS AL PRESIONAR "ABRIR SALUDO"
     ======================================================= */

  const openBtn = document.getElementById("open-btn");
  const giftCard = document.getElementById("gift-card");
  const fxCanvas = document.getElementById("fx-canvas");
  const fxCtx = fxCanvas.getContext("2d");

  const CONFETTI_COLORS = ["#ff4fa3", "#ffc145", "#4fd8ff", "#ffffff", "#c07bff"];
  const LAUNCH_DELAY_MS = 900;

  let fxWidth = 0;
  let fxHeight = 0;
  let confettiPieces = [];
  let fxAnimationId = null;
  let fxRunning = false;

  function resizeFxCanvas() {
    fxWidth = window.innerWidth;
    fxHeight = window.innerHeight;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    fxCanvas.width = fxWidth * dpr;
    fxCanvas.height = fxHeight * dpr;
    fxCanvas.style.width = fxWidth + "px";
    fxCanvas.style.height = fxHeight + "px";
    fxCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  resizeFxCanvas();
  window.addEventListener("resize", resizeFxCanvas);

  function createConfettiBurst() {
    const PIECE_COUNT = 90;
    const originX = fxWidth / 2;
    const originY = fxHeight * 0.35;

    const pieces = [];
    for (let i = 0; i < PIECE_COUNT; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 3 + Math.random() * 7;
      pieces.push({
        x: originX,
        y: originY,
        vx: Math.cos(angle) * speed * (0.4 + Math.random()),
        vy: Math.sin(angle) * speed * 0.6 - 4 - Math.random() * 3,
        size: 5 + Math.random() * 6,
        color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.35,
        gravity: 0.14 + Math.random() * 0.06,
        life: 0,
        maxLife: 90 + Math.random() * 40,
        shape: Math.random() > 0.5 ? "rect" : "circle",
      });
    }
    return pieces;
  }

  function runFxAnimation() {
    fxCtx.clearRect(0, 0, fxWidth, fxHeight);

    let stillAlive = false;

    for (const p of confettiPieces) {
      p.life++;
      if (p.life > p.maxLife) continue;
      stillAlive = true;

      p.vy += p.gravity;
      p.x += p.vx;
      p.y += p.vy;
      p.rotation += p.rotationSpeed;

      const fadeStart = p.maxLife * 0.75;
      const alpha = p.life > fadeStart
        ? Math.max(0, 1 - (p.life - fadeStart) / (p.maxLife - fadeStart))
        : 1;

      fxCtx.save();
      fxCtx.translate(p.x, p.y);
      fxCtx.rotate(p.rotation);
      fxCtx.globalAlpha = alpha;
      fxCtx.fillStyle = p.color;

      if (p.shape === "rect") {
        fxCtx.fillRect(-p.size / 2, -p.size / 3, p.size, p.size * 0.6);
      } else {
        fxCtx.beginPath();
        fxCtx.arc(0, 0, p.size / 2.4, 0, Math.PI * 2);
        fxCtx.fill();
      }

      fxCtx.restore();
    }

    if (stillAlive) {
      fxAnimationId = requestAnimationFrame(runFxAnimation);
    } else {
      fxRunning = false;
      fxCtx.clearRect(0, 0, fxWidth, fxHeight);
    }
  }

  function triggerScreenFlash() {
    let flashEl = document.querySelector(".screen-flash");
    if (!flashEl) {
      flashEl = document.createElement("div");
      flashEl.className = "screen-flash";
      document.body.appendChild(flashEl);
    }
    flashEl.classList.remove("is-active");
    void flashEl.offsetWidth;
    flashEl.classList.add("is-active");
  }

  function launchGreeting() {
    if (openBtn.disabled) return;
    openBtn.disabled = true;
    openBtn.classList.add("is-launching");
    giftCard.classList.add("is-launching");

    confettiPieces = createConfettiBurst();
    if (!fxRunning) {
      fxRunning = true;
      runFxAnimation();
    }

    triggerScreenFlash();

    setTimeout(() => {
      openVideoModal();
      openBtn.disabled = false;
      openBtn.classList.remove("is-launching");
      giftCard.classList.remove("is-launching");
    }, LAUNCH_DELAY_MS);
  }

  openBtn.addEventListener("click", launchGreeting);

  /* =======================================================
     3) MODAL DE VIDEO
     ======================================================= */

  const videoModal = document.getElementById("video-modal");
  const videoBackdrop = document.getElementById("video-backdrop");
  const videoCloseBtn = document.getElementById("video-close");
  const greetingVideo = document.getElementById("greeting-video");

  function openVideoModal() {
    videoModal.classList.add("is-open");
    videoModal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";

    const playPromise = greetingVideo.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {});
    }
  }

  function closeVideoModal() {
    videoModal.classList.remove("is-open");
    videoModal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";

    greetingVideo.pause();
    greetingVideo.currentTime = 0;
  }

  videoCloseBtn.addEventListener("click", closeVideoModal);
  videoBackdrop.addEventListener("click", closeVideoModal);

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && videoModal.classList.contains("is-open")) {
      closeVideoModal();
    }
  });

  /* =======================================================
     4) MODAL DE IMAGEN (POP-UP)
     ======================================================= */

  const photoFrame = document.getElementById("photo-frame");
  const imageModal = document.getElementById("image-modal");
  const imageBackdrop = document.getElementById("image-backdrop");
  const imageCloseBtn = document.getElementById("image-close");

  function openImageModal() {
    imageModal.classList.add("is-open");
    imageModal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  function closeImageModal() {
    imageModal.classList.remove("is-open");
    imageModal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  if (photoFrame && imageModal) {
    photoFrame.addEventListener("click", openImageModal);

    photoFrame.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openImageModal();
      }
    });

    imageCloseBtn.addEventListener("click", closeImageModal);
    imageBackdrop.addEventListener("click", closeImageModal);

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && imageModal.classList.contains("is-open")) {
        closeImageModal();
      }
    });
  }

  /* =======================================================
     MÚSICA DE FONDO
     ======================================================= */

  const musicToggle = document.getElementById("music-toggle");
  const bgMusic = document.getElementById("bg-music");

  if (musicToggle && bgMusic) {
    musicToggle.addEventListener("click", () => {
      if (bgMusic.paused) {
        bgMusic.play().catch(() => {});
        musicToggle.textContent = "🔊";
      } else {
        bgMusic.pause();
        musicToggle.textContent = "🔈";
      }
    });
  }

});