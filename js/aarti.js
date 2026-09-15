// Rameshta Devotional Hub - Live Aarti & Temple Sound Synthesizer

document.addEventListener('DOMContentLoaded', () => {
  initAartiModal();
});

const DEITY_DATA = {
  ram: {
    name: 'Lord Sita Ram',
    subtitle: 'Maryada Purushottam',
    color: '#f59e0b', // gold/orange
    svg: `
      <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <!-- Sun Aura -->
        <circle cx="50" cy="50" r="35" fill="none" stroke="rgba(245, 158, 11, 0.15)" stroke-width="4" stroke-dasharray="6 3"/>
        <circle cx="50" cy="50" r="30" fill="none" stroke="rgba(245, 158, 11, 0.1)" stroke-width="2"/>
        <!-- Golden Crown (Mukut) -->
        <path d="M38 35 L42 22 L50 15 L58 22 L62 35 Z" fill="none" stroke="#f59e0b" stroke-width="3" stroke-linejoin="round"/>
        <circle cx="50" cy="15" r="3" fill="#f59e0b"/>
        <!-- Bow (Dhanush) -->
        <path d="M30 40 Q 15 55 30 70" fill="none" stroke="#f59e0b" stroke-width="3.5" stroke-linecap="round"/>
        <!-- Bow String -->
        <line x1="30" y1="40" x2="30" y2="70" stroke="#ffedd5" stroke-width="1.5"/>
        <!-- Arrow (Teer) -->
        <line x1="20" y1="55" x2="65" y2="55" stroke="#f59e0b" stroke-width="3" stroke-linecap="round"/>
        <path d="M65 52 L72 55 L65 58 Z" fill="#ef4444"/>
        <path d="M20 52 L15 55 L20 58 Z" fill="#ef4444"/>
      </svg>
    `,
    lyrics: `
      <strong>Shri Ram Chandra Kripalu Bhaju Man Haran Bhava Bhaya Darunam |</strong><br>
      Navakanja-Lochana, Kanja-Mukha, Kara-Kanja, Pada Kanjarunam || 1 ||<br><br>
      <strong>Kandarpa Aganita Amita Chabi Navaneela Sundara Shyamadam |</strong><br>
      Patapita Manahu Tarita Ruchi Shuchi Nomi Janaka Sutavaram || 2 ||<br><br>
      <strong>Bhaju Deena Bandhu Dinesh Danava Daitya Vamsha Nikandanam |</strong><br>
      Raghunanda Ananda Kanda Kosala Chanda Dasharatha Nandanam || 3 ||<br><br>
      <strong>Sir Mukuta Kundala Tilaka Charu Udaru Anga Vibhushanam |</strong><br>
      Aajaanubahu Shara-Chap-Dhar Sangrama-Jit-Khara-Dushanam || 4 ||
    `
  },
  hanuman: {
    name: 'Lord Hanuman',
    subtitle: 'Sankat Mochan Mahaveer',
    color: '#ea580c', // deep orange
    svg: `
      <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <!-- Halo Circle -->
        <circle cx="50" cy="45" r="32" fill="none" stroke="rgba(234, 88, 12, 0.15)" stroke-width="3"/>
        <!-- Golden Mace (Gada) -->
        <!-- Handle -->
        <line x1="50" y1="40" x2="50" y2="85" stroke="#d97706" stroke-width="4.5" stroke-linecap="round"/>
        <circle cx="50" cy="85" r="4.5" fill="#f97316"/>
        <!-- Mace Head -->
        <path d="M35 35 C 35 15, 65 15, 65 35 C 65 42, 35 42, 35 35 Z" fill="none" stroke="#ea580c" stroke-width="4" stroke-linejoin="round"/>
        <path d="M40 30 C 40 22, 60 22, 60 30 Z" fill="none" stroke="#ea580c" stroke-width="2"/>
        <line x1="35" y1="35" x2="65" y2="35" stroke="#ea580c" stroke-width="3"/>
        <circle cx="50" cy="18" r="3" fill="#ea580c"/>
        <!-- Sacred Orange Aura Lines -->
        <path d="M25 65 Q 50 80 75 65" fill="none" stroke="rgba(234, 88, 12, 0.3)" stroke-width="2" stroke-linecap="round"/>
        <path d="M20 70 Q 50 90 80 70" fill="none" stroke="rgba(234, 88, 12, 0.15)" stroke-width="1.5" stroke-linecap="round"/>
      </svg>
    `,
    lyrics: `
      <strong>Aarti Kije Hanuman Lala Ki | Dusht Dalan Raghunath Kala Ki ||</strong><br>
      Jaake Bal Se Girivar Kaanpe | Rog Dosh Jaake Nikat Na Jhaanke ||<br><br>
      <strong>Lal Deh Laali Lase, Aru Dhari Lal Langoora |</strong><br>
      Vajra Deh Daanav Dalan, Jai Jai Jai Kapi Soora ||<br><br>
      <strong>Kanchan Thaar Kapoor Lau Chaai | Aarti Karat Anjani Maai ||</strong><br>
      Jo Hanuman Ji Ki Aarti Gaave | Basi Baikunth Param Pad Paave ||<br><br>
      <strong>Sankat Se Hanuman Chhudave | Man Kram Bachan Dhyan Jo Lave ||</strong>
    `
  },
  shiv: {
    name: 'Lord Shiva',
    subtitle: 'Devadhidev Mahadev',
    color: '#06b6d4', // cyan / blue
    svg: `
      <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <!-- Crescent Moon Glow -->
        <path d="M60 20 A 15 15 0 0 1 45 35 A 15 15 0 0 0 60 20" fill="#e2e8f0" opacity="0.85" filter="drop-shadow(0 0 5px #06b6d4)"/>
        <!-- Trident (Trishul) -->
        <!-- Center Shaft -->
        <line x1="50" y1="15" x2="50" y2="85" stroke="#06b6d4" stroke-width="4.5" stroke-linecap="round"/>
        <!-- Center Prong -->
        <path d="M50 8 L54 18 L46 18 Z" fill="#06b6d4"/>
        <!-- Curved Side Prongs -->
        <path d="M35 25 Q 35 40 50 40 Q 65 40 65 25" fill="none" stroke="#06b6d4" stroke-width="4.5" stroke-linecap="round"/>
        <!-- Side Tips -->
        <path d="M35 25 L38 30 L32 30 Z" fill="#06b6d4"/>
        <path d="M65 25 L68 30 L62 30 Z" fill="#06b6d4"/>
        <!-- Damru (Drum) attached -->
        <path d="M42 50 L58 50 L42 62 L58 62 Z" fill="none" stroke="#06b6d4" stroke-width="3" stroke-linejoin="round"/>
        <line x1="50" y1="50" x2="50" y2="62" stroke="#ef4444" stroke-width="2"/>
        <circle cx="50" cy="56" r="3" fill="#ef4444"/>
      </svg>
    `,
    lyrics: `
      <strong>Jai Shiv Omkara, Swami Har Shiv Omkara |</strong><br>
      Brahma Vishnu Sadashiv Ardhangi Dhara || Om Jai Shiv Omkara... || 1 ||<br><br>
      <strong>Ekanan Chaturanan Panchanan Raje |</strong><br>
      Hansasana Garudasana Vrishavahana Saje || Om Jai Shiv Omkara... || 2 ||<br><br>
      <strong>Do Bhuj Chaar Chaturbhuj Das Bhuj Te Sohe |</strong><br>
      Teeno Roop Nirakhata Tribhuvan Jan Mohe || Om Jai Shiv Omkara... || 3 ||<br><br>
      <strong>Akshyamala Vanamala Mundamala Dhari |</strong><br>
      Chandan Mrigamad Sohai Bhaale Shashi Dhari || Om Jai Shiv Omkara... || 4 ||
    `
  }
};

