const SESSIONS = {
  solo: {
    id:'solo', label:'NUR ICH', title:'Keeper Ready', subtitle:'Bewegen. Stoppen. Bereit sein.', icon:'↔', equipment:'Kein Material', minutes:10,
    promise:'Du trainierst die drei Grundlagen vor fast jeder Parade: Grundstellung, kurze Fussarbeit und kontrolliertes Landen.',
    takeaway:'Bereit ist schneller als hektisch.',
    exercises:[
      {
        title:'READY!', subtitle:'Finde deine Grundstellung auf ein Signal.', visual:'ready', rounds:3, work:30, rest:15,
        steps:['Stell dich locker hin.','Beim Signal sofort in die Grundstellung.','Halte die Position zwei Sekunden.','Dann wieder locker und neu bereit.'],
        cues:['Füsse etwa schulterbreit.','Knie weich. Gewicht leicht nach vorne.','Hände vor dem Körper. Locker bleiben.'],
        why:'Deine Grundstellung ist der Start für jede Parade.', audio:'ready'
      },
      {
        title:'MOVE & SET', subtitle:'Die App sagt dir, wohin du dich bewegst.', visual:'move', rounds:4, work:30, rest:15,
        steps:['Starte in Grundstellung.','Bei LINKS oder RECHTS zwei kleine Seitwärtsschritte.','Bei STOPP sofort ruhig in Grundstellung.','Warte auf das nächste Kommando.'],
        cues:['Füsse nicht kreuzen.','Kleine, schnelle Schritte.','Vor jeder neuen Aktion wieder stabil stehen.'],
        why:'Schnell bewegen ist gut. Im richtigen Moment stoppen ist besser.', audio:'directions'
      },
      {
        title:'SPRING · LAND · READY', subtitle:'Nach jeder Landung sofort wieder Torhüter sein.', visual:'jump', rounds:3, work:35, rest:20,
        steps:['Starte in Grundstellung.','Spring klein und explosiv nach oben.','Lande weich auf beiden Füssen.','Finde sofort wieder deine Grundstellung.'],
        cues:['Nicht maximal hoch springen.','Leise und stabil landen.','Knie über den Füssen. Sofort wieder bereit.'],
        why:'Nicht die Sprunghöhe entscheidet. Wichtig ist, wie schnell du nach der Landung wieder bereit bist.', audio:'beep'
      }
    ]
  },
  tennis: {
    id:'tennis', label:'TENNISBALL', title:'Augen an', subtitle:'Sehen. Bewegen. Sichern.', icon:'●', equipment:'1 Tennisball', minutes:10,
    promise:'Der Tennisball macht die Flugbahn kleiner und schneller. Du trainierst Reaktion, Orientierung und den ersten Schritt zum Ball.',
    takeaway:'Nicht nur greifen. Geh mit deinem Körper zum Ball.',
    exercises:[
      {
        title:'DROP', subtitle:'Schnell sehen. Körper zum Ball.', visual:'drop', rounds:3, work:35, rest:20,
        steps:['Halte den Tennisball auf Schulterhöhe.','Lass ihn seitlich vor dir fallen.','Er darf einmal aufspringen.','Fang ihn vor dem zweiten Bodenkontakt.'],
        cues:['5 Versuche links, dann rechts.','Blick bleibt am Ball.','Erster Schritt zum Ball. Nicht nur mit der Hand greifen.'],
        why:'Du trainierst, eine kurze Flugbahn früh zu sehen und deinen Körper zum Ball zu bringen.', audio:'beep'
      },
      {
        title:'HOCH & HIN', subtitle:'Wirf. Bewege dich. Komm unter den Ball.', visual:'high', rounds:3, work:40, rest:20,
        steps:['Wirf den Ball selbst etwas nach links oder rechts hoch.','Mach sofort kleine Schritte zum Ball.','Komm stabil unter den Ball.','Fang ihn mit beiden Händen und werde wieder READY.'],
        cues:['Nicht stehen und warten.','Flugbahn anschauen.','Unter dem Ball stabil werden.'],
        why:'Gute hohe Bälle beginnen mit Flugbahn lesen und sauberer Fussarbeit.', audio:'beep'
      },
      {
        title:'CRAZY BOUNCE', subtitle:'Du weisst nicht genau, wohin er springt.', visual:'bounce', rounds:3, work:40, rest:20,
        steps:['Wirf den Tennisball schräg vor dir auf den Boden.','Lass den Aufprall bewusst etwas unberechenbar sein.','Reagiere erst nach dem Aufsprung.','Geh zum Ball und sichere ihn.'],
        cues:['Sicherer, ebener Untergrund.','Nicht vorher raten.','Erster Schritt schnell. Danach ruhig sichern.'],
        why:'Der Aufprall verändert die Flugbahn. Du musst neu sehen und neu handeln.', audio:'beep'
      }
    ]
  }
};

