/**
 * Name			: move_generation.js
 * Description	: Contains all implemented move generation routines
 */
 
/** 
 * Moves Generator / Iterator.
 * 
 * @param forPlayer	{int}	The player color for whom to generate moves. 
 * 						If not supplied (null or undefined)
 * 						Generates moves for the player whose turn it is (uses this.playerToMove)
 * @return {array} An array of valid moves for this board state.
 * @notes
 *		TODO: Implement an iterator / generator asap.
 */
pChessBoard.prototype.getValidMoves = 
function (forPlayer)
{
	var playerTurn = ((forPlayer == null) 
						|| (typeof(forPlayer) == 'undefined')
						|| (forPlayer == pChessBoard.COLOUR_NONE)) ? 
							this.playerToMove : forPlayer;
	var validMoves = [];
	var cntPiecesChecked = 0;
	if(playerTurn == pChessBoard.COLOUR_WHITE)
	{
		for(var i = 0; ((i < 64) && (cntPiecesChecked < 16)); i++)
		{
			var srcSq = this.getSqNameFromIdx(i);
			var pc = this.getPieceAt(srcSq);
			if(pc == pChessBoard.BLANK_SQUARE || ((pc & 0xff) == 0))		// Blank or black
				continue;
			switch(pc)
			{
			case pChessBoard.WHITE_PAWN:
				validMoves = validMoves.concat(this.getValidPawnMoves(playerTurn, srcSq));
				break;
			case pChessBoard.WHITE_BISHOP_LT:
			case pChessBoard.WHITE_BISHOP_DK:
				validMoves = validMoves.concat(this.getValidBishopMoves(playerTurn, srcSq));
				break;
			case pChessBoard.WHITE_ROOK:
				validMoves = validMoves.concat(this.getValidRookMoves(playerTurn, srcSq));
				break;
			case pChessBoard.WHITE_KNIGHT:
				validMoves = validMoves.concat(this.getValidKnightMoves(playerTurn, srcSq));
				break;
			case pChessBoard.WHITE_QUEEN:
				validMoves = validMoves.concat(this.getValidQueenMoves(playerTurn, srcSq));
				break;
			case pChessBoard.WHITE_KING:
				validMoves = validMoves.concat(this.getValidKingMoves(playerTurn, srcSq));
				break;
			default:
				break;
			}
			cntPiecesChecked ++;
		}
	}
	else if(playerTurn == pChessBoard.COLOUR_BLACK)
	{
		for(var i = 63; ((i >= 0) && (cntPiecesChecked < 16)); i--)
		{
			var srcSq = this.getSqNameFromIdx(i);
			var pc = this.getPieceAt(srcSq);
			if(pc == pChessBoard.BLANK_SQUARE || ((pc & 0xff) != 0))	// Blank or white.
				continue;
			switch(pc)
			{
			case pChessBoard.BLACK_PAWN:
				validMoves = validMoves.concat(this.getValidPawnMoves(playerTurn, srcSq));
				break;
			case pChessBoard.BLACK_BISHOP_LT:
			case pChessBoard.BLACK_BISHOP_DK:
				validMoves = validMoves.concat(this.getValidBishopMoves(playerTurn, srcSq));
				break;
			case pChessBoard.BLACK_ROOK:
				validMoves = validMoves.concat(this.getValidRookMoves(playerTurn, srcSq));
				break;
			case pChessBoard.BLACK_KNIGHT:
				validMoves = validMoves.concat(this.getValidKnightMoves(playerTurn, srcSq));
				break;
			case pChessBoard.BLACK_QUEEN:
				validMoves = validMoves.concat(this.getValidQueenMoves(playerTurn, srcSq));
				break;
			case pChessBoard.BLACK_KING:
				validMoves = validMoves.concat(this.getValidKingMoves(playerTurn, srcSq));
				break;
			default:
				break;
			}
			cntPiecesChecked ++;
		}
	}
	//pLogs.LogMsg('Got ' + validMoves.length + ' moves for ' + ((forPlayer == pChessBoard.COLOUR_WHITE) ? 'White' : 'Black'));
	//for(var move in validMoves)
	//	pLogs.LogMsg('Got Move: ' + validMoves[move]);
	return validMoves;
} 

