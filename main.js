// init
var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

//game's components
var myComponents = [];
var myBoat;
var myBoatWidth = 230;
var myBoatHeight = 140;
var myPlane;
var myPlaneWidth = 145;
var myParashutist;
var myParashutists = [];
var mySea;

// time of the last object spawned
var lastSpawn = -1;

// start time (used to calc elapsed time)
var startTime = Date.now();

var randomTime = 0;

//game's messages
var myScore;
var myLives;
var myExit;

//default start counters
var score = 0;
var lives = 3;

//flag to check if game is alread started
var myStart = true;

//keyboard's states
var rightPressed = false;
var leftPressed = false;

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

    if (e.keyCode == 39) {
        rightPressed = true;
    }
    else if (e.keyCode == 37) {
        leftPressed = true;
    }
    else if (e.keyCode == 27) {
        myGameArea.stop();
    }
    else if (e.keyCode == 13) {
        if (!myStart)
            myGameArea.start();
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

    if (e.keyCode == 39) {
        rightPressed = false;
    }
    else if (e.keyCode == 37) {
        leftPressed = false;
    }
}

//create game's component and start game
function startGame() {

    mySea = new Component(
        0, 30,
        0, 500,
        "resources/sea.png"
    );
    myComponents.push(mySea);

    myBoat = new Boat(
        myBoatWidth, myBoatHeight,
        500, 400,
        "resources/boat.png"
    );
    myComponents.push(myBoat);

    myPlane = new Plane(
        30, 30,
        900, 20,
        "resources/plane.png"
    );
    myComponents.push(myPlane);

    myScore = new TextComponent("20px", "Consolas", 20, 40);
    myLives = new TextComponent("20px", "Consolas", 20, 70);
    myExit = new TextComponent("20px", "Consolas", 20, canvas.height - 20);

    myGameArea.start();
}

var myGameArea = {
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
        for (let parachutist of myParashutists){
            myParashutists.shift();
        }
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
class Component {
    constructor(width, height, x, y, src) {
        this.width = width;
        this.height = height;
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

class Boat extends Component {
    constructor(width, height, x, y, src) {
        super(width, height, x, y, src);
        this.width = width;
        this.height = height;
        this.y = y;
        this.x = x;
    };
    //boat can move right and left inside canvas
    move() {
        if (rightPressed) {
            this.x += 5;
        }
        else if (leftPressed) {
            this.x -= 5;
        }
        if (this.x <= 0) {
            this.x = 1;
        } else if (this.x > canvas.width - this.width) {
            this.x = canvas.width - this.width;
        }
    };
}

class Plane extends Component {
    constructor(width, height, x, y, src) {
        super(width, height, x, y, src);
        this.width = width;
        this.height = height;
        this.x = x;
    };
    //plane can move from right to left inside canvas
    move() {
        this.x--;
        if (this.x <= - 50) {
            this.x = 1000;
        }
    };
}

class Parachutist extends Component {
    constructor(width, height, x, y, src) {
        super(width, height, x, y, src);
        this.y = y;
        this.x = x;
    };
    //parachutist is dropped from plane position 
    //and move till the level of water or boat
    move() {
        if (this.y > 400) {
            let boatPos = myBoat.getPos();
            if (this.x < boatPos + myBoatWidth && this.x >= boatPos) {
                score += 10;
                myParashutists.shift();
            }
            else {
                lives--;
                myParashutists.shift();
            }
        }
        this.y++;
    };
}

//create new parachutist 
function spawnParachutist(posPlane) {
    return myParashutist = new Parachutist(
        30,
        30,
        posPlane,
        20,
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
        if (posPlane > 60 && posPlane < 940) {
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
