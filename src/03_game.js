const Platform = require("./02_platform");
const Player = require("./02_player");
const PowerUp = require("./02_powerup");

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
    height: 25,
  });
  this.collided = false;
  
  this.level = 5;
  this.levelStartTime = Date.now();
  this.currentLevelDuration = 30000;
  this.previousLevel = 5;
  this.levelTransitionStartTime = Date.now();
  this.transitionDuration = 2000;
  
  this.playerInvincible = false;
  this.invincibilityEndTime = 0;
  this.playerSpeedBoost = false;
  this.speedBoostEndTime = 0;
  
  this.powerUpMessages = [];
}

Game.prototype.randomPos = function() {
  return [(Math.floor(Math.random() * (650) - 100)), -20];
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

Game.prototype.getLevelDifficulty = function() {
  const baseSpeed = 4 + (this.level * 0.5);
  const numPlatforms = Math.min(1 + Math.floor(this.level / 2), 5);
  const duration = 30000;
  
  return {
    speed: baseSpeed,
    numPlatforms: numPlatforms,
    duration: duration
  };
}

Game.prototype.getLevelColor = function() {
  if (this.level >= 5) {
    return this.getRainbowColor();
  }
  
  const levelColors = [
    { color: "#FFFFFF", shadow: "white" },
    { color: "#FF6B35", shadow: "orange" },
    { color: "#9B59B6", shadow: "purple" },
    { color: "#06FFA5", shadow: "lime" }
  ];
  
  const now = Date.now();
  const timeSinceTransition = now - this.levelTransitionStartTime;
  const isTransitioning = this.previousLevel !== this.level && timeSinceTransition < this.transitionDuration;
  
  if (isTransitioning) {
    const prevIndex = Math.min(this.previousLevel - 1, levelColors.length - 1);
    const currIndex = Math.min(this.level - 1, levelColors.length - 1);
    
    const prevColor = levelColors[prevIndex];
    const currColor = levelColors[currIndex];
    
    const t = Math.min(timeSinceTransition / this.transitionDuration, 1);
    const interpolatedColor = this.interpolateColor(prevColor.color, currColor.color, t);
    
    return { color: interpolatedColor, shadow: interpolatedColor };
  }
  
  const index = Math.min(this.level - 1, levelColors.length - 1);
  return levelColors[index];
}

Game.prototype.getRainbowColor = function() {
  const now = Date.now();
  const cycleDuration = 3000;
  const hue = (now % cycleDuration) / cycleDuration * 360;
  
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

Game.prototype.getLevelBgColor = function() {
  if (this.level >= 5) {
    const rainbow = this.getRainbowColor();
    const rgb = this.hexToRgb(rainbow.color);
    return {
      color: `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.5)`,
      shadow: rainbow.shadow
    };
  }
  
  const bgColors = [
    { color: "rgba(255, 255, 255, 0.5)", shadow: "white" },
    { color: "rgba(255, 107, 53, 0.5)", shadow: "orange" },
    { color: "rgba(155, 89, 182, 0.5)", shadow: "purple" },
    { color: "rgba(6, 255, 165, 0.5)", shadow: "lime" }
  ];
  
  const now = Date.now();
  const timeSinceTransition = now - this.levelTransitionStartTime;
  const isTransitioning = this.previousLevel !== this.level && timeSinceTransition < this.transitionDuration;
  
  if (isTransitioning) {
    const prevIndex = Math.min(this.previousLevel - 1, bgColors.length - 1);
    const currIndex = Math.min(this.level - 1, bgColors.length - 1);
    
    const prevColor = bgColors[prevIndex];
    const currColor = bgColors[currIndex];
    
    const t = Math.min(timeSinceTransition / this.transitionDuration, 1);
    const interpolatedColor = this.interpolateRgba(prevColor.color, currColor.color, t);
    
    return { color: interpolatedColor, shadow: interpolatedColor };
  }
  
  const index = Math.min(this.level - 1, bgColors.length - 1);
  return bgColors[index];
}

Game.prototype.hexToRgb = function(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : { r: 255, g: 255, b: 255 };
}

Game.prototype.interpolateColor = function(color1, color2, t) {
  const rgb1 = this.hexToRgb(color1);
  const rgb2 = this.hexToRgb(color2);
  
  const r = Math.round(rgb1.r + (rgb2.r - rgb1.r) * t);
  const g = Math.round(rgb1.g + (rgb2.g - rgb1.g) * t);
  const b = Math.round(rgb1.b + (rgb2.b - rgb1.b) * t);
  
  return "#" + [r, g, b].map(x => {
    const hex = x.toString(16);
    return hex.length === 1 ? "0" + hex : hex;
  }).join("");
}

Game.prototype.interpolateRgba = function(rgba1, rgba2, t) {
  const match1 = rgba1.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
  const match2 = rgba2.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
  
  if (!match1 || !match2) return rgba1;
  
  const r1 = parseInt(match1[1]);
  const g1 = parseInt(match1[2]);
  const b1 = parseInt(match1[3]);
  const a1 = match1[4] ? parseFloat(match1[4]) : 1;
  
  const r2 = parseInt(match2[1]);
  const g2 = parseInt(match2[2]);
  const b2 = parseInt(match2[3]);
  const a2 = match2[4] ? parseFloat(match2[4]) : 1;
  
  const r = Math.round(r1 + (r2 - r1) * t);
  const g = Math.round(g1 + (g2 - g1) * t);
  const b = Math.round(b1 + (b2 - b1) * t);
  const a = a1 + (a2 - a1) * t;
  
  return `rgba(${r}, ${g}, ${b}, ${a})`;
}

Game.prototype.addPlatforms = function() {
  const difficulty = this.getLevelDifficulty();
  for (let i = 0; i < difficulty.numPlatforms; i++) {
    this.platforms.push(new Platform({
      width: Math.floor(Math.random() * (300-200) + 200),
      pos: this.randomPos(),
      vel: [0, this.randomNum(difficulty.speed, difficulty.speed + 1)],
      game: this
    }));
  }
}

Game.prototype.addPowerUp = function() {
  if (Math.random() < 0.05) {
    const types = [PowerUp.POWERUP_TYPES.INVINCIBILITY, PowerUp.POWERUP_TYPES.SPEED_BOOST];
    const randomType = types[Math.floor(Math.random() * types.length)];
    
    this.powerUps.push(new PowerUp({
      pos: this.randomPos(),
      vel: [0, 3],
      type: randomType,
      game: this
    }));
  }
}
  
Game.prototype.getPlayerColor = function() {
  const now = Date.now();
  const blinkThreshold = 1000;
  
  if (this.playerInvincible) {
    const timeLeft = this.invincibilityEndTime - now;
    if (timeLeft <= blinkThreshold) {
      const blinkRate = 200;
      const shouldShowPowerUpColor = Math.floor(now / blinkRate) % 2 === 0;
      return {
        color: shouldShowPowerUpColor ? "#FFD700" : "blue",
        shadow: shouldShowPowerUpColor ? "#FFD700" : "blue"
      };
    }
    return { color: "#FFD700", shadow: "#FFD700" };
  }
  
  if (this.playerSpeedBoost) {
    const timeLeft = this.speedBoostEndTime - now;
    if (timeLeft <= blinkThreshold) {
      const blinkRate = 200;
      const shouldShowPowerUpColor = Math.floor(now / blinkRate) % 2 === 0;
      return {
        color: shouldShowPowerUpColor ? "#00FF00" : "blue",
        shadow: shouldShowPowerUpColor ? "#00FF00" : "blue"
      };
    }
    return { color: "#00FF00", shadow: "#00FF00" };
  }
  
  return { color: "blue", shadow: "blue" };
}

Game.prototype.draw = function(ctx) {
  ctx.clearRect(0, 0, this.DIM_X, this.DIM_Y);
  this.platforms.forEach(pf => {
    pf.drawRec(ctx);
  });
  this.powerUps.forEach(pu => {
    pu.drawPowerUp(ctx);
  });
  
  const playerColors = this.getPlayerColor();
  this.player.drawPlayer(ctx, playerColors.color, playerColors.shadow);
  
  this.drawUI(ctx);
}

Game.prototype.getLevelIndicatorColor = function() {
  const now = Date.now();
  const timeSinceTransition = now - this.levelTransitionStartTime;
  const isTransitioning = this.previousLevel !== this.level && timeSinceTransition < this.transitionDuration;
  
  let currentColor;
  let previousColor;
  
  if (this.level >= 5) {
    currentColor = this.getRainbowColor().color;
  } else {
    const levelColors = [
      "#FFFFFF",
      "#FF6B35",
      "#9B59B6",
      "#06FFA5"
    ];
    const currentIndex = Math.min(this.level - 1, levelColors.length - 1);
    currentColor = levelColors[currentIndex];
  }
  
  if (isTransitioning) {
    if (this.previousLevel >= 5) {
      previousColor = this.getRainbowColor().color;
    } else {
      const levelColors = [
        "#FFFFFF",
        "#FF6B35",
        "#9B59B6",
        "#06FFA5"
      ];
      const prevIndex = Math.min(this.previousLevel - 1, levelColors.length - 1);
      previousColor = levelColors[prevIndex];
    }
    
    const t = Math.min(timeSinceTransition / this.transitionDuration, 1);
    const pulse = Math.sin(t * Math.PI * 3);
    const glowIntensity = 0.5 + (Math.abs(pulse) * 0.5);
    
    const interpolatedColor = this.interpolateColor(previousColor, currentColor, t);
    const rgb = this.hexToRgb(interpolatedColor);
    
    const r = Math.min(255, Math.round(rgb.r * (0.7 + glowIntensity * 0.6)));
    const g = Math.min(255, Math.round(rgb.g * (0.7 + glowIntensity * 0.6)));
    const b = Math.min(255, Math.round(rgb.b * (0.7 + glowIntensity * 0.6)));
    
    return {
      color: `rgb(${r}, ${g}, ${b})`,
      glow: 5 + (Math.abs(pulse) * 25),
      alpha: 1
    };
  }
  
  return {
    color: currentColor,
    glow: 0,
    alpha: 1
  };
}

Game.prototype.drawUI = function(ctx) {
  const now = Date.now();
  const timeSinceTransition = now - this.levelTransitionStartTime;
  const isTransitioning = this.previousLevel !== this.level && timeSinceTransition < this.transitionDuration;
  
  const indicatorStyle = this.getLevelIndicatorColor();
  
  ctx.font = "20px Arial";
  
  ctx.fillStyle = "white";
  ctx.shadowBlur = 0;
  const textMetrics = ctx.measureText("Level: ");
  const numberX = 10 + textMetrics.width;
  
  if (isTransitioning) {
    const t = Math.min(timeSinceTransition / this.transitionDuration, 1);
    const fadeOut = 1 - t;
    const fadeIn = t;
    
    ctx.fillText("Level: ", 10, 30);
    
    ctx.save();
    ctx.globalAlpha = fadeOut;
    ctx.fillStyle = "white";
    ctx.shadowColor = "white";
    ctx.shadowBlur = 0;
    ctx.fillText(this.previousLevel.toString(), numberX, 30);
    ctx.restore();
    
    ctx.save();
    ctx.globalAlpha = fadeIn;
    ctx.fillStyle = indicatorStyle.color;
    ctx.shadowColor = indicatorStyle.color;
    ctx.shadowBlur = indicatorStyle.glow;
    ctx.fillText(this.level.toString(), numberX, 30);
    ctx.restore();
  } else {
    ctx.fillText("Level: ", 10, 30);
    ctx.fillStyle = indicatorStyle.color;
    ctx.shadowColor = indicatorStyle.color;
    ctx.shadowBlur = indicatorStyle.glow;
    ctx.fillText(this.level.toString(), numberX, 30);
  }
  
  ctx.shadowBlur = 0;
  
  let yOffset = 60;
  if (this.playerInvincible) {
    const timeLeft = Math.ceil((this.invincibilityEndTime - Date.now()) / 1000);
    ctx.fillStyle = "#FFD700";
    ctx.fillText(`Invincible: ${timeLeft}s`, 10, yOffset);
    yOffset += 30;
  }
  
  if (this.playerSpeedBoost) {
    const timeLeft = Math.ceil((this.speedBoostEndTime - Date.now()) / 1000);
    ctx.fillStyle = "#00FF00";
    ctx.fillText(`Speed Boost: ${timeLeft}s`, 10, yOffset);
    yOffset += 30;
  }
  
  this.powerUpMessages.forEach(msg => {
    const elapsed = now - msg.startTime;
    const progress = elapsed / msg.duration;
    
    const alpha = Math.max(0, 1 - progress);
    const yPos = msg.pos[1] - (progress * 50);
    
    if (alpha > 0 && yPos > -50 && yPos < this.DIM_Y + 50) {
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
}

Game.prototype.moveObjects = function moveObjects() {
  this.platforms.forEach(function(pf){
    pf.move();
  });
  this.powerUps.forEach(function(pu){
    pu.move();
  });
  
  this.powerUps = this.powerUps.filter(pu => pu.pos[1] < this.DIM_Y + 50);
}

Game.prototype.wrap = function(pos) {
  if (pos[0] > this.DIM_X + 20) {
    pos[0] = (pos[0] % this.DIM_X) - 40;
  } else if (pos[0] < -20) {
    pos[0] = this.DIM_X + 20;
  }
  return pos;
}

Game.prototype.allObjects = function() {
  return [].concat(this.platforms, this.powerUps, this.player);
}

Game.prototype.checkCollisions = function(startAnimate, startCreate) {
  if (this.playerInvincible) {
    let allObj = this.allObjects();
    let player = allObj[allObj.length - 1];
    
    for (let i = 0; i < allObj.length - 1; i++) {
      let obj = allObj[i];
      const isPowerUp = this.powerUps.indexOf(obj) !== -1;
      
      if (isPowerUp && obj.isCollidedWith(player)) {
        this.collectPowerUp(obj);
        this.powerUps = this.powerUps.filter(pu => pu !== obj);
      }
    }
    return;
  }
  
  let allObj = this.allObjects();
  let player = allObj[allObj.length - 1];
  
  for (let i = 0; i < allObj.length - 1; i++) {
    let obj = allObj[i];
    
    const isPowerUp = this.powerUps.indexOf(obj) !== -1;
    
    if (isPowerUp) {
      if (obj.isCollidedWith(player)) {
        this.collectPowerUp(obj);
        this.powerUps = this.powerUps.filter(pu => pu !== obj);
        continue;
      }
    } else {
      if (obj.isCollidedWith(player)) {
        this.collided = true;
        this.reset(startAnimate, startCreate);
        return;
      }
    }
  }
}

Game.prototype.collectPowerUp = function(powerUp) {
  const effectDuration = 5000;
  const now = Date.now();
  
  let message = "";
  let messageColor = "";
  
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
  
  const messageX = this.player ? this.player.pos[0] : powerUp.pos[0];
  const messageY = this.player ? this.player.pos[1] - 30 : powerUp.pos[1];
  
  this.powerUpMessages.push({
    text: message,
    color: messageColor,
    pos: [messageX, messageY],
    startTime: now,
    duration: 2000
  });
}

Game.prototype.updatePowerUpEffects = function() {
  const now = Date.now();
  
  if (this.playerInvincible && now >= this.invincibilityEndTime) {
    this.playerInvincible = false;
  }
  
  if (this.playerSpeedBoost && now >= this.speedBoostEndTime) {
    this.playerSpeedBoost = false;
  }
  
  this.powerUpMessages = this.powerUpMessages.filter(msg => {
    return (now - msg.startTime) < msg.duration;
  });
}

Game.prototype.checkLevelProgression = function() {
  const now = Date.now();
  
  if (now - this.levelStartTime >= this.currentLevelDuration) {
    this.previousLevel = this.level;
    this.level++;
    this.levelStartTime = now;
    this.levelTransitionStartTime = now;
    const difficulty = this.getLevelDifficulty();
    this.currentLevelDuration = difficulty.duration;
  }
}

Game.prototype.reset = function(startAnimate, startCreate) {
  this.platforms = [];
  this.powerUps = [];
  this.player.pos = [320, 450];
  this.collided = false;
  
  this.level = 5;
  this.previousLevel = 5;
  this.levelStartTime = Date.now();
  this.levelTransitionStartTime = Date.now();
  this.currentLevelDuration = 30000;
  this.playerInvincible = false;
  this.playerSpeedBoost = false;
  this.powerUpMessages = [];
  
  clearInterval(startAnimate);
  clearInterval(startCreate);
  modal2.style.display = "block";
  resetTimer();
}

Game.prototype.step = function(startAnimate, startCreate) {
  this.moveObjects();
  this.updatePowerUpEffects();
  this.checkLevelProgression();
  if (!this.collided){ this.checkCollisions(startAnimate, startCreate); };
}

module.exports = Game;