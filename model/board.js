/**
 * Name			: board.js
 * Description	: Contains the Chessboard data
 */
 
// +Constants

//< Chess Pieces
pChessBoard.BLANK_SQUARE		= 0;
pChessBoard.WHITE_KING			= 1 << 0;
pChessBoard.WHITE_QUEEN			= 1 << 1;
pChessBoard.WHITE_ROOK			= 1 << 2;
pChessBoard.WHITE_KNIGHT		= 1 << 3;
pChessBoard.WHITE_BISHOP_LT		= 1 << 4;
pChessBoard.WHITE_BISHOP_DK		= 1 << 5;
pChessBoard.WHITE_PAWN			= 1 << 6;
pChessBoard.BLACK_KING			= 1 << 8;
pChessBoard.BLACK_QUEEN			= 1 << 9;
pChessBoard.BLACK_ROOK			= 1 << 10;
pChessBoard.BLACK_KNIGHT		= 1 << 11;
pChessBoard.BLACK_BISHOP_LT		= 1 << 12;
pChessBoard.BLACK_BISHOP_DK		= 1 << 13;
pChessBoard.BLACK_PAWN			= 1 << 14;

pChessBoard.COLOUR_NONE			= 0;
pChessBoard.COLOUR_WHITE		= pChessBoard.WHITE_KING 
									| pChessBoard.WHITE_QUEEN
									| pChessBoard.WHITE_ROOK
									| pChessBoard.WHITE_KNIGHT
									| pChessBoard.WHITE_BISHOP_LT
									| pChessBoard.WHITE_BISHOP_DK
									| pChessBoard.WHITE_PAWN;
pChessBoard.COLOUR_BLACK		= pChessBoard.BLACK_KING 
									| pChessBoard.BLACK_QUEEN
									| pChessBoard.BLACK_ROOK
									| pChessBoard.BLACK_KNIGHT
									| pChessBoard.BLACK_BISHOP_LT
									| pChessBoard.BLACK_BISHOP_DK
									| pChessBoard.BLACK_PAWN;

//< Board square notation
pChessBoard.BRD_NOTATION_RC		= 1;		//< board repersentation is row, col where row and col are both integers between 0 and 7
pChessBoard.BRD_NOTATION_CH		= 2;		//< Normal chess notation (a1 - h8)

// -Constants
 
/**
 * Defines the chess-board
 * 
 */
function pChessBoard()
{
	// +Declarations
	//< Board cells representated as int array (overkill, but will do for now
	this.boardCells		= null;

	//< Player whose move it is (Defaults to white)
	this.playerToMove	= pChessBoard.COLOUR_WHITE;

	// -Declarations

	// +Initializations
	//< Board cells representated as int array (overkill, but will do for now
	this.boardCells		= new Array(64);
	for(var i = 0; i < 64; i++)
	{
		this.boardCells[i] = 0;
	}

	// -Initializations
};


/**
 * Resets the chess-board to the starting position
 * 
 * white pieces are placed from a1 - h2
 * black pieces are placed from a7 - h8
 */
pChessBoard.prototype.resetBoard =
function()
{
	this.boardCells[0] = pChessBoard.WHITE_ROOK;
	this.boardCells[1] = pChessBoard.WHITE_KNIGHT;
	this.boardCells[2] = pChessBoard.WHITE_BISHOP_DK;
	this.boardCells[3] = pChessBoard.WHITE_QUEEN;
	this.boardCells[4] = pChessBoard.WHITE_KING;
	this.boardCells[5] = pChessBoard.WHITE_BISHOP_LT;
	this.boardCells[6] = pChessBoard.WHITE_KNIGHT;
	this.boardCells[7] = pChessBoard.WHITE_ROOK;

	this.boardCells[56] = pChessBoard.BLACK_ROOK;
	this.boardCells[57] = pChessBoard.BLACK_KNIGHT;
	this.boardCells[58] = pChessBoard.BLACK_BISHOP_DK;
	this.boardCells[59] = pChessBoard.BLACK_QUEEN;
	this.boardCells[60] = pChessBoard.BLACK_KING;
	this.boardCells[61] = pChessBoard.BLACK_BISHOP_LT;
	this.boardCells[62] = pChessBoard.BLACK_KNIGHT;
	this.boardCells[63] = pChessBoard.BLACK_ROOK;
	
	for(var i = 0; i < 8; i++)
	{
		this.boardCells[i + 8] = pChessBoard.WHITE_PAWN;
		this.boardCells[i + 48] = pChessBoard.BLACK_PAWN;
	}
}


/**
 * Gets the chess notation name for the specified rank,file numbers
 *
 * @param rank {Number} 0-7 rank number from white to black
 * @param file {Number} 0-7 file number from white's left to right
 * @return {String} The chess notation (a1 ... h8) for the square.
 */
pChessBoard.prototype.getSqNameFromRankFile = 
function (rank, file)
{
	pErrors.Assert(((rank < 8) && (file < 8) && (rank >= 0) && (file >= 0)), "Invalid squares!");
	return String.fromCharCode(file + 97) + "" + (rank+1);
};


