import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

function generatePromise(delay, mustFulfill) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      mustFulfill
        ? resolve(`✅ Fulfilled promise in ${delay}ms`)
        : reject(`❌ Rejected promise in ${delay}ms`);
    }, delay);
  });
}

document.querySelector('form').addEventListener('submit', async event => {
  event.preventDefault();
  const formData = new FormData(event.target);

  const delay = Number(formData.get('delay'));
  const mustFulfill = formData.get('state') === 'fulfilled';

  generatePromise(delay, mustFulfill)
    .then(message => {
      iziToast.success({
        title: 'Fulfilled',
        message: message,
      });
    })
    .catch(message => {
      iziToast.error({
        title: 'Rejected',
        message: message,
      });
    });

  event.target.reset();
});
