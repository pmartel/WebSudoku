/* Copyright  2018 Philip O. Martel 
Released under the MIT License:
 Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software 
without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to 
permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF  MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE."'
*/

/*
It's probably possible to use the table (id="board") directly,  For now set up a global auxiliary board.
*/
var auxBoard;

// I tried setting the auxBoard elements to this, but I need separate instances
//var boardObj = { value: undefined, readOnly: false, possible : [] };

function aboutCheckEntry() {
	alert("Checking this box checks if there are any conflicts with the digit entered, not whether the entry is correct");
}

function boardOk() {
	var r, c, cell, v

	for ( r = 0; r < boardSize; r++ ) {
		for ( c = 0; c < boardSize; c++ )  {
			cell = document.getElementById( ('c'+r)+c);
			v = cell.value;
			if (!( v == ''  || v == ' ')){ // not a blank
				if ( !checkBlock(cell, v) ) {
					cell.style = 'color:red;';
					return false;
				}
				if ( !checkCol(cell, v) ) {
					cell.style = 'color:red;';
					return false;
				}
				if ( !checkRow(cell, v) ) {
					cell.style = 'color:red;';
					return false;
				}
			}

		}
	}
	return true;
} // boardOk()

function checkBlock(t, key) {
	var rc, rcMin={}, r, c;
	var cell;
	
	rc = thisRC(t);
	rcMin.r = Math.floor( rc.r / blockSize) * blockSize;
	rcMin.c = Math.floor( rc.c / blockSize) * blockSize;
	for ( r = rcMin.r; r < rcMin.r + blockSize; r++ ){
		for ( c = rcMin.c; c < rcMin.c + blockSize; c++ ){
			if ( (c != rc.c) || (r != rc.r) ) {
				cell = document.getElementById( ('c'+r)+c);
				if ( cell.value == key ) {
					return false;
				}
			}
		}
	}
	return true;
} //checkBlock(t, key)

function checkCol(t, key) {
	var r;
	var rc = thisRC(t);
	var cell;
	
	for (r=0; r < boardSize;r++){
		if (r != rc.r ) {
			cell = document.getElementById( ('c'+r)+rc.c);
			if ( cell.value == key ) {
				return false;
			}
		}
	}
	return true;
} // checkCol(t, key) 

function checkEntry(t, key) {
	if (checkRow(t,key)) {
		if (checkCol(t,key)) {
			if (checkBlock(t,key)){
				return true;
			}
		}
	}
	return false;
} //checkEntry(t, key)

function checkRow(t, key) {
	var c;
	var rc = thisRC(t);
	var cell;
	
	for (c=0; c < boardSize;c++){
		if (c != rc.c ) {
			cell = document.getElementById( ('c'+rc.r)+c);
			if ( cell.value == key ) {
				return false;
			}
		}
	}
	return true;
} // checkRow(t, key)

// clear used or i values from possibleBoard
// returns true if board is full
function clearBoardUsed(b) {
	var r, c, val;
	var retVal = true;
	
	for ( r = 0; r < boardSize; r++ ) {
		for ( c = 0; c < boardSize; c++ ) {
			val = document.getElementById( ('c'+r)+c).value;
			if ( val.length > 0 ) {
				clearCellUsed( r, c, val );
			} else {
				retVal = false;
			}
		}
	}	
	return retVal;
} //clearBoardUsed(b) 

// the given cell has a (possibly new) value remove that value
// from the possible list of cells that are  blocked from having it
// cell has r and c implicitly, having the explicit values is a speedup
function clearCellUsed( row, col, val ) {
	var r, c; // row and column indices
	var rBlock = Math.floor(row/blockSize)*blockSize; 
	var cBlock = Math.floor(col/blockSize)*blockSize; 

	var  i;

	// a cell that is used has no more possible values
	possibleBoard[row][col] = [];
	//clear the row
	for ( c = 0; c < boardSize; c++) {
		if ( c != col ) {
			i = possibleBoard[row][c].indexOf(val);
			if ( i >= 0 ) {
				possibleBoard[row][c].splice(i,1); // remove v
			}
		}
	}
	//clear the column
	for ( r = 0; r < boardSize; r++) {
		if ( r != row ) {
			i = possibleBoard[r][col].indexOf(val);
			if ( i >= 0 ) {
				possibleBoard[r][col].splice(i,1); // remove v
			}
		}
	}
	// clear the box
	for(  r = rBlock; r < rBlock + blockSize; r++ ){
		if( r != row ){
			for(  c = cBlock; c < cBlock + blockSize; c++ ){
				if( c != col ){
					i = possibleBoard[r][c].indexOf(val);
					if ( i >= 0 ) {
						possibleBoard[r][c].splice(i,1); // remove v
					}
				}
			}
		}
	}
		
} //clearCellUsed( row, col, val )

// add/reset the property .possible on all cells  
var possibleBoard = [];

function generatePossibleCells() {
	var r,c, t;
	
	for ( r = boardSize-1; r >=0; r-- ) {
		possibleBoard[r] = [];
		for ( c = boardSize-1; c >=0; c-- ) {
//			possibleBoard[r][c] = Array(possibleArray);
// the above makes each entry in possible board an array of length 1 containing possibleArray
// as its only element.  Below makes each entry a copy of possibleArray
			t= [];
			possibleBoard[r][c] = t.concat(possibleArray);
		}
	}
} //generatePossibleCells()


