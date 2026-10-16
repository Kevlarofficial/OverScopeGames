// Over Scope Games — shared behavior

document.addEventListener("DOMContentLoaded", function () {
  // mobile nav toggle
  var toggle = document.querySelector(".nav-toggle");
  var links = document.querySelector(".nav-links");
  if (toggle && links) {
    toggle.addEventListener("click", function () {
      var open = links.style.display === "flex";
      links.style.display = open ? "none" : "flex";
      links.style.flexDirection = "column";
      links.style.gap = "16px";
      links.style.position = "absolute";
      links.style.top = "64px";
      links.style.right = "28px";
      links.style.background = "var(--panel)";
      links.style.border = "1px solid var(--line)";
      links.style.padding = "18px 22px";
      links.style.borderRadius = "6px";
      toggle.setAttribute("aria-expanded", String(!open));
    });
  }

  // boot-sequence typewriter — the hero terminal signature
  var body = document.querySelector("[data-boot]");
  if (!body) return;

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var lines = [
    { text: "over scope games — terminal v1.0", cls: "" },
    { text: "initializing studio...", cls: "ok", prompt: "$ " },
    { text: "loading current project... done", cls: "ok", prompt: "$ " },
    { text: "awaiting input", cls: "", prompt: "$ " }
  ];

  if (reduceMotion) {
    body.innerHTML = lines.map(function (l) {
      return '<div class="line">' +
        (l.prompt ? '<span class="prompt">' + l.prompt + '</span>' : "") +
        '<span class="' + l.cls + '">' + l.text + '</span></div>';
    }).join("") + '<span class="cursor-block"></span>';
    return;
  }

  body.innerHTML = "";
  var lineIndex = 0;
  var charIndex = 0;
  var currentLineEl = null;

  function typeNext() {
    if (lineIndex >= lines.length) {
      var cursor = document.createElement("span");
      cursor.className = "cursor-block";
      body.appendChild(cursor);
      return;
    }

    var l = lines[lineIndex];

    if (charIndex === 0) {
      currentLineEl = document.createElement("div");
      currentLineEl.className = "line";
      if (l.prompt) {
        var p = document.createElement("span");
        p.className = "prompt";
        p.textContent = l.prompt;
        currentLineEl.appendChild(p);
      }
      var span = document.createElement("span");
      span.className = l.cls;
      currentLineEl.appendChild(span);
      body.appendChild(currentLineEl);
    }

    var span = currentLineEl.querySelector("span:last-child");
    if (charIndex < l.text.length) {
      span.textContent += l.text.charAt(charIndex);
      charIndex++;
      setTimeout(typeNext, 18 + Math.random() * 22);
    } else {
      lineIndex++;
      charIndex = 0;
      setTimeout(typeNext, 260);
    }
  }

  setTimeout(typeNext, 300);
});
