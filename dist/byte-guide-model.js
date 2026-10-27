(() => {
  const answers = [
    {match:/\b(ripple|football|soccer|passing|tactic)\b/i,text:'Ripple explores football passing decisions. Try moving a defender into a passing lane and see how the recommendations change.',label:'Explore Ripple',href:'/projects/ripple/'},
    {match:/\b(makan|jalan|food|restaurant|meal|trip|travel)\b/i,text:'Makan Mana helps you discover nearby food and plan trips. Try finding a meal stop and adding it to a day of your itinerary.',label:'Explore Makan Mana',href:'/projects/makan-mana/'},
    {match:/\b(interview|recruitview|recruit|nlp)\b/i,text:'RecruitView explores speech-to-text and language-based interview assessment. Open its project page to learn more or try the live app.',label:'Explore RecruitView',href:'/projects/interview/'},
    {match:/\b(photo|photos|photography|picture|pictures|gallery|camera)\b/i,text:'Photography is Ziwei’s space for moments outside the screen. The collection is still being prepared. When photos and notes are added, hover or tap “Read note” to see their stories.',label:'Visit photography',href:'#photography'},
    {match:/\b(resume|résumé|cv)\b/i,text:'Ziwei’s full résumé has not been added yet. You can find his education on About or contact him to ask for it.',label:'Contact Ziwei',href:'#contact'},
    {match:/\b(contact|email|gmail|hire|hiring|internship|collaborat\w*|jobstreet|reach)\b/i,text:'Ziwei welcomes meaningful collaborations and interesting projects. The Contact page has Gmail, JobStreet, GitHub, Instagram, and a copy-email button.',label:'Let’s connect',href:'#contact'},
    {match:/\b(about|ziwei|who|education|student|skills?|tools?|python|sql|learn|interests?)\b/i,text:'Lim Ziwei is a Data Science student at TAR UMT in Malaysia. His interests include building useful tools, football, photography, games, and exploring new places.',label:'Meet Ziwei',href:'#about'},
    {match:/\b(projects?|work|builds?|demo|apps?|challenge)\b/i,text:'There are three projects to explore: RecruitView, Ripple, and Makan Mana. Click a cover to see its details, a small challenge, and the live-app link.',label:'Explore the projects',href:'#projects'},
    {match:/\b(home|start|beginning)\b/i,text:'Back to the introduction—a little curiosity is a good place to start.',label:'Go home',href:'#home'},
    {match:/\b(hi|hello|hey|byte|help)\b/i,text:'Hi, I’m Byte. I can help you explore Ziwei’s projects, interests, photography, and contact details. What catches your eye?',label:'Browse projects',href:'#projects'}
  ];
  window.getByteReply = input => {
    const text=String(input||'').trim().slice(0,300);
    if(/\b(photos?|pictures?|photography)\b/i.test(text)&&/\b(travel|food)\b/i.test(text))return {...answers[3]};
    const result=answers.find(answer=>answer.match.test(text));
    return result?{text:result.text,label:result.label,href:result.href}:{text:'I’m a local portfolio guide, so I can only answer questions about this site. Try “Show me Ripple”, “What does Ziwei study?”, or “How can I contact him?”',label:'Explore projects',href:'#projects'};
  };
})();