const app = document.querySelector('#app');
let state={screen:'home',session:null,exercise:0,timer:null,audio:true};
let interval=null, commandTimeout=null, synthVoice=null, audioCtx=null;

function keeperSVG(pose='ready'){
  const jump = pose==='jump';
  const leanL = pose==='left';
  const leanR = pose==='right';
  const tx = leanL?-22:leanR?22:0;
  const ty = jump?-28:0;
  return `<svg class="keeper-svg" viewBox="0 0 420 520" role="img" aria-label="Illustrierter Torhüter in Grundstellung">
    <g transform="translate(${tx} ${ty})">
      <ellipse cx="210" cy="486" rx="105" ry="18" fill="rgba(0,0,0,.35)"/>
      <path class="skin stroke" d="M183 91c0-32 54-32 54 0v29c0 20-11 34-27 34s-27-14-27-34z"/>
      <path class="hair stroke" d="M179 94c4-40 63-48 68-5-8-15-24-22-43-17-11 3-18 10-25 22z"/>
      <path class="jersey stroke" d="M145 159c24-16 106-16 130 0l25 126-42 18-13-70-4 112h-62l-4-112-13 70-42-18z"/>
      <rect class="stripe" x="173" y="151" width="18" height="166" rx="4"/><rect class="stripe" x="210" y="148" width="18" height="169" rx="4"/><rect class="stripe" x="247" y="153" width="15" height="153" rx="4"/>
      <text class="k10" x="198" y="200">K10</text>
      <path class="skin stroke" d="M145 170l-56 76 30 20 51-56z"/><path class="skin stroke" d="M275 170l56 76-30 20-51-56z"/>
      <path class="glove" d="M82 242l37 5 9 26-16 24-35-22z"/><path class="glove" d="M338 242l-37 5-9 26 16 24 35-22z"/>
      <path class="dark stroke" d="M175 310h70l27 68-46 16-16-48-16 48-46-16z"/>
      <path class="skin stroke" d="M177 374l36 7-26 78-35-7z"/><path class="skin stroke" d="M243 374l-36 7 26 78 35-7z"/>
      <path class="sock stroke" d="M151 443l37 7-3 48-43-6z"/><path class="sock stroke" d="M269 443l-37 7 3 48 43-6z"/>
      <path class="boot stroke" d="M142 486l43 4 16 20h-69z"/><path class="boot stroke" d="M278 486l-43 4-16 20h69z"/>
    </g>
  </svg>`;
}

function tennisBall(){
  return `<div class="tennis-ball" aria-hidden="true"></div>`;
}

function visual(type, active=false, cue=''){
  let pose='ready', arrows='';
  if(type==='jump') pose='jump';
  if(type==='move') arrows='<div class="motion-arrow left">←</div><div class="motion-arrow right">→</div>';
  const ball = ['drop','high','bounce'].includes(type) ? tennisBall() : '';
  return `<div class="session-visual visual-${type}">
    <div class="flood"></div><div class="pitch"></div>
    ${arrows}
    <div class="session-figure-wrap">${keeperSVG(pose)}</div>
    ${ball}
    <div class="motion-path"></div>
    <div class="visual-caption">${visualCaption(type)}</div>
  </div>`;
}
function visualCaption(type){
  return ({ready:'Signal → READY',move:'Kleine Schritte → STOPP',jump:'Spring → lande → READY',drop:'1 Aufsprung → sichern',high:'Wirf → bewegen → fangen',bounce:'Aufprall sehen → reagieren'})[type]||'';
}

function shell(content){return `<div class="shell"><div class="wrap"><header class="topbar"><div class="brand">KEEPER <span>10</span></div><div class="top-tools"><button class="round-btn" id="audioBtn" aria-label="Ton ein oder aus">${state.audio?'🔊':'🔇'}</button></div></header>${content}</div></div>`}

