var selectedfaces = [];
var nselectedfaces = 0;
var playspin;
var spinning = true;

var nWay = 0;
var selectedPiece = "none";
var hand = "w";


	var plateau = [ 

	  [["wt2"],["wc2"],["wf2"],["wk"],["wq"],["wf1"],["wc1"],["wt1"]],
	  [["wp8"],["wp7"],["wp6"],["wp5"],["wp4"],["wp3"],["wp2"],["wp1"]],
	  [["free"],["free"],["free"],["free"],["free"],["free"],["free"],["free"]],
	  [["free"],["free"],["free"],["free"],["free"],["free"],["free"],["free"]],
	  [["free"],["free"],["free"],["free"],["free"],["free"],["free"],["free"]],
	  [["free"],["free"],["free"],["free"],["free"],["free"],["free"],["free"]],
	  [["bp1"],["bp2"],["bp3"],["bp4"],["bp5"],["bp6"],["bp7"],["bp8"]],
	  [["bt1"],["bc1"],["bf1"],["bk"],["bq"],["bf2"],["bc2"],["bt2"]]];

function getPieceColor  ( p )
{
		if ( p.match(/^w/gi)) return "w";
		if ( p.match(/^b/gi)) return "b";
		if ( p.match(/^free/gi)) return "n";
}
function getPieceType  ( p )
{
		if ( p.match(/^[wb]p[1-8]/gi)) return "pawn";
		if ( p.match(/^[wb]t[1-2]/gi)) return "tower";
		if ( p.match(/^[wb]c[1-2]/gi)) return "knight";
		if ( p.match(/^[wb]f[1-2]/gi)) return "bishop";
		if ( p.match(/^[wb]q/gi)) return "queen";
		if ( p.match(/^[wb]k/gi)) return "king";		
}
function showPawnWay ( c, x, y )
{ //plateau[x][y]
	if ( c=="w" )
	{
		if ( plateau[x+1][y] == "free")
		{
			addToWayables(x+1, y, 0);
			if (x<2 && plateau[x+2][y] == "free") addToWayables(x+2, y, 1);
		}
		var pce = plateau[x+1][y+1]+"";
		if (y < 7 )
		if ( getPieceColor  ( pce )== "b") addToWayables(x+1, y+1, 0);
		pce = plateau[x+1][y-1]+"";
		if (y > 0 )
		if ( getPieceColor  ( pce )== "b") addToWayables(x+1, y-1, 0);
	}
	else
	{	
		if ( plateau[x-1][y] == "free")
		{
			addToWayables(x-1, y, 0);
			if (x>5 && plateau[x-2][y] == "free") addToWayables(x-2, y, 1);
		}
		var pce = plateau[x-1][y+1]+"";
		if (y < 7 )
		if ( getPieceColor  ( pce )== "w") addToWayables(x-1, y+1, 0);
		pce = plateau[x-1][y-1]+"";
		if (y > 0 )
		if ( getPieceColor  ( pce )== "w") addToWayables(x-1, y-1, 0);
	}
}

function Log(s)
{
	console.log(s);
}

