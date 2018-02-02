newBoard();

/**
 * Build the game GUI
 * @returns {jQuery} Table containing 9x9 input matrix
 */
function buildGUI(ta) {
	var $td, $tr,
		$table = $( '<table>' )
			.addClass( 'sudoku-container' );
 
	// Go over rows
	for ( var i = 0; i < 9; i++ ) {
		$tr = $( '<tr>' );
		this.$cellMatrix[i] = {};
		// Go over columns
		for ( var j = 0; j < 9; j++ ) {
			// Build the input
			this.$cellMatrix[i][j] = $( '<input>' )
				.attr( 'maxlength', 1 )
				// Keep row/col data
				.data( 'row', i )
				.data( 'col', j )
				// Listen to keyup event
				.on( 'keyup', $.proxy( this.onKeyUp, this ) );
 
			$td = $( '<td>' ).append( this.$cellMatrix[i][j] );
			// Calculate section ID
			sectIDi = Math.floor( i / 3 );
			sectIDj = Math.floor( j / 3 );
			// Set the design for different sections
			if ( ( sectIDi + sectIDj ) % 2 === 0 ) {
				$td.addClass( 'sudoku-section-one' );
			} else {
				$td.addClass( 'sudoku-section-two' );
			}
			// Build the row
			$tr.append( $td );
		}
		// Append to table
		$table.append( $tr );
	}
	// Return the GUI table
	return $table;
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
				} else {
					bl.style = 'color:black;';
					bl.readOnly = false;
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
	var bgColor;
	var i, i1,j,j1;
	
	for ( i = 0; i < n2; i++ ) {
		i1 = Math.floor(i/n); 
		s += "<tr>";
		for ( j = 0; j < n2; j++) {
			// color the blocks
			j1 = Math.floor(j/n);
			if( ( i1+j1)%2 == 0) {
				bgColor = 'style="background-color:white;"';
			}
			else {
				bgColor = 'style="background-color:LightGray;"';
			}
			s += "<td>";	
			s += "<input type='text' "+bgColor +"	size= '1' maxlength='1' onkeypress = 'thisSelect(this)' ";
			s +=  (" id= 'c"+i)+j+"'";
			s += "></input></td>";			
		}
		s += "</tr>";
	}
	b.innerHTML = s;
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
			if ( v == '' ){
				s += '.';
			} else {
				s += v;
			}
		}
		s += '\n';
	}
	f.value = s;
}

function thisSelect(t){
	t.select(1);  //selects the text, but it seems to set on exit
}
function thisChange(t){
	var j = t.value;  
}
