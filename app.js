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
    document.querySelectorAll('.i18n-it').forEach(function(el){ el.style.display = (lang==='en')?'none':'inline'; });
    document.querySelectorAll('.i18n-en').forEach(function(el){ el.style.display = (lang==='en')?'inline':'none'; });
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

  // ----- Commenti (modulo curato, via Formspree) -----
  window.initComments = function(){
    var f = document.querySelector('.comment-form .js-page');
    if (f) { f.value = document.title + ' | ' + location.pathname; }
  };

  // ----- Eventi Google Analytics (GA4, via gtag gia presente) -----
  function track(name, params){
    if (typeof gtag === 'function'){ try { gtag('event', name, params || {}); } catch(e){} }
  }
  window.initEvents = function(){
    // 1) click sui mondi e sulle discipline (le path-card)
    // 2) click sugli articoli del blog (le blog-card)
    // 3) download dei PDF (i pulsanti .doc-dl)
    document.addEventListener('click', function(ev){
      var t = ev.target;
      if (!t || !t.closest) return;
      var el = t.closest('.path-card, .blog-card, .doc-dl');
      if (!el) return;
      if (el.classList.contains('doc-dl')){
        var href = el.getAttribute('href') || '';
        track('file_download', { file_name: href.split('/').pop(), link_url: href });
      } else if (el.classList.contains('blog-card')){
        var h4 = el.querySelector('h4');
        track('select_content', { content_type: 'articolo', item_id: (h4 ? h4.textContent.trim() : '') });
      } else if (el.classList.contains('path-card')){
        var h3 = el.querySelector('h3');
        track('select_content', { content_type: 'mondo', item_id: (h3 ? h3.textContent.trim() : '') });
      }
    }, true);
    // 4) invio dei moduli (contatti e commenti)
    document.querySelectorAll('form').forEach(function(fm){
      fm.addEventListener('submit', function(){
        var name = fm.classList.contains('comment-form') ? 'commento' : 'contatti';
        track('form_submit', { form_name: name, page_path: location.pathname });
      });
    });
    // 5) cambio lingua (solo su click reale dei pulsanti)
    ['lang-it','lang-en'].forEach(function(id){
      var b = document.getElementById(id);
      if (b) b.addEventListener('click', function(){ track('change_language', { language: (id === 'lang-en' ? 'en' : 'it') }); });
    });
  };

  // ----- Banner consenso cookie (GDPR) -----
  function buildCookieBanner(){
    if (document.querySelector('.cookie-bar')) return;
    var lang = 'it'; try { lang = localStorage.getItem(KEY) || 'it'; } catch(e){}
    var bar = document.createElement('div');
    bar.className = 'cookie-bar';
    bar.innerHTML =
      '<p class="cookie-text" data-it="Usiamo cookie di analisi (Google Analytics) per capire, in forma anonima, come viene usato il sito. Puoi accettare o rifiutare." data-en="We use analytics cookies (Google Analytics) to understand, anonymously, how the site is used. You can accept or decline.">Usiamo cookie di analisi (Google Analytics) per capire, in forma anonima, come viene usato il sito. Puoi accettare o rifiutare.</p>' +
      '<div class="cookie-btns">' +
      '<button type="button" class="btn ghost cookie-no" data-it="Rifiuta" data-en="Decline">Rifiuta</button>' +
      '<button type="button" class="btn cookie-yes" data-it="Accetta" data-en="Accept">Accetta</button>' +
      '</div>';
    document.body.appendChild(bar);
    if (window.setLang) setLang(lang);
    function decide(granted){
      try { localStorage.setItem('bilateral-consent', granted ? 'granted' : 'denied'); } catch(e){}
      if (granted && typeof gtag === 'function'){ gtag('consent','update',{'analytics_storage':'granted'}); }
      if (bar.parentNode) bar.parentNode.removeChild(bar);
    }
    bar.querySelector('.cookie-yes').addEventListener('click', function(){ decide(true); });
    bar.querySelector('.cookie-no').addEventListener('click', function(){ decide(false); });
  }
  window.openCookiePrefs = function(){ try { localStorage.removeItem('bilateral-consent'); } catch(e){} buildCookieBanner(); };
  window.initConsent = function(){
    var nav = document.querySelector('.footer-nav');
    if (nav && !nav.querySelector('.cookie-link')){
      var a = document.createElement('a');
      a.href = '#'; a.className = 'cookie-link';
      a.setAttribute('data-it','Cookie'); a.setAttribute('data-en','Cookie'); a.textContent = 'Cookie';
      a.addEventListener('click', function(e){ e.preventDefault(); window.openCookiePrefs(); });
      nav.appendChild(a);
    }
    var choice = null; try { choice = localStorage.getItem('bilateral-consent'); } catch(e){}
    if (!choice) buildCookieBanner();
  };

  // applica la lingua salvata al caricamento
  var saved = 'it';
  try { saved = localStorage.getItem(KEY) || 'it'; } catch(e){}
  document.addEventListener('DOMContentLoaded', function(){
    setLang(saved);
    initReveal();
    initComments();
    initEvents();
    initConsent();
  });
})();
