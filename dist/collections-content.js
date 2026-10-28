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
// Editorial summaries based on the portfolio's documented features; no measured outcomes claimed.
Object.assign(window.PORTFOLIO.caseStudies.interview, {
 problem:'Interview responses can be difficult to review consistently when the useful evidence is buried in a long recording.',
 role:'Developing an interview-assessment project around speech-to-text and language-based review, with attention to how responses are presented for inspection.',
 approach:'Connect transcription, language-based feature extraction, and an assessment workflow so that a response can be examined in stages.',
 results:'Explore the live app and its workflow. This portfolio does not yet include accuracy benchmarks or an independent evaluation.',
 lessons:'An assessment is more useful when a reviewer can inspect the evidence behind it. Automated feedback needs clear limits and human judgment.'
});
Object.assign(window.PORTFOLIO.caseStudies.ripple, {
 problem:'A passing lane can look open until a small change in a defender’s position changes the decision.',
 role:'Shaping an interactive football tactics tool and refining how visitors move players, explore passing options, and understand the feedback.',
 approach:'Use an interactive pitch to connect player positions, orientation, and passing-foot choices with inspectable passing recommendations.',
 results:'Move a defender into a passing lane in the live app, then compare the recommendation. This is an exploratory simulation, not a validated match predictor.',
 lessons:'A recommendation becomes easier to understand when the visitor can change an input and see why the output changes.'
});
Object.assign(window.PORTFOLIO.caseStudies['makan-mana'], {
 problem:'Finding somewhere to eat and planning how to get there often means switching between lists, maps, reviews, and notes.',
 role:'Shaping the food-discovery and trip-planning flow, including distance groups, independent load-more controls, saved places, and phone-friendly browsing.',
 approach:'Connect nearby venue data with maps and itinerary planning. Link to reviews, menus, prices, and hours when those details are not available directly.',
 results:'Find a meal within a chosen radius, explore a distance group, and add a stop to a trip. Data coverage varies; external links help visitors verify details.',
 lessons:'Useful filters must reflect the data available. Clear distance groups and honest links to missing information are more helpful than controls that cannot deliver.'
});