let audioContext = null;
let OM_oscillator = null;
let OM_gainNode = null;

function initAartiModal() {
  const modal = document.getElementById('aartiModal');
  const startBtn = document.getElementById('startAartiBtn');
  const closeBtn = document.getElementById('closeAartiBtn');
  
  const deityButtons = document.querySelectorAll('.deity-tab-btn');
  const deityName = document.getElementById('deityName');
  const deityGraphic = document.getElementById('deityGraphic');
  const aartiLyrics = document.getElementById('aartiLyrics');
  const aartiAltar = document.getElementById('aartiAltar');
  
  const waveBtn = document.getElementById('aartiWaveBtn');
  const bellBtn = document.getElementById('aartiBellBtn');
  const conchBtn = document.getElementById('aartiConchBtn');
  const soundWaves = document.getElementById('aartiWaves');

  if (!modal || !startBtn || !closeBtn) return;

  // Open Aarti
  startBtn.addEventListener('click', () => {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    selectDeity('ram'); // Default deity
  });

  // Close Aarti
  const closeAarti = () => {
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
    stopChantLoop();
    aartiAltar.classList.remove('waving-active');
    waveBtn.classList.remove('active');
    soundWaves.classList.remove('active');
    waveBtn.innerHTML = '<i data-lucide="flame"></i> Wave Aarti Diya';
    lucide.createIcons();
  };

  closeBtn.addEventListener('click', closeAarti);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeAarti();
  });

  // Handle Deity Tab Switch
  deityButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      deityButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const deityKey = btn.getAttribute('data-deity');
      selectDeity(deityKey);
    });
  });

  function selectDeity(key) {
    const data = DEITY_DATA[key];
    if (!data) return;

    // Apply color and name updates
    deityName.innerText = data.name;
    deityName.style.color = data.color;
    deityGraphic.innerHTML = data.svg;
    aartiLyrics.innerHTML = data.lyrics;

    // Re-initialize icons inside lyrics box if any
    lucide.createIcons();
    
    // Altar visual effects matching deity color
    aartiAltar.style.boxShadow = `0 0 40px ${data.color}25`;
    document.getElementById('deityGraphic').style.borderColor = `${data.color}60`;
  }

  // Ring temple bell sound synthesis
  bellBtn.addEventListener('click', () => {
    try {
      playTempleBell();
    } catch(err) {
      console.warn("Audio Context blocked by browser policy.", err);
    }
    
    // Quick visual flash on bell button
    bellBtn.style.transform = 'scale(0.9) rotate(-10deg)';
    setTimeout(() => {
      bellBtn.style.transform = '';
    }, 150);
  });

  // Blow Shankh sound synthesis
  conchBtn.addEventListener('click', () => {
    try {
      playShankhBlow();
    } catch(err) {
      console.warn("Audio Context blocked by browser policy.", err);
    }

    // Visual indicator on conch button
    conchBtn.style.transform = 'scale(1.1)';
    setTimeout(() => {
      conchBtn.style.transform = '';
    }, 300);
  });

  // Wave Diya toggle (starts circular animation and soft Om background hum)
  waveBtn.addEventListener('click', () => {
    const isWaving = aartiAltar.classList.toggle('waving-active');
    waveBtn.classList.toggle('active');
    
    if (isWaving) {
      waveBtn.innerHTML = '<i data-lucide="square"></i> Stop Aarti';
      soundWaves.classList.add('active');
      startChantLoop();
    } else {
      waveBtn.innerHTML = '<i data-lucide="flame"></i> Wave Aarti Diya';
      soundWaves.classList.remove('active');
      stopChantLoop();
    }
    lucide.createIcons();
  });
}

