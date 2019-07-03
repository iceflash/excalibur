import Ball from "./../../pong/ball";
import PlayerPad from "./../../pong/playerPad";

const CLIENT_CMD_CREATE_ROOM  = 'cr_room';
const CLIENT_CMD_JOIN_ROOM    = 'jn_room';
const CLIENT_CMD_SEND         = 'snd';

const SERVER_CMD_INFO         = 'info';
const SERVER_CMD_ERROR        = 'err';
const SERVER_CMD_GAME_INFO    = 'ginfo';

// let playerPad1, playerPad2, ball;

let ctx, canvas; //main canvas
let timer;
let lastrun;
let fps;
let stopped=false;

let connection; // websocket

const sendDataInterval = 100;
// let plx, ply;

const gameState = {
  playerPad1: '',
  playerPad2: '',
  ball: '',
  sball: '',
  curPlayer: '',
  plx: 0, ply: 0, // last pointer x,y. for delta in speed boost for moving pad
};


function controller(e){
  
  if(!gameState.curPlayer) return

  // console.log(gameState.curPlayer);

  //move pad
  if(!gameState.plx) gameState.plx = e.x;
  if(!gameState.ply) gameState.ply = e.y;

  //get delta and direction
  //let delta = Math.min((Math.max(ply, e.y) - Math.min(ply, e.y)), 10);
  let delta = Math.max(gameState.ply, e.y) - Math.min(gameState.ply, e.y);

  if(gameState.ply < e.y) {gameState.curPlayer.movePad(delta)} else {gameState.curPlayer.movePad(-delta)}
  
  gameState.plx = e.x;
  gameState.ply = e.y;
}

/**
 * key pres up/dopwn
 * @param {e} event 
 */
function controllerPress(e){
  
  if(!gameState.curPlayer) return

  let delta = 5;

  // TODO: keycode in constant
  if(e.keyCode == '38') gameState.curPlayer.movePad(-delta) // UP
  if(e.keyCode == '40') gameState.curPlayer.movePad(delta) // DOWN
}

function loop(){

  if(stopped) return;

  //calc fps
  if(!lastrun) lastrun = performance.now();
  let delta = (performance.now() - lastrun)/1000;
  fps = 1/delta;
  lastrun = performance.now();

  // calc game state
  gameState.ball.move();
  //collision only for curPlayer(?)
  gameState.ball.rectCollide(gameState.playerPad1);
  gameState.ball.rectCollide(gameState.playerPad2);

  //clear
  ctx.save();
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  //show fps
  ctx.fillText(`fps: ${fps.toFixed(2)}`, 280, 10);
  
  //draw
  gameState.ball.draw(ctx);
  gameState.sball.draw(ctx);
  gameState.playerPad1.draw(ctx);
  gameState.playerPad2.draw(ctx);

  ctx.restore();

  window.requestAnimationFrame(loop);
}

function getGameState(){
  let state = {
    pl: {
      x: gameState.curPlayer.x,
      y: gameState.curPlayer.y,
      id: gameState.curPlayer.id,
    },
    ball: {
      x: gameState.ball.x,
      y: gameState.ball.y,
    },
    gameid: 1, // FIXME
  };

  return state;
}

// handler for timer
function sendGameState(){
  const state = getGameState();
  const pck = {
    cmd: CLIENT_CMD_SEND,
    data: state
  }
  sendMsg(pck);
}

function createGameRoom(){
  
  const dataPck = {
    cmd: 'cr_room',
    gameid: 1,
  };
  
  sendMsg(dataPck)

  //FIXME: set timer for send data every n ms
    
  timer = setInterval(sendGameState, sendDataInterval);
  
  gameState.playerPad1.id = 100;
  gameState.curPlayer = gameState.playerPad1;
}

function joinGameRoom(){
  
  const dataPck = {
    cmd: 'jn_room',
    gameid: 1,
  };

  sendMsg(dataPck);

  //stub
  gameState.playerPad2.id  = 102;
  gameState.curPlayer = gameState.playerPad2;

  timer = setInterval(sendGameState, sendDataInterval);
}

function sendMsg(msg){
  connection.send(JSON.stringify(msg))
}

function init(){
    canvas = document.getElementById('pong');
    ctx = canvas.getContext('2d');

    gameState.ball        = new Ball(canvas.width, canvas.height);
    gameState.sball       = new Ball(canvas.width, canvas.height);
    gameState.sball.fillStyle = "rgba(100,150,185,0.5)";
    
    gameState.playerPad1 = new PlayerPad(canvas.width, canvas.height);
    
    gameState.playerPad2 = new PlayerPad(canvas.width, canvas.height);
    
    gameState.playerPad2.fillStyle = "#f53e1e";
    gameState.playerPad2.x   = canvas.width - gameState.playerPad2.w - 10;
    gameState.playerPad2.id  = 102;
    
    stopped = true; // stoped main loop

    //start main game loop
    window.requestAnimationFrame(loop);
    //set controll
    window.addEventListener('mousemove', controller);
    window.addEventListener('keydown', controllerPress);
    
    canvas.addEventListener('mousedown', (e) => {
      stopped = !stopped;
      window.requestAnimationFrame(loop);
    });

    //check web socket
    const url = 'wss://icedev.pro:8001';
    connection = new WebSocket(url);

    connection.onerror = error => {
      console.log('[ws-error]', error)
    }

    connection.onopen = () => {
      //connection ready
    }

    connection.onmessage = (ev) => {
      // console.log('ws-msg', ev.data);
      let msg = JSON.parse(ev.data);

      switch (msg.cmd) {
        case SERVER_CMD_INFO:
          console.log('ws-info', msg.data);
          break;
        case SERVER_CMD_GAME_INFO:
          //sync objects (only enemy and ball) FIXME:
          if(gameState.curPlayer.id === gameState.playerPad1.id){
            if(msg.data[gameState.playerPad2.id]){
              gameState.playerPad2.x = msg.data[gameState.playerPad2.id].x;
              gameState.playerPad2.y = msg.data[gameState.playerPad2.id].y;
            }
          }else{
            if(msg.data[gameState.playerPad1.id]){
              gameState.playerPad1.x = msg.data[gameState.playerPad1.id].x;
              gameState.playerPad1.y = msg.data[gameState.playerPad1.id].y;
            }
          }
          // gameState.ball.x = msg.data.ball.x;
          // gameState.ball.y = msg.data.ball.y;
          gameState.sball.x = msg.data.ball.x;
          gameState.sball.y = msg.data.ball.y;
          break;
        default:
          break;
      }
    }

    connection.onclose = (ev) => { 
      console.log('[ws-close]', ev)
      clearInterval(timer);
    }
}


const View = {
  render: function(el){
    let res = `
    <div class="formDlg">
      Game id <input id="formField" data-v="roomId">
      <span id="createBtn" class="btnsm glow" >Create game</span>
      <span id="joinBtn" class="btnsm glow" onclick="console.log(this)">Join game</span>
    </div>
    <canvas id="pong" width=500 height="350" style="border:solid"></canvas>`;
    el.innerHTML = res;

    // add handlers
    const createBtn = document.getElementById('createBtn');
    createBtn.onclick = createGameRoom;

    const joinBtn = document.getElementById('joinBtn');
    joinBtn.onclick = joinGameRoom;
    
    //start init
    init();
  },

  destroy: () =>{
    console.log('[pong-view] destroy');
    stopped = true;
    
    connection.close();

    window.removeEventListener('mousemove', controller);
    window.removeEventListener('keydown', controllerPress);

    //stop timers
    clearInterval(timer);
  },
};

export default View;