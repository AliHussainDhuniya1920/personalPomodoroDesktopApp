let timeLeft = 20 * 60; // Default 20 minutes
const timeSelect = document.getElementById('timeSelect');
const timerDisplay = document.getElementById('timer');

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
});

document.getElementById('startBtn').addEventListener('click', () => {
  window.electron.ipcRenderer.send('start-timer', timeSelect.value);
});

document.getElementById('pauseBtn').addEventListener('click', () => {
  window.electron.ipcRenderer.send('pause-timer');
});

document.getElementById('resetBtn').addEventListener('click', () => {
  window.electron.ipcRenderer.send('reset-timer', timeSelect.value);
  updateTimerDisplay();
});

document.getElementById('resumeBtn').addEventListener('click', () => {
  window.electron.ipcRenderer.send('resume-timer');
});

window.electron.ipcRenderer.on('update-timer', (event, time) => {
  timeLeft = time;
  updateTimerDisplay();
});

window.electron.ipcRenderer.on('timer-finished', () => {
  new Notification('Pomodoro Timer', { body: 'Time is up!' });
  timeLeft = 0;
  updateTimerDisplay();
});

updateTimerDisplay();
