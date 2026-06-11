// ===== NAV =====
function showPage(id) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.nav-links a').forEach(a => a.classList.remove('active'));
    document.getElementById('page-' + id).classList.add('active');
    const navEl = document.getElementById('nav-' + id);
    if (navEl) navEl.classList.add('active');
    window.scrollTo(0, 0);

    if (id === 'raspadinha') initScratch();
    if (id === 'cadastro') renderStudentsTable();
}

function showToast(msg, dur = 3000) {
    const t = document.getElementById('toast');
    t.textContent = msg;
    t.classList.add('show');
    setTimeout(() => t.classList.remove('show'), dur);
}

// ===== QUIZ =====
const allQuestions = [
    { q: "Você passa horas explorando como os aparelhos e softwares funcionam por dentro?", a: "Informática", b: "Enfermagem", c: "Administração" },
    { q: "Quando alguém está doente ou em sofrimento, seu instinto é cuidar e ajudar?", a: "Administração", b: "Enfermagem", c: "Informática" },
    { q: "Você se sente motivado ao planejar estratégias, metas e orçamentos?", a: "Informática", b: "Administração", c: "Enfermagem" },
    { q: "Resolver problemas lógicos e quebra-cabeças é algo que você genuinamente curte?", a: "Informática", b: "Enfermagem", c: "Administração" },
    { q: "Você tem paciência e empatia para lidar com pessoas em estado vulnerável?", a: "Administração", b: "Enfermagem", c: "Informática" },
    { q: "Liderar equipes e tomar decisões estratégicas te atrai?", a: "Informática", b: "Administração", c: "Enfermagem" },
    { q: "Você prefere trabalhar em ambientes dinâmicos com muitas interações humanas?", a: "Informática", b: "Enfermagem", c: "Administração" },
    { q: "Criar sistemas, automatizar processos e programar é algo que você acharia fascinante?", a: "Informática", b: "Administração", c: "Enfermagem" },
    { q: "A ideia de trabalhar em hospitais, clínicas ou UPAs te emociona positivamente?", a: "Administração", b: "Enfermagem", c: "Informática" },
    { q: "Você tem facilidade para organizar planilhas, dados financeiros e relatórios?", a: "Informática", b: "Administração", c: "Enfermagem" },
    { q: "Tecnologia, novas ferramentas digitais e startups são assuntos do seu interesse?", a: "Informática", b: "Administração", c: "Enfermagem" },
    { q: "Situações de emergência que exigem calma e ação rápida te mobilizam positivamente?", a: "Administração", b: "Enfermagem", c: "Informática" },
    { q: "Você pensa em abrir um negócio, gerenciar uma empresa ou trabalhar com finanças?", a: "Informática", b: "Administração", c: "Enfermagem" },
    { q: "Identificar vulnerabilidades, proteger sistemas e combater vírus seria uma missão empolgante?", a: "Informática", b: "Enfermagem", c: "Administração" },
    { q: "No futuro, você se imagina tendo impacto direto na vida das pessoas no dia a dia?", a: "Administração", b: "Enfermagem", c: "Informática" }
];

let currentBatch = 0;
let selectedQuestions = [];
let quizSize = 0;
let answers = {}; // {questionIndex: 'A'|'B'|'C'}
const scoreMap = { 'Informática': 0, 'Enfermagem': 0, 'Administração': 0 };

