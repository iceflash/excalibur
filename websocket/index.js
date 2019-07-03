const https = require('https');
const fs = require('fs');
const WebSocket = require('ws');

let games = {}; // for games rooms

const CLIENT_CMD_CREATE_ROOM  = 'cr_room';
const CLIENT_CMD_JOIN_ROOM    = 'jn_room';
const SERVER_CMD_INFO         = 'info';
const SERVER_CMD_ERROR        = 'err';
const SERVER_CMD_GAME_INFO    = 'ginfo';


const app = https.createServer({
    key: fs.readFileSync('/var/node/certs/server_local.key'),
    cert: fs.readFileSync('/var/node/certs/server_local.crt'),
}).listen(8001);

const wss = new WebSocket.Server({ server: app});

wss.on('connection', (ws) => {
  console.log('[conn]');
  
  // listner for connection message
  ws.on('message', (message) => {
    console.log('[rcv-msg]', message);

    console.log(message.data);
    console.log(message.data.cmd);
    // messages from client
    // 1. create game room -> return player id (maybe in connection)
    // 2. join game room -> return player id (maybe in connection)
    // 3. player pad control -> send other player
    if(message.data.cmd == CLIENT_CMD_CREATE_ROOM){
      
      // TODO: for later use 
      // if(!games[message.gameid]) {

      // }
      // else{ //game already exist
      //   ws.send({cmd: SERVER_CMD_ERROR, data:'game with this id is already created'})
      // }

      games[message.data.gameid] = {
        pl1: 100, pl2: 0,
      }
      // send result
      ws.send({cmd: SERVER_CMD_INFO, data: 'game created'});
      ws.send({cmd: SERVER_CMD_INFO, data: games[message.data.gameid]});
    }

    if(message.cmd == CLIENT_CMD_JOIN_ROOM){
      
      // generate player id, save, for now stub:
      games[message.gameid].pl2 = 102;

    }
  })

  // send hello)
  ws.send('ho!')
})