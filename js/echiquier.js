var selectedfaces = [];
var nselectedfaces = 0;
var playspin;
var spinning = true;
		var mx = 0;
		var my = 0;
var selectedway;
var nWay = 0;
var selectedPiece = "none";
var hand = "w";
var chess = new Chess();
var plateau = [ 

	[["wt2"],["wc2"],["wf2"],["wk"],["wq"],["wf1"],["wc1"],["wt1"]],
	[["wp8"],["wp7"],["wp6"],["wp5"],["wp4"],["wp3"],["wp2"],["wp1"]],
	[["free"],["free"],["free"],["free"],["free"],["free"],["free"],["free"]],
	[["free"],["free"],["free"],["free"],["free"],["free"],["free"],["free"]],
	[["free"],["free"],["free"],["free"],["free"],["free"],["free"],["free"]],
	[["free"],["free"],["free"],["free"],["free"],["free"],["free"],["free"]],
	[["bp1"],["bp2"],["bp3"],["bp4"],["bp5"],["bp6"],["bp7"],["bp8"]],
	[["bt1"],["bc1"],["bf1"],["bk"],["bq"],["bf2"],["bc2"],["bt2"]]];



function Log(s)
{
	console.log(s);
}
function getTargetFromMove (a)
{
	if (a.includes('+') | a.includes('#')  )
		a = a.slice (0, a.length-1);
	if (a.includes('=R') | a.includes('=Q') | a.includes('=R') | a.includes('=B') | a.includes('=N')  )
		a = a.slice (0, a.length-2);
	while ( a.length > 2 ) a = a.slice (1, a.length);
	return a;
}
function ChessPiece  ( p )
{

	var px, py, ptype, pcolor;
	for ( var j = 0 ;  j < 8 ; j++ )
		for ( var i = 0 ; i < 8 ; i++ )
			if ( plateau[i][j] == p )
			{
				px = i;
				py = j;
			}
	if ( p.match(/^[wb]p[1-8]/gi)) ptype = "pawn";
	if ( p.match(/^[wb]t[1-2]/gi)) ptype = "tower";
	if ( p.match(/^[wb]c[1-2]/gi)) ptype = "knight";
	if ( p.match(/^[wb]f[1-2]/gi)) ptype = "bishop";
	if ( p.match(/^[wb]q/gi)) ptype = "queen";
	if ( p.match(/^[wb]k/gi)) ptype = "king";		
	
	if ( p.match(/^w/gi)) pcolor = "w";
	if ( p.match(/^b/gi)) pcolor = "b";
	if ( p.match(/^free/gi)) pcolor = "n";
	
	var hp0, hp1;
	if ( py == 7 ) hp0 = 'a';
	if ( py == 6 ) hp0 = 'b';
	if ( py == 5 ) hp0 = 'c';
	if ( py == 4 ) hp0 = 'd';
	if ( py == 3 ) hp0 = 'e';
	if ( py == 2 ) hp0 = 'f';
	if ( py == 1 ) hp0 = 'g';
	if ( py == 0 ) hp0 = 'h';

	if ( px == 0 ) hp1 = '1';
	if ( px == 1 ) hp1 = '2';
	if ( px == 2 ) hp1 = '3';
	if ( px == 3 ) hp1 = '4';
	if ( px == 4 ) hp1 = '5';
	if ( px == 5 ) hp1 = '6';
	if ( px == 6 ) hp1 = '7';
	if ( px == 7 ) hp1 = '8';
	var bp = hp0+hp1;
	
	return {position:{x:px, y:py}, type:ptype, color:pcolor, square : bp};
}
function XYToSquare (px, py)
{
	var hp0, hp1;
	if ( py == 7 ) hp0 = 'a';
	if ( py == 6 ) hp0 = 'b';
	if ( py == 5 ) hp0 = 'c';
	if ( py == 4 ) hp0 = 'd';
	if ( py == 3 ) hp0 = 'e';
	if ( py == 2 ) hp0 = 'f';
	if ( py == 1 ) hp0 = 'g';
	if ( py == 0 ) hp0 = 'h';

	if ( px == 0 ) hp1 = '1';
	if ( px == 1 ) hp1 = '2';
	if ( px == 2 ) hp1 = '3';
	if ( px == 3 ) hp1 = '4';
	if ( px == 4 ) hp1 = '5';
	if ( px == 5 ) hp1 = '6';
	if ( px == 6 ) hp1 = '7';
	if ( px == 7 ) hp1 = '8';
	var bp = hp0+hp1;
	
	return bp;
}
function SquareToXY (s)
{

	var hp0 = s.slice(0, 1);
	var hp1 = s.slice(1, 2);
	
	var px, py;
	
	if ( hp0 == 'a' ) py = 7;
	if ( hp0 == 'b' ) py = 6;
	if ( hp0 == 'c' ) py = 5;
	if ( hp0 == 'd' ) py = 4;
	if ( hp0 == 'e' ) py = 3;
	if ( hp0 == 'f' ) py = 2;
	if ( hp0 == 'g' ) py = 1;
	if ( hp0 == 'h' ) py = 0;
	
	if ( hp1 == '1' ) px = 0;
	if ( hp1 == '2' ) px = 1;
	if ( hp1 == '3' ) px = 2;
	if ( hp1 == '4' ) px = 3;
	if ( hp1 == '5' ) px = 4;
	if ( hp1 == '6' ) px = 5;
	if ( hp1 == '7' ) px = 6;
	if ( hp1 == '8' ) px = 7;
	
	return {x:px, y:py};
}