function getPiecePositionX  ( p )
{
	for ( var j = 0 ;  j < 8 ; j++ )
		for ( var i = 0 ; i < 8 ; i++ )
			if ( plateau[i][j] == p ) return i;
	


}
function getPiecePositionY  ( p )
{
	for ( var i = 0 ; i < 8 ; i++ )
		for ( var j = 0 ;  j < 8 ; j++ )
			if ( plateau[i][j] == p ) return j;
}
function showWay(p)
{
	if ( getPieceType  ( p ) == "pawn")
	showPawnWay ( getPieceColor  ( p ), getPiecePositionX  ( p ), getPiecePositionY  ( p ) );

}
$(window).on("load", function() {

	$("body").append('<object hidden type="audio/mpeg" width="100" height="40" data="chesssound/start1.ogg"><param name="filename" value="/chesssound/start1.ogg" /><param name="autostart" value="true" /><param name="loop" value="false" /></object>');

	disposeapplicationlayers();
	//showMenu();

	loadPiecesWavefront();
	loadBoardWavefront();

	console.log("-- move wp1 --");
	MovePiece("wp1", 4, 0);
	MovePiece("wp3", 4, 0);
	console.log("--------------");




	initViewZlock();
	console.log( 'wp2:'+getPieceColor("wp2")+'\n');
	console.log( 'bp2:'+getPieceColor("bp2")+'\n');
	console.log( 'bp2:'+getPieceType("bp2")+'\n');

	showPawnWay ( getPieceColor("bp2"), getPiecePositionX("bp2"), getPiecePositionY("bp2") );
	console.log( plateau[getPiecePositionX("bp3")][getPiecePositionY("bp3") ] );
	
	
	$('body').on('click', '#close-menu', function() {
		closeMenu();
	});
	$('body').on('click', '#show-menu', function() {
		showMenu();
	});

	$('body').on('click', '#spin', function() {
		var spin = setInterval(showOBJ, 100);
	});
	
	var singleTap = new Hammer.Tap({
		event: 'singletap'
	});
	var doubleTap = new Hammer.Tap({
		event: 'doubletap',
		taps: 2
	});
	var tripleTap = new Hammer.Tap({
		event: 'tripletap',
		taps: 3
	});
	tripleTap.recognizeWith([doubleTap, singleTap]);
	doubleTap.recognizeWith(singleTap);
	doubleTap.requireFailure(tripleTap);
	singleTap.requireFailure([tripleTap, doubleTap]);

	var myElement = document.getElementById('svg8');
	var mc = new Hammer(myElement);
	mc.get('pan').set({
		direction: Hammer.DIRECTION_ALL
	});
	mc.on("doubletap", function(ev) {
		//
	});
	mc.on("singletap", function(ev) {
		//
	
	});
	mc.on("pan", function(ev) {
	

		rotateViewZlock (ev.velocityY*15, ev.velocityX*15, 0 );
		$('#csl').text(ZlockANGx+'\n '+ZlockANGy+'\n '+ZlockANGz);
		viewChessBoard();
		
		if ( spinning == true )
		{
			window.clearInterval(playspin);
			spinning = false;
		}


	});
	$('body').on('click', '.face', function() {
		$(this).addClass('active');
		var f = getfaceid(this);
		var m = getfacematerial(this);
		
		$('#csl').text('face '+f+'\n '+m);
		selectedfaces[nselectedfaces] = f;
		nselectedfaces++;
		if (selectedPiece != "none")
		{
			switchMaterial ("selectedPiece", selectedPiece );
			
		}
		selectedPiece = m;
		//MovePiece(selectedPiece, 2, 0);
		console.log( 'selectedPiece:'+getPieceType(selectedPiece)+'-'+getPieceColor(selectedPiece)+'\n');	
		clearWayables ();
		showWay(selectedPiece);
		switchMaterial (m, "selectedPiece");
		 viewChessBoard();
	});
	$('body').on('click', '.way', function() {

		
		var tmp = $(this).attr('class');
		
		var tmp2 = tmp.match(/way\d+/)+"";
		var selectedway = parseInt(tmp2.match(/\d+/))
		console.log( tmp2);
		console.log( 'way : '+selectedway );
	
		var mx = 0;
		var my = 0;
		mx = way [selectedway][0]-getPiecePositionX(selectedPiece);
		my = way [selectedway][1]-getPiecePositionY(selectedPiece);
		MovePiece(selectedPiece, mx, -my);
		
		switchMaterial ("selectedPiece", selectedPiece );
		selectedPiece = "none";
		clearWayables();
		 viewChessBoard();

	});
	$('#svg8').on('mousewheel', function(event) {
		 console.log(event.deltaX, event.deltaY, event.deltaFactor);
		 translateView (0, 0,event.deltaY*event.deltaFactor );
	 viewChessBoard()
	});
	$(window).on('resize', function() {
		disposeapplicationlayers();
	});
	
	//playspin = setInterval(spinview, 1);
	
	function spinview(){	

		 rotateViewZlock (0, increment, 0 );
		 viewChessBoard()
	 }

});
