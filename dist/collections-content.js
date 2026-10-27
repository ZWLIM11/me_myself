// Fill these spaces with your own files and verified results when ready.
// Use relative paths such as assets/my-photo.jpg or full HTTPS URLs.
window.PORTFOLIO.instagram = 'https://instagram.com/w_zweii';
window.PORTFOLIO.photography = [
  {id:'city', category:'City', title:'City stories', location:'', src:'', alt:'', caption:'', note:''},
  {id:'nature', category:'Nature', title:'A quieter perspective', location:'', src:'', alt:'', caption:'', note:''},
  {id:'food', category:'Food', title:'Around the table', location:'', src:'', alt:'', caption:'', note:''},
  {id:'street', category:'Street', title:'Between destinations', location:'', src:'', alt:'', caption:'', note:''},
  {id:'travel', category:'Travel', title:'Somewhere new', location:'', src:'', alt:'', caption:'', note:''}
];
window.PORTFOLIO.skills = [
  {name:'Python',icon:'Py',projects:[],description:'Python for data exploration and building useful tools.'},
  {name:'SQL',icon:'▤',projects:[],description:'A space for a SQL case study, queries, and a database walkthrough.'},
  {name:'Machine Learning',icon:'◇',projects:[],description:'Exploring how models learn patterns from data.'},
  {name:'Deep Learning',icon:'⌘',projects:[],description:'A space for a model walkthrough, experiments, and evaluation results.'},
  {name:'NLP',icon:'文',projects:['interview'],description:'Explore the language-processing workflow in RecruitView.'},
  {name:'Data Analysis',icon:'▥',projects:[],description:'Turning data into meaningful insights.'},
  {name:'Big Data',icon:'⌗',projects:[],description:'Exploring distributed data processing.'},
  {name:'Web / App',icon:'</>',projects:[],description:'You’re exploring this portfolio: responsive layouts, interactive galleries, and accessible browser interactions.'}
];
window.PORTFOLIO.caseStudies = Object.fromEntries(['interview','ripple','makan-mana'].map(id => [id, {
  previewVideoUrl:'', videoUrl:'', videoPoster:'', demoUrl:'', screenshots:[],
  problem:'', role:'', approach:'', results:'', lessons:''
}]));
window.PORTFOLIO.caseStudies.interview.demoUrl = 'https://ai-int.notait.com';
window.PORTFOLIO.caseStudies.ripple.demoUrl = 'https://ripple.limziwei2004.workers.dev/';
window.PORTFOLIO.caseStudies['makan-mana'].demoUrl = 'https://makan-mana.limziwei2004.workers.dev/';
window.PORTFOLIO.skills.find(skill => skill.name === 'Web / App').projects = ['ripple', 'makan-mana'];
window.PORTFOLIO.skills.find(skill => skill.name === 'Web / App').description = 'Explore interactive football analysis, nearby food discovery, and map-based trip planning.';

// Add verified entries here. Empty sections are hidden on the public website.
window.PORTFOLIO.timeline = [
  {kind:'Education', period:'Currently studying', title:'Bachelor of Data Science', organization:'TAR UMT', description:''}
];
// Timeline entry: {kind:'Experience', period:'2026', title:'Role', organization:'Organization', description:'What you did'}
window.PORTFOLIO.credentials = [];
// Credential: {title:'Certificate or achievement', issuer:'Issuer', date:'2026', url:'https://...', image:'assets/certificate.jpg'}
window.PORTFOLIO.photoCollections = [
  {id:'city-life',title:'City & street',description:'Places in motion.',categories:['City','Street']},
  {id:'outdoors',title:'Further afield',description:'Nature and new places.',categories:['Nature','Travel']},
  {id:'everyday',title:'Everyday details',description:'Small moments, closer up.',categories:['Food']}
];
// Collections appear when a matching photo has a src. Set photo.album to a collection id
// for explicit grouping, or use the collection's categories for automatic grouping.
// screenshots: [{src:'assets/project-screen.jpg', alt:'Describe the screen', caption:'Optional caption'}]
// videoUrl accepts a direct browser-playable video file. Use demoUrl for a hosted demo or video page.
// previewVideoUrl: short, muted MP4/WebM clip for project-card previews (loaded only on interaction).

// Photo note: add a short personal memory to note; a hover/tap flip appears once src and note are filled.
const projectStories = {
  interview: {inspiration:'Exploring how language technology can make interview responses easier to review and understand.', challenge:'What could you learn from the way you answer an interview question?'},
  ripple: {inspiration:'Connecting an interest in football with a question: what changes when one player moves into a passing lane?', challenge:'Can you close a passing lane with just one defender?'},
  'makan-mana': {inspiration:'Turning an everyday question—where should we eat?—into a useful way to discover places and plan a day out.', challenge:'Find a nearby meal and build a small trip around it.'}
};
window.PORTFOLIO.projects.forEach(project => Object.assign(project, projectStories[project.id] || {}));
