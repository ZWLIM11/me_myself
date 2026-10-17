(() => {
  const watched=new WeakSet(),selector='.project-image img,.about-photo img,.photo-frame img,.case-cover,.case-media img';
  function watch(){document.querySelectorAll(selector).forEach(img=>{
    if(watched.has(img))return;watched.add(img);img.decoding='async';
    function done(){img.classList.remove('media-pending');img.classList.toggle('media-failed',!img.naturalWidth);}
    if(img.complete)done();else{img.classList.add('media-pending');img.addEventListener('load',done,{once:true});img.addEventListener('error',done,{once:true});}
  });}
  watch();new MutationObserver(watch).observe(document.querySelector('main'),{childList:true,subtree:true});
})();