function startQuiz() {
    currentBatch = 0;
    answers = {};

    Object.keys(scoreMap).forEach(k => scoreMap[k] = 0);

    // Sorteia entre 4 e 6 perguntas
    quizSize = Math.floor(Math.random() * 3) + 4;

    // Embaralha e seleciona perguntas
    selectedQuestions = [...allQuestions]
        .sort(() => Math.random() - 0.5)
        .slice(0, quizSize);

    document.getElementById('quiz-start').style.display = 'none';
    document.getElementById('quiz-result').style.display = 'none';
    document.getElementById('quiz-questions').style.display = 'block';

    renderBatch();
}
0
function renderBatch() {
    const start = 0;
    const end = selectedQuestions.length;
    const batch = selectedQuestions;

    document.getElementById('batchLabel').textContent = `Perguntas ${start + 1}–${end}`;
    const answered = Object.keys(answers).length;
    document.getElementById('progressText').textContent = `${answered} de ${quizSize}`;
    document.getElementById('progressBar').style.width = `${(answered / quizSize) * 100}%`;

    const container = document.getElementById('questionsBatch');
    container.innerHTML = '';
    batch.forEach((q, i) => {
        const idx = start + i;
        const opts = [
            { label: 'A', text: getOptionText(q, 'A'), val: 'A', course: q.a },
            { label: 'B', text: getOptionText(q, 'B'), val: 'B', course: q.b },
            { label: 'C', text: getOptionText(q, 'C'), val: 'C', course: q.c }
        ];
        const div = document.createElement('div');
        div.className = 'question-card';
        div.innerHTML = `
      <div class="question-text">${idx + 1}. ${q.q}</div>
      <div class="options-grid">
        ${opts.map(o => `
          <button class="option-btn ${answers[idx] === o.val ? 'selected' : ''}"
            onclick="selectAnswer(${idx}, '${o.val}', '${o.course}', this, ${idx - start})">
            <span class="option-letter">${o.label}</span>
            <span>${o.text}</span>
          </button>`).join('')}
      </div>
    `;
        container.appendChild(div);
    });

    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    prevBtn.style.display = currentBatch > 0 ? '' : 'none';

    const isLast = (currentBatch + 1) * BATCH_SIZE >= allQuestions.length;
    nextBtn.textContent = isLast ? 'Ver resultado 🎯' : 'Próximas perguntas →';
}

function getOptionText(q, opt) {
    const questionOptions = {
        0: {
            A: "Gosto de entender os detalhes e descobrir como as coisas funcionam.",
            B: "Prefiro focar em como aquilo pode ajudar as pessoas.",
            C: "Costumo pensar em como aquilo pode ser utilizado de forma mais eficiente."
        },
        1: {
            A: "Procuro encontrar soluções práticas para resolver a situação.",
            B: "Sinto vontade de oferecer apoio e acolhimento.",
            C: "Tento organizar os recursos disponíveis para ajudar da melhor forma."
        },
        2: {
            A: "Gosto de analisar informações antes de tomar decisões.",
            B: "Prefiro considerar como as pessoas serão impactadas.",
            C: "Tenho satisfação em estruturar planos e acompanhar resultados."
        },
        3: {
            A: "Sim, gosto de desafios que exigem raciocínio e análise.",
            B: "Prefiro atividades que envolvam interação humana.",
            C: "Gosto quando o desafio envolve planejamento e organização."
        },
        4: {
            A: "Procuro compreender a situação antes de agir.",
            B: "Tenho facilidade para acolher e oferecer suporte emocional.",
            C: "Busco manter a organização para que tudo funcione corretamente."
        },
        5: {
            A: "Gosto de contribuir com ideias e soluções.",
            B: "Prefiro colaborar e fortalecer o trabalho em grupo.",
            C: "Sinto conforto em coordenar atividades e definir prioridades."
        },
        6: {
            A: "Prefiro momentos de concentração para resolver tarefas.",
            B: "Gosto bastante de estar em contato constante com pessoas.",
            C: "Equilibro bem interação e organização de processos."
        },
        7: {
            A: "Tenho interesse por atividades que envolvem lógica e criação.",
            B: "Me atraem mais atividades voltadas ao cuidado e à comunicação.",
            C: "Gosto de pensar em como melhorar fluxos e resultados."
        },
        8: {
            A: "Gosto de ambientes onde há desafios constantes para resolver.",
            B: "Me sinto motivado quando posso ajudar diretamente as pessoas.",
            C: "Tenho interesse em ambientes que exigem coordenação e organização."
        },
        9: {
            A: "Gosto de analisar informações e identificar padrões.",
            B: "Prefiro atividades que envolvam contato humano.",
            C: "Tenho facilidade para organizar informações e acompanhar resultados."
        },
        10: {
            A: "Gosto de explorar novidades e entender seu funcionamento.",
            B: "Me interesso mais pelo impacto dessas mudanças na vida das pessoas.",
            C: "Gosto de avaliar oportunidades e aplicações práticas."
        },
        11: {
            A: "Procuro analisar o problema e encontrar uma solução eficiente.",
            B: "Consigo manter a calma enquanto apoio quem precisa.",
            C: "Busco organizar prioridades para que tudo aconteça da melhor forma."
        },
        12: {
            A: "Gosto de criar soluções inovadoras para desafios.",
            B: "Prefiro atuar em funções com impacto direto nas pessoas.",
            C: "Tenho interesse em planejamento, metas e tomada de decisões."
        },
        13: {
            A: "Sim, gosto de investigar problemas e encontrar respostas.",
            B: "Prefiro atividades voltadas ao suporte e ao cuidado humano.",
            C: "Gosto de avaliar riscos e definir estratégias."
        },
        14: {
            A: "Criando soluções que facilitem a vida das pessoas.",
            B: "Oferecendo apoio e contribuindo para o bem-estar delas.",
            C: "Organizando recursos e processos para gerar melhores resultados."
        }
    };

    const questionIndex = allQuestions.findIndex(item => item.q === q.q);

    if (questionOptions[questionIndex]) {
        return questionOptions[questionIndex][opt];
    }

    return "";
}

