(function () {
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  /* появление блоков */
  var io = new IntersectionObserver(function (es) {
    es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
  }, { rootMargin: '0px 0px -6% 0px', threshold: 0.06 });
  $$('.rv').forEach(function (el) { io.observe(el); });

  /* шапка */
  var hd = $('#hd');
  function onScroll() { hd.classList.toggle('solid', window.scrollY > 40); }
  window.addEventListener('scroll', onScroll, { passive: true }); onScroll();

  /* стол: на десктопе — перетаскивание, на телефоне — колода */
  var stack = $('#stack'), prints = $$('.print', stack);
  var desk = window.matchMedia('(min-width:1000px) and (hover:hover)');
  var top = 10;
  prints.forEach(function (p, i) {
    p.style.setProperty('--i', i);
    p.style.zIndex = i + 1;
    var sx, sy, ox = 0, oy = 0, on = false, moved = false;

    p.addEventListener('pointerdown', function (e) {
      if (!desk.matches) return;
      on = true; moved = false; sx = e.clientX; sy = e.clientY;
      p.setPointerCapture(e.pointerId); p.classList.add('drag'); p.style.zIndex = ++top;
      p.style.animation = 'none';
    });
    p.addEventListener('pointermove', function (e) {
      if (!on) return;
      var dx = e.clientX - sx, dy = e.clientY - sy;
      if (Math.abs(dx) + Math.abs(dy) > 3) moved = true;
      p.style.setProperty('--tx', ox + dx + 'px'); p.style.setProperty('--ty', oy + dy + 'px');
    });
    function up(e) {
      if (!on) return; on = false;
      ox += e.clientX - sx; oy += e.clientY - sy;
      p.classList.remove('drag');
      if (moved) p.style.setProperty('--r', (Math.random() * 14 - 7).toFixed(1) + 'deg');
    }
    p.addEventListener('pointerup', up); p.addEventListener('pointercancel', up);

    p.addEventListener('click', function () {
      if (desk.matches) return;
      var last = stack.lastElementChild;      /* верхняя карточка уходит под низ */
      if (last.classList.contains('away')) return;
      last.classList.add('away');
      setTimeout(function () {
        stack.insertBefore(last, stack.firstElementChild);
        $$('.print', stack).forEach(function (q, k) { q.style.zIndex = k + 1; });
        last.offsetWidth; last.classList.remove('away');
      }, 420);
    });
  });

  /* проекты: открыт только один, картинка следует за курсором */
  var items = $$('#pj details'), peek = $('#peek');
  items.forEach(function (d) {
    d.addEventListener('toggle', function () {
      if (d.open) items.forEach(function (o) { if (o !== d) o.open = false; });
      peek.classList.remove('on');
    });
    var s = $('summary', d);
    s.addEventListener('pointerenter', function () {
      if (!desk.matches || d.open) return;
      peek.src = d.dataset.img; peek.classList.add('on');
    });
    s.addEventListener('pointerleave', function () { peek.classList.remove('on'); });
  });
  window.addEventListener('pointermove', function (e) {
    if (!peek.classList.contains('on')) return;
    peek.style.setProperty('--px', Math.min(e.clientX + 30, window.innerWidth * 0.8) + 'px');
    peek.style.setProperty('--py', e.clientY - 120 + 'px');
  }, { passive: true });
})();
