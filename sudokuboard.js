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

function thisSelect(t){
	t.select(1);  //selects the text, but it seems to set on exit
}
