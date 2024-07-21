const WebSocket = require('ws');
const axios = require('axios');
const express = require('express');
const http = require('http');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const CHATGPT_API_URL = 'https://api.openai.com/v1/chat/completions';
const CHATGPT_API_KEY = ''; // Replace with your actual API key

wss.on('connection', ws => {
  console.log('Client connected');

  ws.on('message', async message => {
    console.log('Received:', message);

    try {
      const userMessage = JSON.parse(message); // Parse the incoming message
      if (userMessage && userMessage.content) {
        const response = await axios.post(
          CHATGPT_API_URL,
          {
            model: 'gpt-3.5-turbo',
            messages: [{ role: 'user', content: userMessage.content }]
          },
          {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${CHATGPT_API_KEY}`
            }
          }
        );

        const chatResponse = response.data.choices[0].message.content;
        
        // Simulate streaming by sending chunks of the response
        const chunkSize = 50;
        for (let i = 0; i < chatResponse.length; i += chunkSize) {
          const chunk = chatResponse.slice(i, i + chunkSize);
          ws.send(JSON.stringify({ message: chunk }));
          await new Promise(resolve => setTimeout(resolve, 100)); // Adjust delay as needed
        }

      } else {
        ws.send(JSON.stringify({ message: 'Invalid message format' }));
      }
    } catch (error) {
      console.error('Error:', error.response ? error.response.data : error.message);
      ws.send(JSON.stringify({ message: 'Error communicating with ChatGPT API' }));
    }
  });

  ws.on('close', () => {
    console.log('Client disconnected');
  });
});

server.listen(8080, () => {
  console.log('WebSocket server is running on ws://localhost:8080');
});
