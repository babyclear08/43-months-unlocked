/* ==========================================================================
   LOVE.exe — 43 Months Unlocked
   Vanilla JS only. No build step, no dependencies. Works on GitHub Pages.
   ========================================================================== */

/* ==========================================================================
   1. CONFIGURATION — edit these values freely, nothing else needs to change
   ========================================================================== */
const CONFIG = {
  girlfriendName: "Jezel Sabacan",
  endearment: "Love",
  anniversaryDate: "2023-01-14", // YYYY-MM-DD — official relationship date
  pin: "0114",

  // Local audio file. If it exists at this path, the music button will
  // play it. Otherwise, set SONG_URL below to a hosted audio link.
  localSong: "https://youtu.be/LjhCEhWiKXk",

  // Optional external song URL (used only if localSong fails to load).
  // Example: "https://example.com/our-song.mp3"
  songUrl: "https://youtu.be/LjhCEhWiKXk",

  // Memory Vault folders. Add as many image filenames as you like to each
  // array — just drop matching files into the /images folder using these
  // exact names (or edit the names here to match your files).
  vaultFolders: {
    "first-chapter": {
      title: "First Chapter",
      photos: [
        { src: "images/photo1.jpg", caption: "Where it all began." },
        { src: "images/photo2.jpg", caption: "Still figuring each other out." }
      ]
    },
    "favorite-moments": {
      title: "Favorite Moments",
      photos: [
        { src: "images/photo3.jpg", caption: "One of my favorite days with you." },
        { src: "images/photo4.jpg", caption: "This one lives in my head rent-free." }
      ]
    },
    "random-chaos": {
      title: "Random Chaos",
      photos: [
        { src: "images/photo5.jpg", caption: "Certified kulit moment." },
        { src: "images/photo6.jpg", caption: "No context. Just chaos." }
      ]
    },
    "our-little-world": {
      title: "Our Little World",
      photos: [
        { src: "images/photo7.jpg", caption: "Just us, being us." },
        { src: "images/photo8.jpg", caption: "Home doesn't have to be a place." }
      ]
    },
    "forever-file": {
      title: "Forever File",
      photos: [
        { src: "images/photo9.jpg", caption: "For every day after this one, too." },
        { src: "images/photo10.jpg", caption: "To be continued..." }
      ]
    }
  },

  // "A few things I love about you" — edit freely, any length list works.
  loveList: [
    "Your smile.",
    "The way you make ordinary days feel special.",
    "Your little habits that somehow became my favorite things.",
    "The way you care.",
    "Your laugh.",
    "Even your kulit side.",
    "How you can make me miss you even when we just talked.",
    "Simply... you."
  ],

  // Final card in the "things I love" list — always shown last.
  loveListClosing: [
    "And honestly, Love...",
    "I could keep listing things until we're 100 years old."
  ],

  // The love letter. Edit freely — it will be typed out on screen.
  loveLetter: `Love,

Happy 43rd monthsary. Three years and seven months.

Sometimes I still can't believe how much life we've already shared together.

We've had happy days, stressful days, random days, kulit days, tampuhan days, and moments where we probably wondered why we chose each other in the first place. 😂

But through all of it, you're still the person I want beside me.

I don't need every day to be perfect. I just want more days with you.

More laughs. More adventures. More memories. More random conversations. More pictures. More food trips. More kulit. More moments where we look at each other and realize, "Yep... we're still us."

Thank you for staying. Thank you for loving me. Thank you for being my Love.

And if I had to choose again... I would still choose you. Today. Tomorrow. And every monthsary after this.

Happy 43rd monthsary, Love. Three years and seven months down, and hopefully a lifetime to go.

I love you.`
};

/* ==========================================================================
   2. STATE + SCREEN ORDER
   ========================================================================== */
const SCREEN_ORDER = ["lock", "loading", "1", "2", "3", "4", "5", "6", "7", "8"];
const TOTAL_CHAPTERS = 8;
const REDUCED_MOTION = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

