const Platform = require("./02_platform");

function Game(options) {
  this.DIM_X = window.innerWidth;
  this.DIM_Y = window.innerHeight;
  this.NUM_PLATFORMS = 7;
  this.mainGame = options ? options.mainGame : null; // Reference to main game for level info

  this.platforms = [];
  this.addPlatforms();
}

Game.prototype.randomPos = function() {
  return [(Math.floor(Math.random() * (this.DIM_X) - 100)), -300];
}

Game.prototype.randomNum = function(min, max) {
  return Math.random() < 0.5 ? min : max;
}

Game.prototype.otherVel = function(vel) {
  if (vel[0] === 1.5) {
    return [-1.5, 0];
  } else {
    return [1.5, 0];
  }
}

Game.prototype.addPlatforms = function() {
  for (let i = 0; i < this.NUM_PLATFORMS; i++) {
    this.platforms.push(new Platform({
      height: 150,
      width: 1,
      pos: this.randomPos(),
      vel: [0, this.randomNum(1, 2)],
      game: this
    }));
  }
}
  
Game.prototype.getLevelBgColor = function() {
  // Get level from main game if available
  const level = this.mainGame && this.mainGame.level ? this.mainGame.level : 1;
  
  // Level 5+ uses rainbow shifting colors
  if (level >= 5) {
    const rainbow = this.getRainbowColor();
    // Convert to rgba with transparency for background
    const rgb = this.hexToRgb(rainbow.color);
    return {
      color: `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.5)`,
      shadow: rainbow.shadow
    };
  }
  
  // Background colors for levels 1-4 (one color per level)
  const bgColors = [
    { color: "rgba(255, 255, 255, 0.5)", shadow: "white" },        // Level 1: White
    { color: "rgba(255, 200, 150, 0.5)", shadow: "orange" },       // Level 2: Orange
    { color: "rgba(255, 255, 150, 0.5)", shadow: "yellow" },       // Level 3: Yellow
    { color: "rgba(150, 255, 200, 0.5)", shadow: "lime" }          // Level 4: Green
  ];
  
  const index = Math.min(level - 1, bgColors.length - 1);
  return bgColors[index];
}

Game.prototype.getRainbowColor = function() {
  // Create a rainbow effect that shifts over time
  const now = Date.now();
  const cycleDuration = 3000; // 3 seconds for full rainbow cycle
  const hue = (now % cycleDuration) / cycleDuration * 360;
  
  // Convert HSL to RGB for the color
  const h = hue / 360;
  const s = 1;
  const l = 0.5;
  
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs((h * 6) % 2 - 1));
  const m = l - c / 2;
  
  let r, g, b;
  if (h < 1/6) {
    r = c; g = x; b = 0;
  } else if (h < 2/6) {
    r = x; g = c; b = 0;
  } else if (h < 3/6) {
    r = 0; g = c; b = x;
  } else if (h < 4/6) {
    r = 0; g = x; b = c;
  } else if (h < 5/6) {
    r = x; g = 0; b = c;
  } else {
    r = c; g = 0; b = x;
  }
  
  r = Math.round((r + m) * 255);
  g = Math.round((g + m) * 255);
  b = Math.round((b + m) * 255);
  
  const colorHex = "#" + [r, g, b].map(x => {
    const hex = x.toString(16);
    return hex.length === 1 ? "0" + hex : hex;
  }).join("");
  
  return {
    color: colorHex,
    shadow: colorHex
  };
}

Game.prototype.hexToRgb = function(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : { r: 255, g: 255, b: 255 };
}

Game.prototype.draw = function(ctx) {
  ctx.clearRect(0, 0, this.DIM_X, this.DIM_Y);
  this.platforms.forEach(pf => {
    pf.drawBgRec(ctx);
  });
}

Game.prototype.moveObjects = function moveObjects() {
  this.platforms.forEach(function(pf){
    pf.move();
  });
}

Game.prototype.step = function() {
  this.moveObjects();
}

module.exports = Game;