/** 
 * Generates valid pawn moves for the specified player starting from the given square.
 * 
 * @param forPlayer	{int}	The player color for whom to generate moves. 
 * 						If not supplied (null or undefined)
 * 						Generates moves for the player whose turn it is (uses this.playerToMove)
 * @return {array} An array of valid moves for this board state.
 * @notes
 *		TODO: Implement an iterator / generator asap.
 */
pChessBoard.prototype.getValidPawnMoves = 
function (forPlayer, srcSq)
{
	var playerTurn = ((forPlayer == null) 
						|| (typeof(forPlayer) == 'undefined')
						|| (forPlayer == pChessBoard.COLOUR_NONE)) ? 
							this.playerToMove : forPlayer;
	var sx = srcSq.charCodeAt(0) - 97;
	var sy = srcSq.charCodeAt(1) - 49;
	var validMoves = [];
	if(playerTurn == pChessBoard.COLOUR_WHITE)
	{
		var dx = sx;
		var dy = sy + 1;
		var destSq = String.fromCharCode(dx + 97) + "" + (dy+1)
		if(this.isMoveValid(srcSq, destSq))
			validMoves.push(srcSq+"-"+destSq);
		dx = sx + 1;

		destSq = String.fromCharCode(dx + 97) + "" + (dy+1)
		if(this.isMoveValid(srcSq, destSq))
			validMoves.push(srcSq+"-"+destSq);
		dx = sx - 1;
		
		destSq = String.fromCharCode(dx + 97) + "" + (dy+1)
		if(this.isMoveValid(srcSq, destSq))
			validMoves.push(srcSq+"-"+destSq);
		dx = sx;
		dy = sy + 2;
		
		destSq = String.fromCharCode(dx + 97) + "" + (dy+1)
		if(this.isMoveValid(srcSq, destSq))
			validMoves.push(srcSq+"-"+destSq);
	}
	else if(playerTurn == pChessBoard.COLOUR_BLACK)
	{
		var dx = sx;
		var dy = sy - 1;
		var destSq = String.fromCharCode(dx + 97) + "" + (dy+1)
		if(this.isMoveValid(srcSq, destSq))
			validMoves.push(srcSq+"-"+destSq);
		dx = sx + 1;

		destSq = String.fromCharCode(dx + 97) + "" + (dy+1)
		if(this.isMoveValid(srcSq, destSq))
			validMoves.push(srcSq+"-"+destSq);
		dx = sx - 1;
		
		destSq = String.fromCharCode(dx + 97) + "" + (dy+1)
		if(this.isMoveValid(srcSq, destSq))
			validMoves.push(srcSq+"-"+destSq);
		dx = sx;
		dy = sy - 2;
		
		destSq = String.fromCharCode(dx + 97) + "" + (dy+1)
		if(this.isMoveValid(srcSq, destSq))
			validMoves.push(srcSq+"-"+destSq);
	}
	
	return validMoves;
}

/** 
 * Generates valid Bishop moves for the specified player starting from the given square.
 * 
 * @param forPlayer	{int}	The player color for whom to generate moves. 
 * 						If not supplied (null or undefined)
 * 						Generates moves for the player whose turn it is (uses this.playerToMove)
 * @return {array} An array of valid moves for this board state.
 * @notes
 *		TODO: Implement an iterator / generator asap.
 */