let screenHistory = [];
let currentScreen = "lock";

function el(id) { return document.getElementById(id); }
function qs(sel, ctx) { return (ctx || document).querySelector(sel); }
function qsa(sel, ctx) { return Array.from((ctx || document).querySelectorAll(sel)); }

/* ==========================================================================
   3. NAVIGATION
   ========================================================================== */
function getScreenEl(screenKey) {
  if (screenKey === "lock") return el("screen-lock");
  if (screenKey === "loading") return el("screen-loading");
  return el("screen-" + screenKey);
}

function goToScreen(screenKey, opts) {
  opts = opts || {};
  const outgoing = qs(".screen--active");
  if (outgoing) outgoing.classList.remove("screen--active");

  const target = getScreenEl(screenKey);
  if (target) target.classList.add("screen--active");

  if (!opts.isBack) {
    screenHistory.push(currentScreen);
  }
  currentScreen = screenKey;

  updateChrome(screenKey);
  window.scrollTo(0, 0);

  // Trigger per-screen entrance behavior
  handleScreenEnter(screenKey);
}

function updateChrome(screenKey) {
  const progress = el("progress-indicator");
  const back = el("back-btn");
  const music = el("music-player");
  const isStory = /^[1-8]$/.test(screenKey);

  if (isStory) {
    progress.classList.remove("hidden");
    music.classList.remove("hidden");
    const chapterNum = parseInt(screenKey, 10);
    el("progress-text").textContent = "Chapter " + pad(chapterNum) + " / " + pad(TOTAL_CHAPTERS);
    el("progress-fill").style.width = (chapterNum / TOTAL_CHAPTERS * 100) + "%";
  } else {
    progress.classList.add("hidden");
    music.classList.add("hidden");
  }

  if (isStory && parseInt(screenKey, 10) > 1) {
    back.classList.remove("hidden");
  } else {
    back.classList.add("hidden");
  }
}

function pad(n) { return n < 10 ? "0" + n : "" + n; }

el("back-btn").addEventListener("click", function () {
  if (screenHistory.length === 0) return;
  const prev = screenHistory.pop();
  const outgoing = qs(".screen--active");
  if (outgoing) outgoing.classList.remove("screen--active");
  const target = getScreenEl(prev);
  if (target) target.classList.add("screen--active");
  currentScreen = prev;
  updateChrome(prev);
  window.scrollTo(0, 0);
});

// Wire up every [data-next] button generically
qsa("[data-next]").forEach(function (btn) {
  btn.addEventListener("click", function () {
    goToScreen(btn.getAttribute("data-next"));
  });
});

function handleScreenEnter(screenKey) {
  if (screenKey === "1") animateTimeline();
  if (screenKey === "2") animateMonthsCounter();
  if (screenKey === "3") animateAuditBars();
  if (screenKey === "7") startLetterTypewriter();
  if (screenKey === "8") runFinalSequence();
}

/* ==========================================================================
   4. AMBIENT BACKGROUND — particles (canvas) + floating hearts (DOM)
   ========================================================================== */
(function setupParticles() {
  const canvas = el("particle-canvas");
  const ctx = canvas.getContext("2d");
  let width, height, particles;

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }

  function makeParticles() {
    const count = REDUCED_MOTION ? 0 : Math.min(60, Math.floor((width * height) / 22000));
    particles = [];
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        r: Math.random() * 1.6 + 0.4,
        speed: Math.random() * 0.15 + 0.03,
        drift: (Math.random() - 0.5) * 0.15,
        opacity: Math.random() * 0.5 + 0.15
      });
    }
  }

  function tick() {
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = "#f8efe6";
    particles.forEach(function (p) {
      ctx.globalAlpha = p.opacity;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
      p.y -= p.speed;
      p.x += p.drift;
      if (p.y < -4) { p.y = height + 4; p.x = Math.random() * width; }
    });
    ctx.globalAlpha = 1;
    requestAnimationFrame(tick);
  }

  window.addEventListener("resize", function () { resize(); makeParticles(); });
  resize();
  makeParticles();
  if (!REDUCED_MOTION) requestAnimationFrame(tick);
})();

