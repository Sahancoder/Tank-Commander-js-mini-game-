import { Game } from './Game.js';

window.addEventListener('load', function() {
    const canvas = document.getElementById('gameCanvas');
    const game = new Game(canvas);

    function animate() {
        game.update();
        game.draw();
        requestAnimationFrame(animate);
    }

    animate();
});