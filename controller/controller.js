
// +Constants

//< State FSM
pController.WHITE_SEL		= 0;		// White to select piece
pController.WHITE_MOVE		= 1;		// White to move

pController.BLACK_SEL		= 2;		// Black to select piece
pController.BLACK_MOVE		= 3;		// Black to move
// -Constants

/**
 * The controller class. 
 * Controls the whole application functionality
 */
function pController(brdDesign)
{
	// +Declarations
	//< The game-controller
	this.gameController	= null;

	//< The board view
	this.brdView		= null;

	//< The board model
	this.brd			= null;

	//< The game state
	this.gameState		= 0;

	//< The source square element
	this.srcSq			= null;
	
	//< Denotes if the ai is playing
	this.aiPlayer		= pChessBoard.COLOUR_NONE;

	// -Declarations

	// +Initializations
	this.brd = new pChessBoard();
	this.brd.resetBoard();
	this.brdView = new pBoardView(this.brd);
	if(brdDesign == null || brdDesign == undefined)
		brdDesign = "cb_tnmt01";
	this.brdView.init(document.getElementById("chess_board"), brdDesign);
	// -Initializations

	window.onload		= this.Init();
	window.onclick		= this.onClickEvent;
}


/**
 * Initializes the controller. 
 * Currently just gives the control to the game-controller
 *
 * @param gameDiv The game div element
 */
pController.prototype.Init =
function (gameDiv )
{
	
}


/**
 * The Click event handler
 */
pController.prototype.onClick = 
function(evClick)
{
	alert("A");
	return false;
}


/**
 * The Click event handler
 *
 * @param cbSq The element instance of the square that was clicked
 */
pController.prototype.onChessBoardClick = 
function(cbSq)
{
	//showObj(cbSq.style);
	//cbSq.style.backgroundColor = 
//	alert(cbSq.id);
	
	//pLogs.LogMsg("" + this.gameState);
	this.brd.getValidMoves(pChessBoard.COLOUR_WHITE);
	switch(this.gameState)
	{
	case pController.WHITE_SEL:
		if((this.brd.getPieceAt(cbSq.id) >= pChessBoard.WHITE_KING) && (this.brd.getPieceAt(cbSq.id) <= pChessBoard.WHITE_PAWN))
		{
			this.gameState = pController.WHITE_MOVE;
			this.srcSq = cbSq;
		}
		break;
	case pController.BLACK_SEL:
		if((this.brd.getPieceAt(cbSq.id) >= pChessBoard.BLACK_KING) && (this.brd.getPieceAt(cbSq.id) <= pChessBoard.BLACK_PAWN))
		{
			this.gameState = pController.BLACK_MOVE;
			this.srcSq = cbSq;
		}
		break;
	case pController.WHITE_MOVE:
		if(this.brd.isMoveValid(this.srcSq.id, cbSq.id))
		{
			this.brd.setPieceAt(cbSq.id, this.brd.getPieceAt(this.srcSq.id));
			this.brd.setPieceAt(this.srcSq.id, 0);
			this.brd.endTurn();
			this.gameState = pController.BLACK_SEL;
			pLogs.LogMsg("Current Score: " + this.brd.evalScore());
			var move = this.brd.getMinScore(2, -1000000, 1000000);
			//pLogs.LogMsg("Suggested Move: " + move['move'] + ' with score: ' + move['score']);
			this.srcSq = null;
			this.brdView.draw();
			
			if(this.aiPlayer == pChessBoard.COLOUR_BLACK)
			{
				// Make AI move
				var aiMove = move['move'].split('-');
				this.brd.setPieceAt(aiMove[1], this.brd.getPieceAt(aiMove[0]));
				this.brd.setPieceAt(aiMove[0], 0);
				this.brd.endTurn();
				this.gameState = pController.WHITE_SEL;
				pLogs.LogMsg("Current Score: " + this.brd.evalScore());
				this.brdView.draw();
			}
		}
		else
		{
			if(this.srcSq == cbSq)
			{
				this.gameState = pController.WHITE_SEL;
				this.srcSq = null;
			}
		}
		break;
	case pController.BLACK_MOVE:
		if(this.brd.isMoveValid(this.srcSq.id, cbSq.id))
		{
			this.brd.setPieceAt(cbSq.id, this.brd.getPieceAt(this.srcSq.id));
			this.brd.setPieceAt(this.srcSq.id, 0);
			this.brd.endTurn();
			this.gameState = pController.WHITE_SEL;
			pLogs.LogMsg("Current Score: " + this.brd.evalScore());
			//var move = this.brd.getMaxScore(2, -1000000, 1000000);
			//pLogs.LogMsg("Suggested Move: " + move['move'] + ' with score: ' + move['score']);
			this.srcSq = null;
			this.brdView.draw();
		}
		else
		{
			if(this.srcSq == cbSq)
			{
				this.gameState = pController.BLACK_SEL;
				this.srcSq = null;
			}
		}
		break;
	};
	pLogs.LogMsg("Current Move State: " + this.gameState + " " + ((this.srcSq != null) ? this.srcSq.id : ""));
	return false;
}

/**
 * Sets the AI Player
 * Currently sets only to black
 *
 * @param colour {String} 'black' or 'white' or 'none'. 
 */
pController.prototype.setAIPlayer = 
function(colour)
{
	if(colour == null || typeof(colour) == 'undefined' || colour == 'none')
		this.aiPlayer = pChessBoard.COLOUR_NONE;
	else if(colour == 'black')
		this.aiPlayer = pChessBoard.COLOUR_BLACK;
}

function showObj(o)
{
	var s = "";
	for(var pO in o)
	{
		s += " :: " + pO;
	}
	alert(s);
}