(function setupFloatingHearts() {
  if (REDUCED_MOTION) return;
  const container = el("floating-hearts");
  const hearts = ["❤", "❤️", "♥"];

  function spawnHeart() {
    const heart = document.createElement("span");
    heart.className = "floating-heart";
    heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
    heart.style.left = Math.random() * 100 + "%";
    heart.style.setProperty("--drift", (Math.random() * 60 - 30) + "px");
    const duration = 9 + Math.random() * 7;
    heart.style.animationDuration = duration + "s";
    heart.style.fontSize = (0.7 + Math.random() * 0.9) + "rem";
    container.appendChild(heart);
    setTimeout(function () { heart.remove(); }, duration * 1000 + 500);
  }

  setInterval(spawnHeart, 2600);
  spawnHeart();
})();

/* ==========================================================================
   5. SCREEN 0 — PIN LOGIN
   ========================================================================== */
(function setupPin() {
  let entered = "";
  let wrongAttempts = 0;
  const boxes = qsa(".pin-box");
  const message = el("pin-message");
  const keypad = el("keypad");

  const wrongMessages = [
    "Hmm... nice try, Love 😂",
    "Wrong code. But don't worry, I still love you.",
    "That's not it, but A for effort.",
    "Nope. Try thinking about a date that matters to us. 👀",
    "System says no. My heart still says yes.",
    "At this point I should just tell you... but where's the fun in that? 😂",
    "Still wrong. Still cute though."
  ];

  function render() {
    boxes.forEach(function (box, i) {
      box.classList.toggle("filled", i < entered.length);
      box.classList.toggle("active", i === entered.length);
    });
  }

  function reset() {
    entered = "";
    render();
  }

  function shake() {
    boxes.forEach(function (b) { b.classList.add("shake"); });
    setTimeout(function () { boxes.forEach(function (b) { b.classList.remove("shake"); }); }, 450);
  }

  function handleWrong() {
    const msgIndex = Math.min(wrongAttempts, wrongMessages.length - 1);
    message.textContent = wrongMessages[msgIndex];
    wrongAttempts++;
    shake();
    setTimeout(reset, 500);
  }

  function handleCorrect() {
    boxes.forEach(function (b) { b.classList.add("success"); });
    message.textContent = "";
    setTimeout(function () {
      const flash = el("unlock-flash");
      flash.classList.add("is-active");
      setTimeout(function () {
        flash.classList.remove("is-active");
        goToScreen("loading");
        startLoadingSequence();
      }, 1700);
    }, 350);
  }

  function checkPin() {
    if (entered.length !== 4) return;
    if (entered === CONFIG.pin) {
      handleCorrect();
    } else {
      handleWrong();
    }
  }

  function pressKey(key) {
    if (key === "clear") { reset(); message.textContent = ""; return; }
    if (key === "back") { entered = entered.slice(0, -1); render(); return; }
    if (entered.length >= 4) return;
    entered += key;
    render();
    if (entered.length === 4) setTimeout(checkPin, 150);
  }

  keypad.addEventListener("click", function (e) {
    const btn = e.target.closest(".key");
    if (!btn) return;
    pressKey(btn.getAttribute("data-key"));
  });

  // Allow physical keyboard too (desktop fallback)
  document.addEventListener("keydown", function (e) {
    if (currentScreen !== "lock") return;
    if (/^[0-9]$/.test(e.key)) pressKey(e.key);
    if (e.key === "Backspace") pressKey("back");
    if (e.key === "Escape") pressKey("clear");
  });

  render();
})();

/* ==========================================================================
   6. SCREEN 1 — LOADING SEQUENCE
   ========================================================================== */
