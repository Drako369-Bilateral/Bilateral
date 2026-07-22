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
    if(tg&&m) tg.addEventListener('click',function(){m.style.display=(m.style.display==='block')?'none':'block';}); wireAjax('book-form','book-done'); wireAjax('walk-form','walk-done'); wireAjax('home-form','home-done'); wireAjax('sessione-form','sessione-done'); wireAjax('b2b-form','b2b-done'); wireAjax('centri-form','centri-done'); wireAjax('scuole-form','scuole-done'); wireAjax('riab-form','riab-done');
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
        if(id==='book-form') ev('principi_richiesti');
        else ev('contatto_inviato',{pagina:path});
      });
    });

    var lb=document.getElementById('lefty-btn'); if(lb) lb.addEventListener('click', function(){ ev('modalita_mancino',{stato: document.body.classList.contains('lefty')?'on':'off'}); });
    document.querySelectorAll('.ex-head').forEach(function(b){
      b.addEventListener('click', function(){ var c=b.closest('.ex-card'); if(c && c.classList.contains('open')){ var ti=b.querySelector('.ex-title'); ev('esercizio_aperto',{esercizio: ti?ti.textContent.trim():''}); } });
    });
    document.querySelectorAll('.filter-btn').forEach(function(b){ b.addEventListener('click', function(){ ev('filtro_articoli',{campo:b.getAttribute('data-cat')}); }); });
    document.querySelectorAll('a[download], a[href$=".pdf"]').forEach(function(a){ a.addEventListener('click', function(){ ev('documento_scaricato',{documento:(a.getAttribute('href')||'').split('/').pop()}); }); });
    document.querySelectorAll('a[data-it^="Vieni marted"], a[href*="/camminata/"], a[href*="/en/walk/"]').forEach(function(a){ a.addEventListener('click', function(){ ev('cta_camminata',{pagina:path}); }); });
    document.querySelectorAll('a[href^="http"]').forEach(function(a){ if(a.hostname && a.hostname!==location.hostname){ a.addEventListener('click', function(){ ev('link_esterno',{url:a.href}); }); } });
    document.querySelectorAll('[data-ev]').forEach(function(el){ el.addEventListener('click', function(){ ev(el.getAttribute('data-ev'),{pagina:path}); }); });

    /* Profondita di lettura: 25/50/75/100% del corpo articolo, una volta per soglia. */
    (function(){
      var art = document.querySelector('.article');
      if(!art) return;
      var soglie = [25,50,75,100], fatte = {}, ticking = false;
      function controlla(){
        ticking = false;
        var box = art.getBoundingClientRect();
        var letto = window.innerHeight - box.top;
        if(letto <= 0) return;
        var perc = Math.min(100, Math.round(letto / box.height * 100));
        for(var i=0;i<soglie.length;i++){
          var s = soglie[i];
          if(perc >= s && !fatte[s]){
            fatte[s] = true;
            ev('profondita_lettura', {percentuale: s, pagina: path});
          }
        }
        if(fatte[100]) window.removeEventListener('scroll', onScroll);
      }
      function onScroll(){ if(!ticking){ ticking = true; requestAnimationFrame(controlla); } }
      window.addEventListener('scroll', onScroll, {passive:true});
      controlla();

      /* Tempo di permanenza: un solo evento a 30 secondi, per distinguere lettura da rimbalzo. */
      setTimeout(function(){ ev('lettura_30s', {pagina: path}); }, 30000);
    })();
  });
})();

/* Lingua statica coerente con l'URL: le pagine sotto /en/ mostrano sempre i testi data-en.
   Rete di sicurezza: se un testo statico resta in italiano, viene corretto al caricamento. */
