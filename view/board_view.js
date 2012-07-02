/**
 * Name			: board_view.js
 * Description	: Displays the contents of the Chessboard data
 */
 
/**
 * Responsible for drawing the board onto the screen
 *
 * @param brd The chess board model instance
 */
function pBoardView(brd)
{
	// +Declarations
	///< The chess-board model instance
	this.chessBoard			= null;
	
	///< The html <div> element representing the chess-board on screen
	this.boardEle			= null;
	
	///< The html <div> element representing the chess-board on screen
	this.themeName			= null;
	// -Declarations
	
	// +Initializations
	this.chessBoard			= brd;
	// -Initializations
};


/**
 * Initializes the board elements
 * 
 * This takes a board div element
 * @param brdElem	The html div element which holds the board 
 */
pBoardView.prototype.init = 
function(brdElem, theme_name)
{
	this.themeName = ((theme_name == null) || (theme_name == undefined)) ? "cb_bnw" : theme_name;
	this.brdEle = brdElem;
	var p = 97;
	// Clean the div element
	this.brdEle.innerHTML = "";
	
	var divStr = "";
	var currColor = 0;
	for(var i = 0; i < 8; i++)			// columns
	{
		currColor = (((i % 2) == 0) ? 0 : 1);
		for(var j = 0; j < 8; j++)		// rows
		{
			divStr += "<div id = '" + String.fromCharCode(j + 97) + "" + (i+1) + 
					"' class = '" + this.themeName + ((currColor == 0) ? "_black_sq" : "_white_sq") + 
					"' style = 'left:" + (j * 40) + ";top:" + ((7-i) * 40) + ";z-Index:1;" + 
//					"background-image:resources/boards/" + ((currColor == 0) ? "black_sq" : "white_sq") + ".gif;" + 
					"' onclick='controller.onChessBoardClick(" + String.fromCharCode(j + 97) + "" + (i+1) + ");'>" + 
					"<img id='img_" + String.fromCharCode(j + 97) + "" + (i+1) + 
					"' src='./resources/boards/" + this.themeName + "/dummy.gif' width='40' height='40' style='z-Index:3;'>" + 
					"</div>";
			currColor = (currColor + 1) % 2;
		}
	}
	divStr += "<img id = 'img_focus' src = './resources/sq_focus.gif' style = 'position:absolute;visibility:hidden;'/>";
	// set the board html
	this.brdEle.innerHTML = divStr;

	// Draw the board
	this.draw();
};


/**
 * Draws the board to the screen
 */
pBoardView.prototype.draw = 
function()
{
	// set the pieces according to the board
	for(var i = 0; i < 8; i++)			// columns
	{
		for(var j = 0; j < 8; j++)		// rows
		{
			var sq = "" + String.fromCharCode(j + 97) + "" + (i+1);
			var pc = this.chessBoard.getPieceAt(sq);
			var imgele = document.getElementById("img_" + sq);
			switch(pc)
			{
			case pChessBoard.BLANK_SQUARE:
				imgele.src = "./resources/boards/" + this.themeName + "/dummy.gif";
				break;
			case pChessBoard.WHITE_KING:
				imgele.src = "./resources/boards/" + this.themeName + "/wh_king.gif";
				break;
			case pChessBoard.WHITE_QUEEN:
				imgele.src = "./resources/boards/" + this.themeName + "/wh_queen.gif";
				break;
			case pChessBoard.WHITE_ROOK:
				imgele.src = "./resources/boards/" + this.themeName + "/wh_rook.gif";
				break;
			case pChessBoard.WHITE_KNIGHT:
				imgele.src = "./resources/boards/" + this.themeName + "/wh_knight.gif";
				break;
			case pChessBoard.WHITE_BISHOP_LT:
				imgele.src = "./resources/boards/" + this.themeName + "/wh_bishop.gif";
				break;
			case pChessBoard.WHITE_BISHOP_DK:
				imgele.src = "./resources/boards/" + this.themeName + "/wh_bishop.gif";
				break;
			case pChessBoard.WHITE_PAWN:
				imgele.src = "./resources/boards/" + this.themeName + "/wh_pawn.gif";
				break;

			case pChessBoard.BLACK_KING:
				imgele.src = "./resources/boards/" + this.themeName + "/bk_king.gif";
				break;
			case pChessBoard.BLACK_QUEEN:
				imgele.src = "./resources/boards/" + this.themeName + "/bk_queen.gif";
				break;
			case pChessBoard.BLACK_ROOK:
				imgele.src = "./resources/boards/" + this.themeName + "/bk_rook.gif";
				break;
			case pChessBoard.BLACK_KNIGHT:
				imgele.src = "./resources/boards/" + this.themeName + "/bk_knight.gif";
				break;
			case pChessBoard.BLACK_BISHOP_LT:
				imgele.src = "./resources/boards/" + this.themeName + "/bk_bishop.gif";
				break;
			case pChessBoard.BLACK_BISHOP_DK:
				imgele.src = "./resources/boards/" + this.themeName + "/bk_bishop.gif";
				break;
			case pChessBoard.BLACK_PAWN:
				imgele.src = "./resources/boards/" + this.themeName + "/bk_pawn.gif";
				break;
			default:
				imgele.src = "";
				break;
			}
		}
	}
};

