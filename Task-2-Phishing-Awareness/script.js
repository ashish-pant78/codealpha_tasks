/* ============================================
   SENTRYNET — Phishing Awareness Training
   script.js
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  initBackground();
  initNavbar();
  initRevealOnScroll();
  initTerminalTyping();
  initAttackFlow();
  initTypeCards();
  initEmailDemo();
  initUrlAnalyzer();
  initTacticCards();
  initScenarios();
  initRedFlags();
  initSafetyGrid();
  initChallenge();
  initQuiz();
});

/* ============================================
   BACKGROUND ANIMATION — cyber grid + particles
   ============================================ */
function initBackground() {
  const canvas = document.getElementById('bg-canvas');
  const ctx = canvas.getContext('2d');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let width, height, particles = [];
  const PARTICLE_COUNT = 55;
  const MAX_DIST = 130;

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }

  function createParticles() {
    particles = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        r: Math.random() * 1.5 + 0.5
      });
    }
  }

  function drawGrid() {
    const gridSize = 60;
    ctx.strokeStyle = 'rgba(6, 214, 160, 0.045)';
    ctx.lineWidth = 1;
    for (let x = 0; x < width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 0; y < height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }
  }

  function step() {
    ctx.clearRect(0, 0, width, height);
    drawGrid();

    // update + draw particles
    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0 || p.x > width) p.vx *= -1;
      if (p.y < 0 || p.y > height) p.vy *= -1;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(34, 211, 238, 0.55)';
      ctx.fill();
    });

    // connecting lines
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < MAX_DIST) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(6, 214, 160, ${0.12 * (1 - dist / MAX_DIST)})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    }

    if (!reduceMotion) requestAnimationFrame(step);
  }

  resize();
  createParticles();
  window.addEventListener('resize', () => { resize(); createParticles(); });

  if (reduceMotion) {
    // draw a single static frame
    step();
  } else {
    requestAnimationFrame(step);
  }
}

/* ============================================
   NAVBAR — scroll effects, hamburger, active link
   ============================================ */
function initNavbar() {
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('nav-links');
  const links = document.querySelectorAll('.nav-link');

  hamburger.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    hamburger.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', String(isOpen));
  });

  links.forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
    });
  });

  // Active section indicator via IntersectionObserver
  const sections = Array.from(links)
    .map(l => document.getElementById(l.dataset.section))
    .filter(Boolean);

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        links.forEach(l => l.classList.toggle('active', l.dataset.section === id));
      }
    });
  }, { rootMargin: '-45% 0px -45% 0px', threshold: 0 });

  sections.forEach(s => observer.observe(s));
}

/* ============================================
   REVEAL ON SCROLL
   ============================================ */
function initRevealOnScroll() {
  const items = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  items.forEach(item => observer.observe(item));
}

/* ============================================
   TERMINAL TYPING EFFECT
   ============================================ */
function initTerminalTyping() {
  const el = document.getElementById('terminal-typed');
  const lines = [
    '> SYSTEM STATUS',
    '> THREAT AWARENESS: ACTIVE',
    '> PHISHING DETECTION: READY',
    '> USER SECURITY: PROTECTED'
  ];
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (reduceMotion) {
    el.textContent = lines.join('\n');
    return;
  }

  let lineIndex = 0, charIndex = 0, output = '';

  function typeChar() {
    if (lineIndex >= lines.length) return;
    const currentLine = lines[lineIndex];
    if (charIndex < currentLine.length) {
      output += currentLine[charIndex];
      el.textContent = output;
      charIndex++;
      setTimeout(typeChar, 18);
    } else {
      output += '\n';
      el.textContent = output;
      lineIndex++;
      charIndex = 0;
      setTimeout(typeChar, 250);
    }
  }
  setTimeout(typeChar, 500);
}

/* ============================================
   ATTACK FLOW — interactive steps
   ============================================ */
