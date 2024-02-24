const express = require('express');
const http = require('http');
const WebSocket = require('ws');

const app = express();
app.use(express.static('public'));

const server = http.createServer(app);

const wss = new WebSocket.Server({ server });

wss.on('connection', (socket) => {
  console.log('A user connected');

  // Listen for messages from the client
  socket.on('message', (message) => {
    // Broadcast the received message to all other connected clients
    wss.clients.forEach((client) => {
      if (client !== socket && client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });

    console.log(`Received message: ${message}`);
  });

  socket.on('close', () => {
    console.log('User disconnected');
  });
});

server.listen(process.env.PORT || 3000, () => console.log('Server started on port ' + (process.env.PORT || 3000)));