pChessBoard.prototype.getValidBishopMoves = 
function (forPlayer, srcSq)
{
	var playerTurn = ((forPlayer == null) 
						|| (typeof(forPlayer) == 'undefined')
						|| (forPlayer == pChessBoard.COLOUR_NONE)) ? 
							this.playerToMove : forPlayer;
	var sx = srcSq.charCodeAt(0) - 97;
	var sy = srcSq.charCodeAt(1) - 49;
	var dx = 0;
	var dy = 0;

	var validMoves = [];
	
	// Move up-left
	dx = sx - 1;
	dy = sy + 1;
	while((dx >= 0) && (dy < 8) && this.isMoveValid(srcSq, this.getSqNameFromRankFile(dy, dx)))
	{
		validMoves.push(srcSq+"-"+this.getSqNameFromRankFile(dy, dx));
		dx -= 1;
		dy += 1;
	}

	// Move up-right
	dx = sx + 1;
	dy = sy + 1;
	while((dx < 8) && (dy < 8) && this.isMoveValid(srcSq, this.getSqNameFromRankFile(dy, dx)))
	{
		validMoves.push(srcSq+"-"+this.getSqNameFromRankFile(dy, dx));
		dx += 1;
		dy += 1;
	}

	// Move down-left
	dx = sx - 1;
	dy = sy - 1;
	while((dx >= 0) && (dy >= 0) && this.isMoveValid(srcSq, this.getSqNameFromRankFile(dy, dx)))
	{
		validMoves.push(srcSq+"-"+this.getSqNameFromRankFile(dy, dx));
		dx -= 1;
		dy -= 1;
	}

	// Move down-right
	dx = sx + 1;
	dy = sy - 1;
	while((dx < 8) && (dy >= 0) && this.isMoveValid(srcSq, this.getSqNameFromRankFile(dy, dx)))
	{
		validMoves.push(srcSq+"-"+this.getSqNameFromRankFile(dy, dx));
		dx += 1;
		dy -= 1;
	}

	return validMoves;
}

/** 
 * Generates valid Rook moves for the specified player starting from the given square.
 * 
 * @param forPlayer	{int}	The player color for whom to generate moves. 
 * 						If not supplied (null or undefined)
 * 						Generates moves for the player whose turn it is (uses this.playerToMove)
 * @return {array} An array of valid moves for this board state.
 * @notes
 *		TODO: Implement an iterator / generator asap.
 */
pChessBoard.prototype.getValidRookMoves = 
function (forPlayer, srcSq)
{
	var playerTurn = ((forPlayer == null) 
						|| (typeof(forPlayer) == 'undefined')
						|| (forPlayer == pChessBoard.COLOUR_NONE)) ? 
							this.playerToMove : forPlayer;
	var sx = srcSq.charCodeAt(0) - 97;
	var sy = srcSq.charCodeAt(1) - 49;
	var dx = 0;
	var dy = 0;

	var validMoves = [];
	
	// Move up
	dx = sx;
	dy = sy + 1;
	while((dx >= 0) && (dy < 8) && this.isMoveValid(srcSq, this.getSqNameFromRankFile(dy, dx)))
	{
		validMoves.push(srcSq+"-"+this.getSqNameFromRankFile(dy, dx));
		dy += 1;
	}

	// Move down
	dx = sx;
	dy = sy - 1;
	while((dx >= 0) && (dy >= 0) && this.isMoveValid(srcSq, this.getSqNameFromRankFile(dy, dx)))
	{
		validMoves.push(srcSq+"-"+this.getSqNameFromRankFile(dy, dx));
		dy -= 1;
	}

	// Move left 
	dx = sx - 1;
	dy = sy;
	while((dx >= 0) && (dy < 8) && this.isMoveValid(srcSq, this.getSqNameFromRankFile(dy, dx)))
	{
		validMoves.push(srcSq+"-"+this.getSqNameFromRankFile(dy, dx));
		dx -= 1;
	}

	// Move left 
	dx = sx + 1;
	dy = sy;
	while((dx < 8) && (dy < 8) && this.isMoveValid(srcSq, this.getSqNameFromRankFile(dy, dx)))
	{
		validMoves.push(srcSq+"-"+this.getSqNameFromRankFile(dy, dx));
		dx += 1;
	}

	
	return validMoves;
}