function startLoadingSequence() {
  const lines = [
    "Loading memories...",
    "Loading inside jokes...",
    "Loading kulit moments...",
    "Loading patience (still buffering)...",
    "Loading love...",
    "Loading 43 months of choosing each other..."
  ];
  const lineEl = el("loading-line");
  const fill = el("loading-bar-fill");
  const percentEl = el("loading-percent");
  const complete = el("loading-complete");
  complete.classList.add("hidden");

  let progress = 0;
  let lineIndex = 0;
  lineEl.textContent = lines[0];

  const lineTimer = setInterval(function () {
    lineIndex = (lineIndex + 1) % lines.length;
    lineEl.textContent = lines[lineIndex];
  }, 480);

  const progressTimer = setInterval(function () {
    progress += Math.random() * 9 + 4;
    if (progress >= 100) {
      progress = 100;
      clearInterval(progressTimer);
      clearInterval(lineTimer);
      lineEl.textContent = "Loading 43 months of choosing each other...";
    }
    fill.style.width = progress + "%";
    percentEl.textContent = Math.floor(progress) + "%";

    if (progress === 100) {
      setTimeout(function () {
        complete.classList.remove("hidden");
      }, 400);
    }
  }, 220);
}

el("open-story-btn").addEventListener("click", function () {
  goToScreen("1");
});

/* ==========================================================================
   7. SCREEN — OUR BEGINNING (timeline)
   ========================================================================== */
el("anniversary-date").textContent = formatDate(CONFIG.anniversaryDate);

function formatDate(isoDate) {
  const d = new Date(isoDate + "T00:00:00");
  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  return months[d.getMonth()] + " " + d.getDate() + ", " + d.getFullYear();
}

let timelineAnimated = false;
function animateTimeline() {
  if (timelineAnimated) return;
  timelineAnimated = true;
  const items = qsa(".timeline-item");
  const lineFill = el("timeline-line-fill");
  items.forEach(function (item, i) {
    setTimeout(function () {
      item.classList.add("is-visible");
      lineFill.style.height = ((i + 1) / items.length * 100) + "%";
    }, i * 260 + 150);
  });
}

/* ==========================================================================
   8. SCREEN — 43 MONTHS OF US
   ========================================================================== */
let monthsAnimated = false;
function animateMonthsCounter() {
  computeExactDuration();
  const cards = qsa(".stat-card");
  cards.forEach(function (card, i) {
    setTimeout(function () { card.classList.add("is-visible"); }, i * 180 + 300);
  });

  if (monthsAnimated) return;
  monthsAnimated = true;
  const numberEl = el("big-number");
  const target = 43;
  let current = 0;
  const duration = REDUCED_MOTION ? 0 : 1200;
  const startTime = performance.now();

  function step(now) {
    const t = duration === 0 ? 1 : Math.min(1, (now - startTime) / duration);
    const eased = 1 - Math.pow(1 - t, 3);
    current = Math.round(eased * target);
    numberEl.textContent = current;
    if (t < 1) requestAnimationFrame(step);
    else numberEl.textContent = target;
  }
  requestAnimationFrame(step);
}

function computeExactDuration() {
  const start = new Date(CONFIG.anniversaryDate + "T00:00:00");
  const now = new Date();
  const msPerDay = 1000 * 60 * 60 * 24;
  const totalDays = Math.floor((now - start) / msPerDay);

  let years = now.getFullYear() - start.getFullYear();
  let months = now.getMonth() - start.getMonth();
  let days = now.getDate() - start.getDate();
  if (days < 0) {
    months -= 1;
    const prevMonth = new Date(now.getFullYear(), now.getMonth(), 0);
    days += prevMonth.getDate();
  }
  if (months < 0) {
    years -= 1;
    months += 12;
  }

  const parts = [];
  if (years > 0) parts.push(years + (years === 1 ? " year" : " years"));
  if (months > 0) parts.push(months + (months === 1 ? " month" : " months"));
  if (days > 0 || parts.length === 0) parts.push(days + (days === 1 ? " day" : " days"));

  el("exact-duration").textContent = "Exactly " + parts.join(", ") + " together — " + totalDays.toLocaleString() + " days.";
}

