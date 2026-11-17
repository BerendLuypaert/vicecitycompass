const map = document.getElementById('interactive-map');
const frame = document.getElementById('map-frame');
const zoomLevel = document.getElementById('zoom-level');
let zoom = 1;

function setZoom(nextZoom) {
  zoom = Math.min(3, Math.max(1, nextZoom));
  map.style.transform = `scale(${zoom})`;
  zoomLevel.textContent = `${Math.round(zoom * 100)}%`;
}

document.getElementById('zoom-in').addEventListener('click', () => setZoom(zoom + 0.25));
document.getElementById('zoom-out').addEventListener('click', () => setZoom(zoom - 0.25));
document.getElementById('zoom-reset').addEventListener('click', () => setZoom(1));
frame.addEventListener('wheel', (event) => {
  event.preventDefault();
  setZoom(zoom + (event.deltaY < 0 ? 0.1 : -0.1));
}, { passive: false });