function selectAnswer(qIdx, val, course, btn, batchPos) {
    answers[qIdx] = val;
    // Update UI
    const card = btn.closest('.question-card');
    card.querySelectorAll('.option-btn').forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');

    const answered = Object.keys(answers).length;
    document.getElementById('progressText').textContent = `${answered} de ${allQuestions.length}`;
    document.getElementById('progressBar').style.width = `${(answered / allQuestions.length) * 100}%`;
}

function nextBatch() {
  if (Object.keys(answers).length < quizSize) {
    showToast('⚠️ Responda todas as perguntas para continuar.');
    return;
  }

  showResult();
}

function prevBatch() {
    if (currentBatch > 0) { currentBatch--; renderBatch(); }
}

function showResult() {
    const scores = { 'Informática': 0, 'Enfermagem': 0, 'Administração': 0 };
    selectedQuestions.forEach((q, i) => {
        const ans = answers[i];
        if (!ans) return;
        const course = ans === 'A' ? q.a : ans === 'B' ? q.b : q.c;
        scores[course]++;
    });

    const winner = Object.entries(scores).sort((a, b) => b[1] - a[1])[0][0];
    const icons = { 'Informática': '💻', 'Enfermagem': '🏥', 'Administração': '📊' };
    const msgs = {
        'Informática': 'Você tem o perfil ideal para o mundo da tecnologia! Lógica, criatividade digital e paixão por inovação — o curso de Informática vai turbinar sua carreira.',
        'Enfermagem': 'Sua empatia e vocação para o cuidado humano são suas maiores forças. O curso de Enfermagem vai dar forma à sua missão de fazer diferença na saúde das pessoas.',
        'Administração': 'Você tem instinto de liderança e visão estratégica. O curso de Administração é o caminho para transformar suas ideias em resultados concretos!'
    };

    const total = quizSize;
    document.getElementById('quiz-questions').style.display = 'none';
    const resultEl = document.getElementById('quiz-result');
    resultEl.style.display = 'block';
    resultEl.innerHTML = `
    <span class="result-course-icon">${icons[winner]}</span>
    <div class="result-badge">Seu curso ideal: ${winner}</div>
    <div class="result-title">Parabéns! Encontramos sua vocação 🎉</div>
    <p class="result-msg">${msgs[winner]}</p>
    <div class="score-bars">
      ${Object.entries(scores).map(([c, s]) => `
        <div class="score-bar-item">
          <span class="score-bar-label">${icons[c]} ${c}</span>
          <div class="score-bar-track"><div class="score-bar-fill" style="width:${(s / total) * 100}%"></div></div>
          <span class="score-bar-num">${s}</span>
        </div>`).join('')}
    </div>
    <div style="display:flex; gap:1rem; justify-content:center; flex-wrap:wrap;">
      <button class="btn-primary" onclick="showPage('cadastro')">🎓 Garantir minha vaga agora</button>
      <button class="btn-secondary" onclick="startQuiz()">↺ Refazer o quiz</button>
    </div>
  `;
    setTimeout(() => {
        resultEl.querySelectorAll('.score-bar-fill').forEach(el => {
            const w = el.style.width; el.style.width = '0';
            setTimeout(() => el.style.width = w, 100);
        });
    }, 100);
}

