/* Lightweight twinkling starfield — runs behind every page on a fixed canvas. */
(function () {
  var canvas = document.getElementById("starfield");
  if (!canvas || !canvas.getContext) return;

  var ctx = canvas.getContext("2d");
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var stars = [];
  var w, h, dpr;

  function sizeCanvas() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = window.innerWidth;
    h = window.innerHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = w + "px";
    canvas.style.height = h + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function makeStars() {
    var count = Math.min(160, Math.floor((w * h) / 9000));
    stars = [];
    for (var i = 0; i < count; i++) {
      stars.push({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 1.3 + 0.3,
        base: Math.random() * 0.5 + 0.3,
        speed: Math.random() * 0.015 + 0.004,
        phase: Math.random() * Math.PI * 2
      });
    }
  }

  function draw(t) {
    ctx.clearRect(0, 0, w, h);
    for (var i = 0; i < stars.length; i++) {
      var s = stars[i];
      var twinkle = reduceMotion ? s.base : s.base + Math.sin(t * s.speed + s.phase) * 0.35;
      ctx.globalAlpha = Math.max(0, Math.min(1, twinkle));
      ctx.fillStyle = "#f5f3ff";
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
    if (!reduceMotion) requestAnimationFrame(draw);
  }

  sizeCanvas();
  makeStars();
  requestAnimationFrame(draw);
  if (reduceMotion) draw(0);

  var resizeTimer;
  window.addEventListener("resize", function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
      sizeCanvas();
      makeStars();
      if (reduceMotion) draw(0);
    }, 150);
  });
})();
