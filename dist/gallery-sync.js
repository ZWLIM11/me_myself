(async () => {
  try{
    const response=await fetch('/api/photography/',{cache:'no-store',signal:AbortSignal.timeout(8000)});
    if(!response.ok)return;
    const {photos}=await response.json();if(!Array.isArray(photos))return;
    const defaults=window.PORTFOLIO.photography;
    window.PORTFOLIO.photography=photos.length?photos:defaults;
    window.refreshPhotography();
  }catch{/* Keep the existing gallery available when storage is not connected. */}
})();