// ===== RASPADINHA LOTERIA =====
const lotteryPrizes = [
    { icon: '🎓', name: 'Bolsa 50%', desc: '50% de desconto na mensalidade', msg: '🎓 Incrível! Você ganhou 50% de bolsa na primeira mensalidade! Informe o código BOLSA50 ao fazer sua matrícula.', rare: true },
    { icon: '👕', name: 'Camiseta', desc: 'Camiseta exclusiva KNOW', msg: '👕 Você ganhou uma camiseta exclusiva do KNOW! Retire na secretaria.', rare: false },
    { icon: '💸', name: '10% OFF', desc: '10% na primeira mensalidade', msg: '💸 10% de desconto na primeira mensalidade! Use o código SCRATCH10 na matrícula.', rare: false },
    { icon: '🎫', name: 'Evento', desc: 'Entrada gratuita no evento KNOW', msg: '🎫 Entrada gratuita no próximo evento KNOW! Apresente este resultado na entrada.', rare: false },
    { icon: '📚', name: 'Material', desc: 'Kit do 1º módulo grátis', msg: '📚 Material do 1º módulo grátis! Retire na secretaria ao fazer sua matrícula.', rare: false },
    { icon: '☕', name: 'Cafeteria', desc: 'R$30 na cafeteria', msg: '☕ R$30 em créditos na cafeteria KNOW! Apresente este resultado no balcão.', rare: false },
    { icon: '🖊️', name: 'Kit Escolar', desc: 'Kit de canetas KNOW', msg: '✏️ Você ganhou um kit escolar KNOW! Retire na secretaria.', rare: false },
    { icon: '⭐', name: 'Sorte', desc: 'Não foi desta vez...', msg: '😅 Quase lá! Tente novamente na próxima raspadinha.', rare: false },
];

// Winning combinations (indices in 3x3 grid)
const WIN_LINES = [
    [0,1,2],[3,4,5],[6,7,8],   // rows
    [0,3,6],[1,4,7],[2,5,8],   // cols
    [0,4,8],[2,4,6]            // diagonals
];

const MAX_ATTEMPTS = 3;
let scratchAttempts = 0;
let cellCanvases = [];
let cellCtxs = [];
let cellRevealed = [];
let cellPrizes = [];
let isScratching = false;
let activeCell = -1;
let lastPos = null;
let lotteryDone = false;

function getScratchData() {
    const raw = localStorage.getItem('know_scratch');
    return raw ? JSON.parse(raw) : { count: 0, prizes: [] };
}
function saveScratchData(data) {
    localStorage.setItem('know_scratch', JSON.stringify(data));
}

function initScratch() {
    const data = getScratchData();
    scratchAttempts = data.count;
    renderAttemptDots();

    if (scratchAttempts >= MAX_ATTEMPTS) {
        document.getElementById('scratchArea').style.display = 'none';
        document.getElementById('noAttemptsMsg').style.display = 'block';
        document.getElementById('lotteryResult').style.display = 'none';
        document.getElementById('newScratchBtn').style.display = 'none';
        document.getElementById('scratchCadBtn').style.display = 'none';
        return;
    }

    document.getElementById('noAttemptsMsg').style.display = 'none';
    document.getElementById('scratchArea').style.display = 'block';
    document.getElementById('lotteryResult').style.display = 'none';
    document.getElementById('newScratchBtn').style.display = 'none';
    document.getElementById('scratchCadBtn').style.display = 'none';
    buildLotteryTicket();
}

