import { Bullet } from './Bullet.js';

export class Player {
    constructor(game) {
        this.game = game;
        this.width = 30;
        this.height = 30;
        this.x = 50;
        this.y = 50;
        this.speed = 4;
        this.color = "#00d2ff";
        this.dir = { x: 0, y: -1 }; // Facing up by default
        this.isDead = false;
    }

    update(input) {
        if (this.isDead) return;

        let dx = 0;
        let dy = 0;

        if (input.includes('ArrowUp') || input.includes('KeyW')) { dy = -1; this.dir = {x:0, y:-1}; }
        else if (input.includes('ArrowDown') || input.includes('KeyS')) { dy = 1; this.dir = {x:0, y:1}; }
        else if (input.includes('ArrowLeft') || input.includes('KeyA')) { dx = -1; this.dir = {x:-1, y:0}; }
        else if (input.includes('ArrowRight') || input.includes('KeyD')) { dx = 1; this.dir = {x:1, y:0}; }

        // Move and Check Wall Collisions
        this.x += dx * this.speed;
        if (this.game.checkWallCollision(this)) this.x -= dx * this.speed;

        this.y += dy * this.speed;
        if (this.game.checkWallCollision(this)) this.y -= dy * this.speed;

        // Screen Bounds
        this.x = Math.max(0, Math.min(this.game.width - this.width, this.x));
        this.y = Math.max(0, Math.min(this.game.height - this.height, this.y));
    }

    shoot() {
        if (this.isDead) return;
        // Spawn bullet at center of player
        const bx = this.x + this.width/2;
        const by = this.y + this.height/2;
        this.game.bullets.push(new Bullet(bx, by, this.dir.x, this.dir.y, true));
    }

    draw(ctx) {
        if (this.isDead) return;
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);

        // Turret indicator
        ctx.fillStyle = "white";
        ctx.fillRect(
            this.x + 10 + (this.dir.x * 10),
            this.y + 10 + (this.dir.y * 10),
            10, 10
        );
    }
}