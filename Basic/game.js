const canvas = document.getElementById('pongCanvas');
const ctx = canvas.getContext('2d');

// Game constants
const PADDLE_WIDTH = 15;
const PADDLE_HEIGHT = 100;
const BALL_SIZE = 15;
const PADDLE_SPEED = 7;
const AI_SPEED = 4;

// Initial game state
let leftPaddleY = canvas.height / 2 - PADDLE_HEIGHT / 2;
let rightPaddleY = canvas.height / 2 - PADDLE_HEIGHT / 2;
let ballX = canvas.width / 2 - BALL_SIZE / 2;
let ballY = canvas.height / 2 - BALL_SIZE / 2;
let ballSpeedX = 5 * (Math.random() > 0.5 ? 1 : -1);
let ballSpeedY = 4 * (Math.random() > 0.5 ? 1 : -1);
let leftScore = 0;
let rightScore = 0;

// Mouse paddle control
canvas.addEventListener('mousemove', function(e) {
    // Get mouse Y relative to canvas
    const rect = canvas.getBoundingClientRect();
    let mouseY = e.clientY - rect.top;
    leftPaddleY = mouseY - PADDLE_HEIGHT / 2;

    // Prevent paddle from going out of bounds
    if (leftPaddleY < 0) leftPaddleY = 0;
    if (leftPaddleY > canvas.height - PADDLE_HEIGHT)
        leftPaddleY = canvas.height - PADDLE_HEIGHT;
});

// Game loop
function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

// Update game state
function update() {
    // Move ball
    ballX += ballSpeedX;
    ballY += ballSpeedY;

    // Ball collision with top/bottom walls
    if (ballY <= 0 || ballY + BALL_SIZE >= canvas.height) {
        ballSpeedY = -ballSpeedY;
        ballY = Math.max(0, Math.min(ballY, canvas.height - BALL_SIZE));
    }

    // Ball collision with left paddle
    if (
        ballX <= PADDLE_WIDTH &&
        ballY + BALL_SIZE > leftPaddleY &&
        ballY < leftPaddleY + PADDLE_HEIGHT
    ) {
        ballSpeedX = -ballSpeedX;
        // Add some randomness to ball Y speed
        ballSpeedY += (Math.random() - 0.5) * 2;
        ballX = PADDLE_WIDTH; // Prevent sticking
    }

    // Ball collision with right paddle (AI)
    if (
        ballX + BALL_SIZE >= canvas.width - PADDLE_WIDTH &&
        ballY + BALL_SIZE > rightPaddleY &&
        ballY < rightPaddleY + PADDLE_HEIGHT
    ) {
        ballSpeedX = -ballSpeedX;
        ballSpeedY += (Math.random() - 0.5) * 2;
        ballX = canvas.width - PADDLE_WIDTH - BALL_SIZE; // Prevent sticking
    }

    // Score update
    if (ballX < 0) {
        rightScore++;
        resetBall(-1);
    } else if (ballX + BALL_SIZE > canvas.width) {
        leftScore++;
        resetBall(1);
    }

    // AI Paddle movement (simple tracking)
    let aiTarget = ballY + BALL_SIZE / 2 - PADDLE_HEIGHT / 2;
    if (rightPaddleY < aiTarget) {
        rightPaddleY += AI_SPEED;
    } else if (rightPaddleY > aiTarget) {
        rightPaddleY -= AI_SPEED;
    }
    // Clamp AI paddle position
    rightPaddleY = Math.max(0, Math.min(rightPaddleY, canvas.height - PADDLE_HEIGHT));
}

// Draw everything
function draw() {
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw net
    ctx.fillStyle = "#888";
    for (let i = 0; i < canvas.height; i += 30) {
        ctx.fillRect(canvas.width / 2 - 2, i, 4, 20);
    }

    // Draw paddles
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, leftPaddleY, PADDLE_WIDTH, PADDLE_HEIGHT);
    ctx.fillRect(canvas.width - PADDLE_WIDTH, rightPaddleY, PADDLE_WIDTH, PADDLE_HEIGHT);

    // Draw ball
    ctx.fillStyle = "#f8cf00";
    ctx.fillRect(ballX, ballY, BALL_SIZE, BALL_SIZE);

    // Draw scores
    ctx.font = "40px Arial";
    ctx.fillStyle = "#fff";
    ctx.fillText(leftScore, canvas.width / 4, 50);
    ctx.fillText(rightScore, (canvas.width * 3) / 4, 50);
}

// Reset ball after scoring
function resetBall(direction) {
    ballX = canvas.width / 2 - BALL_SIZE / 2;
    ballY = canvas.height / 2 - BALL_SIZE / 2;
    ballSpeedX = 5 * direction;
    ballSpeedY = 4 * (Math.random() > 0.5 ? 1 : -1);
}

// Start the game
gameLoop();