function renderAttemptDots() {
    const wrap = document.getElementById('attemptsDots');
    if (!wrap) return;
    wrap.innerHTML = '';
    for (let i = 0; i < MAX_ATTEMPTS; i++) {
        const dot = document.createElement('div');
        dot.className = 'attempt-dot' + (i < scratchAttempts ? ' used' : '');
        wrap.appendChild(dot);
    }
}

function buildLotteryTicket() {
    // Random serial
    const serial = 'Nº ' + String(Math.floor(Math.random() * 999999)).padStart(6, '0');
    document.getElementById('ticketSerial').textContent = serial;

    // Generate 9 cell prizes — ensure at least one win line occasionally
    cellPrizes = generateCellPrizes();
    cellRevealed = Array(9).fill(false);
    lotteryDone = false;

    // Build legend
    const legendEl = document.getElementById('legendItems');
    legendEl.innerHTML = lotteryPrizes.filter(p => !p.rare || p.rare).slice(0, 6).map(p => `
        <div class="legend-item">
            <span class="li-icon">${p.icon}</span>
            <span class="li-name">${p.name}</span>
        </div>`).join('');

    // Max prize hint
    document.getElementById('ticketPrizeHint').textContent = 'PRÊMIO MÁX: ' + lotteryPrizes[0].name.toUpperCase();

    // Build grid cells
    const grid = document.getElementById('scratchGrid');
    grid.innerHTML = '';
    cellCanvases = [];
    cellCtxs = [];

    cellPrizes.forEach((prize, i) => {
        const cell = document.createElement('div');
        cell.className = 'scratch-cell';
        cell.id = 'cell-' + i;

        // Prize reveal layer
        cell.innerHTML = `
            <div class="scratch-cell-prize">
                <span class="cell-icon">${prize.icon}</span>
                <span class="cell-label">${prize.name}</span>
            </div>`;

        // Canvas overlay
        const canvas = document.createElement('canvas');
        canvas.style.cssText = 'display:block; position:absolute; inset:0; width:100%; height:100%; touch-action:none;';
        cell.appendChild(canvas);
        grid.appendChild(cell);

        cellCanvases.push(canvas);
        cellCtxs.push(null); // init lazily after layout

        // Events
        cell.addEventListener('mousedown', (e) => { e.preventDefault(); startCellScratch(i, e); });
        cell.addEventListener('mousemove', (e) => { e.preventDefault(); doCellScratch(i, e); });
        cell.addEventListener('mouseup', endCellScratch);
        cell.addEventListener('mouseleave', endCellScratch);
        cell.addEventListener('touchstart', (e) => { e.preventDefault(); startCellScratchTouch(i, e); }, { passive: false });
        cell.addEventListener('touchmove', (e) => { e.preventDefault(); doCellScratchTouch(i, e); }, { passive: false });
        cell.addEventListener('touchend', endCellScratch);
    });

    // Init canvases after layout
    requestAnimationFrame(() => {
        cellCanvases.forEach((canvas, i) => {
            const rect = canvas.parentElement.getBoundingClientRect();
            const w = Math.round(rect.width) || 100;
            const h = Math.round(rect.height) || 100;
            canvas.width = w;
            canvas.height = h;
            const ctx = canvas.getContext('2d');
            cellCtxs[i] = ctx;
            drawCellOverlay(ctx, w, h, i);
        });
    });
}

function generateCellPrizes() {
    // Pick 6 non-rare prizes for the pool
    const pool = lotteryPrizes.filter(p => p.name !== 'Sorte');
    const result = [];

    // ~30% chance of a winning line
    const hasWin = Math.random() < 0.3;
    if (hasWin) {
        const winLine = WIN_LINES[Math.floor(Math.random() * WIN_LINES.length)];
        const winPrize = pool[Math.floor(Math.random() * (pool.length - 1)) + 1]; // avoid rare bolsa
        for (let i = 0; i < 9; i++) result.push(null);
        winLine.forEach(idx => result[idx] = winPrize);
        // Fill rest with varied prizes
        for (let i = 0; i < 9; i++) {
            if (!result[i]) result[i] = pool[Math.floor(Math.random() * pool.length)];
        }
    } else {
        // No win — make sure no 3 match on any line
        let attempts = 0;
        do {
            for (let i = 0; i < 9; i++) result[i] = pool[Math.floor(Math.random() * pool.length)];
            attempts++;
        } while (attempts < 20 && checkForWin(result) !== null);
    }
    return result;
}