/** 
 * Generates valid Queen moves for the specified player starting from the given square.
 * Basically a combination of rook ad bishop moves.
 *
 * @param forPlayer	{int}	The player color for whom to generate moves. 
 * 						If not supplied (null or undefined)
 * 						Generates moves for the player whose turn it is (uses this.playerToMove)
 * @return {array} An array of valid moves for this board state.
 * @notes
 *		TODO: Implement an iterator / generator asap.
 */
pChessBoard.prototype.getValidQueenMoves = 
function (forPlayer, srcSq)
{
	var playerTurn = ((forPlayer == null) 
						|| (typeof(forPlayer) == 'undefined')
						|| (forPlayer == pChessBoard.COLOUR_NONE)) ? 
							this.playerToMove : forPlayer;
	var sx = srcSq.charCodeAt(0) - 97;
	var sy = srcSq.charCodeAt(1) - 49;
	var dx = 0;
	var dy = 0;

	var validMoves = [];
	validMoves = validMoves.concat(this.getValidRookMoves(forPlayer, srcSq));
	validMoves = validMoves.concat(this.getValidBishopMoves(forPlayer, srcSq));
	return validMoves;
}

/** 
 * Generates valid Knight moves for the specified player starting from the given square.
 *
 * @param forPlayer	{int}	The player color for whom to generate moves. 
 * 						If not supplied (null or undefined)
 * 						Generates moves for the player whose turn it is (uses this.playerToMove)
 * @return {array} An array of valid moves for this board state.
 * @notes
 *		TODO: Implement an iterator / generator asap.
 */
pChessBoard.prototype.getValidKnightMoves = 
function (forPlayer, srcSq)
{
	var playerTurn = ((forPlayer == null) 
						|| (typeof(forPlayer) == 'undefined')
						|| (forPlayer == pChessBoard.COLOUR_NONE)) ? 
							this.playerToMove : forPlayer;
	var sx = srcSq.charCodeAt(0) - 97;
	var sy = srcSq.charCodeAt(1) - 49;
	var dx = 0;
	var dy = 0;

	var validMoves = [];

	// up - left - left 
	dx = sx - 2;
	dy = sy + 1;
	if((dx >= 0) && (dy < 8) && this.isMoveValid(srcSq, this.getSqNameFromRankFile(dy, dx)))
		validMoves.push(srcSq+"-"+this.getSqNameFromRankFile(dy, dx));
	// up - up - left 
	dx = sx - 1;
	dy = sy + 2;
	if((dx >= 0) && (dy < 8) && this.isMoveValid(srcSq, this.getSqNameFromRankFile(dy, dx)))
		validMoves.push(srcSq+"-"+this.getSqNameFromRankFile(dy, dx));
	// down - left - left 
	dx = sx - 2;
	dy = sy - 1;
	if((dx >= 0) && (dy >= 0) && this.isMoveValid(srcSq, this.getSqNameFromRankFile(dy, dx)))
		validMoves.push(srcSq+"-"+this.getSqNameFromRankFile(dy, dx));
	// down - down - left 
	dx = sx - 1;
	dy = sy - 2;
	if((dx >= 0) && (dy >= 0) && this.isMoveValid(srcSq, this.getSqNameFromRankFile(dy, dx)))
		validMoves.push(srcSq+"-"+this.getSqNameFromRankFile(dy, dx));
	// down - right - right 
	dx = sx + 2;
	dy = sy - 1;
	if((dx < 8) && (dy >= 0) && this.isMoveValid(srcSq, this.getSqNameFromRankFile(dy, dx)))
		validMoves.push(srcSq+"-"+this.getSqNameFromRankFile(dy, dx));
	// down - down - right 
	dx = sx + 1;
	dy = sy - 2;
	if((dx < 8) && (dy >= 0) && this.isMoveValid(srcSq, this.getSqNameFromRankFile(dy, dx)))
		validMoves.push(srcSq+"-"+this.getSqNameFromRankFile(dy, dx));
	// up - right - right 
	dx = sx + 2;
	dy = sy + 1;
	if((dx < 8) && (dy < 8) && this.isMoveValid(srcSq, this.getSqNameFromRankFile(dy, dx)))
		validMoves.push(srcSq+"-"+this.getSqNameFromRankFile(dy, dx));
	// up - up - right 
	dx = sx + 1;
	dy = sy + 2;
	if((dx < 8) && (dy < 8) && this.isMoveValid(srcSq, this.getSqNameFromRankFile(dy, dx)))
		validMoves.push(srcSq+"-"+this.getSqNameFromRankFile(dy, dx));

	return validMoves;
}

