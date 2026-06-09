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

// ===== RASPADINHA =====
const prizes = [
    { icon: '👕', name: 'Camiseta KNOW', subtitle: 'Camiseta exclusiva da escola', msg: '🎉 Você ganhou uma camiseta exclusiva do KNOW! Apresente este resultado na secretaria para retirar.' },
    { icon: '🖊️', name: 'Kit de Canetas', subtitle: 'Kit escolar KNOW', msg: '✏️ Você ganhou um kit de canetas KNOW! Retire na secretaria da escola.' },
    { icon: '💸', name: '10% de Desconto', subtitle: 'Na sua primeira mensalidade', msg: '💰 10% de desconto na primeira mensalidade! Informe o código SCRATCH10 ao fazer sua matrícula.' },
    { icon: '🎫', name: 'Entrada Gratuita', subtitle: 'Em nosso próximo evento', msg: '🎫 Entrada gratuita no próximo evento KNOW! Apresente este resultado na entrada.' },
    { icon: '📚', name: 'Material Didático', subtitle: 'Kit do 1º módulo grátis', msg: '📚 Material do 1º módulo grátis! Retire na secretaria ao fazer sua matrícula.' },
    { icon: '☕', name: 'Cafeteria KNOW', subtitle: 'R$30 em créditos', msg: '☕ R$30 em créditos na cafeteria! Apresente este resultado no balcão.' }
];

const MAX_ATTEMPTS = 3;
let scratchAttempts = 0;
let currentPrize = null;
let isScratching = false;
let scratchRevealed = false;
let scratchCtx = null;
let lastPos = null;

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
        document.getElementById('scratchMsg').classList.remove('visible');
        return;
    }

    document.getElementById('noAttemptsMsg').style.display = 'none';
    document.getElementById('scratchArea').style.display = 'block';
    setupNewCard();
}

function renderAttemptDots() {
    const wrap = document.getElementById('attemptsDots');
    wrap.innerHTML = '';
    for (let i = 0; i < MAX_ATTEMPTS; i++) {
        const dot = document.createElement('div');
        dot.className = 'attempt-dot' + (i < scratchAttempts ? ' used' : '');
        wrap.appendChild(dot);
    }
}

function setupNewCard() {
    currentPrize = prizes[Math.floor(Math.random() * prizes.length)];
    document.getElementById('prizeIcon').textContent = currentPrize.icon;
    document.getElementById('prizeName').textContent = currentPrize.name;
    document.getElementById('prizeSubtitle').textContent = currentPrize.subtitle;
    document.getElementById('scratchMsg').classList.remove('visible');
    document.getElementById('newScratchBtn').style.display = 'none';
    document.getElementById('scratchCadBtn').style.display = 'none';
    scratchRevealed = false;

    const canvas = document.getElementById('scratchCanvas');
    scratchCtx = canvas.getContext('2d');
    scratchCtx.clearRect(0, 0, canvas.width, canvas.height);

    // Silver scratch layer
    const grad = scratchCtx.createLinearGradient(0, 0, canvas.width, canvas.height);
    grad.addColorStop(0, '#8B2FC9');
    grad.addColorStop(0.3, '#A040D0');
    grad.addColorStop(0.6, '#7A1AB8');
    grad.addColorStop(1, '#6B0FA8');
    scratchCtx.fillStyle = grad;
    scratchCtx.fillRect(0, 0, canvas.width, canvas.height);

    // Texture dots
    scratchCtx.fillStyle = 'rgba(255,255,255,0.06)';
    for (let i = 0; i < 200; i++) {
        scratchCtx.beginPath();
        scratchCtx.arc(Math.random() * 340, Math.random() * 220, Math.random() * 4 + 1, 0, Math.PI * 2);
        scratchCtx.fill();
    }

    // Instruction text
    scratchCtx.fillStyle = 'rgba(255,255,255,0.5)';
    scratchCtx.font = 'bold 22px Space Grotesk, sans-serif';
    scratchCtx.textAlign = 'center';
    scratchCtx.fillText('✦ RASPE AQUI ✦', 170, 95);
    scratchCtx.font = '14px DM Sans, sans-serif';
    scratchCtx.fillStyle = 'rgba(255,255,255,0.35)';
    scratchCtx.fillText('Use o mouse ou o dedo', 170, 125);
    scratchCtx.fillText('para raspar a área', 170, 145);

    scratchCtx.globalCompositeOperation = 'source-over';

    const wrap = document.getElementById('scratchWrap');
    wrap.onmousedown = startScratch;
    wrap.onmousemove = doScratch;
    wrap.onmouseup = endScratch;
    wrap.onmouseleave = endScratch;
    wrap.ontouchstart = startScratchTouch;
    wrap.ontouchmove = doScratchTouch;
    wrap.ontouchend = endScratch;
}

