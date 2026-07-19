// used ai to make this bruh >:(

const viewport = document.getElementById('map-viewport');
const mapContent = document.getElementById('map-content');
const map = document.getElementById('map-image');

let isDragging = false;
let startX;
let startY;
let translateX = 0;
let translateY = 0;

function applyMapTransform() {
  mapContent.style.transform = `translate(${translateX}px, ${translateY}px)`;
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
  applyMapTransform();
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
  applyMapTransform();
  
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

window.addEventListener('load', () => {
  translateX = (viewport.clientWidth - mapContent.scrollWidth) / 2;
  translateY = (viewport.clientHeight - mapContent.scrollHeight) / 2;
  clampPosition();
  applyMapTransform();
});



let targets = []
const tooltip = document.querySelector('.tooltip');
for (let u of Object.keys(upgs)) {
  try {
    upgs[u].tooltip()
    targets.push(u)
  } catch (err) {}
}
// Offset values to keep the tooltip slightly away from the exact cursor point
const offsetX = 15;
const offsetY = 15;
for (let u of targets) {
  const hg = document.querySelector(`#${u} > .upg`)
  hg.addEventListener('mouseenter', () => {
    tooltip.classList.add('visible');
    tooltip.innerHTML = upgs[u].tooltip()
  });
  hg.addEventListener('mouseleave', () => {
    tooltip.classList.remove('visible');
  });
  hg.addEventListener('mousemove', (e) => {
    tooltip.style.left = `${e.clientX + offsetX}px`;
    tooltip.style.top = `${e.clientY + offsetY}px`;
  });

  hg.addEventListener('touchstart', (e) => {
    e.preventDefault();
    tooltip.classList.add('visible');
    tooltip.innerHTML = upgs[u].tooltip()
  });
  hg.addEventListener('touchend', () => {tooltip.classList.remove('visible');});
  hg.addEventListener('touchcancel', () => {tooltip.classList.remove('visible');});
  hg.addEventListener('touchmove', (e) => {
    e.preventDefault();
    tooltip.style.left = `${e.clientX + offsetX}px`;
    tooltip.style.top = `${e.clientY + offsetY}px`;
  });
}