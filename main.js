// Setup canvas
const canvas = document.querySelector('canvas');
// CanvasRenderContext2D
const ctx = canvas.getContext('2d');

// Set height and with of canvas and initialize variables to current window
// values
let height = canvas.height = window.innerHeight;
let width = canvas.width = window.innerWidth;

// Reassign variables and canvas size with changes in viewport size
visualViewport.onresize = function () {
    height = canvas.height = window.innerHeight;
    width = canvas.width = window.innerWidth;
};


// Reference to the html class count-number for ball count
const countNumber = document.querySelector('.count-number');


// Function to generate random number between two values
function random(min, max) {
  const num = Math.floor(Math.random() * (max - min + 1)) + min;
  return num;
}

// Function to generate random color
function randomRGB() {
  return `rgb(${ random(0, 255) },${ random(0, 255) },${ random(0, 255) })`;
}


// Generic shape object for balls and Chomp-Ball circle
class Circle {

    x;
    y;
    velX;
    velY;
    color;
    size;

    constructor(x, y, velX, velY, color, size) {
        this.x = x;
        this.y = y;
        this.velX = velX;
        this.velY = velY;
        this.color = color;
        this.size = size;
    }

}


// Object to represent a ball
class Ball extends Circle {

    exists = true;

    constructor(x, y, velX, velY, color, size) {
        super(x, y, velX, velY, color, size);

        this.exists;
    }

    // Drawing the ball
    draw() {
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
        ctx.fill();
    }

    // Moving the ball and bouncing ball off borders of canvas
    update() {
        if ((this.x + this.size) >= width) {
            this.velX = -(this.velX);
        }

        if ((this.x - this.size) <= 0) {
            this.velX = -(this.velX);
        }

        
        if ((this.y + this.size) >= height) {
            this.velY = -(this.velY);
        }

        if ((this.y - this.size) <= 0) {
            this.velY = -(this.velY);
        }

        this.x += this.velX;
        this.y += this.velY;
    }

    // Collision detection
    collisionDetect() {
        for (const ball of balls) {
            // Check to make sure that current ball being looped through is not
            // the same ball as the one being checked
            // Code only runs if not the same and if the ball exists
            if (!(this === ball) && ball.exists) {
                // Distance (hypotenuse of a right triangle) is equal to the
                // square root of the squared x and y distances (legs) added
                // togther; Pythagorean Theorem c = √(x^2 + y^2)
                const dx = this.x - ball.x;
                const dy = this.y - ball.y;
                const distance = Math.sqrt(dx ** 2  + dy ** 2);

                // If balls collide (whether any of the two circles'
                // areas overlap), assign both the same new random color
                if (distance < this.size + ball.size) {
                    ball.color = this.color = randomRGB();
                }
            }
        }
    }

}


// Object to represent Chomp-Ball
class ChompBall extends Circle {
    
    // Boolean for open or closed mouth; chomp
    chomp = false;
    // For chomping animation delay
    chompCount = 0;
    // Start and end angles for Chomp-Ball draw
    // Initial values place Chomp-Ball facing right
    start = 0.2 * Math.PI;
    end = 1.8 * Math.PI;

    // Set Chomp-Ball color and size to yellow and 20
    constructor(x, y) {
        super(x, y, 20, 20, "#FFFF00", 20);

        this.chomp;
        this.chompCount;
        this.start;
        this.end;

        // Set Vim movement keys to up, down, left, and right movement of
        // Chomp-Ball
        // Store orientation for Chomp-Ball draw
        window.addEventListener("keydown", (e) => {
            switch(e.key) {
                case "k":
                    this.y -= this.velY;
                    this.start = 1.7 * Math.PI;
                    this.end = 1.3 * Math.PI;
                    break;
                case "j":
                    this.y += this.velY;
                    this.start = 0.7 * Math.PI;
                    this.end = 0.3 * Math.PI;
                    break;
                case "h":
                    this.x -= this.velX;
                    this.start = 1.2 * Math.PI;
                    this.end = 0.8 * Math.PI;
                    break;
                case "l":
                    this.x += this.velX;
                    this.start = 0.2 * Math.PI;
                    this.end = 1.8 * Math.PI;
                    break;
            }
        });
    }


    // Draw Chomp-Ball
    draw() {
        // Alternate full circle and a circle with a pie piece shape missing
        // to emulate chomping
        // Set chmomp boolean opposite and chompCount 0 after a predetermined
        // number of animation frames for a longer delay between frames 
        if (this.chompCount < 10) {
            this.chompCount += 1;
        } else {
            this.chomp = !this.chomp;
            this.chompCount = 0;
        }

        // Check wether chomp boolean is true for frame shape
        if (!this.chomp) {
            ctx.beginPath();
            ctx.fillStyle = this.color;
            // moveTo draws lines from arc to center of circle to create wedge
            // cut-out
            ctx.moveTo(this.x, this.y)
            // ctx.arc start and end angle argument inputs are in radians
            // π rad = 180 degrees ( a half circle )
            // Moving up: start === 1.7 * Math.PI, end === 1.3 * Math.PI
            // Moving down: start === 0.7 * Math.PI, end === 0.3 * Math.PI
            // Moving left: start === 1.2 * Math.PI, end === 0.8 * Math.PI
            // Moving right: start === 0.2 * Math.PI, end === 1.8 * Math.PI
            ctx.arc(this.x, this.y, this.size, this.start, this.end);
            ctx.closePath();
            ctx.fill();
        } else {
            // No moveTo, full circle in radians
            ctx.beginPath();
            ctx.fillStyle = this.color;
            ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
            ctx.closePath();
            ctx.fill();
        }
    }

