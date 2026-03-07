/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/index.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/00_utils.js":
/*!*************************!*\
  !*** ./src/00_utils.js ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {

var Util = {
  inherits: function inherits(Parent, Child) {
    Child.prototype = Object.create(Parent.prototype);
    Child.prototype.constructor = Child;
  },
  randomVec: function randomVec(length) {
    var deg = 2 * Math.PI * Math.random();
    return Util.scale([Math.sin(deg), Math.cos(deg)], length);
  },
  scale: function scale(vec, m) {
    return [vec[0] * m, vec[1] * m];
  }
};
module.exports = Util;

/***/ }),

/***/ "./src/01_game_object.js":
/*!*******************************!*\
  !*** ./src/01_game_object.js ***!
  \*******************************/
/*! no static exports found */
/***/ (function(module, exports) {

function GameObject(options) {
  this.pos = options.pos;
  this.vel = options.vel;
  this.rad = options.rad;
  this.width = options.width;
  this.height = options.height;
  this.color = options.color;
  this.game = options.game;
}
GameObject.prototype.drawRec = function (ctx) {
  ctx.beginPath();
  var colors = this.game && this.game.getLevelColor ? this.game.getLevelColor() : {
    color: "#DC1C13",
    shadow: "red"
  };
  ctx.fillStyle = colors.color;
  ctx.shadowColor = colors.shadow;
  ctx.shadowBlur = 10;
  ctx.rect(this.pos[0], this.pos[1], this.width, this.height);
  ctx.fill();
};
GameObject.prototype.drawBgRec = function (ctx) {
  ctx.beginPath();
  var colors = this.game && this.game.getLevelBgColor ? this.game.getLevelBgColor() : {
    color: "rgba(255, 255, 255, 0.5)",
    shadow: "white"
  };
  ctx.fillStyle = colors.color;
  ctx.shadowColor = colors.shadow;
  ctx.shadowBlur = 10;
  ctx.rect(this.pos[0], this.pos[1], this.width, this.height);
  ctx.fill();
};
GameObject.prototype.drawPlayer = function (ctx, color, shadowColor) {
  ctx.beginPath();
  var strokeColor = color || "blue";
  var shadow = shadowColor || "blue";
  ctx.fillStyle = "black";
  ctx.shadowColor = shadow;
  ctx.strokeStyle = strokeColor;
  ctx.lineWidth = 5;
  ctx.shadowBlur = 10;
  ctx.rect(this.pos[0], this.pos[1], this.width, this.height);
  ctx.fill();
  ctx.stroke();
};
GameObject.prototype.move = function () {
  var pos = [];
  pos.push(this.pos[0] + this.vel[0]);
  pos.push(this.pos[1] + this.vel[1]);
  this.pos = pos;
};
GameObject.prototype.isCollidedWith = function (otherObj) {
  var top1 = this.pos[1];
  var top2 = otherObj.pos[1];
  var bottom1 = this.pos[1] + this.height;
  var bottom2 = otherObj.pos[1] + otherObj.height;
  var left1 = this.pos[0];
  var left2 = otherObj.pos[0];
  var right1 = this.pos[0] + this.width;
  var right2 = otherObj.pos[0] + otherObj.width;
  if (top1 > bottom2 || right1 < left2 || bottom1 < top2 || left1 > right2) {
    return false;
  }
  return true;
};
module.exports = GameObject;

/***/ }),

/***/ "./src/02_platform.js":
/*!****************************!*\
  !*** ./src/02_platform.js ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var Util = __webpack_require__(/*! ./00_utils */ "./src/00_utils.js");
var GameObject = __webpack_require__(/*! ./01_game_object */ "./src/01_game_object.js");
Util.inherits(GameObject, Platform);
var DEFAULT = {
  height: 7,
  color: "green"
};
function Platform(options) {
  this.DIM_X = 450;
  options.height = options.height || DEFAULT.height;
  options.color = options.color || DEFAULT.color;
  options.game = options.game;
  GameObject.call(this, options);
}
module.exports = Platform;

/***/ }),

/***/ "./src/02_player.js":
/*!**************************!*\
  !*** ./src/02_player.js ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var Util = __webpack_require__(/*! ./00_utils */ "./src/00_utils.js");
