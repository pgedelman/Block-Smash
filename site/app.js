import { Game, AIGame } from '../game-scripts/main.js';

window.addEventListener('load', function() {
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    let mode = 0;
    canvas.width = 725;
    canvas.height = 600;

    let game = new Game(canvas.width, canvas.height);
    let gameInfo = game.info;
    console.log(game);

    canvas.addEventListener('mousedown', (event) => {
        const rect = canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        game.clickBlock(x, y);
    });

    canvas.addEventListener('mouseup', () => {
        game.unclickBlock();
        game.smashTiles();
    });

    canvas.addEventListener('mousemove', (event) => {
        const rect = canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        game.dragBlock(x, y);
    });

    const gm_button = document.getElementById('gm-button');
    gm_button.addEventListener('click', async () => {
        if (mode === 1) {
            gm_button.innerHTML = "Change to AI";
            game = new AIGame(canvas.width, canvas.height);
            mode = 0;
            stopFlaskServer();
        } else {
            gm_button.innerHTML = "Change to Player";
            game = new Game(canvas.width, canvas.height);
            mode = 1;
            startFlaskServer();
            sendDataToFlask(game.info);
        }
    });

    const restart_button = document.getElementById('restart-button');
    restart_button.addEventListener('click', async () => {
        if (mode === 1) game = new Game(canvas.width, canvas.height);
        else game = new AIGame(canvas.width, canvas.height);
    });

    function animate() {
        let points = document.getElementById("points");
        points.innerText = Math.floor(game.points).toString();
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        game.draw(ctx);
        if (mode === 1 && gameInfo !== game.info) {
            sendDataToFlask(game.info);
            gameInfo = game.info;
        }
        requestAnimationFrame(animate);
    }
    animate();

    async function sendDataToFlask(data) {
        try {
            const response = await fetch('http://localhost:5000/predict', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });
            if (response.ok) {
                console.log('Data sent to Flask server');
            } else {
                console.error('Failed to send data to Flask server');
            }
        } catch (error) {
            console.error('Error sending data to Flask server:', error);
        }
    }
});

async function startFlaskServer() {
    try {
        await fetch('/start-flask', { method: 'POST' });
        console.log('Flask server started');
    } catch (error) {
        console.error('Failed to start Flask server:', error);
    }
}

async function stopFlaskServer() {
    try {
        await fetch('/stop-flask', { method: 'POST' });
        console.log('Flask server stopped');
    } catch (error) {
        console.error('Failed to stop Flask server:', error);
    }
}