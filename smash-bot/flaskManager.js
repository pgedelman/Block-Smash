const { spawn } = require('cross-spawn');
const path = require('path');
let flaskProcess = null;

const flaskScriptPath = path.join(__dirname, 'flask_manager.py');

function startFlaskServer() {
    if (!flaskProcess) {
        flaskProcess = spawn('python', [flaskScriptPath], { cwd: path.join(__dirname, '../smash-bot') });
        flaskProcess.stdout.on('data', (data) => {
            console.log(`Flask stdout: ${data.toString()}`);
        });
        flaskProcess.stderr.on('data', (data) => {
            console.error(`Flask Info: ${data.toString()}`);
        });
        flaskProcess.on('error', (err) => {
            console.error(`Failed to start Flask server: ${err}`);
        });
        flaskProcess.on('close', (code) => {
            console.log(`Flask process exited with code ${code}`);
            flaskProcess = null;
        });
        console.log('Flask server started');
    }
}

function stopFlaskServer() {
    if (flaskProcess) {
        flaskProcess.kill('SIGTERM');
        flaskProcess = null;
        console.log('Flask server stopped');
    }
}

module.exports = { startFlaskServer, stopFlaskServer };
