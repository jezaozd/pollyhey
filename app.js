(function () {
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var calm = window.matchMedia('(prefers-reduced-motion:reduce)').matches;

  /* появление блоков и «раскрытие» фотографий */
  var io = new IntersectionObserver(function (es) {
    es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
  $$('.rv,.un').forEach(function (el, i) {
    if (el.classList.contains('rv')) {
      /* соседние элементы появляются по очереди */
      var prev = el.previousElementSibling, d = 0;
      while (prev && prev.classList.contains('rv') && d < 0.48) { d += 0.12; prev = prev.previousElementSibling; }
      if (d) el.style.transitionDelay = d + 's';
    }
    io.observe(el);
  });

  /* шапка + лёгкий параллакс */
  var hd = $('#hd'), hero = $('.hero'), pars = $$('[data-par]'), tick = false;
  function frame() {
    tick = false;
    var y = window.scrollY, vh = window.innerHeight;
    hd.classList.toggle('solid', y > hero.offsetHeight - 70);
    if (calm) return;
    pars.forEach(function (p) {
      var r = p.getBoundingClientRect();
      if (r.bottom < -100 || r.top > vh + 100) return;
      var c = (r.top + r.height / 2 - vh / 2) * parseFloat(p.dataset.par);
      p.firstElementChild.style.transform = 'translate3d(0,' + (-c).toFixed(1) + 'px,0) scale(1.06)';
    });
  }
  window.addEventListener('scroll', function () { if (!tick) { tick = true; requestAnimationFrame(frame); } }, { passive: true });
  window.addEventListener('resize', frame);
  frame();

  /* анфилада: перетаскивание, стрелки, счётчик */
  var salon = $('#salon'), plates = $$('.plate', salon), cur = $('#cur'), bar = $('#bar');
  var R = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII'];
  var down = false, sx = 0, sl = 0, moved = 0;
  salon.addEventListener('pointerdown', function (e) {
    if (e.pointerType !== 'mouse') return;
    down = true; moved = 0; sx = e.clientX; sl = salon.scrollLeft;
  });
  window.addEventListener('pointermove', function (e) {
    if (!down) return;
    var dx = e.clientX - sx; moved = Math.max(moved, Math.abs(dx));
    if (moved > 6) { salon.classList.add('drag'); salon.scrollLeft = sl - dx; }
  });
  window.addEventListener('pointerup', function () { down = false; salon.classList.remove('drag'); });
  function step() { return plates[0].getBoundingClientRect().width + parseFloat(getComputedStyle(salon).columnGap || 40); }
  $('#next').addEventListener('click', function () { salon.scrollBy({ left: step(), behavior: 'smooth' }); });
  $('#prev').addEventListener('click', function () { salon.scrollBy({ left: -step(), behavior: 'smooth' }); });
  salon.addEventListener('scroll', function () {
    var max = salon.scrollWidth - salon.clientWidth, p = max > 0 ? salon.scrollLeft / max : 0;
    var i = Math.min(R.length - 1, Math.round(p * (R.length - 1)));
    cur.textContent = R[i]; bar.style.width = (12 + p * 88) + '%';
  }, { passive: true });

  /* карточка работы */
  var dlg = $('#dlg'), dlgin = $('#dlgin'), last = null;
  plates.forEach(function (pl) {
    var d = $('.pd', pl);
    if (!d) return;
    pl.addEventListener('click', function () {
      if (moved > 6) { moved = 0; return; }           /* это было перетаскивание, а не нажатие */
      last = pl; dlgin.innerHTML = d.innerHTML;
      if (dlg.showModal) dlg.showModal(); else dlg.setAttribute('open', '');
      dlg.scrollTop = 0;
    });
  });
  function closeDlg() { if (dlg.open) dlg.close(); }
  dlg.addEventListener('close', function () { if (last) { last.focus({ preventScroll: true }); last = null; } });
  $('#dlgx').addEventListener('click', closeDlg);
  dlg.addEventListener('click', function (e) { if (e.target === dlg) closeDlg(); });
})();
