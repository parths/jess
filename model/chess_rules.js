/**
 * Name			: chess_rules.js
 * Description	: Contains all implemented move validation routines
 */
 
/**
 * Validates the move mentioned.
 *
 * @param srcSq {Number} The source square - index into the board array
 * @param destSq {Number} The destination square - index into the board array
 * @param isThreat {bool} Specifies if we're checking for threat on the square (will be used to ignore own pieces on destination)
 * @return true if the move is valid, false otherwise.
 */
pChessBoard.prototype.isMoveValid = 
function (srcSq, destSq, isThreat)
{
	var isValid = this.isMoveLegal(srcSq, destSq, isThreat);
	
	// If the move is valid, make sure it doesn't lead to check
	if(isValid)
	{
		var newBrd = this.getCopy();
		newBrd.setPieceAt(destSq, newBrd.getPieceAt(srcSq));
		newBrd.setPieceAt(srcSq, 0);
		isValid = !newBrd.isInCheck();
	}
	
	return isValid;
}

/**
 * Validates the move mentioned
 *
 * @param srcSq {Number} The source square - index into the board array
 * @param destSq {Number} The destination square - index into the board array
 * @param isThreat {bool} Specifies if we're checking for threat on the square (will be used to ignore own pieces on destination)
 * @return true if the move is valid, false otherwise.
 */
pChessBoard.prototype.isMoveLegal = 
function (srcSq, destSq, isThreat)
{

	var srcPc = this.getPieceAt(srcSq);
	var destPc = this.getPieceAt(destSq);

	var isSrcWh = ((srcPc & 0xff) != 0);
	var isDestWh = ((destPc & 0xff) != 0);
	
	var bIsThreat = false;
	if((isThreat != null) && (typeof(isThreat) != 'undefined'))
	{
		bIsThreat = isThreat;
	} 

	// This is obvious.
	if(srcPc == 0)
	{
		return false;
	}
	
	// This too
	if(srcSq == destSq)
	{
		return false;
	}
	
	// Ensure destination is not the same colour as the source.
	if((isSrcWh == isDestWh) && (destPc != 0))
	{
		if(!bIsThreat)
			return false;
	}
	
	var isValid = true;
	
	switch(srcPc)
	{
	case pChessBoard.WHITE_PAWN:
	case pChessBoard.BLACK_PAWN:
		isValid = this.isValidPawnMove(srcPc, destPc, srcSq, destSq, bIsThreat);
		break;
	case pChessBoard.WHITE_BISHOP_LT:
	case pChessBoard.WHITE_BISHOP_DK:
	case pChessBoard.BLACK_BISHOP_LT:
	case pChessBoard.BLACK_BISHOP_DK:
		isValid = this.isValidBishopMove(srcPc, destPc, srcSq, destSq);
		break;
	case pChessBoard.WHITE_ROOK:
	case pChessBoard.BLACK_ROOK:
		isValid = this.isValidRookMove(srcPc, destPc, srcSq, destSq);
		break;
	case pChessBoard.WHITE_QUEEN:
	case pChessBoard.BLACK_QUEEN:
		isValid = this.isValidQueenMove(srcPc, destPc, srcSq, destSq);
		break;
	case pChessBoard.WHITE_KNIGHT:
	case pChessBoard.BLACK_KNIGHT:
		isValid = this.isValidKnightMove(srcPc, destPc, srcSq, destSq);
		break;
	case pChessBoard.WHITE_KING:
	case pChessBoard.BLACK_KING:
		isValid = this.isValidKingMove(srcPc, destPc, srcSq, destSq);
		break;
	}
	
	return isValid;
};


/**
 * Validates the pawn-move mentioned
 *
 * This function assumes that the basic checks (like blocked destination square) is already made.
 * Supports first move 1 or 2 squares, capture diagonal, en-passent.
 * @param srcPc {Number} The source piece 
 * @param destPc {Number} The destination piece - can be 0 if dest square is empty
 * @param srcSq {String} The source square - chess notation
 * @param destSq {String} The destination square - chess notation
 * @param isThreat {bool} Specifies if we're checking for threat on the square (will be used to ignore own pieces on destination)
 * @return true if the move is valid, false otherwise.
 */