var GameObject = __webpack_require__(/*! ./01_game_object */ "./src/01_game_object.js");
Util.inherits(GameObject, Player);
var DEFAULT = {
  pos: [320, 450],
  rad: 16,
  color: "white"
};
function Player(options) {
  this.DIM_X = 450;
  options.pos = options.pos || DEFAULT.pos;
  options.rad = options.rad || DEFAULT.rad;
  options.vel = options.vel || [0, 0];
  options.color = options.color || DEFAULT.color;
  this.game = options.game;
  GameObject.call(this, options);
}
Player.prototype.move = function (pos) {
  var newPos = [];
  newPos.push(this.pos[0] + pos[0]);
  newPos.push(this.pos[1] + pos[1]);
  finalPos = this.game.wrap(newPos, this.DIM_X);
  this.pos = finalPos;
};
module.exports = Player;

/***/ }),

/***/ "./src/02_powerup.js":
/*!***************************!*\
  !*** ./src/02_powerup.js ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var Util = __webpack_require__(/*! ./00_utils */ "./src/00_utils.js");
var GameObject = __webpack_require__(/*! ./01_game_object */ "./src/01_game_object.js");
var POWERUP_TYPES = {
  INVINCIBILITY: 'invincibility',
  SPEED_BOOST: 'speed_boost'
};
var POWERUP_COLORS = _defineProperty(_defineProperty({}, POWERUP_TYPES.INVINCIBILITY, '#FFD700'), POWERUP_TYPES.SPEED_BOOST, '#00FF00');
function PowerUp(options) {
  this.DIM_X = 450;
  options.height = options.height || 20;
  options.width = options.width || 20;
  options.rad = options.rad || 10;
  options.type = options.type || POWERUP_TYPES.INVINCIBILITY;
  options.color = options.color || POWERUP_COLORS[options.type];
  options.game = options.game;
  GameObject.call(this, options);
  this.type = options.type;
}
Util.inherits(GameObject, PowerUp);
PowerUp.prototype.drawPowerUp = function (ctx) {
  ctx.beginPath();
  ctx.fillStyle = this.color;
  ctx.shadowColor = this.color;
  ctx.shadowBlur = 15;
  ctx.arc(this.pos[0] + this.width / 2, this.pos[1] + this.height / 2, this.width / 2, 0, 2 * Math.PI);
  ctx.fill();
  ctx.strokeStyle = "white";
  ctx.lineWidth = 2;
  ctx.stroke();
};
PowerUp.prototype.isCollidedWith = function (otherObj) {
  var centerX1 = this.pos[0] + this.width / 2;
  var centerY1 = this.pos[1] + this.height / 2;
  var centerX2 = otherObj.pos[0] + otherObj.width / 2;
  var centerY2 = otherObj.pos[1] + otherObj.height / 2;
  var distance = Math.sqrt(Math.pow(centerX1 - centerX2, 2) + Math.pow(centerY1 - centerY2, 2));
  return distance < this.width / 2 + Math.max(otherObj.width, otherObj.height) / 2;
};
PowerUp.POWERUP_TYPES = POWERUP_TYPES;
PowerUp.POWERUP_COLORS = POWERUP_COLORS;
module.exports = PowerUp;

/***/ }),

/***/ "./src/03_bg_objects.js":
/*!******************************!*\
  !*** ./src/03_bg_objects.js ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var Platform = __webpack_require__(/*! ./02_platform */ "./src/02_platform.js");
