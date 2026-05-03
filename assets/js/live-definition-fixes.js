(function(){
  var dosadosText = 'Két vagy több könyvtestet közös borítószerkezetben, egymásnak háttal összekapcsoló könyvforma. Az egyes könyvtestek külön nyithatók, miközben egyetlen tárgyi egységhez tartoznak.';
  function applyDosadosFix(){
    var cards = document.querySelectorAll('[data-term-id]');
    cards.forEach(function(card){
      if(card.getAttribute('data-term-id') !== 'mambo:form-002') return;
      var def = card.querySelector('.term-summary > .definition') || card.querySelector('.card-body > .definition');
      if(def) def.textContent = dosadosText;
    });
  }
  window.addEventListener('DOMContentLoaded', function(){
    var list = document.querySelector('#termList');
    if(list) new MutationObserver(applyDosadosFix).observe(list,{childList:true,subtree:true});
    applyDosadosFix();
    setTimeout(applyDosadosFix,300);
    setTimeout(applyDosadosFix,900);
  });
})();
