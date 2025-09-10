// Advanced Ping Pong Game with Multiple UI Themes
const canvas = document.getElementById('pongCanvas');
const ctx = canvas.getContext('2d');
const playerScoreEl = document.getElementById('playerScore');
const aiScoreEl = document.getElementById('aiScore');
const themeSelector = document.getElementById('themeSelector');
const blipSound = document.getElementById('blipSound');
const boopSound = document.getElementById('boopSound');
const audienceEl = document.getElementById('audience');

let theme = 'neon';
let playerScore = 0;
let aiScore = 0;
let ballTrail = [];
let ballSpin = 0;
let audienceAnim = 0;

// Game objects
const paddleWidth = 16;
const paddleHeight = 100;
const ballSize = 16;
let playerY = canvas.height / 2 - paddleHeight / 2;
let aiY = canvas.height / 2 - paddleHeight / 2;
let ballX = canvas.width / 2 - ballSize / 2;
let ballY = canvas.height / 2 - ballSize / 2;
let ballVX = 6 * (Math.random() > 0.5 ? 1 : -1);
let ballVY = 4 * (Math.random() > 0.5 ? 1 : -1);

function playSound(type) {
    if (type === 'blip') blipSound.currentTime = 0, blipSound.play();
    if (type === 'boop') boopSound.currentTime = 0, boopSound.play();
}

function resetBall() {
    ballX = canvas.width / 2 - ballSize / 2;
    ballY = canvas.height / 2 - ballSize / 2;
    ballVX = 6 * (Math.random() > 0.5 ? 1 : -1);
    ballVY = 4 * (Math.random() > 0.5 ? 1 : -1);
    ballSpin = 0;
    ballTrail = [];
}

function drawNeonTrail() {
    for (let i = 0; i < ballTrail.length; i++) {
        const t = ballTrail[i];
        ctx.save();
        ctx.globalAlpha = 0.2 + 0.5 * (i / ballTrail.length);
        ctx.shadowColor = '#00fff7';
        ctx.shadowBlur = 12;
        ctx.beginPath();
        ctx.arc(t.x, t.y, ballSize/2, 0, Math.PI*2);
        ctx.fillStyle = '#00fff7';
        ctx.fill();
        ctx.restore();
    }
}

function drawArenaTrail() {
    for (let i = 0; i < ballTrail.length; i++) {
        const t = ballTrail[i];
        ctx.save();
        ctx.globalAlpha = 0.2 + 0.5 * (i / ballTrail.length);
        ctx.shadowColor = '#f901aa';
        ctx.shadowBlur = 12;
        ctx.beginPath();
        ctx.arc(t.x, t.y, ballSize/2, 0, Math.PI*2);
        ctx.fillStyle = '#f901aa';
        ctx.fill();
        ctx.restore();
    }
}
function drawRetroTrail() {
    for (let i = 0; i < ballTrail.length; i++) {
        const t = ballTrail[i];
        ctx.save();
        ctx.globalAlpha = 0.2 + 0.5 * (i / ballTrail.length);
        ctx.shadowColor = '#fff200';
        ctx.shadowBlur = 12;
        ctx.beginPath();
        ctx.arc(t.x, t.y, ballSize/2, 0, Math.PI*2);
        ctx.fillStyle = '#fff200';
        ctx.fill();
        ctx.restore();
    }
}

function drawRetroPaddle(x, y) {
    ctx.save();
    ctx.fillStyle = '#fff200';
    ctx.fillRect(x, y, paddleWidth, paddleHeight);
    ctx.restore();
}

function drawNeonPaddle(x, y) {
    ctx.save();
    ctx.shadowColor = '#00fff7';
    ctx.shadowBlur = 16;
    ctx.fillStyle = '#00fff7';
    ctx.fillRect(x, y, paddleWidth, paddleHeight);
    ctx.restore();
}

function drawArenaPaddle(x, y) {
    ctx.save();
    ctx.shadowColor = '#f901aa';
    ctx.shadowBlur = 16;
    ctx.fillStyle = '#f901aa';
    ctx.fillRect(x, y, paddleWidth, paddleHeight);
    ctx.restore();
}

