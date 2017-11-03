var selectedfaces = [];
var nselectedfaces = 0;
var playspin;
var spinning = true;
		var mx = 0;
		var my = 0;
		var white = {r:255, g:255, b:255};
	var black = {r:100, g:100, b:100};
	
var Pwvft = {};
var Rwvft = {};
var Nwvft = {};
var Bwvft = {};
var Qwvft = {};
var Kwvft = {};
var TMPwvft = {};

var selectedway;
var nWay = 0;
var selectedPiece = "none";
var hand = "w";
var chess = new Chess();

var plateau = [ 

	["wt2","wc2","wf2","wk","wq","wf1","wc1","wt1"],
	["wp8","wp7","wp6","wp5","wp4","wp3","wp2","wp1"],
	["free","free","free","free","free","free","free","free"],
	["free","free","free","free","free","free","free","free"],
	["free","free","free","free","free","free","free","free"],
	["free","free","free","free","free","free","free","free"],
	["bp1","bp2","bp3","bp4","bp5","bp6","bp7","bp8"],
	["bt1","bc1","bf1","bk","bq","bf2","bc2","bt2"]];
	
var audiostart = new Audio('chesssound/start1.ogg');
var audiomove = new Audio('chesssound/move1.ogg');
var audiocapture = new Audio('chesssound/capture1.ogg');



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
		
		console.log ('getting from : '+a);
	
	if ( a == 'O-O-O')
	{
		console.log ('little roque');
		if (chess.turn() == 'w')
			a = "c1";
		else if (chess.turn() == 'b')
			a = "c8";
	}
	if ( a == 'O-O' )
	{
		if (chess.turn() == 'w')
			a = "g1";
		else if (chess.turn() == 'b')
			a = "g8";
	}
	
	while ( a.length > 2 ) a = a.slice (1, a.length);
	return a;
}
function ChessPiece  ( p )
{

	//p = p+"";
	var px, py, ptype, pcolor;
	for ( var j = 0 ;  j < 8 ; j++ )
		for ( var i = 0 ; i < 8 ; i++ )
			if ( plateau[i][j] == p )
			{
				px = i;
				py = j;
			}
	if ( p.match(/^[wb]p[1-8]/gi)) ptype = "pawn";
	if ( p.match(/^[wb]t[1-2]/gi)) ptype = "rook";
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
	way2.splice(0, way2.length);
	
	

	for (var i = 0 ; i < moves.length ; i++)
	{
	//	Log (moves[i]);
	//	Log (getTargetFromMove(moves[i]));
		
		addToWayables(
		
		SquareToXY (getTargetFromMove(moves[i])).x, 
		SquareToXY (getTargetFromMove(moves[i])).y, 
		0
		);	
		var aWay = {square:getTargetFromMove(moves[i]), move: moves[i]};
		way2.push(aWay);

	}
	
	
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



function generateMaterialsCSS (name, difuse)
{

createClass('.'+name,'fill: rgb('+Math.floor( difuse.r*0.6)+', '+Math.floor( difuse.g*0.6)+', '+Math.floor( difuse.b*0.6)+');');

/*
On Chromium web browser, framerate is dramaticaly affected by css rules quantity.

createClass('.'+name+'-step-0', 'fill: rgb('+Math.floor( difuse.r*0.5)+', '+Math.floor( difuse.g*0.5)+', '+Math.floor( difuse.b*0.5)+');');
createClass('.'+name+'-step-1', 'fill: rgb('+Math.floor( difuse.r*0.5)+', '+Math.floor( difuse.g*0.5)+', '+Math.floor( difuse.b*0.5)+');');
createClass('.'+name+'-step-2', 'fill: rgb('+Math.floor( difuse.r*0.5)+', '+Math.floor( difuse.g*0.5)+', '+Math.floor( difuse.b*0.5)+');');
createClass('.'+name+'-step-3', 'fill: rgb('+Math.floor( difuse.r*0.5)+', '+Math.floor( difuse.g*0.5)+', '+Math.floor( difuse.b*0.5)+');');
createClass('.'+name+'-step-4', 'fill: rgb('+Math.floor( difuse.r*0.5)+', '+Math.floor( difuse.g*0.5)+', '+Math.floor( difuse.b*0.5)+');');
createClass('.'+name+'-step-5', 'fill: rgb('+Math.floor( difuse.r*0.5)+', '+Math.floor( difuse.g*0.5)+', '+Math.floor( difuse.b*0.5)+');');
createClass('.'+name+'-step-6', 'fill: rgb('+Math.floor( difuse.r*0.5)+', '+Math.floor( difuse.g*0.5)+', '+Math.floor( difuse.b*0.5)+');');
createClass('.'+name+'-step-7', 'fill: rgb('+Math.floor( difuse.r*0.5)+', '+Math.floor( difuse.g*0.5)+', '+Math.floor( difuse.b*0.5)+');');
createClass('.'+name+'-step-8', 'fill: rgb('+Math.floor( difuse.r*0.5)+', '+Math.floor( difuse.g*0.5)+', '+Math.floor( difuse.b*0.5)+');');
createClass('.'+name+'-step-9', 'fill: rgb('+Math.floor( difuse.r*0.5)+', '+Math.floor( difuse.g*0.5)+', '+Math.floor( difuse.b*0.5)+');');*/
createClass('.'+name+'-step-10', 'fill: rgb('+Math.floor( difuse.r*0.5)+', '+Math.floor( difuse.g*0.5)+', '+Math.floor( difuse.b*0.5)+');');
createClass('.'+name+'-step-11', 'fill: rgb('+Math.floor( difuse.r*0.6)+', '+Math.floor( difuse.g*0.6)+', '+Math.floor( difuse.b*0.6)+');');
createClass('.'+name+'-step-12', 'fill: rgb('+Math.floor( difuse.r*0.7)+', '+Math.floor( difuse.g*0.7)+', '+Math.floor( difuse.b*0.7)+');');
createClass('.'+name+'-step-13', 'fill: rgb('+Math.floor( difuse.r*0.8)+', '+Math.floor( difuse.g*0.8)+', '+Math.floor( difuse.b*0.8)+');');
createClass('.'+name+'-step-14', 'fill: rgb('+Math.floor( difuse.r*0.9)+', '+Math.floor( difuse.g*0.9)+', '+Math.floor( difuse.b*0.9)+');');
createClass('.'+name+'-step-15', 'fill: rgb('+Math.floor( difuse.r*1.0)+', '+Math.floor( difuse.g*1.0)+', '+Math.floor( difuse.b*1.0)+');');

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
function disposeapplicationlayers (option)
{		
	var w = $(window).width();
	var h = $(window).height();
	var zoom = 80;
	var ratio = w/h;
 	
	$('#UI').css({'top' : 0 });
	$('#UI').css({'left' : 0 });
	$('#UI').css({'width' : w });
	$('#UI').css({'height' : h });

	$('#PromotionUI').css({'top' : 0 });
	$('#PromotionUI').css({'left' : 0 });
	$('#PromotionUI').css({'width' : w });
	$('#PromotionUI').css({'height' : h });

	$('#svg8').attr('width', w);
	$('#svg8').attr('height', h);	
 	$("#svg8").attr('viewBox', '-'+((zoom/2))+' -'+(zoom/ratio/2)+' '+zoom+' '+(zoom/ratio));
}
$(window).on("load", function() {

	

	generateMaterialsCSS ('selectedPiece', {r:0, g:0, b:255});

	audiostart.play();

	disposeapplicationlayers();
	showMenu();

	Bwvft = $.extend(true, {}, loadWavefrontFromHTLM('#bishop'));
	Rwvft = $.extend(true, {}, loadWavefrontFromHTLM('#rook'));
	Nwvft = $.extend(true, {}, loadWavefrontFromHTLM('#knight'));
	Pwvft = $.extend(true, {}, loadWavefrontFromHTLM('#pawn'));
	Qwvft = $.extend(true, {}, loadWavefrontFromHTLM('#queen'));
	Kwvft = $.extend(true, {}, loadWavefrontFromHTLM('#king'));

	disposeGameWavefrontsFrom_plateau ();

	Log ('type plateau[][] : '+typeof(plateau[0][0]));
	Log ('type wvft.triangles[].mat : '+typeof(wvft.triangles[0].mat));


	boardwvft = $.extend(true, {}, loadWavefrontFromHTLM('#board'));
	boardbuffer = $.extend(true, {}, boardwvft);
	
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
	
		var move = chess.move({ from: ChessPiece(selectedPiece).square , to: way2[selectedway].square, promotion: 'q'  });
		MovePiece(selectedPiece, mx, -my, move.flags);

		switchMaterial ("selectedPiece", selectedPiece );
		killPiece (selectedPiece);
		selectedPiece = "none";
		clearWayables();


		var newPiece = move.color+'q1';
		TMPwvft = $.extend(true, {}, 	Qwvft);
		putPieceWavefrontToSquare (TMPwvft, move.to)
		mergeWavefronts (wvft, TMPwvft);
		switchMaterialInWavefront(wvft, 'queen', newPiece);
		buffer = $.extend(true, {}, wvft);
		plateau[SquareToXY (move.to).x][SquareToXY (move.to).y] = newPiece;
		if (move.color == 'w') generateMaterialsCSS (newPiece, white);
		else if (move.color == 'b') generateMaterialsCSS (newPiece, black);
		
		closePromotionUI();
		viewChessBoard();
	});
	$('body').on('click', '#RookPromotion', function() {
	
		var move = chess.move({ from: ChessPiece(selectedPiece).square , to: way2[selectedway].square, promotion: 'r'  });
		MovePiece(selectedPiece, mx, -my, move.flags);

		switchMaterial ("selectedPiece", selectedPiece );
		killPiece (selectedPiece);
		selectedPiece = "none";
		clearWayables();

		var newPiece = move.color+'t3';
		TMPwvft = $.extend(true, {}, 	Rwvft);
		putPieceWavefrontToSquare (TMPwvft, move.to)
		mergeWavefronts (wvft, TMPwvft);
		switchMaterialInWavefront(wvft, 'rook', newPiece);
		buffer = $.extend(true, {}, wvft);
		plateau[SquareToXY (move.to).x][SquareToXY (move.to).y] = newPiece;
		if (move.color == 'w') generateMaterialsCSS (newPiece, white);
		else if (move.color == 'b') generateMaterialsCSS (newPiece, black);
		
		closePromotionUI();
		viewChessBoard();
	});
	$('body').on('click', '#KnightPromotion', function() {
	
		var move = chess.move({ from: ChessPiece(selectedPiece).square , to: way2[selectedway].square, promotion: 'n'  });
		MovePiece(selectedPiece, mx, -my, move.flags);

		switchMaterial ("selectedPiece", selectedPiece );
		killPiece (selectedPiece);
		selectedPiece = "none";
		clearWayables();

		var newPiece = move.color+'c3';
		TMPwvft = $.extend(true, {}, 	Nwvft);
		putPieceWavefrontToSquare (TMPwvft, move.to)
		mergeWavefronts (wvft, TMPwvft);
		switchMaterialInWavefront(wvft, 'knight', newPiece);
		buffer = $.extend(true, {}, wvft);
		plateau[SquareToXY (move.to).x][SquareToXY (move.to).y] = newPiece;
		if (move.color == 'w') generateMaterialsCSS (newPiece, white);
		else if (move.color == 'b') generateMaterialsCSS (newPiece, black);
		
		closePromotionUI();
		viewChessBoard();
	});
	$('body').on('click', '#BishopPromotion', function() {
	
		var move = chess.move({ from: ChessPiece(selectedPiece).square , to: way2[selectedway].square, promotion: 'b'  });
		MovePiece(selectedPiece, mx, -my, move.flags);

		switchMaterial ("selectedPiece", selectedPiece );
		killPiece (selectedPiece);
		selectedPiece = "none";
		clearWayables();

		var newPiece = move.color+'f3';
		TMPwvft = $.extend(true, {}, 	Bwvft);
		putPieceWavefrontToSquare (TMPwvft, move.to)
		mergeWavefronts (wvft, TMPwvft);
		switchMaterialInWavefront(wvft, 'bishop', newPiece);
		buffer = $.extend(true, {}, wvft);
		plateau[SquareToXY (move.to).x][SquareToXY (move.to).y] = newPiece;
		if (move.color == 'w') generateMaterialsCSS (newPiece, white);
		else if (move.color == 'b') generateMaterialsCSS (newPiece, black);
		
		closePromotionUI();
		viewChessBoard();
	});
	$('body').on('click', '.way', function() {
		//audiomove.play();
		var tmp = $(this).attr('class');
		
		var tmp2 = tmp.match(/way\d+/)+"";
		selectedway = parseInt(tmp2.match(/\d+/))

		mx = SquareToXY(way2 [selectedway].square).x-ChessPiece(selectedPiece).position.x;
		my = SquareToXY(way2 [selectedway].square).y-ChessPiece(selectedPiece).position.y;
		
		
		
		if ( ( SquareToXY(way2[selectedway].square).x == 7 | SquareToXY(way2[selectedway].square).x == 0 ) && ChessPiece(selectedPiece).type == 'pawn' )
			showPromotionUI ();
		else
		{
			var move = chess.move(way2[selectedway].move);

			if (move.flags == 'q') 
			{
				if (chess.turn() == 'b')
				{
					MovePiece('wt1', 0, 3, move.flags);
				}
				else if (chess.turn() == 'w')
				{
					MovePiece('bt2', 0, 3, move.flags);
				}
			}
			if (move.flags == 'k')
			{
				if (chess.turn() == 'b')
				{
					MovePiece('wt2', 0, -2, move.flags);
				
				}
				else if (chess.turn() == 'w')
				{
					MovePiece('bt1', 0, -2, move.flags);
				
				}
			}
			
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
function disposeGameWavefrontsFrom_plateau ()
{
	var firstAdd = true;

	for ( var j = 0 ;  j < 8 ; j++ )
		for ( var i = 0 ; i < 8 ; i++ )
			if ( plateau[i][j] != "free" )
			{
				var piece = plateau[i][j];
				Log ('found '+plateau[i][j]+' on '+i+', '+j+' > '+ChessPiece(plateau[i][j]+"").type);
				
				if ( ChessPiece(piece).type == 'pawn'   ) TMPwvft = $.extend(true, {}, Pwvft);
				if ( ChessPiece(piece).type == 'rook'   ) TMPwvft = $.extend(true, {}, Rwvft);
				if ( ChessPiece(piece).type == 'knight' ) TMPwvft = $.extend(true, {}, Nwvft);
				if ( ChessPiece(piece).type == 'bishop' ) TMPwvft = $.extend(true, {}, Bwvft);
				if ( ChessPiece(piece).type == 'king'   ) TMPwvft = $.extend(true, {}, Kwvft);
				if ( ChessPiece(piece).type == 'queen'  ) TMPwvft = $.extend(true, {}, Qwvft);

				if ( ChessPiece(piece).color == 'w') rotateWavefront (TMPwvft, 0, 180, 0);
				putPieceWavefrontToSquare (TMPwvft, XYToSquare(i, j));
	
				if ( firstAdd == false ) mergeWavefronts (wvft, TMPwvft);

				if ( firstAdd == true )
				{
					wvft = $.extend(true, {}, TMPwvft);
					firstAdd = false;
				}
				switchMaterialInWavefront(wvft, ChessPiece(piece).type, plateau[i][j]);
				if ( ChessPiece(piece).color == 'w') generateMaterialsCSS (plateau[i][j], white);
				if ( ChessPiece(piece).color == 'b') generateMaterialsCSS (plateau[i][j], black);
			}
	buffer = $.extend(true, {}, wvft);
}
	