function Game(options) {
  this.DIM_X = window.innerWidth;
  this.DIM_Y = window.innerHeight;
  this.NUM_PLATFORMS = 7;
  this.mainGame = options ? options.mainGame : null; // Reference to main game for level info

  this.platforms = [];
  this.addPlatforms();
}
Game.prototype.randomPos = function () {
  return [Math.floor(Math.random() * this.DIM_X - 100), -300];
};
Game.prototype.randomNum = function (min, max) {
  return Math.random() < 0.5 ? min : max;
};
Game.prototype.otherVel = function (vel) {
  if (vel[0] === 1.5) {
    return [-1.5, 0];
  } else {
    return [1.5, 0];
  }
};
Game.prototype.addPlatforms = function () {
  for (var i = 0; i < this.NUM_PLATFORMS; i++) {
    this.platforms.push(new Platform({
      height: 150,
      width: 1,
      pos: this.randomPos(),
      vel: [0, this.randomNum(1, 2)],
      game: this
    }));
  }
};
Game.prototype.getLevelBgColor = function () {
  // Get level from main game if available
  var level = this.mainGame && this.mainGame.level ? this.mainGame.level : 1;

  // Level 5+ uses rainbow shifting colors
  if (level >= 5) {
    var rainbow = this.getRainbowColor();
    // Convert to rgba with transparency for background
    var rgb = this.hexToRgb(rainbow.color);
    return {
      color: "rgba(".concat(rgb.r, ", ").concat(rgb.g, ", ").concat(rgb.b, ", 0.5)"),
      shadow: rainbow.shadow
    };
  }

  // Background colors for levels 1-4 (one color per level)
  var bgColors = [{
    color: "rgba(255, 255, 255, 0.5)",
    shadow: "white"
  },
  // Level 1: White
  {
    color: "rgba(255, 200, 150, 0.5)",
    shadow: "orange"
  },
  // Level 2: Orange
  {
    color: "rgba(255, 255, 150, 0.5)",
    shadow: "yellow"
  },
  // Level 3: Yellow
  {
    color: "rgba(150, 255, 200, 0.5)",
    shadow: "lime"
  } // Level 4: Green
  ];
  var index = Math.min(level - 1, bgColors.length - 1);
  return bgColors[index];
};
Game.prototype.getRainbowColor = function () {
  // Create a rainbow effect that shifts over time
  var now = Date.now();
  var cycleDuration = 3000; // 3 seconds for full rainbow cycle
  var hue = now % cycleDuration / cycleDuration * 360;

  // Convert HSL to RGB for the color
  var h = hue / 360;
  var s = 1;
  var l = 0.5;
  var c = (1 - Math.abs(2 * l - 1)) * s;
  var x = c * (1 - Math.abs(h * 6 % 2 - 1));
  var m = l - c / 2;
  var r, g, b;
  if (h < 1 / 6) {
    r = c;
    g = x;
    b = 0;
  } else if (h < 2 / 6) {
    r = x;
    g = c;
    b = 0;
  } else if (h < 3 / 6) {
    r = 0;
    g = c;
    b = x;
  } else if (h < 4 / 6) {
    r = 0;
    g = x;
    b = c;
  } else if (h < 5 / 6) {
    r = x;
    g = 0;
    b = c;
  } else {
    r = c;
    g = 0;
    b = x;
  }
  r = Math.round((r + m) * 255);
  g = Math.round((g + m) * 255);
  b = Math.round((b + m) * 255);
  var colorHex = "#" + [r, g, b].map(function (x) {
    var hex = x.toString(16);
    return hex.length === 1 ? "0" + hex : hex;
  }).join("");
  return {
    color: colorHex,
    shadow: colorHex
  };
};
Game.prototype.hexToRgb = function (hex) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : {
    r: 255,
    g: 255,
    b: 255
  };
};
Game.prototype.draw = function (ctx) {
  ctx.clearRect(0, 0, this.DIM_X, this.DIM_Y);
  this.platforms.forEach(function (pf) {
    pf.drawBgRec(ctx);
  });
};
Game.prototype.moveObjects = function moveObjects() {
  this.platforms.forEach(function (pf) {
    pf.move();
  });
};
Game.prototype.step = function () {
  this.moveObjects();
};
module.exports = Game;

/***/ }),

/***/ "./src/03_game.js":
/*!************************!*\
  !*** ./src/03_game.js ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var Platform = __webpack_require__(/*! ./02_platform */ "./src/02_platform.js");
