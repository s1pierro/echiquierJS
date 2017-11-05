var selectedfaces = [];
var nselectedfaces = 0;
var playspin;
var spinning = false;
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
var promotion= {from: 'a1', to:'a3', promo:'n'};
var selectedway;
var nWay = 0;
var selectedPiece = "none";
var hand = "w";
var chess = new Chess();
var mobileView = false;
var view = 'auto';

var plateau = 
      [ ["wt2", "wc2", "wf2", "wk",  "wq",  "wf1", "wc1", "wt1" ],
	["wp8", "wp7", "wp6", "wp5", "wp4", "wp3", "wp2", "wp1" ],
	["free","free","free","free","free","free","free","free"],
	["free","free","free","free","free","free","free","free"],
	["free","free","free","free","free","free","free","free"],
	["free","free","free","free","free","free","free","free"],
	["bp1", "bp2", "bp3", "bp4", "bp5", "bp6", "bp7", "bp8" ],
	["bt1", "bc1", "bf1", "bk",  "bq",  "bf2", "bc2", "bt2" ] ];
	
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
		
		if (plateau[SquareToXY (getTargetFromMove(moves[i])).x][SquareToXY (getTargetFromMove(moves[i])).y] != 'free' )
			switchMaterialInWavefrontById (buffer, plateau[SquareToXY (getTargetFromMove(moves[i])).x][SquareToXY (getTargetFromMove(moves[i])).y], "way");
		
		
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
*/
createClass('.'+name+'-step-0', 'fill: rgb('+Math.floor( difuse.r*0.5)+', '+Math.floor( difuse.g*0.5)+', '+Math.floor( difuse.b*0.5)+');');
createClass('.'+name+'-step-1', 'fill: rgb('+Math.floor( difuse.r*0.5)+', '+Math.floor( difuse.g*0.5)+', '+Math.floor( difuse.b*0.5)+');');
createClass('.'+name+'-step-2', 'fill: rgb('+Math.floor( difuse.r*0.5)+', '+Math.floor( difuse.g*0.5)+', '+Math.floor( difuse.b*0.5)+');');
createClass('.'+name+'-step-3', 'fill: rgb('+Math.floor( difuse.r*0.5)+', '+Math.floor( difuse.g*0.5)+', '+Math.floor( difuse.b*0.5)+');');
createClass('.'+name+'-step-4', 'fill: rgb('+Math.floor( difuse.r*0.5)+', '+Math.floor( difuse.g*0.5)+', '+Math.floor( difuse.b*0.5)+');');
createClass('.'+name+'-step-5', 'fill: rgb('+Math.floor( difuse.r*0.5)+', '+Math.floor( difuse.g*0.5)+', '+Math.floor( difuse.b*0.5)+');');
createClass('.'+name+'-step-6', 'fill: rgb('+Math.floor( difuse.r*0.5)+', '+Math.floor( difuse.g*0.5)+', '+Math.floor( difuse.b*0.5)+');');
createClass('.'+name+'-step-7', 'fill: rgb('+Math.floor( difuse.r*0.5)+', '+Math.floor( difuse.g*0.5)+', '+Math.floor( difuse.b*0.5)+');');
createClass('.'+name+'-step-8', 'fill: rgb('+Math.floor( difuse.r*0.5)+', '+Math.floor( difuse.g*0.5)+', '+Math.floor( difuse.b*0.5)+');');
createClass('.'+name+'-step-9', 'fill: rgb('+Math.floor( difuse.r*0.5)+', '+Math.floor( difuse.g*0.5)+', '+Math.floor( difuse.b*0.5)+');');/**/
createClass('.'+name+'-step-10', 'fill: rgb('+Math.floor( difuse.r*0.5)+', '+Math.floor( difuse.g*0.5)+', '+Math.floor( difuse.b*0.5)+');');
createClass('.'+name+'-step-11', 'fill: rgb('+Math.floor( difuse.r*0.6)+', '+Math.floor( difuse.g*0.6)+', '+Math.floor( difuse.b*0.6)+');');
createClass('.'+name+'-step-12', 'fill: rgb('+Math.floor( difuse.r*0.7)+', '+Math.floor( difuse.g*0.7)+', '+Math.floor( difuse.b*0.7)+');');
createClass('.'+name+'-step-13', 'fill: rgb('+Math.floor( difuse.r*0.8)+', '+Math.floor( difuse.g*0.8)+', '+Math.floor( difuse.b*0.8)+');');
createClass('.'+name+'-step-14', 'fill: rgb('+Math.floor( difuse.r*0.9)+', '+Math.floor( difuse.g*0.9)+', '+Math.floor( difuse.b*0.9)+');');
createClass('.'+name+'-step-15', 'fill: rgb('+Math.floor( difuse.r*1.0)+', '+Math.floor( difuse.g*1.0)+', '+Math.floor( difuse.b*1.0)+');');

}

