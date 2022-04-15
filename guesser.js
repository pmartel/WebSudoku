/* Copyright  2018 Philip O. Martel 
Released under the MIT License:
 Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software 
without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to 
permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF  MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE."'
*/

// a guess is an object with a row, column and value
// 5/18/18 let value be the array of possible values.  This lets us "cross them off"
// until there are none left
function Guess( row, col, val ) {
	this.row = row;
	this.column = col;
	this.value = val;
}

function GuessElement( board, guess ) {
	this.board = board;
	this.guess = guess;
}

function applyGuess(g) {
	var s, cell;
	
	reason( "guessing c" + g.row + g.column  +" is " + g.value );
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

function guesser() {
	var g, g1;
	var b, retVal;
	//console.log('guessing');
	generatePossibleCells();
	if( clearBoardUsed()){
		// filled
		return true;
	}
	b = storeBoard();
	g = listGuesses();

	// g has a position and an array of possible values
	// this loop runs through the array until the board is complete
	// or there is a conflict
	// if g is undefined, the board was bad.
	if ( g.value == undefined ) {
		reason( "This board  can't be solved.\nThere are no possible guesses.");
		setSolveBackground('red'); // bad
		return false;

	}
	while( g.value.length > 0 ) {
		g1 = new Guess(g.row, g.column, g.value.pop());
		applyGuess( g1 );
		if ( solveDeterministic()) {
			return true;
		}
		// are there and cells with no option?
		if ( noOptions() ) {
			reason( "bad guess: c"  + g1.row + g1.column + " is not " + g1.value );
			restoreBoard(b);  // backtrack this guess
		} 
		else {
			if( guesser()){
				return true; // solved
			}
			// make another guess
			reason( "bad guess: c"  + g1.row  + g1.column + " is not " + g1.value );
			restoreBoard(b);  // backtrack this guess
		}
	}
	return false;
}

function listGuesses() {
	var g = new Guess;
	var pB, r, c, n;
	
	// find (one of) the cell with the minimun number of possibilities
	n = boardSize+1;
	for ( r = 0; r<boardSize; r++) {
		for ( c = 0; c<boardSize; c++) {
			pB = possibleBoard[r][c];
			if ( pB.length != 0 && pB.length < n ){
				g.row= r; g.column = c;
				n = pB.length;
			}
		}
	}
	// it's possible that there will be no guess if the board is bad
	if ( g.column != undefined ) {
		g.value = possibleBoard[g.row][g.column];
	}
	return g;
}

//are there any cells that are empty, but have no options?
function noOptions() {
	var r, c, cell;
	
	generatePossibleCells();
	if( clearBoardUsed()) {
		// filled
		return false; // no empty cells
	}
	for ( r = 0; r < boardSize; r++ ) {
		for ( c = 0; c < boardSize; c++ ) {
			if ( possibleBoard[r][c].length == 0 ){
				cell = document.getElementById( ('c'+r)+c );
				if ( cell.value == " " || cell.value == "" ) {
					return true;
				}
			}
		}
	}
	return false;
}



function restoreBoard( b ) {
	var r, c;
	var cell;
	
	for ( r = 0; r < boardSize; r++ ) {
		for ( c = 0; c < boardSize; c++ ) {
			cell = document.getElementById( ('c'+r)+c );
			cell.value = b[r][c];
		}
	}
}

// copy the game cells into an array
function storeBoard(){
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
