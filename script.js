document.addEventListener("DOMContentLoaded", function () {
  const cake = document.querySelector(".cake");
  let candles = [];
  let audioContext;
  let analyser;
  let microphone;
  let confettiTriggered = false;

  // ========== 1. ZVIJEZDE (150 komada) ==========
  function createStars() {
    const starsContainer = document.createElement('div');
    starsContainer.className = 'stars-container';
    document.body.appendChild(starsContainer);

    for (let i = 0; i < 150; i++) {
      const star = document.createElement('div');
      star.className = 'star';
      star.style.left = Math.random() * 100 + '%';
      star.style.top = Math.random() * 100 + '%';
      star.style.animationDelay = Math.random() * 5 + 's';
      star.style.width = star.style.height = (Math.random() * 4 + 1) + 'px';
      starsContainer.appendChild(star);
    }
  }
  createStars();

  // ========== 2. ISKRICE KOJE PRATE KURSOR ==========
  function createSparkle(e) {
    const sparkle = document.createElement('div');
    sparkle.className = 'sparkle';
    sparkle.style.left = e.clientX - 4 + 'px';
    sparkle.style.top = e.clientY - 4 + 'px';
    document.body.appendChild(sparkle);
    setTimeout(() => sparkle.remove(), 500);
  }

  document.addEventListener('mousemove', (e) => {
    if (Math.random() > 0.8) createSparkle(e);
  });

  // ========== 3. BALONI - BEZ ROTACIJE, KONAC IZA ==========
  const balloonColors = ['red', 'gold', 'blue', 'pink'];

  function createBalloon() {
    const balloon = document.createElement('div');
    balloon.className = 'balloon ' + balloonColors[Math.floor(Math.random() * balloonColors.length)];
    balloon.style.left = Math.random() * 100 + '%';
    const duration = Math.random() * 8 + 6; // 6-14 sekundi
    balloon.style.animationDuration = duration + 's';

    document.body.appendChild(balloon);

    // Ukloni balon nakon što animacija završi
    balloon.addEventListener('animationend', () => {
      balloon.remove();
    });
  }

  // Baloni se pojavljuju svake 2 sekunde
  setInterval(createBalloon, 2000);

  // ========== 4. VATROMET ==========
  function fireworks() {
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const colors = ['#ff0', '#f0f', '#0ff', '#f00', '#0f0', '#ffa500'];

    const interval = setInterval(function() {
      if (Date.now() > animationEnd) {
        clearInterval(interval);
        return;
      }
      confetti({
        particleCount: 50,
        startVelocity: 25,
        spread: 90,
        origin: { x: Math.random(), y: Math.random() * 0.5 },
        colors: [colors[Math.floor(Math.random() * colors.length)]]
      });
    }, 300);
  }

  // ========== 5. ČESTITKA ==========
  function showBirthdayMessage() {
    const oldMsg = document.querySelector('.birthday-message');
    if (oldMsg) oldMsg.remove();

    const msg = document.createElement('div');
    msg.className = 'birthday-message';
    msg.innerHTML = '🎉 Sretan rođendan, Adi! 🎉';
    document.body.appendChild(msg);

    setTimeout(() => msg.classList.add('show'), 10);

    setTimeout(() => {
      msg.classList.remove('show');
      setTimeout(() => msg.remove(), 1000);
    }, 5000);
  }

  // ========== CONFETTI ==========
  function triggerConfetti() {
    if (typeof window.confetti === 'undefined') {
      console.log('❌ Confetti biblioteka nije učitana!');
      return;
    }
    console.log('🎉 Confetti! Sve svjećice ugašene!');
    
    confetti({
      particleCount: 200,
      spread: 100,
      origin: { y: 0.5 },
      startVelocity: 40,
      colors: ['#ffd700', '#ff69b4', '#00ffff', '#ff4500', '#32cd32', '#1e90ff']
    });
    
    setTimeout(() => {
      confetti({
        particleCount: 150,
        angle: 60,
        spread: 70,
        origin: { x: 0, y: 0.5 }
      });
      confetti({
        particleCount: 150,
        angle: 120,
        spread: 70,
        origin: { x: 1, y: 0.5 }
      });
    }, 200);
    
    setTimeout(() => {
      confetti({
        particleCount: 300,
        spread: 120,
        origin: { y: 0.4 }
      });
    }, 400);

    fireworks();
  }

  // ========== SVIJEĆICE ==========
  function updateCandleCount() {
    const activeCandles = candles.filter(c => !c.classList.contains("out")).length;
    console.log('🔢 Aktivnih svjećica:', activeCandles);

    if (activeCandles === 0 && !confettiTriggered) {
      triggerConfetti();
      confettiTriggered = true;
    } else if (activeCandles > 0) {
      confettiTriggered = false;
    }
  }

  function addCandle(left, top) {
    const candle = document.createElement("div");
    candle.className = "candle";
    candle.style.left = left + "px";
    candle.style.top = top + "px";

    const flame = document.createElement("div");
    flame.className = "flame";
    candle.appendChild(flame);

    candle.addEventListener("click", function (e) {
      e.stopPropagation();
      if (!candle.classList.contains("out")) {
        candle.classList.add("out");
        console.log('💥 Svjećica ugašena klikom!');
        updateCandleCount();
      }
    });

    cake.appendChild(candle);
    candles.push(candle);
    updateCandleCount();
  }

  function addInitialCandles(count) {
    for (let i = 0; i < count; i++) {
      const left = Math.random() * 200 + 20;
      const top = Math.random() * 40 + 10;
      addCandle(left, top);
    }
  }

  cake.addEventListener("click", function (event) {
    if (event.target.closest('.candle')) return;
    const rect = cake.getBoundingClientRect();
    const left = event.clientX - rect.left;
    const top = event.clientY - rect.top;
    addCandle(left, top);
  });

  // ========== DUVANJE ==========
  function isBlowing() {
    if (!analyser) return false;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    analyser.getByteFrequencyData(dataArray);
    let sum = 0;
    for (let i = 0; i < bufferLength; i++) sum += dataArray[i];
    let average = sum / bufferLength;
    return average > 40;
  }

  function blowOutCandles() {
    if (!isBlowing()) return;
    let blownOut = 0;
    candles.forEach((candle) => {
      if (!candle.classList.contains("out") && Math.random() > 0.3) {
        candle.classList.add("out");
        blownOut++;
      }
    });
    if (blownOut > 0) {
      console.log(`💨 Duvanjem ugašeno ${blownOut} svjećica`);
      updateCandleCount();
    }
  }

  // ========== MIKROFON ==========
  if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then(function (stream) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        analyser = audioContext.createAnalyser();
        microphone = audioContext.createMediaStreamSource(stream);
        microphone.connect(analyser);
        analyser.fftSize = 256;
        setInterval(blowOutCandles, 200);
        console.log("🎤 Mikrofon je spreman – možeš duvati!");
      })
      .catch(function (err) {
        console.log("🎤 Mikrofon nije dostupan – koristi klik za gašenje svjećica.", err);
      });
  } else {
    console.log("🎤 Tvoj preglednik ne podržava pristup mikrofonu – koristi klik.");
  }

  addInitialCandles(25);
});