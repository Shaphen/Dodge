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
  
  // Level system
  this.level = 1;
  this.levelStartTime = Date.now();
  this.currentLevelDuration = 30000; // Store duration for current level
  
  // Power-up effects
  this.playerInvincible = false;
  this.invincibilityEndTime = 0;
  this.playerSpeedBoost = false;
  this.speedBoostEndTime = 0;
  
  // Power-up messages
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
  // Base speed increases with level
  const baseSpeed = 4 + (this.level * 0.5);
  // Number of platforms increases with level
  const numPlatforms = Math.min(1 + Math.floor(this.level / 2), 5);
  // Level duration: starts at 30s, increases to 60s for higher levels
  // Level 1: 30s, Level 2: 40s, Level 3: 50s, Level 4+: 60s
  const duration = Math.min(30000 + ((this.level - 1) * 10000), 60000);
  
  return {
    speed: baseSpeed,
    numPlatforms: numPlatforms,
    duration: duration
  };
}

Game.prototype.getLevelColor = function() {
  // Level 5+ uses rainbow shifting colors
  if (this.level >= 5) {
    return this.getRainbowColor();
  }
  
  // Colors for levels 1-4 (one color per level)
  const levelColors = [
    { color: "#DC1C13", shadow: "red" },        // Level 1: Red
    { color: "#FF6B35", shadow: "orange" },     // Level 2: Orange
    { color: "#FFD23F", shadow: "yellow" },     // Level 3: Yellow
    { color: "#06FFA5", shadow: "lime" }       // Level 4: Green
  ];
  
  const index = Math.min(this.level - 1, levelColors.length - 1);
  return levelColors[index];
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

Game.prototype.getLevelBgColor = function() {
  // Level 5+ uses rainbow shifting colors
  if (this.level >= 5) {
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
  // Random chance to spawn power-up (10% chance)
  if (Math.random() < 0.1) {
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
  const blinkThreshold = 1000; // Blink when less than 1 second remaining
  
  // Check invincibility
  if (this.playerInvincible) {
    const timeLeft = this.invincibilityEndTime - now;
    if (timeLeft <= blinkThreshold) {
      // Blink between gold and blue
      const blinkRate = 200; // Blink every 200ms
      const shouldShowPowerUpColor = Math.floor(now / blinkRate) % 2 === 0;
      return {
        color: shouldShowPowerUpColor ? "#FFD700" : "blue",
        shadow: shouldShowPowerUpColor ? "#FFD700" : "blue"
      };
    }
    return { color: "#FFD700", shadow: "#FFD700" }; // Gold
  }
  
  // Check speed boost
  if (this.playerSpeedBoost) {
    const timeLeft = this.speedBoostEndTime - now;
    if (timeLeft <= blinkThreshold) {
      // Blink between green and blue
      const blinkRate = 200; // Blink every 200ms
      const shouldShowPowerUpColor = Math.floor(now / blinkRate) % 2 === 0;
      return {
        color: shouldShowPowerUpColor ? "#00FF00" : "blue",
        shadow: shouldShowPowerUpColor ? "#00FF00" : "blue"
      };
    }
    return { color: "#00FF00", shadow: "#00FF00" }; // Green
  }
  
  // Default blue
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
  
  // Get player color based on active power-ups
  const playerColors = this.getPlayerColor();
  this.player.drawPlayer(ctx, playerColors.color, playerColors.shadow);
  
  // Draw UI
  this.drawUI(ctx);
}

Game.prototype.drawUI = function(ctx) {
  ctx.fillStyle = "white";
  ctx.font = "20px Arial";
  ctx.fillText(`Level: ${this.level}`, 10, 30);
  
  // Show power-up status
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
  
  // Draw power-up collection messages
  const now = Date.now();
  this.powerUpMessages.forEach(msg => {
    const elapsed = now - msg.startTime;
    const progress = elapsed / msg.duration;
    
    // Fade out effect
    const alpha = Math.max(0, 1 - progress);
    const yPos = msg.pos[1] - (progress * 50); // Move up as it fades
    
    // Only draw if still visible
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
  
  // Remove power-ups that are off screen
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
  // Skip all collision checks if player is invincible (except power-up collection)
  if (this.playerInvincible) {
    // Only check for power-up collisions when invincible
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
    return; // Skip all platform collision checks
  }
  
  // Normal collision checking when not invincible
  let allObj = this.allObjects();
  let player = allObj[allObj.length - 1];
  
  for (let i = 0; i < allObj.length - 1; i++) {
    let obj = allObj[i];
    
    // Check if object is a power-up by checking if it's in the powerUps array
    const isPowerUp = this.powerUps.indexOf(obj) !== -1;
    
    if (isPowerUp) {
      // Check power-up collisions
      if (obj.isCollidedWith(player)) {
        this.collectPowerUp(obj);
        this.powerUps = this.powerUps.filter(pu => pu !== obj);
        continue;
      }
    } else {
      // Check platform collisions
      if (obj.isCollidedWith(player)) {
        this.collided = true;
        this.reset(startAnimate, startCreate);
        return;
      }
    }
  }
}

Game.prototype.collectPowerUp = function(powerUp) {
  const effectDuration = 5000; // 5 seconds
  const now = Date.now();
  
  // Create a temporary message
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
  
  // Add message at player position (more visible) or power-up position
  const messageX = this.player ? this.player.pos[0] : powerUp.pos[0];
  const messageY = this.player ? this.player.pos[1] - 30 : powerUp.pos[1];
  
  this.powerUpMessages.push({
    text: message,
    color: messageColor,
    pos: [messageX, messageY],
    startTime: now,
    duration: 2000 // Show for 2 seconds
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
  
  // Remove expired messages
  this.powerUpMessages = this.powerUpMessages.filter(msg => {
    return (now - msg.startTime) < msg.duration;
  });
}

Game.prototype.checkLevelProgression = function() {
  const now = Date.now();
  
  // Check if current level duration has elapsed
  if (now - this.levelStartTime >= this.currentLevelDuration) {
    this.level++;
    this.levelStartTime = now;
    // Update duration for the new level
    const difficulty = this.getLevelDifficulty();
    this.currentLevelDuration = difficulty.duration;
  }
}

Game.prototype.reset = function(startAnimate, startCreate) {
  this.platforms = [];
  this.powerUps = [];
  this.player.pos = [320, 450];
  this.collided = false;
  
  // Reset level and power-up effects
  this.level = 1;
  this.levelStartTime = Date.now();
  this.currentLevelDuration = 30000; // Reset to 30 seconds for level 1
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