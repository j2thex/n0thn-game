const express = require('express');
const path = require('path');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files (like your game's assets, CSS, JS, etc.)
app.use(express.static(path.join(__dirname, 'public')));

// Route to serve the game's main page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Create the server and bind both Express and socket.io to it
const server = http.createServer(app);
const io = socketIo(server);

let players = [];
io.on('connection', (socket) => {
    console.log('a user connected');
    console.log('a user connected with socket id:', socket.id);

    if (players.length < 2) {
        players.push(socket.id);
        socket.emit('assignCharacter', players.length === 1 ? 'character1' : 'character2');
    }

    socket.on('moveCharacter', (data) => {
        console.log('Received moveCharacter event from client:', data);

        io.emit('characterMoved', data);


    });


    // Handle movement events here

    socket.on('disconnect', () => {
        console.log('user disconnected');
        const index = players.indexOf(socket.id);
        if (index > -1) {
            players.splice(index, 1);
        }
    });
});

// Start the server
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
