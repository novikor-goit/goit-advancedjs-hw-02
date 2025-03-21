import flatpickr from 'flatpickr';
import iziToast from 'izitoast';

import 'izitoast/dist/css/iziToast.min.css';
import 'flatpickr/dist/flatpickr.min.css';

let userSelectedDate = null;

const button = document.querySelector('[data-start]');
function switchButtonState(enabled) {
  button.disabled = !enabled;
}

/**
 * @param {Date} selectedDate
 */
function validateDateTime(selectedDate) {
  if (selectedDate.getTime() <= Date.now()) {
    iziToast.error({
      message: 'Please choose a date in the future',
    });
    switchButtonState(false);
    return;
  }
  switchButtonState(true);
  userSelectedDate = selectedDate;
}

flatpickr('#datetime-picker', {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    validateDateTime(selectedDates[0]);
  },
});

function convertMs(ms) {
  // Number of milliseconds per unit of time
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  return {
    days: Math.floor(ms / day),
    hours: Math.floor((ms % day) / hour),
    minutes: Math.floor(((ms % day) % hour) / minute),
    seconds: Math.floor((((ms % day) % hour) % minute) / second),
  };
}

function renderCountdown(timeDimensions) {
  for (const [dimension, value] of Object.entries(timeDimensions)) {
    const elem = document.querySelector(`[data-${dimension}]`);
    elem.innerText = String(value).padStart(2, '0');
  }
}

let intervalId = null;
button.addEventListener('click', () => {
  clearInterval(intervalId);
  switchButtonState(false);
  intervalId = setInterval(() => {
    const now = new Date();
    const remainingTime = userSelectedDate ? userSelectedDate - now : 0;

    if (remainingTime <= 0) {
      iziToast.success({
        message: 'Time is up!',
      });
      switchButtonState(true);
      clearInterval(intervalId);
      return;
    }

    renderCountdown(convertMs(remainingTime));
  }, 1000);
});