function showWay(p)
{
	var moves = chess.moves({square: ChessPiece(p).square});
	console.log (ChessPiece(p).square+' is allowed o go to :');
	

	for (var i = 0 ; i < moves.length ; i++)
	{
		Log (moves[i]);
		Log (getTargetFromMove(moves[i]));
		addToWayables(
		
		SquareToXY (getTargetFromMove(moves[i])).x, 
		SquareToXY (getTargetFromMove(moves[i])).y, 
		0
		);	
	}
}
function generateMaterialsCSS (name, difuse, specular)
{
// TODO: generate material from parameters
createClass('.selectedPiece',"fill: #33a !important;");
createClass('.selectedPiece-step-11',"fill: #44b !important;");
createClass('.selectedPiece-step-12',"fill: #55c !important;");
createClass('.selectedPiece-step-13',"fill: #66d !important;");
createClass('.selectedPiece-step-14',"fill: #7878e8 !important;");
createClass('.selectedPiece-step-15',"fill: #88f !important;");

}

function showMenu ()
{		
	$('#UI').css('display' , 'block' );
	$('#navhelper').css('display' , 'none' );
	//$('#closelayer').css('display' , 'block' );
}

function closeMenu ()
{
	$('#UI').css('display' , 'none' );
	$('#navhelper').css('display' , 'block' );
	//$('#closelayer').css('display' , 'none' );
}
function showPromotionUI ()
{		
	$('#PromotionUI').css('display' , 'block' );
	$('#navhelper').css('display' , 'none' );
}
function closePromotionUI ()
{		
	$('#PromotionUI').css('display' , 'none' );
	$('#navhelper').css('display' , 'block' );
}
function createClass(name,rules){
    var style = document.createElement('style');
    style.type = 'text/css';
    document.getElementsByTagName('head')[0].appendChild(style);
    if(!(style.sheet||{}).insertRule) 
        (style.styleSheet || style.sheet).addRule(name, rules);
    else
        style.sheet.insertRule(name+"{"+rules+"}",0);
}





