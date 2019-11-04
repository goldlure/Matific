// init
let canvas = document.getElementById("myCanvas");
let ctx = canvas.getContext("2d");

//game's components
let myComponents = [];

let myBoat;
const myBoatWidth = 230;
const myBoatStartXPosition = 500;
const myBoatStartYPosition = 400;

let myPlane;
const myPlaneWidth = 145;
const myPlaneStartXPosition = canvas.width;
const myPlaneStartYPosition = 20;

let myParashutist;
const myParashutistWidth = 60;

let myParashutists = [];

let mySea;
const mySeaStartXPosition = 0;
const mySeaStartYPosition = 500;

const textMargin = 20;

// time of the last object spawned
let lastSpawn = -1;

// start time (used to calc elapsed time)
let startTime = Date.now();

let randomTime = 0;

//game's messages
let myScore;
let myLives;
let myExit;

//default start counters
let score = 0;
let lives = 3;

//flag to check if game is alread started
let myStart = true;

//keyboard's states
let rightPressed = false;
let leftPressed = false;

// keyboard
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
function keyDownHandler(e) {
    if ("code" in e) {
        switch (e.code) {
            case "Unidentified":
                break;
            case "ArrowRight":
            case "Right": // IE <= 9 and FF <= 36
            case "KeyD":
                rightPressed = true;
                return;
            case "ArrowLeft":
            case "Left": // IE <= 9 and FF <= 36
            case "KeyA":
                leftPressed = true;
                return;
            case "Escape":
                myGameArea.stop();
                return;
            case "Enter":
                if (!myStart)
                    myGameArea.start();
                return;
            default:
                return;
        }
    }
}
function keyUpHandler(e) {
    if ("code" in e) {
        switch (e.code) {
            case "Unidentified":
                break;
            case "ArrowRight":
            case "Right": // IE <= 9 and FF <= 36
            case "KeyD":
                rightPressed = false;
                return;
            case "ArrowLeft":
            case "Left": // IE <= 9 and FF <= 36
            case "KeyA":
                leftPressed = false;
                return;
            default:
                return;
        }
    }
}

//create game's component and start game
function startGame() {

    mySea = new MovingComponent(
        mySeaStartXPosition, mySeaStartYPosition,
        "resources/sea.png"
    );
    myComponents.push(mySea);

    myBoat = new Boat(
        myBoatStartXPosition, myBoatStartYPosition,
        "resources/boat.png"
    );
    myComponents.push(myBoat);

    myPlane = new Plane(
        myPlaneStartXPosition, myPlaneStartYPosition,
        "resources/plane.png"
    );
    myComponents.push(myPlane);

    myScore = new TextComponent("20px", "Consolas", textMargin, textMargin*2);
    myLives = new TextComponent("20px", "Consolas", textMargin, textMargin*4);
    myExit = new TextComponent("20px", "Consolas", textMargin, canvas.height - textMargin);

    myGameArea.start();
}

let myGameArea = {
    start: function () {
        myStart = true;
        score = 0;
        lives = 3;
        rightPressed = false;
        leftPressed = false;
        this.score = score;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        animate();
    },
    stop: function () {
        //destroy all spawned parachutists
        myParashutists.length = 0;
        myStart = false;
        ctx.font = "20px Consolas";
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillText("END", canvas.width / 2, canvas.height / 2);
        ctx.fillText("Press ENTER to start again", 20, canvas.height - 20);
    }
};

class TextComponent {
    constructor(size, font, x, y) {
        this.size = size;
        this.font = font;
        this.x = x;
        this.y = y;
    }
    update(text, value) {
        this.text = text + value;
        ctx.font = this.size + " " + this.font;
        ctx.fillText(this.text, this.x, this.y);
    };
}

// parent class for all images
class MovingComponent {
    constructor(x, y, src) {
        this.x = x;
        this.y = y;
        this.src = src;
    }
    //redraw component
    update() {
        let img = new Image();
        img.src = this.src;
        ctx.drawImage(img, this.x, this.y);
    };
    //return current position of component
    getPos() {
        return this.x;
    };
    move(){};
}

class Boat extends MovingComponent {
    constructor(x, y, src) {
        super(x, y, src);
        this.y = y;
        this.x = x;
    };
    //boat can move right and left inside canvas
    move() {
        const velocity = 5;
        if (rightPressed) {
            this.x += velocity;
        }
        else if (leftPressed) {
            this.x -= velocity;
        }
        
        if (this.x <= 0) {
            this.x = 1;
        } else if (this.x > canvas.width - myBoatWidth) {
            this.x = canvas.width - myBoatWidth;
        }
    };
}

class Plane extends MovingComponent {
    constructor(x, y, src) {
        super(x, y, src);
        this.x = x;
    };
    //plane can move from right to left inside canvas
    move() {
        this.x--;
        if (this.x <= -myPlaneWidth) {
            this.x = myPlaneStartXPosition;
        }
    };
}

class Parachutist extends MovingComponent {
    constructor(x, y, src) {
        super(x, y, src);
        this.y = y;
        this.x = x;
    };
    //parachutist is dropped from plane position 
    //and move till the level of water or boat
    move() {
        if (this.y > myBoatStartYPosition) {
            let boatPos = myBoat.getPos();
            if (this.x < boatPos + myBoatWidth && this.x >= boatPos) {
                score += 10;  
            }
            else {
                lives--;
            }
            myParashutists.shift();
        }
        this.y++;
    };
}

//create new parachutist 
function spawnParachutist(posPlane) {
    return myParashutist = new Parachutist(
        posPlane,
        myPlaneStartYPosition,
        "resources/parachutist.png"
    );
}

//update random time to next spawned parachutist
function updateRandomTime(){
    randomTime = Math.floor(Math.random() * 10000);
    //add 1000ms in case randomTime is rounded to 0
    if (randomTime < 1000)
        randomTime += 1000;
}

function animate() {
    if (lives <= 0 || !myStart) {
        myGameArea.stop();
        return;
    }
    // get the elapsed time
    var time = Date.now();

    // check time to spawn a new parachutist   
    if (time > lastSpawn + randomTime) {
        lastSpawn = time;
        var posPlane = myPlane.getPos();
        if (posPlane > myParashutistWidth && posPlane < (canvas.width - myParashutistWidth)) {
            myParashutist = spawnParachutist(posPlane);
            myParashutists.push(myParashutist);
            updateRandomTime();
        }
    }
    requestAnimationFrame(animate);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (var parachutist of myParashutists) {
        parachutist.move();
        parachutist.update();
    }
    for (var component of myComponents) {
        component.move();
        component.update();
    }

    myScore.update("SCORE: ", score);
    myLives.update("LIVES: ", lives);
    myExit.update("Press ESC to quit", '');
}
