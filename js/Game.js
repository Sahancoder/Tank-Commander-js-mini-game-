import { Player } from './Player.js';
import { Enemy } from './Enemy.js';
import { levels } from './LevelData.js';

export class Game {
    constructor(canvas) {
        this.canvas = canvas;
        this.width = canvas.width;
        this.height = canvas.height;
        this.ctx = canvas.getContext("2d");

        this.levelIndex = 0;
        this.player = new Player(this);
        this.input = [];
        this.bullets = [];
        this.enemies = [];
        this.walls = [];

        this.gameState = "PLAYING"; // PLAYING, GAMEOVER, WON

        // UI Elements
        this.levelDisplay = document.getElementById("level-display");
        this.enemyDisplay = document.getElementById("enemy-display");
        this.msgOverlay = document.getElementById("message-overlay");
        this.msgTitle = document.getElementById("msg-title");

        // Input Listeners
        window.addEventListener('keydown', e => {
            if (this.input.indexOf(e.code) === -1) this.input.push(e.code);
            if (e.code === 'Space' && this.gameState === "PLAYING") this.player.shoot();
            if (e.code === 'Space' && (this.gameState === "GAMEOVER" || this.gameState === "WON")) this.restartGame();
        });
        window.addEventListener('keyup', e => {
            const index = this.input.indexOf(e.code);
            if (index > -1) this.input.splice(index, 1);
        });

        this.startLevel();
    }

    startLevel() {
        if (this.levelIndex >= levels.length) {
            this.gameState = "WON";
            this.msgTitle.innerText = "VICTORY!";
            this.msgTitle.style.color = "#00ff00";
            this.msgOverlay.classList.remove("hidden");
            return;
        }

        const data = levels[this.levelIndex];
        this.canvas.style.backgroundColor = data.bg;
        this.levelDisplay.innerText = `${this.levelIndex + 1}: ${data.name}`;

        // Reset Actors
        this.player.x = 40; this.player.y = 40;
        this.bullets = [];
        this.enemies = [];
        this.walls = [];

        // Generate Walls
        for(let i=0; i<12; i++) {
            this.walls.push({
                x: Math.random() * (this.width - 100) + 100,
                y: Math.random() * (this.height - 100) + 50,
                w: 50, h: 50, color: data.wall
            });
        }

        // Generate Enemies
        for(let i=0; i<data.enemyCount; i++) {
            let ex = Math.random() * (this.width - 200) + 150;
            let ey = Math.random() * (this.height - 100) + 50;
            this.enemies.push(new Enemy(this, ex, ey, data.enemySpeed, data.fireRate));
        }
    }

    update() {
        if (this.gameState !== "PLAYING") return;

        this.player.update(this.input);

        this.bullets.forEach(b => b.update(this.width, this.height));
        this.bullets = this.bullets.filter(b => !b.markedForDeletion);

        this.enemies.forEach(e => e.update());
        this.enemies = this.enemies.filter(e => !e.markedForDeletion);

        this.checkCollisions();

        this.enemyDisplay.innerText = this.enemies.length;

        if (this.enemies.length === 0) {
            this.levelIndex++;
            this.startLevel();
        }
    }

    checkCollisions() {
        // Bullet vs Enemy & Bullet vs Player
        this.bullets.forEach(b => {
            if (b.isPlayer) {
                this.enemies.forEach(e => {
                    if (this.checkRectCollision(b, e)) {
                        e.markedForDeletion = true;
                        b.markedForDeletion = true;
                    }
                });
                // Bullet vs Walls
                this.walls.forEach(w => {
                    if (this.checkRectCollision({x:b.x, y:b.y, width:b.size, height:b.size}, w)) b.markedForDeletion = true;
                });
            } else {
                // Enemy Bullet hits Player
                if (this.checkRectCollision(b, this.player)) {
                    this.gameOver();
                }
            }
        });

        // Enemy vs Player (Body slam)
        this.enemies.forEach(e => {
            if (this.checkRectCollision(e, this.player)) this.gameOver();
        });
    }

    checkRectCollision(rect1, rect2) {
        // Handling inconsistent width/height property names (size vs width)
        let r1w = rect1.width || rect1.size || 0;
        let r1h = rect1.height || rect1.size || 0;
        let r2w = rect2.width || rect2.size || 0;
        let r2h = rect2.height || rect2.size || 0;

        return (
            rect1.x < rect2.x + r2w &&
            rect1.x + r1w > rect2.x &&
            rect1.y < rect2.y + r2h &&
            rect1.y + r1h > rect2.y
        );
    }

    checkWallCollision(rect) {
        for (let w of this.walls) {
            if (this.checkRectCollision(rect, w)) return true;
        }
        return false;
    }

    gameOver() {
        this.gameState = "GAMEOVER";
        this.player.isDead = true;
        this.msgOverlay.classList.remove("hidden");
        this.msgTitle.innerText = "GAME OVER";
        this.msgTitle.style.color = "#ff4757";
    }

    restartGame() {
        this.levelIndex = 0;
        this.gameState = "PLAYING";
        this.player.isDead = false;
        this.msgOverlay.classList.add("hidden");
        this.startLevel();
    }

    draw() {
        this.ctx.clearRect(0, 0, this.width, this.height);

        // Draw Walls
        this.walls.forEach(w => {
            this.ctx.fillStyle = w.color;
            this.ctx.fillRect(w.x, w.y, w.w, w.h);
        });

        this.player.draw(this.ctx);
        this.enemies.forEach(e => e.draw(this.ctx));
        this.bullets.forEach(b => b.draw(this.ctx));
    }
}