function home(){
  app.innerHTML=shell(`<section class="page">
    <div class="card paper hero">
      <span class="eyebrow">10 MINUTEN · TORHÜTER</span>
      <h1>Du kannst jetzt anfangen.</h1>
      <p>Wähle nur das, was du gerade zur Hand hast. KEEPER 10 baut daraus dein Training.</p>
      <div class="hero-meta"><span class="meta">⏱ 10 Minuten</span><span class="meta">3 Aufgaben</span><span class="meta">10–14 Jahre</span></div>
    </div>
    <section class="section"><p class="section-label">Was hast du heute?</p>
      <div class="setup-grid">
        ${setupCard('solo','↔','NUR ICH','Kein Ball. Kein Material. Zwei Meter Platz reichen.','Sofort startklar')}
        ${setupCard('tennis','●','TENNISBALL','Ein Tennisball. Sonst nichts. Reaktion und Flugbahn.','1 Hilfsmittel')}
      </div>
      <div class="note"><strong>Die Idee:</strong> Kein Wochenplan, den du verpassen kannst. Du trainierst die Situation, die heute möglich ist.</div>
    </section>
  </section>`);
  bindGlobal();
  document.querySelectorAll('[data-session]').forEach(b=>b.onclick=()=>openSession(b.dataset.session));
}
function setupCard(id,icon,title,text,foot){return `<button class="setup-card" data-session="${id}"><span class="arrow">→</span><div class="setup-icon">${icon}</div><h2>${title}</h2><p>${text}</p><div class="setup-foot"><strong>10 MIN</strong><span>·</span><span>3 Aufgaben</span><span>·</span><span>${foot}</span></div></button>`}

function openSession(id){state.session=id;state.exercise=0;state.screen='intro';render();}
function sessionIntro(){const s=SESSIONS[state.session];app.innerHTML=shell(`<section class="page">
  <button class="back" id="backBtn">← Zur Auswahl</button>
  <div class="session-intro-grid card">
    <div class="content-card paper">
      <span class="eyebrow">${s.label} · START</span>
      <h1>${s.title}</h1><p class="sub">${s.subtitle}</p>
      <div class="hero-meta"><span class="meta">⏱ ${s.minutes} Minuten</span><span class="meta">☰ 3 Aufgaben</span><span class="meta">${s.equipment}</span></div>
      <div class="why"><strong>Heute lernst du:</strong><br>${s.promise}</div>
      <button class="primary" id="startSession">Training starten <span>→</span></button>
    </div>
    ${visual(s.exercises[0].visual)}
  </div>
</section>`);bindGlobal();document.querySelector('#backBtn').onclick=home;document.querySelector('#startSession').onclick=()=>{state.screen='exercise';render()}}

function exerciseScreen(){const s=SESSIONS[state.session],e=s.exercises[state.exercise];app.innerHTML=shell(`<section class="page">
  <div class="exercise-top"><button class="back" id="backBtn">← Session</button><span class="exercise-count">Aufgabe ${state.exercise+1} von 3</span></div>
  <div class="card">${visual(e.visual)}
    <div class="content-card paper"><span class="eyebrow">${s.label} · ${e.rounds} × ${e.work} SEK.</span><h1>${state.exercise+1} · ${e.title}</h1><p class="sub">${e.subtitle}</p>
      <div class="info-grid">
        <div class="info-box"><h3>So geht’s</h3><ol class="steps">${e.steps.map((x,i)=>`<li><span class="badge-num">${i+1}</span><span>${x}</span></li>`).join('')}</ol></div>
        <div class="info-box"><h3>Achte darauf</h3><ul class="cues">${e.cues.map(x=>`<li><span class="cue-dot">✓</span><span>${x}</span></li>`).join('')}</ul></div>
      </div>
      <div class="why"><strong>Warum?</strong> ${e.why}</div>
      <button class="primary" id="timerStart">Timer starten <span>→</span></button>
    </div>
  </div>
</section>`);bindGlobal();document.querySelector('#backBtn').onclick=()=>{state.screen='intro';render()};document.querySelector('#timerStart').onclick=startTimer;}