function drawCellOverlay(ctx, w, h, index) {
    // Background gradient — lottery silver/purple
    const colors = [
        ['#8B2FC9','#6B0FA8'],['#9B3FD9','#7A1AB8'],['#7A1AB8','#5A0088'],
        ['#6B0FA8','#4A0076'],['#A040D0','#8020B0'],['#5A0088','#3D0066'],
        ['#8B2FC9','#7A1AB8'],['#7020B0','#5A0090'],['#9B3FD9','#6B0FA8']
    ];
    const [c1,c2] = colors[index % colors.length];
    const grad = ctx.createLinearGradient(0, 0, w, h);
    grad.addColorStop(0, c1);
    grad.addColorStop(1, c2);
    ctx.fillStyle = grad;
    ctx.roundRect ? ctx.roundRect(0, 0, w, h, 8) : ctx.fillRect(0, 0, w, h);
    ctx.fill();

    // Shimmer dots
    ctx.fillStyle = 'rgba(255,255,255,0.07)';
    for (let i = 0; i < 30; i++) {
        ctx.beginPath();
        ctx.arc(Math.random()*w, Math.random()*h, Math.random()*3+1, 0, Math.PI*2);
        ctx.fill();
    }

    // Star pattern
    ctx.fillStyle = 'rgba(200,255,0,0.12)';
    ctx.font = `${Math.min(w,h)*0.35}px serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('★', w/2, h/2);

    // "RASPE" text
    ctx.fillStyle = 'rgba(255,255,255,0.45)';
    ctx.font = `bold ${Math.min(w,h)*0.14}px Space Grotesk, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('RASPE', w/2, h*0.7);
}

function getCellPos(e, canvas) {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    return {
        x: (e.clientX - rect.left) * scaleX,
        y: (e.clientY - rect.top) * scaleY
    };
}

function startCellScratch(i, e) {
    if (cellRevealed[i] || lotteryDone) return;
    isScratching = true;
    activeCell = i;
    lastPos = getCellPos(e, cellCanvases[i]);
}
function startCellScratchTouch(i, e) {
    if (cellRevealed[i] || lotteryDone) return;
    isScratching = true;
    activeCell = i;
    const t = e.touches[0];
    const rect = cellCanvases[i].getBoundingClientRect();
    const scaleX = cellCanvases[i].width / rect.width;
    const scaleY = cellCanvases[i].height / rect.height;
    lastPos = { x: (t.clientX - rect.left) * scaleX, y: (t.clientY - rect.top) * scaleY };
}
function doCellScratch(i, e) {
    if (!isScratching || activeCell !== i) return;
    const pos = getCellPos(e, cellCanvases[i]);
    scratchCellAt(i, pos);
}
function doCellScratchTouch(i, e) {
    if (!isScratching || activeCell !== i) return;
    const t = e.touches[0];
    const rect = cellCanvases[i].getBoundingClientRect();
    const scaleX = cellCanvases[i].width / rect.width;
    const scaleY = cellCanvases[i].height / rect.height;
    scratchCellAt(i, { x: (t.clientX - rect.left) * scaleX, y: (t.clientY - rect.top) * scaleY });
}
function endCellScratch() {
    isScratching = false;
    lastPos = null;
}

function scratchCellAt(i, pos) {
    const ctx = cellCtxs[i];
    if (!ctx || cellRevealed[i]) return;
    ctx.globalCompositeOperation = 'destination-out';
    const r = cellCanvases[i].width * 0.18;
    ctx.beginPath();
    ctx.arc(pos.x, pos.y, r, 0, Math.PI*2);
    ctx.fill();
    if (lastPos) {
        ctx.lineWidth = r * 2;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(lastPos.x, lastPos.y);
        ctx.lineTo(pos.x, pos.y);
        ctx.stroke();
    }
    lastPos = pos;
    checkCellReveal(i);
}

