// server.js
const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', ws => {
  ws.on('message', message => {
    console.log('received: %s', message);
    const response = { reply: `You said: ${message}` };
    ws.send(JSON.stringify(response));
  });

  ws.send(JSON.stringify({ reply: 'Welcome to the WebSocket server' }));
});

console.log('WebSocket server is running on ws://localhost:8080');
