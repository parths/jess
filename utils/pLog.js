
function pLogs()
{
}

function pErrors()
{
}

/**
 * Logs the debug message supplied
 */
pLogs.LogMsg = 
function(errMsg)
{
	var dbgBox = document.getElementById('pDbgBox');
	if((dbgBox == null) && (dbgBox == undefined))
	{
		//alert(errMsg);
		dbgBox = document.createElement('textarea');
		dbgBox.cols = 80;
		dbgBox.rows = 50;
		document.body.appendChild(dbgbox);
/*		return;
		document.write("<textarea id = 'pDbgBox' style='top:400px;'>asdasd</textarea>");
		dbgBox = document.getElementById('pDbgBox');*/
	}
	//alert(dbgBox.value);
	dbgBox.readOnly = true;
	dbgBox.value += "" + errMsg + "\n";
	dbgBox.scrollTop = dbgBox.scrollHeight;
}

/**
 * Logs the error message supplied
 */
pErrors.LogError = 
function(errMsg)
{
	//alert(msg);
	var dbgBox = document.getElementById('pDbgBox');
	if((dbgBox != null) && (dbgBox != undefined))
	{
		document.write("<textarea id = 'pDbgBox'></textarea>");
	}
}

/**
 * Mimic the assert function
 */
pErrors.Assert = 
function(assertCond, msg)
{
	if(!assertCond)
	{
		pErrors.LogError(msg)
	}
}

