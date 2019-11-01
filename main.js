var myBoat;
var myPlane;
var myParashutist;
var mySea;
var myScore;
var myLives;
var score = 0;
var lives = 3;


function startGame() {
	mySea = new component(0, 30, 0, 500, "resources/sea.png", "image");
	myBoat = new component(30, 30, 500, 400, "resources/boat.png", "image");
	myPlane = new component(30, 30, 1000, 20, "resources/plane.png", "image");
	myParashutist = new component(
		30,
		30,
		1000,
		20,
		"resources/parachutist.png",
		"image"
	);
	myScore = new textComponent("20px", "Consolas", 20, 40, "SCORE: ");
	myLives = new textComponent("20px", "Consolas", 20, 70, "LIVES: ");
	myGameArea.start();
}

var myGameArea = {
	canvas: document.createElement("canvas"),
	start: function() {
		this.canvas.width = 1000;
		this.canvas.height = 600;
		this.canvas.style.background = "url(resources/background.png)";
		this.context = this.canvas.getContext("2d");
		document.body.insertBefore(this.canvas, document.body.childNodes[0]);
		this.score = score;
		this.interval = setInterval(updateGameArea, 20);
	},
	clear: function() {
		this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
	},
	stop: function() {
		this.context.font = "20px Georgia";
		this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
		this.context.fillText("END", 450, 300);
		clearInterval(this.interval);
	}
};

function textComponent(size, font, x, y, text) {
	this.size = size;
	this.font = font;
	this.x = x;
	this.y = y;
	this.update = function(text, value) {
		this.text = text + value;
		ctx = myGameArea.context;
		ctx.font = this.size + " " + this.font;
		ctx.fillText(this.text, this.x, this.y);
    };
}

function component(width, height, x, y, src, type) {
	this.type = type;
	this.width = width;
	this.height = height;
	this.speedX = 0;
	this.speedY = 0;
	this.x = x;
	this.y = y;
	const img = new Image();
	this.update = function() {
		ctx = myGameArea.context;
		if (this.type == "text") {
			ctx.font = this.width + " " + this.height;
			ctx.fillText(this.text, this.x, this.y);
		} else if (this.type == "image") {
			img.src = src;
			ctx.drawImage(img, this.x, this.y);
		}
	};
	this.float = function() {
		if (this.x <= 10) {
			this.x = 11;
		} else if (this.x >= 1001) {
			this.x = 1000;
		} else {
			this.x += this.speedX;
		}
	};
	this.fly = function() {
		this.x--;
		if (this.x <= -100) {
			this.x = x;
		}
	};
	this.drop = function() {
		if (this.y > 400) {
			
			let boatPos = myBoat.getPos();
			let parachutistPos = myParashutist.getPos();
			if (parachutistPos < boatPos + 190 && parachutistPos >= boatPos) {
				score+=10;
			}
			else {
				lives--;
				if (lives == 0){
					myGameArea.stop();
				}
			}
			this.y = y;
			this.x = myPlane.getPos();
		} else {
			this.y++;
		}
	};
	this.getPos = function() {
		return this.x;
	};
	this.stop = function() {
		this.x = x;
	};
}

function updateGameArea() {
	myGameArea.clear();
	myBoat.float();
	myPlane.fly();

	myParashutist.drop();
	// mySea.flow();
	mySea.update();
	myBoat.update();
	myPlane.update();
	myParashutist.update();
	myScore.update("SCORE: ", score);
	myLives.update("LIVES: ", lives);
}

function moveleft() {
	myBoat.speedX -= 2;
}

function moveright() {
	myBoat.speedX += 2;
}

function clearmove() {
	myBoat.speedX = 0;
}

function stop() {
	myGameArea.stop();
}
