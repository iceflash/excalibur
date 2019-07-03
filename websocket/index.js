const https = require('https');
const util = require('util');
const fs = require('fs');
const WebSocket = require('ws');

let games = {}; // for games rooms

const CLIENT_CMD_CREATE_ROOM  = 'cr_room';
const CLIENT_CMD_JOIN_ROOM    = 'jn_room';
const CLIENT_CMD_SEND         = 'snd';

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
    let msg = JSON.parse(message);
    
    console.log('[rcv-msg]', msg);
    // messages from client
    // 1. create game room -> return player id (maybe in connection)
    // 2. join game room -> return player id (maybe in connection)
    // 3. player pad control -> send other player
    if(msg.cmd == CLIENT_CMD_CREATE_ROOM){
      //console.log(msg.cmd);
      
      // TODO: for later use 
      // if(!games[message.gameid]) {

      // }
      // else{ //game already exist
      //   ws.send({cmd: SERVER_CMD_ERROR, data:'game with this id is already created'})
      // }
    }

    if(msg.cmd == CLIENT_CMD_JOIN_ROOM){
      
      // generate player id, save, for now stub:
      games[msg.gameid].pl2 = 102;
      games[msg.gameid][102] = ws; //save player connect

    }

    switch (msg.cmd) {
      case CLIENT_CMD_CREATE_ROOM:
          
          games[msg.gameid] = {
            state: {pl1: 100, pl2: 0,},
            100: ws,
          }
          // send result
          ws.send(JSON.stringify({cmd: SERVER_CMD_INFO, data: 'game created'}));
          ws.send(JSON.stringify({cmd: SERVER_CMD_GAME_INFO, data: games[msg.gameid].state}));
        break;
      case CLIENT_CMD_SEND:
        // data from client player
        console.log('[gi]', msg.state.gameid, msg.state.pl, msg.state.ball);
        break;
      default:
        break;
    }
  })

  // send hello)
  ws.send('ho!')
})
