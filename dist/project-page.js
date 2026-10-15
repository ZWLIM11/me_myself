(() => {
  document.querySelector('#share-project').addEventListener('click',async()=>{
    const link=document.querySelector('link[rel=canonical]').href;
    try{await navigator.clipboard.writeText(link);document.querySelector('#share-status').textContent='Project link copied.';}
    catch{document.querySelector('#share-fallback').hidden=false;document.querySelector('#share-status').textContent='Select the link below to copy it.';}
  });
})();