function checkCellReveal(i) {
    const canvas = cellCanvases[i];
    const ctx = cellCtxs[i];
    const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    let transparent = 0;
    for (let j = 3; j < data.length; j += 4) if (data[j] < 128) transparent++;
    const ratio = transparent / (canvas.width * canvas.height);
    if (ratio > 0.5 && !cellRevealed[i]) {
        cellRevealed[i] = true;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        document.getElementById('cell-'+i).classList.add('revealed');

        // Check if all revealed
        if (cellRevealed.every(Boolean)) finalizeLottery();
    }
}

function checkForWin(prizes) {
    for (const line of WIN_LINES) {
        const [a,b,c] = line;
        if (prizes[a] && prizes[b] && prizes[c] &&
            prizes[a].name === prizes[b].name &&
            prizes[b].name === prizes[c].name) {
            return { line, prize: prizes[a] };
        }
    }
    return null;
}

function finalizeLottery() {
    if (lotteryDone) return;
    lotteryDone = true;

    const win = checkForWin(cellPrizes);

    // Save attempt
    const data = getScratchData();
    data.count++;
    data.prizes.push(win ? win.prize.name : 'Sem prêmio');
    saveScratchData(data);
    scratchAttempts = data.count;
    renderAttemptDots();

    if (win) {
        // Highlight winning cells
        win.line.forEach(idx => {
            document.getElementById('cell-'+idx).classList.add('winner-cell');
        });

        // Confetti
        launchConfetti();

        const resultEl = document.getElementById('lotteryResult');
        document.getElementById('lotteryResultIcon').textContent = win.prize.icon;
        document.getElementById('lotteryResultTitle').textContent = '🎉 VOCÊ GANHOU!';
        document.getElementById('lotteryResultMsg').textContent = win.prize.msg;
        resultEl.style.display = 'block';
        showToast('🎉 Você ganhou: ' + win.prize.name + '!');
    } else {
        const resultEl = document.getElementById('lotteryResult');
        document.getElementById('lotteryResultIcon').textContent = '😅';
        document.getElementById('lotteryResultTitle').textContent = 'Não foi desta vez!';
        document.getElementById('lotteryResultMsg').textContent = 'Tente novamente — você pode ter mais sorte na próxima raspadinha!';
        resultEl.style.display = 'block';
        showToast('Sem combinação desta vez. Tente de novo!');
    }

    document.getElementById('scratchCadBtn').style.display = '';
    if (scratchAttempts < MAX_ATTEMPTS) {
        document.getElementById('newScratchBtn').style.display = '';
    } else {
        setTimeout(() => {
            document.getElementById('scratchArea').style.display = 'none';
            document.getElementById('noAttemptsMsg').style.display = 'block';
        }, 4000);
    }
}

function launchConfetti() {
    const container = document.getElementById('ticketConfetti');
    if (!container) return;
    container.style.display = 'block';
    container.innerHTML = '';
    const colors = ['#C8FF00','#FFE000','#B66EF0','#FF3CAC','#fff','#6B0FA8'];
    for (let i = 0; i < 50; i++) {
        const piece = document.createElement('div');
        piece.className = 'confetti-piece';
        piece.style.cssText = `
            left: ${Math.random()*100}%;
            top: ${-10 + Math.random()*30}px;
            background: ${colors[Math.floor(Math.random()*colors.length)]};
            width: ${5 + Math.random()*8}px;
            height: ${5 + Math.random()*8}px;
            animation-duration: ${0.8 + Math.random()*1.2}s;
            animation-delay: ${Math.random()*0.5}s;
        `;
        container.appendChild(piece);
    }
    setTimeout(() => { container.style.display = 'none'; container.innerHTML = ''; }, 2500);
}

function newScratch() {
    if (scratchAttempts >= MAX_ATTEMPTS) { showToast('Suas tentativas acabaram!'); return; }
    document.getElementById('lotteryResult').style.display = 'none';
    document.getElementById('newScratchBtn').style.display = 'none';
    document.getElementById('scratchCadBtn').style.display = 'none';
    buildLotteryTicket();
}

