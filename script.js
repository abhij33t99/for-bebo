(() => {
  "use strict";
  const C = window.CONFIG;
  const $ = (s) => document.querySelector(s);
  const $$ = (s) => [...document.querySelectorAll(s)];
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isLocal = ["localhost", "127.0.0.1", ""].includes(location.hostname);
  const rand = (min, max) => min + Math.random() * (max - min);

  const store = {
    get(k) { try { return localStorage.getItem(k); } catch { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch { /* private mode */ } },
    del(k) { try { localStorage.removeItem(k); } catch { /* private mode */ } }
  };
  // Open the site with ?reset after testing to forget that "Yes" was already sent.
  if (new URLSearchParams(location.search).has("reset")) {
    store.del("bebo-sent");
    store.del("bebo-pending");
  }

  /* ---------- Text from config ---------- */
  $$("[data-text]").forEach((el) => {
    el.textContent = el.dataset.text.split(".").reduce((o, k) => o[k], C);
  });

  /* ---------- Placeholder art (replaced by your images when set) ---------- */
  function drawing(mood) {
    const mouths = {
      peek: '<path d="M72 138 Q100 162 128 138" />',
      sad: '<path d="M78 152 Q100 132 122 152" />',
      plead: '<path d="M86 146 Q93 138 100 146 Q107 138 114 146" />',
      happy: '<path d="M70 136 Q100 180 130 136 Z" fill="#a63a6b" />'
    };
    const tear = mood === "sad" ? '<path class="tear" d="M62 122 q-7 11 0 14 q7-3 0-14" fill="#bfe6ff"/>' : "";
    const eye = (x, r) =>
      `<ellipse cx="${x}" cy="100" rx="19" ry="${mood === "plead" ? 25 : 21}" transform="rotate(${r} ${x} 100)" fill="#171533"/>
       <circle cx="${x - 6}" cy="91" r="${mood === "plead" ? 8 : 6}" fill="#fff"/><circle cx="${x + 6}" cy="108" r="3" fill="#fff"/>`;
    return `<svg viewBox="0 0 200 200" role="img" aria-label="Cute blue alien">
      <g class="ear-l"><path d="M64 70 Q20 10 6 30 Q2 80 52 112 Z" fill="#4f86e8"/><path d="M54 74 Q26 34 17 42 Q18 74 50 96 Z" fill="#c78be0"/></g>
      <g class="ear-r"><path d="M136 70 Q180 10 194 30 Q198 80 148 112 Z" fill="#4f86e8"/><path d="M146 74 Q174 34 183 42 Q182 74 150 96 Z" fill="#c78be0"/></g>
      <ellipse cx="100" cy="112" rx="68" ry="64" fill="#5b95f5"/>
      <ellipse cx="68" cy="100" rx="27" ry="32" transform="rotate(25 68 100)" fill="#a9d4ff"/>
      <ellipse cx="132" cy="100" rx="27" ry="32" transform="rotate(-25 132 100)" fill="#a9d4ff"/>
      <g class="eyes">${eye(70, 22)}${eye(130, -22)}</g>
      <ellipse cx="100" cy="122" rx="17" ry="11" fill="#27306e"/>
      <ellipse cx="95" cy="118" rx="5" ry="3" fill="#fff" opacity=".6"/>
      <g fill="none" stroke="#27306e" stroke-width="4" stroke-linecap="round" stroke-linejoin="round">${mouths[mood]}</g>
      <circle cx="50" cy="132" r="8" fill="#ff7eb6" opacity=".55"/><circle cx="150" cy="132" r="8" fill="#ff7eb6" opacity=".55"/>
      ${tear}</svg>`;
  }
  $$(".stitch").forEach((box) => {
    const mood = box.dataset.mood;
    const src = C.stitch[mood];
    if (!src) { box.innerHTML = drawing(mood); return; }
    const img = new Image();
    img.alt = "Stitch";
    img.onerror = () => { box.innerHTML = drawing(mood); };
    img.src = src;
    box.append(img);
  });

  /* ---------- Background ---------- */
  for (let i = 0; i < 70; i++) {
    const s = document.createElement("i");
    const size = rand(1, 3);
    s.style.cssText = `left:${rand(0, 100)}%;top:${rand(0, 100)}%;width:${size}px;height:${size}px;animation-duration:${rand(1, 4)}s;animation-delay:${rand(-4, 0)}s`;
    $("#sky").append(s);
  }
  function setFloaties(icons) {
    const box = $("#floaties");
    box.textContent = "";
    for (let i = 0; i < 16; i++) {
      const s = document.createElement("span");
      s.textContent = icons[i % icons.length];
      s.style.cssText = `left:${rand(0, 94)}%;font-size:${rand(12, 28)}px;animation-duration:${rand(8, 18)}s;animation-delay:${rand(-18, 0)}s;--drift:${rand(-60, 60)}px`;
      box.append(s);
    }
  }

  document.addEventListener("pointerdown", (e) => {
    if (reduced || e.target.closest("#no")) return;
    for (let i = 0; i < 6; i++) {
      const s = document.createElement("span");
      s.className = "spark";
      s.textContent = ["✨", "💙", "⭐"][i % 3];
      s.style.cssText = `left:${e.clientX - 8}px;top:${e.clientY - 10}px;--x:${rand(-50, 50)}px;--y:${rand(-60, 40)}px`;
      document.body.append(s);
      setTimeout(() => s.remove(), 750);
    }
  });

  /* ---------- Screens ---------- */
  let order = ["welcome", "sorry", "letter", "reasons", "memories", "promises", "ask", "celebrate"];
  let current = "welcome";

  function show(name) {
    if (!order.includes(name)) name = "welcome";
    current = name;
    $$(".screen").forEach((s) => s.classList.toggle("active", s.dataset.screen === name));
    $$("#dots i").forEach((d, i) => d.classList.toggle("on", i === order.indexOf(name)));
    setFloaties(name === "sorry" ? ["💙", "🌸", "🥺"] : ["💙", "💕", "✨", "🌸"]);
    resetNo();
    $("#lightbox").hidden = true;
    window.scrollTo(0, 0);
    document.dispatchEvent(new CustomEvent("screenchange", { detail: name }));
  }
  function go(name) {
    history.pushState({ screen: name }, "");
    show(name);
  }
  function buildDots() {
    $("#dots").textContent = "";
    order.forEach((n) => {
      const d = document.createElement("i");
      d.classList.toggle("on", n === current);
      $("#dots").append(d);
    });
  }
  $$("[data-next]").forEach((b) =>
    b.addEventListener("click", () => go(order[order.indexOf(current) + 1])));
  window.addEventListener("popstate", (e) => show(e.state?.screen || "welcome"));

  /* ---------- Music ---------- */
  const song = $("#song");
  const musicBtn = $("#music");
  let musicStarted = false;
  if (C.music) {
    song.volume = 0.6;
    song.addEventListener("loadedmetadata", () => { musicBtn.hidden = false; });
    song.addEventListener("error", () => { musicBtn.hidden = true; });
    song.addEventListener("play", () => musicBtn.classList.add("playing"));
    song.addEventListener("pause", () => musicBtn.classList.remove("playing"));
    song.src = C.music;
  }
  $('[data-screen="welcome"] [data-next]').addEventListener("click", () => {
    if (C.music && !musicStarted) {
      musicStarted = true;
      song.play().catch(() => { musicStarted = false; });
    }
  });
  musicBtn.addEventListener("click", () => {
    if (song.paused) song.play().catch(() => {});
    else song.pause();
  });
  // Pause when she switches apps, resume when she comes back.
  let resumeSong = false;
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) { resumeSong = !song.paused; song.pause(); }
    else if (resumeSong) song.play().catch(() => {});
  });

  /* ---------- Letter ---------- */
  const paper = $("#paper");
  const typed = $("#typed");
  let typingTimer = null;

  // Turns the letter text into elements, plus a list of pieces to type into them.
  function buildLetter(target) {
    const pieces = [];
    C.letter.trim().split(/\n\s*\n/).forEach((raw) => {
      const isVerse = raw.startsWith(">");
      const block = document.createElement(isVerse ? "blockquote" : "p");
      const text = isVerse ? raw.replace(/^> ?/gm, "") : raw;
      text.split(/(\*\*[^*\n]+\*\*|\*[^*\n]+\*)/).filter(Boolean).forEach((part) => {
        const mark = part.startsWith("**") ? 2 : part.startsWith("*") ? 1 : 0;
        const el = document.createElement(["span", "em", "strong"][mark]);
        block.append(el);
        pieces.push({ el, block, text: part.slice(mark, part.length - mark) });
      });
      target.append(block);
    });
    return pieces;
  }
  const pieces = buildLetter(typed);
  buildLetter($("#fulltext")).forEach((p) => { p.el.textContent = p.text; });
  pieces.forEach((p) => { p.block.hidden = true; });
  // One entry per character, keeping emoji whole.
  const graphemes = (t) => window.Intl?.Segmenter
    ? [...new Intl.Segmenter().segment(t)].map((g) => g.segment)
    : Array.from(t);
  const queue = pieces.flatMap((p) => graphemes(p.text).map((ch) => [p, ch]));

  function finishLetter() {
    clearTimeout(typingTimer);
    typingTimer = null;
    pieces.forEach((p) => { p.el.textContent = p.text; p.block.hidden = false; });
    $("#skiphint").hidden = true;
    $("#letterNext").hidden = false;
  }
  $("#envelope").addEventListener("click", (e) => {
    const env = e.currentTarget;
    if (env.classList.contains("opening")) return;
    env.classList.add("opening");
    setTimeout(() => {
      env.hidden = true;
      paper.hidden = false;
      if (reduced) { finishLetter(); return; }
      $("#skiphint").hidden = false;
      let i = 0;
      (function type() {
        // Wait while she is on another screen.
        if (current !== "letter") { typingTimer = setTimeout(type, 300); return; }
        const [piece, ch] = queue[i++];
        piece.block.hidden = false;
        piece.el.textContent += ch;
        paper.scrollTop = paper.scrollHeight;
        if (i < queue.length) typingTimer = setTimeout(type, ".!?\n".includes(ch) ? 200 : 28);
        else finishLetter();
      })();
    }, 650);
  });
  paper.addEventListener("click", () => { if (typingTimer) { finishLetter(); paper.scrollTop = 0; } });

  /* ---------- Reasons ---------- */
  C.reasons.forEach((reason, i) => {
    const card = document.createElement("button");
    card.type = "button";
    card.className = "card";
    card.innerHTML = '<span class="inner"><span class="face front"></span><span class="face back" aria-hidden="true"></span></span>';
    card.querySelector(".front").textContent = ["💙", "🌺", "⭐", "🐚"][i % 4];
    card.querySelector(".back").textContent = reason;
    card.addEventListener("click", () => {
      const flipped = card.classList.toggle("flipped");
      card.querySelector(".back").setAttribute("aria-hidden", String(!flipped));
      card.querySelector(".front").setAttribute("aria-hidden", String(flipped));
    });
    $("#cards").append(card);
  });

  /* ---------- Memories ---------- */
  const lightbox = $("#lightbox");
  const loadPhoto = (p) => new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve({ ...p, ok: true });
    img.onerror = () => resolve({ ...p, ok: false });
    img.src = p.src;
  });
  Promise.all(C.photos.map(loadPhoto)).then((results) => {
    let photos = results.filter((p) => p.ok);
    // While testing locally, show empty frames so you can preview the page.
    if (!photos.length && isLocal) photos = results;
    if (!photos.length) {
      order = order.filter((n) => n !== "memories");
      buildDots();
      if (current === "memories") show("promises");
      return;
    }
    photos.forEach((p, i) => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "polaroid";
      b.style.setProperty("--tilt", `${(i % 2 ? 1 : -1) * rand(2, 5)}deg`);
      let pic;
      if (p.ok) {
        pic = new Image();
        pic.src = p.src;
        pic.alt = p.caption;
        b.addEventListener("click", () => {
          lightbox.querySelector("img").src = p.src;
          lightbox.querySelector("img").alt = p.caption;
          lightbox.querySelector("figcaption").textContent = p.caption;
          lightbox.hidden = false;
        });
      } else {
        pic = document.createElement("span");
        pic.className = "empty";
        pic.textContent = "📸";
      }
      b.append(pic, p.caption);
      $("#gallery").append(b);
    });
  });
  lightbox.addEventListener("click", () => { lightbox.hidden = true; });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") lightbox.hidden = true; });

  /* ---------- Promises ---------- */
  C.promises.forEach((text, i) => {
    const li = document.createElement("li");
    li.style.setProperty("--i", i);
    li.textContent = "💙 " + text;
    $("#promises").append(li);
  });

  /* ---------- The runaway No button ---------- */
  const no = $("#no");
  const yes = $("#yes");
  const noSlot = $("#noSlot");
  let escapes = 0;
  let lastEscape = 0;

  function resetNo() {
    no.classList.remove("running");
    no.style.left = no.style.top = "";
    noSlot.style.width = noSlot.style.height = "";
    noSlot.append(no);
    yes.style.removeProperty("--grow");
    $("#teaser").innerHTML = "&nbsp;";
  }

  // The area Yes covers at its current grown size (not mid-animation).
  function yesZone(scale) {
    const r = yes.getBoundingClientRect();
    const cx = r.left + r.width / 2;
    const cy = r.top + r.height / 2;
    const w = yes.offsetWidth * scale;
    const h = yes.offsetHeight * scale;
    return { left: cx - w / 2, right: cx + w / 2, top: cy - h / 2, bottom: cy + h / 2 };
  }

  function flee(px, py) {
    if (current !== "ask") return;
    const w = no.offsetWidth;
    const h = no.offsetHeight;
    if (!no.classList.contains("running")) {
      const r = no.getBoundingClientRect();
      noSlot.style.width = `${w}px`; // keeps Yes from jumping when No leaves the row
      noSlot.style.height = `${h}px`;
      no.style.left = `${r.left}px`;
      no.style.top = `${r.top}px`;
      document.body.append(no);
      no.classList.add("running");
      void no.offsetWidth;
    }
    escapes++;
    const teasers = C.ask.teasers;
    $("#teaser").textContent = teasers[(escapes - 1) % teasers.length];
    const maxScale = Math.max(1, Math.min(1.6, (innerWidth - 40) / yes.offsetWidth));
    const scale = Math.min(1 + escapes * 0.07, maxScale);
    yes.style.setProperty("--grow", scale);

    const vw = document.documentElement.clientWidth;
    const vh = Math.min(innerHeight, window.visualViewport?.height || innerHeight);
    const pad = 16;
    const topPad = 64; // stay clear of the dots and music button
    const maxX = Math.max(pad, vw - w - pad);
    const maxY = Math.max(topPad, vh - h - pad - 12);
    const zone = yesZone(scale);
    const clear = (x, y) =>
      x + w + 14 < zone.left || x > zone.right + 14 || y + h + 14 < zone.top || y > zone.bottom + 14;
    const away = (x, y) => Math.hypot(x + w / 2 - px, y + h / 2 - py);

    let spot = null;
    for (let i = 0; i < 120 && !spot; i++) {
      const x = rand(pad, maxX);
      const y = rand(topPad, maxY);
      if (clear(x, y) && away(x, y) > 130) spot = [x, y];
    }
    if (!spot) { // tiny screens: take the free corner farthest from her finger
      const corners = [[pad, topPad], [maxX, topPad], [pad, maxY], [maxX, maxY]];
      const free = corners.filter(([x, y]) => clear(x, y));
      spot = (free.length ? free : corners).sort((a, b) => away(...b) - away(...a))[0];
    }
    no.style.left = `${spot[0]}px`;
    no.style.top = `${spot[1]}px`;
    if (!reduced) no.animate([{ scale: 0.3, opacity: 0 }, { scale: 1, opacity: 1 }], { duration: 180, easing: "ease-out" });
  }

  function dodge(e) {
    e.preventDefault();
    e.stopPropagation();
    const now = Date.now();
    if (now - lastEscape < 120) return; // one tap fires several events
    lastEscape = now;
    const r = no.getBoundingClientRect();
    flee(e.clientX ?? e.touches?.[0]?.clientX ?? r.left, e.clientY ?? e.touches?.[0]?.clientY ?? r.top);
  }
  // Mouse: run as soon as the pointer gets close.
  document.addEventListener("pointermove", (e) => {
    if (current !== "ask" || e.pointerType === "touch") return;
    const r = no.getBoundingClientRect();
    const dx = Math.max(r.left - e.clientX, 0, e.clientX - r.right);
    const dy = Math.max(r.top - e.clientY, 0, e.clientY - r.bottom);
    if (Math.hypot(dx, dy) < 55) dodge(e);
  });
  // Touch and everything else. "click" never does anything except run away.
  ["pointerenter", "pointerdown", "click"].forEach((type) => no.addEventListener(type, dodge));
  no.addEventListener("touchstart", dodge, { passive: false });
  no.addEventListener("focus", () => no.blur());
  window.addEventListener("resize", () => {
    if (no.classList.contains("running")) flee(-999, -999);
  });

  /* ---------- Yes: celebrate + tell you ---------- */
  const status = $("#status");
  const share = $("#share");
  share.href = "https://wa.me/?text=" + encodeURIComponent(C.celebrate.shareMessage);
  let sending = false;

  async function postToWeb3Forms(payload) {
    if (!C.web3formsKey || C.web3formsKey.startsWith("PASTE_")) throw new Error("Web3Forms key is not set in config.js");
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 10000);
    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ access_key: C.web3formsKey, ...payload }),
        signal: ctrl.signal
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message || `HTTP ${res.status}`);
    } finally {
      clearTimeout(timer);
    }
  }

  async function sendPending() {
    const saved = store.get("bebo-pending") || memoryPending;
    if (!saved || sending || store.get("bebo-sent")) return;
    sending = true;
    status.textContent = "Message bhej rahe hain... 💌";
    share.hidden = true;
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        await postToWeb3Forms(JSON.parse(saved));
        store.set("bebo-sent", "1");
        store.del("bebo-pending");
        memoryPending = null;
        status.textContent = "Message pahunch gaya 💙";
        sending = false;
        return;
      } catch (err) {
        console.warn(`Notification attempt ${attempt} failed:`, err.message);
        if (attempt < 3) await new Promise((r) => setTimeout(r, attempt * 1500));
      }
    }
    sending = false;
    status.textContent = "Message nahi ja paya. Yeh button daba ke khud bata do 🥺";
    share.hidden = false;
  }
  let memoryPending = null; // backup when the browser blocks storage

  yes.addEventListener("click", () => {
    // A tap right after No escapes was probably aimed at No, so it doesn't count.
    if (Date.now() - lastEscape < 350 && escapes) return;
    const payload = JSON.stringify({
      subject: "💙 Bebo ne maaf kar diya!",
      from_name: "Sorry Cutie website",
      message: `Bebo clicked YES! 🥳\n\nTime: ${new Date().toLocaleString()}\nNo button ran away ${escapes} time(s).`
    });
    go("celebrate");
    celebrate();
    if (store.get("bebo-sent")) { status.textContent = "Message pahunch gaya 💙"; return; }
    memoryPending = payload;
    store.set("bebo-pending", payload);
    sendPending();
  });
  window.addEventListener("online", sendPending);

  /* ---------- Confetti ---------- */
  function celebrate() {
    if (reduced) return;
    const canvas = $("#confetti");
    const ctx = canvas.getContext("2d");
    const dpr = devicePixelRatio || 1;
    canvas.width = innerWidth * dpr;
    canvas.height = innerHeight * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const colors = ["#4a7dff", "#ff7eb6", "#9fd4ff", "#ffe066", "#c78be0"];
    const bits = Array.from({ length: 180 }, () => ({
      x: rand(0, innerWidth), y: rand(-innerHeight, 0), vx: rand(-1.5, 1.5), vy: rand(2, 5),
      s: rand(6, 12), a: rand(0, 6), c: colors[Math.floor(rand(0, colors.length))]
    }));
    const start = performance.now();
    (function frame(t) {
      ctx.clearRect(0, 0, innerWidth, innerHeight);
      bits.forEach((b) => {
        b.x += b.vx; b.y += b.vy; b.a += 0.1;
        if (b.y > innerHeight && t - start < 4500) b.y = -20;
        ctx.save();
        ctx.translate(b.x, b.y);
        ctx.rotate(b.a);
        ctx.fillStyle = b.c;
        ctx.fillRect(-b.s / 2, -b.s / 4, b.s, b.s / 2);
        ctx.restore();
      });
      if (t - start < 8000) requestAnimationFrame(frame);
      else ctx.clearRect(0, 0, innerWidth, innerHeight);
    })(start);
  }

  history.replaceState({ screen: "welcome" }, "");
  buildDots();
  show("welcome");
  sendPending(); // retry if her last visit couldn't send
})();