/* ==========================================================================
   9. SCREEN — LOVE AUDIT
   ========================================================================== */
let auditAnimated = false;
function animateAuditBars() {
  if (auditAnimated) return;
  auditAnimated = true;
  const rows = qsa(".audit-row");
  rows.forEach(function (row, i) {
    const value = row.getAttribute("data-value");
    const fill = row.querySelector(".audit-fill");
    setTimeout(function () {
      fill.style.width = value + "%";
    }, i * 220 + 200);
  });
}

/* ==========================================================================
   10. SCREEN — THINGS I LOVE ABOUT YOU
   ========================================================================== */
(function buildLoveCards() {
  const container = el("love-cards");
  const items = CONFIG.loveList.map(function (text, i) {
    return { num: pad(i + 1), text: text, closing: false };
  });
  items.push({ num: "", text: CONFIG.loveListClosing.join(" "), closing: true });

  items.forEach(function (item) {
    const card = document.createElement("button");
    card.className = "love-card" + (item.closing ? " love-card--closing" : "");
    card.innerHTML =
      (item.num ? '<span class="love-card-num">' + item.num + "</span>" : "") +
      '<span class="love-card-text">' + item.text + "</span>";
    card.addEventListener("click", function () {
      card.classList.toggle("is-open");
    });
    container.appendChild(card);
  });
})();

/* ==========================================================================
   11. SCREEN — MEMORY VAULT (gallery)
   ========================================================================== */
(function setupVault() {
  const viewer = el("gallery-viewer");
  const imageEl = el("gallery-image");
  const placeholder = el("gallery-placeholder");
  const placeholderText = el("gallery-placeholder-text");
  const caption = el("gallery-caption");
  const indexLabel = el("gallery-index");
  const closeBtn = el("gallery-close");
  const prevBtn = el("gallery-prev");
  const nextBtn = el("gallery-next");
  const burst = el("gallery-heart-burst");

  let currentPhotos = [];
  let currentIndex = 0;

  function openFolder(folderKey) {
    const folder = CONFIG.vaultFolders[folderKey];
    if (!folder) return;
    currentPhotos = folder.photos || [];
    currentIndex = 0;
    viewer.classList.remove("hidden");
    viewer.classList.add("is-active");
    showPhoto(0);
  }

  function showPhoto(i) {
    if (currentPhotos.length === 0) {
      imageEl.classList.add("hidden");
      placeholder.classList.remove("hidden");
      placeholderText.textContent = "Add photos to the images/ folder and list them in CONFIG.vaultFolders in script.js.";
      caption.textContent = "";
      indexLabel.textContent = "";
      return;
    }
    currentIndex = (i + currentPhotos.length) % currentPhotos.length;
    const photo = currentPhotos[currentIndex];

    imageEl.classList.remove("is-loaded");
    placeholder.classList.add("hidden");
    imageEl.classList.remove("hidden");

    const testImg = new Image();
    testImg.onload = function () {
      imageEl.src = photo.src;
      requestAnimationFrame(function () { imageEl.classList.add("is-loaded"); });
    };
    testImg.onerror = function () {
      imageEl.classList.add("hidden");
      placeholder.classList.remove("hidden");
      placeholderText.textContent = 'Photo not found yet. Put a file named "' + photo.src.split("/").pop() + '" inside the images/ folder.';
    };
    testImg.src = photo.src;

    caption.textContent = photo.caption || "";
    indexLabel.textContent = pad(currentIndex + 1) + " / " + pad(currentPhotos.length);
    spawnHeartBurst();
  }

  function spawnHeartBurst() {
    if (REDUCED_MOTION) return;
    for (let i = 0; i < 6; i++) {
      const h = document.createElement("span");
      h.className = "floating-heart";
      h.textContent = "❤";
      h.style.left = (30 + Math.random() * 40) + "%";
      h.style.bottom = "20%";
      h.style.animationDuration = "3.5s";
      h.style.setProperty("--drift", (Math.random() * 40 - 20) + "px");
      burst.appendChild(h);
      setTimeout(function () { h.remove(); }, 3600);
    }
  }

  qsa(".vault-file").forEach(function (btn) {
    btn.addEventListener("click", function () {
      openFolder(btn.getAttribute("data-folder"));
    });
  });

  closeBtn.addEventListener("click", function () {
    viewer.classList.remove("is-active");
    viewer.classList.add("hidden");
  });
  prevBtn.addEventListener("click", function () { showPhoto(currentIndex - 1); });
  nextBtn.addEventListener("click", function () { showPhoto(currentIndex + 1); });

  // Swipe support
  let touchStartX = null;
  const stage = qs(".gallery-stage");
  stage.addEventListener("touchstart", function (e) { touchStartX = e.touches[0].clientX; }, { passive: true });
  stage.addEventListener("touchend", function (e) {
    if (touchStartX === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(dx) > 40) {
      if (dx < 0) showPhoto(currentIndex + 1);
      else showPhoto(currentIndex - 1);
    }
    touchStartX = null;
  }, { passive: true });
})();