function startTimer(){
  const e=SESSIONS[state.session].exercises[state.exercise];
  clearTimer();
  state.timer={phase:'work',round:1,remaining:e.work,running:true};
  state.screen='timer';renderTimer();
  unlockAudio();
  playStartSignal(e);
  interval=setInterval(tick,1000);
  if(['directions','ready'].includes(e.audio)) scheduleCommand();
}
function renderTimer(){
  const e=SESSIONS[state.session].exercises[state.exercise],t=state.timer;
  const total=t.phase==='work'?e.work:e.rest; const pct=Math.max(0,Math.min(100,100-(t.remaining/total*100)));
  app.innerHTML=shell(`<section class="page"><div class="timer-panel">
    <div class="exercise-top"><button class="back" id="stopTimer">← Beenden</button><span class="exercise-count">${e.title}</span></div>
    <div class="timer-stage"><span class="timer-mode">${t.phase==='work'?'TRAINING':'PAUSE'}</span><span class="rounds">Runde ${t.round} / ${e.rounds}</span>
      <div class="timer-ring" style="--progress:${pct}%"><span class="timer-number">${t.remaining}</span></div>
      <div class="command"><span id="commandText"></span></div>
    </div>
    <div class="timer-controls"><button class="pause" id="pauseBtn">${t.running?'Pause':'Weiter'}</button><button class="skip" id="skipBtn">${t.phase==='work'?'Runde beenden':'Pause beenden'} →</button></div>
    <p class="audio-note">${e.audio==='directions'?'Die Kommandos kommen zufällig. Ton an: Die App spricht. Ton aus: Das Signal erscheint weiterhin gross auf dem Bildschirm.':e.audio==='ready'?'READY kommt in unregelmässigen Abständen. Stell dich erst beim Signal in deine Grundstellung.':'Ein kurzes Signal markiert Start, Pause und Ende.'}</p>
  </div></section>`);
  bindGlobal();
  document.querySelector('#stopTimer').onclick=()=>{clearTimer();state.screen='exercise';render()};
  document.querySelector('#pauseBtn').onclick=togglePause; document.querySelector('#skipBtn').onclick=advancePhase;
}
function updateTimerUI(){const e=SESSIONS[state.session].exercises[state.exercise],t=state.timer;if(!t)return;const n=document.querySelector('.timer-number');if(n)n.textContent=t.remaining;const r=document.querySelector('.timer-ring');if(r){const total=t.phase==='work'?e.work:e.rest;const pct=100-(t.remaining/total*100);r.style.setProperty('--progress',`${pct}%`)} }
function tick(){if(!state.timer?.running)return;state.timer.remaining--;updateTimerUI();if(state.timer.remaining<=0)advancePhase();}
function advancePhase(){const e=SESSIONS[state.session].exercises[state.exercise],t=state.timer;if(!t)return;clearCommand();if(t.phase==='work'){
    if(t.round>=e.rounds){finishExercise();return}
    t.phase='rest';t.remaining=e.rest;beep(520,.13);speak('Pause');
  }else{t.phase='work';t.round++;t.remaining=e.work;beep(760,.13);speak('Los');if(['directions','ready'].includes(e.audio))scheduleCommand();}
  renderTimer();
}
function togglePause(){state.timer.running=!state.timer.running;if(!state.timer.running)clearCommand();else if(['directions','ready'].includes(SESSIONS[state.session].exercises[state.exercise].audio)&&state.timer.phase==='work')scheduleCommand();renderTimer();}
function finishExercise(){clearTimer();beep(880,.18);const s=SESSIONS[state.session];if(state.exercise<s.exercises.length-1){state.exercise++;state.screen='exercise';render()}else{state.screen='finish';render()}}
function clearTimer(){if(interval)clearInterval(interval);interval=null;clearCommand();}
function clearCommand(){if(commandTimeout)clearTimeout(commandTimeout);commandTimeout=null;}

function scheduleCommand(){clearCommand();const e=SESSIONS[state.session].exercises[state.exercise];if(!state.timer?.running||state.timer.phase!=='work'||!['directions','ready'].includes(e.audio))return;const delay=e.audio==='ready'?(2600+Math.random()*1600):(1200+Math.random()*1200);commandTimeout=setTimeout(()=>{const cmd=e.audio==='ready'?'READY':['LINKS','RECHTS','STOPP'][Math.floor(Math.random()*3)];showCommand(cmd);if(state.audio)speak(cmd.toLowerCase());scheduleCommand();},delay)}
function showCommand(cmd){const el=document.querySelector('#commandText');if(!el)return;el.textContent=cmd;el.classList.add('show');setTimeout(()=>el.classList.remove('show'),700)}
function playStartSignal(e){beep(760,.14);if(state.audio){if(e.audio==='directions')speak('Los');else if(e.audio==='ready')speak('Ready');else speak('Los')}}

function unlockAudio(){try{const A=window.AudioContext||window.webkitAudioContext;if(!audioCtx&&A)audioCtx=new A();if(audioCtx?.state==='suspended')audioCtx.resume()}catch(e){}}
function beep(freq=700,dur=.12){if(!state.audio)return;try{unlockAudio();if(!audioCtx)return;const o=audioCtx.createOscillator(),g=audioCtx.createGain();o.frequency.value=freq;o.type='sine';g.gain.setValueAtTime(.0001,audioCtx.currentTime);g.gain.exponentialRampToValueAtTime(.18,audioCtx.currentTime+.015);g.gain.exponentialRampToValueAtTime(.0001,audioCtx.currentTime+dur);o.connect(g);g.connect(audioCtx.destination);o.start();o.stop(audioCtx.currentTime+dur+.02);}catch(e){}}
function speak(text){if(!state.audio||!('speechSynthesis'in window))return;try{speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(text);u.lang='de-CH';u.rate=.95;u.pitch=.9;u.volume=.9;if(synthVoice)u.voice=synthVoice;speechSynthesis.speak(u);}catch(e){}}
function initVoice(){if(!('speechSynthesis'in window))return;const pick=()=>{const v=speechSynthesis.getVoices();synthVoice=v.find(x=>x.lang.toLowerCase().startsWith('de-ch'))||v.find(x=>x.lang.toLowerCase().startsWith('de'))||null};pick();speechSynthesis.onvoiceschanged=pick;}