function initAttackFlow() {
  const explanations = {
    attacker: 'The attacker chooses a target — this could be an individual, a company employee, or a large group of random people. They research what message would seem believable.',
    message: 'A fake message is crafted to look like it comes from a trusted source: a bank, a delivery company, a coworker, or a well-known brand.',
    click: 'The victim, believing the message is real, clicks a link or opens an attachment — often while feeling rushed or worried.',
    site: 'The link leads to a fake website built to look identical to the real one, often with a very similar web address.',
    entered: 'The victim types in a password, OTP, or payment details on the fake page — the information goes straight to the attacker.',
    access: 'The attacker now has valid credentials and can log in to real accounts, steal money, or use the access to attack others.'
  };

  const steps = document.querySelectorAll('.flow-step');
  const panel = document.getElementById('flow-explanation');

  steps.forEach(step => {
    step.addEventListener('click', () => {
      steps.forEach(s => s.classList.remove('active'));
      step.classList.add('active');
      const key = step.dataset.step;
      panel.innerHTML = `<p><strong>${step.textContent.trim()}:</strong> ${explanations[key]}</p>`;
    });
  });
}

/* ============================================
   TYPES OF PHISHING — data-driven cards
   ============================================ */
function initTypeCards() {
  const data = [
    {
      icon: '📧', title: 'Email Phishing',
      def: 'Attackers send fake emails pretending to be legitimate organizations, hoping you\'ll click a link or hand over information.',
      example: 'An email claiming to be from a delivery company asking you to "confirm" a package by logging in.',
      warning: 'Generic greetings, urgent tone, mismatched sender address.',
      safe: 'Verify by visiting the official website directly, not through the email link.'
    },
    {
      icon: '🎯', title: 'Spear Phishing',
      def: 'A targeted phishing attack aimed at a specific person or organization, using personal details to seem more convincing.',
      example: 'An email that uses your real name, job title, and manager\'s name to request an urgent wire transfer.',
      warning: 'Unusual requests from someone claiming to be a colleague or executive.',
      safe: 'Confirm unusual requests through a separate communication channel, like a phone call.'
    },
    {
      icon: '📱', title: 'Smishing',
      def: 'Phishing carried out through SMS text messages or messaging apps.',
      example: 'A text claiming your package is stuck and asking you to pay a small "customs fee" via a link.',
      warning: 'Unexpected texts with links from unknown or unusual numbers.',
      safe: 'Never tap links in unexpected texts — go to the official app or website instead.'
    },
    {
      icon: '📞', title: 'Vishing',
      def: 'Phishing conducted through phone calls or voice messages, often impersonating a bank or government agency.',
      example: 'A caller claiming to be from your bank\'s fraud department, asking you to "confirm" your card number.',
      warning: 'Callers creating urgency and asking for sensitive details over the phone.',
      safe: 'Hang up and call the organization back using the number on their official website.'
    },
    {
      icon: '🪞', title: 'Clone Phishing',
      def: 'Attackers copy a real, previously-seen legitimate message and replace its links or attachments with malicious ones.',
      example: 'A "resend" of a newsletter you already received, but this time with a dangerous attachment.',
      warning: 'A duplicate message you\'ve already seen, arriving again unexpectedly.',
      safe: 'Compare against the original message and verify with the sender directly if unsure.'
    },
    {
      icon: '🔲', title: 'QR Phishing',
      def: 'Malicious QR codes redirect users to fake websites designed to steal credentials or install malware.',
      example: 'A QR code sticker placed over a legitimate one on a parking meter or restaurant menu.',
      warning: 'QR codes in unexpected places, or codes that replace an existing one.',
      safe: 'Preview the URL before opening it, and avoid scanning codes from unverified sources.'
    }
  ];

  const grid = document.getElementById('type-grid');
  grid.innerHTML = data.map(item => `
    <div class="type-card">
      <span class="card-icon" aria-hidden="true">${item.icon}</span>
      <h3>${item.title}</h3>
      <p>${item.def}</p>
      <p class="card-sub-label">Example</p>
      <p>${item.example}</p>
      <p class="card-sub-label">Warning Signs</p>
      <p>${item.warning}</p>
      <p class="card-sub-label">Stay Safe</p>
      <p>${item.safe}</p>
    </div>
  `).join('');
}

