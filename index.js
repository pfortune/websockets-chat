const express = require('express');
const http = require('http');
const WebSocket = require('ws');

const app = express();
app.use(express.static('public')); // Serve static files from 'public'

const server = http.createServer(app); // HTTP server wrapping the Express app

// WebSocket server attached to the HTTP server
const wss = new WebSocket.Server({ server });

wss.on('connection', (socket) => {
  console.log('A user connected');

  // Correctly listen for messages from the client
  socket.on('message', (message) => {
    // Broadcast the received message to all other connected clients
    wss.clients.forEach((client) => {
      if (client !== socket && client.readyState === WebSocket.OPEN) {
        client.send(message); // Now 'message' is defined and received from the client
      }
    });

    console.log(`Received message: ${message}`); // Add this line

  });

  socket.on('close', () => {
    console.log('User disconnected');
  });
});

server.listen(process.env.PORT || 3000, () => console.log('Server started on port ' + (process.env.PORT || 3000)));