(function(){
  function apply(){
    var lang = location.pathname.indexOf('/en/') === 0 ? 'en' : 'it';
    document.querySelectorAll('[data-' + lang + ']').forEach(function(el){
      var v = el.getAttribute('data-' + lang);
      if (v !== null && el.children.length === 0 && el.textContent.trim() !== v.trim()) el.textContent = v;
    });
    document.querySelectorAll('[data-' + lang + '-ph]').forEach(function(el){
      var v = el.getAttribute('data-' + lang + '-ph');
      if (v !== null) el.setAttribute('placeholder', v);
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', apply);
  else apply();
})();

/* Test delle abitudini: conta quanti gesti partono dallo stesso lato.
   Non assegna un'etichetta: mostra un numero. */
(function(){
  function ev(n,p){ try{ if(window.gtag) gtag('event', n, p||{}); }catch(e){} }
  function init(){
    var t=document.getElementById('habit-test'); if(!t) return;
    var answers={}, total=t.querySelectorAll('.q').length, started=false, done=false;
    t.addEventListener('click', function(e){
      var b=e.target.closest('.opt'); if(!b) return;
      var q=b.closest('.q');
      q.querySelectorAll('.opt').forEach(function(o){ o.setAttribute('aria-pressed','false'); });
      b.setAttribute('aria-pressed','true');
      answers[q.getAttribute('data-q')]=b.getAttribute('data-val');
      if(!started){ started=true; ev('test_iniziato'); }
      var n=Object.keys(answers).length;
      var prog=t.querySelector('.q-prog'); if(prog) prog.textContent=n+'/'+total;
      if(n<total) return;

      var sx=0, dx=0, ns=0;
      for(var k in answers){
        if(answers[k]==='sx') sx++; else if(answers[k]==='dx') dx++; else ns++;
      }
      var top=Math.max(sx,dx), lato=(sx>dx)?'sx':((dx>sx)?'dx':'pari');
      var band=(top>=7)?'alto':((top>=5)?'medio':'basso');

      t.querySelectorAll('.n-top').forEach(function(el){ el.textContent=top; });
      t.querySelectorAll('.n-tot').forEach(function(el){ el.textContent=total; });
      var uk=t.querySelector('.res-unknown');
      if(uk){ uk.hidden=(ns===0); uk.querySelectorAll('.n-ns').forEach(function(el){ el.textContent=ns; }); }
      t.querySelectorAll('.res-band').forEach(function(r){ r.hidden=(r.getAttribute('data-band')!==band); });
      var w=t.querySelector('.q-wait'); if(w) w.hidden=true;
      var box=t.querySelector('.q-result'); if(box){ box.hidden=false; box.scrollIntoView({behavior:'smooth',block:'center'}); }
      if(!done){ done=true; ev('test_completato',{stesso_lato:top, non_notati:ns, lato:lato}); }
    });
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded', init); else init();
})();

/* Evento ricorrente: tiene aggiornata la data del prossimo martedì nei dati strutturati,
   così non invecchia su un sito statico. */
(function(){
  function prossimoMartedi(){
    var now=new Date(), d=new Date(now), diff=(2-d.getDay()+7)%7;
    if(diff===0 && (now.getHours()>19 || (now.getHours()===19 && now.getMinutes()>45))) diff=7;
    d.setDate(d.getDate()+diff); return d;
  }
  function iso(d,h,m){
    var mese=d.getMonth()+1, off=(mese>=4 && mese<=10) ? '+02:00' : '+01:00';
    function p(n){ return (n<10?'0':'')+n; }
    return d.getFullYear()+'-'+p(d.getMonth()+1)+'-'+p(d.getDate())+'T'+p(h)+':'+p(m)+':00'+off;
  }
  function aggiorna(){
    var d=prossimoMartedi(), inizio=iso(d,19,0), fine=iso(d,19,45);
    document.querySelectorAll('script[type="application/ld+json"]').forEach(function(s){
      try{
        var data=JSON.parse(s.textContent), tocca=false;
        var nodi = data['@graph'] || [data];
        nodi.forEach(function(n){
          if(n && n['@type']==='Event'){
            n.startDate=inizio; n.endDate=fine; tocca=true;
            if(n.eventSchedule) n.eventSchedule.startDate=inizio.slice(0,10);
          }
        });
        if(tocca) s.textContent=JSON.stringify(data);
      }catch(e){}
    });
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded', aggiorna); else aggiorna();
})();

/* Ombra sulla barra quando la pagina è scorsa */
(function(){
  var h=document.querySelector('header.site');
  if(!h) return;
  function agg(){ h.classList.toggle('scrolled', window.scrollY>8); }
  agg();
  window.addEventListener('scroll', agg, {passive:true});
})();

/* La barra è fissa: misuro la sua altezza reale e la compenso, anche al ridimensionamento */
(function(){
  function spazio(){
    var h=document.querySelector('header.site');
    if(!h) return;
    var m=document.getElementById('m');
    var aperto = m && m.style.display==='block';
    if(aperto) return;                      // con la tendina aperta la misura sarebbe falsata
    var alt=h.offsetHeight;
    if(alt>0){
      document.body.style.paddingTop=alt+'px';
      document.documentElement.style.setProperty('--head-h', alt+'px');
    }
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded', spazio);
  else spazio();
  window.addEventListener('load', spazio);
  window.addEventListener('resize', spazio, {passive:true});
})();

/* Test: filetto di avanzamento e numero acceso sulle domande risposte */
(function(){
  function init(){
    var t=document.getElementById('habit-test'); if(!t) return;
    var tot=t.querySelectorAll('.q').length;
    t.addEventListener('click', function(e){
      var b=e.target.closest('.opt'); if(!b) return;
      var q=b.closest('.q'); if(q) q.classList.add('risposta');
      var fatte=t.querySelectorAll('.q.risposta').length;
      var bar=t.querySelector('.q-prog-bar i');
      if(bar) bar.style.width=Math.round(fatte/tot*100)+'%';
    });
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded', init); else init();
})();

/* Test a scorrimento: una domanda alla volta. Se il JS non parte, restano tutte visibili. */
(function(){
  function init(){
    var t=document.getElementById('habit-test'); if(!t) return;
    var domande=[].slice.call(t.querySelectorAll('.q'));
    if(domande.length<2) return;
    var tot=domande.length, i=0;
    var indietro=t.querySelector('.passo-indietro');
    var conta=t.querySelector('.passo-conta');
    var bar=t.querySelector('.q-prog-bar i');
    var prog=t.querySelector('.q-prog');

    t.classList.add('passo');

    function mostra(n){
      i=Math.max(0, Math.min(n, tot-1));
      domande.forEach(function(q,k){ q.classList.toggle('attiva', k===i); });
      if(conta) conta.textContent=(i+1)+' / '+tot;
      if(indietro) indietro.hidden = (i===0);
      var risposte=t.querySelectorAll('.q.risposta').length;
      if(bar) bar.style.width=Math.round(risposte/tot*100)+'%';
      if(prog) prog.textContent=risposte+'/'+tot;
    }

    t.addEventListener('click', function(e){
      if(e.target.closest('.passo-indietro')){ mostra(i-1); return; }
      var b=e.target.closest('.opt'); if(!b) return;
      var q=b.closest('.q'); if(q) q.classList.add('risposta');
      var risposte=t.querySelectorAll('.q.risposta').length;
      if(risposte>=tot){
        var riq=t.querySelector('.riquadro'), nav=t.querySelector('.passo-nav');
        if(riq) riq.hidden=true;
        if(nav) nav.hidden=true;
        if(bar) bar.style.width='100%';
        return;                       // il risultato lo mostra il gestore del test
      }
      setTimeout(function(){ mostra(i+1); }, 220);
    });

    mostra(0);
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
