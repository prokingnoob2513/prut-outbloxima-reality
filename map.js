// used ai to make this bruh >:(

const viewport = document.getElementById('map-viewport')
const mapContent = document.getElementById('map-content')
const map = document.getElementById('map-image')

let isDragging = false
let startX
let startY
let translateX = 0
let translateY = 0

let center = [0,0]
var zone_id = -1
var prev_z_id = -67

const isBounded = (coords, xy1, xy2) => coords[0] >= xy1[0] && coords[0] <= xy2[0] && coords[1] >= xy1[1] && coords[1] <= xy2[1]
function mapChange() {
  mapContent.style.transform = `translate(${translateX}px, ${translateY}px)`;
  center = [-(translateX - window.outerWidth/2 + 2375), -(translateY - window.outerHeight/2 + 2375)]
}

function clampPosition() {
  const maxLeft = 0;
  const maxTop = 0;
  const minLeft = viewport.clientWidth - mapContent.scrollWidth;
  const minTop = viewport.clientHeight - mapContent.scrollHeight;
  
  if (translateX > maxLeft) translateX = maxLeft;
  if (translateY > maxTop) translateY = maxTop;
  if (translateX < minLeft) translateX = minLeft;
  if (translateY < minTop) translateY = minTop;
}

// Desktop
viewport.addEventListener('mousedown', (e) => {
  isDragging = true;
  startX = e.clientX - translateX;
  startY = e.clientY - translateY;
});
window.addEventListener('mousemove', (e) => {
  if (!isDragging || isInUI) return
  
  translateX = e.clientX - startX;
  translateY = e.clientY - startY;
  
  clampPosition();
  mapChange();
});
window.addEventListener('mouseup', () => {
  isDragging = false;
});

viewport.addEventListener('wheel', (e) => {
  if (e.ctrlKey) e.preventDefault();
}, { passive: false });

// Mobile
viewport.addEventListener('touchstart', (e) => {
  if (e.touches.length !== 1) return;
  
  isDragging = true;
  const touch = e.touches[0];
  startX = touch.clientX - translateX;
  startY = touch.clientY - translateY;
}, { passive: true });
window.addEventListener('touchmove', (e) => {
  if (!isDragging || isInUI || e.touches.length !== 1) return;
  
  const touch = e.touches[0];
  translateX = touch.clientX - startX;
  translateY = touch.clientY - startY;
  
  clampPosition();
  mapChange();
  
  // Prevent page scrolling while dragging
  e.preventDefault();
}, { passive: false });
window.addEventListener('touchend', () => {
  isDragging = false;
});

window.addEventListener('touchcancel', () => {
  isDragging = false;
});
window.addEventListener("resize", function () {
  viewport.width = window.innerWidth;
  viewport.height = window.innerHeight;
});

// Arrow keys / WASD map movement
const keyState = {};
const KEY_SPEED = 800; // pixels per second
let lastFrameTime = performance.now();

