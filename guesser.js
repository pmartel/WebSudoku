/* Copyright  2018 Philip O. Martel 
Released under the MIT License:
 Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software 
without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to 
permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF  MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE."'
*/

// a guess is an object with a row, column and value
function Guess( row, col, val ) {
	this.row = row;
	this.column = col;
	this.value = val;
}

function GuessElement( board, guess ) {
	this.board = board;
	this.guess = guess;
}


// the guessStack has a boardArray and a guess 
var guessStack = [];

function applyGuess(g) {
	var s, cell;
	
	s =( 'c' + g.row)+g.column;
	cell = document.getElementById(s);
	cell.value = g.value;	
	cell.style = styleString;
}

// set up a blank boardSize x boardSize array
function blankBoard(){
	var n;
	var b = new Array(boardSize);
	for ( n = 0; n < boardSize; n++ ) {
		b[n] = new Array(boardSize);
	}
	return b;
}

// copy the game cells into an array
function copyBoard(){
	var r, c, cell;
	var b = blankBoard();

	for ( r = 0; r<boardSize; r++) {
		for ( c = 0; c<boardSize; c++) { 
	
			cell = document.getElementById(('c'+r)+c);
			b[r][c] = cell.value;
		}
	}
	
	return b;
}

function guesser() {
	var g;
	
	console.log('guessing');
	generatePossibleCells();
	if( clearBoardUsed()){
		// filled
		return;
	}
	g = makeGuess();
	pushGame(g);
	
}

function makeGuess() {
	var g = new Guess;
	var pB, r, c, n;
	
	// find (one of) the cell with the minimun number of possibilities
	n = 9;
	for ( r = 0; r<boardSize; r++) {
		for ( c = 0; c<boardSize; c++) {
			pB = possibleBoard[r][c];
			if ( pB.length != 0 && pB.length < n ){
				g.row= r; g.column = c;
				n = pB.length;
			}
		}
	}
	g.value = possibleBoard[g.row][g.column][0];
	return g;
}

function pushGame(g) {
	// save current game and new guess
	var ge = new GuessElement(copyBoard(), g);
	guessStack.push( ge );
	applyGuess( g );
}

