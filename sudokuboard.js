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

// n is the square root of the size of the sudoku
function newBoard( n = 3 ) {
	var n2 = n * n;
	var n4 = n2 * n2;
	
	var b = document.getElementById("board");
	var s = "";
	var bgColor = 'white';
	var i, i1,j,j1;
	
	for ( i = 0; i < n2; i++ ) {
		i1 = Math.floor(i/n);
		s += "<tr>";
		for ( j = 0; j < n2; j++) {
			j1 = Math.floor(j/n);
			if( ( i1+j1)%2 == 0) {
				bgColor = 'style="background-color:white;"';
			}
			else {
				bgColor = 'style="background-color:LightGray;"';
			}
			s += "<td>";	
			s += "<input type='text'"+bgColor +" 	size= '1' maxlength='1' onkeypress = 'thisSelect(this)' ></input>"
			s += "</td>";			
		}
		s += "</tr>";
	}
	b.innerHTML = s;
}

function thisSelect(t){
	t.select(1);  //selects the text, but it seems to set on exit
}
function thisChange(t){
	var j = t.value;  
}
