
var Pwvft = {};
var Rwvft = {};
var Nwvft = {};
var Bwvft = {};
var Qwvft = {};
var Kwvft = {};
var TMPwvft = {};
var way = [];
var promotion= {from: 'a1', to:'a3', promo:'n'};
var selectedPiece = "none";
var hand = "w";
var chess = new Chess();
var view = 'auto';
var Pieces = [];
var playspin;
var audiostart = new Audio('chesssound/start1.ogg');
var audiomove = new Audio('chesssound/move1.ogg');
var audiocapture = new Audio('chesssound/capture1.ogg');
var audiocheck = new Audio('chesssound/check1.ogg');
var audiocastle = new Audio('chesssound/castle.ogg');
var audioenpassant = new Audio('chesssound/mov2.ogg');
var audiowin = new Audio('chesssound/win1.ogg');
var audiodraw = new Audio('chesssound/draw1.ogg');


function buildPieces ()
{
	if ( view != 'mobile' ) 
	{
		Bwvft = $.extend(true, {}, loadWavefrontFromHTLM('#bishop', 'bishop'));
		Rwvft = $.extend(true, {}, loadWavefrontFromHTLM('#rook', 'rook'));
		Nwvft = $.extend(true, {}, loadWavefrontFromHTLM('#knight', 'knight'));
		Pwvft = $.extend(true, {}, loadWavefrontFromHTLM('#pawn', 'pawn'));
		Qwvft = $.extend(true, {}, loadWavefrontFromHTLM('#queen', 'queen'));
		Kwvft = $.extend(true, {}, loadWavefrontFromHTLM('#king', 'king'));
	}
	else
	{
		Bwvft = $.extend(true, {}, loadWavefrontFromHTLM('#flatBishop', 'bishop'));
		Rwvft = $.extend(true, {}, loadWavefrontFromHTLM('#flatRook', 'rook'));
		Nwvft = $.extend(true, {}, loadWavefrontFromHTLM('#flatKnight', 'knight'));
		Pwvft = $.extend(true, {}, loadWavefrontFromHTLM('#flatPawn', 'pawn'));
		Qwvft = $.extend(true, {}, loadWavefrontFromHTLM('#flatQueen', 'queen'));
		Kwvft = $.extend(true, {}, loadWavefrontFromHTLM('#flatKing', 'king'));
	}

	Pieces.splice (0,Pieces.length );
	var tmpWvft2 = {};
	for ( var v = 0 ; v < 8 ; v++ )
	for ( var u = 0 ; u < 8 ; u++ )
	{
		var square = XYToSquare(u, v)
		if (chess.get(square) != null )
		{
			if (chess.get(square).type == 'p' ) tmpWvft2 = $.extend(true, {}, Pwvft);
			if (chess.get(square).type == 'n' ) tmpWvft2 = $.extend(true, {}, Nwvft);
			if (chess.get(square).type == 'b' ) tmpWvft2 = $.extend(true, {}, Bwvft);
			if (chess.get(square).type == 'r' ) tmpWvft2 = $.extend(true, {}, Rwvft);
			if (chess.get(square).type == 'q' ) tmpWvft2 = $.extend(true, {}, Qwvft);
			if (chess.get(square).type == 'k' ) tmpWvft2 = $.extend(true, {}, Kwvft);
			altPiece = {id: Pieces.length, square: square, x: u, y: v, flags: '', index: 0, color: chess.get(square).color, type: chess.get(square).type, w: {}};
			setWavefrontId(tmpWvft2, Pieces.length);
			if ( chess.get(square).color == 'w')
				switchMaterialWavefront (tmpWvft2, 'blancs');
			if ( chess.get(square).color == 'b')
				switchMaterialWavefront (tmpWvft2, 'noirs');
			if ( view == 'mobile' ) 
				if ( chess.get(square).type == 'p' == 'pawn'   ) 
					translateWavefront (tmpWvft2, 0, -13, 20);
				else translateWavefront (tmpWvft2, 0, -13, 23)
			else
				if ( chess.get(square).color == 'w')
					rotateWavefront (tmpWvft2, 0, 180, 0);
			translateWavefront (tmpWvft2, -v*64+224, 0, -u*64+224 );
			altPiece.w = $.extend(true, {},tmpWvft2 );
			Pieces.push(altPiece);
		}
	}
}
function getTargetFromMove (a)
{
	if (a.includes('+') | a.includes('#')  )
		a = a.slice (0, a.length-1);
	if (a.includes('=R') | a.includes('=Q') | a.includes('=R') | a.includes('=B') | a.includes('=N')  )
		a = a.slice (0, a.length-2);	
	if ( a == 'O-O-O')
	{
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
function isPromotionMove(a)
{
	if (a.includes('=R') | a.includes('=Q') | a.includes('=R') | a.includes('=B') | a.includes('=N')  )
	return true;
	else return false;
}

function showWay(p)
{
	var moves = chess.moves({square: Pieces[p].square});
	
	way.splice(0, way.length);

	for (var i = 0 ; i < moves.length ; i++)
	{
		addToWayables(	SquareToXY (getTargetFromMove(moves[i])).x, 
				SquareToXY (getTargetFromMove(moves[i])).y, 0 );	
		var aWay = { square: getTargetFromMove(moves[i]), move: moves[i] };
		if (chess.get(aWay.square) != null )
		{
			for ( var j = 0 ; j < Pieces.length ; j++ )
			{
			if (Pieces[j].square == aWay.square)
			switchMaterialWavefront ( Pieces[j].w, "way way"+i);
			}
		}
		way.push(aWay);
	}	
}
function clearWayables ()
{
	boardwvft = loadWavefrontFromHTLM('#board');
	boardbuffer = $.extend(true, {}, boardwvft);
	for ( var i = 0 ; i < Pieces.length ; i++ )
	{
		if ( Pieces[i].color == 'w')
			switchMaterialWavefront (Pieces[i].w, 'blancs');
		if ( Pieces[i].color == 'b')
			switchMaterialWavefront (Pieces[i].w, 'noirs');
	}
	way.splice(0, way.length );
}
function addToWayables (x, y, i)
{
	var xs = 224;
	var ys = 224;
	var mrg = 32;
	var stp = 64;
	var z = 0;
	var tmp = boardwvft.vertices.length;
	var v = [-y*stp-mrg+xs, z, -x*stp-mrg+ys ];
	boardwvft.vertices.push(v);
	var v1 = [-y*stp-mrg+xs, z, -x*stp+mrg+ys ];
	boardwvft.vertices.push(v1);
	var v2 = [-y*stp+mrg+xs, z, -x*stp+mrg+ys ];
	boardwvft.vertices.push(v2);
	var v3 = [-y*stp+mrg+xs, z, -x*stp-mrg+ys ];
	boardwvft.vertices.push(v3);

	var t = [tmp+2, tmp+4, tmp+1];
	boardwvft.triangles.push(t);
	t = [tmp+4, tmp+2, tmp+3];
	boardwvft.triangles.push(t);

	boardwvft.nt = boardwvft.nt+2;
	boardwvft.nv = boardwvft.nv+4;

	var n = [ 0.0, 1.0, 0.0];
	boardwvft.triangles[boardwvft.nt-1].mat = "way"+way.length;
	boardwvft.triangles[boardwvft.nt-1].n=n;
	boardwvft.triangles[boardwvft.nt-2].mat = "way"+way.length;
	boardwvft.triangles[boardwvft.nt-2].n=n;
	
	boardbuffer = $.extend(true, {}, boardwvft);

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

	if (w>h) {portrait=false;paysage=true;}
 	if (w<h) {portrait=true;paysage=false;}
	if ( portrait == true )
	{
		$('#svg8').attr('width', w);
		$('#svg8').attr('height', h);	
		$("#svg8").attr('viewBox', '-'+zoom/2+' -'+(zoom/2/ratio)+' '+zoom+' '+(zoom/ratio));
	}
	if ( paysage == true )
	{
		$('#svg8').attr('width', w);
		$('#svg8').attr('height', h);
		$("#svg8").attr('viewBox', '-'+((zoom*ratio)/2)+' -'+(zoom/2)+' '+(zoom*ratio)+' '+zoom);
	}
	if ( view == 'mobile' )
	{
		buildPieces ();
		initViewZlock(270, 0, 0, 770);
	}
	else {
		buildPieces ();
		initViewZlock(192, 90, 0, 790);
	}
}
function checkGameState() {
	if (chess.insufficient_material()) {
		$('#matchResult').text("MatchPartie nulle, materiel insuffisant");
		$('#gameHistory').text(chess.pgn({
			max_width: 15,
			newline_char: '<br />'
		}));
	}
	if (chess.in_check()) {
		if (chess.turn() == 'w') {
			$('#matchResult').text('Les blancs sont en Echec');
			switchMaterialInWavefrontById(buffer, 'wk', 'incheck');
		}
		if (chess.turn() == 'b') {
			$('#matchResult').text('Les noirs sont en Echec');
			$('#gameHistory').html('');
		}
	}
	if (chess.in_threefold_repetition()) {
		$('#matchResult').text('Partie nulle, répétition');
		$('#gameHistory').html(chess.pgn({
			max_width: 15,
			newline_char: '<br />'
		}));
	}
	if (chess.in_checkmate()) {
		if (chess.turn() == 'w') $('#matchResult').text('Les blancs sont en Echec et mat');
		if (chess.turn() == 'b') $('#matchResult').text('Les noirs sont en Echec et mat');
		$('#gameHistory').html(chess.pgn({
			max_width: 5,
			newline_char: '<br />'
		}));
	}
	if (chess.in_check()) {
		if (chess.turn() == 'w') switchMaterialInWavefrontById(buffer, 'wk', 'incheck');
		if (chess.turn() == 'b') switchMaterialInWavefrontById(buffer, 'bk', 'incheck');
		viewChessBoard();
		audiocheck.play();
	}
	if (chess.game_over()) {
		$('#endGameLayer').css('display', 'block');
		$('#navhelper').css('display', 'none');
		viewChessBoard();
	}
}

function closeEndGameLayer() {
	$('#endGameLayer').css('display', 'none');
	$('#navhelper').css('display', 'block');
}
$(window).on("load", function() {
	/*======================================================================
	/***********************************************************************
	
		Initialisations
		
	***********************************************************************/
	document.getElementById("banquise").disabled = true;
	document.getElementById("cappuccino").disabled = false;
	document.getElementById("bois").disabled = true;
	/*  Recuperation des Parametres client
	 ***********************************************************************/
	if (Cookies.get('fen') != undefined) chess.load(Cookies.get('fen'));
	if (Cookies.get('vue') == undefined) {
		view = 'auto';
		Cookies.set('vue', 'auto');
		Log('setting cookie vue');
	} else {
		if (Cookies.get('vue') == 'auto') view = 'auto';
		if (Cookies.get('vue') == 'mobile') view = 'mobile';
		if (Cookies.get('vue') == 'desktop') view = 'desktop';
	}
	Log('#=# cookie : ' + Cookies.get('vue'));
	/*  Chargement du wavefrnt du plateau
	 ***********************************************************************/
	boardwvft = $.extend(true, {}, loadWavefrontFromHTLM('#board', 'board'));
	boardbuffer = $.extend(true, {}, boardwvft);
	buffer = $.extend(true, {}, boardwvft);
	/*  Mise en page de l'application
	 ***********************************************************************/
	disposeapplicationlayers(view);
	viewChessBoard();
	/*  configuration hammerJS
	 ***********************************************************************/
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
	/*======================================================================
	/***********************************************************************
	
		Évenements fenetre
		
	***********************************************************************/
	$(window).on('resize', function() {
		clearWayables();
		disposeapplicationlayers(Cookies.get('vue'));
	});
	/*======================================================================
	/***********************************************************************
	
		interactions UI  ( interface textuelle )
		
	***********************************************************************/
	$('body').on('click', '#endGameLayerFooter', function() {
		closeEndGameLayer();
	});
	$('body').on('click', '#turnLeft', function() {
		if (view != 'mobile') {
			rotateViewZlock(0, 90, 0);
			viewChessBoard();
		}
	});
	$('body').on('click', '#turnRight', function() {
		if (view != 'mobile') {
			rotateViewZlock(0, -90, 0);
			viewChessBoard();
		}
	});
	$('body').on('click', '*', function() {
		$('.banner').css('display', 'none');
	});
	$('body').on('click', '#toggleViewMobile', function() {
		clearWayables();
		$('#toggleViewMobile').removeClass('selectedToggle');
		$('#toggleViewDesktop').removeClass('selectedToggle');
		$('#toggleViewMobile').addClass('selectedToggle');
		view = 'mobile';
		//TODO write a understandable function in renderer.js to modify rendering process 
		renderProcess[2] = drawpiecesWriteIdMobileDisplay;
		Cookies.set('vue', 'mobile');
		disposeapplicationlayers('mobile');
	});
	$('body').on('click', '#toggleViewDesktop', function() {
		clearWayables();
		$('#toggleViewMobile').removeClass('selectedToggle');
		$('#toggleViewDesktop').removeClass('selectedToggle');
		$('#toggleViewDesktop').addClass('selectedToggle');
		view = 'desktop';
		//TODO write a understandable function in renderer.js to modify rendering process 
		renderProcess[2] = drawpiecesWriteIdDisplayExperimentalLighted;
		Cookies.set('vue', 'desktop');
		disposeapplicationlayers('desktop');
	});
	$('body').on('click', '#toggleViewAuto', function() {
		clearWayables();
		$('#toggleViewMobile').removeClass('selectedToggle');
		$('#toggleViewDesktop').removeClass('selectedToggle');
		$('#toggleViewAuto').addClass('selectedToggle');
		view = 'auto';
		Cookies.set('vue', 'auto');
		disposeapplicationlayers('auto');
	});
	$('body').on('click', '#resetBoard', function() {
		chess.reset();
		clearWayables();
		disposeapplicationlayers('desktop');
		viewChessBoard();
	});
	$('#toggleViewMobile').removeClass('selectedToggle');
	$('#toggleViewDesktop').removeClass('selectedToggle');
	var tmp = Cookies.get('vue');
	if (tmp == 'auto') $('#toggleViewAuto').addClass('selectedToggle');
	if (tmp == 'mobile') $('#toggleViewMobile').addClass('selectedToggle');
	if (tmp == 'desktop') $('#toggleViewDesktop').addClass('selectedToggle');
	$('body').on('click', '#toggleThemeCapucino', function() {
		$('svg').attr('shape-rendering', 'geometricPrecision')
		document.getElementById("banquise").disabled = true;
		document.getElementById("cappuccino").disabled = false;
		document.getElementById("bois").disabled = true;
		$('#toggleThemeBois').removeClass('selectedToggle');
		$('#toggleThemeBanquise').removeClass('selectedToggle');
		$('#toggleThemeCapucino').addClass('selectedToggle');
		viewChessBoard();
	});
	$('body').on('click', '#toggleThemeBanquise', function() {
		$('svg').attr('shape-rendering', 'geometricPrecision')
		document.getElementById("banquise").disabled = false;
		document.getElementById("cappuccino").disabled = true;
		document.getElementById("bois").disabled = true;
		$('#toggleThemeBois').removeClass('selectedToggle');
		$('#toggleThemeBanquise').addClass('selectedToggle');
		$('#toggleThemeCapucino').removeClass('selectedToggle');
		viewChessBoard();
	});
	$('body').on('click', '#toggleRenderingLow', function() {
		$('svg').attr('shape-rendering', 'optimisedSpeed')
		$('#toggleRenderingHight').removeClass('selectedToggle');
		$('#toggleRenderingMiddle').removeClass('selectedToggle');
		$('#toggleRenderingLow').addClass('selectedToggle');
		viewChessBoard();
	});
	$('body').on('click', '#toggleRenderingMiddle', function() {
		$('svg').attr('shape-rendering', 'crispEdges')
		$('#toggleRenderingLow').removeClass('selectedToggle');
		$('#toggleRenderingHight').removeClass('selectedToggle');
		$('#toggleRenderingMiddle').addClass('selectedToggle');
		viewChessBoard();
	});
	$('body').on('click', '#toggleRenderingHight', function() {
		$('svg').attr('shape-rendering', 'geometricPrecision')
		$('#toggleRenderingLow').removeClass('selectedToggle');
		$('#toggleRenderingMiddle').removeClass('selectedToggle');
		$('#toggleRenderingHight').addClass('selectedToggle');
		viewChessBoard();
	});
	$('body').on('click', '#toggleThemeBois', function() {
		document.getElementById("banquise").disabled = true;
		document.getElementById("cappuccino").disabled = true;
		document.getElementById("bois").disabled = false;
		$('#toggleThemeBois').addClass('selectedToggle');
		$('#toggleThemeBanquise').removeClass('selectedToggle');
		$('#toggleThemeCapucino').removeClass('selectedToggle');
		viewChessBoard();
	});
	/*======================================================================
	/***********************************************************************
	
		interactions Plateau
		
	***********************************************************************/
	mc.on("pan", function(ev) {
		if (view != 'mobile') {
			rotateViewZlock(ev.velocityY * 15, ev.velocityX * 15, 0);
			viewChessBoard();
			

		}
	});
	$('body').on('click', '#QueenPromotion', function() {
		var mv = chess.move({
			from: promotmp2.f,
			to: promotmp2.t,
			promotion: 'q'
		});
		buildPieces();
		selectedPiece = "none";
		clearWayables();
		viewChessBoard();
		checkGameState();
		closePromotionUI();
	});
	$('body').on('click', '#RookPromotion', function() {
		var mv = chess.move({
			from: promotmp2.f,
			to: promotmp2.t,
			promotion: 'r'
		});
		buildPieces();
		selectedPiece = "none";
		clearWayables();
		viewChessBoard();
		checkGameState();
		closePromotionUI();
	});
	$('body').on('click', '#KnightPromotion', function() {
		var mv = chess.move({
			from: promotmp2.f,
			to: promotmp2.t,
			promotion: 'n'
		});
		buildPieces();
		selectedPiece = "none";
		clearWayables();
		viewChessBoard();
		checkGameState();
		closePromotionUI();
	});
	$('body').on('click', '#BishopPromotion', function() {
		var mv = chess.move({
			from: promotmp2.f,
			to: promotmp2.t,
			promotion: 'b'
		});
		buildPieces();
		selectedPiece = "none";
		clearWayables();
		viewChessBoard();
		checkGameState();
		closePromotionUI();
	});
	$('body').on('click', '.piece', function() {
		var id = getFaceId(this);
		if (chess.turn() == Pieces[id].color) {
			clearWayables();
			switchMaterialWavefront(Pieces[id].w, "selectedPiece");
			if (selectedPiece != "none") {
				if (Pieces[selectedPiece].color == 'w') switchMaterialWavefront(Pieces[selectedPiece].w, 'blancs');
				if (Pieces[selectedPiece].color == 'b') switchMaterialWavefront(Pieces[selectedPiece].w, 'noirs');
			}
			switchMaterialWavefront(Pieces[id].w, "selectedPiece");
			selectedPiece = id;
			showWay(selectedPiece);
			viewChessBoard();
		}
	});
	$('body').on('click', '.way', function() {
		var id = getFaceId(this);
		var tmp = $(this).attr('class');
		var tmp2 = tmp.match(/way\d+/) + "";
		selectedway = parseInt(tmp2.match(/\d+/));
		if (isPromotionMove(way[selectedway].move)) {
			promotmp = selectedPiece;
			promotmp2 = {
				f: Pieces[selectedPiece].square,
				t: way[selectedway].square
			};
			if (chess.turn() == 'w') $('.pce').addClass('blancs');
			if (chess.turn() == 'b') $('.pce').addClass('noirs');
			showPromotionUI();
		} else {
			var move = chess.move(way[selectedway].move);
			if (move.flags == 'n') audiomove.play();
			if (move.flags == 'b') audiomove.play();
			if (move.flags == 'e') audiocapture.play();
			if (move.flags == 'c') audiocapture.play();
			if (move.flags == 'cp') audioenpassant.play();
			if (move.flags == 'q' | move.flags == 'k') audiocastle.play();
			buildPieces();
			selectedPiece = "none";
			clearWayables();
			viewChessBoard();
			checkGameState();
			Cookies.set('fen', chess.fen());
		}
	});
	/*$('#svg8').on('mousewheel', function(event) {
		if (view != 'mobile') {
			translateView(0, 0, event.deltaY * event.deltaFactor);
			viewChessBoard();
		}
	});*/
	//playspin = setInterval(spinview, 250);
	
	function spinview(){	
		
		 rotateViewZlock (0, 0.01, 0 );
		 viewChessBoard();
	 }
});
