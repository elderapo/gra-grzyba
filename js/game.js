var Key = {
	_pressed: {},

	LEFT: 37,
	UP: 38,
	RIGHT: 39,
	DOWN: 40,
	SPACE2: 191,

	W: 87,
	S: 83,
	A: 65,
	D: 68,
	SPACE: 32,
	M: 77,

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

var Enum = {
	RIGHT: 1,
	LEFT: 2
};

var Game = {
	debug: true,
	fps: 100,
	tps: 50,
	window: {
		width: window.innerWidth,
		height: window.innerHeight,
		world: {
		width: 1000,
		height: 500	
		}
	},
	map: {
		width: 1600,
		height: 520,
		offset: {
			x: 0,
			y: 0
		}
	}
};

Game.init = function() {
	this.canvas = document.createElement("canvas");
	this.canvas.width = this.window.width;
	this.canvas.height = this.window.height;

	this.context = this.canvas.getContext("2d");

	document.body.appendChild(this.canvas);

	this.sprites = new Sprites();

	this.player = new Player();
	//this.player.add(400, 500, {UP: Key.UP, DOWN: Key.DOWN, LEFT: Key.LEFT, RIGHT: Key.RIGHT, SPECIAL: Key.SPACE2});
	this.player.add(300, 330, {UP: Key.W, DOWN: Key.S, LEFT: Key.A, RIGHT: Key.D, SPECIAL: Key.SPACE, MAPKEY: Key.M});

	this.platform = new Platform();
	this.platform.add(450, 10, 300);
	this.platform.add(400, 500, 100);
	this.platform.add(450, 500, 100);
	this.platform.add(330, 200, 300, {from: 300, to: 400, dir: Enum.RIGHT, speed: 2});
	this.platform.add(450, 900, 200);

	this.minimap = new Minimap();
	this.border = new Border();

	this.hookControls();
};


Game.start = function() {
	var animFrame = window.requestAnimationFrame ||
					window.webkitRequestAnimationFrame ||
					window.mozRequestAnimationFrame ||
					window.oRequestAnimationFrame ||
					window.msRequestAnimationFrame ||
					null;
	Game.mainLoop();
	animFrame(Game.start);
};

Game.mainLoop = function() {
	this.update();
	this.draw();
};

Game.hookControls = function() {
	window.addEventListener('keyup', function(event) { Key.onKeyup(event); }, false);
	window.addEventListener('keydown', function(event) { Key.onKeydown(event); }, false);
};

Game.draw = function() {
	Game.context.fillStyle = "pink";
	///// rysowanie tla

	Game.context.drawImage(
		Game.sprites.background,
		0 + (0.5 * Game.map.offset.x),
		0 + (0.5 * Game.map.offset.y),
		800,
		600,
		0,
		0,
		Game.map.width,
		560
	);

	//Game.context.fillRect(0, 0, this.window.width, this.window.height);
	Game.platform.draw(Game.context);
	Game.player.draw(Game.context);
	Game.minimap.draw(Game.context);
	Game.border.draw(Game.context);
	//czyszczenie wszystkiego poza gra >>> \/ \/ \/ \/  eq + chat
	Game.context.clearRect(this.window.world.width+1, 0, this.window.width, this.window.height);
	Game.context.clearRect(0, this.window.world.height+1, this.window.width, this.window.height);
};

Game.update = function() {
	Game.player.control();
	Game.player.update();
	Game.platform.update();
};

function Sprites() {
	this.coordinates = [ { "spr": [ { "_frame": "0", "_x": "0", "_y": "0", "_w": "57", "_h": "141" }, { "_frame": "1", "_x": "0", "_y": "282", "_w": "53", "_h": "142" }, { "_frame": "2", "_x": "57", "_y": "0", "_w": "68", "_h": "135" }, { "_frame": "3", "_x": "57", "_y": "135", "_w": "67", "_h": "139" }, { "_frame": "4", "_x": "57", "_y": "274", "_w": "63", "_h": "138" }, { "_frame": "5", "_x": "125", "_y": "0", "_w": "71", "_h": "141" }, { "_frame": "6", "_x": "196", "_y": "0", "_w": "77", "_h": "137" }, { "_frame": "7", "_x": "57", "_y": "412", "_w": "66", "_h": "137" } ], "_name": "moveRight" }, { "spr": [ { "_frame": "0", "_x": "0", "_y": "141", "_w": "57", "_h": "141" }, { "_frame": "1", "_x": "0", "_y": "424", "_w": "53", "_h": "142" }, { "_frame": "2", "_x": "57", "_y": "549", "_w": "68", "_h": "135" }, { "_frame": "3", "_x": "273", "_y": "0", "_w": "67", "_h": "139" }, { "_frame": "4", "_x": "340", "_y": "0", "_w": "63", "_h": "138" }, { "_frame": "5", "_x": "125", "_y": "141", "_w": "71", "_h": "142" }, { "_frame": "6", "_x": "403", "_y": "0", "_w": "78", "_h": "137" }, { "_frame": "7", "_x": "481", "_y": "0", "_w": "67", "_h": "137" } ], "_name": "moveLeft" }, { "spr": [ { "_frame": "0", "_x": "548", "_y": "0", "_w": "58", "_h": "137" }, { "_frame": "1", "_x": "606", "_y": "0", "_w": "58", "_h": "136" }, { "_frame": "2", "_x": "125", "_y": "283", "_w": "58", "_h": "136" }, { "_frame": "3", "_x": "125", "_y": "419", "_w": "58", "_h": "135" }, { "_frame": "4", "_x": "125", "_y": "554", "_w": "58", "_h": "135" }, { "_frame": "5", "_x": "196", "_y": "141", "_w": "58", "_h": "135" }, { "_frame": "6", "_x": "196", "_y": "276", "_w": "58", "_h": "135" }, { "_frame": "7", "_x": "196", "_y": "411", "_w": "58", "_h": "136" } ], "_name": "stayRight" }, { "spr": [ { "_frame": "0", "_x": "196", "_y": "547", "_w": "58", "_h": "137" }, { "_frame": "1", "_x": "254", "_y": "141", "_w": "58", "_h": "136" }, { "_frame": "2", "_x": "312", "_y": "141", "_w": "58", "_h": "136" }, { "_frame": "3", "_x": "370", "_y": "141", "_w": "58", "_h": "135" }, { "_frame": "4", "_x": "428", "_y": "141", "_w": "58", "_h": "135" }, { "_frame": "5", "_x": "486", "_y": "141", "_w": "58", "_h": "135" }, { "_frame": "6", "_x": "544", "_y": "141", "_w": "58", "_h": "135" }, { "_frame": "7", "_x": "602", "_y": "141", "_w": "58", "_h": "136" } ], "_name": "stayLeft" }, { "spr": [ { "_frame": "0", "_x": "254", "_y": "277", "_w": "62", "_h": "135" }, { "_frame": "1", "_x": "316", "_y": "277", "_w": "70", "_h": "140" }, { "_frame": "2", "_x": "316", "_y": "417", "_w": "69", "_h": "140" }, { "_frame": "3", "_x": "386", "_y": "277", "_w": "73", "_h": "129" }, { "_frame": "4", "_x": "459", "_y": "277", "_w": "73", "_h": "126" }, { "_frame": "5", "_x": "386", "_y": "406", "_w": "81", "_h": "139" }, { "_frame": "6", "_x": "386", "_y": "545", "_w": "81", "_h": "137" }, { "_frame": "7", "_x": "467", "_y": "406", "_w": "76", "_h": "140" } ], "_name": "jumpRight" }, { "spr": [ { "_frame": "0", "_x": "254", "_y": "412", "_w": "62", "_h": "135" }, { "_frame": "1", "_x": "316", "_y": "557", "_w": "70", "_h": "142" }, { "_frame": "2", "_x": "467", "_y": "546", "_w": "69", "_h": "140" }, { "_frame": "3", "_x": "532", "_y": "277", "_w": "73", "_h": "129" }, { "_frame": "4", "_x": "605", "_y": "277", "_w": "73", "_h": "126" }, { "_frame": "5", "_x": "543", "_y": "406", "_w": "81", "_h": "139" }, { "_frame": "6", "_x": "543", "_y": "545", "_w": "81", "_h": "137" }, { "_frame": "7", "_x": "624", "_y": "545", "_w": "76", "_h": "142" } ], "_name": "jumpLeft" } ];
	this.img = new Image();
	this.img.src = "images/run1.png";
	this.background = new Image();
	this.background.src = "images/background.png";
};

function Player() {
	this.players = [];
	this.stepSize = 3;
	this.jumpVelocityDefault = -9;
	this.gravityDefault = 0.5;
	this.defaultScale = 0.6;
};

Player.prototype.getAll = function() {
	return this.players;
};

Player.prototype.add = function(_x, _y, _keys) {

	var player = {
		x: _x, // narazie ustawione na pałe ;s
		y: _y, // tak samo tutaj
		isJumping: true,
		jumpVelocity: 0,
		jumpVelocityDefault: this.jumpVelocityDefault,
		gravity: this.gravityDefault,
		ignorePlatforms: false,
		keys: _keys,
		isMoving: false,
		facing: Enum.RIGHT,
		spriteFrame: 0,
		tickCount: 0,
		amountOfFrames: 0,
		ticksPerFrame: 3,
		wutAmIdoin: null,
		_wutAmIdoin: null,
		currentlyUsedSprite: null,
		currentPlatform: -1,
		scale: this.defaultScale,
		goThroughWalls: false
	}
	this.players.push(player);
};

Player.prototype.delete = function(_index) {
	delete this.players[_index];
};

Player.prototype.update = function() {
	this.players.filter(function( obj ) {

		//stoi w prawo
		if (obj.isJumping == false & obj.isMoving == false && obj.facing == Enum.RIGHT) {
			obj.wutAmIdoin = "stayRight";
		}

		//stoi w lewo
		if (obj.isJumping == false & obj.isMoving == false && obj.facing == Enum.LEFT) {
			obj.wutAmIdoin = "stayLeft";
		}

		//biegnie w prawo
		if (obj.isJumping == false & obj.isMoving == true && obj.facing == Enum.RIGHT) {
			obj.wutAmIdoin = "moveRight";
		}

		//biegnie w lewo
		if (obj.isJumping == false & obj.isMoving == true && obj.facing == Enum.LEFT) {
			obj.wutAmIdoin = "moveLeft";
		}

		//skacze w prawo
		if (obj.isJumping == true && obj.facing == Enum.RIGHT) {
			obj.wutAmIdoin = "jumpRight";
		}

		//skacze w lewo
		if (obj.isJumping == true && obj.facing == Enum.LEFT) {
			obj.wutAmIdoin = "jumpLeft";
		}

		//zerowanie spiriteFrame przy zmianie statutu
		if (obj._wutAmIdoin != obj.wutAmIdoin) {
			obj.spriteFrame = 0;
		}

		obj._wutAmIdoin = obj.wutAmIdoin;

		for (var i = 0; i < Game.sprites.coordinates.length; i++) {
			if (obj.wutAmIdoin == Game.sprites.coordinates[i]._name) {
				obj.currentlyUsedSprite = i;
				break;
			}
		}

		obj.amountOfFrames = Game.sprites.coordinates[obj.currentlyUsedSprite].spr.length;
		obj.height = Game.sprites.coordinates[obj.currentlyUsedSprite].spr[obj.spriteFrame]._h * obj.scale;
		obj.width = Game.sprites.coordinates[obj.currentlyUsedSprite].spr[obj.spriteFrame]._w * obj.scale;

		if (obj.isJumping) {
			obj.jumpVelocity += obj.gravity;
			obj.y += obj.jumpVelocity;

			if (obj.y <= obj.height) {
				obj.y = obj.height;
				obj.jumpVelocity = 0;
			} else if (obj.y >= Game.map.height) {
				obj.y = Game.map.height;
				obj.jumpVelocity = 0;
				obj.ignorePlatforms = false;
				obj.isJumping = false;
			}
		}

		var platforms = Game.platform.getAll();
		obj.falling = 0;

		for (var i = 0; i <= platforms.length-1; i++) {
			//ustawianie currentPlatform na -1 podczas spadania
			if (obj.isJumping == true) {
				obj.currentPlatform = -1;
			}
			// stawanie na platformie
			if (obj.x > platforms[i].x & obj.x < platforms[i].x + platforms[i].length & obj.isJumping == true & obj.jumpVelocity > 0 & obj.y >= platforms[i].y & obj.y <= platforms[i].y + obj.jumpVelocity & obj.ignorePlatforms == false) {
				obj.isJumping = false;
				obj.jumpVelocity = 0;
				obj.y = platforms[i].y;
				//ustawianie currentPlatform po stanieciu na platformie
				obj.currentPlatform = i;
			}

			// spadanie po zejsciu z platform
			if (!(obj.x > platforms[i].x & obj.x < platforms[i].x + platforms[i].length & obj.y >= platforms[i].y & obj.y <= platforms[i].y + 5)) {
				obj.falling++;
			}

		}

		if (obj.y < Game.map.height & obj.falling >= platforms.length) {
			obj.isJumping = true;
		}


		//automatyczne przesuwanie graczy na ruszajacych sie platformach
			//jesli move === 'object'
		if (obj.currentPlatform != -1 && typeof Game.platform.platforms[obj.currentPlatform].move === 'object') {
			if (Game.platform.platforms[obj.currentPlatform].move.dir == Enum.RIGHT) {
				//przesuwaj gracza w prawo
				obj.x += Game.platform.platforms[obj.currentPlatform].move.speed;
			} else if (Game.platform.platforms[obj.currentPlatform].move.dir == Enum.LEFT) {
				//przesuwaj w lewo
				obj.x += -Game.platform.platforms[obj.currentPlatform].move.speed;
			}
		}

		if (obj.goThroughWalls == true) {
			//wyjazd za mape i pojawienie sie z 2 strony
				//w prawo
			if (obj.x > Game.map.width + (0.5 * obj.width)) {
				//obj.x = Game.window.world.width - (0.5 * obj.width) -5;
				obj.x = -(0.5 * obj.width);
			}

				//w lewo
			if (obj.x < (-obj.width)) {
				//obj.x = (0.5 * obj.width) + 5;
				obj.x = Game.map.width + (0.5 * obj.width);
			}
		} else {
			//zabezpieczenie przed wyjazdem za mape XDD
				//w prawo
			if (obj.x >= Game.map.width - (0.5 * obj.width) - 5) {
				obj.x = Game.map.width - (0.5 * obj.width) -5;
				//obj.x = -(0.5 * obj.width);
			}

				//w lewo
			if (obj.x <= (0.5 * obj.width) + 5) {
				obj.x = (0.5 * obj.width) + 5;
				//obj.x = Game.window.world.width + (0.5 * obj.width);
			}
			
		}

		// przesuwanie mapy
			// na boki
		if (obj.x < Game.window.world.width * 0.5) {
			Game.map.offset.x = 0;
		} else if (obj.x > Game.map.width - Game.window.world.width * 0.5) {
			Game.map.offset.x = Game.map.width - Game.window.world.width;
		} else {
			Game.map.offset.x = obj.x - 0.5 * Game.window.world.width;
		}
			// gora dol
		if (obj.y < Game.window.world.height * 0.5) {
			Game.map.offset.y = 0;
		} else if (obj.y > Game.map.height - Game.window.world.height * 0.5) {
			Game.map.offset.y = Game.map.height - Game.window.world.height;
		} else {
			Game.map.offset.y = obj.y - 0.5 * Game.window.world.height;
		}

	});
	
};

Player.prototype.draw = function(context) {
	var id = 0;
	context.globalAlpha = 1;
	this.players.filter(function( obj ) {
		context.drawImage(
			Game.sprites.img,
			Game.sprites.coordinates[obj.currentlyUsedSprite].spr[obj.spriteFrame]._x,
			Game.sprites.coordinates[obj.currentlyUsedSprite].spr[obj.spriteFrame]._y,
			obj.width / obj.scale,
			obj.height / obj.scale,
			obj.x - (0.5 * obj.width) - Game.map.offset.x,
			obj.y-obj.height - Game.map.offset.y+1,
			obj.width,
			obj.height
		);
		
		if (Game.debug == true) {
			if (obj.isMoving == true) {
				context.strokeStyle = "yellow";
			}
			else if (obj.isJumping == true) {
				context.strokeStyle = "green"
			} else {
				context.strokeStyle = "red"
			};
			context.fillStyle = "black";
			context.lineWidth = 2;
			context.strokeRect(obj.x - (0.5 * obj.width) - Game.map.offset.x, obj.y-obj.height - Game.map.offset.y, obj.width, obj.height);
			context.strokeRect(obj.x - Game.map.offset.x, obj.y - Game.map.offset.y, 0, -5);
			context.font = "12px Arial";
			context.fillText("x " + obj.x + " y:" + obj.y + ".." + obj.spriteFrame + ".." + obj.currentPlatform, obj.x - (0.5 * obj.width) +2 - Game.map.offset.x, obj.y-obj.height-5 - Game.map.offset.y);
			context.fillText("ID: " + id, 100* id + 10, 25, 100);
			context.fillText("sFrame" + obj.spriteFrame, 100* id + 10, 40, 100);
			context.fillText("action: " + obj.wutAmIdoin, 100* id + 10, 55, 100);
			context.fillText("scale: " + obj.scale, 100* id + 10, 70, 100);
			context.fillText("x/y: " + obj.x + "/" + obj.y, 100* id + 10, 85, 100);
			context.fillText("przesuniecie " + Game.map.offset.x + " / " + Game.map.offset.y + " ", Game.window.world.width-150, 25);
		}

		obj.tickCount++;
		if (obj.tickCount > obj.ticksPerFrame) {
			obj.tickCount = 0;
			obj.spriteFrame++;

			if (obj.spriteFrame > obj.amountOfFrames - 1) {
				obj.spriteFrame = 0;
			}
		}
		id++;
	});
};

Player.prototype.action = function(_action, _obj) {
	if (_action === "blockMove") {
		_obj.isMoving = false;
	}

	if (_action === "unblockMove") {
		_obj.isMoving = true;
	}

	if (_action === "jump") {
		if (_obj.isJumping == false) {
	        _obj.jumpVelocity = _obj.jumpVelocityDefault;
	        _obj.isJumping = true;
    	}
	}

	if (_action === "moveLeft") {
		_obj.x += -this.stepSize;
		_obj.facing = Enum.LEFT;
	}

	if (_action === "moveRight") {
		_obj.x += this.stepSize;
		_obj.facing = Enum.RIGHT;
	}

	if (_action === "avoidPlatforms") {
		if (_obj.ignorePlatforms == false) {
			_obj.ignorePlatforms = true;
		}
	}

	if (_action === "special") {
		console.log('not programed yet Kappa');
		_obj.jumpVelocity = 0;
		_obj.isJumping = false;
		_obj.y -= 10;
	}

	if (_action === "jumpOnPlatforms") {
		if (_obj.ignorePlatforms == true) {
			_obj.ignorePlatforms = false;
    	}
	}
}

Player.prototype.control = function() {
	this.players.filter(function( obj ) {
		if (Key.isDown(obj.keys.LEFT) && Key.isDown(obj.keys.RIGHT)) {
			Game.player.action('blockMove', obj);
		} else {
			if (Key.isDown(obj.keys.MAPKEY)) {
				Game.minimap.toggle = true;
			} else {
				Game.minimap.toggle = false;
			}

			if (Key.isDown(obj.keys.UP)) {
				Game.player.action('jump', obj);
			}

			if (Key.isDown(obj.keys.LEFT)) {
				Game.player.action('moveLeft', obj);
			}

			if (Key.isDown(obj.keys.RIGHT)) {
				Game.player.action('moveRight', obj);
			}

			if (Key.isDown(obj.keys.DOWN)) {
				Game.player.action('avoidPlatforms', obj);
			}

			if (!Key.isDown(obj.keys.DOWN)) {
				Game.player.action('jumpOnPlatforms', obj);
			}

			if (Key.isDown(obj.keys.SPECIAL)) {
				Game.player.action('special', obj);
			}

			if (!Key.isDown(obj.keys.LEFT) & !Key.isDown(obj.keys.RIGHT)) {
				Game.player.action('blockMove', obj);
			} else {
				Game.player.action('unblockMove', obj);
			}
		}
	});
};

function Platform() {
	this.platforms = [];
	this.defaultSpeed = 3;
};

Platform.prototype.getAll = function() {
	return this.platforms;
};

Platform.prototype.add = function(_y, _x, _length, _move) {
	var platform = {
		y: _y,
		x: _x,
		length: _length,
		move: _move
	}
	this.platforms.push(platform);
};

Platform.prototype.deleteAll = function() {
	this.platforms = [];
};

Platform.prototype.update = function() {
	this.platforms.filter(function( obj ) {
		if (typeof obj.move === 'object') {
			var _platformSpeed = obj.move.speed;

			if (obj.move.dir == Enum.RIGHT) {
					obj.x += _platformSpeed;
				if (obj.move.to <= obj.x) {
					obj.x += _platformSpeed;
					obj.move.dir = Enum.LEFT;
				}
			}

			if (obj.move.dir == Enum.LEFT) {
				obj.x += -_platformSpeed;
				if (obj.move.from >= obj.x) {
					obj.move.dir = Enum.RIGHT;
				}
			}
		}
	});
};


Platform.prototype.draw = function(context) {
	var id = 0;
	context.globalAlpha = 1;
	this.platforms.filter(function( obj ) {
		context.fillStyle = "black";
		context.fillRect(obj.x - Game.map.offset.x, obj.y - Game.map.offset.y, obj.length, 5);
		if (Game.debug == true) {
			context.font = "12px Arial";
			context.fillText("x" + obj.x + " y" + obj.y + " id" + id, obj.x+5 - Game.map.offset.x, obj.y-3 - Game.map.offset.y);
			context.fillStyle = "blue";
			context.fillRect(obj.x+0 - Game.map.offset.x, obj.y - 10 - Game.map.offset.y, 4, 25);
			context.fillStyle = "orange";
			context.fillRect(obj.x + obj.length-4 - Game.map.offset.x, obj.y - 10 - Game.map.offset.y, 4, 25);
		}
		id++;
	});
};

function Minimap() {
	this.toggle = true;
}

Minimap.prototype.draw = function(context) {
	if (Game.minimap.toggle) {
	//if (true) {
		context.globalAlpha = 0.5;
		context.fillRect(50, 50, 700, 400);
	}
}

function Border() {

}

Border.prototype.draw = function(context) {
	//prawy
	context.fillRect(Game.window.world.width, 0, 1, Game.window.world.height+1);
	//dolny
	context.fillRect(0, Game.window.world.height, Game.window.world.width+1, 1);
}