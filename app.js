const LEVELS = {
  start: {
    label:'START', intro:'Du lernst die Bewegungen sauber und vorhersehbar. Qualität kommt vor Tempo.'
  },
  plus: {
    label:'PLUS', intro:'Die gleichen Grundlagen, aber schneller und mit mehr Variation.'
  },
  spielnah: {
    label:'SPIELNAH', intro:'Die App macht den Ablauf unvorhersehbar. Du musst hören, sehen und im richtigen Moment reagieren.'
  }
};

const EXERCISES = [
  {
    id:'bereit', title:'Bereit!', no:'ÜBUNG 1 VON 3',
    story:'./k10_bereit_ablauf_v6.jpg', video:'./k10_bereit_clip_v6.mp4',
    why:'Deine Grundstellung ist der Start für fast jede Parade. Je sauberer du vor dem Abschluss bereit bist, desto besser kannst du reagieren.',
    variants:{
      start:{
        desc:'Vom lockeren Stand sofort in eine stabile Grundstellung.',
        steps:['Locker und aufrecht stehen.','Auf BEREIT reagieren.','Füsse etwa schulterbreit setzen.','2 Sekunden stabil bleiben, dann wieder locker.'],
        focus:['Knie weich, nicht tief sitzen.','Gewicht auf dem Vorderfuss, nicht auf den Fersen.','Hände vor dem Körper bereit.','Oberkörper ruhig und offen.'],
        mode:'interval', work:30, rest:20, rounds:3, commands:'readyStart',
        hint:'Bleib locker. Wenn BEREIT kommt, setzt du dich sofort sauber in deine Grundstellung.'
      },
      plus:{
        desc:'Erst bewegen, dann im richtigen Moment bereit sein.',
        steps:['Auf LINKS oder RECHTS einen kleinen Seitwärtsschritt machen.','Weiter locker bleiben.','Bei BEREIT sofort stoppen.','Grundstellung kurz halten und neu starten.'],
        focus:['Nur kleine Bewegungen.','Füsse nicht kreuzen.','Beim Signal beide Füsse stabil am Boden.','Nicht nachwippen.'],
        mode:'interval', work:30, rest:20, rounds:3, commands:'readyPlus',
        hint:'Die App bewegt dich kurz. Bei BEREIT musst du sofort stabil stehen.'
      },
      spielnah:{
        desc:'Bewege dich mit und sei genau beim gedachten Abschluss bereit.',
        steps:['Auf LINKS und RECHTS mit kleinen Schritten reagieren.','Die Richtung kann wechseln.','Bei SCHUSS sofort stoppen.','In der Grundstellung bleiben, bis die nächste Folge startet.'],
        focus:['Nicht raten. Erst Signal, dann Bewegung.','Kleine Schritte behalten.','Bei SCHUSS keine Füsse mehr in der Luft.','Kopf und Oberkörper ruhig.'],
        mode:'interval', work:30, rest:20, rounds:3, commands:'readyGame',
        hint:'Stell dir vor, der Ball wird vor deinem Tor verschoben. Bei SCHUSS musst du bereit sein.'
      }
    }
  },
  {
    id:'schritte', title:'Schritte & Stopp', no:'ÜBUNG 2 VON 3',
    story:'./k10_schritte_ablauf_v6.jpg', video:'./k10_schritte_clip_v6.mp4',
    why:'Ein Torhüter muss sich schnell verschieben können und trotzdem vor dem Abschluss wieder stabil stehen. Schnelligkeit ohne Kontrolle hilft dir wenig.',
    variants:{
      start:{
        desc:'Kleine Seitwärtsschritte in einem klaren Rhythmus.',
        steps:['LINKS: zwei kleine Seitwärtsschritte.','STOPP: sofort Grundstellung.','RECHTS: zwei kleine Seitwärtsschritte.','STOPP: wieder stabil stehen.'],
        focus:['Füsse nie kreuzen.','Schritte kurz und bodennah.','Oberkörper bleibt ruhig.','Beim Stopp sofort bereit.'],
        mode:'interval', work:30, rest:20, rounds:3, commands:'stepsStart',
        hint:'Der Rhythmus ist vorhersehbar. Nutze ihn, um deine Fussarbeit sauber zu machen.'
      },
      plus:{
        desc:'Die Richtung kommt zufällig. Du musst schneller umstellen.',
        steps:['Auf LINKS oder RECHTS sofort reagieren.','Zwei kurze Seitwärtsschritte.','Bei STOPP direkt anhalten.','Neu aus der Grundstellung starten.'],
        focus:['Erster Schritt in die richtige Richtung.','Nicht zu grosse Schritte.','Füsse bleiben unter dem Körper.','Stopp heisst wirklich Stopp.'],
        mode:'interval', work:30, rest:20, rounds:4, commands:'stepsPlus',
        hint:'Du kennst die nächste Richtung nicht. Reagiere erst auf das Signal.'
      },
      spielnah:{
        desc:'Mehrere Richtungswechsel. Der Abschluss kommt irgendwann.',
        steps:['Folge LINKS und RECHTS mit kurzen Schritten.','Die App kann die Richtung direkt wechseln.','Bei SCHUSS sofort stoppen.','Grundstellung halten und wieder neu beginnen.'],
        focus:['Nie hektisch kreuzen.','Vor jedem Richtungswechsel Körper kontrollieren.','Bei SCHUSS beide Füsse am Boden.','Qualität behalten, auch wenn es schneller wird.'],
        mode:'interval', work:30, rest:20, rounds:4, commands:'stepsGame',
        hint:'Stell dir vor, der Ball wird vor deinem Tor von links nach rechts gespielt. Bei SCHUSS musst du stehen und bereit sein.'
      }
    }
  },
  {
    id:'spring', title:'Spring · Land · Bereit', no:'ÜBUNG 3 VON 3',
    story:'./k10_spring_ablauf_v6.jpg', video:'./k10_spring_clip_v6.mp4',
    why:'Nach einem Sprung ist die Aktion nicht vorbei. Gute Torhüter landen kontrolliert und sind sofort bereit für die nächste Situation.',
    variants:{
      start:{
        desc:'Kurzer Sprung. Weiche Landung. Sofort wieder bereit.',
        steps:['Auf HOCH kurz abspringen.','Nicht maximal hoch springen.','Auf beiden Füssen weich landen.','Direkt in die Grundstellung.'],
        focus:['Landung leise und kontrolliert.','Knie bleiben stabil.','Füsse etwa schulterbreit landen.','Nach der Landung sofort ruhig stehen.'],
        mode:'autoReps', rounds:3, reps:4, rest:30, commands:'jumpStart',
        hint:'Vier saubere Sprünge pro Serie. Höhe ist unwichtig. Die Landung zählt.'
      },
      plus:{
        desc:'Kurze seitliche Sprünge und danach sofort stabil werden.',
        steps:['Auf LINKS oder RECHTS kurz seitlich abspringen.','Nur eine kleine Distanz springen.','Weich auf beiden Füssen landen.','Direkt wieder Grundstellung.'],
        focus:['Nicht weit springen.','Landung kontrollieren, bevor du neu startest.','Knie nicht nach innen fallen lassen.','Blick bleibt nach vorne.'],
        mode:'autoReps', rounds:3, reps:4, rest:30, commands:'jumpPlus',
        hint:'Die Richtung ist zufällig. Kurzer explosiver Impuls, dann sofort stabil.'
      },
      spielnah:{
        desc:'Richtung erkennen, springen, landen und beim gedachten Schuss wieder bereit sein.',
        steps:['Auf HOCH, LINKS oder RECHTS reagieren.','Kurz und kontrolliert springen.','Weich landen.','Bei SCHUSS sofort Grundstellung zeigen.'],
        focus:['Erst hören, dann springen.','Keine maximalen Sprünge.','Landung stabilisieren.','Bei SCHUSS sofort handlungsfähig.'],
        mode:'autoReps', rounds:3, reps:4, rest:30, commands:'jumpGame',
        hint:'Jede Wiederholung endet mit SCHUSS. Zeig nach der Landung sofort deine Grundstellung.'
      }
    }
  }
];

