import { PlayerGame, AIGame } from '../game-scripts/main.js';

let serverReady = false;
window.addEventListener('load', function() {
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    let player = true;
    let train = false;
    canvas.width = 725;
    canvas.height = 600;

    let game = new PlayerGame(canvas.width, canvas.height);
    console.log(game);

    canvas.addEventListener('mousedown', (event) => {
        const rect = canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        if (player === true) game.clickBlock(x, y);
    });

    canvas.addEventListener('mouseup', () => {
        if (player === true) game.unclickBlock();
    });

    canvas.addEventListener('mousemove', (event) => {
        const rect = canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        if (player === true) game.dragBlock(x, y);
    });

    const gm_button = document.getElementById('gm-button');
    gm_button.addEventListener('click', async () => {
        if (player === true) {
            game = new AIGame(canvas.width, canvas.height);
            startFlaskServer();
            player = false;
            gm_button.innerHTML = "Change to Player";
        } else {
            game = new PlayerGame(canvas.width, canvas.height);
            player = true;
            stopFlaskServer();
            gm_button.innerHTML = "Change to AI";
        }
    });

    const reset_button = document.getElementById('reset-button');
    reset_button.addEventListener('click', async () => {
        if (player === true) game = new PlayerGame(canvas.width, canvas.height);
        else game = new AIGame(canvas.width, canvas.height);
    });

    const train_button = document.getElementById('train-button');
    train_button.addEventListener('click', async () => {
        if (player === false) {
            train = true;
            game.organizeGameInfo();
        }
    });

    const use_button = document.getElementById('use-ai');
    use_button.addEventListener('click', async () => {
        if (player === false) {
            train = false;
            game.organizeGameInfo();
        }
    });


    function animate() {
        let score = document.getElementById("score");
        score.innerText = Math.floor(game.score).toString();
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        game.draw(ctx);
        if (player === false && game.infoReady) {
            console.log(game.info);
            sendDataToFlask(game.info);
            game.infoReady = false;
        }
        requestAnimationFrame(animate);
    }
    animate();

    async function sendDataToFlask(data) {
        while (!serverReady) {await new Promise(resolve => setTimeout(resolve, 1000));}
        let url = 'http://localhost:5000/use';
        if (train) url = 'http://localhost:5000/train';
        if (serverReady) {
            try {
                const response = await fetch(url, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data),
                });
                if (response.ok) {
                    console.log('Data sent to Flask server');
                    const responseData = await response.json();
                    console.log('Response from Flask:', responseData);
                    if (responseData[0] === -1 && responseData[1] === -1) {
                        game = new AIGame(canvas.width, canvas.height);
                        game.organizeGameInfo();
                    } else {
                        game.placeBlock(responseData);
                    }
                } else {
                    console.error('Failed to send data to Flask server');
                }
            } catch (error) {
                console.error('Error sending data to Flask server:', error);
            }
        }
    }
});

function startFlaskServer() {
    try {
        fetch('/start-flask', { method: 'POST' });
        new Promise(resolve => setTimeout(resolve, 5000));    
        console.log('Flask server started');
        serverReady = true;
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