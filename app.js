/* Bilateral — shared script (multipagina) */
(function(){
  var KEY = 'bilateral-lang';

  window.setLang = function(lang){
    try { localStorage.setItem(KEY, lang); } catch(e){}
    document.documentElement.lang = lang;
    document.querySelectorAll('[data-it]').forEach(function(el){
      var v = el.getAttribute('data-' + lang);
      if (v !== null) el.textContent = v;
    });
    document.querySelectorAll('[data-it-ph]').forEach(function(el){
      var v = el.getAttribute('data-' + lang + '-ph');
      if (v !== null) el.setAttribute('placeholder', v);
    });
    var it = document.getElementById('lang-it');
    var en = document.getElementById('lang-en');
    if (it) it.classList.toggle('active', lang === 'it');
    if (en) en.classList.toggle('active', lang === 'en');
  };

  window.toggleMenu = function(){
    var mm = document.getElementById('mobile-menu');
    var btn = document.querySelector('.nav-toggle');
    var willOpen = mm.hidden;
    mm.hidden = !willOpen;
    btn.setAttribute('aria-expanded', String(willOpen));
  };

  window.toggleEx = function(btn){ btn.parentElement.classList.toggle('open'); };

  window.notifyBuy = function(){
    var c = document.getElementById('contact');
    if (c) c.scrollIntoView({ behavior: 'smooth' });
  };

  // reveal on scroll (per elementi con classe .reveal)
  function initReveal(){
    var els = document.querySelectorAll('.reveal');
    if (!('IntersectionObserver' in window) || !els.length){
      els.forEach(function(el){ el.classList.add('in'); });
      return;
    }
    var obs = new IntersectionObserver(function(entries){
      entries.forEach(function(en){
        if (en.isIntersecting){ en.target.classList.add('in'); obs.unobserve(en.target); }
      });
    }, { threshold: 0.12 });
    els.forEach(function(el){ obs.observe(el); });
  }

  // applica la lingua salvata al caricamento
  var saved = 'it';
  try { saved = localStorage.getItem(KEY) || 'it'; } catch(e){}
  document.addEventListener('DOMContentLoaded', function(){
    setLang(saved);
    initReveal();
  });
})();
