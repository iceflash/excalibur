import state from './store';
import App from './App';

import homeView from './views/home';
import aboutView from './views/about';

console.log('main script');

const app = new App();

const routes = {
  '/': homeView,
  '/about': aboutView,
};

app.routes = routes;

window.addEventListener('load', () =>{
  console.log('loaded...');
});

window.addEventListener('loadend', (e) => {
  console.log('[loadend]',e);
})

window.addEventListener('loadstart', (e) => {
  console.log('[loadstart]',e);
})