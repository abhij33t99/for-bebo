// Decorations only: nothing here affects the buttons or the email.
(() => {
  "use strict";
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const rand = (min, max) => min + Math.random() * (max - min);
  const graphemes = (text) => window.Intl?.Segmenter
    ? [...new Intl.Segmenter().segment(text)].map((g) => g.segment)
    : Array.from(text);
  const make = (cls, parent, tag = "div") => {
    const el = document.createElement(tag);
    el.className = cls;
    parent.append(el);
    return el;
  };
  const temp = (cls, text, css, ms) => {
    const el = make(cls, document.body, "span");
    el.textContent = text;
    el.style.cssText = css;
    setTimeout(() => el.remove(), ms);
  };

  /* ---------- Sky, spaceship, palm leaves, ocean ---------- */
  const scene = document.createElement("div");
  scene.id = "scene";
  scene.setAttribute("aria-hidden", "true");
  document.getElementById("floaties").before(scene);

  make("moon", scene);
  [[8, 6, 0], [28, 45, 2.5], [4, 62, 4.8]].forEach(([top, left, delay]) => {
    make("shoot", scene).style.cssText = `top:${top}%;left:${left}%;animation-delay:${delay}s`;
  });

  make("ufo", scene).innerHTML = `<svg viewBox="0 0 120 70">
    <path d="M38 34 Q40 6 60 6 Q80 6 82 34Z" fill="#bfeaff" opacity=".85"/>
    <ellipse cx="60" cy="40" rx="56" ry="17" fill="#d9335a"/>
    <ellipse cx="60" cy="36" rx="40" ry="8" fill="#ff6f8f"/>
    <circle class="light" cx="22" cy="43" r="4" fill="#ffe066"/><circle class="light" cx="47" cy="49" r="4" fill="#ffe066"/>
    <circle class="light" cx="73" cy="49" r="4" fill="#ffe066"/><circle class="light" cx="98" cy="43" r="4" fill="#ffe066"/></svg>`;

  const frond = (angle, length, color) => {
    let blades = "";
    for (let x = 18; x < length; x += 13) {
      const s = 34 * (1 - x / (length * 1.35));
      blades += `<path d="M${x} 0 Q${x + s * .8} ${s * .3} ${x + s} ${s} Q${x + s * .2} ${s * .6} ${x} 0Z"/>`;
      blades += `<path d="M${x} 0 Q${x + s * .8} ${-s * .3} ${x + s} ${-s} Q${x + s * .2} ${-s * .6} ${x} 0Z"/>`;
    }
    return `<g transform="rotate(${angle})" fill="${color}"><path d="M0 0H${length}" stroke="${color}" stroke-width="4"/>${blades}</g>`;
  };
  const leaves = `<svg viewBox="0 0 190 170">${frond(12, 170, "#1f8f7a")}${frond(40, 150, "#27a58a")}${frond(70, 120, "#17766a")}</svg>`;
  ["l", "r"].forEach((side) => { make(`leaf ${side}`, scene).innerHTML = leaves; });

  [["a", "#7ec8ff"], ["b", "#3d7fe0"], ["c", "#a8e0ff"]].forEach(([name, color]) => {
    const svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 100' preserveAspectRatio='none'><path d='M0 45 Q150 0 300 45 T600 45 V100 H0Z' fill='${color}'/></svg>`;
    make(`wave ${name}`, scene).style.backgroundImage = `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
  });

  /* ---------- Titles: bounce in letter by letter ---------- */
  // script.js fills the titles after this file loads, so wait for the first screen.
  let split = false;
  function splitTitles() {
    if (split || reduced) return;
    split = true;
    document.querySelectorAll("h1").forEach((h) => {
      const text = h.textContent;
      h.setAttribute("aria-label", text);
      h.textContent = "";
      let n = 0;
      text.split(" ").forEach((word, i) => {
        if (i) h.append(" ");
        const box = make("word", h, "span");
        box.setAttribute("aria-hidden", "true");
        graphemes(word).forEach((c) => {
          const el = make("ch", box, "span");
          el.textContent = c;
          el.style.setProperty("--n", n++);
        });
      });
    });
  }

  /* ---------- Page changes ---------- */
  let party = null;
  function burst(x, y, icons, count) {
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const reach = rand(50, 150);
      temp("pop", icons[i % icons.length],
        `left:${x - 10}px;top:${y - 12}px;font-size:${rand(14, 28)}px;--x:${Math.cos(angle) * reach}px;--y:${Math.sin(angle) * reach}px;--r:${rand(-180, 180)}deg`, 1250);
    }
  }
  const number = (selector) => document.querySelectorAll(selector).forEach((el, i) => el.style.setProperty("--i", i));
  let first = true;
  document.addEventListener("screenchange", (e) => {
    splitTitles();
    number("#cards .card");
    number("#gallery .polaroid");
    clearInterval(party);
    if (reduced) return;
    if (!first) temp("wipe", "", "", 850);
    first = false;
    if (e.detail === "celebrate") {
      let rounds = 0;
      party = setInterval(() => {
        burst(rand(40, innerWidth - 40), rand(80, innerHeight * .65), ["💙", "💖", "🌺", "✨", "⭐"], 14);
        if (++rounds === 12) clearInterval(party);
      }, 650);
    }
  });
  // Photos load a moment later, so number them as they appear.
  new MutationObserver(() => number("#gallery .polaroid"))
    .observe(document.getElementById("gallery"), { childList: true });

  /* ---------- Tap Stitch for a reaction ---------- */
  const lines = ["Aloha, Bebo! 🌺", "Ohana means family 💙", "Hehe, gudgudi! 🙈", "Stitch bhi sorry bolta hai 🥺", "Ih! 💙"];
  let line = 0;
  document.querySelectorAll(".stitch").forEach((box) => {
    box.addEventListener("click", () => {
      const r = box.getBoundingClientRect();
      box.classList.remove("poke");
      void box.offsetWidth;
      box.classList.add("poke");
      document.querySelector(".bubble")?.remove();
      temp("bubble", lines[line++ % lines.length], `left:${r.left + r.width / 2}px;top:${Math.max(70, r.top + 6)}px`, 1850);
      if (!reduced) burst(r.left + r.width / 2, r.top + r.height / 2, ["💙", "🌺", "✨"], 10);
    });
  });

  /* ---------- Paw prints follow the pointer ---------- */
  let last = { x: 0, y: 0, t: 0 };
  document.addEventListener("pointermove", (e) => {
    const t = Date.now();
    if (reduced || t - last.t < 110 || Math.hypot(e.clientX - last.x, e.clientY - last.y) < 34) return;
    last = { x: e.clientX, y: e.clientY, t };
    temp("paw", "🐾", `left:${e.clientX + 6}px;top:${e.clientY + 8}px;rotate:${rand(-40, 40)}deg`, 1000);
  });

  /* ---------- The teaser jiggles when it changes ---------- */
  const teaser = document.getElementById("teaser");
  new MutationObserver(() => {
    teaser.classList.remove("bump");
    void teaser.offsetWidth;
    teaser.classList.add("bump");
  }).observe(teaser, { childList: true });
})();
