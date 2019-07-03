const https = require('https');
const fs = require('fs');
const WebSocket = require('ws');

let games = {}; // for games rooms

const CLIENT_CMD_CREATE_ROOM  = 'cr_room';
const CLIENT_CMD_JOIN_ROOM    = 'jn_room';


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

    // messages from client
    // 1. create game room -> return player id (maybe in connection)
    // 2. join game room -> return player id (maybe in connection)
    // 3. player pad control -> send other player
  })

  // send hello)
  ws.send('ho!')
})