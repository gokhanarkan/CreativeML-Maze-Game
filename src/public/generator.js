let cols, rows;
let w = 20;
let grid = [];
let available = [];
let current;
let cursorX = 0;
let cursorY = 0;
let selected;
let sets = [];
let wallsRemoved = 0;
let socket;

/* Setting up the canvas
 * including receiving data from Wekinator and sending it to relevant functions
 * Check @func sendMovement() for furher information
*/

function setup() {

  socket = io.connect(window.location.origin)
  createCanvas(300, 300);
  cols = floor(width/w);
  rows = floor(height/w);

  for (let j = 0; j < rows; j++) {
    for (let i = 0; i < cols; i++) {
      let cell = new Cell(i, j);
      grid.push(cell);
      sets.push([cell.id])
    }
  }
  available = grid;
  current = grid[int(random(0,(rows*cols)))];

  socket.on('outputData',
    function (data) {

      movement = data.args[0].value;
      sendMovement(movement);

    }
  );
}

// Resetting the board

function reset() {
  grid = [];
  cursorX = 0;
  cursorY = 0;
  sets = [];
  wallsRemoved = 0;
  for (let j = 0; j < rows; j++) {
    for (let i = 0; i < cols; i++) {
      let cell = new Cell(i, j);
      grid.push(cell);
      sets.push([cell.id])
    }
  }
  available = grid;
  current = grid[int(random(0,(rows*cols)))];
}

// Draw Function
function draw() {
  
  background(73, 59, 59);
  
  for (let i = 0; i < grid.length; i++) {
    grid[i].show();
  }
  
  if (wallsRemoved < cols*rows - 1) {
    if (!current.isFinished) {
      current.highlight();
      // CHOOSE RANDOM NEIGHBOR
      let neighbor = current.randomNeighbor();
      let mergedSet, removedSet, removedIndex;
      if (neighbor) {
        // FIND THE SETS THAT CURRENT AND NEIGHBOR ARE IN
        for (let i = 0; i < sets.length; i++) {
         if (sets[i].includes(current.id)) {
          mergedSet = sets[i];
         }
         else if (sets[i].includes(neighbor.id)) {
          removedSet = sets[i];
          removedIndex = i;
         }
        }
        // ADD NEIGHBOR TO CURRENT SET (UNION THE CELLS) AND DELETE NEIGHBOR'S SET
        if(removedSet !== undefined) {
          for (let i = 0; i < removedSet.length; i++) {
            mergedSet.push(removedSet[i]);
          }
          sets.splice(removedIndex,1);
          // REMOVE WALLS FROM BETWEEN CURRENT AND NEIGHBOR
          removeWalls(current, neighbor);
        }
      } else if (sets.length > 1) {
        current.isFinished = true;
        available = available.filter(cell => cell.id !== current.id);
      }
    }
    // GET NEW CURRENT (RANDOM)
    current = available[int(random(0,available.length))];
  
  } else {
    
    selected = grid.filter(cell => (cell.i === cursorX && cell.j === cursorY))[0];
    selected.highlight();
    grid[grid.length-1].highlight(true);
    
    if(grid[grid.length-1].id === selected.id) reset();

  }
  
}

/* 
 * This is for debugging purposes only
 * @param key is key is pressed on the keyboard
*/
function keyPressed() {
  sendMovement(key);
}

/*
 * This function either gets the data from Wekinator or from the keyboard
 * @param key might represent either a letter on the keyboard or Wekinator input
*/

function sendMovement(key){

  if (((key == 'W' || key == "w") || key == 2) && cursorY > 0) {
    if (!selected.walls[0]) {
      cursorY--;
    }
  } else if (((key == 'A' || key == "a") || key == 4) && cursorX > 0) {
    if (!selected.walls[3]) {
      cursorX--;
    }
  } else if (((key == 'S' || key == 's') || key == 3) && cursorY < rows-1) {
    if (!selected.walls[2]) {
      cursorY++;
    }
  } else if (((key == 'D' || key == 'd') || key == 1) && cursorX < cols-1) {
    if (!selected.walls[1]) {
      cursorX++;
    }
  } else if (key == 'R' || key =='r') {
    cursorX = 0;
    cursorY = 0;
  }
}

function index(i, j) {
  
  if (i < 0 || j < 0 || i > cols-1 || j > rows-1) {
    return -1;
  }
  return i + j * cols;
}


function removeWalls(a, b) {
 
  let x = a.i - b.i;
  if (x === 1) {
    a.walls[3] = false;
    b.walls[1] = false;
  } else if (x === -1) {
    a.walls[1] = false;
    b.walls[3] = false;
  }
  let y = a.j - b.j;
  if (y === 1) {
    a.walls[0] = false;
    b.walls[2] = false;
  } else if (y === -1) {
    a.walls[2] = false;
    b.walls[0] = false;
  }
  wallsRemoved++;
}

// initial game is forked by here: https://www.openprocessing.org/sketch/781600/
// thanks stranger for the contribution