/* ============================================
   EMAIL DEMO — clickable hotspots
   ============================================ */
function initEmailDemo() {
  const explanations = {
    sender: {
      title: 'Sender Address',
      body: 'The display name "Account Security" can be set to anything by the attacker — it does not prove who actually sent the email. Always check the full email address after the @ symbol, not just the friendly name.'
    },
    urgent: {
      title: 'Urgent Language',
      body: 'Words like "URGENT" and "suspended" are designed to make you panic and act quickly, before you have time to think carefully or verify the request.'
    },
    link: {
      title: 'Suspicious Link',
      body: 'Before clicking any link, hover over it (on desktop) or long-press it (on mobile) to preview the actual destination. If the address looks unfamiliar or unrelated to the company, don\'t click it.'
    },
    attachment: {
      title: 'Unexpected Attachment',
      body: 'Attachments you weren\'t expecting can contain malware. Even file types that seem harmless, like PDFs or Word documents, can be dangerous.'
    },
    sensitive: {
      title: 'Requests for Sensitive Information',
      body: 'Legitimate organizations generally never ask you to send your password or OTP through email or text. Anyone requesting this is almost always attempting fraud.'
    },
    grammar: {
      title: 'Spelling & Grammar',
      body: 'Mistakes like "Thnak you" can be a warning sign, but don\'t rely on this alone — many phishing emails today are professionally written and error-free.'
    }
  };

  const hotspots = document.querySelectorAll('.email-hotspot');
  const panel = document.getElementById('email-explanation');

  hotspots.forEach(spot => {
    spot.addEventListener('click', () => {
      hotspots.forEach(s => s.classList.remove('selected'));
      spot.classList.add('selected');
      const data = explanations[spot.dataset.part];
      panel.innerHTML = `<h3>${data.title}</h3><p>${data.body}</p>`;
    });
  });
}

/* ============================================
   URL ANALYZER
   ============================================ */
function initUrlAnalyzer() {
  const explanations = {
    protocol: '<strong>Protocol (https://)</strong> — This means the connection is encrypted so nobody can eavesdrop on the data in transit. It does NOT mean the website itself is trustworthy — phishing sites use HTTPS too.',
    subdomain: '<strong>Subdomain</strong> — The part before the main domain. Attackers often add words like "accounts-secure." to make a fake domain look official.',
    domain: '<strong>Domain Name</strong> — The core name of the website. This is the most important part to check. Look closely — attackers use lookalike names such as extra words or swapped letters.',
    tld: '<strong>Top-Level Domain (.test)</strong> — The suffix like .com, .net, or .test. Attackers sometimes use unusual or unexpected TLDs to register cheap lookalike domains.',
    path: '<strong>Path</strong> — The part after the domain, like /signin/update. It can be worded to look convincing, but it doesn\'t change which website you\'re actually on.'
  };

  const parts = document.querySelectorAll('.url-part');
  const panel = document.getElementById('analyzer-explanation');

  parts.forEach(part => {
    part.addEventListener('click', () => {
      parts.forEach(p => p.classList.remove('active'));
      part.classList.add('active');
      panel.innerHTML = `<p>${explanations[part.dataset.part]}</p>`;
    });
  });
}

/* ============================================
   SOCIAL ENGINEERING TACTIC CARDS
   ============================================ */
