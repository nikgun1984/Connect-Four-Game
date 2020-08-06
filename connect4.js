/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

const WIDTH = 7;
const HEIGHT = 6;

let currPlayer = 1; // active player: 1 or 2
let winner = false;
const board = []; // array of rows, each row is array of cells  (board[y][x])
/** makeBoard: create in-JS board structure:
 *    board = array of rows, each row is array of cells  (board[y][x])
 */
function makeBoard() {
  // set "board" to empty HEIGHT x WIDTH matrix array
  for(let i = 0;i<HEIGHT;i++){
    board.push([]);
    for(let j = 0;j<WIDTH;j++){
      board[i][j] = null;
    }
  }
  return board;
}

/** makeHtmlBoard: make HTML table and row of column tops. */

function makeHtmlBoard() {
  // get "htmlBoard" variable from the item in HTML w/ID of "board"
  const htmlBoard = document.querySelector("table#board");
  htmlBoard.setAttribute('id',"board");
  // get the top part of the grid slots in order to insert disks to the DOM
  const topSlot = document.createElement("tr");
  topSlot.setAttribute("id", "column-top");
  
  for (let x = 0; x < WIDTH; x++) {
    const headCell = document.createElement("td"),
          div4Disk = document.createElement('div');

    headCell.setAttribute("id", x);
    headCell.classList.add("top");
    headCell.appendChild(div4Disk);
    topSlot.append(headCell);
    headCell.addEventListener('mouseover', function(e){
      if(Array.from(div4Disk.classList).indexOf('hide')!==-1){
        div4Disk.classList.remove('hide');
      }

      div4Disk.classList.add('piece',`p${currPlayer}`);
    });
    headCell.addEventListener('mouseout', function(e){
      div4Disk.classList.remove('piece',`p${currPlayer}`);
    });
    topSlot.addEventListener("click", handleClick);
  }
  htmlBoard.append(topSlot);

  // add the rest cells of the table to the DOM
  for (let y = 0; y < HEIGHT; y++) {
    const row = document.createElement("tr");
    for (let x = 0; x < WIDTH; x++) {
      const cell = document.createElement("td");
      cell.setAttribute("id", `${y}-${x}`);
      row.append(cell);
    }
    htmlBoard.append(row);
  }
}

/** findSpotForCol: given column x, return top empty y (null if filled) */

function findSpotForCol(x) {
  for(let i=HEIGHT-1;i>=0;i--){
    if(!board[i][x]){
      return i;
    }
  }
  return null;
}

/** placeInTable: update DOM to place piece into HTML table of board */

function placeInTable(y, x) {
  // make a div and insert into correct table cell
  const disk = document.createElement('div');
  disk.classList.add('piece');
  currPlayer===1?disk.classList.add('p1'):disk.classList.add('p2');
  const td = document.querySelector(`[id='${y}-${x}']`);
  td.appendChild(disk); 
}

// /* Animation */

// function myAnimation(e){
//   let pos = 0;

//   const id = setInterval(frame,10);
//   function frame(){
//     if(pos == 560){
//       clearInterval(id);
//     } else {
//       pos += 10;
//       e.target.style.top = pos + "px";

//     }
//   }

// }

/** endGame: announce game end */

function endGame(msg) {
  const congrat = document.createElement('h1');
  congrat.classList.add('centered','header');
  const table = document.querySelector('#game');
  congrat.innerText = msg;
  table.appendChild(congrat);
  winner = true;
}

/** handleClick: handle click of column top to play piece */

function handleClick(evt) {
  // get x from ID of clicked cell
  let x;
  if(evt.target.id){
    x = +evt.target.id;
  } else {
    x = +evt.target.parentElement.id;
  }
  // get next spot in column (if none, ignore click)
  const y = findSpotForCol(x);
  if (y === null) {
    return;
  }
  // place piece in board and add to HTML table
  // add line to update in-memory board
  board[y][x] = currPlayer; 
  if(!winner){
    placeInTable(y, x);
    // check for win
    if (checkForWin()) {
      endGame(`Player ${currPlayer} won!`);
    }
    // check for tie
    if(board.every(arr=>arr.every(Number))){
      endGame(`You got Tie!!!`);
    }
    // switch currPlayer 1 <-> 2
    evt.target.classList.remove(`p${currPlayer}`);
    if(evt.target.tagName==='DIV'){
      evt.target.classList.add('hide');
    }
    currPlayer = currPlayer===1?2:1;
  }
}

/** checkForWin: check board cell-by-cell for "does a win start here?" */

function checkForWin() {
  function _win(cells) {
    // Check four cells to see if they're all color of current player
    //  - cells: list of four (y, x) cells
    //  - returns true if all are legal coordinates & all match currPlayer

    return cells.every(
      ([y, x]) =>
        y >= 0 &&
        y < HEIGHT &&
        x >= 0 &&
        x < WIDTH &&
        board[y][x] === currPlayer
    );
  }

  // Checking for 4 cells in dif positions horizontal/vertical/diagonal left or 
  // diagonal right are same

  for (let y = 0; y < HEIGHT; y++) {
    for (let x = 0; x < WIDTH; x++) {
      const horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
      const vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
      const diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];
      const diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];

      if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
        return true;
      }
    }
  }
}

makeBoard();
makeHtmlBoard();