function getPos(e) {
    const rect = document.getElementById('scratchCanvas').getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
}

function startScratch(e) { isScratching = true; lastPos = getPos(e); }
function startScratchTouch(e) { e.preventDefault(); isScratching = true; const t = e.touches[0]; const rect = document.getElementById('scratchCanvas').getBoundingClientRect(); lastPos = { x: t.clientX - rect.left, y: t.clientY - rect.top }; }
function doScratchTouch(e) { e.preventDefault(); if (!isScratching) return; const t = e.touches[0]; const rect = document.getElementById('scratchCanvas').getBoundingClientRect(); scratchAt({ x: t.clientX - rect.left, y: t.clientY - rect.top }); }

function doScratch(e) { if (!isScratching) return; scratchAt(getPos(e)); }

function scratchAt(pos) {
    if (!scratchCtx || scratchRevealed) return;
    scratchCtx.globalCompositeOperation = 'destination-out';
    scratchCtx.beginPath();
    scratchCtx.arc(pos.x, pos.y, 28, 0, Math.PI * 2);
    scratchCtx.fill();
    if (lastPos) {
        scratchCtx.lineWidth = 56;
        scratchCtx.lineCap = 'round';
        scratchCtx.beginPath();
        scratchCtx.moveTo(lastPos.x, lastPos.y);
        scratchCtx.lineTo(pos.x, pos.y);
        scratchCtx.stroke();
    }
    lastPos = pos;
    checkReveal();
}

function endScratch() { isScratching = false; lastPos = null; }

function checkReveal() {
    const canvas = document.getElementById('scratchCanvas');
    const imgData = scratchCtx.getImageData(0, 0, canvas.width, canvas.height);
    let transparent = 0;
    for (let i = 3; i < imgData.data.length; i += 4) {
        if (imgData.data[i] < 128) transparent++;
    }
    const ratio = transparent / (canvas.width * canvas.height);
    if (ratio > 0.55 && !scratchRevealed) revealPrize();
}

function revealPrize() {
    scratchRevealed = true;
    const canvas = document.getElementById('scratchCanvas');
    scratchCtx.clearRect(0, 0, canvas.width, canvas.height);

    const data = getScratchData();
    data.count++;
    data.prizes.push(currentPrize.name);
    saveScratchData(data);
    scratchAttempts = data.count;
    renderAttemptDots();

    const msg = document.getElementById('scratchMsg');
    document.getElementById('scratchMsgTitle').textContent = `${currentPrize.icon} ${currentPrize.name}`;
    document.getElementById('scratchMsgText').textContent = currentPrize.msg;
    msg.classList.add('visible');

    document.getElementById('scratchCadBtn').style.display = '';
    if (scratchAttempts < MAX_ATTEMPTS) {
        document.getElementById('newScratchBtn').style.display = '';
    } else {
        setTimeout(() => {
            document.getElementById('scratchArea').style.display = 'none';
            document.getElementById('noAttemptsMsg').style.display = 'block';
        }, 3500);
    }

    showToast(`🎉 Você ganhou: ${currentPrize.name}!`);

    // Celebrate animation
    const prizeBg = document.getElementById('prizeBg');
    prizeBg.style.animation = 'none';
    prizeBg.style.transform = 'scale(1.04)';
    setTimeout(() => prizeBg.style.transform = '', 400);
}

function newScratch() {
    if (scratchAttempts >= MAX_ATTEMPTS) { showToast('Suas tentativas acabaram!'); return; }
    setupNewCard();
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