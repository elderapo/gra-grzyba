var test = 0;
var x1 = 0;
var x2 = 0;

var Key = {
	_pressed: {},

	LEFT: 37,
	UP: 38,
	RIGHT: 39,
	DOWN: 40,
	W: 87,
	S: 83,
	A: 65,
	D: 68,
	SPACE: 32,

	isDown: function(keyCode) {
		return this._pressed[keyCode];
	},

	onKeydown: function(event) {
		this._pressed[event.keyCode] = true;
	},

	onKeyup: function(event) {
		delete this._pressed[event.keyCode];
	}
};

window.addEventListener('keyup', function(event) { Key.onKeyup(event); }, false);
window.addEventListener('keydown', function(event) { Key.onKeydown(event); }, false);

var Game = {
	fps: 60,
	tps: 50,
	width: 800,
	height: 500
};

Game.start = function() {
	Game.canvas = document.createElement("canvas");
	Game.canvas.width = Game.width;
	Game.canvas.height = Game.height;

	Game.context = Game.canvas.getContext("2d");

	document.body.appendChild(Game.canvas);

	Game.player = new Player();
	Game.info = new Info();
	Game.platform = new Platform();
	Game.platform.create(450, 200, 100);
	setInterval(Game.draw, 1000 / Game.fps);
	setInterval(Game.update, 1000 / Game.tps);
};

/*
Game.run = function() {
	var loops = 0, skipTicks = 1000 / Game.fps,
		maxFrameSkip = 10,
		nextGameTick = (new Date).getTime(),
		lastGameTick;
	return function() {
		loops = 0;

		while ((new Date).getTime() > nextGameTick) {
			Game.update();
			nextGameTick += skipTicks;
			loops++;
		}

		if (loops) {
			Game.draw()
		};
	}
}();
*/

Game.draw = function() {
	Game.context.clearRect(0, 0, Game.width, Game.height);
	Game.platform.draw(Game.context);
	Game.player.draw(Game.context);
	Game.info.draw(Game.context);
};

Game.update = function() {
	Game.player.update();
	Game.player.control();
};

function Info(){
	this.height = 50;
	this.width = Game.width;
}

Info.prototype.draw = function(context) {
	context.fillStyle = "#5F5F5F";
	context.fillRect(0, 0, this.width, this.height);
	context.fillStyle = "black";
	context.font = "20px sans-serif";
	context.fillText("X: " + Game.player.x, 5, 25);
	context.fillText("Y: " + Game.player.y, 5, 45);
	context.fillText("JUMP STATUS: " + Game.player.isJumping, 75, 25);
	context.fillText("JUMP VELICITY: " + Game.player.jumpVelocity, 75, 45);
};

function Player() {
	this.height = 125;
	this.width = 100;
	this.x = 50;
	this.y = Game.height-this.height;
	this.isJumping = true;
	this.jumpVelocity = 0;
	this.jumpVelocityDefault = -9;
	this.gravity = 0.5;
	this.stepSize = 5;
	this.facing = "right";
	this.isMoving = false;
}

	var tickCount = 0;
	var ticksPerFrame = 4;
	var frameIndex = 0;
	var numberOfFrames = 8;

Player.prototype.draw = function(context) {
	context.fillStyle = "black";
	context.fillRect(this.x, this.y, this.width, this.height);
	tickCount++;
	var characterImg = new Image();
	characterImg.src = "images/run1.png";
	//																s - source, d - destination				w - width, h - height
	//																context.drawImage(img, 		 sX, 						sY, 	sW,  sH,  dX, 	  dY,     dWidth,     dHeight);
	if (this.facing == "right" & this.isMoving & !this.isJumping) 	context.drawImage(characterImg, frameIndex * 125, 			0, 		125, 160, this.x, this.y, this.width, this.height);
	if (this.facing == "left" & this.isMoving & !this.isJumping) 	context.drawImage(characterImg, 875 - (frameIndex * 125),	160, 	125, 160, this.x, this.y, this.width, this.height);
	if (this.facing == "right" & !this.isMoving & !this.isJumping) 	context.drawImage(characterImg, frameIndex * 125, 			320, 	125, 160, this.x, this.y, this.width, this.height);
	if (this.facing == "left" & !this.isMoving & !this.isJumping) 	context.drawImage(characterImg, 875 - (frameIndex * 125), 	480, 	125, 160, this.x, this.y, this.width, this.height);
	if (this.facing == "right" & this.isJumping) 					context.drawImage(characterImg, 875 - (frameIndex * 125), 	960, 	125, 160, this.x, this.y, this.width, this.height);
	if (this.facing == "left" & this.isJumping) 					context.drawImage(characterImg, 875 - (frameIndex * 125), 	1120, 	125, 160, this.x, this.y, this.width, this.height);

	if (tickCount > ticksPerFrame) {
		tickCount = 0;
		frameIndex += 1;

		if (frameIndex > numberOfFrames-1) {
			frameIndex = 0;
		}
	}
};

Player.prototype.moveLeft = function() {
		this.x += -this.stepSize;
		this.facing = "left";
		this.isMoving = true;

};

Player.prototype.moveRight = function() {
		this.x += this.stepSize;
		this.facing = "right";
		this.isMoving = true;
};

Player.prototype.moveDown = function() {
		this.y += 3;
};

Player.prototype.jump = function() {
	if (this.isJumping == false) {
        this.jumpVelocity = this.jumpVelocityDefault;
        this.isJumping = true;
    }
};

Player.prototype.hax = function() {
	if (this.isJumping) {
		this.isJumping = false;
	}
};

Player.prototype.update = function() {
	if (this.x < 0) this.x = 0;
	if (this.x > Game.width-this.width) this.x = Game.width-this.width;

	if (this.isJumping) {
		this.jumpVelocity += this.gravity;
		this.y += this.jumpVelocity;

		if (this.facing == "right") {
			this.x += 1;
		} else if (this.facing == "left") {
			this.x += -1;
		}

		if (this.y <= 50) {
			this.y = 50;
			this.jumpVelocity = 0;
		} else if (this.y >= Game.height-this.height) {
			this.y = Game.height-this.height;
			this.jumpVelocity = 0;
			this.isJumping = false;
		}
	}

	if (this.jumpVelocity >= 0) {
		console.log('0');
		Game.platform._platforms.filter(function( obj ) {
			test = obj.y;
			x1 = obj.x1;
			x2 = obj.x2;
		});
			if(this.y+this.height >= 450 & this.y+this.height <= 460 & this.x > 200 & this.x < 300) {
							this.jumpVelocity = 0;
			this.isJumping = false;
			} 
	}
};

Player.prototype.control = function() {
	if (Key.isDown(Key.A) & Key.isDown(Key.D)) {
		this.isMoving = false;
	} else {
		if (Key.isDown(Key.W)) this.jump();
		if (Key.isDown(Key.A)) this.moveLeft();
		if (Key.isDown(Key.D)) this.moveRight();
		if (Key.isDown(Key.S)) this.moveDown();
		if (Key.isDown(Key.SPACE)) this.hax();
		if (!Key.isDown(Key.A) & !Key.isDown(Key.D)) this.isMoving = false;
	}
};


function Platform() {
	this._platforms = [];
}

Platform.prototype.create = function(y, x1, x2) {
	this._platform = {
		y: y,
		x1: x1,
		x2: x2
	}
	this._platforms.push(this._platform);

};

Platform.prototype.draw = function(context) {
	var result = this._platforms.filter(function( obj ) {
		Game.context.fillRect(obj.x1, obj.y, obj.x2, 5);
	});
};