var styleString = 'color:orange;'
// for each number, is there only one cell in a block with that possible number
function oneInBlock() {
	var retVal = false;
	var r, c, v, n, count, rIdx, cIdx ;
	var bl, rMin, cMin;
	
	//console.log('one-in-box');
	for ( n = 0; n < possibleArray.length; n++ ) {
		v = possibleArray[n];
		for ( bl= 0; bl < boardSize; bl++ ) {
			rMin = Math.floor( bl / blockSize) * blockSize;
			cMin = (bl % blockSize) * blockSize;
			count = 0;
			for ( r = rMin;  r < rMin + blockSize; r++ ) {
				for ( c = cMin;  c < cMin+blockSize; c++ ){
					if ( possibleBoard[r][c].indexOf( v ) >= 0 ) { // v is a possibility for this cell
						count++;
						if ( count > 1 ) {
							break;
						}
						rIdx = r;
						cIdx = c;
					} // if possibleboard
				} // for c
				if ( count > 1 ) { // extend break past for r
					break;
				}
				
			} // for r
			if ( count == 1 )  {
				document.getElementById(  ('c'+rIdx)+cIdx).value = possibleArray[n];
				//console.log( ('c'+rIdx)+cIdx + " "+ possibleArray[n]);
				document.getElementById(  ('c'+rIdx)+cIdx).style = styleString;
				retVal = true;
			}
		} // for bl
	} // for n
	return retVal;
} //oneInBlock()

// for each number, is there only one cell in a column with that possible number
function oneInColumn() {
	var retVal = false;
	var r, c, v, n, count, rIdx ;
	
	//console.log('one-in-column');
	for ( n = 0; n < possibleArray.length; n++ ) {
		v = possibleArray[n];
		for ( c = 0; c < boardSize; c++) {
			count=0;
			for ( r = 0; r < boardSize; r++ ) {
				if ( possibleBoard[r][c].indexOf( v ) >= 0 ) { // v is a possibility for this cell
					count++;
					if ( count > 1 ) {
						break;
					}
					rIdx = r;
				}
			}
			if ( count == 1 )  {
				document.getElementById(  ('c'+rIdx)+c).value = possibleArray[n];
				//console.log( ('c'+rIdx)+c + " "+ possibleArray[n]);
				document.getElementById(  ('c'+rIdx)+c).style = styleString;
				retVal = true;
			}
		}
	}
	return retVal;
} //oneInColumn()

// for each number, is there only one cell in a row with that possible number
function oneInRow() {
	var retVal = false;
	var r, c, v, n, count, cIdx ;
	
	//console.log('one-in-row');
	for ( n = 0; n < possibleArray.length; n++ ) {
		v = possibleArray[n];
		for ( r = 0; r < boardSize; r++) {
			count=0;
			for ( c = 0; c < boardSize; c++ ) {
				if ( possibleBoard[r][c].indexOf( v ) >= 0 ) { // v is a possibility for this cell
					count++;
					if ( count > 1 ) {
						break;
					}
					cIdx = c;
				}
			}
			if ( count == 1 )  {
				document.getElementById(  ('c'+r)+cIdx).value = possibleArray[n];
				//console.log( ('c'+r)+cIdx + " "+ possibleArray[n]);
				document.getElementById(  ('c'+r)+cIdx).style = styleString;
				retVal = true;
			}
		}
	}
	return retVal;
} // oneInRow()

// find and fill in any cells with only one possibility
function singleton() {
	var retVal = false;
	var r, c, v;
	
	//console.log('singletons');
	for ( r = 0; r < boardSize; r++) {
		for ( c = 0; c < boardSize; c++ ) {
			if ( possibleBoard[r][c].length == 1 ) {
				v = possibleBoard[r][c];
				//console.log( ('c'+r)+c + " "+v[0]);
				document.getElementById(  ('c'+r)+c).value = v[0];
				document.getElementById(  ('c'+r)+c).style = styleString;
				retVal = true;
			}
		}
	}
				
	return retVal;
} //singleton()

function solve() {
	var r, c, cell;
	
	 setSolveBackground('yellow'); // working
	 console.log('Solving puzzle');

	// check the board
	if (!boardOk()){
		alert( "This board is in a bad state and can't be solved.\nOne duplicate is marked in red");
		setSolveBackground('red'); // bad
		return;
	}
	console.log( 'deterministic');
	if ( !solveDeterministic() ) {
		console.log( 'not deterministic');
		guesser();
	}
	
} // solve()

function solveDeterministic() {
	var solved = false;

	while (true) {
		// generate possible numbers for each cell
		generatePossibleCells();
		if (clearBoardUsed() ) {
			setSolveBackground('lightgreen'); // ok
			return true; // exit if all filled
		}
		// fill in cells with only one possible value
		if ( singleton() ) {
			continue;
		}
		if ( oneInRow() ) {
			continue;
		}
		if ( oneInColumn() ){
			continue;
		}
		if ( oneInBlock() ) {
			continue;
		}
		//need to guess or no more guesses
		return false;
	}
	
	return false; // should never get here
}