function showUi ()
{		
	$('#ui').css('display' , 'block' );
	$('#navhelper').css('display' , 'none' );
	//$('#closelayer').css('display' , 'block' );
}

function closeUi ()
{
	$('#ui').css('display' , 'none' );
	$('#navhelper').css('display' , 'block' );
	//$('#closelayer').css('display' , 'none' );
}
function showRules ()
{		
	$('#RulesUI').css('display' , 'block' );
	$('#navhelper').css('display' , 'none' );
	//$('#closelayer').css('display' , 'block' );
}

function closeRules ()
{
	$('#RulesUI').css('display' , 'none' );
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
	if ( option == 'auto' )
	{ 
		if (w < 900 && h < 900 )
		view = 'mobile';
		else view = 'desktop';
	}
	else view = option;
	Log ('vue : '+view);

	var zoom = 100;
	var ratio = w/h;
 	
	$('#UI').css({'top' : 0 });
	$('#UI').css({'left' : 0 });
	$('#UI').css({'width' : w });
	$('#UI').css({'height' : h });

	$('#PromotionUI').css({'top' : 0 });
	$('#PromotionUI').css({'left' : 0 });
	$('#PromotionUI').css({'width' : w });
	$('#PromotionUI').css({'height' : h });

/*	$('#svg8').attr('width', w);
	$('#svg8').attr('height', h);	
 	$("#svg8").attr('viewBox', '-'+((zoom/2))+' -'+(zoom/ratio/2)+' '+zoom+' '+(zoom/ratio));
 */	if (w>h) {portrait=false;paysage=true;}
 	if (w<h) {portrait=true;paysage=false;}
		if ( portrait == true )
		{
//			$('.banner').css('width', '100vw');
//			$('.banner').attr('left', '0vw');
			$('#svg8').attr('width', w);
			$('#svg8').attr('height', h);
				
			$("#svg8").attr('viewBox', '-'+zoom/2+' -'+(zoom/2/ratio)+' '+zoom+' '+(zoom/ratio));

		}
		if ( paysage == true )
		{
//			$('.banner').css('width', '70vw');
//			$('.banner').attr('left', '15vw');
			$('#svg8').attr('width', w);
			$('#svg8').attr('height', h);
			$("#svg8").attr('viewBox', '-'+((zoom*ratio)/2)+' -'+(zoom/2)+' '+(zoom*ratio)+' '+zoom);

		}
		if ( view == 'mobile' )
		{
			Bwvft = $.extend(true, {}, loadWavefrontFromHTLM('#flatBishop', 'bishop'));
			Rwvft = $.extend(true, {}, loadWavefrontFromHTLM('#flatRook', 'rook'));
			Nwvft = $.extend(true, {}, loadWavefrontFromHTLM('#flatKnight', 'knight'));
			Pwvft = $.extend(true, {}, loadWavefrontFromHTLM('#flatPawn', 'pawn'));
			Qwvft = $.extend(true, {}, loadWavefrontFromHTLM('#flatQueen', 'queen'));
			Kwvft = $.extend(true, {}, loadWavefrontFromHTLM('#flatKing', 'king'));
			wvft = $.extend(true, {}, Pwvft);
			disposeFlatGameWavefrontsFrom_plateau ();
			initViewZlock(270, 0, 0, 560);

		}
		else {
			Bwvft = $.extend(true, {}, loadWavefrontFromHTLM('#bishop', 'bishop'));
			Rwvft = $.extend(true, {}, loadWavefrontFromHTLM('#rook', 'rook'));
			Nwvft = $.extend(true, {}, loadWavefrontFromHTLM('#knight', 'knight'));
			Pwvft = $.extend(true, {}, loadWavefrontFromHTLM('#pawn', 'pawn'));
			Qwvft = $.extend(true, {}, loadWavefrontFromHTLM('#queen', 'queen'));
			Kwvft = $.extend(true, {}, loadWavefrontFromHTLM('#king', 'king'));
			wvft = $.extend(true, {}, Pwvft);
			disposeGameWavefrontsFrom_plateau ();
			initViewZlock(230, 0, 0, 600);

		}

}
function checkGameState ( )
{
	
	if ( chess.insufficient_material() )
	{
		$('#endGameLayer > #endGameLayerContent > #matchResult').text ("Match nul, materiel insuffisant");
		$('#endGameLayer > #endGameLayerContent > #gameHistory').text ( chess.pgn({ max_width: 5, newline_char: '<br />' }));
	}
	if ( chess.in_check() )
	{
	
		
		if (chess.turn() == 'w')
		{
			$('#endGameLayer > #endGameLayerContent > #matchResult').text ( 'Les blancs sont en Echec');
			switchMaterialInWavefrontById(buffer, 'wk', 'incheck');	


		}
		if (chess.turn() == 'b') 
		{
			$('#endGameLayer > #endGameLayerContent > #matchResult').text ( 'Les noirs sont en Echec');
			$('#endGameLayer > #endGameLayerContent > #gameHistory').html ( '' );


		}
	}
	
	if ( chess.in_checkmate() )
	{
		if (chess.turn() == 'w') $('#matchResult').text ( 'Les blancs sont en Echec et mat');
		if (chess.turn() == 'b') $('#matchResult').text ( 'Les noirs sont en Echec et mat');
		$('#gameHistory').html ( chess.pgn({ max_width: 5, newline_char: '<br />' }));
	}
	if (chess.in_check() )
	{
		if (chess.turn() == 'w')
			switchMaterialInWavefrontById(buffer, 'wk', 'incheck');
		if (chess.turn() == 'b') 
			switchMaterialInWavefrontById(buffer, 'bk', 'incheck');	
		viewChessBoard();
	}
	if ( chess.game_over() )
	{
		$('#endGameLayer').css('display' , 'block' );
		$('#navhelper').css('display' , 'none' );
		viewChessBoard();
	}
}
function toggleView (view)
{
	var w = $(window).width();
	var h = $(window).height();
	var ratio = w/h;
	var z = 100;
	if (w>h) {portrait=false;paysage=true;}
 	if (w<h) {portrait=true;paysage=false;}

	if ( mobileView == true )
	{
		if ( portrait )
		{
			$('#svg8').attr('width', w);
			$('#svg8').attr('height', h);	
			$("#svg8").attr('viewBox', '-'+z/2+' -'+(z/2/ratio)+' '+z+' '+(z/ratio));
			initViewZlock(270, 0, 0, 1000);
		}
		if ( paysage )
		{
			$('#svg8').attr('width', w);
			$('#svg8').attr('height', h);	
			$("#svg8").attr('viewBox', '-'+((z*ratio)/2)+' -'+(z/2)+' '+(z*ratio)+' '+z);
			initViewZlock(270, 0, 0, 1000);
		}
	}
	else
	{

	}
}
function closeEndGameLayer ()
{		
	$('#endGameLayer').css('display' , 'none' );
	$('#navhelper').css('display' , 'block' );
}