function initTacticCards() {
  const data = [
    {
      icon: '⏱️', title: 'Urgency',
      what: 'Creating pressure to act immediately, leaving no time to think.',
      how: 'Attackers use countdowns and deadlines to short-circuit careful judgment.',
      example: '"Your account will be deleted in 10 minutes unless you verify now."',
      response: 'Stop. Verify. Act. Real organizations rarely give minutes-long deadlines.'
    },
    {
      icon: '😨', title: 'Fear',
      what: 'Using threats of loss, legal trouble, or danger to provoke a reaction.',
      how: 'A scary claim makes people focus on the threat rather than checking if it\'s real.',
      example: '"Unusual login detected. Your account is compromised — act now."',
      response: 'Take a breath, then verify independently through an official app or website.'
    },
    {
      icon: '👮', title: 'Authority',
      what: 'Pretending to be a boss, government agency, bank, or IT department.',
      how: 'People are less likely to question requests that appear to come from authority.',
      example: '"This is IT Support — we need your password to fix a security issue."',
      response: 'Real IT and security teams never ask for your password directly.'
    },
    {
      icon: '❓', title: 'Curiosity',
      what: 'Using intriguing or mysterious messages to tempt a click.',
      how: 'Curiosity overrides caution, especially with vague, tempting subject lines.',
      example: '"See who viewed your profile" or "A photo of you was shared."',
      response: 'Ignore vague, curiosity-based prompts from unknown senders.'
    },
    {
      icon: '🎁', title: 'Greed / Rewards',
      what: 'Offering money, prizes, or opportunities that seem too good to pass up.',
      how: 'The promise of a reward distracts from red flags in the message.',
      example: '"You\'ve won a gift card! Claim it within 24 hours."',
      response: 'If it sounds too good to be true, it almost always is.'
    },
    {
      icon: '🤝', title: 'Trust',
      what: 'Building rapport or referencing shared context to seem legitimate.',
      how: 'Attackers may reference real events, coworkers, or ongoing projects.',
      example: 'An email referencing a real recent company event, followed by a malicious request.',
      response: 'Trust the verification process, not just familiar-sounding details.'
    },
    {
      icon: '🎭', title: 'Impersonation',
      what: 'Pretending to be someone you know or a brand you trust.',
      how: 'A fake identity — a coworker, executive, or company — lowers your guard.',
      example: 'A message that looks like it\'s from your manager asking for gift cards urgently.',
      response: 'Confirm unusual requests through a different, trusted communication channel.'
    }
  ];

  const grid = document.getElementById('tactic-grid');
  grid.innerHTML = data.map(item => `
    <div class="tactic-card">
      <span class="card-icon" aria-hidden="true">${item.icon}</span>
      <h3>${item.title}</h3>
      <p>${item.what}</p>
      <p class="card-sub-label">How Attackers Use It</p>
      <p>${item.how}</p>
      <p class="card-sub-label">Example</p>
      <p>"${item.example}"</p>
      <p class="card-sub-label">Safe Response</p>
      <p>${item.response}</p>
    </div>
  `).join('');
}

/* ============================================
   REAL-WORLD SCENARIOS
   ============================================ */
