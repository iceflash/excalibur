const ball = {
  x: 200,
  y: 200,
  r: 10,
  speed: 3,
  direction: 70, // 0 is down direction

  draw: function(ctx){
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, 180);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
  },

  move: function(){
    this.borderCollide(canvas.width, canvas.height);

    this.x += Math.sin(this.direction*Math.PI/180)*this.speed;
    this.y += Math.cos(this.direction*Math.PI/180)*this.speed;
  },

  borderCollide: function (w,h){
    
    if(this.x+this.r>w ||this.x-this.r<0){
      this.direction = this.direction * -1;
      console.log('[collide-x]', this.direction);
      return true;
    }

    if(this.y+this.r>h ||this.y-this.r<0){
      this.direction = 180 - this.direction; 
      
      console.log('[collide-y]', this.direction);
      return true;
    }
  },

  rectCollide: function (rect){
    
    //left pad collide
    if((this.x - this.r) < rect.x+rect.w &&
        ((this.y+this.r) > rect.y &&
        (this.y-this.r) < rect.y+rect.h)){

      // make bounce
      this.direction = this.direction * -1;
      console.log('[collide-with-pad-x]', this.direction);
      return true;
    }
  }

};

const playerPad = {
  x: 10,
  y: 10,
  w: 10,
  h: 50,
  speed: 3,
  direction: 0, // 0 is down direction

  draw: function(ctx){
    ctx.beginPath();
    ctx.fillStyle = "#FF95FF";
    ctx.fillRect(this.x, this.y, this.w, this.h);
    // ctx.fill();
    ctx.closePath();
  },

  movePad: function(dy){
    
    this.y += dy;
    if (this.borderCollide(canvas.width, canvas.height)) {
      if(this.y < 0) this.y =0;
      if(this.y + this.h >= canvas.height) this.y = canvas.height - this.h;
    }
  },

  borderCollide: function (w,h){
    
    if(this.y+this.h > h ||this.y < 0){       
      // console.log('[collide-pad-y]', this.y);
      return true;
    }
  },
};

let ctx, canvas; //main canvas
let timer;
let lastrun;
let fps;
let stopped=false;

let connection; // websocket

let plx, ply;

function controller(e){
  
  //move pad
  if(!plx) plx = e.x;
  if(!ply) ply = e.y;

  //get delta and direction
  //let delta = Math.min((Math.max(ply, e.y) - Math.min(ply, e.y)), 10);
  let delta = Math.max(ply, e.y) - Math.min(ply, e.y);

  if(ply < e.y) {playerPad.movePad(delta)} else {playerPad.movePad(-delta)}
  
  plx = e.x;
  ply = e.y;

  // console.log(e, delta);
}

function controllerPress(e){
  
  let delta = 5;

  if(e.keyCode == '38') playerPad.movePad(-delta) // UP
  if(e.keyCode == '40') playerPad.movePad(delta) // DOWN
  
  // console.log(e);
}

function loop(){

  if(stopped) return;

  //calc fps
  if(!lastrun) lastrun = performance.now();
  let delta = (performance.now() - lastrun)/1000;
  fps = 1/delta;
  lastrun = performance.now();

  ball.move();
  //collision
  ball.rectCollide(playerPad)
  //clear
  ctx.save();
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  //show fps
  ctx.fillText(`fps: ${fps.toFixed(2)}`, 280, 10);
  
  //draw
  ball.draw(ctx);
  playerPad.draw(ctx);

  ctx.restore();

  window.requestAnimationFrame(loop);
}

function createGameRoom(){
  
  const dataPck = {
    cmd: 'cr_room',
    gameid: 1,
  };
  connection.send(dataPck);
}

function joinGameRoom(){
  
  const dataPck = {
    cmd: 'jn_room',
    gameid: 1,
  };

  connection.send(dataPck);
}


function init(){
    canvas = document.getElementById('pong');
    ctx = canvas.getContext('2d');

    stopped = true;

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
      connection.send('hey!');
    }

    connection.onmessage = (ev) => {
      console.log('ws-msg', ev)
    }

    connection.onclose = (ev) => { console.log('[ws-close]', ev)}
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
    
    window.removeEventListener('mousemove', controller);
    window.removeEventListener('keydown', controllerPress);

    //stop timers
    // clearInterval(timer);
  },
};

export default View;