const ids = ['startScreen','overviewScreen','exerciseScreen','trainingScreen','betweenScreen','finishScreen'];
const $ = id => document.getElementById(id);
let level = 'start';
let currentIndex = 0;
let interval = null;
let commandTimer = null;
let secondTimer = null;
let audioOn = true;
let state = null;
let audioCtx = null;
let wakeLock = null;

function show(id){ ids.forEach(x=>$(x).classList.remove('active')); $(id).classList.add('active'); window.scrollTo({top:0,behavior:'instant'}); }
function currentExercise(){ return EXERCISES[currentIndex]; }
function variant(){ return currentExercise().variants[level]; }
function fmt(sec){ const m=Math.floor(Math.max(0,sec)/60); const s=Math.max(0,sec)%60; return `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`; }

async function requestWakeLock(){ try{ if('wakeLock' in navigator) wakeLock = await navigator.wakeLock.request('screen'); }catch(e){} }
function releaseWakeLock(){ try{ wakeLock?.release(); }catch(e){} wakeLock=null; }

function ensureAudio(){
  if(!audioCtx){ const AC=window.AudioContext||window.webkitAudioContext; if(AC) audioCtx=new AC(); }
  if(audioCtx?.state==='suspended') audioCtx.resume().catch(()=>{});
}
function beep(freq=680,d=.07){
  if(!audioOn||!audioCtx) return;
  const o=audioCtx.createOscillator(), g=audioCtx.createGain(); o.frequency.value=freq; g.gain.value=.045; o.connect(g); g.connect(audioCtx.destination); o.start(); g.gain.exponentialRampToValueAtTime(.001,audioCtx.currentTime+d); o.stop(audioCtx.currentTime+d);
}
function speak(text){ if(!audioOn||!('speechSynthesis' in window)) return; speechSynthesis.cancel(); const u=new SpeechSynthesisUtterance(text); u.lang='de-CH'; u.rate=.93; u.pitch=1; speechSynthesis.speak(u); }
function cue(text){ showSignal(text); beep(); speak(text==='SCHUSS'?'Schuss':text.charAt(0)+text.slice(1).toLowerCase()); }
function showSignal(text,rest=false){ $('signal').textContent=text; $('signal').classList.toggle('rest',rest); }
function clearAll(){ clearInterval(interval); clearTimeout(commandTimer); clearTimeout(secondTimer); interval=null;commandTimer=null;secondTimer=null; if('speechSynthesis' in window) speechSynthesis.cancel(); }

