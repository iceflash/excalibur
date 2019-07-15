const https = require('https');
const fs = require('fs');
const WebSocket = require('ws');

const Ball = require('./ball');

const games = {}; // for games rooms

const CLIENT_CMD_CREATE_ROOM = 'cr_room';
const CLIENT_CMD_JOIN_ROOM = 'jn_room';
const CLIENT_CMD_SEND = 'snd';

const SERVER_CMD_INFO = 'info';
const SERVER_CMD_ERROR = 'err';
const SERVER_CMD_GAME_INFO = 'ginfo';
const SERVER_CMD_GET_READY = 'ready';

const sendDataInterval = 50;
const FPS = 60;

// for now, later may be changable for game
const canvasW = 500;
const canvasH = 350;

console.log('[ws-pong] init...');

const app = https.createServer({
  key: fs.readFileSync('/var/node/certs/server_local.key'),
  cert: fs.readFileSync('/var/node/certs/server_local.crt'),
}).listen(8001);

const wss = new WebSocket.Server({ server: app });

// main loop
function syncGamesState() {
  // test 1 game (how to end game?)
  if (!games[1]) return;

  // check if not started, but ready send get ready signal
  if (!games[1].started && games[1].ready1 && games[1].ready2) {
    // send get ready
    const {state} = games[1];
    const {pl1} = state;
    const {pl2} = state;

    const ws = games[1][pl1];
    const ws2 = games[1][pl2];

    let pck = {
      cmd: SERVER_CMD_GET_READY,
    };

    pck = JSON.stringify(pck);
    ws.send(pck);
    ws2.send(pck);
    games[1].started = true;
    games[1].ball.speed = 3;
    return;
  }

  // game started make TICK and send state
  if (games[1].started) {
    const [state] = games[1];
    // check collisions and make move ball
    games[1].ball.rectCollide(state[state.pl1]);
    games[1].ball.rectCollide(state[state.pl2]);

    games[1].ball.move();

    state.ball.x = games[1].ball.x;
    state.ball.y = games[1].ball.y;

    // send info about game to players
    const {pl1} = state;
    const {pl2} = state;

    const ws = games[1][pl1];
    const ws2 = games[1][pl2];

    // send
    let pck = {
      cmd: SERVER_CMD_GAME_INFO,
      data: state,
    };

    pck = JSON.stringify(pck);
    // console.log('[sync]',pck);
    if (ws !== undefined) ws.send(pck);
    if (ws2 !== undefined) ws2.send(pck);
  }
}

setInterval(syncGamesState, 1000 / FPS);

wss.on('connection', (ws) => {
  console.log('[new conn]');

  // listner for connection message
  ws.on('message', (message) => {
    const msg = JSON.parse(message);

    // console.log('[rcv-msg]', msg);
    // messages from client
    // 1. create game room -> return player id (maybe in connection)
    // 2. join game room -> return player id (maybe in connection)
    // 3. player pad control -> send other player
    switch (msg.cmd) {
      case CLIENT_CMD_CREATE_ROOM:
        // TODO: for later use
        // if(!games[message.gameid]) {

        // }
        // else{ //game already exist
        //   ws.send({cmd: SERVER_CMD_ERROR, data:'game with this id is already created'})
        // }
        games[msg.gameid] = {
          state: { pl1: 100, pl2: 102, ball: {} },
          100: ws,
          ready1: true,
          ready2: false,
          started: false,
          ball: new Ball(canvasW, canvasH),
        };

        // send msg
        ws.send(JSON.stringify({ cmd: SERVER_CMD_INFO, data: 'game created' }));
        break;
      case CLIENT_CMD_JOIN_ROOM:
        // generate player id, save, for now stub:
        games[msg.gameid].pl2 = 102;
        games[msg.gameid][102] = ws; // save player connect

        ws.send(JSON.stringify({ cmd: SERVER_CMD_INFO, data: 'game joined' }));

        games[msg.gameid].ready2 = true;
        break;
      case CLIENT_CMD_SEND: // data from client player
        // sync only player pad in game state
        games[msg.data.gameid].state[msg.data.pl.id] = msg.data.pl;
        // games[msg.data.gameid].state.ball =  msg.data.ball;
        break;
      default:
        break;
    }
  });
});
