canvas = document.getElementById("canvas")
ctx = canvas.getContext('2d')

var sw = screen.width;
var sh = screen.height;

var fish = [[250, 250, 10, 1, 1]]; //x, y, size, diry, dirx
var maxSize = 50;
var mx;
var my;

canvas.addEventListener("mousemove", function(e){
    //Mouse x and y
    my = e.offsetY;
    mx = e.offsetX;
});

document.body.onkeydown = function(e) { //checks for pressed keys
    switch(e.keyCode) {
        case 65: // A
            player.keys[0] = true; 
            break;
        case 68: // D 
            player.keys[1] = true;
            break;
        case 87: // W 
            player.keys[2] = true;
            break;
        case 83: // S 
            player.keys[3] = true;
            break;
        case 32: // Space
            player.kill();
            break;
    }
}

document.body.onkeyup = function(e) { //checks for pressed keys
    switch(e.keyCode) {
        case 65: // A
            player.keys[0] = false; 
            break;
        case 68: // D 
            player.keys[1] = false;
            break;
        case 87: // W 
            player.keys[2] = false;
            break;
        case 83: // S 
            player.keys[3] = false;
            break;
    }
}

var difficultyID = {
    easier: 100,
    easy: 10,
    normal: 5,
    hard: 2,
    expert: 1,
    expertplus: 0.5, //might be impossible
    impossible: 0.25, //might be impossible
    impossibler: 0.01
}

var gamemodes = {
    sizemod: false, // When eating enemies, increases size by their size
    halfdamage: false, // When getting hit, you lose only half points *TRASH*
    mousefollow: true, // Square follows mouse. Intended gameplay.
    difficulty: difficultyID.normal, // formula: 1 to 50 size for alls squares, plus POINTS divided by DIFFICULTY (increases size the smaller the number is.)
    nocolor: false, //does not tell you what you can eat
    mod: {
        sizemod() {
            if (gamemodes.sizemod) {
                gamemodes.sizemod = false;
                document.getElementById("sizemod").innerHTML = "Off";
            } else {
                gamemodes.sizemod = true;
                document.getElementById("sizemod").innerHTML = "On"
            }
        },
        nocolor() {
            if (gamemodes.nocolor) {  
                gamemodes.nocolor = false;
                document.getElementById("colormod").innerHTML = "Off";
            } else {
                gamemodes.nocolor = true;
                document.getElementById("colormod").innerHTML = "On";
            }
        }
    }
}

var player = {  
    x: 250,
    y: 250,
    size: 10,
    w: 10,
    h: 10,
    s: 3,
    points: 0,
    keys: [false, false, false, false],
    draw() {    
        ctx.fillStyle = "blue";
        ctx.fillRect(this.x, this.y, this.w, this.h);
    },
    kill() {
        player.points = 0;
        player.size = 10;
        timestart = Date.now();
        // player.x = 250;
        // player.x = 250;
    },
    update() {
        player.draw();
        if (gamemodes.mousefollow == false) {
            if (this.keys[0]) {
                this.x -= this.s;
            } 
            else if (this.keys[1]) {
                this.x += this.s;
            } 
            if (this.keys[2]) {
                this.y -= this.s;
            } 
            else if (this.keys[3]) {
                this.y += this.s;
            }
        } else {
            this.x = mx;
            this.y = my;
        }
        this.size = 10 + this.points;
        this.w = this.size;
        this.h = this.size;
    }
}

var rand = function(n) { //A random number
    return Math.floor(Math.random() * n + 1)
}

var rand2 = function() { //A random number with specifics
    val = rand(5) - 4;
    return rand(5) - 4;
}

var RRcollide = function(x1, x2, y1, y2, w1, w2, h1, h2){ //rect-rect colliding
    if (x1 + w1>= x2 && x1<= x2 + w2 && y1 + h1>= y2 && y1<= y2 + h2
    ) {
        return true;
    }
}

timestart = Date.now();

var timer = function() {
    time = Date.now();
    timeshown = time - timestart;

    minutes = Math.floor(timeshown / 60000)

    seconds = timeshown - minutes * 60000
    seconds = Math.floor(seconds * 10) / 10000
    seconds = Math.floor(seconds * 10) / 10
    seconds = Math.floor(seconds) // comment out for decimal

    // document.getElementById("timer").innerHTML = "Time: " + (Math.floor(timeshown / 100) /10);
    
    if (player.points < canvas.width) { // You win when you fill up the screen, stop timer

        if (seconds < 10) {
            document.getElementById("timer").innerHTML = "Time: " + minutes + ":0" + seconds
        } else {
            document.getElementById("timer").innerHTML = "Time: " + minutes + ":" + seconds
        }
    }

    window.requestAnimationFrame(timer);
}

var update = function() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    player.update();

    document.getElementById("points").innerHTML = "Points: " + player.points;

    for (let i = 0; i < fish.length; i++) {
        if (fish[i][3] == 0 && fish[i][4] == 0) {
            fish[i][3] = 1;
            fish[i][4] = 1;
        }
        fish[i][0] += fish[i][3];
        fish[i][1] += fish[i][4];
        if (RRcollide(fish[i][0], player.x, fish[i][1], player.y, fish[i][2], player.w, fish[i][2], player.h)) {
            
            if (fish[i][2] < player.size) {
                
                if (gamemodes.sizemod) {
                    player.points += fish[i][2];
                } else {
                    player.points++;
                }

                fish[i][0] = 0;
                fish[i][1] = 0;
                fish[i][2] = 0;
                fish[i][3] = 0;
                fish[i][4] = 0;

            } else {
                if (gamemodes.halfdamage == false) {
                    player.kill()
                } else {
                    player.points /= 2;
                }
            }
        }
        if (gamemodes.nocolor) {
            ctx.fillStyle = "gray";
        } else if (fish[i][2] >= player.size) {
            ctx.fillStyle = "red";
        } else {
            ctx.fillStyle = "green";
        }
        ctx.fillRect(fish[i][0], fish[i][1], fish[i][2], fish[i][2])
    }

    if (rand(100) > 90) { // 10 percent chance every frame to summon square
        num = rand(4);
        if (num == 1) {
            fish.push([rand(500), 0, rand(maxSize) + player.points / gamemodes.difficulty, rand2(), Math.abs(rand2())])
        }
        if (num == 2) {
            fish.push([rand(500), 500, rand(maxSize) + player.points / gamemodes.difficulty, rand2(), -Math.abs(rand2())])
        }
        if (num == 3) {
            fish.push([0, rand(500), rand(maxSize) + player.points / gamemodes.difficulty, Math.abs(rand2()), rand2()])
        }
        if (num == 4) {
            fish.push([500, rand(500), rand(maxSize) + player.points / gamemodes.difficulty, -Math.abs(rand2()), rand2()])
        }
    }

    window.requestAnimationFrame(update);
}

window.requestAnimationFrame(update);
window.requestAnimationFrame(timer);

// Things added:

// Buttons for mods
// Centered canvas, gave it border, and background color
// Changed font
// Player doesn't teleport for second when dead
// Now can press space to reset
// Added a timer
// You win when you are the canvas size


// To do:

// Add a widescreen mode
// Add a survival mode (survive as long as possble)
// Balance difficulties
// Add a way to change the speedrun points goal for when to pause the timer