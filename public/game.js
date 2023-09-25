const config = {
    type: Phaser.AUTO,  // Use WebGL if available, otherwise use Canvas
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
    // Load game assets here
    this.load.image('dude', 'dude.png');
    this.load.image('dude2', 'dude2.png');
}

function create() {
    this.add.image(400, 300, 'dude');
    this.add.image(200, 300, 'dude2');
}


function update() {
    // Game loop logic here
}
