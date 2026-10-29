// Game titles verified against the supplied homepages. Add optional rulesUrl when available.
window.BOARD_GAMES = [
  {title:'Monopoly Deal',edition:'The Deal Club',category:'CARD TABLE',mark:'◇',color:'#6d3c3c',description:'Open The Deal Club and bring Monopoly Deal to the table.',url:'https://monopoly-deal.limziwei2004.workers.dev/'},
  {title:"The Liar’s Table",edition:'Enter the saloon',category:'BLUFF & PLAY',mark:'♠',color:'#31574d',description:'Step into The Liar’s Table. Pick up the box to open the saloon.',url:'https://liar-bar-online.limziwei2004.workers.dev/'},
  {title:'Arcane Chess',edition:'Battle of the Realms',category:'CHESS',mark:'♜',color:'#3e486d',description:'A cinematic 3D chess game with four AI levels, local play, and online rooms.',url:'https://chess-online.limziwei2004.workers.dev/'},
  {title:'Hex & Holsters',edition:'Saloon Table · BANG!',category:'SALOON TABLE',mark:'✦',color:'#725331',description:'Take a seat at the Hex & Holsters saloon table.',url:'https://bang-online.limziwei2004.workers.dev/'},
  {title:'Fortune Routes',edition:'财富之路',category:'GAME NIGHT',mark:'⌘',color:'#574668',description:'Explore Fortune Routes · 财富之路. Your next game starts here.',url:'https://fortune-routes.pages.dev/'}
];

// Verified against each game's own homepage, 29 October 2026.
const boardDetails=[
 ['2–5 players · bots or friends','Collect three complete property sets before your rivals. Build your bank, manage your properties, and use action cards to change the table.','Enter your name, then choose bots, host a table, or join friends. The tutorial explains each move.'],
 ['2–4 players · AI or private rooms','Choose a ruleset for a saloon game built around bluffing and challenges. Decide when to trust a claim and when to call it out.','Use the one-minute tutorial, then choose a solo AI table or create a private online room.'],
 ['Solo vs AI · 2 players locally or online','Protect your king and work toward checkmate on a cinematic chess board. Choose from four AI difficulty levels or face a friend.','Choose Against the Oracle, a Local Duel, or an Online Battle with a room code.'],
 ['Solo vs AI or invite friends','A card-based saloon showdown with private hands and hidden roles. Select a card and a target; opponents can respond before an attack resolves.','Enter your name and choose a game mode, then create or join a table. Follow the next-action prompt during play.'],
 ['2–4 players · shared tabletop','Buy properties, build, trade, and manage your wealth on a Malaysia-themed board. Choose classic play or a victory target such as time, rounds, or wealth.','Set the player count and victory mode, choose pieces, and start. Roll on your turn; inspect tiles before buying or trading.']
];
window.BOARD_GAMES.forEach((game,i)=>{[game.players,game.description,game.howToStart]=boardDetails[i];});