function setVideo(el,src,poster){ el.pause(); el.src=src; el.poster=poster; el.load(); el.play().catch(()=>{}); }

function renderOverview(){ $('overviewLevel').textContent=LEVELS[level].label; $('overviewIntro').textContent=LEVELS[level].intro; show('overviewScreen'); }
function renderExercise(){
  const e=currentExercise(), v=variant();
  $('exerciseProgress').textContent=`${currentIndex+1} / ${EXERCISES.length}`;
  $('exerciseLevel').textContent=LEVELS[level].label; $('exerciseNo').textContent=e.no; $('exerciseTitle').textContent=e.title; $('exerciseDesc').textContent=v.desc;
  setVideo($('exerciseVideo'),e.video,e.story); $('exerciseStoryboard').src=e.story; $('exerciseStoryboard').alt=`${e.title}: Bewegungsablauf`;
  $('exerciseSteps').innerHTML=v.steps.map(x=>`<li>${x}</li>`).join(''); $('exerciseFocus').innerHTML=v.focus.map(x=>`<li>${x}</li>`).join(''); $('exerciseWhy').textContent=e.why;
  show('exerciseScreen');
}

function renderTrainingBase(){
  const e=currentExercise(), v=variant();
  $('trainingLevel').textContent=LEVELS[level].label; $('trainingExerciseNo').textContent=e.no; $('trainingTitle').textContent=e.title; $('trainingHint').textContent=v.hint;
  setVideo($('trainingVideo'),e.video,e.story); $('signal').style.display='flex'; $('timerValue').style.display='block'; $('trainingMainBtn').disabled=false;
}

