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

  /* большое яйцо: открывается само, дальше — по нажатию */
  var great = $('#great'), hint = $('.egg-hint');
  setTimeout(function () { great.classList.add('open'); }, 900);
  great.addEventListener('click', function () {
    great.classList.toggle('open');
    if (hint) hint.style.visibility = 'hidden';
  });

  /* коллекция: яйцо раскрывается, сюрприз — в ларце */
  var dlg = $('#dlg'), dlgin = $('#dlgin'), current = null;
  $$('.lot').forEach(function (lot) {
    var egg = $('button.egg', lot), d = $('.lot-d', lot);
    if (!egg || !d) return;
    egg.addEventListener('click', function () {
      if (current) return;
      current = egg; egg.classList.add('open');
      setTimeout(function () {
        dlgin.innerHTML = d.innerHTML;
        if (dlg.showModal) dlg.showModal(); else dlg.setAttribute('open', '');
        dlg.scrollTop = 0;
      }, 520);
    });
  });
  function closeDlg() { if (dlg.open) dlg.close(); }
  dlg.addEventListener('close', function () {
    if (current) { current.classList.remove('open'); current.focus(); current = null; }
  });
  $('#dlgx').addEventListener('click', closeDlg);
  dlg.addEventListener('click', function (e) { if (e.target === dlg) closeDlg(); });
})();