pChessBoard.prototype.isValidPawnMove = 
function (srcPc, destPc, srcSq, destSq, isThreat)
{
	var bIsThreat = false;
	if((isThreat != null) && (typeof(isThreat) != 'undefined'))
	{
		bIsThreat = isThreat;
	} 

	var sx = srcSq.charCodeAt(0) - 97;
	var sy = srcSq.charCodeAt(1) - 49;
	var dx = destSq.charCodeAt(0) - 97;
	var dy = destSq.charCodeAt(1) - 49;
	var srcIdx = (sy * 8) + sx;
	var destIdx = (dy * 8) + dx;
	if(srcPc == pChessBoard.WHITE_PAWN)
	{
		if((srcIdx > 7) && (srcIdx < 16))	// First move
		{
			if(((destIdx == srcIdx+7)	||	// takes ahead - left
				(destIdx == srcIdx+9)) 		// takes ahead - right
				&& (Math.abs(dy-sy)==1))	// Cover for edges
			{
				return ((bIsThreat) || ((destPc > pChessBoard.BLACK_KING) && (destPc <= pChessBoard.BLACK_PAWN)));
			}
			else if (destIdx == srcIdx+8) 	// 1 square ahead.
			{
				return ((bIsThreat) || (destPc == pChessBoard.BLANK_SQUARE));
			}
			else if(destIdx == srcIdx+16)	// 2 squares ahead.
			{
				return ((bIsThreat) || ((destPc == pChessBoard.BLANK_SQUARE) && (this.getPieceAt(this.getSqNameFromIdx(srcIdx+8)) == pChessBoard.BLANK_SQUARE)));
			}
		}
		else if ((srcIdx > 15) && (srcIdx < 56))		// any subsequent moves
		{
			if((Math.abs(dy-sy)!=1))		// Cover for edges
				return false;
			if(destIdx == srcIdx+8)				// 1 square ahead.
			{
				return ((bIsThreat) || (destPc == pChessBoard.BLANK_SQUARE));
			}
			else if((destIdx == srcIdx+7)	||	// takes ahead - left
				(destIdx == srcIdx+9))			// takes ahead - right
			{
				return ((bIsThreat) || ((destPc > pChessBoard.BLACK_KING) && (destPc <= pChessBoard.BLACK_PAWN)));
			}
		}
	}
	else if(srcPc == pChessBoard.BLACK_PAWN)
	{
		if((srcIdx > 47) && (srcIdx < 56))	// First move
		{
			if((destIdx == srcIdx-8) ||		// 1 square ahead.
				(destIdx == srcIdx-16)	||	// 2 squares ahead.
				(destIdx == srcIdx-7)	||	// takes ahead - left
				(destIdx == srcIdx-9))		// takes ahead - right
			{
				if(((destIdx == srcIdx-7)	||	// takes ahead - left
					(destIdx == srcIdx-9))		// takes ahead - right
					&& (Math.abs(dy-sy)==1))	// Cover for edges
				{
					return ((bIsThreat) || ((destPc > pChessBoard.BLACK_KING) && (destPc <= pChessBoard.BLACK_PAWN)));
				}
				else if (destIdx == srcIdx-8) 	// 1 square ahead.
				{
					return ((bIsThreat) || (destPc == pChessBoard.BLANK_SQUARE));
				}
				else if(destIdx == srcIdx-16)	// 2 squares ahead.
				{
					return ((bIsThreat) || ((destPc == pChessBoard.BLANK_SQUARE) && (this.getPieceAt(this.getSqNameFromIdx(srcIdx-8)) == pChessBoard.BLANK_SQUARE)));
				}
			}
		}
		else								// any subsequent moves
		{
			if((Math.abs(dy-sy)!=1))		// Cover for edges
				return false;
			if(destIdx == srcIdx-8)			// 1 square ahead.
			{
				return ((bIsThreat) || (destPc == pChessBoard.BLANK_SQUARE));
			}
			else if((destIdx == srcIdx-7)	||	// takes ahead - left
					(destIdx == srcIdx-9))		// takes ahead - right
			{
				return ((bIsThreat) || ((destPc > pChessBoard.WHITE_KING) && (destPc <= pChessBoard.WHITE_PAWN)));
			}
		}
	}
	else
	{
		return false;
	}
}