// Ensure AudioContext is initialized on click
function getAudioContext() {
  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (audioContext.state === 'suspended') {
    audioContext.resume();
  }
  return audioContext;
}

// 1. Synthesize Bell Sound (Rich Inharmonic Partials)
function playTempleBell() {
  const ctx = getAudioContext();
  const now = ctx.currentTime;
  
  // Principal frequencies of a metallic temple bell
  const frequencies = [415, 520, 622, 830, 1040, 1244];
  const gains = [0.4, 0.3, 0.2, 0.15, 0.08, 0.04];
  
  frequencies.forEach((freq, idx) => {
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now);
    
    // Envelope: sharp bell strike + exponential ring down
    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(gains[idx], now + 0.005);
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + 2.5 - (idx * 0.3));
    
    osc.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    osc.start(now);
    osc.stop(now + 2.5);
  });
}

// 2. Synthesize Shankh Blow (Low, rich brassy air resonance)
function playShankhBlow() {
  const ctx = getAudioContext();
  const now = ctx.currentTime;

  const osc = ctx.createOscillator();
  const subOsc = ctx.createOscillator();
  const filter = ctx.createBiquadFilter();
  const gainNode = ctx.createGain();

  // Low horn frequencies
  osc.type = 'sawtooth';
  osc.frequency.setValueAtTime(142, now);
  // Soft vibrato
  osc.frequency.linearRampToValueAtTime(145, now + 0.4);
  osc.frequency.linearRampToValueAtTime(138, now + 1.2);
  osc.frequency.linearRampToValueAtTime(140, now + 2.0);

  subOsc.type = 'triangle';
  subOsc.frequency.setValueAtTime(71, now); // Octave below for depth

  // High-frequency lowpass filter to remove sawtooth harshness and simulate warm wind blowing
  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(320, now);
  filter.Q.setValueAtTime(2, now);

  gainNode.gain.setValueAtTime(0, now);
  gainNode.gain.linearRampToValueAtTime(0.5, now + 0.3); // Fade in blow
  gainNode.gain.linearRampToValueAtTime(0.4, now + 1.5);
  gainNode.gain.exponentialRampToValueAtTime(0.001, now + 2.2); // Decay blow

  osc.connect(filter);
  subOsc.connect(filter);
  filter.connect(gainNode);
  gainNode.connect(ctx.destination);

  osc.start(now);
  subOsc.start(now);
  
  osc.stop(now + 2.2);
  subOsc.stop(now + 2.2);
}

