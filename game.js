/* 🧠 Memory Cards — vanilla JS memory matching game.
   Wrapped in an IIFE. No frameworks, no build step, no network. */
(function () {
  "use strict";

  // --- Cohesive symbol set (emoji, no external assets) ---
  const SYMBOLS = [
    "🚀", "🌟", "🔥", "🌈", "🍎", "🐉", "⚡", "🌸",
    "🎲", "🛸", "🦊", "🌙", "💎", "🍩", "🐙", "🍀",
    "🎈", "🦄", "🌊", "🍉", "🪐", "🐝", "🌻", "🎯",
    "🍓", "🐬", "🔮", "🌿", "🎸", "🍔", "🦋", "⭐"
  ];

  const DIFFICULTIES = {
    4: { cols: 4, pairs: 8, label: "Easy" },
    6: { cols: 6, pairs: 18, label: "Hard" },
    8: { cols: 8, pairs: 32, label: "Expert" }
  };

  // --- DOM refs ---
  const boardEl = document.getElementById("board");
  const difficultyEl = document.getElementById("difficulty");
  const restartEl = document.getElementById("restart");
  const timeEl = document.getElementById("time");
  const movesEl = document.getElementById("moves");
  const pairsEl = document.getElementById("pairs");
  const bestEl = document.getElementById("best");
  const overlayEl = document.getElementById("overlay");
  const overlayTextEl = document.getElementById("overlay-text");
  const playAgainEl = document.getElementById("play-again");

  // --- State ---
  let state = {
    cols: 4,
    pairs: 8,
    cards: [],
    first: null,
    second: null,
    lock: false,
    matched: 0,
    moves: 0,
    started: false,
    elapsed: 0,
    timerId: null
  };

  // ---------- Utilities ----------
  function shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  function formatTime(total) {
    const m = Math.floor(total / 60);
    const s = total % 60;
    return m + ":" + String(s).padStart(2, "0");
  }

  function bestKey(cols) {
    return "memory-cards-best-" + cols;
  }

  function getBest(cols) {
    const raw = localStorage.getItem(bestKey(cols));
    if (raw === null) return null;
    const n = parseInt(raw, 10);
    return Number.isFinite(n) ? n : null;
  }

  function setBest(cols, seconds) {
    const prev = getBest(cols);
    if (prev === null || seconds < prev) {
      localStorage.setItem(bestKey(cols), String(seconds));
      return true;
    }
    return false;
  }

  function renderBest() {
    const b = getBest(state.cols);
    bestEl.textContent = b === null ? "—" : formatTime(b);
  }

  // ---------- Timer ----------
  function startTimer() {
    if (state.timerId !== null) return;
    state.timerId = setInterval(function () {
      state.elapsed += 1;
      timeEl.textContent = formatTime(state.elapsed);
    }, 1000);
  }

  function stopTimer() {
    if (state.timerId !== null) {
      clearInterval(state.timerId);
      state.timerId = null;
    }
  }

  // ---------- Build board ----------
  function buildBoard() {
    const conf = DIFFICULTIES[state.cols];
    state.pairs = conf.pairs;

    const chosen = SYMBOLS.slice(0, conf.pairs);
    const deck = shuffle(chosen.concat(chosen));

    boardEl.style.setProperty("--cols", conf.cols);
    boardEl.innerHTML = "";

    state.cards = [];
    state.first = null;
    state.second = null;
    state.lock = false;
    state.matched = 0;
    state.moves = 0;
    state.started = false;
    state.elapsed = 0;
    stopTimer();

    timeEl.textContent = "0:00";
    movesEl.textContent = "0";
    pairsEl.textContent = "0 / " + conf.pairs;
    renderBest();

    deck.forEach(function (symbol, idx) {
      const card = document.createElement("button");
      card.type = "button";
      card.className = "card";
      card.dataset.symbol = symbol;
      card.dataset.index = String(idx);
      card.setAttribute("aria-label", "Hidden card");

      const inner = document.createElement("div");
      inner.className = "card-inner";

      const front = document.createElement("div");
      front.className = "card-front";

      const back = document.createElement("div");
      back.className = "card-back";
      back.textContent = symbol;

      inner.appendChild(front);
      inner.appendChild(back);
      card.appendChild(inner);
      card.addEventListener("click", onCardClick);

      boardEl.appendChild(card);
      state.cards.push(card);
    });
  }

  // ---------- Interaction ----------
  function onCardClick(e) {
    const card = e.currentTarget;
    if (state.lock) return;
    if (card.classList.contains("flipped") || card.classList.contains("matched")) return;

    if (!state.started) {
      state.started = true;
      startTimer();
    }

    card.classList.add("flipped");
    card.setAttribute("aria-label", "Card showing " + card.dataset.symbol);

    if (state.first === null) {
      state.first = card;
      return;
    }

    // second card
    state.second = card;
    state.moves += 1;
    movesEl.textContent = String(state.moves);

    if (state.first.dataset.symbol === state.second.dataset.symbol) {
      matchPair();
    } else {
      mismatch();
    }
  }

  function matchPair() {
    const a = state.first;
    const b = state.second;
    a.classList.add("matched");
    b.classList.add("matched");
    a.setAttribute("aria-label", "Matched " + a.dataset.symbol);
    b.setAttribute("aria-label", "Matched " + b.dataset.symbol);

    state.matched += 1;
    pairsEl.textContent = state.matched + " / " + state.pairs;
    state.first = null;
    state.second = null;

    if (state.matched === state.pairs) {
      win();
    }
  }

  function mismatch() {
    state.lock = true;
    const a = state.first;
    const b = state.second;
    a.classList.add("shake");
    b.classList.add("shake");

    setTimeout(function () {
      a.classList.remove("flipped", "shake");
      b.classList.remove("flipped", "shake");
      a.setAttribute("aria-label", "Hidden card");
      b.setAttribute("aria-label", "Hidden card");
      state.first = null;
      state.second = null;
      state.lock = false;
    }, 850);
  }

  // ---------- Win ----------
  function win() {
    stopTimer();
    const isRecord = setBest(state.cols, state.elapsed);
    renderBest();

    const conf = DIFFICULTIES[state.cols];
    const recordNote = isRecord ? " 🏆 New best time!" : "";
    overlayTextEl.textContent =
      conf.label + " · " + state.pairs + " pairs matched in " +
      formatTime(state.elapsed) + " with " + state.moves + " moves." + recordNote;
    overlayEl.classList.remove("hidden");
  }

  function newGame() {
    overlayEl.classList.add("hidden");
    state.cols = parseInt(difficultyEl.value, 10);
    buildBoard();
  }

  // ---------- Background canvas (decorative) ----------
  function initBackground() {
    const canvas = document.getElementById("bg");
    const ctx = canvas.getContext("2d");
    let w = 0;
    let h = 0;
    const blobs = [];
    const colors = [
      "rgba(124, 92, 255, 0.55)",
      "rgba(0, 212, 255, 0.45)",
      "rgba(255, 92, 168, 0.40)"
    ];

    function resize() {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    }

    function makeBlobs() {
      blobs.length = 0;
      for (let i = 0; i < 5; i++) {
        blobs.push({
          x: Math.random() * w,
          y: Math.random() * h,
          r: 120 + Math.random() * 220,
          vx: (Math.random() - 0.5) * 0.35,
          vy: (Math.random() - 0.5) * 0.35,
          c: colors[i % colors.length]
        });
      }
    }

    function frame() {
      ctx.clearRect(0, 0, w, h);
      for (const b of blobs) {
        b.x += b.vx;
        b.y += b.vy;
        if (b.x < -b.r) b.x = w + b.r;
        if (b.x > w + b.r) b.x = -b.r;
        if (b.y < -b.r) b.y = h + b.r;
        if (b.y > h + b.r) b.y = -b.r;

        const g = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.r);
        g.addColorStop(0, b.c);
        g.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
        ctx.fill();
      }
      requestAnimationFrame(frame);
    }

    window.addEventListener("resize", function () {
      resize();
      makeBlobs();
    });
    resize();
    makeBlobs();
    frame();
  }

  // ---------- Wire up ----------
  difficultyEl.addEventListener("change", newGame);
  restartEl.addEventListener("click", newGame);
  playAgainEl.addEventListener("click", newGame);

  initBackground();
  newGame();
})();