/** 
 * Generates valid King moves for the specified player starting from the given square.
 *
 * @param forPlayer	{int}	The player color for whom to generate moves. 
 * 						If not supplied (null or undefined)
 * 						Generates moves for the player whose turn it is (uses this.playerToMove)
 * @return {array} An array of valid moves for this board state.
 * @notes
 *		TODO: Implement an iterator / generator asap.
 */
pChessBoard.prototype.getValidKingMoves = 
function (forPlayer, srcSq)
{
	var playerTurn = ((forPlayer == null) 
						|| (typeof(forPlayer) == 'undefined')
						|| (forPlayer == pChessBoard.COLOUR_NONE)) ? 
							this.playerToMove : forPlayer;
	var sx = srcSq.charCodeAt(0) - 97;
	var sy = srcSq.charCodeAt(1) - 49;
	var dx = 0;
	var dy = 0;

	var validMoves = [];

	// Check all 8 directions
	dx = sx - 1;
	dy = sy;
	if((dx >= 0) && (dy < 8) && this.isMoveValid(srcSq, this.getSqNameFromRankFile(dy, dx)))
		validMoves.push(srcSq+"-"+this.getSqNameFromRankFile(dy, dx));
	dx = sx - 1;
	dy = sy + 1;
	if((dx >= 0) && (dy < 8) && this.isMoveValid(srcSq, this.getSqNameFromRankFile(dy, dx)))
		validMoves.push(srcSq+"-"+this.getSqNameFromRankFile(dy, dx));
	dx = sx - 1;
	dy = sy - 1;
	if((dx >= 0) && (dy >= 0) && this.isMoveValid(srcSq, this.getSqNameFromRankFile(dy, dx)))
		validMoves.push(srcSq+"-"+this.getSqNameFromRankFile(dy, dx));
	dx = sx;
	dy = sy + 1;
	if((dx >= 0) && (dy < 8) && this.isMoveValid(srcSq, this.getSqNameFromRankFile(dy, dx)))
		validMoves.push(srcSq+"-"+this.getSqNameFromRankFile(dy, dx));
	dx = sx;
	dy = sy - 1;
	if((dx >= 0) && (dy >= 0) && this.isMoveValid(srcSq, this.getSqNameFromRankFile(dy, dx)))
		validMoves.push(srcSq+"-"+this.getSqNameFromRankFile(dy, dx));
	dx = sx + 1;
	dy = sy + 1;
	if((dx < 8) && (dy < 8) && this.isMoveValid(srcSq, this.getSqNameFromRankFile(dy, dx)))
		validMoves.push(srcSq+"-"+this.getSqNameFromRankFile(dy, dx));
	dx = sx + 1;
	dy = sy;
	if((dx < 8) && (dy < 8) && this.isMoveValid(srcSq, this.getSqNameFromRankFile(dy, dx)))
		validMoves.push(srcSq+"-"+this.getSqNameFromRankFile(dy, dx));
	dx = sx + 1;
	dy = sy - 1;
	if((dx < 8) && (dy >= 0) && this.isMoveValid(srcSq, this.getSqNameFromRankFile(dy, dx)))
		validMoves.push(srcSq+"-"+this.getSqNameFromRankFile(dy, dx));
	

	return validMoves;
}