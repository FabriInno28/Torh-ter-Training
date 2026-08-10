const exercises = {
  "bereit": {
    category: "NUR ICH · START",
    title: "1 · Bereit!",
    desc: "Reagiere auf das Signal und gehe sofort in deine Grundstellung.",
    image: "bereit.png",
    chips: ["3 × 30 Sek.", "20 Sek. Pause", "Ohne Material"],
    steps: ["Locker stehen.", "Auf Signal reagieren.", "Sofort Grundstellung.", "2 Sek. halten."],
    focus: ["Knie weich.", "Hände bereit.", "Blick nach vorne.", "Locker bleiben."],
    seconds: 30,
    info: "Arbeite 30 Sekunden. Danach 20 Sekunden Pause. Insgesamt 3 Durchgänge."
  },
  "schritte-und-stopp": {
    category: "NUR ICH · START",
    title: "2 · Schritte & Stopp",
    desc: "Kleine Schritte. Stoppen. Bereit sein.",
    image: "schritte-und-stopp.png",
    chips: ["4 × 25 Sek.", "20 Sek. Pause", "Ohne Material"],
    steps: ["Signal hören oder sehen.", "2 kleine Schritte.", "Sofort stoppen.", "In Grundstellung sein."],
    focus: ["Füsse nicht kreuzen.", "Kopf ruhig.", "Vor dem Schuss bereit.", "Sauber stoppen."],
    seconds: 25,
    info: "Arbeite 25 Sekunden. Danach 20 Sekunden Pause. Insgesamt 4 Durchgänge."
  },
  "spring-land-bereit": {
    category: "NUR ICH · START",
    title: "3 · Spring · Land · Bereit",
    desc: "Spring kurz. Lande weich. Sei sofort wieder bereit.",
    image: "spring-land-bereit.png",
    chips: ["3 × 5", "30 Sek. Pause", "Ohne Material"],
    steps: ["Kurz abspringen.", "Weich landen.", "Stabil bleiben.", "Direkt bereit."],
    focus: ["Nicht hoch reissen.", "Sauber landen.", "Schnell bereit sein.", "Ruhig bleiben."],
    seconds: 30,
    info: "Mache 5 saubere Wiederholungen. Pausiere 30 Sekunden. Dann die nächste Serie."
  },
  "fallen-und-fangen": {
    category: "TENNISBALL · START",
    title: "1 · Fallen & Fangen",
    desc: "Lass den Ball fallen und sichere ihn nach dem ersten Aufprall.",
    image: "fallen-und-fangen.png",
    chips: ["10 Wiederholungen", "Tennisball", "Nur ich"],
    steps: ["Ball auf Schulterhöhe halten.", "Fallen lassen.", "Einmal aufspringen lassen.", "Vor dem 2. Aufprall fangen."],
    focus: ["Augen auf den Ball.", "Körper zum Ball.", "Sicher fangen.", "Ruhig bleiben."],
    seconds: 40,
    info: "Führe 10 Wiederholungen ruhig und sauber aus."
  },
  "hoch-und-hin": {
    category: "TENNISBALL · START",
    title: "2 · Hoch & Hin",
    desc: "Wirf den Ball leicht seitlich hoch und geh schnell darunter.",
    image: "hoch-und-hin.png",
    chips: ["12 Würfe", "Tennisball", "Nur ich"],
    steps: ["Ball leicht hochwerfen.", "Etwas links oder rechts.", "Schnell darunter gehen.", "Sauber fangen."],
    focus: ["Nicht warten.", "Körper zum Ball.", "Nach dem Fang bereit.", "Blick am Ball."],
    seconds: 45,
    info: "Arbeite links, rechts und frei. Insgesamt 12 Würfe."
  },
  "schraeger-absprung": {
    category: "TENNISBALL · START",
    title: "3 · Schräger Absprung",
    desc: "Wirf den Ball schräg auf den Boden und reagiere auf den Absprung.",
    image: "schraeger-absprung.png",
    chips: ["10 Wiederholungen", "Tennisball", "Nur ich"],
    steps: ["Ball schräg aufwerfen.", "Absprung lesen.", "Ersten Schritt machen.", "Ball sichern."],
    focus: ["Schnell reagieren.", "Nicht stehen bleiben.", "Nach jedem Fang bereit.", "Mutig zum Ball."],
    seconds: 45,
    info: "Mache 10 Reaktionen. Versuche so viele saubere Sicherungen wie möglich."
  }
};

const screens = {
  home: document.getElementById('home'),
  detail: document.getElementById('detail'),
  timer: document.getElementById('timer')
};
let current = null;
let remaining = 0;
let interval = null;
let running = false;

function show(name){
  Object.values(screens).forEach(el=>el.classList.remove('active'));
  screens[name].classList.add('active');
  window.scrollTo({top:0,behavior:'instant'});
}

function fill(id){
  current = exercises[id];
  document.getElementById('detailCategory').textContent = current.category;
  document.getElementById('detailTitle').textContent = current.title;
  document.getElementById('detailDesc').textContent = current.desc;
  document.getElementById('detailImage').src = current.image;
  document.getElementById('detailImage').alt = current.title;
  document.getElementById('chip1').textContent = current.chips[0];
  document.getElementById('chip2').textContent = current.chips[1];
  document.getElementById('chip3').textContent = current.chips[2];
  document.getElementById('detailSteps').innerHTML = current.steps.map(s=>`<li>${s}</li>`).join('');
  document.getElementById('detailFocus').innerHTML = current.focus.map(s=>`<li>${s}</li>`).join('');
  show('detail');
}

document.querySelectorAll('.exercise-card').forEach(btn=>btn.addEventListener('click',()=>fill(btn.dataset.id)));
document.getElementById('backBtn').addEventListener('click',()=>show('home'));

function fmt(sec){ const m=String(Math.floor(sec/60)).padStart(2,'0'); const s=String(sec%60).padStart(2,'0'); return `${m}:${s}`; }
function refreshTimer(){ document.getElementById('timerTime').textContent = fmt(remaining); }
function openTimer(){
  remaining = current.seconds;
  running = false;
  clearInterval(interval);
  document.getElementById('timerKicker').textContent = current.title;
  document.getElementById('timerInfo').textContent = current.info;
  document.getElementById('playPause').textContent = 'Start';
  refreshTimer();
  show('timer');
}
function toggle(){
  const btn = document.getElementById('playPause');
  if(!running){
    running = true; btn.textContent = 'Pause';
    interval = setInterval(()=>{
      remaining--; refreshTimer();
      if(remaining<=0){ clearInterval(interval); running=false; btn.textContent='Fertig'; }
    },1000);
  } else {
    running=false; clearInterval(interval); btn.textContent='Weiter';
  }
}
document.getElementById('openTimer').addEventListener('click', openTimer);
document.getElementById('timerBack').addEventListener('click', ()=>{clearInterval(interval); running=false; show('detail');});
document.getElementById('playPause').addEventListener('click', toggle);
document.getElementById('reset').addEventListener('click', openTimer);