window.addEventListener('keydown', (e) => {
  if (e.repeat) return;
  if (['ArrowUp','ArrowDown','ArrowLeft','ArrowRight','w','a','s','d','W','A','S','D'].includes(e.key)) {
    keyState[e.key] = true;
    // prevent page scrolling for arrow keys when focused
    if (['ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(e.key)) e.preventDefault();
  }
});
window.addEventListener('keyup', (e) => {
  if (keyState[e.key]) keyState[e.key] = false;
});

function keyboardPanLoop(now) {
  const dt = Math.min(0.05, (now - lastFrameTime) / 1000); // cap delta to avoid large jumps
  lastFrameTime = now;

  if (!isInUI) {
    let dx = 0, dy = 0;
    if (keyState['ArrowLeft'] || keyState['a'] || keyState['A']) dx += 1;
    if (keyState['ArrowRight'] || keyState['d'] || keyState['D']) dx -= 1;
    if (keyState['ArrowUp'] || keyState['w'] || keyState['W']) dy += 1;
    if (keyState['ArrowDown'] || keyState['s'] || keyState['S']) dy -= 1;

    if (dx !== 0 || dy !== 0) {
      // normalize diagonal movement
      const len = Math.hypot(dx, dy) || 1;
      dx = dx / len;
      dy = dy / len;

      translateX += dx * KEY_SPEED * dt;
      translateY += dy * KEY_SPEED * dt;
      clampPosition();
      mapChange();
    }
  }

  requestAnimationFrame(keyboardPanLoop);
}
requestAnimationFrame(keyboardPanLoop);

//////////////////////////////////////////
// Music
let musics = [
  new Audio("assets/audio/MAIN - Pilotredsun- Fat Cat.mp3"),
  new Audio("assets/audio/BPOINT - Speder2 - Asougi.mp3"),
  new Audio("assets/audio/NEAT - nicopatty - crashout.mp3"),
  new Audio("assets/audio/PLACEHOLD - Creo - Crazy X ZXKAI - NO BATIDÃO  Kyouki & Climax mashup.mp3")
]
let sfx = [
  new Audio("assets/audio/click.ogg"),
  new Audio("assets/audio/upg_buy.ogg"),
  new Audio("assets/audio/bp_reset.ogg"),
  new Audio("assets/audio/n_start.wav"),
  new Audio("assets/audio/n_fail.wav"),
  new Audio("assets/audio/n_win.mp3"),
  new Audio("assets/audio/n_frag.ogg"),
]
musics.forEach(i => {i.loop = true; i.volume = 0})
sfx.forEach(i => i.volume = you.volume)

const musicVolumeInput = document.querySelector('.info_vol');
if (musicVolumeInput) {
  musicVolumeInput.addEventListener('input', () => {
    const newVolume = Number(musicVolumeInput.value);
    you.volume = Math.max(0, Math.min(1, newVolume));
    musics.forEach((audio) => {
      if (!audio.paused && !audio.muted) audio.volume = you.volume;
    });
    sfx.forEach((audio) => {
      audio.volume = you.volume;
    });
  });
}
document.addEventListener("mousedown", () => {
  prev_z_id = zone_id;
  zone_id = 0; musics[0].volume = 0;
  smooth(musics[0], false, you.volume)
}, { once: true })

function smooth(audioElement, isMute, volume = 1, duration = 2000) {
  // used copilot to make this
  if (!audioElement) return;
  if (audioElement._fadeInterval) {
    clearInterval(audioElement._fadeInterval);
    audioElement._fadeInterval = null;
  }

  const startVolume = audioElement.volume;
  const targetVolume = isMute ? 0 : Math.max(0, Math.min(1, volume));
  const startTime = Date.now();

  if (!isMute) {
    audioElement.muted = false;
    if (audioElement.paused) {
      audioElement.volume = 0;
      audioElement.play().catch(() => {
        document.addEventListener("click", () => audioElement.play(), { once: true });
      });
    }
  } else if (audioElement.muted || startVolume === 0) {
    audioElement.volume = 0;
    audioElement.muted = true;
    audioElement.pause();
    return;
  }

  audioElement._fadeInterval = setInterval(() => {
    const elapsed = Date.now() - startTime;
    const progress = Math.min(elapsed / duration, 1);
    audioElement.volume = isMute
      ? Math.max(0, startVolume * (1 - progress))
      : Math.min(1, startVolume + (targetVolume - startVolume) * progress);

    if (progress >= 1) {
      clearInterval(audioElement._fadeInterval);
      audioElement._fadeInterval = null;
      audioElement.volume = targetVolume;
      if (isMute) {
        audioElement.muted = true;
        audioElement.pause();
      }
    }
  }, 50);
}
let ms_loop = setInterval(() => {
  if (isBounded(center, [-1500, 0], [-400, 3750]) && (you.upgs.u10 >= 1 || you.bpoints.neq(0))) { prev_z_id = zone_id; zone_id = 1 }
  else if (isBounded(center, [2625, 0], [3750, 2250]) && you.upgs.b7 >= 1) { prev_z_id = zone_id; zone_id = 2 }
  else { prev_z_id = zone_id; zone_id = 0 }

  musics.forEach((i, j) => {
    if (prev_z_id == zone_id) return
    if (j == zone_id) smooth(i, false, you.volume);
    else if (j == prev_z_id) smooth(i, true, you.volume);
  })
}, 100);

//////////////////////////////////////////
// Tooltips
let targets = []
const offsetX = 15;
const offsetY = 15;
const tooltip = document.querySelector('.tooltip');

function setupTooltip(element, contentFn) {
  element.addEventListener('mouseenter', () => {
    tooltip.classList.add('visible');
    tooltip.innerHTML = contentFn();
  });
  element.addEventListener('mouseleave', () => {
    tooltip.classList.remove('visible');
  });
  element.addEventListener('mousemove', (e) => {
    tooltip.style.left = `${e.clientX + offsetX}px`;
    tooltip.style.top = `${e.clientY + offsetY}px`;
    tooltip.innerHTML = contentFn();
  });

  // Mobile: show tooltip on long-press, follow finger while visible,
  // and cancel if user scrolls or lifts finger quickly.
  let touchTimeout = null;
  let touchStartX = 0;
  let touchStartY = 0;

  element.addEventListener('touchstart', (e) => {
    if (e.touches.length !== 1) return;
    const t = e.touches[0];
    touchStartX = t.clientX;
    touchStartY = t.clientY;
    // long-press (300ms) to show tooltip to avoid interfering with scrolling/tap
    touchTimeout = setTimeout(() => {
      tooltip.classList.add('visible');
      tooltip.innerHTML = contentFn();
      tooltip.style.left = `${t.clientX + offsetX}px`;
      tooltip.style.top = `${t.clientY + offsetY}px`;
    }, 300);
  }, { passive: true });

  element.addEventListener('touchmove', (e) => {
    if (e.touches.length !== 1) return;
    const t = e.touches[0];
    // if user moved finger significantly before long-press, cancel
    if (touchTimeout && Math.hypot(t.clientX - touchStartX, t.clientY - touchStartY) > 10) {
      clearTimeout(touchTimeout);
      touchTimeout = null;
    }
    if (tooltip.classList.contains('visible')) {
      // prevent page scroll while dragging the tooltip
      e.preventDefault();
      tooltip.style.left = `${t.clientX + offsetX}px`;
      tooltip.style.top = `${t.clientY + offsetY}px`;
      tooltip.innerHTML = contentFn();
    }
  }, { passive: false });
  element.addEventListener('touchend', () => {
    if (touchTimeout) { clearTimeout(touchTimeout); touchTimeout = null; }
    tooltip.classList.remove('visible');
  }, { passive: true });
  element.addEventListener('touchcancel', () => {
    if (touchTimeout) { clearTimeout(touchTimeout); touchTimeout = null; }
    tooltip.classList.remove('visible');
  }, { passive: true });
}
Object.keys(upgs).forEach(u => {
  try {
    upgs[u].tooltip()
    targets.push(u)
  } catch (err) {}
})
targets.forEach(u => {
  const hg = document.querySelector(`#${u} > .upg`);
  setupTooltip(hg, () => upgs[u].tooltip());
})

window.addEventListener('load', () => {
  translateX = (viewport.clientWidth - mapContent.scrollWidth) / 2;
  translateY = (viewport.clientHeight - mapContent.scrollHeight) / 2;
  translateX = (viewport.clientWidth - mapContent.scrollWidth) / 2;
  translateY = (viewport.clientHeight - mapContent.scrollHeight) / 2;
  translateX = (viewport.clientWidth - mapContent.scrollWidth) / 2;
  translateY = (viewport.clientHeight - mapContent.scrollHeight) / 2;
  clampPosition();
  mapChange();
});