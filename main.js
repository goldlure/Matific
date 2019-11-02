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
var mySea;

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
        1000, 20,
        "resources/plane.png"
    );
    myComponents.push(myPlane);

    myParashutist = new Parachutist(
        30, 30,
        1000, 20,
        "resources/parachutist.png",
        "image"
    );
    myComponents.push(myParashutist);

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
        //this.interval = setInterval(updateGameArea, 20);
        animate();
    },
    // clear: function () {
    //     ctx.clearRect(0, 0, canvas.width, canvas.height);
    // },
    stop: function () {
        myStart = false;
        ctx.font = "20px Consolas";
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillText("END", canvas.width / 2, canvas.height / 2);
        ctx.fillText("Press ENTER to start again", 20, canvas.height - 20);

        clearInterval(this.interval);
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

class Component {
    constructor(x, y, src) {
        this.x = x;
        this.y = y;
        this.src = src;
    }

    update() {
        let img = new Image();
        img.src = this.src;
        ctx.drawImage(img, this.x, this.y);
    };

    //return current position of component
    getPos() {
        return this.x;
    };
}

class Boat extends Component {
    x;
    y;

    constructor(width, height, x, y, src) {
        super(x, y, src);
        this.width = width;
        this.height = height;
        this.y = y;
        this.x = x;
    };
    float() {
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
    x;
    y;
    constructor(width, height, x, y, src) {
        super(x, y, src);
        this.width = width;
        this.height = height;
        this.x = x;
    };
    fly() {
        this.x--;
        if (this.x <=-myPlaneWidth) {
            this.x = x;
        }
    };
}

class Parachutist extends Component {
    x;
    y;
    constructor(width, height, x, y, src) {
        super(width, height, x, y, src);
        this.y = y;
        this.x = x;
    };
    drop() {
        if (this.y > (canvas.height - (myBoat.y + myBoatHeight/2))) {
            let boatPos = myBoat.getPos();
            let parachutistPos = myParashutist.getPos();
            if (parachutistPos < boatPos + myBoatWidth && parachutistPos >= boatPos) {
                score += 10;
            }
            else {
                lives--;
            }
            this.y = y;
            this.x = myPlane.getPos();
        } else {
            this.y++;
        }
    };
}


function animate() {
    if (lives <= 0 || !myStart) {
        myGameArea.stop();
        return;
    }
    requestAnimationFrame(animate);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    myBoat.float();
    myPlane.fly();
    myParashutist.drop();
    for (const component of myComponents) {
        component.update();
    }
    myScore.update("SCORE: ", score);
    myLives.update("LIVES: ", lives);
    myExit.update("Press ESC to quit", '');
}