/**
 * Gets the chess notation name for the specified index
 *
 * @param idx {Number} 0-63 index in the board array
 * @return {String} The chess notation (a1 ... h8) for the square.
 */
pChessBoard.prototype.getSqNameFromIdx = 
function (idx)
{
	pErrors.Assert(((idx < 64) && (idx >= 0)), "Invalid squares!");
	return String.fromCharCode((idx & 7) + 97) + "" + ((idx >> 3)+1);
};

/**
 * Gets the board index position of the piece
 *
 * @param piece {Number} the piece to search for
 * @return {Number} The board index position of the piece.
 */
pChessBoard.prototype.getPieceLocationIdx = 
function (piece)
{
	for(var i = 0; i < 64; i++)
	{
		if(this.boardCells[i] == piece)
			return i;
	}
	return -1;	// Piece is not on the board.
}

/**
 * Moves the piece from the source square to the destination square
 *
 * This doesn't care about the piece type or the validity of the move.
 * The validity checks are done elsewhere
 * @param srcSq {Number} The source square - index into the board array
 * @param destSq {Number} The destination square - index into the board array
 */
pChessBoard.prototype.movePiece = 
function (srcSq, destSq)
{
	pErrors.Assert(((srcSq < 64) && (destSq < 64)), "Invalid squares!");
	this.boardCells[destSq] = this.boardCells[srcSq];
	this.boardCells[srcSq] = 0;
};


/**
 * Returns the piece at the given board position
 *
 * @param srcSq {String} The source square
 * @param brdNotn {String} Defines the board notation type.
 *		
 * pChessBoard.BRD_NOTATION_RC - numbers denote squares - (00 = a1 to 77 = h8)
 * pChessBoard.BRD_NOTATION_CH - normal chess notation (a1 to h8)
 * 
 */
pChessBoard.prototype.getPieceAt = 
function (srcSq, brdNotn)
{
	var notn = ((brdNotn == null) || (brdNotn == undefined)) ? pChessBoard.BRD_NOTATION_CH : brdNotn;
	switch(notn)
	{
	case pChessBoard.BRD_NOTATION_CH:
		//var sqNum = (srcSq.charAt(0)
		var x = srcSq.charCodeAt(0) - 97;
		var y = srcSq.charCodeAt(1) - 49;
		var sqNum = (y * 8) + x
		return this.boardCells[sqNum];
		break;

	case pChessBoard.BRD_NOTATION_RC:
		//var sqNum = (srcSq.charAt(0)
		var x = srcSq.charCodeAt(0) - 49;
		var y = srcSq.charCodeAt(1) - 49;
		var sqNum = (y * 8) + x
		return this.boardCells[sqNum];
		break;
	}
	return 0;
};


/**
 * Sets the piece at the given board position
 *
 * @param destSq {String} The source square
 * @param piece {Number} The piece to move
 * @param brdNotn {String} Defines the board notation type.
 *		
 * pChessBoard.BRD_NOTATION_RC - numbers denote squares - (00 = a1 to 77 = h8)
 * pChessBoard.BRD_NOTATION_CH - normal chess notation (a1 to h8)
 * 
 */
pChessBoard.prototype.setPieceAt = 
function (destSq, piece, brdNotn)
{
	var notn = ((brdNotn == null) || (brdNotn == undefined)) ? pChessBoard.BRD_NOTATION_CH : pChessBoard.BRD_NOTATION_RC;
	switch(notn)
	{
	case pChessBoard.BRD_NOTATION_CH:
		//var sqNum = (destSq.charAt(0)
		var x = destSq.charCodeAt(0) - 97;
		var y = destSq.charCodeAt(1) - 49;
		var sqNum = (y * 8) + x
		this.boardCells[sqNum] = piece;
		break;

	case pChessBoard.BRD_NOTATION_RC:
		//var sqNum = (destSq.charAt(0)
		var x = destSq.charCodeAt(0) - 49;
		var y = destSq.charCodeAt(1) - 49;
		var sqNum = (y * 8) + x
		this.boardCells[sqNum] = piece;
		break;
	}
	return 0;
};

/**
 * Ends the turn.
 */
pChessBoard.prototype.endTurn = 
function ()
{
	this.playerToMove = this.playerToMove ^ pChessBoard.COLOUR_WHITE ^ pChessBoard.COLOUR_BLACK;
}

/**
 * Gets the colour of the piece specified.
 *
 * @return {pChessBoard} A copy of this board.
 *		
 */
pChessBoard.prototype.getPieceColour = 
function (piece)
{
	return (((piece & pChessBoard.COLOUR_WHITE) != 0) ? pChessBoard.COLOUR_WHITE : 
				(((piece & pChessBoard.COLOUR_BLACK) != 0) ? pChessBoard.COLOUR_BLACK : 
					pChessBoard.COLOUR_NONE));
}

/**
 * Makes a copy of this board.
 *
 * @return {pChessBoard} A copy of this board.
 *		
 */
pChessBoard.prototype.getCopy = 
function ()
{
	var newBrd = new pChessBoard();
	for(var i = 0; i < 64; i++)
	{
		newBrd.boardCells[i] = this.boardCells[i];
	}
	
	newBrd.playerToMove = this.playerToMove;
	
	return newBrd;
}

