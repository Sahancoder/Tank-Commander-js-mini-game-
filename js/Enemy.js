import { Bullet } from './Bullet.js';

export class Enemy {
    constructor(game, x, y, speed, fireRate) {
        this.game = game;
        this.x = x;
        this.y = y;
        this.width = 30;
        this.height = 30;
        this.speed = speed;
        this.fireRate = fireRate;
        this.color = "#ff4757";
        this.dx = Math.random() < 0.5 ? 1 : -1;
        this.dy = Math.random() < 0.5 ? 1 : -1;
        this.moveTimer = 0;
        this.markedForDeletion = false;
    }

    update() {
        // Simple AI: Move randomly
        this.moveTimer++;
        if (this.moveTimer > 60) { // Change dir every second approx
            this.dx = Math.random() < 0.5 ? 1 : -1;
            this.dy = Math.random() < 0.5 ? 1 : -1;
            this.moveTimer = 0;
        }

        this.x += this.dx * this.speed;
        if (this.game.checkWallCollision(this) || this.x < 0 || this.x > this.game.width - this.width) {
            this.x -= this.dx * this.speed;
            this.dx *= -1;
        }

        this.y += this.dy * this.speed;
        if (this.game.checkWallCollision(this) || this.y < 0 || this.y > this.game.height - this.height) {
            this.y -= this.dy * this.speed;
            this.dy *= -1;
        }

        // Random Shooting
        if (Math.random() < this.fireRate) {
            const bx = this.x + this.width/2;
            const by = this.y + this.height/2;
            // Shoot roughly toward player (simplified)
            let shootX = 0, shootY = 0;
            if (Math.abs(this.game.player.x - this.x) > Math.abs(this.game.player.y - this.y)) {
                shootX = this.game.player.x > this.x ? 1 : -1;
            } else {
                shootY = this.game.player.y > this.y ? 1 : -1;
            }
            this.game.bullets.push(new Bullet(bx, by, shootX, shootY, false));
        }
    }

    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}