function drawGlassPaddle(x, y) {
    ctx.save();
    ctx.shadowColor = '#fff';
    ctx.shadowBlur = 2;
    ctx.fillStyle = grad;
    ctx.fillRect(x, y, paddleWidth, paddleHeight);
    ctx.restore();
}

function drawBall() {
    ctx.save();
    if (theme === 'neon') {
        ctx.shadowColor = '#00fff7';
        ctx.shadowBlur = 24;
        ctx.fillStyle = '#00fff7';
        ctx.beginPath();
        ctx.arc(ballX + ballSize/2, ballY + ballSize/2, ballSize/2, 0, Math.PI*2);
        ctx.fill();
        ctx.restore();
        drawNeonTrail();
    } else if (theme === 'retro') {
        ctx.fillStyle = '#fff200';
        ctx.beginPath();
        ctx.arc(ballX + ballSize/2, ballY + ballSize/2, ballSize/2, 0, Math.PI*2);
        ctx.fill();
        ctx.restore();
        drawRetroTrail();
    } else if (theme === 'glass') {
        ctx.globalAlpha = 1;
        ctx.shadowColor = '#fff';
        ctx.shadowBlur = 2;
        let grad = ctx.createRadialGradient(ballX+ballSize/2, ballY+ballSize/2, 2, ballX+ballSize/2, ballY+ballSize/2, ballSize/2);
        grad.addColorStop(0, '#fff');
        grad.addColorStop(1, '#00c6ff');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(ballX + ballSize/2, ballY + ballSize/2, ballSize/2, 0, Math.PI*2);
        ctx.fill();
        ctx.restore();
        drawGlassTrail();
    } else if (theme === 'arena') {
        ctx.save();
        ctx.translate(ballX + ballSize/2, ballY + ballSize/2);
        ctx.rotate(ballSpin);
        ctx.shadowColor = '#f901aa';
        ctx.shadowBlur = 24;
        ctx.fillStyle = '#f901aa';
        ctx.beginPath();
        ctx.arc(0, 0, ballSize/2, 0, Math.PI*2);
        ctx.fill();
        ctx.restore();
        drawArenaTrail();
    }
}

function drawGlassTrail() {
    for (let i = 0; i < ballTrail.length; i++) {
        const t = ballTrail[i];
        ctx.save();
        ctx.globalAlpha = 0.15 + 0.3 * (i / ballTrail.length);
        ctx.shadowColor = '#00c6ff';
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.arc(t.x, t.y, ballSize/2, 0, Math.PI*2);
        ctx.fillStyle = '#00c6ff';
        ctx.fill();
        ctx.restore();
    }
}

function drawPaddles() {
    if (theme === 'neon') {
        drawNeonPaddle(32, playerY);
        drawNeonPaddle(canvas.width-32-paddleWidth, aiY);
    } else if (theme === 'retro') {
        drawRetroPaddle(32, playerY);
        drawRetroPaddle(canvas.width-32-paddleWidth, aiY);
    } else if (theme === 'glass') {
        drawGlassPaddle(32, playerY);
        drawGlassPaddle(canvas.width-32-paddleWidth, aiY);
    } else if (theme === 'arena') {
        drawArenaPaddle(32, playerY);
        drawArenaPaddle(canvas.width-32-paddleWidth, aiY);
    }
}

function drawBackground() {
    if (theme === 'arena') {
        ctx.fillStyle = '#000000ff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.strokeStyle = '#ff00c8ff';
        ctx.lineWidth = 4;
        ctx.strokeRect(0, 0, canvas.width, canvas.height);
        ctx.setLineDash([16, 16]);
        ctx.beginPath();
        ctx.moveTo(canvas.width/2, 0);
        ctx.lineTo(canvas.width/2, canvas.height);
        ctx.stroke();
        ctx.setLineDash([]);
    } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
}

