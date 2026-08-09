(() => {
  'use strict';

  const app = document.getElementById('app');
  const STORAGE_KEY = 'keeper10-v2';
  let DATA = null;
  let route = { page: 'home' };
  let timer = null;
  let soundOn = true;
  let activeSession = null;
  let exerciseIndex = 0;
  let timerState = null;

  const state = loadState();

  function loadState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : { completed: {}, feedback: {}, lastSession: null, preferredSetup: null };
    } catch (_) {
      return { completed: {}, feedback: {}, lastSession: null, preferredSetup: null };
    }
  }

  function saveState() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch (_) {}
  }

  function esc(s='') {
    return String(s).replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
  }

  function world(id) { return DATA.worlds.find(w => w.id === id); }
  function level(id) { return DATA.levels.find(l => l.id === id); }
  function session(id) { return DATA.sessions.find(s => s.id === id); }
  function sessionsForWorld(worldId) { return DATA.sessions.filter(s => s.world === worldId); }

  function compatSetups(setup) {
    const map = {
      solo: ['solo'],
      wall: ['wall','solo'],
      helper: ['helper','solo'],
      goal: ['goal','helper','solo']
    };
    return map[setup] || ['solo','wall','helper','goal'];
  }

  function setupLabel(id) {
    const s = DATA.setups.find(x => x.id === id);
    return s ? s.label : id;
  }

  function completedCount(sessionId) { return Number(state.completed?.[sessionId] || 0); }

  function go(page, params={}) {
    stopTimer();
    route = { page, ...params };
    history.replaceState(null, '', `#${page}${params.id ? '/' + params.id : ''}`);
    render();
    window.scrollTo({ top: 0, behavior: 'instant' });
  }

  function topbar(light=false) {
    return `
      <div class="topbar">
        <button class="brand ghost-brand" data-go="home" aria-label="Zur Startseite">
          <span class="brand-mark">K10</span>
          <span>KEEPER 10<small>Train like a keeper</small></span>
        </button>
        <button class="icon-btn" data-go="info" aria-label="Über KEEPER 10">i</button>
      </div>`;
  }

  function bottomNav(active='train') {
    return `
      <nav class="bottom-nav" aria-label="Hauptnavigation">
        <button class="nav-btn ${active==='train'?'active':''}" data-go="setup"><span>▶</span><span>Trainieren</span></button>
        <button class="nav-btn ${active==='worlds'?'active':''}" data-go="worlds"><span>◫</span><span>Welten</span></button>
        <button class="nav-btn ${active==='progress'?'active':''}" data-go="progress"><span>○</span><span>Mein Weg</span></button>
      </nav>`;
  }

  function keeperSvg(className='keeper-svg') {
    return `
    <svg class="${className}" viewBox="0 0 150 250" aria-hidden="true">
      <g>
        <ellipse cx="76" cy="234" rx="43" ry="7" fill="rgba(0,0,0,.16)"/>
        <path d="M58 151 L49 205 Q47 218 55 226 L66 225 L70 177 L83 177 L87 225 L99 226 Q106 218 102 205 L94 151Z" fill="#15171c"/>
        <path d="M51 223 L66 222 L70 234 L45 234 Q43 228 51 223Z" fill="#111318"/>
        <path d="M87 222 L101 223 Q109 229 106 234 L83 234Z" fill="#111318"/>
        <path d="M56 91 Q75 78 96 91 L101 154 Q79 165 53 154Z" fill="#f7c948" stroke="#111318" stroke-width="4"/>
        <path d="M56 96 L99 96" stroke="#111318" stroke-width="8" opacity=".86"/>
        <text x="77" y="134" text-anchor="middle" font-size="36" font-weight="900" fill="#111318" font-family="Arial">1</text>
        <path d="M56 99 L33 135 Q28 143 35 148 Q41 152 47 144 L67 117Z" fill="#f7c948" stroke="#111318" stroke-width="4"/>
        <path d="M98 99 L120 133 Q126 141 119 147 Q113 152 107 144 L88 117Z" fill="#f7c948" stroke="#111318" stroke-width="4"/>
        <circle cx="32" cy="148" r="8" fill="#f2b78d" stroke="#111318" stroke-width="3"/>
        <circle cx="122" cy="148" r="8" fill="#f2b78d" stroke="#111318" stroke-width="3"/>
        <rect x="26" y="143" width="13" height="12" rx="5" fill="#d9eef4" stroke="#111318" stroke-width="2"/>
        <rect x="116" y="143" width="13" height="12" rx="5" fill="#d9eef4" stroke="#111318" stroke-width="2"/>
        <circle cx="77" cy="64" r="27" fill="#f2b78d" stroke="#111318" stroke-width="4"/>
        <path d="M53 58 Q55 31 77 32 Q102 31 102 57 Q91 47 80 49 Q67 42 53 58Z" fill="#4d3328"/>
        <circle cx="68" cy="66" r="2.6" fill="#111318"/><circle cx="87" cy="66" r="2.6" fill="#111318"/>
        <path d="M70 77 Q77 82 85 77" fill="none" stroke="#8d533d" stroke-width="2.5" stroke-linecap="round"/>
      </g>
    </svg>`;
  }

  function serverSvg() {
    return `
    <svg class="server-svg" viewBox="0 0 120 220" aria-hidden="true">
      <g>
        <ellipse cx="60" cy="207" rx="35" ry="6" fill="rgba(0,0,0,.14)"/>
        <circle cx="61" cy="55" r="23" fill="#d79e79" stroke="#111318" stroke-width="4"/>
        <path d="M39 51 Q43 31 63 31 Q82 31 84 51 Q70 43 57 45 Q48 41 39 51Z" fill="#302820"/>
        <path d="M43 85 Q60 75 79 85 L84 143 Q61 152 38 143Z" fill="#242832" stroke="#111318" stroke-width="4"/>
        <path d="M39 94 L21 132" stroke="#242832" stroke-width="13" stroke-linecap="round"/>
        <path d="M80 94 L101 131" stroke="#242832" stroke-width="13" stroke-linecap="round"/>
        <path d="M45 143 L38 199" stroke="#111318" stroke-width="15" stroke-linecap="round"/>
        <path d="M75 143 L82 199" stroke="#111318" stroke-width="15" stroke-linecap="round"/>
      </g>
    </svg>`;
  }

  function ballSvg() {
    return `
    <svg class="ball-svg" viewBox="0 0 50 50" aria-hidden="true">
      <circle cx="25" cy="25" r="22" fill="#fffdf7" stroke="#111318" stroke-width="3"/>
      <path d="M25 14l8 6-3 9H20l-3-9z" fill="#111318"/>
      <path d="M25 14V4M33 20l9-4M30 29l7 9M20 29l-7 9M17 20l-9-4" stroke="#111318" stroke-width="2"/>
    </svg>`;
  }

  function heroArt() {
    return `
      <svg class="hero-art" viewBox="0 0 520 350" aria-hidden="true">
        <path d="M30 306 C112 260 189 294 276 245 C353 202 421 205 500 171" fill="none" stroke="rgba(17,19,24,.16)" stroke-width="4" stroke-dasharray="10 13"/>
        <rect x="331" y="73" width="153" height="185" rx="6" fill="none" stroke="#111318" stroke-width="10"/>
        <path d="M331 90h153M349 73v185M380 73v185M415 73v185M450 73v185M331 121h153M331 155h153M331 190h153M331 224h153" stroke="#111318" stroke-width="2" opacity=".18"/>
        <g transform="translate(120 35) scale(1.08)">${keeperSvg('hero-keeper').replace('class="hero-keeper"','class="hero-keeper"')}</g>
        <circle cx="421" cy="115" r="25" fill="#fffdf7" stroke="#111318" stroke-width="5"/><path d="M421 100l9 7-3 10h-12l-4-10z" fill="#111318"/>
      </svg>`;
  }

  function home() {
    const last = state.lastSession ? session(state.lastSession) : null;
    const featured = last || session('tor-start');
    return `
      <div class="app-shell">
        ${topbar()}
        <section class="page">
          <div class="hero">
            <div class="hero-copy">
              <p class="eyebrow">Für Keeper von ${esc(DATA.product.age)} Jahren</p>
              <div class="hero-title">KEEPER<span>10</span></div>
              <p>${esc(DATA.product.promise)} Kein Wochenplan. Du trainierst das, was du heute wirklich machen kannst.</p>
            </div>
            ${heroArt()}
            <div class="hero-actions">
              <button class="primary" data-go="setup">Training starten <span>→</span></button>
              ${last ? `<button class="secondary" data-session="${esc(last.id)}">Weiter: ${esc(last.title)}</button>` : `<button class="secondary" data-go="worlds">6 Keeper Welten ansehen</button>`}
            </div>
          </div>

          <div class="section">
            <div class="section-head"><div><p class="eyebrow">Heute</p><h2>Was hast du?</h2></div><p>Die App zeigt nur passende Einheiten.</p></div>
            <div class="setup-grid">
              ${DATA.setups.map(s => `
                <button class="setup-card" style="--setup:${s.color}" data-setup="${s.id}">
                  <span class="setup-icon">${s.icon}</span>
                  <h3>${esc(s.label)}</h3><p>${esc(s.hint)}</p>
                </button>`).join('')}
            </div>
          </div>

          <div class="section">
            <div class="section-head"><div><p class="eyebrow">Ein Fokus</p><h2>6 Keeper Welten</h2></div><p>Technik, Wahrnehmung und Entscheidung gehören zusammen.</p></div>
            <div class="world-grid">
              ${DATA.worlds.map(w => worldCard(w)).join('')}
            </div>
          </div>

          <div class="section">
            <div class="section-head"><div><p class="eyebrow">Golden Master</p><h2>${esc(featured.title)}</h2></div><p>${esc(level(featured.level).label)} · ${esc(setupLabel(featured.setup))}</p></div>
            ${sessionCard(featured)}
          </div>
        </section>
        ${bottomNav('train')}
      </div>`;
  }

  function worldCard(w) {
    const count = sessionsForWorld(w.id).reduce((n,s)=>n+completedCount(s.id),0);
    return `
      <button class="world-card" style="--accent:${w.accent}" data-world="${w.id}">
        <div class="world-icon">${w.icon}</div>
        <div><span class="world-name">${esc(w.title)}</span><strong>${esc(w.claim)}</strong><p>${esc(w.description)}</p></div>
        <div class="world-foot"><span>3 Sessions</span>${count ? `<span>${count}× trainiert</span>` : `<span>Start · Plus · Match</span>`}</div>
      </button>`;
  }

  function setupPage() {
    return `
      <div class="app-shell">
        ${topbar()}
        <section class="page">
          <div class="choice-hero">
            <p class="eyebrow">Dein Training passt sich an</p>
            <h1>Was hast du heute?</h1>
            <p class="lead">Wähle dein Setup. Du bekommst nur Sessions, die jetzt wirklich funktionieren.</p>
          </div>
          <div class="setup-large">
            ${DATA.setups.map(s => `
              <button class="setup-choice" data-setup="${s.id}">
                <span class="setup-icon" style="--setup:${s.color};background:${s.color}">${s.icon}</span>
                <span><h3>${esc(s.label)}</h3><p>${esc(s.hint)}</p></span><strong>→</strong>
              </button>`).join('')}
          </div>
        </section>
        ${bottomNav('train')}
      </div>`;
  }

  function setupResults(setupId) {
    const allowed = compatSetups(setupId);
    const sessions = DATA.sessions.filter(s => allowed.includes(s.setup));
    state.preferredSetup = setupId; saveState();
    return `
      <div class="app-shell light">
        ${topbar(true)}
        <section class="page">
          <div class="back-row"><button class="back-btn" data-go="setup" aria-label="Zurück">←</button><div><p class="eyebrow">${esc(setupLabel(setupId))}</p><h2>Deine Sessions</h2></div></div>
          <div class="kicker-strip">
            ${DATA.worlds.map(w => `<button class="pill" data-filter-world="${w.id}">${w.title}</button>`).join('')}
          </div>
          <div class="session-list" data-session-list>
            ${sessions.map(sessionCard).join('')}
          </div>
        </section>
        ${bottomNav('train')}
      </div>`;
  }

  function worldsPage() {
    return `
      <div class="app-shell">
        ${topbar()}
        <section class="page">
          <p class="eyebrow">Deine Ausbildung</p>
          <h1>6 Keeper Welten.</h1>
          <p class="lead">Jede Welt hat drei Stufen. START für saubere Grundlagen. PLUS für Bewegung und Tempo. MATCH für echte Entscheidungen.</p>
          <div class="world-grid world-grid-large">${DATA.worlds.map(worldCard).join('')}</div>
        </section>
        ${bottomNav('worlds')}
      </div>`;
  }

  function worldPage(worldId) {
    const w = world(worldId);
    const sessions = sessionsForWorld(worldId);
    return `
      <div class="app-shell light">
        ${topbar(true)}
        <section class="page">
          <div class="back-row"><button class="back-btn" data-go="worlds">←</button><div><p class="eyebrow">Keeper Welt</p><h2>${esc(w.title)}</h2></div></div>
          <div class="world-hero" style="--accent:${w.accent}">
            <div class="world-hero-icon">${w.icon}</div>
            <div><p class="eyebrow">${esc(w.claim)}</p><h1>${esc(w.title)}</h1><p>${esc(w.description)}</p></div>
          </div>
          <div class="level-path">
            ${sessions.map(s => levelSessionCard(s)).join('')}
          </div>
        </section>
        ${bottomNav('worlds')}
      </div>`;
  }

  function levelSessionCard(s) {
    const l = level(s.level), done = completedCount(s.id), w = world(s.world);
    return `
      <button class="level-card" style="--accent:${w.accent}" data-session="${s.id}">
        <div class="level-badge">${l.label}</div>
        <div class="level-card-copy"><h3>${esc(s.title)}</h3><p>${esc(l.meaning)}</p><div class="meta-row"><span class="meta">${esc(setupLabel(s.setup))}</span><span class="meta">${s.minutes} Min</span>${done?`<span class="meta">${done}× gemacht</span>`:''}</div></div>
        <div class="session-arrow">→</div>
      </button>`;
  }

  function sessionCard(s) {
    const w = world(s.world), l = level(s.level), done = completedCount(s.id);
    return `
      <button class="session-card" style="--accent:${w.accent}" data-session="${s.id}">
        <span class="session-visual">${s.icon}</span>
        <span><h3>${esc(s.title)}</h3><p>${esc(s.tagline)}</p><span class="meta-row"><span class="meta">${w.title}</span><span class="meta">${l.label}</span><span class="meta">${esc(setupLabel(s.setup))}</span>${done?`<span class="meta">${done}×</span>`:''}</span></span>
        <span class="session-arrow">→</span>
      </button>`;
  }

  function sessionIntro(sessionId) {
    const s = session(sessionId), w = world(s.world), l = level(s.level);
    const siblings = sessionsForWorld(s.world);
    return `
      <div class="app-shell light">
        ${topbar(true)}
        <section class="page">
          <div class="back-row"><button class="back-btn" data-world="${w.id}">←</button><div><p class="eyebrow">${w.title} · ${l.label}</p></div></div>
          <article class="session-intro" style="--accent:${w.accent}">
            <div class="session-cover">
              <div><p class="eyebrow">${esc(setupLabel(s.setup))} · ${s.minutes} Minuten</p><h1>${esc(s.title)}</h1><p class="tagline">${esc(s.tagline)}</p></div>
              <div class="big-icon">${s.icon}</div>
            </div>
            <div class="intro-body">
              <div class="why-box"><b>WARUM DAS ZÄHLT</b><p>${esc(s.why)}</p></div>
              <div class="timeline">
                ${s.exercises.map((e,i)=>`<div class="timeline-item"><span class="timeline-no">${i+1}</span><span><h3>${esc(e.title)}</h3><p>${esc(e.why)}</p></span><span class="timeline-time">${esc(e.rhythm)}</span></div>`).join('')}
              </div>
              <div class="level-selector">
                ${siblings.map(x => `<button class="level-btn ${x.id===s.id?'active':''}" data-session="${x.id}">${level(x.level).label}</button>`).join('')}
              </div>
              <button class="primary" data-start-session="${s.id}">Los. 10 Minuten. <span>→</span></button>
            </div>
          </article>
        </section>
      </div>`;
  }

  function trainingPage(sessionId, idx=0) {
    activeSession = session(sessionId); exerciseIndex = idx;
    const s = activeSession, e = s.exercises[idx], w = world(s.world);
    timerState = initTimerState(e);
    return `
      <div class="training" style="--accent:${w.accent}">
        <header class="training-head">
          <button class="close-btn" data-session="${s.id}" aria-label="Training schliessen">×</button>
          <div class="training-title"><b>${esc(s.title)}</b><span>${w.title} · ${level(s.level).label}</span></div>
          <button class="sound-btn" data-sound aria-label="Ton an oder aus">${soundOn?'♪':'×'}</button>
        </header>
        <div class="progress-track"><div class="progress-fill" style="width:${((idx)/s.exercises.length)*100}%"></div></div>
        <section class="exercise-stage">
          ${animationCard(e)}
          <div class="exercise-info">
            <div class="exercise-copy">
              <div><p class="step-kicker">Übung ${idx+1} von ${s.exercises.length}</p><h2>${esc(e.title)}</h2></div>
              <div class="timer-chip"><span class="time" data-timer-display>${formatTime(e.work)}</span><small data-phase-label>Runde 1 / ${e.rounds}</small></div>
            </div>
            <div class="cues">${e.cues.map((c,i)=>`<div class="cue"><b>${i===0?'Achte auf':'+'}</b>${esc(c)}</div>`).join('')}</div>
            <details class="howto"><summary>So geht's</summary><ol>${e.steps.map(x=>`<li>${esc(x)}</li>`).join('')}</ol><p><strong>Warum:</strong> ${esc(e.why)}</p></details>
            <div class="variant-note">${esc(e.variant)}</div>
            <div class="timer-controls">
              <button class="timer-main" data-timer-main>Timer starten · ${esc(e.rhythm)}</button>
              <button class="next-btn" data-next-exercise aria-label="Übung überspringen">→</button>
            </div>
          </div>
        </section>
      </div>`;
  }

  function animationCard(e) {
    const scene = esc(e.scene || 'goal');
    const anim = esc(e.animation || 'set');
    return `
      <div class="animation-card scene ${scene} anim-${anim}" data-animation>
        <span class="sky-glow"></span><span class="pitch-line"></span><span class="goal-frame"></span><span class="wall-mark"></span>
        ${keeperSvg()}${serverSvg()}${ballSvg()}
        <span class="motion-arrow">›</span>
        <button class="replay-btn" data-replay>↻ Animation</button>
      </div>`;
  }

  function initTimerState(e) {
    return { running:false, phase:'work', round:1, remaining:e.work, totalRounds:e.rounds, work:e.work, rest:e.rest, finished:false };
  }

  function startPauseTimer() {
    if (!timerState || timerState.finished) {
      nextExercise();
      return;
    }
    if (timerState.running) { stopIntervalOnly(); updateTimerUI(); return; }
    timerState.running = true;
    beep(520, .06);
    updateTimerUI();
    timer = setInterval(tick, 1000);
  }

  function tick() {
    if (!timerState?.running) return;
    timerState.remaining -= 1;
    if (timerState.remaining <= 0) advanceTimerPhase();
    updateTimerUI();
  }

  function advanceTimerPhase() {
    if (timerState.phase === 'work') {
      if (timerState.round >= timerState.totalRounds) {
        timerState.running = false; timerState.finished = true; timerState.remaining = 0;
        stopIntervalOnly(); beep(760,.08); setTimeout(()=>beep(980,.08),110); return;
      }
      timerState.phase = 'rest'; timerState.remaining = timerState.rest; beep(420,.07);
    } else {
      timerState.phase = 'work'; timerState.round += 1; timerState.remaining = timerState.work; beep(650,.07);
    }
  }

  function updateTimerUI() {
    const display = document.querySelector('[data-timer-display]');
    const phase = document.querySelector('[data-phase-label]');
    const main = document.querySelector('[data-timer-main]');
    if (!display || !phase || !main || !timerState) return;
    display.textContent = formatTime(timerState.remaining);
    if (timerState.finished) {
      phase.textContent = 'Geschafft';
      main.textContent = exerciseIndex === activeSession.exercises.length - 1 ? 'Session abschliessen →' : 'Nächste Übung →';
      main.classList.add('finished');
    } else if (timerState.phase === 'rest') {
      phase.textContent = `Pause · danach Runde ${timerState.round + 1}`;
      main.textContent = timerState.running ? 'Pause läuft' : 'Weiter';
    } else {
      phase.textContent = `Runde ${timerState.round} / ${timerState.totalRounds}`;
      main.textContent = timerState.running ? 'Pause' : (timerState.round === 1 && timerState.remaining === timerState.work ? 'Timer starten' : 'Weiter');
    }
  }

  function nextExercise() {
    stopTimer();
    if (exerciseIndex < activeSession.exercises.length - 1) {
      exerciseIndex += 1;
      app.innerHTML = trainingPage(activeSession.id, exerciseIndex);
      bind();
      window.scrollTo(0,0);
    } else {
      completeSession(activeSession.id);
    }
  }

  function stopIntervalOnly() {
    if (timer) { clearInterval(timer); timer = null; }
    if (timerState) timerState.running = false;
  }

  function stopTimer() { stopIntervalOnly(); timerState = null; }

  function beep(freq=600, duration=.08) {
    if (!soundOn) return;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      const ctx = beep.ctx || (beep.ctx = new AudioCtx());
      const o = ctx.createOscillator(), g = ctx.createGain();
      o.frequency.value = freq; o.type = 'sine';
      g.gain.setValueAtTime(.0001, ctx.currentTime);
      g.gain.exponentialRampToValueAtTime(.07, ctx.currentTime + .01);
      g.gain.exponentialRampToValueAtTime(.0001, ctx.currentTime + duration);
      o.connect(g); g.connect(ctx.destination); o.start(); o.stop(ctx.currentTime + duration + .02);
    } catch (_) {}
  }

  function formatTime(sec) {
    const m = Math.floor(sec/60), s = Math.max(0,sec%60);
    return m ? `${m}:${String(s).padStart(2,'0')}` : `0:${String(s).padStart(2,'0')}`;
  }

  function completeSession(id) {
    stopTimer();
    state.completed[id] = completedCount(id) + 1;
    state.lastSession = id;
    saveState();
    route = { page:'complete', id };
    render();
  }

  function completionPage(id) {
    const s = session(id), w = world(s.world);
    return `
      <div class="app-shell">
        ${topbar()}
        <section class="page completion" style="--accent:${w.accent}">
          <div class="completion-mark">✓</div>
          <p class="eyebrow">${w.title} · ${level(s.level).label}</p>
          <h1>Das war Keeperarbeit.</h1>
          <p class="lead">Nicht weil alles perfekt war. Sondern weil du bewusst an einer echten Torhütersituation gearbeitet hast.</p>
          <div class="takeaway"><b>NIMM DAS MIT</b><p>${esc(s.takeaway)}</p></div>
          <p class="eyebrow">Wie war die Schwierigkeit?</p>
          <div class="feedback-grid">
            <button class="feedback-btn" data-feedback="easy"><span>↘</span>Zu leicht</button>
            <button class="feedback-btn" data-feedback="right"><span>●</span>Genau richtig</button>
            <button class="feedback-btn" data-feedback="hard"><span>↗</span>Noch schwierig</button>
          </div>
          <button class="primary" data-go="home">Zurück zu KEEPER 10</button>
        </section>
      </div>`;
  }

  function progressPage() {
    return `
      <div class="app-shell light">
        ${topbar(true)}
        <section class="page">
          <p class="eyebrow">Kein Ranking. Nur dein Weg.</p>
          <h1>Wo warst du schon?</h1>
          <p class="lead">Hier siehst du nur, welche Keeper Welten du bereits ausprobiert hast. Kein Streak. Keine Punkte.</p>
          <div class="progress-grid">
            ${DATA.worlds.map(w => {
              const sessions = sessionsForWorld(w.id), doneSessions = sessions.filter(s=>completedCount(s.id)>0).length, totalRuns=sessions.reduce((n,s)=>n+completedCount(s.id),0);
              return `<button class="focus-card focus-click" style="--accent:${w.accent}" data-world="${w.id}"><div class="focus-top"><h3>${w.title} · ${w.claim}</h3><span>${doneSessions}/3 Sessions · ${totalRuns}× trainiert</span></div><div class="focus-bar"><div style="width:${(doneSessions/3)*100}%"></div></div></button>`;
            }).join('')}
          </div>
          ${state.lastSession ? `<div class="section"><p class="eyebrow">Zuletzt</p>${sessionCard(session(state.lastSession))}</div>` : `<div class="empty-state"><div class="emoji">🧤</div><h3>Noch nichts gespeichert.</h3><p>Dein erster Eintrag entsteht automatisch nach einer abgeschlossenen Session.</p></div>`}
        </section>
        ${bottomNav('progress')}
      </div>`;
  }

  function infoPage() {
    return `
      <div class="app-shell light">
        ${topbar(true)}
        <section class="page">
          <div class="back-row"><button class="back-btn" data-go="home">←</button><div><p class="eyebrow">Die Idee</p><h2>Warum KEEPER 10?</h2></div></div>
          <div class="info-sheet">
            <h2>Kein Drill Katalog.</h2>
            <p>KEEPER 10 denkt vom Spiel aus: Tor verteidigen, Raum verteidigen und Angriffe starten. Jede Session verbindet saubere Technik mit Wahrnehmung und Entscheidung.</p>
            <h3>START</h3><p>Du verstehst eine Bewegung und kannst sie kontrolliert wiederholen.</p>
            <h3>PLUS</h3><p>Tempo, Bewegung oder eine zusätzliche Information kommen dazu.</p>
            <h3>MATCH</h3><p>Du weisst nicht alles vorher. Du musst sehen, entscheiden und handeln.</p>
            <h3>Für 10–14 Jahre</h3><p>Qualität vor Ermüdung. Sprünge und Paraden werden kontrolliert aufgebaut. Bei Schmerzen wird gestoppt. Harte Nahdistanzschüsse und unnötige Kollisionen gehören nicht in diese App.</p>
            <p class="source-note">Die Trainingsarchitektur orientiert sich an moderner Torhüterausbildung: Set Position und Positionierung, Flugbahnlesen, hohe Bälle, 1 gegen 1, Distribution sowie defensive/offensive Übergänge.</p>
          </div>
        </section>
      </div>`;
  }

  function replayAnimation(btn) {
    const card = btn.closest('[data-animation]');
    if (!card) return;
    const classes = [...card.classList];
    const anim = classes.find(c=>c.startsWith('anim-'));
    if (!anim) return;
    card.classList.remove(anim); void card.offsetWidth; card.classList.add(anim);
  }

  function applyFeedback(value, btn) {
    if (!route.id) return;
    state.feedback[route.id] = value; saveState();
    document.querySelectorAll('[data-feedback]').forEach(x=>x.classList.toggle('selected', x===btn));
  }

  function filterWorld(worldId, btn) {
    const setupId = route.setup;
    const allowed = compatSetups(setupId);
    const list = DATA.sessions.filter(s=>allowed.includes(s.setup) && (!worldId || s.world===worldId));
    const holder = document.querySelector('[data-session-list]');
    if (holder) holder.innerHTML = list.length ? list.map(sessionCard).join('') : `<div class="empty-state"><div class="emoji">🧤</div><h3>Hier passt heute nichts.</h3><p>Wähle ein anderes Setup oder eine andere Keeper Welt.</p></div>`;
    document.querySelectorAll('[data-filter-world]').forEach(x=>x.classList.toggle('active', x===btn));
    bind(holder || document);
  }

  function bind(scope=document) {
    scope.querySelectorAll('[data-go]').forEach(el => el.onclick = () => go(el.dataset.go));
    scope.querySelectorAll('[data-setup]').forEach(el => el.onclick = () => { route = {page:'results', setup:el.dataset.setup}; render(); });
    scope.querySelectorAll('[data-world]').forEach(el => el.onclick = () => { route = {page:'world', id:el.dataset.world}; render(); window.scrollTo(0,0); });
    scope.querySelectorAll('[data-session]').forEach(el => el.onclick = () => { route = {page:'session', id:el.dataset.session}; render(); window.scrollTo(0,0); });
    scope.querySelectorAll('[data-start-session]').forEach(el => el.onclick = () => { route = {page:'training', id:el.dataset.startSession}; app.innerHTML = trainingPage(el.dataset.startSession,0); bind(); });
    scope.querySelectorAll('[data-timer-main]').forEach(el => el.onclick = startPauseTimer);
    scope.querySelectorAll('[data-next-exercise]').forEach(el => el.onclick = nextExercise);
    scope.querySelectorAll('[data-sound]').forEach(el => el.onclick = () => { soundOn=!soundOn; el.textContent=soundOn?'♪':'×'; if(soundOn) beep(620,.05); });
    scope.querySelectorAll('[data-replay]').forEach(el => el.onclick = () => replayAnimation(el));
    scope.querySelectorAll('[data-feedback]').forEach(el => el.onclick = () => applyFeedback(el.dataset.feedback, el));
    scope.querySelectorAll('[data-filter-world]').forEach(el => el.onclick = () => filterWorld(el.dataset.filterWorld, el));
  }

  function render() {
    if (!DATA) return;
    switch (route.page) {
      case 'setup': app.innerHTML = setupPage(); break;
      case 'results': app.innerHTML = setupResults(route.setup || state.preferredSetup || 'solo'); break;
      case 'worlds': app.innerHTML = worldsPage(); break;
      case 'world': app.innerHTML = worldPage(route.id || 'tor'); break;
      case 'session': app.innerHTML = sessionIntro(route.id || 'tor-start'); break;
      case 'training': app.innerHTML = trainingPage(route.id || 'tor-start',0); break;
      case 'complete': app.innerHTML = completionPage(route.id || state.lastSession || 'tor-start'); break;
      case 'progress': app.innerHTML = progressPage(); break;
      case 'info': app.innerHTML = infoPage(); break;
      default: app.innerHTML = home();
    }
    bind();
  }

  async function boot() {
    try {
      const res = await fetch('./sessions.json', { cache:'no-store' });
      if (!res.ok) throw new Error('sessions.json konnte nicht geladen werden');
      DATA = await res.json();
      render();
      if ('serviceWorker' in navigator && location.protocol !== 'file:') {
        navigator.serviceWorker.register('./service-worker.js').catch(()=>{});
      }
    } catch (err) {
      app.innerHTML = `<div class="app-shell"><section class="page"><div class="empty-state"><div class="emoji">🧤</div><h2>KEEPER 10 konnte nicht starten.</h2><p>${esc(err.message)}</p><p>Auf GitHub Pages oder über einen lokalen Webserver öffnen.</p></div></section></div>`;
    }
  }

  boot();
})();