function finish(){const s=SESSIONS[state.session];app.innerHTML=shell(`<section class="page finish"><div class="finish-icon">✓</div><h1>Stark.<br>Das war’s.</h1><p>${s.takeaway}</p><div class="checks"><div class="check"><span>✓</span><span>3 Aufgaben abgeschlossen</span></div><div class="check"><span>✓</span><span>${s.equipment}</span></div><div class="check"><span>✓</span><span>Kein Punktesammeln. Nur besser trainieren.</span></div></div><button class="primary" id="again">Noch einmal</button><button class="secondary" id="homeBtn">Andere Session wählen</button></section>`);bindGlobal();document.querySelector('#again').onclick=()=>openSession(state.session);document.querySelector('#homeBtn').onclick=home;}

function bindGlobal(){const b=document.querySelector('#audioBtn');if(b)b.onclick=()=>{state.audio=!state.audio;if(!state.audio){try{speechSynthesis.cancel()}catch(e){}}render()}}
function render(){if(state.screen==='home')home();else if(state.screen==='intro')sessionIntro();else if(state.screen==='exercise')exerciseScreen();else if(state.screen==='timer')renderTimer();else finish();}

// Visual tennis-ball animation CSS hook
const style=document.createElement('style');style.textContent=`
.tennis-ball{position:absolute;width:28px;height:28px;border-radius:50%;background:#d7ff2b;box-shadow:0 0 0 2px rgba(255,255,255,.2),0 0 24px rgba(215,255,43,.32);left:54%;bottom:130px;z-index:5}
.tennis-ball:after{content:"";position:absolute;inset:5px;border:2px solid rgba(255,255,255,.72);border-left-color:transparent;border-right-color:transparent;border-radius:50%;transform:rotate(28deg)}
.visual-drop .tennis-ball{animation:dropball 1.8s ease-in-out infinite}.visual-high .tennis-ball{animation:highball 2.2s ease-in-out infinite}.visual-bounce .tennis-ball{animation:bounceball 2s cubic-bezier(.4,0,.2,1) infinite}
.motion-path{position:absolute;border:2px dashed rgba(255,197,20,.7);border-left:0;border-bottom:0;border-radius:50%;opacity:0}
.visual-high .motion-path{opacity:1;width:180px;height:120px;left:48%;bottom:115px;transform:translateX(-50%) rotate(-18deg)}
.visual-bounce .motion-path{opacity:1;width:180px;height:75px;left:47%;bottom:92px;transform:translateX(-50%) rotate(18deg)}
@keyframes dropball{0%,15%{transform:translate(34px,-135px)}50%{transform:translate(-55px,70px)}65%{transform:translate(-35px,20px)}100%{transform:translate(0,0)}}
@keyframes highball{0%{transform:translate(-10px,10px)}45%{transform:translate(-95px,-130px)}100%{transform:translate(-42px,0)}}
@keyframes bounceball{0%{transform:translate(30px,-60px)}48%{transform:translate(-48px,58px) scale(.92)}62%{transform:translate(-80px,-20px)}100%{transform:translate(-25px,0)}}
.visual-jump .keeper-svg{animation:keeperjump 1.8s ease-in-out infinite}.visual-move .keeper-svg{animation:keepermove 2.3s ease-in-out infinite}.visual-ready .keeper-svg{animation:keeperset 2.1s ease-in-out infinite}
@keyframes keeperjump{0%,20%,100%{transform:translateY(0)}50%{transform:translateY(-24px)}65%{transform:translateY(0)}}
@keyframes keepermove{0%,100%{transform:translateX(0)}30%{transform:translateX(-26px)}55%{transform:translateX(0)}80%{transform:translateX(26px)}}
@keyframes keeperset{0%,25%,100%{transform:scale(1)}50%,75%{transform:scale(.98) translateY(4px)}}
`;document.head.appendChild(style);

initVoice();home();
if('serviceWorker'in navigator){window.addEventListener('load',()=>navigator.serviceWorker.register('./service-worker.js').catch(()=>{}));}