var Player = __webpack_require__(/*! ./02_player */ "./src/02_player.js");
var PowerUp = __webpack_require__(/*! ./02_powerup */ "./src/02_powerup.js");
function Game() {
  this.DIM_X = 650;
  this.DIM_Y = 500;
  this.NUM_PLATFORMS = 1;
  this.platforms = [];
  this.powerUps = [];
  this.addPlatforms();
  this.player = new Player({
    game: this,
    width: 25,
    height: 25
  });
  this.collided = false;
  this.level = 1;
  this.levelStartTime = Date.now();
  this.currentLevelDuration = 30000;
  this.playerInvincible = false;
  this.invincibilityEndTime = 0;
  this.playerSpeedBoost = false;
  this.speedBoostEndTime = 0;
  this.powerUpMessages = [];
}
Game.prototype.randomPos = function () {
  return [Math.floor(Math.random() * 650 - 100), -20];
};
Game.prototype.randomNum = function (min, max) {
  return Math.random() < 0.5 ? min : max;
};
Game.prototype.otherVel = function (vel) {
  if (vel[0] === 1.5) {
    return [-1.5, 0];
  } else {
    return [1.5, 0];
  }
};
Game.prototype.getLevelDifficulty = function () {
  var baseSpeed = 4 + this.level * 0.5;
  var numPlatforms = Math.min(1 + Math.floor(this.level / 2), 5);
  var duration = Math.min(30000 + (this.level - 1) * 10000, 60000);
  return {
    speed: baseSpeed,
    numPlatforms: numPlatforms,
    duration: duration
  };
};
Game.prototype.getLevelColor = function () {
  if (this.level >= 5) {
    return this.getRainbowColor();
  }
  var levelColors = [{
    color: "#DC1C13",
    shadow: "red"
  }, {
    color: "#FF6B35",
    shadow: "orange"
  }, {
    color: "#FFD23F",
    shadow: "yellow"
  }, {
    color: "#06FFA5",
    shadow: "lime"
  }];
  var index = Math.min(this.level - 1, levelColors.length - 1);
  return levelColors[index];
};
Game.prototype.getRainbowColor = function () {
  var now = Date.now();
  var cycleDuration = 3000;
  var hue = now % cycleDuration / cycleDuration * 360;
  var h = hue / 360;
  var s = 1;
  var l = 0.5;
  var c = (1 - Math.abs(2 * l - 1)) * s;
  var x = c * (1 - Math.abs(h * 6 % 2 - 1));
  var m = l - c / 2;
  var r, g, b;
  if (h < 1 / 6) {
    r = c;
    g = x;
    b = 0;
  } else if (h < 2 / 6) {
    r = x;
    g = c;
    b = 0;
  } else if (h < 3 / 6) {
    r = 0;
    g = c;
    b = x;
  } else if (h < 4 / 6) {
    r = 0;
    g = x;
    b = c;
  } else if (h < 5 / 6) {
    r = x;
    g = 0;
    b = c;
  } else {
    r = c;
    g = 0;
    b = x;
  }
  r = Math.round((r + m) * 255);
  g = Math.round((g + m) * 255);
  b = Math.round((b + m) * 255);
  var colorHex = "#" + [r, g, b].map(function (x) {
    var hex = x.toString(16);
    return hex.length === 1 ? "0" + hex : hex;
  }).join("");
  return {
    color: colorHex,
    shadow: colorHex
  };
};
Game.prototype.getLevelBgColor = function () {
  if (this.level >= 5) {
    var rainbow = this.getRainbowColor();
    var rgb = this.hexToRgb(rainbow.color);
    return {
      color: "rgba(".concat(rgb.r, ", ").concat(rgb.g, ", ").concat(rgb.b, ", 0.5)"),
      shadow: rainbow.shadow
    };
  }
  var bgColors = [{
    color: "rgba(255, 255, 255, 0.5)",
    shadow: "white"
  }, {
    color: "rgba(255, 200, 150, 0.5)",
    shadow: "orange"
  }, {
    color: "rgba(255, 255, 150, 0.5)",
    shadow: "yellow"
  }, {
    color: "rgba(150, 255, 200, 0.5)",
    shadow: "lime"
  }];
  var index = Math.min(this.level - 1, bgColors.length - 1);
  return bgColors[index];
};
Game.prototype.hexToRgb = function (hex) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : {
    r: 255,
    g: 255,
    b: 255
  };
};
Game.prototype.addPlatforms = function () {
  var difficulty = this.getLevelDifficulty();
  for (var i = 0; i < difficulty.numPlatforms; i++) {
    this.platforms.push(new Platform({
      width: Math.floor(Math.random() * (300 - 200) + 200),
      pos: this.randomPos(),
      vel: [0, this.randomNum(difficulty.speed, difficulty.speed + 1)],
      game: this
    }));
  }
};
Game.prototype.addPowerUp = function () {
  if (Math.random() < 0.05) {
    var types = [PowerUp.POWERUP_TYPES.INVINCIBILITY, PowerUp.POWERUP_TYPES.SPEED_BOOST];
    var randomType = types[Math.floor(Math.random() * types.length)];
    this.powerUps.push(new PowerUp({
      pos: this.randomPos(),
      vel: [0, 3],
      type: randomType,
      game: this
    }));
  }
};
Game.prototype.getPlayerColor = function () {
  var now = Date.now();
  var blinkThreshold = 1000;
  if (this.playerInvincible) {
    var timeLeft = this.invincibilityEndTime - now;
    if (timeLeft <= blinkThreshold) {
      var blinkRate = 200;
      var shouldShowPowerUpColor = Math.floor(now / blinkRate) % 2 === 0;
      return {
        color: shouldShowPowerUpColor ? "#FFD700" : "blue",
        shadow: shouldShowPowerUpColor ? "#FFD700" : "blue"
      };
    }
    return {
      color: "#FFD700",
      shadow: "#FFD700"
    };
  }
  if (this.playerSpeedBoost) {
    var _timeLeft = this.speedBoostEndTime - now;
    if (_timeLeft <= blinkThreshold) {
      var _blinkRate = 200;
      var _shouldShowPowerUpColor = Math.floor(now / _blinkRate) % 2 === 0;
      return {
        color: _shouldShowPowerUpColor ? "#00FF00" : "blue",
        shadow: _shouldShowPowerUpColor ? "#00FF00" : "blue"
      };
    }
    return {
      color: "#00FF00",
      shadow: "#00FF00"
    };
  }
  return {
    color: "blue",
    shadow: "blue"
  };
};
Game.prototype.draw = function (ctx) {
  ctx.clearRect(0, 0, this.DIM_X, this.DIM_Y);
  this.platforms.forEach(function (pf) {
    pf.drawRec(ctx);
  });
  this.powerUps.forEach(function (pu) {
    pu.drawPowerUp(ctx);
  });
  var playerColors = this.getPlayerColor();
  this.player.drawPlayer(ctx, playerColors.color, playerColors.shadow);
  this.drawUI(ctx);
};
Game.prototype.drawUI = function (ctx) {
  var _this = this;
  ctx.fillStyle = "white";
  ctx.font = "20px Arial";
  ctx.fillText("Level: ".concat(this.level), 10, 30);
  var yOffset = 60;
  if (this.playerInvincible) {
    var timeLeft = Math.ceil((this.invincibilityEndTime - Date.now()) / 1000);
    ctx.fillStyle = "#FFD700";
    ctx.fillText("Invincible: ".concat(timeLeft, "s"), 10, yOffset);
    yOffset += 30;
  }
  if (this.playerSpeedBoost) {
    var _timeLeft2 = Math.ceil((this.speedBoostEndTime - Date.now()) / 1000);
    ctx.fillStyle = "#00FF00";
    ctx.fillText("Speed Boost: ".concat(_timeLeft2, "s"), 10, yOffset);
    yOffset += 30;
  }
  var now = Date.now();
  this.powerUpMessages.forEach(function (msg) {
    var elapsed = now - msg.startTime;
    var progress = elapsed / msg.duration;
    var alpha = Math.max(0, 1 - progress);
    var yPos = msg.pos[1] - progress * 50;
    if (alpha > 0 && yPos > -50 && yPos < _this.DIM_Y + 50) {
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.fillStyle = msg.color;
      ctx.font = "bold 24px Arial";
      ctx.shadowColor = msg.color;
      ctx.shadowBlur = 10;
      ctx.textAlign = "center";
      ctx.fillText(msg.text, msg.pos[0], yPos);
      ctx.restore();
    }
  });
};
Game.prototype.moveObjects = function moveObjects() {
  var _this2 = this;
  this.platforms.forEach(function (pf) {
    pf.move();
  });
  this.powerUps.forEach(function (pu) {
    pu.move();
  });
  this.powerUps = this.powerUps.filter(function (pu) {
    return pu.pos[1] < _this2.DIM_Y + 50;
  });
};
Game.prototype.wrap = function (pos) {
  if (pos[0] > this.DIM_X + 20) {
    pos[0] = pos[0] % this.DIM_X - 40;
  } else if (pos[0] < -20) {
    pos[0] = this.DIM_X + 20;
  }
  return pos;
};
Game.prototype.allObjects = function () {
  return [].concat(this.platforms, this.powerUps, this.player);
};
Game.prototype.checkCollisions = function (startAnimate, startCreate) {
  var _this3 = this;
  if (this.playerInvincible) {
    var _allObj = this.allObjects();
    var _player = _allObj[_allObj.length - 1];
    var _loop = function _loop() {
      var obj = _allObj[i];
      var isPowerUp = _this3.powerUps.indexOf(obj) !== -1;
      if (isPowerUp && obj.isCollidedWith(_player)) {
        _this3.collectPowerUp(obj);
        _this3.powerUps = _this3.powerUps.filter(function (pu) {
          return pu !== obj;
        });
      }
    };
    for (var i = 0; i < _allObj.length - 1; i++) {
      _loop();
    }
    return;
  }
  var allObj = this.allObjects();
  var player = allObj[allObj.length - 1];
  var _loop2 = function _loop2() {
      var obj = allObj[_i];
      var isPowerUp = _this3.powerUps.indexOf(obj) !== -1;
      if (isPowerUp) {
        if (obj.isCollidedWith(player)) {
          _this3.collectPowerUp(obj);
          _this3.powerUps = _this3.powerUps.filter(function (pu) {
            return pu !== obj;
          });
          return 0; // continue
        }
      } else {
        if (obj.isCollidedWith(player)) {
          _this3.collided = true;
          _this3.reset(startAnimate, startCreate);
          return {
            v: void 0
          };
        }
      }
    },
    _ret;
  for (var _i = 0; _i < allObj.length - 1; _i++) {
    _ret = _loop2();
    if (_ret === 0) continue;
    if (_ret) return _ret.v;
  }
};
Game.prototype.collectPowerUp = function (powerUp) {
  var effectDuration = 5000;
  var now = Date.now();
  var message = "";
  var messageColor = "";
  if (powerUp.type === PowerUp.POWERUP_TYPES.INVINCIBILITY) {
    this.playerInvincible = true;
    this.invincibilityEndTime = now + effectDuration;
    message = "INVINCIBILITY!";
    messageColor = "#FFD700";
  } else if (powerUp.type === PowerUp.POWERUP_TYPES.SPEED_BOOST) {
    this.playerSpeedBoost = true;
    this.speedBoostEndTime = now + effectDuration;
    message = "SPEED BOOST!";
    messageColor = "#00FF00";
  }
  var messageX = this.player ? this.player.pos[0] : powerUp.pos[0];
  var messageY = this.player ? this.player.pos[1] - 30 : powerUp.pos[1];
  this.powerUpMessages.push({
    text: message,
    color: messageColor,
    pos: [messageX, messageY],
    startTime: now,
    duration: 2000
  });
};
Game.prototype.updatePowerUpEffects = function () {
  var now = Date.now();
  if (this.playerInvincible && now >= this.invincibilityEndTime) {
    this.playerInvincible = false;
  }
  if (this.playerSpeedBoost && now >= this.speedBoostEndTime) {
    this.playerSpeedBoost = false;
  }
  this.powerUpMessages = this.powerUpMessages.filter(function (msg) {
    return now - msg.startTime < msg.duration;
  });
};
Game.prototype.checkLevelProgression = function () {
  var now = Date.now();
  if (now - this.levelStartTime >= this.currentLevelDuration) {
    this.level++;
    this.levelStartTime = now;
    var difficulty = this.getLevelDifficulty();
    this.currentLevelDuration = difficulty.duration;
  }
};
Game.prototype.reset = function (startAnimate, startCreate) {
  this.platforms = [];
  this.powerUps = [];
  this.player.pos = [320, 450];
  this.collided = false;
  this.level = 1;
  this.levelStartTime = Date.now();
  this.currentLevelDuration = 30000;
  this.playerInvincible = false;
  this.playerSpeedBoost = false;
  this.powerUpMessages = [];
  clearInterval(startAnimate);
  clearInterval(startCreate);
  modal2.style.display = "block";
  resetTimer();
};
Game.prototype.step = function (startAnimate, startCreate) {
  this.moveObjects();
  this.updatePowerUpEffects();
  this.checkLevelProgression();
  if (!this.collided) {
    this.checkCollisions(startAnimate, startCreate);
  }
  ;
};
module.exports = Game;

