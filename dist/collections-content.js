// Fill these spaces with your own files and verified results when ready.
// Use relative paths such as assets/my-photo.jpg or full HTTPS URLs.
window.PORTFOLIO.instagram = 'https://instagram.com/w_zweii';
window.PORTFOLIO.photography = [
  {id:'city', category:'City', title:'City stories', location:'', src:'', alt:'', caption:''},
  {id:'nature', category:'Nature', title:'A quieter perspective', location:'', src:'', alt:'', caption:''},
  {id:'food', category:'Food', title:'Around the table', location:'', src:'', alt:'', caption:''},
  {id:'street', category:'Street', title:'Between destinations', location:'', src:'', alt:'', caption:''},
  {id:'travel', category:'Travel', title:'Somewhere new', location:'', src:'', alt:'', caption:''}
];
window.PORTFOLIO.skills = [
  {name:'Python',icon:'Py',projects:['food','streaming'],description:'Explore Python across recommendation and data-processing projects.'},
  {name:'SQL',icon:'▤',projects:[],description:'A space for a SQL case study, queries, and a database walkthrough.'},
  {name:'Machine Learning',icon:'◇',projects:['food'],description:'Explore personalized recommendations and learning from preferences.'},
  {name:'Deep Learning',icon:'⌘',projects:[],description:'A space for a model walkthrough, experiments, and evaluation results.'},
  {name:'NLP',icon:'文',projects:['interview'],description:'Explore the language-processing workflow in RecruitView.'},
  {name:'Data Analysis',icon:'▥',projects:['food','streaming'],description:'Explore how data informs recommendations and environmental analysis.'},
  {name:'Big Data',icon:'⌗',projects:['streaming'],description:'Explore Kafka, PySpark, and distributed data processing.'},
  {name:'Web / App',icon:'</>',projects:[],description:'You’re exploring this portfolio: responsive layouts, interactive galleries, and accessible browser interactions.'}
];
window.PORTFOLIO.caseStudies = Object.fromEntries(['food','interview','streaming'].map(id => [id, {
  previewVideoUrl:'', videoUrl:'', videoPoster:'', demoUrl:'', screenshots:[],
  role:'', approach:'', results:'', lessons:''
}]));
// screenshots: [{src:'assets/project-screen.jpg', alt:'Describe the screen', caption:'Optional caption'}]
// videoUrl accepts a direct browser-playable video file. Use demoUrl for a hosted demo or video page.
// previewVideoUrl: short, muted MP4/WebM clip for project-card previews (loaded only on interaction).