$(window).on("load", function() {
		Log(document.getElementById("svg8").x);
	generateMaterialsCSS ();
	$("body").append('<object hidden type="audio/mpeg" width="100" height="40" data="chesssound/start1.ogg"><param name="filename" value="chesssound/start1.ogg" /><param name="autostart" value="true" /><param name="loop" value="false" /></object>');

	$("body").append('<object id="capture" hidden type="audio/mpeg" width="100" height="40" data="chesssound/capture2.ogg"><param name="filename" value="chesssound/capture2.ogg" /><param name="autostart" value="true" /><param name="loop" value="false" /></object>');


	disposeapplicationlayers();
	showMenu();

	loadPiecesWavefront();
	loadBoardWavefront();
	initViewZlock();
	
	
	$('body').on('click', '#close-menu', function() {
		closeMenu();
		window.clearInterval(playspin);
		
	});
	$('body').on('click', '#show-menu', function() {
		showMenu();
		playspin = setInterval(spinview, 1);
	});

	$('body').on('click', '#spin', function() {
		var spin = setInterval(showOBJ, 100);
	});
	/*
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
	
	*/
	//hammertime.get('pinch').set({ enable: true });
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
	
		var m = getfacematerial(this);
		

		if (selectedPiece != "none")
			switchMaterial ("selectedPiece", selectedPiece );
		selectedPiece = m;
		clearWayables ();
		showWay(selectedPiece);
		switchMaterial (m, "selectedPiece");
		viewChessBoard();
	});
	$('body').on('click', '#QueenPromotion', function() {
	
		var move = chess.move({ from: ChessPiece(selectedPiece).square , to: XYToSquare(way [selectedway][0], way [selectedway][1]), promotion: 'q'  });
		MovePiece(selectedPiece, mx, -my, move.flags);

		switchMaterial ("selectedPiece", selectedPiece );
		selectedPiece = "none";
		clearWayables();
		closePromotionUI();
		viewChessBoard();
	});
	$('body').on('click', '#RookPromotion', function() {
	
		var move = chess.move({ from: ChessPiece(selectedPiece).square , to: XYToSquare(way [selectedway][0], way [selectedway][1]), promotion: 'r'  });
		MovePiece(selectedPiece, mx, -my, move.flags);

		switchMaterial ("selectedPiece", selectedPiece );
		selectedPiece = "none";
		clearWayables();
		closePromotionUI();
		viewChessBoard();
	});
	$('body').on('click', '#KnightPromotion', function() {
	
		var move = chess.move({ from: ChessPiece(selectedPiece).square , to: XYToSquare(way [selectedway][0], way [selectedway][1]), promotion: 'n'  });
		MovePiece(selectedPiece, mx, -my, move.flags);

		switchMaterial ("selectedPiece", selectedPiece );
		selectedPiece = "none";
		clearWayables();
		closePromotionUI();
		viewChessBoard();
	});
	$('body').on('click', '#BishopPromotion', function() {
	
		var move = chess.move({ from: ChessPiece(selectedPiece).square , to: XYToSquare(way [selectedway][0], way [selectedway][1]), promotion: 'b'  });
		MovePiece(selectedPiece, mx, -my, move.flags);

		switchMaterial ("selectedPiece", selectedPiece );
		selectedPiece = "none";
		clearWayables();
		closePromotionUI();
		viewChessBoard();
	});
	$('body').on('click', '.way', function() {

		var tmp = $(this).attr('class');
		
		var tmp2 = tmp.match(/way\d+/)+"";
		selectedway = parseInt(tmp2.match(/\d+/))
	
		mx = way [selectedway][0]-ChessPiece(selectedPiece).position.x;
		my = way [selectedway][1]-ChessPiece(selectedPiece).position.y;
		if ( ( way [selectedway][0] == 7 | way [selectedway][0] == 0 ) && ChessPiece(selectedPiece).type == 'pawn' )
			showPromotionUI ();
		else
		{
			var move = chess.move({ from: ChessPiece(selectedPiece).square , to: XYToSquare(way [selectedway][0], way [selectedway][1])});
			MovePiece(selectedPiece, mx, -my, move.flags);
			switchMaterial ("selectedPiece", selectedPiece );
			selectedPiece = "none";
			clearWayables();
			viewChessBoard();
		}
	});
	$('#svg8').on('mousewheel', function(event) {

		translateView (0, 0, event.deltaY*event.deltaFactor );
		viewChessBoard()
	});
	$(window).on('resize', function() {
		disposeapplicationlayers();
	});
	
	playspin = setInterval(spinview, 50);
	
	function spinview(){	
		
		 rotateViewZlock (0, increment*2, 0 );
		 viewChessBoard()
	 }

});
