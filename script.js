const disclaimer = document.getElementById('disclaimer');
const closeDisclaimer = document.getElementById('close-disclaimer');

if (sessionStorage.getItem('vicecitycompass-disclaimer-closed') === 'true') disclaimer.classList.add('hidden');
closeDisclaimer.addEventListener('click', () => {
  disclaimer.classList.add('hidden');
  sessionStorage.setItem('vicecitycompass-disclaimer-closed', 'true');
});

const nextRelease = () => {
  const now = new Date();
  const target = new Date(now.getFullYear(), 10, 19, 0, 0, 0);
  return target <= now ? new Date(now.getFullYear() + 1, 10, 19, 0, 0, 0) : target;
};
const target = nextRelease();
const pad = (value) => String(value).padStart(2, '0');
const updateCountdown = () => {
  const difference = Math.max(0, target - new Date());
  const days = Math.floor(difference / 86400000);
  const hours = Math.floor(difference / 3600000) % 24;
  const minutes = Math.floor(difference / 60000) % 60;
  const seconds = Math.floor(difference / 1000) % 60;
  document.getElementById('days').textContent = pad(days);
  document.getElementById('hours').textContent = pad(hours);
  document.getElementById('minutes').textContent = pad(minutes);
  document.getElementById('seconds').textContent = pad(seconds);
};
updateCountdown();
setInterval(updateCountdown, 1000);
