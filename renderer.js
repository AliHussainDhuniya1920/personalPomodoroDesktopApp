let timeLeft = 20 * 60; // Default 20 minutes
let timerInterval;

function updateTimerDisplay() {
  const minutes = Math.floor(timeLeft / 60).toString().padStart(2, '0');
  const seconds = (timeLeft % 60).toString().padStart(2, '0');
  document.getElementById('timer').textContent = `${minutes}:${seconds}`;
}

document.getElementById('startBtn').addEventListener('click', () => {
  clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      alert('Time is up!');
      timeLeft = 0;
      updateTimerDisplay();
    } else {
      timeLeft--;
      updateTimerDisplay();
    }
  }, 1000);
});

document.getElementById('pauseBtn').addEventListener('click', () => {
  clearInterval(timerInterval);
});

document.getElementById('resetBtn').addEventListener('click', () => {
  clearInterval(timerInterval);
  timeLeft = 20 * 60; // Reset to 20 minutes
  updateTimerDisplay();
});

updateTimerDisplay();
