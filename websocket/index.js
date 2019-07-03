const https = require('https');
const fs = require('fs');
const WebSocket = require('ws');

const app = https.createServer({
    key: fs.readFileSync('/var/node/certs/server_local.key'),
    cert: fs.readFileSync('/var/node/certs/server_local.crt'),
}).listen(8001);

const wss = new WebSocket.Server({ server: app});

wss.on('connection', (ws) => {
  console.log('[conn]');
  
  ws.on('message', (message) => {
    console.log(`Received message => ${message}`);
  })

  ws.send('ho!')
})