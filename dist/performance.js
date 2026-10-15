(() => {
  let timer;
  const settle=()=>{document.documentElement.classList.add('is-resizing');clearTimeout(timer);timer=setTimeout(()=>document.documentElement.classList.remove('is-resizing'),180);};
  addEventListener('resize',settle,{passive:true});
  window.visualViewport?.addEventListener('resize',settle,{passive:true});
})();
