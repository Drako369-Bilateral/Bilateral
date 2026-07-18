/* Bilateral — script condiviso (multipagina, IT/EN, mancino) */
(function(){
  var LKEY='bilateral-lang', FKEY='bilateral-lefty';
  function setLang(lang){
    try{localStorage.setItem(LKEY,lang);}catch(e){}
    var h=document.documentElement;
    h.lang=lang; h.classList.toggle('lang-en', lang==='en');
    document.querySelectorAll('[data-it]').forEach(function(el){var v=el.getAttribute('data-'+lang); if(v!==null) el.textContent=v;});
    document.querySelectorAll('[data-it-ph]').forEach(function(el){var v=el.getAttribute('data-'+lang+'-ph'); if(v!==null) el.setAttribute('placeholder',v);});
    document.querySelectorAll('[data-it-content]').forEach(function(el){var v=el.getAttribute('data-'+lang+'-content'); if(v!==null) el.setAttribute('content',v);});
    var it=document.getElementById('lang-it'), en=document.getElementById('lang-en');
    if(it) it.setAttribute('aria-pressed', lang==='it');
    if(en) en.setAttribute('aria-pressed', lang==='en');
  }
  function setLefty(on){
    try{localStorage.setItem(FKEY, on?'1':'0');}catch(e){}
    document.body.classList.toggle('lefty', on);
    var b=document.getElementById('lefty-btn'); if(b) b.setAttribute('aria-pressed', on);
  }
  window.setLang=setLang; window.setLefty=setLefty;

  function initQuiz(){
    var quiz=document.getElementById('side-test'); if(!quiz) return;
    var answers={}, total=quiz.querySelectorAll('.q').length;
    quiz.addEventListener('click',function(e){
      var b=e.target.closest('.opt'); if(!b) return;
      var q=b.closest('.q');
      q.querySelectorAll('.opt').forEach(function(o){o.setAttribute('aria-pressed','false');});
      b.setAttribute('aria-pressed','true');
      answers[q.getAttribute('data-q')]=b.getAttribute('data-val');
      if(Object.keys(answers).length<total) return;
      var ref=answers['1'], same=0, aware=0;
      for(var k in answers){ if(k==='1') continue;
        if(answers[k]==='aware') aware++;
        else if(answers[k]==='auto') continue;
        else if(answers[k]===ref) same++;
      }
      var key=(aware>=2)?'bilaterale':((same>=3)?'netta':'mista');
      quiz.querySelectorAll('.q-res').forEach(function(r){ r.hidden=(r.getAttribute('data-res')!==key); });
      var w=quiz.querySelector('.q-wait'); if(w) w.hidden=true;
      var shown=quiz.querySelector('.q-res:not([hidden])'); if(shown) shown.scrollIntoView({behavior:'smooth',block:'center'});
    });
  }
  function wireAjax(fid,did){
    var f=document.getElementById(fid); if(!f) return;
    f.addEventListener('submit',function(e){
      e.preventDefault();
      fetch(f.action,{method:'POST',body:new FormData(f),headers:{'Accept':'application/json'}})
        .then(function(){ f.hidden=true; var d=document.getElementById(did); if(d) d.hidden=false; })
        .catch(function(){ f.submit(); });
    });
  }
  document.addEventListener('DOMContentLoaded',function(){
    var lon=false; try{lon=localStorage.getItem(FKEY)==='1';}catch(e){} setLefty(lon);
    var lb=document.getElementById('lefty-btn'); if(lb) lb.addEventListener('click',function(){setLefty(!document.body.classList.contains('lefty'));});
    var tg=document.querySelector('.nav-toggle'), m=document.getElementById('m');
    if(tg&&m) tg.addEventListener('click',function(){m.style.display=(m.style.display==='block')?'none':'block';});
    initQuiz(); wireAjax('koan-form','koan-done'); wireAjax('book-form','book-done');
  });
})();


(function(){document.addEventListener('DOMContentLoaded',function(){
  document.querySelectorAll('.ex-head').forEach(function(b){
    b.setAttribute('aria-expanded','false');
    b.addEventListener('click',function(){
      var c=b.closest('.ex-card'); var open=c.classList.toggle('open');
      var tg=b.querySelector('.ex-toggle'); if(tg) tg.textContent=open?'\u2013':'+';
      b.setAttribute('aria-expanded', open?'true':'false');
    });
  });
});})();