$(window).on("load", function() {

	Log ('#=# cookie : '+Cookies.get('vue') );
	if ( Cookies.get('vue') == undefined ) 
	{
		view = 'auto';
		Cookies.set('vue', 'auto');
	}
	else
	{
		if ( Cookies.get('vue') == 'auto' ) view = 'auto';
		if ( Cookies.get('vue') == 'mobile' ) view = 'mobile';
		if ( Cookies.get('vue') == 'desktop' ) view = 'desktop';

	}
	Log ('#=# cookie : '+Cookies.get('vue') );
	
	buildPlateau ( );
	generateMaterialsCSS ('blancs', {r:253, g:231, b:135});
	generateMaterialsCSS ('noirs', {r:109, g:102, b:77});
	generateMaterialsCSS ('selectedPiece', {r:0, g:0, b:220});

	generateMaterialsCSS ('HARDbrown', {r:170, g:170, b:170});
	generateMaterialsCSS ('HARDcream',{r:245, g:245, b:245} );


	//audiostart.play();


	boardwvft = $.extend(true, {}, loadWavefrontFromHTLM('#board', 'board'));
	boardbuffer = $.extend(true, {}, boardwvft);


	disposeapplicationlayers(view);

	

	$('body').on('click', '#uiLayerFooter', function() {

		closeUi();
		
	});
	$('body').on('click', '#endGameLayerFooter', function() {

		closeEndGameLayer();
		
	});
	$('body').on('click', '#show-ui', function() {

		showUi();
	});


	$('body').on('click', '*', function() {

		$('.banner').css('display', 'none');
	});
	$('body').on('click', '#toggleViewMobile', function() {

		$('.selectedToggle').removeClass('selectedToggle');
		$('#toggleViewMobile').addClass('selectedToggle');
		view = 'mobile';
		Cookies.set('vue','mobile' );
		disposeapplicationlayers('mobile');
	});
	$('body').on('click', '#toggleViewDesktop', function() {
	
		$('.selectedToggle').removeClass('selectedToggle');
		$('#toggleViewDesktop').addClass('selectedToggle');
		view = 'desktop';
		Cookies.set('vue', 'desktop');
		disposeapplicationlayers('desktop');
	});
	$('body').on('click', '#toggleViewAuto', function() {

		$('.selectedToggle').removeClass('selectedToggle');
		$('#toggleViewAuto').addClass('selectedToggle');
		view = 'auto';
		Cookies.set('vue', 'auto');
		disposeapplicationlayers('auto');
	});
	$('.selectedToggle').removeClass('selectedToggle');
	var tmp = Cookies.set('vue');
	if (tmp == 'auto') $('#toggleViewAuto').addClass('selectedToggle');
	if (tmp == 'mobile') $('#toggleViewMobile').addClass('selectedToggle');
	if (tmp == 'desktop') $('#toggleViewDesktop').addClass('selectedToggle');
	

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
	if (view != 'mobile')
	{

		rotateViewZlock (ev.velocityY*15, ev.velocityX*15, 0 );
		$('#csl').text(ZlockANGx+'\n '+ZlockANGy+'\n '+ZlockANGz);
		viewChessBoard();
		
		if ( spinning == true )
		{
			window.clearInterval(playspin);
			spinning = false;
		}

	}
	});
	$('body').on('click', '#QueenPromotion', function() {
	

		var mv = chess.move({from:promotmp2.f, to: promotmp2.t, promotion: 'q'});
	
		MovePiece(promotmp, mx, -my, mv.flags);

		switchMaterial ("selectedPiece", promotmp );
		killPiece (promotmp);
		selectedPiece = "none";
		clearWayables();

		var newPiece = mv.color+'q1';
		TMPwvft = $.extend(true, {}, 	Qwvft);
		if ( mv.color == 'w') rotateWavefront (TMPwvft, 0, 180, 0);
		putPieceWavefrontToSquare (TMPwvft, mv.to)
		mergeWavefronts (wvft, TMPwvft);
		changeId(wvft, 'queen', newPiece);
		if ( mv.color == 'w') switchMaterialInWavefrontById(wvft, newPiece, 'blancs');	
		if ( mv.color == 'b') switchMaterialInWavefrontById(wvft, newPiece, 'noirs');	
		buffer = $.extend(true, {}, wvft);
		plateau[SquareToXY (mv.to).x][SquareToXY (mv.to).y] = newPiece;
		if (mv.color == 'w') generateMaterialsCSS (newPiece, white);
		else if (mv.color == 'b') generateMaterialsCSS (newPiece, black);
		
		closePromotionUI();
		viewChessBoard();
		checkGameState ();
	});

	$('body').on('click', '#RookPromotion', function() {
	
		var mv = chess.move({from:promotmp2.f, to: promotmp2.t, promotion: 'r'});
	
		MovePiece(promotmp, mx, -my, mv.flags);

		switchMaterial ("selectedPiece", promotmp );
		killPiece (promotmp);
		selectedPiece = "none";
		clearWayables();

		var newPiece = mv.color+'t3';
		TMPwvft = $.extend(true, {}, 	Rwvft);
		if ( mv.color == 'w') rotateWavefront (TMPwvft, 0, 180, 0);
		putPieceWavefrontToSquare (TMPwvft, mv.to)
		mergeWavefronts (wvft, TMPwvft);
		changeId(wvft, 'rook', newPiece);
		if ( mv.color == 'w') switchMaterialInWavefrontById(wvft, newPiece, 'blancs');	
		if ( mv.color == 'b') switchMaterialInWavefrontById(wvft, newPiece, 'noirs');	
		buffer = $.extend(true, {}, wvft);
		plateau[SquareToXY (mv.to).x][SquareToXY (mv.to).y] = newPiece;
		if (mv.color == 'w') generateMaterialsCSS (newPiece, white);
		else if (mv.color == 'b') generateMaterialsCSS (newPiece, black);
		
		closePromotionUI();
		viewChessBoard();
		checkGameState ();
	});
	$('body').on('click', '#KnightPromotion', function() {
	
		var mv = chess.move({from:promotmp2.f, to: promotmp2.t, promotion: 'n'});
	
		MovePiece(promotmp, mx, -my, mv.flags);

		switchMaterial ("selectedPiece", promotmp );
		killPiece (promotmp);
		selectedPiece = "none";
		clearWayables();

		var newPiece = mv.color+'c3';
		TMPwvft = $.extend(true, {}, 	Nwvft);
		if ( mv.color == 'w') rotateWavefront (TMPwvft, 0, 180, 0);
		putPieceWavefrontToSquare (TMPwvft, mv.to)
		mergeWavefronts (wvft, TMPwvft);
		changeId(wvft, 'knight', newPiece);
		if ( mv.color == 'w') switchMaterialInWavefrontById(wvft, newPiece, 'blancs');	
		if ( mv.color == 'b') switchMaterialInWavefrontById(wvft, newPiece, 'noirs');	
		buffer = $.extend(true, {}, wvft);
		plateau[SquareToXY (mv.to).x][SquareToXY (mv.to).y] = newPiece;
		if (mv.color == 'w') generateMaterialsCSS (newPiece, white);
		else if (mv.color == 'b') generateMaterialsCSS (newPiece, black);
		
		closePromotionUI();
		viewChessBoard();
		checkGameState ();
	});
	$('body').on('click', '#BishopPromotion', function() {
	

		var mv = chess.move({from:promotmp2.f, to: promotmp2.t, promotion: 'b'});
	
		MovePiece(promotmp, mx, -my, mv.flags);

		switchMaterial ("selectedPiece", promotmp );
		killPiece (promotmp);
		selectedPiece = "none";
		clearWayables();

		var newPiece = mv.color+'f3';
		TMPwvft = $.extend(true, {}, 	Bwvft);
		if ( mv.color == 'w') rotateWavefront (TMPwvft, 0, 180, 0);
		putPieceWavefrontToSquare (TMPwvft, mv.to)
		mergeWavefronts (wvft, TMPwvft);
		changeId(wvft, 'bishop', newPiece);
		if ( mv.color == 'w') switchMaterialInWavefrontById(wvft, newPiece, 'blancs');	
		if ( mv.color == 'b') switchMaterialInWavefrontById(wvft, newPiece, 'noirs');	
		buffer = $.extend(true, {}, wvft);
		plateau[SquareToXY (mv.to).x][SquareToXY (mv.to).y] = newPiece;
		if (mv.color == 'w') generateMaterialsCSS (newPiece, white);
		else if (mv.color == 'b') generateMaterialsCSS (newPiece, black);
		
		closePromotionUI();
		viewChessBoard();
		checkGameState ();
	});
	$('body').on('click', '.way', function() {
		//audiomove.play();
					var id = getFaceId(this);
		var tmp = $(this).attr('class');
		
		var tmp2 = tmp.match(/way\d+/)+"";
		selectedway = parseInt(tmp2.match(/\d+/))
		if (chess.turn != ChessPiece(selectedPiece).color )
		{

		Log ('>>>>>>>>>> capture !');
			for ( var i = 0 ; i < way2.length ; i++ )
			{
		Log ('   way2['+i+'].square : '+way2[i].square);
		Log ('   ChessPiece('+id+').square : '+ChessPiece(id).square);
			if (ChessPiece(id).square == way2[i].square )
			
			selectedway = i;
			}
		}

		

		mx = SquareToXY(way2 [selectedway].square).x-ChessPiece(selectedPiece).position.x;
		my = SquareToXY(way2 [selectedway].square).y-ChessPiece(selectedPiece).position.y;
		
		
		if ( ( SquareToXY(way2[selectedway].square).x == 7 | SquareToXY(way2[selectedway].square).x == 0 ) && ChessPiece(selectedPiece).type == 'pawn' )
		{
			promotion = way2[selectedway].move;
			promotmp = selectedPiece;
			promotmp2 = {f:ChessPiece(selectedPiece).square, t:way2[selectedway].square};
			showPromotionUI ();
		
		}

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
			
		buffer = $.extend(true, {}, wvft);
			selectedPiece = "none";
			clearWayables();
			viewChessBoard();
			Log(chess.pgn({ max_width: 5, newline_char: '\n' }));
			
			checkGameState ();
		}
		
		
				
	});
	$('body').on('click', '.piece', function() {
	

		var id = getFaceId(this);
		
Log ('id : '+id);
		if (selectedPiece != "none")
			buffer = $.extend(true, {}, wvft);

		selectedPiece = id;
		clearWayables ();
		showWay(selectedPiece);
		switchMaterialInWavefrontById (buffer, selectedPiece, "selectedPiece");
		viewChessBoard();
	});

	$('#svg8').on('mousewheel', function(event) {
	if (view != 'mobile')
	{


		translateView (0, 0, event.deltaY*event.deltaFactor );
		viewChessBoard();
	}
	});
	$(window).on('resize', function() {
		disposeapplicationlayers(Cookies.get('vue'));
	});
	
	//playspin = setInterval(spinview, 50);
	
	function spinview(){	
		
		 rotateViewZlock (0, increment*2, 0 );
		 viewChessBoard()
	 }

});
function countPieceOnPlateau ( piece, color )
{
	cnt= 0;
	for ( var j = 0 ;  j < 8 ; j++ )
		for ( var i = 0 ; i < 8 ; i++ )
		{
			if ( ChessPiece(plateau[i][j]).type == piece && ChessPiece(plateau[i][j]).color == color) cnt++;
			
			
		}
}
function buildPlateau ( )
{
	var b = chess.board();
	
	console.log (b[0][0]);

}

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
	
				if ( firstAdd == false )
				{
					mergeWavefronts (wvft, TMPwvft);
				}

				if ( firstAdd == true )
				{
					wvft = $.extend(true, {}, TMPwvft);

					firstAdd = false;
				}
				if ( ChessPiece(piece).color == 'w') switchMaterialInWavefront(wvft, ChessPiece(piece).type, 'blancs');
				if ( ChessPiece(piece).color == 'b') switchMaterialInWavefront(wvft, ChessPiece(piece).type, 'noirs');
				changeId(wvft, ChessPiece(piece).type, piece);
			}
	buffer = $.extend(true, {}, wvft);
}
function disposeFlatGameWavefrontsFrom_plateau ()
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
				
				translateWavefront (TMPwvft, 0, -10, 20)
				
				//if ( ChessPiece(piece).color == 'w') rotateWavefront (TMPwvft, 0, 180, 0);
				putPieceWavefrontToSquare (TMPwvft, XYToSquare(i, j));
	
				if ( firstAdd == false )
				{
					mergeWavefronts (wvft, TMPwvft);
				}

				if ( firstAdd == true )
				{
					wvft = $.extend(true, {}, TMPwvft);

					firstAdd = false;
				}
				if ( ChessPiece(piece).color == 'w') switchMaterialInWavefront(wvft, ChessPiece(piece).type, 'blancs');
				if ( ChessPiece(piece).color == 'b') switchMaterialInWavefront(wvft, ChessPiece(piece).type, 'noirs');
				changeId(wvft, ChessPiece(piece).type, piece);
			}
	buffer = $.extend(true, {}, wvft);
}
	