/**
 * Validates the bishop-move mentioned
 *
 * This function assumes that the basic checks (like blocked destination square) is already made.
 * @param srcPc {Number} The source piece 
 * @param destPc {Number} The destination piece - can be 0 if dest square is empty
 * @param srcSq {String} The source square - chess notation
 * @param destSq {String} The destination square - chess notation
 * @return true if the move is valid, false otherwise.
 */
pChessBoard.prototype.isValidBishopMove = 
function (srcPc, destPc, srcSq, destSq)
{
	var sx = srcSq.charCodeAt(0) - 97;
	var sy = srcSq.charCodeAt(1) - 49;
	var dx = destSq.charCodeAt(0) - 97;
	var dy = destSq.charCodeAt(1) - 49;
	var srcIdx = (sy * 8) + sx;
	var destIdx = (dy * 8) + dx;
	
	if(Math.abs(dx-sx) != Math.abs(dy-sy)) // Must move and equal number of spaces horizontally & vertically (diagonal!)
	{
		return false;
	}
	
	var sqIdx = srcIdx;
	// Now check each possible diagonal
	// up-right
	sqIdx += 9;
	while(sqIdx < 64 
		&& ((dx > sx) && (dy > sy))	// If we're moving up & right
	)
	{
		if(sqIdx == destIdx)		// Found the square!
		{
			return true;
		}
		if(this.boardCells[sqIdx] != 0)	// something is blocking the move
		{
			break;
		}
		sqIdx += 9;
	}
	// down-left
	sqIdx = srcIdx - 9;
	while(sqIdx >= 0
		&& ((dx < sx) && (dy < sy))	// If we're moving down & left
	)
	{
		if(sqIdx == destIdx)		// Found the square!
		{
			return true;
		}
		if(this.boardCells[sqIdx] != 0)	// something is blocking the move
		{
			break;
		}
		sqIdx -= 9;
	}
	// up-left
	sqIdx = srcIdx + 7;
	while(sqIdx < 64
		&& ((dx < sx) && (dy > sy))	// If we're moving up & left
	)
	{
		if(sqIdx == destIdx)		// Found the square!
		{
			return true;
		}
		if(this.boardCells[sqIdx] != 0)	// something is blocking the move
		{
			break;
		}
		sqIdx += 7;
	}
	// down-right
	sqIdx = srcIdx - 7;
	while(sqIdx >= 0
		&& ((dx > sx) && (dy < sy))	// If we're moving down & right
	)
	{
		if(sqIdx == destIdx)		// Found the square!
		{
			return true;
		}
		if(this.boardCells[sqIdx] != 0)	// something is blocking the move
		{
			break;
		}
		sqIdx -= 7;
	}
	return false;		// Didn't find the destination square.
}


/**
 * Validates the rook-move mentioned
 *
 * This function assumes that the basic checks (like blocked destination square) is already made.
 * @param srcPc {Number} The source piece 
 * @param destPc {Number} The destination piece - can be 0 if dest square is empty
 * @param srcSq {String} The source square - chess notation
 * @param destSq {String} The destination square - chess notation
 * @return true if the move is valid, false otherwise.
 */
