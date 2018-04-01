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

function boardOk( b ) {
	var r, c, cell, v
	var len = b.firstChild.children.length;

	for ( r = 0; r < len; r++ ) {
		for ( c = 0; c < len; c++ )  {
			cell = document.getElementById( ('c'+r)+c);
			v = cell.value;
			if (!( v == ''  || v == ' ')){ // not a blank
				if ( !checkBox(cell, v) ) {
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
}

function checkBox(t, key){
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
}

function checkCol(t, key){
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
}

function checkEntry(t, key){
	if (checkRow(t,key)) {
		if (checkCol(t,key)) {
			if (checkBox(t,key)){
				return true;
			}
		}
	}
	return false;
}

function checkRow(t, key){
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
}

function newAuxBoard( n = 3 ) {
	var n2 = n ** 2;
	var r, c;
	var temp=new Array(n2);
	
	for ( r = 0; r < n2; r++) {
		temp[r] = new Array(n2);
		for ( c = 0; c < n2; c++ ) {
			temp[r][c] = { value: undefined, readOnly: false, possible : [] };
		}
	}
	auxBoard = temp;
}

function setAuxBoard( r, c, v, ro = false ) {
	if ( v == '' || v == " " ) {
		v = undefined;
	}
	auxBoard[r][c].value = v;
	auxBoard[r][c].readOnly = ro;
	
}

function solve(){
	// read in board
	// update possible lists
	// fill in singletons
	
}

