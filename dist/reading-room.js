(() => {
  const book=document.querySelector('.reading-book'),dialog=document.querySelector('#book-dialog');
  book.addEventListener('click',()=>dialog.showModal());
  dialog.querySelector('.close-dialog').addEventListener('click',()=>dialog.close());
  dialog.addEventListener('close',()=>book.focus({preventScroll:true}));
  dialog.addEventListener('click',e=>{const r=dialog.getBoundingClientRect();if(e.target===dialog&&(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom))dialog.close();});
  document.addEventListener('portfolio:pagechange',()=>{if(dialog.open)dialog.close();});
  function groupUtilities(){
  const header=document.querySelector('.header'),resume=header.querySelector('.resume-button'),theme=header.querySelector('.theme-toggle');
  const actions=document.createElement('div');actions.className='header-utilities';actions.setAttribute('role','group');actions.setAttribute('aria-label','Résumé and appearance');header.append(actions);actions.append(resume);if(theme)actions.append(theme);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',groupUtilities);else groupUtilities();
  const launcher=document.querySelector('.byte-context-launch');launcher.setAttribute('aria-label','Chat with Byte, your portfolio guide');
  const chat=document.querySelector('#byte-chat');
  const refresh=()=>{launcher.hidden=!!document.querySelector('dialog[open]');};
  new MutationObserver(refresh).observe(document.body,{subtree:true,attributes:true,attributeFilter:['open']});
  chat.addEventListener('close',refresh);
})();
