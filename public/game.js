const SERVER_URL = window.location.hostname === "localhost" ? "http://localhost:3000" : "https://n0thn-76d921721851.herokuapp.com/";
const socket = io.connect(SERVER_URL);
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

const game = new Phaser.Game(config);

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
        let movementData = {
            character: assignedCharacter,
            direction: event.key
        };
        socket.emit('moveCharacter', movementData);
    });

    // Set up the socket listener for character movement
    socket.on('characterMoved', (data) => {
        if (data.character === 'character1') {
            char1Movement = data.direction;
        } else {
            char2Movement = data.direction;
        }
    });

    socket.on('assignCharacter', (character) => {
        assignedCharacter = character;
    });
}

function update() {
    // Handle character1 movement
    if (char1Movement) {
        if (char1Movement === 'ArrowUp') {
            char1.y -= 5;
        } else if (char1Movement === 'ArrowDown') {
            char1.y += 5;
        } // ... handle other directions

        char1Movement = null;
    }

    // Handle character2 movement
    if (char2Movement) {
        if (char2Movement === 'ArrowUp') {
            char2.y -= 5;
        } else if (char2Movement === 'ArrowDown') {
            char2.y += 5;
        } // ... handle other directions

        char2Movement = null;
    }

    // ... (other game loop logic)
}