// 3. Meditative OM Chanting/Drone Loop
function startChantLoop() {
  const ctx = getAudioContext();
  const now = ctx.currentTime;

  if (OM_oscillator) return; // Already running

  OM_oscillator = ctx.createOscillator();
  const overtoneOsc = ctx.createOscillator();
  
  OM_gainNode = ctx.createGain();
  const filter = ctx.createBiquadFilter();

  // Cosmic frequency OM (136.1 Hz)
  OM_oscillator.type = 'triangle';
  OM_oscillator.frequency.setValueAtTime(136.1, now);
  
  // Harmonic overtone for natural chanting drone
  overtoneOsc.type = 'sine';
  overtoneOsc.frequency.setValueAtTime(272.2, now);

  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(200, now);

  OM_gainNode.gain.setValueAtTime(0, now);
  OM_gainNode.gain.linearRampToValueAtTime(0.35, now + 1.0); // Soft fade in

  OM_oscillator.connect(filter);
  overtoneOsc.connect(filter);
  filter.connect(OM_gainNode);
  OM_gainNode.connect(ctx.destination);

  OM_oscillator.start(now);
  overtoneOsc.start(now);

  // Keep reference to stop later
  OM_oscillator.onended = () => {
    overtoneOsc.stop();
  };
}

function stopChantLoop() {
  if (!OM_oscillator || !OM_gainNode) return;

  const ctx = getAudioContext();
  const now = ctx.currentTime;

  OM_gainNode.gain.cancelScheduledValues(now);
  OM_gainNode.gain.setValueAtTime(OM_gainNode.gain.value, now);
  OM_gainNode.gain.linearRampToValueAtTime(0, now + 0.5); // Soft fade out

  const oscToStop = OM_oscillator;
  OM_oscillator = null;
  OM_gainNode = null;

  setTimeout(() => {
    try {
      oscToStop.stop();
    } catch(err) {}
  }, 600);
}
