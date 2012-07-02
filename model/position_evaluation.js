/**
 * Name			: position_evaluation.js
 * Description	: Routines to evaluate position
 */

/**
 * Evaluates the score of the current board.
 *
 * @return int The evalutation of the board. +ve means white is up, -ve means black is up
 */
pChessBoard.prototype.evalScore = 
function ()
{
	var score = this.evalMaterialScore()
				+ this.evalPositionalScore();
	return score;
}   
         
/**
 * Evaluates the material score of the current board.
 *
 * @return int The material evalutation of the board. +ve means white is up, -ve means black is up
 * Piece		Value
 * King			100000
 * Queen		9
 * Rook			5
 * Bishop		3
 * Knight		3
 * Pawn			1
 */
pChessBoard.prototype.evalMaterialScore = 
function ()
{
	var score = 0;
	for(var i = 0; i < 64; i++)
	{
		switch(this.boardCells[i])
		{
			case pChessBoard.BLANK_SQUARE:
				break;
			case pChessBoard.WHITE_PAWN:
				score += 1;
				break;
			case pChessBoard.BLACK_PAWN:
				score -= 1;
				break;
			case pChessBoard.WHITE_BISHOP_LT:
			case pChessBoard.WHITE_BISHOP_DK:
			case pChessBoard.WHITE_KNIGHT:
				score += 3;
				break;
			case pChessBoard.BLACK_BISHOP_LT:
			case pChessBoard.BLACK_BISHOP_DK:
			case pChessBoard.BLACK_KNIGHT:
				score -= 3;
				break;
			case pChessBoard.WHITE_ROOK:
				score += 5;
				break;
			case pChessBoard.BLACK_ROOK:
				score -= 5;
				break;
			case pChessBoard.WHITE_QUEEN:
				score += 9;
				break;
			case pChessBoard.BLACK_QUEEN:
				score -= 9;
				break;
			case pChessBoard.WHITE_KING:
				score += 100000;
				break;
			case pChessBoard.BLACK_KING:
				score -= 100000;
				break;
		}
	}
	
	if(this.isInCheck(pChessBoard.COLOUR_WHITE))
		score -= 4;
	if(this.isInCheck(pChessBoard.COLOUR_BLACK))
		score += 4;
	
	return score;
}

/**
 * Evaluates the positional score of the current board.
 * Will try to evaluate center control, back-rank control, file control, isolated/doubled/tripled pawns etc.
 *
 * @return int The positional evalutation of the board. +ve means white is up, -ve means black is up
 * Positional Concept	Description						Value
 * Center Control		Extra points for every piece
 *						threatening a center square		<Num Attacks>*0.5
 */
pChessBoard.prototype.evalPositionalScore = 
function ()
{
		
	var totalScore = this.evalCenterControlScore();
	return (totalScore);
}

/**
 * Evaluates the center control score of the current board.
 * Will try to evaluate center control, back-rank control, file control, isolated/doubled/tripled pawns etc.
 *
 * @return int The positional evalutation of the board. +ve means white is up, -ve means black is up
 * Positional Concept	Description						Value
 * Center Control		Extra points for every piece
 *						threatening a center square		<Num Attacks>*0.5
 */
pChessBoard.prototype.evalCenterControlScore = 
function ()
{
	var numThreats = 0;
	// Center control
	numThreats += this.howManyThreats('d4', pChessBoard.COLOUR_WHITE);
	numThreats -= this.howManyThreats('d4', pChessBoard.COLOUR_BLACK);
	numThreats += this.howManyThreats('d5', pChessBoard.COLOUR_WHITE);
	numThreats -= this.howManyThreats('d5', pChessBoard.COLOUR_BLACK);
	numThreats += this.howManyThreats('e4', pChessBoard.COLOUR_WHITE);
	numThreats -= this.howManyThreats('e4', pChessBoard.COLOUR_BLACK);
	numThreats += this.howManyThreats('e5', pChessBoard.COLOUR_WHITE);
	numThreats -= this.howManyThreats('e5', pChessBoard.COLOUR_BLACK);
	
	// Give a little extra for pawn controls
	numThreats += this.howManyThreats('d4', pChessBoard.COLOUR_WHITE, pChessBoard.WHITE_PAWN);
	numThreats -= this.howManyThreats('d4', pChessBoard.COLOUR_BLACK, pChessBoard.BLACK_PAWN);
	numThreats += this.howManyThreats('d5', pChessBoard.COLOUR_WHITE, pChessBoard.WHITE_PAWN);
	numThreats -= this.howManyThreats('d5', pChessBoard.COLOUR_BLACK, pChessBoard.BLACK_PAWN);
	numThreats += this.howManyThreats('e4', pChessBoard.COLOUR_WHITE, pChessBoard.WHITE_PAWN);
	numThreats -= this.howManyThreats('e4', pChessBoard.COLOUR_BLACK, pChessBoard.BLACK_PAWN);
	numThreats += this.howManyThreats('e5', pChessBoard.COLOUR_WHITE, pChessBoard.WHITE_PAWN);
	numThreats -= this.howManyThreats('e5', pChessBoard.COLOUR_BLACK, pChessBoard.BLACK_PAWN);
	
	// Count center occupation
	var occupied = 0;
	var pc = this.getPieceAt('d4');
	if((pc & pChessBoard.COLOUR_WHITE) > 0) occupied += 1;
	else if((pc & pChessBoard.COLOUR_BLACK) > 0) occupied -= 1;

	pc = this.getPieceAt('d5');
	if((pc & pChessBoard.COLOUR_WHITE) > 0) occupied += 1;
	else if((pc & pChessBoard.COLOUR_BLACK) > 0) occupied -= 1;

	pc = this.getPieceAt('e4');
	if((pc & pChessBoard.COLOUR_WHITE) > 0) occupied += 1;
	else if((pc & pChessBoard.COLOUR_BLACK) > 0) occupied -= 1;

	pc = this.getPieceAt('e5');
	if((pc & pChessBoard.COLOUR_WHITE) > 0) occupied += 1;
	else if((pc & pChessBoard.COLOUR_BLACK) > 0) occupied -= 1;
	
	return (numThreats * 0.1) + (occupied * 0.1);
}