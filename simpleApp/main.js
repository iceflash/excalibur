import state from './store';
import App from './App';

console.log('main script');

const app = new App();

// app.subscribe('field', (e) => {
//   console.log('[sub]', e);
// })

window.addEventListener('load', () =>{
  console.log('loaded...');

  //init
  const formField = document.getElementById('formField');
  console.log(formField.attributes['data-v'].value);

  formField.addEventListener('input', (event) => {
      app.data[formField.attributes['data-v'].value] = formField.value;
  });

  document.addEventListener('input', (event) => {
    // console.log('[doc]',event);
  });
});