(function(){document.addEventListener('DOMContentLoaded',function(){
  var fb=document.querySelectorAll('.filter-btn'); if(!fb.length) return;
  fb.forEach(function(b){ b.addEventListener('click',function(){
    var cat=b.getAttribute('data-cat'), any=false;
    fb.forEach(function(x){ x.setAttribute('aria-pressed', x===b?'true':'false'); });
    document.querySelectorAll('.post-card').forEach(function(c){
      var show=(cat==='all')||(c.getAttribute('data-cat')===cat);
      c.style.display=show?'':'none'; if(show) any=true;
    });
    var np=document.getElementById('no-posts'); if(np) np.hidden=any;
  });});
});})();


(function(){
  function ev(n,p){ try{ if(window.gtag) gtag('event', n, p||{}); }catch(e){} }
  document.addEventListener('DOMContentLoaded', function(){
    var path=location.pathname;
    var cb=document.getElementById('cookie-bar'), stored=null;
    try{ stored=localStorage.getItem('bilateral-consent'); }catch(e){}
    if(cb && !stored) cb.hidden=false;
    function consent(v){ try{ localStorage.setItem('bilateral-consent', v);}catch(e){} if(v==='granted' && window.gtag) gtag('consent','update',{'analytics_storage':'granted'}); if(cb) cb.hidden=true; }
    var cy=document.getElementById('cookie-yes'), cn=document.getElementById('cookie-no');
    if(cy) cy.addEventListener('click', function(){ consent('granted'); ev('consenso_cookie',{scelta:'accetta'}); });
    if(cn) cn.addEventListener('click', function(){ consent('denied'); });
    document.querySelectorAll('form[action*="formspree"]').forEach(function(f){
      f.addEventListener('submit', function(){
        var id=f.id||'';
        if(id==='koan-form') ev('koan_richiesti');
        else if(id==='book-form') ev('libro_richiesto');
        else ev('contatto_inviato',{pagina:path});
      });
    });
    var quiz=document.getElementById('side-test');
    if(quiz){ var started=false;
      quiz.addEventListener('click', function(e){
        if(!e.target.closest('.opt')) return;
        if(!started){ started=true; ev('test_iniziato'); }
        setTimeout(function(){
          var r=quiz.querySelector('.q-res:not([hidden])');
          if(r && !quiz.getAttribute('data-done')){ quiz.setAttribute('data-done','1'); ev('test_completato',{profilo:r.getAttribute('data-res')}); }
        },60);
      });
    }
    var lb=document.getElementById('lefty-btn'); if(lb) lb.addEventListener('click', function(){ ev('modalita_mancino',{stato: document.body.classList.contains('lefty')?'on':'off'}); });
    document.querySelectorAll('.ex-head').forEach(function(b){
      b.addEventListener('click', function(){ var c=b.closest('.ex-card'); if(c && c.classList.contains('open')){ var ti=b.querySelector('.ex-title'); ev('esercizio_aperto',{esercizio: ti?ti.textContent.trim():''}); } });
    });
    document.querySelectorAll('.filter-btn').forEach(function(b){ b.addEventListener('click', function(){ ev('filtro_blog',{campo:b.getAttribute('data-cat')}); }); });
    document.querySelectorAll('a[download], a[href$=".pdf"]').forEach(function(a){ a.addEventListener('click', function(){ ev('documento_scaricato',{documento:(a.getAttribute('href')||'').split('/').pop()}); }); });
    document.querySelectorAll('a[data-it^="Vieni marted"], a[href*="/camminata/"], a[href*="/en/walk/"]').forEach(function(a){ a.addEventListener('click', function(){ ev('cta_camminata',{pagina:path}); }); });
    document.querySelectorAll('a[href^="http"]').forEach(function(a){ if(a.hostname && a.hostname!==location.hostname){ a.addEventListener('click', function(){ ev('link_esterno',{url:a.href}); }); } });
    document.querySelectorAll('[data-ev]').forEach(function(el){ el.addEventListener('click', function(){ ev(el.getAttribute('data-ev'),{pagina:path}); }); });
  });
})();
