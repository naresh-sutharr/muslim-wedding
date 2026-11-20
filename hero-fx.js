/**
 * Taj Mahal Hero Scene Animation Effects:
 * - Twinkling cosmic starlight in the twilight sky
 * - Golden glowing ember motes rising from the fanoos lanterns
 * - Drifting rose petals gently floating across the reflecting pool
 * 
 * Hardware-accelerated, respects reduced-motion, and pauses when off-screen.
 */
(function () {
  'use strict';

  var canvas = document.getElementById('ryHeroCanvas');
  if (!canvas) return;

  var ctx = canvas.getContext('2d');
  if (!ctx) return;

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduced) return;

  var width = 0;
  var height = 0;
  var running = true;
  var animId = null;

  function resize() {
    var rect = canvas.getBoundingClientRect();
    width = canvas.width = rect.width || window.innerWidth;
    height = canvas.height = rect.height || (window.innerHeight * 0.85);
  }
  resize();
  window.addEventListener('resize', resize, { passive: true });

  // 1. Stars (upper 45% of canvas - sky)
  var stars = [];
  var STAR_COUNT = 45;
  for (var i = 0; i < STAR_COUNT; i++) {
    stars.push({
      x: Math.random(),
      y: Math.random() * 0.42,
      r: 0.8 + Math.random() * 1.8,
      alpha: 0.2 + Math.random() * 0.7,
      speed: 0.015 + Math.random() * 0.03,
      phase: Math.random() * Math.PI * 2
    });
  }

  // 2. Golden lantern embers (rising from bottom half)
  var embers = [];
  var EMBER_COUNT = 30;
  function makeEmber(initial) {
    return {
      x: Math.random() * width,
      y: initial ? Math.random() * height : height + Math.random() * 20,
      r: 1.2 + Math.random() * 2.2,
      vy: -(0.3 + Math.random() * 0.7),
      vx: (Math.random() - 0.5) * 0.4,
      alpha: 0.1 + Math.random() * 0.65,
      hue: 42 + Math.random() * 12, // Warm golden amber
      pulse: Math.random() * Math.PI * 2
    };
  }
  for (var j = 0; j < EMBER_COUNT; j++) embers.push(makeEmber(true));

  // 3. Floating Rose Petals (drifting gently from top right to bottom left)
  var petals = [];
  var PETAL_COUNT = 14;
  function makePetal(initial) {
    return {
      x: Math.random() * (width + 100),
      y: initial ? Math.random() * height : -30,
      size: 6 + Math.random() * 7,
      vy: 0.45 + Math.random() * 0.6,
      vx: -(0.3 + Math.random() * 0.5),
      rot: Math.random() * Math.PI * 2,
      vrot: (Math.random() - 0.5) * 0.02,
      wobble: Math.random() * Math.PI * 2,
      opacity: 0.5 + Math.random() * 0.4,
      isWhite: Math.random() > 0.8 // 20% white jasmine, 80% royal red rose
    };
  }
  for (var k = 0; k < PETAL_COUNT; k++) petals.push(makePetal(true));

  function drawStar(s) {
    s.phase += s.speed;
    var a = s.alpha + Math.sin(s.phase) * 0.35;
    if (a < 0.1) a = 0.1;
    if (a > 1) a = 1;

    var px = s.x * width;
    var py = s.y * height;

    ctx.save();
    ctx.beginPath();
    ctx.arc(px, py, s.r, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255, 248, 220, ' + a.toFixed(3) + ')';
    ctx.shadowColor = 'rgba(255, 235, 160, 0.9)';
    ctx.shadowBlur = s.r * 4;
    ctx.fill();
    ctx.restore();
  }

  function drawEmber(e) {
    e.y += e.vy;
    e.x += e.vx + Math.sin(e.pulse) * 0.25;
    e.pulse += 0.02;

    if (e.y < -20 || e.x < -20 || e.x > width + 20) {
      Object.assign(e, makeEmber(false));
    }

    ctx.save();
    ctx.beginPath();
    ctx.arc(e.x, e.y, e.r, 0, Math.PI * 2);
    ctx.fillStyle = 'hsla(' + e.hue + ', 100%, 75%, ' + e.alpha.toFixed(3) + ')';
    ctx.shadowColor = 'hsla(' + e.hue + ', 100%, 60%, 0.8)';
    ctx.shadowBlur = e.r * 5;
    ctx.fill();
    ctx.restore();
  }

  function drawPetal(p) {
    p.y += p.vy;
    p.x += p.vx + Math.sin(p.wobble) * 0.4;
    p.wobble += 0.015;
    p.rot += p.vrot;

    if (p.y > height + 30 || p.x < -50) {
      Object.assign(p, makePetal(false));
    }

    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rot);
    ctx.scale(Math.cos(p.wobble * 0.8), 1);

    ctx.beginPath();
    ctx.moveTo(0, -p.size);
    ctx.bezierCurveTo(p.size * 0.8, -p.size * 0.5, p.size * 0.9, p.size * 0.6, 0, p.size);
    ctx.bezierCurveTo(-p.size * 0.9, p.size * 0.6, -p.size * 0.8, -p.size * 0.5, 0, -p.size);
    ctx.closePath();

    if (p.isWhite) {
      ctx.fillStyle = 'rgba(255, 252, 245, ' + p.opacity.toFixed(3) + ')';
      ctx.shadowColor = 'rgba(255, 255, 255, 0.4)';
    } else {
      ctx.fillStyle = 'rgba(196, 28, 64, ' + p.opacity.toFixed(3) + ')';
      ctx.shadowColor = 'rgba(128, 0, 32, 0.5)';
    }
    ctx.shadowBlur = 4;
    ctx.fill();
    ctx.restore();
  }

  function loop() {
    if (!running) return;
    ctx.clearRect(0, 0, width, height);

    // Render layers
    for (var i = 0; i < stars.length; i++) drawStar(stars[i]);
    for (var j = 0; j < embers.length; j++) drawEmber(embers[j]);
    for (var k = 0; k < petals.length; k++) drawPetal(petals[k]);

    animId = requestAnimationFrame(loop);
  }
  loop();

  // Performance: pause loop when off-screen
  if ('IntersectionObserver' in window) {
    var heroSection = canvas.closest('.royale-hero') || canvas;
    new IntersectionObserver(function (entries) {
      var isVisible = entries[0].isIntersecting;
      if (isVisible && !running) {
        running = true;
        loop();
      } else if (!isVisible && running) {
        running = false;
        if (animId) cancelAnimationFrame(animId);
      }
    }, { threshold: 0.05 }).observe(heroSection);
  }
})();