/***/ }),

/***/ "./src/03_game_view.js":
/*!*****************************!*\
  !*** ./src/03_game_view.js ***!
  \*****************************/
/*! no static exports found */
/***/ (function(module, exports) {

function GameView(game, ctx) {
  this.game = game;
  this.ctx = ctx;
}
GameView.prototype.start = function start() {
  var _this = this;
  var animate = function animate() {
    if (document.hasFocus()) {
      _this.game.step(startAnimate, startCreate);
      _this.game.draw(_this.ctx);
      if (_this.game.player) {
        _this.bindKeyHandlers();
      }
    }
  };
  var startAnimate = setInterval(animate, 15);
  var create = function create() {
    if (document.hasFocus()) {
      _this.game.addPlatforms();
      _this.game.addPowerUp();
    }
  };
  var startCreate = setInterval(create, 700);
};
GameView.prototype.bindKeyHandlers = function () {
  var baseSpeed = 8;
  var speed = this.game.playerSpeedBoost ? baseSpeed * 1.5 : baseSpeed;
  if (key.isPressed("left")) {
    this.game.player.move([-speed, 0]);
  }
  ;
  if (key.isPressed("right")) {
    this.game.player.move([speed, 0]);
  }
  ;
};
module.exports = GameView;

/***/ }),

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var bgObjs = __webpack_require__(/*! ./03_bg_objects */ "./src/03_bg_objects.js");
var Game = __webpack_require__(/*! ./03_game */ "./src/03_game.js");
window.Game = Game;
var GameView = __webpack_require__(/*! ./03_game_view */ "./src/03_game_view.js");
window.GameView = GameView;
document.addEventListener("DOMContentLoaded", function () {
  var canvas = document.getElementById("game-canvas");
  var ctx = canvas.getContext("2d");
  var bgCanvas = document.getElementById("bg-canvas");
  var bgCtx = bgCanvas.getContext("2d");
  var span = document.getElementsByClassName("close-modal")[0];
  var span2 = document.getElementsByClassName("close-modal2")[0];
  var music = document.getElementById("music");
  var playMusic1 = document.getElementById("play1");
  var pauseMusic1 = document.getElementById("pause1");
  var playMusic2 = document.getElementById("play2");
  var pauseMusic2 = document.getElementById("pause2");
  pauseMusic1.style.display = "none";
  pauseMusic2.style.display = "none";
  playMusic1.addEventListener("click", function () {
    music.play();
    playMusic1.style.display = "none";
    playMusic2.style.display = "none";
    pauseMusic1.style.display = "block";
    pauseMusic2.style.display = "block";
  });
  pauseMusic1.addEventListener("click", function () {
    music.pause();
    pauseMusic1.style.display = "none";
    pauseMusic2.style.display = "none";
    playMusic1.style.display = "block";
    playMusic2.style.display = "block";
  });
  playMusic2.addEventListener("click", function () {
    music.play();
    playMusic2.style.display = "none";
    pauseMusic2.style.display = "block";
  });
  pauseMusic2.addEventListener("click", function () {
    music.pause();
    pauseMusic2.style.display = "none";
    playMusic2.style.display = "block";
  });
  var game = new Game();
  var bgAnimation = new bgObjs({
    mainGame: game
  });
  new GameView(bgAnimation, bgCtx).start();
  modal.style.display = "block";
  span.onclick = function () {
    modal.style.display = "none";
    new GameView(game, ctx).start();
    startTimer();
  };
  span2.onclick = function () {
    modal2.style.display = "none";
    new GameView(game, ctx).start();
    startTimer();
  };
});

/***/ })

/******/ });
//# sourceMappingURL=bundle.js.map