function initScenarios() {
  const scenarios = [
    {
      tag: 'Scenario 1 — Bank Alert',
      msg: '"We detected suspicious activity on your account. Click here immediately to secure it."',
      options: [
        { text: 'Open the official banking app independently', correct: true },
        { text: 'Click the link in the message', correct: false },
        { text: 'Call the number in the message', correct: false },
        { text: 'Enter your password to confirm', correct: false }
      ],
      explain: 'Always access your bank through the official app or a website you type in yourself. Links and phone numbers inside unexpected messages could lead to a fake, attacker-controlled version of the "bank."'
    },
    {
      tag: 'Scenario 2 — Fake Job Offer',
      msg: '"Congratulations! You\'ve been selected for a $5,000/month remote role. Pay a small $49 registration fee to begin onboarding."',
      options: [
        { text: 'Pay the fee to secure the job', correct: false },
        { text: 'Send your bank details for "payroll setup"', correct: false },
        { text: 'Share your ID for "verification"', correct: false },
        { text: 'Research the company independently and never pay to get hired', correct: true }
      ],
      explain: 'Legitimate employers do not ask candidates to pay upfront fees. This is a common recruitment scam designed to collect money and personal information from hopeful job seekers.'
    },
    {
      tag: 'Scenario 3 — Social Media Account Warning',
      msg: '"Your account will be permanently deleted in 24 hours due to a policy violation. Confirm your identity now."',
      options: [
        { text: 'Log in through the link provided to "confirm"', correct: false },
        { text: 'Check the app\'s official notifications and help center directly', correct: true },
        { text: 'Ignore it completely with no further action', correct: false },
        { text: 'Reply with your username and password', correct: false }
      ],
      explain: 'This message uses urgency and fear of loss to rush you into clicking. Real account issues appear inside the official app itself, not just through outside messages.'
    },
    {
      tag: 'Scenario 4 — Delivery Message',
      msg: '"Your package could not be delivered. Pay a $1.99 redelivery fee to reschedule."',
      options: [
        { text: 'Pay the small fee since it\'s not much money', correct: false },
        { text: 'Enter your card details on the linked page', correct: false },
        { text: 'Track the package using the courier\'s official website or app', correct: true },
        { text: 'Forward the message to confirm with a friend', correct: false }
      ],
      explain: 'Even small payment requests can be dangerous — the real goal is often to capture your card details, which can then be used for larger fraudulent charges.'
    }
  ];

  const list = document.getElementById('scenario-list');
  list.innerHTML = scenarios.map((sc, i) => `
    <div class="scenario-card">
      <span class="scenario-tag">${sc.tag}</span>
      <p class="scenario-msg">${sc.msg}</p>
      <p style="margin-bottom:0.6rem; font-weight:600;">What should you do?</p>
      <div class="scenario-options" data-scenario="${i}">
        ${sc.options.map((opt, j) => `<button class="scenario-option" data-correct="${opt.correct}">${opt.text}</button>`).join('')}
      </div>
      <div class="scenario-feedback" id="scenario-feedback-${i}">${sc.explain}</div>
    </div>
  `).join('');

  list.querySelectorAll('.scenario-options').forEach((group, i) => {
    const buttons = group.querySelectorAll('.scenario-option');
    buttons.forEach(btn => {
      btn.addEventListener('click', () => {
        if (group.dataset.answered) return;
        group.dataset.answered = 'true';
        buttons.forEach(b => {
          if (b.dataset.correct === 'true') b.classList.add('correct');
          else if (b === btn) b.classList.add('incorrect');
        });
        document.getElementById(`scenario-feedback-${i}`).classList.add('show');
      });
    });
  });
}

/* ============================================
   RED FLAGS CHECKLIST
   ============================================ */
function initRedFlags() {
  const data = [
    { title: 'Unexpected message', detail: 'A message you weren\'t expecting, especially about accounts, payments, or prizes, deserves extra scrutiny.' },
    { title: 'Urgent request', detail: 'Pressure to act "immediately" or "within minutes" is a classic manipulation tactic.' },
    { title: 'Suspicious sender', detail: 'A sender address that doesn\'t match the organization\'s real domain.' },
    { title: 'Strange URL', detail: 'A web address with extra words, odd spelling, or an unfamiliar domain.' },
    { title: 'Request for password', detail: 'Legitimate services do not ask you to send your password by message.' },
    { title: 'Request for OTP', detail: 'One-time passcodes should never be shared with anyone, including "support staff."' },
    { title: 'Unexpected attachment', detail: 'Files you weren\'t expecting can carry malware, even if they look like invoices or documents.' },
    { title: 'Too-good-to-be-true offer', detail: 'Prizes, jobs, or deals that seem unusually generous are a common lure.' },
    { title: 'Pressure to bypass procedures', detail: 'Being told to skip normal verification "just this once" is a major warning sign.' },
    { title: 'Emotional manipulation', detail: 'Messages designed to make you feel fear, excitement, or urgency before you\'ve had time to think.' }
  ];

  const grid = document.getElementById('redflag-grid');
  grid.innerHTML = data.map((item, i) => `
    <button class="redflag-item" data-index="${i}">
      <span class="redflag-num">FLAG ${String(i + 1).padStart(2, '0')}</span>
      <span class="redflag-title">${item.title}</span>
      <div class="redflag-detail"><p>${item.detail}</p></div>
    </button>
  `).join('');

  grid.querySelectorAll('.redflag-item').forEach(item => {
    item.addEventListener('click', () => item.classList.toggle('open'));
  });
}

