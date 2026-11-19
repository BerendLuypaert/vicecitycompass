const disclaimer = document.getElementById('disclaimer');
const closeDisclaimer = document.getElementById('close-disclaimer');

if (sessionStorage.getItem('vicecitycompass-disclaimer-closed') === 'true') disclaimer.classList.add('hidden');
closeDisclaimer.addEventListener('click', () => {
  disclaimer.classList.add('hidden');
  sessionStorage.setItem('vicecitycompass-disclaimer-closed', 'true');
});

