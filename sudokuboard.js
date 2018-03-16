/**
 * 
 *
 */

 var aboutStr = '\n\
 HTML and Javascript Sudoku program\n\n\
 Copyright  2018 Philip O. Martel \n\
Released under the MIT License:\n\
 Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software \
without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit \ persons to whom the Software is furnished to do so, subject to the following conditions:\n\
\n\
The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.\n\
\n\
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF \ MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY \ CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE \ SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE."';

var boardSize, blockSize;

function about() {
	alert(aboutStr);
}

function loadBoard() {
	var	f = document.getElementById("fileBlock");
	var s = f.value;
	var row = 0, col = 0, i, c;
	var idStr;
	
	for( i = 0; i < s.length; i++ ) {
		c = s[i];
		switch ( c ) {
			case '\n':
				row++;
				col = 0;
				continue;
			case '.':
				c = '';
				// FALL=THROUGH
			default:
				idStr = ('c'+row)+col;
				var bl = document.getElementById(idStr);
				bl.value = c;
				// loaded numbers can not be changed in game
				if ( c.length > 0 ) { 
					bl.style = 'color:blue;';
					bl.readOnly = true;
					setAuxBoard(row,col, c, true);
				} else {
					bl.style = 'color:black;';
					bl.readOnly = false;
					setAuxBoard(row,col, c, false);
			}
				col++;
		}
	}
}


// n is the square root of the size of the sudoku
function newBoard( n = 3 ) {
	var n2 = n * n;
	var n4 = n2 * n2;
	
	var b = document.getElementById("board");
	var s = "";
	var bg;
	var i, i1,j,j1;
	
	blockSize = n;
	boardSize = n2;
	//globals.  Possibly we can store these in the board structure.
	b.blockSize = n;
	
	for ( i = 0; i < n2; i++ ) {
		i1 = Math.floor(i/n); 
		s += "<tr>";
		for ( j = 0; j < n2; j++) {
			// color the blocks
			j1 = Math.floor(j/n);
			if( ( i1+j1)%2 == 1) {
				bg = "class= 'odd-block'";
			}
			else {
				bg= "";
			}
			s += "<td>";	
			s += "<input type='text' "+bg +"	size= '1' maxlength='1' onkeypress = 'thisSet(this)' ";
			s +=  (" id= 'c"+i)+j+"'";
			s += "></input></td>";			
		}
		s += "</tr>";
	}
	b.innerHTML = s;
	newAuxBoard(n);
}

// Copy the data from the board to the File block
// this data may then be copied to a text file. 
function saveBoard() {
	var b = document.getElementById("board");
	var	f = document.getElementById("fileBlock");
	var r, c, cell, s, v;
	
// in the debugger b.firstChild seems to expose the table
// but it's not clear how to exploit it in code
	//	for ( r in b.firstChild ) {
	var rLen = b.firstChild.children.length;
	
	s ="";
	for ( r = 0; r<rLen; r++) {
		for ( c = 0; c<rLen; c++) { // use rLen for now
			cell = document.getElementById(('c'+r)+c);
			v = cell.value;
			if ( v == ''  || v == ' '){
				s += '.';
			} else {
				s += v;
			}
		}
		s += '\n';
	}
	f.value = s;
}

function thisSet(t){
	t.select(1);  //selects the text, but it seems to set the new value on exit
	var ch = document.getElementById("checkEntry");
	// event.key has the new key entry
	var key = event.key;

	// check that the key pressed is ok
	// note, we can vary legit with boardSize.  If we go to a 16x16 board,
	//  I'll use 0-9 and a-f as I saw in Honolulu to keep things to 1 character
	// the in operator doesn't seem to apply to enter or space
	var legit = ['1','2','3','4','5','6','7','8','9'];
	
	// if (key == "Enter") { // I can't modify the key, so punt and only use space to erase a cell
		// event.key = " ";
		// key = " ";
	// }
	if (key != " ") {
		if ( !(key in legit) ){
			event.returnValue = false; // this prevents the character from appearing 
			return;
		}
	}
	
	// t.value has the current value, but I can't seem to write to either.
	if( document.getElementById("checkEntry").checked ) {
		if ( checkEntry( t, key ) ){
			t.style = 'color:black;';
		} else  {
			t.style = 'color:red;';
		}
	} else {
		t.style = 'color:black;';
	}
	var rc = thisRC(t);
	setAuxBoard( rc.r, rc.c, key);
}
function thisChange(t){
	var j = t.value;  
}

function thisRC(t){
	var rc={}; // row, column structure
	rc.r = t.id[1]; // extract row and column from id
	rc.c = t.id[2];
	return rc;
}
	