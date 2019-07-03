import state from './store';
import App from './App';

import homeView from './views/home';
import aboutView from './views/about';
import pongView from './views/pingpong';

console.log('main script');

const app = new App();

const routes = {
  '/': homeView,
  '/about': aboutView,
  '/pong': pongView,
};

app.routes = routes;
window.$app = app;

window.addEventListener('load', () =>{
  console.log('loaded...');
});

window.addEventListener('loadend', (e) => {
  console.log('[loadend]',e);
})

window.addEventListener('loadstart', (e) => {
  console.log('[loadstart]',e);
})

function createGameRoom(){
  console.log(`create game room `);
}