/* ==========================================================================
   12. SCREEN — CHOOSE WISELY GAME
   ========================================================================== */
(function setupGame() {
  const noBtn = el("no-btn");
  const yesBtn = el("yes-btn");
  const gameArea = el("game-area");
  const message = el("game-message");
  const celebration = el("celebration");

  const noMessages = [
    "Are you sure? 😭",
    "Love... think carefully.",
    "Nice try 😂",
    "That button is currently unavailable.",
    "ERROR: OPTION NOT FOUND"
  ];
  let noAttempts = 0;

  function dodge() {
    const rect = gameArea.getBoundingClientRect();
    const btnRect = noBtn.getBoundingClientRect();
    const maxX = Math.max(0, rect.width - btnRect.width - 10);
    const maxY = Math.max(0, rect.height - btnRect.height - 10);
    const x = Math.random() * maxX;
    const y = Math.random() * maxY;
    noBtn.style.position = "absolute";
    noBtn.style.left = x + "px";
    noBtn.style.top = y + "px";
  }

  function handleNo(e) {
    e.preventDefault();
    const idx = Math.min(noAttempts, noMessages.length - 1);
    message.textContent = noMessages[idx];
    noAttempts++;
    if (noAttempts >= noMessages.length) {
      noBtn.textContent = "ERROR: OPTION NOT FOUND";
      noBtn.disabled = true;
      noBtn.style.opacity = "0.4";
    } else if (!REDUCED_MOTION) {
      dodge();
    }
  }

  // Both click (for touch/desktop) and touchstart-avoidance for a snappier dodge
  noBtn.addEventListener("click", handleNo);
  noBtn.addEventListener("touchstart", function (e) {
    if (!REDUCED_MOTION && noAttempts < noMessages.length - 1) dodge();
  }, { passive: true });

  yesBtn.addEventListener("click", function () {
    message.textContent = "";
    celebration.classList.remove("hidden");
    celebration.classList.add("is-active");
    if (!REDUCED_MOTION) launchConfetti();
  });

  function launchConfetti() {
    const container = el("confetti-container");
    const colors = ["#f3b8c9", "#d9b26a", "#b23a5d", "#f8efe6"];
    for (let i = 0; i < 60; i++) {
      const piece = document.createElement("span");
      piece.className = "confetti-piece";
      piece.style.left = Math.random() * 100 + "%";
      piece.style.background = colors[Math.floor(Math.random() * colors.length)];
      piece.style.animationDuration = (2.4 + Math.random() * 2) + "s";
      piece.style.animationDelay = (Math.random() * 0.6) + "s";
      piece.style.borderRadius = Math.random() > 0.5 ? "50%" : "2px";
      container.appendChild(piece);
      setTimeout(function () { piece.remove(); }, 5200);
    }
  }
})();

