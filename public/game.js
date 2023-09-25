const SERVER_URL = window.location.hostname === "localhost" ? "http://localhost:3000" : "https://n0thn-76d921721851.herokuapp.com/";
const socket = io.connect(SERVER_URL);

socket.on('connect', () => {
    console.log('Connected to the server with socket id:', socket.id);
});
socket.on('assignCharacter', (character) => {
    assignedCharacter = character;
    console.log('Assigned character:', assignedCharacter);
});

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

document.getElementById('startGameButton').addEventListener('click', function () {
    // Prevent multiple game instances
    if (!window.gameInstance) {
        window.gameInstance = new Phaser.Game(config);
    }
});

function preload() {
    this.load.image('character1', 'dude.png');
    this.load.image('character2', 'dude2.png');
}

let char1, char2;
let char1Movement = null;
let char2Movement = null;
let assignedCharacter;

function create() {
    char1 = this.add.sprite(100, 300, 'character1');
    char2 = this.add.sprite(700, 300, 'character2');

  // Set up the keyboard input listener
this.input.keyboard.on('keydown', (event) => {
    if (!assignedCharacter) {
        console.warn('Character not assigned yet.');
        return;
    }
    
    let movementData = {
        character: assignedCharacter,
        direction: event.key
    };
    console.log('Sending movement data to server:', movementData);
    socket.emit('moveCharacter', movementData);

    // Prevent the default action (scrolling) for arrow keys
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key)) {
        event.preventDefault();
    }
});


    // Set up the socket listener for character movement
    socket.on('characterMoved', (data) => {
        console.log('Received movement data:', data);
        if (data.character === 'character1') {
            char1Movement = data.direction;
        } else {
            char2Movement = data.direction;
        }
    });

    socket.on('assignCharacter', (character) => {
        console.log('Assigned character:', character);
        assignedCharacter = character;
    });
}

function update() {

    if (char1Movement) {
        console.log("Moving character1:", char1Movement);
        if (char1Movement === 'ArrowUp') {
            char1.y -= 5;
        } else if (char1Movement === 'ArrowDown') {
            char1.y += 5;
        }
        handleMovement(char1, char1Movement);
        char1Movement = null;
    }

    // Handle character2 movement
    if (char2Movement) {
        console.log("Moving character2:", char2Movement);
        if (char2Movement === 'ArrowUp') {
            char2.y -= 5;
        } else if (char2Movement === 'ArrowDown') {
            char2.y += 5;
        }
        handleMovement(char2, char2Movement);
        char2Movement = null;
    }
}

function handleMovement(character, direction) {
    switch (direction) {
        case 'ArrowUp':
            character.y -= 5;
            break;
        case 'ArrowDown':
            character.y += 5;
            break;
        case 'ArrowLeft':
            character.x -= 5;
            break;
        case 'ArrowRight':
            character.x += 5;
            break;
    }
}
socket.on('characterMoved', (data) => {
    console.log('Client received characterMoved event:', data);
    if (data.character === 'character1') {
        char1Movement = data.direction;
    } else {
        char2Movement = data.direction;
    }
});