function scheduleReadyStart(){
  commandTimer=setTimeout(()=>{ if(state?.phase!=='work')return; cue('BEREIT'); secondTimer=setTimeout(()=>{if(state?.phase==='work')showSignal('LOCKER',true);},1700); scheduleReadyStart(); },3600+Math.random()*2200);
}
function scheduleReadyPlus(){
  commandTimer=setTimeout(()=>{ if(state?.phase!=='work')return; const d=Math.random()<.5?'LINKS':'RECHTS'; cue(d); secondTimer=setTimeout(()=>{if(state?.phase!=='work')return;cue('BEREIT'); secondTimer=setTimeout(()=>{if(state?.phase==='work')showSignal('LOCKER',true); scheduleReadyPlus();},1500);},1100); },2500+Math.random()*1400);
}
function scheduleGameSequence(stopWord='SCHUSS'){
  if(state?.phase!=='work') return;
  let count=1+Math.floor(Math.random()*3), i=0;
  const move=()=>{ if(state?.phase!=='work')return; if(i>=count){ cue(stopWord); secondTimer=setTimeout(()=>{if(state?.phase==='work'){showSignal('BEREIT',true);commandTimer=setTimeout(()=>scheduleGameSequence(stopWord),1200);}},1500); return;} cue(Math.random()<.5?'LINKS':'RECHTS'); i++; secondTimer=setTimeout(move,1100+Math.random()*500); };
  commandTimer=setTimeout(move,1700+Math.random()*900);
}
function scheduleStepsStart(){
  let dir=state.stepAlt||'LINKS'; cue(dir); state.stepAlt=dir==='LINKS'?'RECHTS':'LINKS'; secondTimer=setTimeout(()=>{if(state?.phase!=='work')return;cue('STOPP');commandTimer=setTimeout(scheduleStepsStart,1200);},1350);
}
function scheduleStepsPlus(){
  cue(Math.random()<.5?'LINKS':'RECHTS'); secondTimer=setTimeout(()=>{if(state?.phase!=='work')return;cue('STOPP');commandTimer=setTimeout(scheduleStepsPlus,1000+Math.random()*600);},1250);
}
function startCommands(mode){
  clearTimeout(commandTimer); clearTimeout(secondTimer);
  if(mode==='readyStart')scheduleReadyStart();
  if(mode==='readyPlus')scheduleReadyPlus();
  if(mode==='readyGame')scheduleGameSequence('SCHUSS');
  if(mode==='stepsStart')commandTimer=setTimeout(scheduleStepsStart,1200);
  if(mode==='stepsPlus')commandTimer=setTimeout(scheduleStepsPlus,1200);
  if(mode==='stepsGame')scheduleGameSequence('SCHUSS');
}

function runIntervalWork(resetTime=true){
  const v=variant(); state.phase='work'; if(resetTime) state.remaining=v.work;
  $('roundLabel').textContent=`Durchgang ${state.round} von ${v.rounds}`; $('timerValue').textContent=fmt(state.remaining); $('trainingMainBtn').textContent='Pause'; $('trainingMainBtn').disabled=false;
  showSignal(v.commands.includes('steps')||v.commands.includes('Game')?'BEREIT':'LOCKER',true); if(resetTime) beep(760,.09); startCommands(v.commands);
  interval=setInterval(()=>{ state.remaining--; $('timerValue').textContent=fmt(state.remaining); if(state.remaining<=0){ clearInterval(interval); clearTimeout(commandTimer); clearTimeout(secondTimer); if(state.round>=v.rounds) completeExercise(); else startRest(); } },1000);
}
function startIntervalRound(){ runIntervalWork(true); }
function startRest(){
  const v=variant(); clearAll(); state.phase='rest'; state.remaining=v.rest; showSignal('PAUSE',true); $('timerValue').textContent=fmt(state.remaining); $('trainingHint').textContent='Locker bleiben. Gleich geht es automatisch weiter.'; $('trainingMainBtn').disabled=true; $('trainingMainBtn').textContent='Pause läuft'; beep(430,.12);
  interval=setInterval(()=>{state.remaining--; $('timerValue').textContent=fmt(state.remaining); if(state.remaining<=0){clearInterval(interval);state.round++;$('trainingMainBtn').disabled=false;$('trainingHint').textContent=v.hint;startIntervalRound();}},1000);
}

function jumpCueFor(mode){ if(mode==='jumpStart')return 'HOCH'; if(mode==='jumpPlus')return Math.random()<.5?'LINKS':'RECHTS'; return ['HOCH','LINKS','RECHTS'][Math.floor(Math.random()*3)]; }
function scheduleNextJump(){
  const v=variant();
  if(state?.phase!=='reps') return;
  if(state.rep>=v.reps){ if(state.round>=v.rounds) completeExercise(); else startJumpRest(); return; }
  state.rep++; $('timerValue').textContent=`${state.rep} / ${v.reps}`; const c=jumpCueFor(v.commands); cue(c);
  if(v.commands==='jumpGame'){ secondTimer=setTimeout(()=>{if(state?.phase==='reps')cue('SCHUSS');},1200); }
  commandTimer=setTimeout(scheduleNextJump,v.commands==='jumpGame'?4300:3600);
}
function startJumpRound(resetRep=true){
  const v=variant(); state.phase='reps'; if(resetRep) state.rep=0; $('roundLabel').textContent=`Serie ${state.round} von ${v.rounds}`; $('timerValue').textContent=`${state.rep} / ${v.reps}`; $('trainingMainBtn').textContent='Pause'; $('trainingMainBtn').disabled=false; showSignal('BEREIT',true); if(resetRep) beep(760,.09);
  commandTimer=setTimeout(scheduleNextJump,1200);
}
function startJumpRest(){
  const v=variant(); clearAll(); state.phase='rest'; state.remaining=v.rest; showSignal('PAUSE',true); $('timerValue').textContent=fmt(state.remaining); $('trainingHint').textContent='Locker ausschütteln. Die nächste Serie startet automatisch.'; beep(430,.12);
  interval=setInterval(()=>{state.remaining--; $('timerValue').textContent=fmt(state.remaining); if(state.remaining<=0){clearInterval(interval);state.round++;$('trainingHint').textContent=v.hint;startJumpRound();}},1000);
}

