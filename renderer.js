// let timeLeft = 20 * 60; // Default 20 minutes
let timeLeft = 1 * 60; // Default 1 minute
const timeSelect = document.getElementById('timeSelect');
const timerDisplay = document.getElementById('timer');
const startBtn = document.getElementById('startBtn');
const pauseBtn = document.getElementById('pauseBtn');
const resetBtn = document.getElementById('resetBtn');
const resumeBtn = document.getElementById('resumeBtn');

function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60).toString().padStart(2, '0');
  const remainingSeconds = (seconds % 60).toString().padStart(2, '0');
  return `${minutes}:${remainingSeconds}`;
}

function updateTimerDisplay() {
  timerDisplay.textContent = formatTime(timeLeft);
}

timeSelect.addEventListener('change', () => {
  timeLeft = parseInt(timeSelect.value) * 60;
  window.electron.ipcRenderer.send('reset-timer', timeSelect.value);
  updateTimerDisplay();
  startBtn.disabled = false; // Enable start button on reset
});

startBtn.addEventListener('click', () => {
  window.electron.ipcRenderer.send('start-timer', timeSelect.value);
  startBtn.disabled = true; // Disable start button when timer starts
});

pauseBtn.addEventListener('click', () => {
  window.electron.ipcRenderer.send('pause-timer');
});

resetBtn.addEventListener('click', () => {
  window.electron.ipcRenderer.send('reset-timer', timeSelect.value);
  updateTimerDisplay();
  startBtn.disabled = false; // Enable start button on reset
});

resumeBtn.addEventListener('click', () => {
  window.electron.ipcRenderer.send('resume-timer');
});

window.electron.ipcRenderer.on('update-timer', (event, time) => {
  timeLeft = time;
  updateTimerDisplay();
});

window.electron.ipcRenderer.on('timer-finished', () => {
  const audio = new Audio('papercut.mp3');
 
  
  audio.play().then(() => {
    audio.loop = true;
    setTimeout(() => {
      audio.loop = false;
      audio.pause();
    }, 10000);
  }).catch(() => {
    new Notification('Pomodoro Timer', { body: 'Time is up! Take Frequent Break' });
  });
  new Notification('Pomodoro Timer', { body: 'Time is up! Take Frequent Break' });
  timeLeft = 0;
  updateTimerDisplay();
  startBtn.disabled = false; // Enable start button when timer finishes
});

updateTimerDisplay();