/* ==========================================================================
   13. SCREEN — LOVE LETTER (typewriter)
   ========================================================================== */
let letterStarted = false;
let letterTimer = null;

function startLetterTypewriter() {
  if (letterStarted) return;
  letterStarted = true;

  const textEl = el("letter-text");
  const cursor = el("letter-cursor");
  const nextBtn = el("letter-next-btn");
  const skipBtn = el("letter-skip-btn");
  const fullText = CONFIG.loveLetter;
  let i = 0;

  function finish() {
    clearInterval(letterTimer);
    textEl.textContent = fullText;
    cursor.classList.add("hidden");
    nextBtn.classList.remove("hidden");
    skipBtn.classList.add("hidden");
  }

  if (REDUCED_MOTION) {
    finish();
    return;
  }

  letterTimer = setInterval(function () {
    textEl.textContent = fullText.slice(0, i);
    i++;
    if (i > fullText.length) finish();
  }, 22);

  skipBtn.addEventListener("click", finish);
}

/* ==========================================================================
   14. SCREEN — FINAL SURPRISE
   ========================================================================== */
let finalStarted = false;
function runFinalSequence() {
  if (finalStarted) return;
  finalStarted = true;

  const statusBlock = el("final-status-block");
  const barFill = el("final-bar-fill");
  const resultBlock = el("final-result");
  const monthsBlock = el("final-months");
  const chooseEl = el("final-choose");
  const happyEl = el("final-happy");
  const messageBlock = el("final-message");
  const songBtn = el("song-btn");

  const wait = REDUCED_MOTION ? 60 : 900;

  setTimeout(function () { statusBlock.classList.remove("hidden"); }, wait * 0.4);
  setTimeout(function () { barFill.style.width = "100%"; }, wait * 0.7);
  setTimeout(function () {
    resultBlock.classList.remove("hidden");
  }, wait * 1.8);
  setTimeout(function () { monthsBlock.classList.remove("hidden"); }, wait * 2.6);
  setTimeout(function () { chooseEl.classList.remove("hidden"); }, wait * 3.4);
  setTimeout(function () { happyEl.classList.remove("hidden"); }, wait * 4.1);
  setTimeout(function () { messageBlock.classList.remove("hidden"); }, wait * 5);
  setTimeout(function () { songBtn.classList.remove("hidden"); }, wait * 5.9);
}

/* ==========================================================================
   15. MUSIC PLAYER
   ========================================================================== */
(function setupMusic() {
  const audio = el("our-song-audio");
  const toggleBtn = el("music-toggle");
  const songBtn = el("song-btn");
  let sourceReady = false;
  let isPlaying = false;

  function ensureSource() {
    if (sourceReady) return;
    if (CONFIG.localSong) {
      audio.src = CONFIG.localSong;
    } else if (CONFIG.songUrl) {
      audio.src = CONFIG.songUrl;
    }
    audio.addEventListener("error", function () {
      if (audio.src.indexOf(CONFIG.localSong) !== -1 && CONFIG.songUrl) {
        audio.src = CONFIG.songUrl;
      }
    }, { once: true });
    sourceReady = true;
  }

  function play() {
    ensureSource();
    if (!audio.src) {
      alert("Add your song! Put an mp3 at audio/our-song.mp3, or set CONFIG.songUrl in script.js.");
      return;
    }
    audio.play().then(function () {
      isPlaying = true;
      toggleBtn.classList.add("is-playing");
      songBtn.textContent = "NOW PLAYING 🎵";
    }).catch(function () {
      alert("Couldn't play the song. Make sure audio/our-song.mp3 exists, or set CONFIG.songUrl.");
    });
  }

  function pause() {
    audio.pause();
    isPlaying = false;
    toggleBtn.classList.remove("is-playing");
    songBtn.textContent = "PLAY OUR SONG 🎵";
  }

  function toggle() {
    if (isPlaying) pause();
    else play();
  }

  toggleBtn.addEventListener("click", toggle);
  songBtn.addEventListener("click", toggle);
})();