function drawAudience() {
    if (theme === 'arena') {
        audienceEl.className = 'arena';
        // Animate silhouettes (simple wave)
        audienceAnim += 0.05;
        audienceEl.style.backgroundPositionX = `${Math.sin(audienceAnim)*20}px`;
    } else {
        audienceEl.className = '';
        audienceEl.style.backgroundPositionX = '0px';
    }
}

function update() {
    // Ball movement
    ballX += ballVX;
    ballY += ballVY;
    if (theme === 'neon') {
        ballTrail.push({x: ballX+ballSize/2, y: ballY+ballSize/2});
        if (ballTrail.length > 12) ballTrail.shift();
    }
    if (theme === 'arena') {
        ballSpin += ballVX * 0.02;
        ballTrail.push({x: ballX+ballSize/2, y: ballY+ballSize/2});
        if (ballTrail.length > 12) ballTrail.shift();
    }

    if (theme === 'retro') {
        ballTrail.push({x: ballX+ballSize/2, y: ballY+ballSize/2});
        if (ballTrail.length > 12) ballTrail.shift();
    }

     if (theme === 'glass') {
        ballTrail.push({x: ballX+ballSize/2, y: ballY+ballSize/2});
        if (ballTrail.length > 12) ballTrail.shift();
    }

    // Paddle collision
    if (ballX < 32 + paddleWidth && ballY + ballSize > playerY && ballY < playerY + paddleHeight) {
        ballVX = Math.abs(ballVX);
        ballVY += (ballY + ballSize/2 - (playerY + paddleHeight/2)) * 0.1;
        playSound('blip');
    }
    if (ballX + ballSize > canvas.width - 32 - paddleWidth && ballY + ballSize > aiY && ballY < aiY + paddleHeight) {
        ballVX = -Math.abs(ballVX);
        ballVY += (ballY + ballSize/2 - (aiY + paddleHeight/2)) * 0.1;
        playSound('boop');
    }
    // Wall collision
    if (ballY < 0 || ballY + ballSize > canvas.height) {
        ballVY *= -1;
        playSound('blip');
    }
    // Score
    if (ballX < 0) {
        aiScore++;
        aiScoreEl.textContent = aiScore;
        playSound('boop');
        resetBall();
    }
    if (ballX + ballSize > canvas.width) {
        playerScore++;
        playerScoreEl.textContent = playerScore;
        playSound('blip');
        resetBall();
    }
    // AI movement
    let aiCenter = aiY + paddleHeight/2;
    if (aiCenter < ballY + ballSize/2 - 10) aiY += 6;
    else if (aiCenter > ballY + ballSize/2 + 10) aiY -= 6;
    aiY = Math.max(0, Math.min(canvas.height-paddleHeight, aiY));
}

function render() {
    drawBackground();
    drawPaddles();
    drawBall();
    drawAudience();
}

function gameLoop() {
    update();
    render();
    requestAnimationFrame(gameLoop);
}

canvas.addEventListener('mousemove', function(e) {
    const rect = canvas.getBoundingClientRect();
    playerY = e.clientY - rect.top - paddleHeight/2;
    playerY = Math.max(0, Math.min(canvas.height-paddleHeight, playerY));
});

themeSelector.addEventListener('change', function() {
    theme = themeSelector.value;
    document.body.className = theme;
    resetBall();
});

// Dynamic background elements
const bgGradient = document.getElementById('dynamic-bg-gradient');
const bgParticles = document.getElementById('dynamic-bg-particles');
const bgWaves = document.getElementById('dynamic-bg-waves');
const bgBlobs = document.getElementById('dynamic-bg-blobs');
const bgConfetti = document.getElementById('dynamic-bg-confetti');
const crtOverlay = document.getElementById('crt-overlay');

// Unlock audio after first user interaction
function unlockAudio() {
    blipSound.play().catch(()=>{});
    boopSound.play().catch(()=>{});
    window.removeEventListener('mousedown', unlockAudio);
    window.removeEventListener('keydown', unlockAudio);
}
window.addEventListener('mousedown', unlockAudio);
window.addEventListener('keydown', unlockAudio);

document.body.className = theme;
gameLoop();