/* ============================================
   SAFETY TIPS GRID
   ============================================ */
function initSafetyGrid() {
  const data = [
    { icon: '🧠', title: 'Think Before Clicking', body: 'Pause before clicking any link or button in an unexpected message. A few seconds of thought can prevent a costly mistake.' },
    { icon: '🔗', title: 'Verify Independently', body: 'Visit the official website by typing the address yourself, or use the official app, instead of clicking a link from the message.' },
    { icon: '👤', title: 'Check the Sender', body: 'Look at the full email address or phone number, not just the display name, which can be faked easily.' },
    { icon: '🔍', title: 'Inspect URLs', body: 'Check the actual domain name carefully for extra words, odd spelling, or unfamiliar endings before entering any information.' },
    { icon: '🔐', title: 'Use MFA', body: 'Multi-Factor Authentication (MFA) means using a second step, like a code sent to your phone, in addition to your password — so a stolen password alone isn\'t enough to break in.' },
    { icon: '🔑', title: 'Use Strong, Unique Passwords', body: 'Reusing the same password across sites means one leaked password can compromise many accounts. Use a different, strong password for each one.' },
    { icon: '⬆️', title: 'Keep Software Updated', body: 'Updates often fix security weaknesses that attackers could otherwise exploit — install them promptly.' },
    { icon: '🚩', title: 'Report Suspicious Messages', body: 'Reporting phishing helps your organization or provider block the attacker before others fall victim.' },
    { icon: '🚫', title: 'Never Share OTPs or Passwords', body: 'No legitimate person or organization will ever need your password or one-time passcode — sharing them means giving away the keys to your account.' }
  ];

  const grid = document.getElementById('safety-grid');
  grid.innerHTML = data.map(item => `
    <div class="safety-card">
      <h3><span aria-hidden="true">${item.icon}</span> ${item.title}</h3>
      <p>${item.body}</p>
    </div>
  `).join('');
}

/* ============================================
   PHISHING DETECTION CHALLENGE (mini-game)
   ============================================ */
function initChallenge() {
  const targets = document.querySelectorAll('.challenge-target');
  const bar = document.getElementById('challenge-bar');
  const percentEl = document.getElementById('challenge-percent');
  const fractionEl = document.getElementById('challenge-fraction');
  const feedback = document.getElementById('challenge-feedback');
  const resetBtn = document.getElementById('challenge-reset');
  const total = targets.length;
  let found = new Set();

  function updateScore() {
    const pct = Math.round((found.size / total) * 100);
    bar.style.width = pct + '%';
    percentEl.textContent = pct + '%';
    fractionEl.textContent = `${found.size} / ${total} RED FLAGS FOUND`;
    if (found.size === total) {
      feedback.innerHTML = `<p><strong>🎯 All red flags found!</strong> You correctly identified every suspicious element in this email. That's exactly the kind of attention to detail that stops phishing attacks.</p>`;
    }
  }

  targets.forEach(target => {
    target.addEventListener('click', () => {
      const key = target.dataset.target;
      if (!found.has(key)) {
        found.add(key);
        target.classList.add('found');
        feedback.innerHTML = `<p><strong>✓ Found:</strong> ${target.dataset.explain}</p>`;
        updateScore();
      } else {
        feedback.innerHTML = `<p><strong>Already found:</strong> ${target.dataset.explain}</p>`;
      }
    });
  });

  resetBtn.addEventListener('click', () => {
    found = new Set();
    targets.forEach(t => t.classList.remove('found'));
    feedback.innerHTML = `<p>Click on parts of the email you think are suspicious.</p>`;
    updateScore();
  });

  updateScore();
}

/* ============================================
   QUIZ
   ============================================ */
