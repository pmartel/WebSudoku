/* Copyright  2018 Philip O. Martel 
Released under the MIT License:
 Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software 
without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to 
permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF  MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE."'
*/

// a guess is an object with a row, column and value
var guess = {b:undefined, r:undefined, c:undefined, v:undefined};

// the guessStack has a boardArray and a guess 
var guessStack = [];

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
	var g = {r:undefined, c:undefined, v:undefined};
	var pB, r, c, n;
	
	// find (one of) the cell with the minimun number of possibilities
	n = 9;
	for ( r = 0; r<boardSize; r++) {
		for ( c = 0; c<boardSize; c++) {
			pB = possibleBoard[r][c];
			if ( pB.length != 0 && pB.length < n ){
				g.r = r; g.c = c;
				n = pB.length;
			}
		}
	}
	g.v = possibleBoard[g.r][g.c][0];
	return g;
}

function pushGame(g) {
	var b = copyBoard();
	
}

