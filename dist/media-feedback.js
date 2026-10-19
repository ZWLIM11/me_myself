(() => {
  const watched=new WeakSet();
  function watch(){document.querySelectorAll('main img,dialog img,main video,dialog video').forEach(media=>{
    if(watched.has(media))return;watched.add(media);
    const video=media.tagName==='VIDEO';let notice;
    if(!video)media.decoding='async';
    function clear(){media.classList.remove('media-pending','media-failed');notice?.remove();notice=null;}
    function failed(){
      media.classList.remove('media-pending');media.classList.add('media-failed');
      if(notice){notice.querySelector('[role=status]').textContent='Still unavailable. Please try again later.';return;}
      notice=document.createElement('div');notice.className='media-retry';
      const status=document.createElement('span');status.setAttribute('role','status');status.textContent=`This ${video?'video':'image'} couldn’t load.`;
      const retry=document.createElement('button');retry.type='button';retry.textContent='Retry';retry.setAttribute('aria-label',`Retry ${media.alt||'media'}`);
      retry.addEventListener('click',()=>{status.textContent='Trying again…';media.classList.add('media-pending');if(video)media.load();else{const src=media.getAttribute('src');media.removeAttribute('src');media.setAttribute('src',src);}});
      notice.append(status,retry);(media.closest('button,a')||media.closest('.lightbox-stage')||media).after(notice);
    }
    media.addEventListener(video?'loadeddata':'load',clear);media.addEventListener('error',failed);
    if(video)media.querySelectorAll('source').forEach(source=>source.addEventListener('error',failed));
    else if(media.getAttribute('src')){if(media.complete){if(!media.naturalWidth)failed();}else media.classList.add('media-pending');}
  });}
  watch();new MutationObserver(watch).observe(document.body,{childList:true,subtree:true});
})();