function initQuiz() {
  const questions = [
    {
      q: 'You receive an email saying: "Your account will be locked within 30 minutes. Click this link to verify." What is the safest action?',
      options: [
        'Click the link immediately',
        'Reply with your password',
        'Visit the official website independently',
        'Forward it to friends'
      ],
      correct: 2,
      explain: 'Going to the official website yourself avoids any risk from a malicious link, and lets you check your account status safely.'
    },
    {
      q: 'A text message from an unknown number says you won a prize and asks you to click a link to claim it. This is an example of:',
      options: ['Smishing', 'Vishing', 'Clone phishing', 'QR phishing'],
      correct: 0,
      explain: 'Smishing is phishing carried out through SMS text messages, often using prize or delivery scams.'
    },
    {
      q: 'Which of these URLs is most likely to be a phishing attempt?',
      options: [
        'https://www.examplebank.test/login',
        'https://accounts.examplebank.test',
        'https://examplebank.test/help',
        'https://examplebank-security-verify.test/login'
      ],
      correct: 3,
      explain: 'Extra words like "security-verify" added to a domain are a common trick to make a fake site look official — this is a lookalike domain.'
    },
    {
      q: 'A message pretending to be your manager asks you to urgently buy gift cards and send the codes. This tactic relies mainly on:',
      options: ['Curiosity', 'Impersonation and urgency', 'Software vulnerabilities', 'Weak Wi-Fi security'],
      correct: 1,
      explain: 'This scam impersonates someone in authority and uses urgency to prevent the victim from stopping to verify the request.'
    },
    {
      q: 'True or False: If a website uses HTTPS (the padlock icon), it is guaranteed to be legitimate and safe.',
      options: ['True', 'Only for banking sites', 'Only on mobile', 'False'],
      correct: 3,
      explain: 'False. HTTPS only means the connection is encrypted — phishing websites can and do use HTTPS too. It says nothing about who owns the site.'
    },
    {
      q: 'You get a call from someone claiming to be your bank\'s fraud department, asking you to confirm your full card number. What should you do?',
      options: [
        'Provide the card number since they mentioned fraud',
        'Ask them to text you a confirmation first',
        'Hang up and call the bank using the number on your card or their official website',
        'Give only the last 4 digits'
      ],
      correct: 2,
      explain: 'This is a vishing (voice phishing) tactic. Always hang up and call back using a number you know is official, not one provided by the caller.'
    },
    {
      q: 'A job offer asks you to pay a "registration fee" before starting. This is most likely:',
      options: [
        'A recruitment scam',
        'A standard hiring practice',
        'A background check requirement',
        'A tax requirement'
      ],
      correct: 0,
      explain: 'Legitimate employers do not require candidates to pay money to be hired. Any upfront payment request is a major red flag for a job scam.'
    },
    {
      q: 'Someone claiming to be IT support calls and asks for your one-time passcode (OTP) to "fix an issue." You should:',
      options: [
        'Share the OTP since it expires quickly anyway',
        'Never share the OTP — real IT support won\'t ask for it',
        'Share it only if they know your employee ID',
        'Share half of the code'
      ],
      correct: 1,
      explain: 'OTPs should never be shared with anyone. Legitimate IT departments have other ways to resolve issues and will never ask for your passcode.'
    },
    {
      q: 'Which password habit is safest?',
      options: [
        'Using the same strong password everywhere',
        'Writing all passwords in a note app',
        'Using a unique password for each account',
        'Using your name and birth year'
      ],
      correct: 2,
      explain: 'Unique passwords per account limit the damage if one account\'s password is ever leaked — attackers can\'t reuse it elsewhere.'
    },
    {
      q: 'You receive an email that looks like a newsletter you\'ve already received before, but this version has a new "download" attachment. This is most likely:',
      options: ['Spear phishing', 'Vishing', 'A software update', 'Clone phishing'],
      correct: 3,
      explain: 'Clone phishing copies a legitimate, previously-sent message and replaces its links or attachments with malicious ones.'
    }
  ];

  const card = document.getElementById('quiz-card');
  const results = document.getElementById('quiz-results');
  const progressFill = document.getElementById('quiz-progress-fill');
  const counter = document.getElementById('quiz-counter');
  const scoreEl = document.getElementById('quiz-score');
  const restartBtn = document.getElementById('quiz-restart');
  const retakeLink = document.getElementById('retake-quiz-link');

  let currentQ = 0;
  let score = 0;
  let answered = false;

  function renderQuestion() {
    answered = false;
    const item = questions[currentQ];
    const letters = ['A', 'B', 'C', 'D'];

    card.innerHTML = `
      <p class="quiz-question">${item.q}</p>
      <div class="quiz-options" id="quiz-options-live">
        ${item.options.map((opt, i) => `
          <button class="quiz-option" data-index="${i}">
            <span class="opt-letter">${letters[i]}</span><span>${opt}</span>
          </button>
        `).join('')}
      </div>
      <div class="quiz-feedback" id="quiz-feedback-live"></div>
      <button class="btn btn-primary quiz-next" id="quiz-next-btn">Next Question →</button>
    `;

    counter.textContent = `Question ${currentQ + 1} of ${questions.length}`;
    scoreEl.textContent = `Score: ${score}`;
    progressFill.style.width = `${(currentQ / questions.length) * 100}%`;

    const optionButtons = card.querySelectorAll('.quiz-option');
    const feedback = document.getElementById('quiz-feedback-live');
    const nextBtn = document.getElementById('quiz-next-btn');

    optionButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        if (answered) return;
        answered = true;
        const chosen = parseInt(btn.dataset.index, 10);
        const isCorrect = chosen === item.correct;
        if (isCorrect) score++;

        optionButtons.forEach(b => {
          b.disabled = true;
          const idx = parseInt(b.dataset.index, 10);
          if (idx === item.correct) b.classList.add('correct');
          else if (idx === chosen) b.classList.add('incorrect');
        });

        feedback.innerHTML = isCorrect
          ? `<span class="verdict good">✓ Correct</span>${item.explain}`
          : `<span class="verdict bad">✗ Not quite</span>${item.explain}`;
        feedback.classList.add('show');
        nextBtn.classList.add('show');
        scoreEl.textContent = `Score: ${score}`;
      });
    });

    nextBtn.addEventListener('click', () => {
      currentQ++;
      if (currentQ < questions.length) {
        renderQuestion();
      } else {
        showResults();
      }
    });
  }

  function showResults() {
    card.style.display = 'none';
    results.hidden = false;
    progressFill.style.width = '100%';
    counter.textContent = `Question ${questions.length} of ${questions.length}`;

    const pct = Math.round((score / questions.length) * 100);
    document.getElementById('results-percent').textContent = pct + '%';

    const circumference = 2 * Math.PI * 52;
    const offset = circumference - (pct / 100) * circumference;
    const ringFill = document.getElementById('ring-fill');
    ringFill.style.strokeDasharray = circumference;
    requestAnimationFrame(() => { ringFill.style.strokeDashoffset = offset; });

    let title, message, ringColor;
    if (pct >= 90) {
      title = 'EXCELLENT'; message = 'You have strong phishing awareness.'; ringColor = 'var(--neon-green)';
    } else if (pct >= 70) {
      title = 'GOOD'; message = 'You understand most phishing indicators.'; ringColor = 'var(--cyan)';
    } else if (pct >= 50) {
      title = 'NEEDS IMPROVEMENT'; message = 'Review the warning signs and try again.'; ringColor = 'var(--warn-amber)';
    } else {
      title = 'HIGH RISK'; message = 'Complete the training again before relying on your judgment alone.'; ringColor = 'var(--warn-red)';
    }
    document.getElementById('results-title').textContent = title;
    document.getElementById('results-title').style.color = ringColor;
    document.getElementById('results-message').textContent = message;
    ringFill.style.stroke = ringColor;
  }

  function restartQuiz() {
    currentQ = 0;
    score = 0;
    card.style.display = '';
    results.hidden = true;
    renderQuestion();
  }

  restartBtn.addEventListener('click', restartQuiz);
  retakeLink.addEventListener('click', (e) => {
    e.preventDefault();
    restartQuiz();
    document.getElementById('quiz').scrollIntoView({ behavior: 'smooth' });
  });

  renderQuestion();
}