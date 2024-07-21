const WebSocket = require('ws');
const axios = require('axios');
const express = require('express');
const http = require('http');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const CHATGPT_API_URL = 'https://api.openai.com/v1/chat/completions';
const CHATGPT_API_KEY = 'hide'; // Replace this with your actual API key

wss.on('connection', ws => {
  console.log('Client connected');

  ws.on('message', async message => {
    console.log('Received:', message);//this I shouls fix
    try {
      const response = await axios.post(
        CHATGPT_API_URL,
        {
          model: 'gpt-3.5-turbo', // Use 'gpt-3.5-turbo' or the appropriate model
          messages: [{ role: 'user', content: 'what is cat?' }]
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${CHATGPT_API_KEY}`
          }
        }
      );
      const chatResponse = response.data.choices[0].message.content;
      ws.send(JSON.stringify({ message: chatResponse }));
    } catch (error) {
      console.error('Error:', error.response ? error.response.data : error.message);
      ws.send('Error communicating with ChatGPT API');
    }
  });

  ws.on('close', () => {
    console.log('Client disconnected');
  });
});

server.listen(8080, () => {
  console.log('WebSocket server is running on ws://localhost:8080');
});
