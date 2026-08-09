const exercises = {
  "ready": {
    tag: "NUR ICH · START",
    title: "1 · READY!",
    desc: "Reagiere auf das Signal und gehe sofort in deine Grundstellung.",
    image: "./ready.png",
    meta: ["3 × 30 Sek.", "20 Sek. Pause", "Ohne Material"],
    steps: ["Locker stehen.", "Auf Signal reagieren.", "Sofort Grundstellung.", "2 Sek. halten."],
    focus: ["Knie weich.", "Hände bereit.", "Blick nach vorne.", "Locker bleiben."],
    seconds: 30,
    hint: "Arbeite 30 Sekunden. Dann 20 Sekunden Pause. Insgesamt 3 Durchgänge."
  },
  "move-set": {
    tag: "NUR ICH · START",
    title: "2 · MOVE & SET",
    desc: "Kleine Schritte. Stoppen. Bereit sein.",
    image: "./move-set.png",
    meta: ["4 × 25 Sek.", "20 Sek. Pause", "Ohne Material"],
    steps: ["Signal hören oder sehen.", "2 kleine Schritte.", "Sofort stoppen.", "In Grundstellung sein."],
    focus: ["Füsse nicht kreuzen.", "Kopf ruhig.", "Vor dem Schuss bereit.", "Sauber stoppen."],
    seconds: 25,
    hint: "Arbeite 25 Sekunden. Danach 20 Sekunden Pause. Insgesamt 4 Durchgänge."
  },
  "spring-land-ready": {
    tag: "NUR ICH · START",
    title: "3 · SPRING · LAND · READY",
    desc: "Spring kurz. Lande weich. Sei sofort wieder bereit.",
    image: "./spring-land-ready.png",
    meta: ["3 × 5", "30 Sek. Pause", "Ohne Material"],
    steps: ["Kurz abspringen.", "Weich landen.", "Stabil bleiben.", "Direkt READY."],
    focus: ["Nicht hoch reissen.", "Sauber landen.", "Schnell bereit sein.", "Ruhig bleiben."],
    seconds: 30,
    hint: "Mache 5 saubere Wiederholungen. Pausiere 30 Sekunden. Dann die nächste Serie."
  },
  "drop": {
    tag: "TENNISBALL · START",
    title: "1 · DROP",
    desc: "Lass den Ball fallen und sichere ihn nach dem ersten Aufprall.",
    image: "./drop.jpg",
    meta: ["10 Wiederholungen", "Tennisball", "Nur ich"],
    steps: ["Ball auf Schulterhöhe halten.", "Fallen lassen.", "Einmal aufspringen lassen.", "Vor dem 2. Aufprall fangen."],
    focus: ["Augen auf den Ball.", "Körper zum Ball.", "Sicher fangen.", "Ruhig bleiben."],
    seconds: 40,
    hint: "Führe 10 Wiederholungen ruhig und sauber aus."
  },
  "hoch-und-hin": {
    tag: "TENNISBALL · START",
    title: "2 · HOCH & HIN",
    desc: "Wirf den Ball leicht seitlich hoch und geh schnell darunter.",
    image: "./hoch-und-hin.png",
    meta: ["12 Würfe", "Tennisball", "Nur ich"],
    steps: ["Ball leicht hochwerfen.", "Etwas links oder rechts.", "Schnell darunter gehen.", "Sauber fangen."],
    focus: ["Nicht warten.", "Körper zum Ball.", "Nach dem Fang bereit.", "Blick am Ball."],
    seconds: 45,
    hint: "Arbeite links, rechts und frei. Insgesamt 12 Würfe."
  },
  "crazy-bounce": {
    tag: "TENNISBALL · START",
    title: "3 · CRAZY BOUNCE",
    desc: "Wirf den Ball schräg auf den Boden und reagiere auf den Absprung.",
    image: "./crazy-bounce.png",
    meta: ["10 Wiederholungen", "Tennisball", "Nur ich"],
    steps: ["Ball schräg aufwerfen.", "Absprung lesen.", "Ersten Schritt machen.", "Ball sichern."],
    focus: ["Schnell reagieren.", "Nicht stehen bleiben.", "Nach jedem Fang bereit.", "Mutig zum Ball."],
    seconds: 45,
    hint: "Mache 10 Reaktionen. Versuche so viele saubere Sicherungen wie möglich."
  }
};

const views = {
  home: document.getElementById('home'),
  detail: document.getElementById('detail'),
  timer: document.getElementById('timerView')
};
let currentId = null;
let timer = null;
let remaining = 0;
let running = false;

function showView(name){
  Object.values(views).forEach(v => v.classList.remove('active'));
  views[name].classList.add('active');
  window.scrollTo({top:0, behavior:'instant'});
}

function renderDetail(id){
  const ex = exercises[id];
  currentId = id;
  document.getElementById('detailTag').textContent = ex.tag;
  document.getElementById('detailTitle').textContent = ex.title;
  document.getElementById('detailDesc').textContent = ex.desc;
  const img = document.getElementById('detailImage');
  img.src = ex.image; img.alt = ex.title;
  document.getElementById('detailMeta1').textContent = ex.meta[0];
  document.getElementById('detailMeta2').textContent = ex.meta[1];
  document.getElementById('detailMeta3').textContent = ex.meta[2];
  document.getElementById('detailSteps').innerHTML = ex.steps.map(s => `<li>${s}</li>`).join('');
  document.getElementById('detailFocus').innerHTML = ex.focus.map(s => `<li>${s}</li>`).join('');
  showView('detail');
}

function formatTime(seconds){
  const m = String(Math.floor(seconds / 60)).padStart(2, '0');
  const s = String(seconds % 60).padStart(2, '0');
  return `${m}:${s}`;
}

function updateTimer(){
  document.getElementById('timerDisplay').textContent = formatTime(remaining);
}

function setupTimer(){
  const ex = exercises[currentId];
  remaining = ex.seconds;
  running = false;
  clearInterval(timer);
  document.getElementById('timerTitle').textContent = ex.title;
  document.getElementById('timerHint').textContent = ex.hint;
  document.getElementById('playPauseBtn').textContent = 'Start';
  updateTimer();
  showView('timer');
}

function toggleTimer(){
  const btn = document.getElementById('playPauseBtn');
  if(!running){
    running = true;
    btn.textContent = 'Pause';
    timer = setInterval(() => {
      remaining -= 1;
      updateTimer();
      if(remaining <= 0){
        clearInterval(timer);
        running = false;
        btn.textContent = 'Fertig';
      }
    }, 1000);
  } else {
    running = false;
    clearInterval(timer);
    btn.textContent = 'Weiter';
  }
}

document.querySelectorAll('.exercise-card').forEach(card => {
  card.addEventListener('click', () => renderDetail(card.dataset.id));
});
document.getElementById('backButton').addEventListener('click', () => showView('home'));
document.getElementById('startTimer').addEventListener('click', setupTimer);
document.getElementById('timerBack').addEventListener('click', () => {
  clearInterval(timer); running = false; showView('detail');
});
document.getElementById('playPauseBtn').addEventListener('click', toggleTimer);
document.getElementById('resetBtn').addEventListener('click', setupTimer);
