/**
 * Name			: minmax.js
 * Description	: Minmax implementation with alpha-beta pruning for move generation routines
 *					Will include other techniques... later (might never come)
 */
 
 
/**
 * Gets the max score sequence for this board.
 *
 * @param numHalfMoves {Number} One half move is a move by one player. This indicates the number of halfmoves to look ahead to.
 * @param currMax {Number} Current Max value, used for alpha-beta pruning
 * @param currMin {Number} Current Min value, used for alpha-beta pruning
 * @return {Move-Score pair} Move is a string giving a hyphen-separated source and destination like (a1-a2).
 */
pChessBoard.prototype.getMaxScore = 
function (numHalfMoves, currMax, currMin)
{
	var maxMove = {move: '', score: 0.0};
	if(numHalfMoves <= 0)
	{
		maxMove['score'] = this.evalScore();
		return maxMove;
	}
	var validMoves = this.getValidMoves(this.playerToMove);
	for(var move in validMoves)
	{
		var sdPair = validMoves[move].split('-');
		var newBrd = this.getCopy();
		newBrd.setPieceAt(sdPair[1], newBrd.getPieceAt(sdPair[0]));
		newBrd.setPieceAt(sdPair[0], 0);
		newBrd.endTurn();
		var minScore = newBrd.getMinScore((numHalfMoves-1), currMax, currMin, newBrd.playerToMove);
		if((maxMove['score'] < minScore['score']) || (maxMove['move'] == ''))
		{
			maxMove['move'] = sdPair[0] + '-' + sdPair[1];
			maxMove['score'] = minScore['score'];
			currMax = maxMove['score'];
		}
		// The caller is not interested in values smaller than this (as currMin contains)
		// And I'm not going to select values less than this so makes sense to return now.
		if(currMax > currMin)
			break;
	}
	return maxMove;
}

/**
 * Gets the min score sequence for this board.
 *
 * @param numHalfMoves {Number} One half move is a move by one player. This indicates the number of halfmoves to look ahead to.
 * @param currMax {Number} Current Max value, used for alpha-beta pruning
 * @param currMin {Number} Current Min value, used for alpha-beta pruning
 * @return {Move-Score pair} Move is a string giving a hyphen-separated source and destination like (a1-a2).
 */
pChessBoard.prototype.getMinScore = 
function (numHalfMoves, currMax, currMin)
{
	var minMove = {move: '', score: 0.0};
	if(numHalfMoves <= 0)
	{
		minMove['score'] = this.evalScore();
		return minMove;
	}
	var validMoves = this.getValidMoves(this.playerToMove);
	for(var move in validMoves)
	{
		var sdPair = validMoves[move].split('-');
		var newBrd = this.getCopy();
		newBrd.setPieceAt(sdPair[1], newBrd.getPieceAt(sdPair[0]));
		newBrd.setPieceAt(sdPair[0], 0);
		newBrd.endTurn();
		var maxScore = newBrd.getMaxScore((numHalfMoves-1), currMax, currMin, newBrd.playerToMove);
		if((minMove['score'] > maxScore['score']) || (minMove['move'] == ''))
		{
			minMove['move'] = sdPair[0] + '-' + sdPair[1];
			minMove['score'] = maxScore['score'];
			currMin = minMove['score'];
		}
		// The caller is not interested in values smaller than this (as currMax contains)
		// And I'm not going to select values greater than this so makes sense to return now.
		if(currMin < currMax)
			break;
	}
	return minMove;
}