pChessBoard.prototype.isValidRookMove = 
function (srcPc, destPc, srcSq, destSq)
{
	var sx = srcSq.charCodeAt(0) - 97;
	var sy = srcSq.charCodeAt(1) - 49;
	var dx = destSq.charCodeAt(0) - 97;
	var dy = destSq.charCodeAt(1) - 49;
	var srcIdx = (sy * 8) + sx;
	var destIdx = (dy * 8) + dx;
	
	if(((dx-sx) != 0) && ((dy-sy) != 0)) // Can't move along rank and file at the same time.
	{
		return false;
	}
	
	var sqIdx = srcIdx;
	// up
	sqIdx += 8;
	while(sqIdx < 64)
	{
		if(sqIdx == destIdx)		// Found the square!
		{
			return true;
		}
		if(this.boardCells[sqIdx] != 0)	// something is blocking the move
		{
			break;
		}
		sqIdx += 8;
	}
	// down
	sqIdx = srcIdx - 8;
	while(sqIdx >= 0)
	{
		if(sqIdx == destIdx)		// Found the square!
		{
			return true;
		}
		if(this.boardCells[sqIdx] != 0)	// something is blocking the move
		{
			break;
		}
		sqIdx -= 8;
	}
	// left
	if(sx > 0)
	{
		sqIdx = srcIdx - 1;
		while((sqIdx & 7) >= 0)
		{
			if(sqIdx == destIdx)		// Found the square!
			{
				return true;
			}
			if(this.boardCells[sqIdx] != 0)	// something is blocking the move
			{
				break;
			}
			sqIdx -= 1;
		}
	}
	// right
	if(sx < 7)
	{
		sqIdx = srcIdx + 1;
		while((sqIdx & 7) <= 7)
		{
			if(sqIdx == destIdx)		// Found the square!
			{
				return true;
			}
			if(this.boardCells[sqIdx] != 0)	// something is blocking the move
			{
				break;
			}
			sqIdx += 1;
		}
	}
	return false;		// Didn't find the destination square.
}


/**
 * Validates the queen-move mentioned
 *
 * This function assumes that the basic checks (like blocked destination square) is already made.
 * Basically checks for a valid rook-like or bishop-like move
 * @param srcPc {Number} The source piece 
 * @param destPc {Number} The destination piece - can be 0 if dest square is empty
 * @param srcSq {String} The source square - chess notation
 * @param destSq {String} The destination square - chess notation
 * @return true if the move is valid, false otherwise.
 */
pChessBoard.prototype.isValidQueenMove = 
function (srcPc, destPc, srcSq, destSq)
{
	var sx = srcSq.charCodeAt(0) - 97;
	var sy = srcSq.charCodeAt(1) - 49;
	var dx = destSq.charCodeAt(0) - 97;
	var dy = destSq.charCodeAt(1) - 49;
	var srcIdx = (sy * 8) + sx;
	var destIdx = (dy * 8) + dx;


	var valid_rb_move = (this.isValidBishopMove(srcPc, destPc, srcSq, destSq) || this.isValidRookMove(srcPc, destPc, srcSq, destSq));
	
	return valid_rb_move;
}


/**
 * Validates the Knight-move mentioned
 *
 * This function assumes that the basic checks (like blocked destination square) is already made.
 * @param srcPc {Number} The source piece 
 * @param destPc {Number} The destination piece - can be 0 if dest square is empty
 * @param srcSq {String} The source square - chess notation
 * @param destSq {String} The destination square - chess notation
 * @return true if the move is valid, false otherwise.
 */
pChessBoard.prototype.isValidKnightMove = 
function (srcPc, destPc, srcSq, destSq)
{
	var sx = srcSq.charCodeAt(0) - 97;
	var sy = srcSq.charCodeAt(1) - 49;
	var dx = destSq.charCodeAt(0) - 97;
	var dy = destSq.charCodeAt(1) - 49;
	var srcIdx = (sy * 8) + sx;
	var destIdx = (dy * 8) + dx;

	// Check the destinations for the correct move.
	var kx;
	var ky;
	
	if((((srcIdx + 17) == destIdx) || 	// 2 up, 1,right
		((srcIdx + 15) == destIdx) ||	// 2 up, 1 left
		((srcIdx + 10) == destIdx) ||	// 1 up, 2 right
		((srcIdx + 6) == destIdx) ||	// 1 up, 2 left
		((srcIdx - 6) == destIdx) ||	// 1 down, 2 right
		((srcIdx - 10) == destIdx) ||	// 1 down, 2 left
		((srcIdx - 15) == destIdx) ||	// 2 down, 1 right
		((srcIdx - 17) == destIdx))		// 2 down, 1 left
		&& ((Math.abs(dy - sy) <= 2) && (Math.abs(dx - sx) <= 2))	// Ensure we're not crossing the edges
		)
	{
		return true;
	}
	
	return false;
}