// ===== CADASTRO =====
function validateForm() {
    let valid = true;
    const fields = [
        { id: 'f-nome', fgId: 'fg-nome', check: v => v.trim().length >= 3 },
        { id: 'f-idade', fgId: 'fg-idade', check: v => { const n = parseInt(v); return !isNaN(n) && n >= 14 && n <= 80; } },
        { id: 'f-email', fgId: 'fg-email', check: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) },
        { id: 'f-curso', fgId: 'fg-curso', check: v => v !== '' }
    ];
    fields.forEach(f => {
        const el = document.getElementById(f.id);
        const fg = document.getElementById(f.fgId);
        if (f.check(el.value)) {
            fg.classList.remove('has-error');
        } else {
            fg.classList.add('has-error');
            valid = false;
        }
    });
    return valid;
}

function submitForm() {
    if (!validateForm()) { showToast('⚠️ Verifique os campos antes de continuar.'); return; }

    const student = {
        id: Date.now(),
        nome: document.getElementById('f-nome').value.trim(),
        idade: document.getElementById('f-idade').value,
        email: document.getElementById('f-email').value.trim(),
        curso: document.getElementById('f-curso').value,
        data: new Date().toLocaleDateString('pt-BR')
    };

    const students = JSON.parse(localStorage.getItem('know_students') || '[]');
    students.push(student);
    localStorage.setItem('know_students', JSON.stringify(students));

    // Reset form
    ['f-nome', 'f-idade', 'f-email', 'f-curso'].forEach(id => {
        const el = document.getElementById(id);
        el.value = el.tagName === 'SELECT' ? '' : '';
    });
    ['fg-nome', 'fg-idade', 'fg-email', 'fg-curso'].forEach(id => document.getElementById(id).classList.remove('has-error'));

    const succ = document.getElementById('formSuccess');
    succ.classList.add('visible');
    setTimeout(() => succ.classList.remove('visible'), 4000);

    renderStudentsTable();
    showToast('✅ Cadastro realizado com sucesso!');
}

function deleteStudent(id) {
    const students = JSON.parse(localStorage.getItem('know_students') || '[]');
    const updated = students.filter(s => s.id !== id);
    localStorage.setItem('know_students', JSON.stringify(updated));
    renderStudentsTable();
    showToast('🗑️ Cadastro removido.');
}

function renderStudentsTable() {
    const students = JSON.parse(localStorage.getItem('know_students') || '[]');
    const wrap = document.getElementById('studentsTableWrap');
    const count = document.getElementById('studentsCount');
    count.textContent = `${students.length} cadastro${students.length !== 1 ? 's' : ''}`;

    if (students.length === 0) {
        wrap.innerHTML = `<div class="empty-state"><span>📋</span><p>Nenhum candidato cadastrado ainda. Seja o primeiro!</p></div>`;
        return;
    }

    const pillClass = { 'Informática': 'pill-info', 'Enfermagem': 'pill-enf', 'Administração': 'pill-adm' };

    wrap.innerHTML = `
    <div style="overflow-x: auto; border-radius: ${getComputedStyle(document.documentElement).getPropertyValue('--radius-sm')}; overflow: hidden;">
    <table class="students-table">
      <thead>
        <tr>
          <th>#</th>
          <th>Nome</th>
          <th>Idade</th>
          <th>E-mail</th>
          <th>Curso</th>
          <th>Data</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        ${students.map((s, i) => `
          <tr>
            <td style="color:var(--gray-300); font-size:0.8rem">${i + 1}</td>
            <td><strong style="color:var(--dark)">${s.nome}</strong></td>
            <td>${s.idade} anos</td>
            <td style="font-size:0.82rem; color:var(--gray-500)">${s.email}</td>
            <td><span class="course-pill ${pillClass[s.curso] || ''}">${s.curso}</span></td>
            <td style="font-size:0.8rem; color:var(--gray-300)">${s.data}</td>
            <td><button class="delete-btn" onclick="deleteStudent(${s.id})" title="Remover">✕</button></td>
          </tr>`).join('')}
      </tbody>
    </table>
    </div>
  `;
}

// Init
renderStudentsTable();