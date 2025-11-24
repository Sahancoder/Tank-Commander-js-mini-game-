export class Bullet {
    constructor(x, y, dx, dy, isPlayer) {
        this.x = x;
        this.y = y;
        this.dx = dx;
        this.dy = dy;
        this.size = 6;
        this.speed = 7;
        this.isPlayer = isPlayer; // true if player shot it, false if enemy
        this.markedForDeletion = false;
    }

    update(canvasWidth, canvasHeight) {
        this.x += this.dx * this.speed;
        this.y += this.dy * this.speed;

        // Check bounds
        if (this.x < 0 || this.x > canvasWidth || this.y < 0 || this.y > canvasHeight) {
            this.markedForDeletion = true;
        }
    }

    draw(ctx) {
        ctx.fillStyle = this.isPlayer ? "#ffff00" : "#ff0000";
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size/2, 0, Math.PI * 2);
        ctx.fill();
    }
}