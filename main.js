// INIT
var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
var myBoat;
var myBoatWidth = 230;
var myBoatHeight = 140;
var myPlane;
var myParashutist;
var mySea;
var myScore;
var myLives;
var myExit;
var score =0;
var lives =3;
var rightPressed = false;
var leftPressed = false;

// KEYBOARD
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


function startGame() {
    mySea = new component(0, 30, 0, 500, "resources/sea.png", "image");
    myBoat = new component(myBoatWidth, myBoatHeight, 500, 400, "resources/boat.png", "image");
    myPlane = new component(30, 30, 1000, 20, "resources/plane.png", "image");
    myParashutist = new component(
        30,
        30,
        1000,
        20,
        "resources/parachutist.png",
        "image"
    );
    myScore = new textComponent("20px", "Consolas", 20, 40);
    myLives = new textComponent("20px", "Consolas", 20, 70);
    myExit = new textComponent("20px", "Consolas", 20, canvas.height-20);
    myGameArea.start();
}

var myGameArea = {
    start: function () {
        score = 0;
        lives = 3;
        rightPressed = false;
        leftPressed = false;
        this.score = score;
        this.interval = setInterval(updateGameArea, 20);
    },
    clear: function () {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    },
    stop: function () {
        ctx.font = "20px Consolas";
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillText("END", canvas.width/2, canvas.height/2);
        ctx.fillText("Press ENTER to start again", 20, canvas.height-20);
        clearInterval(this.interval);
    }
};

function textComponent(size, font, x, y) {
    this.size = size;
    this.font = font;
    this.x = x;
    this.y = y;
    this.update = function (text, value) {
        this.text = text + value;
        ctx.font = this.size + " " + this.font;
        ctx.fillText(this.text, this.x, this.y);
    };
}

function component(width, height, x, y, src) {
    this.width = width;
    this.height = height;
    this.speedX = 0;
    this.speedY = 0;
    this.x = x;
    this.y = y;
    const img = new Image();
    this.update = function () {
        img.src = src;
        ctx.drawImage(img, this.x, this.y);
    };
    this.float = function () {
        if (rightPressed) {
            this.x += 5;
        }
        else if (leftPressed) {
            this.x -= 5;
        }
        if (this.x <= 0) {
            this.x = 1;
        } else if (this.x > canvas.width-this.width) {
            this.x = canvas.width-this.width;
        } else {
            this.x += this.speedX;
        }
    };
    this.fly = function () {
        this.x--;
        if (this.x <= -100) {
            this.x = x;
        }
    };
    this.drop = function () {
        if (this.y > 400) {
            let boatPos = myBoat.getPos();
            let parachutistPos = myParashutist.getPos();
            if (parachutistPos < boatPos + myBoatWidth && parachutistPos >= boatPos) {
                score += 10;
            }
            else {
                lives--;
                if (lives == 0) {
                    myGameArea.stop();
                }
            }
            this.y = y;
            this.x = myPlane.getPos();
        } else {
            this.y++;
        }
    };
    this.getPos = function () {
        return this.x;
    };
}

function updateGameArea() {
    myGameArea.clear();
    myBoat.float();
    myPlane.fly();
    myParashutist.drop();
    mySea.update();
    myBoat.update();
    myPlane.update();
    myParashutist.update();
    myScore.update("SCORE: ", score);
    myLives.update("LIVES: ", lives);
    myExit.update("Press ESC to quit", '');
}