/**
 * Validates the King-move mentioned
 *
 * This function assumes that the basic checks (like blocked destination square) is already made.
 * @param srcPc {Number} The source piece 
 * @param destPc {Number} The destination piece - can be 0 if dest square is empty
 * @param srcSq {String} The source square - chess notation
 * @param destSq {String} The destination square - chess notation
 * @return true if the move is valid, false otherwise.
 */
pChessBoard.prototype.isValidKingMove = 
function (srcPc, destPc, srcSq, destSq)
{
	var sx = srcSq.charCodeAt(0) - 97;
	var sy = srcSq.charCodeAt(1) - 49;
	var dx = destSq.charCodeAt(0) - 97;
	var dy = destSq.charCodeAt(1) - 49;
	var srcIdx = (sy * 8) + sx;
	var destIdx = (dy * 8) + dx;

	if(((sx - dx) > 1) || 
		((sx - dx) < -1) ||
		((sy - dy) > 1) || 
		((sy - dy) < -1))
	{
		return false;
	}	
	return true;
}

/**
 * Returns the number of pieces of the specified colour that can move to this square.
 *
 * Runs through each of the opponent's pieces and sees if the piece can move to this square.
 * Damn I wish I had used Bit-Boards! Maybe I still can, we'll see later.
 * 
 * @param targetSq {String} The target square - chess notation 
 * @param byPlayer {Number} The player colour for whom we want to check
 * @param byPiece {Number} Check only for attacks by this type of piece
 * @return true if the move is valid, false otherwise.
 */
pChessBoard.prototype.howManyThreats = 
function (targetSq, byPlayer, byPiece)
{
	var numThreats = 0;
	if((byPlayer == pChessBoard.COLOUR_BLACK) || (byPlayer == pChessBoard.COLOUR_WHITE))
	{
		for(var i = 0; i < 8; i++)			// rank
		{
			for(var j = 1; j <= 8; j++)		// file
			{
				var sq = String.fromCharCode(i+97) + "" + j;
				if(byPlayer == this.getPieceColour(this.getPieceAt(sq)) 
					&& (((byPiece == null) || (typeof(byPiece) == 'undefined')) || (byPiece == this.getPieceAt(sq))))
				{
					if(this.isMoveLegal(sq, targetSq, true))
					{
						numThreats += 1;
					}
				}
			}
		}
	}
	return numThreats;
}

/**
 * Return true if the player is in check
 *
 * @param player {Number} The colour of the player to check for
 * @return {bool} True if in check.
 */
pChessBoard.prototype.isInCheck = 
function (player)
{
	if((player == null) || (typeof(player) == 'undefined'))
		player = this.playerToMove;
	if((player != pChessBoard.COLOUR_WHITE) && (player != pChessBoard.COLOUR_BLACK))
		return false;
	if(player == pChessBoard.COLOUR_WHITE)
		return( this.howManyThreats( this.getSqNameFromIdx( this.getPieceLocationIdx(pChessBoard.WHITE_KING) ), pChessBoard.COLOUR_BLACK ) > 0 );
	else if(player == pChessBoard.COLOUR_BLACK)
		return( this.howManyThreats( this.getSqNameFromIdx( this.getPieceLocationIdx(pChessBoard.BLACK_KING) ), pChessBoard.COLOUR_WHITE ) > 0 );

}