    // Check to see whether Chomp-Ball is going to go off the edge of the screen
    checkBounds() {
        if ((this.x + this.size) >= width) {
            this.x = this.x - this.size;
        }

        if ((this.x - this.size) <= 0) {
            this.x = this.x + this.size;
        }

        
        if ((this.y + this.size) >= height) {
            this.y = this.y - this.size;
        }

        if ((this.y - this.size) <= 0) {
            this.y = this.y + this.size;
        }
    }

    // Collision detection
    collisionDetect() {
        for (const ball of balls) {
            // Code only runs if the collided ball still exists
            if (ball.exists) {
                // Distance (hypotenuse of a right triangle) is equal to the
                // square root of the squared x and y distances (legs) added
                // togther; Pythagorean Theorem c = √(x^2 + y^2)
                const dx = this.x - ball.x;
                const dy = this.y - ball.y;
                const distance = Math.sqrt(dx ** 2  + dy ** 2);

                // If balls collide (whether any of the two circles'
                // areas overlap), ball is "eaten" and no longer exists
                if (distance < this.size + ball.size) {
                    ball.exists = false;
                }
            }
        }
    }
}


// Animation loop
function loop() {
    // Canvas (Play area)
    ctx.fillStyle = "rgba(0, 0, 0, 0.25)";
    ctx.fillRect(0, 0, width, height);


    // Count of "eaten" balls
    let chomped = 0;

    // Draw and count "eaten" balls
    for (const ball of balls) {
        if (ball.exists) {
            ball.draw();
            ball.update();
            ball.collisionDetect(balls);
        } else {
            chomped += 1;
        }
    }

    // Update balls left count
    const ballsLeftCount = balls.length - chomped;
    // No ball count update if game was quit
    if (!quit) {
        countNumber.textContent = `${ ballsLeftCount }`;
    }

    // If all balls are eaten (chomped), alert "Well chomped!" and restart game
    if ((chomped === balls.length) && (balls.length !== 0)) {
        // Cancel animation refresh callback request
        window.cancelAnimationFrame(requestID);
        alert("Well chomped! Press ok to play again.");
        return restart();
    }


    // Chomp-Ball
    chompBall.draw();
    chompBall.checkBounds();
    chompBall.collisionDetect();

    // Recursively continue animation loop
    requestID = window.requestAnimationFrame(loop);
}


// Create balls of number n array of ball instances
function createBalls(numBalls) {
    const balls =[];

    while (balls.length < numBalls) {
        const size = random(5, 20);
        const ball = new Ball(
            // Ball Position always draw at least one ball width away from the edge
            // of the canvas, to avoid drawing errors
            random(0 + size, width - size),
            random(0 + size, height - size),
            random(-7, 7),
            random(-7, 7),
            randomRGB(),
            size
        );
        balls.push(ball);
    }

    return balls;
}


// For press ( r ) restart and restart when chomped === balls.length
function restart() {
    // Logic to reset chompBall state:
    chompBall.end = 1.8 * Math.PI;
    chompBall.start = 0.2 * Math.PI;
    chompBall.x = width / 2;
    chompBall.y = height / 2;
    numBalls = 0;
    paused = false;
    quit = false;
    return main();
}


// Set p button to pause game
// Start or stop animation depending on state of "pause"
window.addEventListener("keydown", (e) => {
    // If not already paused or game was quit
    if ((e.key === "p") && !paused && !quit) {
        paused = true;
        window.cancelAnimationFrame(requestID);
    } else if ((e.key === "p") && paused) {
        paused = false;
        requestID = window.requestAnimationFrame(loop);
    }
});

// Set q button to quit game
window.addEventListener("keydown", (e) => {
    if (e.key === "q") {
        window.cancelAnimationFrame(requestID);
        ctx.fillStyle = "rgba(0, 0, 0, 1)";
        ctx.fillRect(0, 0, width, height);
        balls = [];
        quit = true;
        countNumber.textContent =
            "Game was quit, press r to restart or reload the page.";
    }
});

// Set r button to restart game
window.addEventListener("keydown", (e) => {
    if (e.key === "r") {
        window.cancelAnimationFrame(requestID);
        let answer = confirm("Are you sure you want to restart?");
        if (answer === false) {
            // Return to game without restart
            requestID = window.requestAnimationFrame(loop); 
        } else { 
            return restart();
        }
    }
});


// Main program
function main() {
    // Gather number of balls for new game from player
    while (isNaN(numBalls) || numBalls === 0) {
        numBalls =
            Number(prompt("Please enter a number of balls for your game, 1-100.", "20"));
    }
    // Too busy on screen if > 100
    if (numBalls > 100) { numBalls = 100; }
    
    // Instantiate balls and store in balls array for function loop
    balls = createBalls(numBalls);

    // Start animation
    return requestID = window.requestAnimationFrame(loop);
}


// Instantiate Chomp-Ball instance set to start at center of the canvas
const chompBall = new ChompBall((width / 2), (height / 2));

// Declare variables for:
// global balls array for ball instances,
// number of balls per game,
// paused boolean,
// game quit boolean,
// and capture requestAnimationFrame() return value (the request id) of the
// entry in the callback list to later pass into window.cancelAnimationFrame()
// and stop animation
let balls, numBalls, paused, quit, requestID;

// Start Chomp-Ball
main();