function startTraining(){
  clearAll(); ensureAudio(); requestWakeLock(); renderTrainingBase(); const v=variant(); state={phase:'ready',round:1,remaining:0,stepAlt:'LINKS'};
  if(v.mode==='interval'){ $('roundLabel').textContent=`Durchgang 1 von ${v.rounds}`; $('timerValue').textContent=fmt(v.work); showSignal('BEREIT',true); $('trainingMainBtn').textContent='Start'; }
  else { $('roundLabel').textContent=`Serie 1 von ${v.rounds}`; $('timerValue').textContent=`0 / ${v.reps}`; showSignal('BEREIT',true); $('trainingMainBtn').textContent='Start'; }
  show('trainingScreen');
}
function beginFromReady(){ const v=variant(); if(v.mode==='interval')startIntervalRound(); else startJumpRound(); }
function completeExercise(){
  clearAll(); releaseWakeLock(); beep(900,.13);
  if(currentIndex>=EXERCISES.length-1){show('finishScreen');return;}
  const next=EXERCISES[currentIndex+1]; $('betweenTitle').textContent=`Als Nächstes: ${next.title}`; $('betweenText').textContent=next.variants[level].desc; $('betweenImage').src=next.story; $('betweenImage').alt=`${next.title}: Bewegungsablauf`; show('betweenScreen');
}

// events
[...document.querySelectorAll('.level-card')].forEach(b=>b.addEventListener('click',()=>{level=b.dataset.level;renderOverview();}));
$('overviewBack').addEventListener('click',()=>show('startScreen'));
$('startSessionBtn').addEventListener('click',()=>{currentIndex=0;renderExercise();});
$('exerciseBack').addEventListener('click',()=>{clearAll();show('overviewScreen');});
$('replayBtn').addEventListener('click',()=>{const v=$('exerciseVideo');v.currentTime=0;v.play().catch(()=>{});});
$('beginExerciseBtn').addEventListener('click',startTraining);
$('trainingBack').addEventListener('click',()=>{clearAll();releaseWakeLock();renderExercise();});
$('soundBtn').addEventListener('click',()=>{audioOn=!audioOn;$('soundBtn').textContent=audioOn?'🔊 Ton':'🔇 Ton aus';$('soundBtn').setAttribute('aria-pressed',String(audioOn));if(audioOn)ensureAudio();});
$('trainingMainBtn').addEventListener('click',()=>{
  ensureAudio();
  if(state.phase==='ready'){beginFromReady();return;}
  if(state.phase==='work'){ clearAll(); state.phase='manualWork'; showSignal('PAUSE',true); $('trainingMainBtn').textContent='Weiter'; $('trainingHint').textContent='Training angehalten.'; return; }
  if(state.phase==='manualWork'){ const v=variant(); $('trainingHint').textContent=v.hint; runIntervalWork(false); return; }
  if(state.phase==='reps'){ clearAll(); state.phase='manualReps'; showSignal('PAUSE',true); $('trainingMainBtn').textContent='Weiter'; $('trainingHint').textContent='Training angehalten.'; return; }
  if(state.phase==='manualReps'){ const v=variant(); $('trainingHint').textContent=v.hint; startJumpRound(false); return; }
});
$('nextExerciseBtn').addEventListener('click',()=>{currentIndex++;renderExercise();});
$('finishBtn').addEventListener('click',()=>{currentIndex=0;show('startScreen');});

document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible'&&state?.phase&&(state.phase==='work'||state.phase==='reps'))requestWakeLock();});
if('serviceWorker' in navigator){window.addEventListener('load',()=>navigator.serviceWorker.register('./service-worker.js?v=6').then(r=>r.update()).catch(()=>{}));}
