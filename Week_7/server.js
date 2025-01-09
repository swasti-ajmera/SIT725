const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Serve static files from the "public" directory
app.use(express.static(__dirname + '/public'));

// Socket.IO connection
io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });

  // Emit random numbers every second
  setInterval(() => {
    const randomNumber = Math.floor(Math.random() * 10);
    console.log('Generated random number:', randomNumber); // Print on server console
    socket.emit('number', randomNumber);
  }, 1000);
});

// Start the server
const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
