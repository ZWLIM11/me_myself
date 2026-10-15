(() => {
  const email=window.PORTFOLIO.email.trim();
  const options=document.createElement('div');options.className='email-options';
  const address=document.createElement('a');address.href='mailto:'+email;address.textContent=email;address.title='Open in your email app';
  const copy=document.createElement('button');copy.type='button';copy.textContent='Copy email';
  const status=document.createElement('span');status.setAttribute('role','status');
  const hint=document.createElement('small');hint.textContent='Email opens Gmail in a new tab. You can also copy my address or open it in your email app.';
  copy.addEventListener('click',async()=>{
    try{await navigator.clipboard.writeText(email);status.textContent='Email copied.';}
    catch{status.textContent='Select the address above to copy it.';const range=document.createRange();range.selectNodeContents(address);const selection=window.getSelection();selection.removeAllRanges();selection.addRange(range);}
  });
  options.append(address,copy,status,hint);document.querySelector('.contact-links').after(options);
})();
