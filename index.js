const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files (like your game's assets, CSS, JS, etc.)
app.use(express.static(path.join(__dirname, 'public')));

// Route to serve the game's main page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});


const http = require('http');
const socketIo = require('socket.io');


const server = http.createServer(app);
const io = socketIo(server);
let players = [];
io.on('connection', (socket) => {
    console.log('a user connected');
    if (players.length < 2) {
        players.push(socket.id);
        socket.emit('assignCharacter', players.length === 1 ? 'character1' : 'character2');
    }
    
    socket.on('moveCharacter', (data) => {
        // Broadcast the movement data to other clients
        socket.broadcast.emit('characterMoved', data);
    });
    
    // Handle movement events here

    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

