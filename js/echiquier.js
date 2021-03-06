var userdata = new Array();


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
			{
				if ( chess.get(square).color == 'w')
					rotateWavefront (tmpWvft2, 0, 180, 0);
				translateWavefront (tmpWvft2, 0, 0, 0);
			}
			translateWavefront (tmpWvft2, -v*64+224, 0, -u*64+224 );
			altPiece.w = $.extend(true, {},tmpWvft2 );
			Pieces.push(altPiece);
		}
	}
}
function getTargetFromMove (a)
{
	if (a.includes('+') || a.includes('#')  )
		a = a.slice (0, a.length-1);
	if (a.includes('=R') || a.includes('=Q') || a.includes('=R') || a.includes('=B') || a.includes('=N')  )
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
	if (a.includes('=R') || a.includes('=Q') || a.includes('=R') || a.includes('=B') || a.includes('=N')  )
	return true;
	else return false;
}

function showWay(p)
{
	var moves = chess.moves({square: Pieces[p].square});
	
	way.splice(0, way.length);

	for (var i = 0 ; i < moves.length ; i++)
	{
		addToWayables(getTargetFromMove(moves[i]));
			
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
function addToWayables (sqr)
{
	var x = SquareToXY (sqr).x;
	var y = SquareToXY (sqr).y;
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
		initViewZlock(270, 0, 0, 800);
	}
	else {
		buildPieces ();
		initViewZlock(192, 90, 0, 1000);
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

		audiocheck.play();
	}
	if (chess.game_over()) {
		$('#endGameLayer').css('display', 'block');
		$('#navhelper').css('display', 'none');

	}
}

function closeEndGameLayer() {
	$('#endGameLayer').css('display', 'none');
	$('#navhelper').css('display', 'block');
}
function readCookie(name) {
   var nameEQ = name + "=";
   var ca = document.cookie.split(';');
   for (var i = 0; i < ca.length; i++) {
       var c = ca[i];
       while (c.charAt(0) == ' ') c = c.substring(1, c.length);
       if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
   }
   return null;
}
function eraseCookie(name) {
   createCookie(name, "", -1);
}
// Create the XHR object.
function createCORSRequest(method, url) {
  var xhr = new XMLHttpRequest();
  if ("withCredentials" in xhr) {
    // XHR for Chrome/Firefox/Opera/Safari.
    xhr.open(method, url, true);


 } else if (typeof XDomainRequest != "undefined") {
    // XDomainRequest for IE.
    xhr = new XDomainRequest();
    xhr.open(method, url);
  } else {
    // CORS not supported.
    xhr = null;
  }
  return xhr;
}

// Helper method to parse the title tag from the response.
function getTitle(text) {
  return text.match('<title>(.*)?</title>')[1];
}

// Make the actual CORS request.
function makeCorsRequest(key) {
  // This is a sample server that supports CORS.
  var url = 'http://s1pierro.free.fr/echiquierJS/acces.php?key='+key;

  var xhr = createCORSRequest('GET', url);
  if (!xhr) {
    alert('CORS not supported');
    return;
  }

  // Response handlers.
  xhr.onload = function() {
    var text = xhr.responseText;
	userdata = JSON.parse(text);
      logCallBack (JSON.parse(text));
  };

  xhr.onerror = function() {
    alert('Woops, there was an error making the request.');
  };
 
  xhr.send();
}

function logCallBack (b)
{  

	var a = new Date(b.date*1000);
var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  var year = a.getFullYear();
  var month = months[a.getMonth()];
  var date = a.getDate();
  var hour = a.getHours();
  var min = a.getMinutes();
  var sec = a.getSeconds();
  var time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec ;
  
	$('.layerFooter').prepend(b.key+'<br>'+b.pseudo+'<br>'+'derniere connexion : '+time+'<br>');
	console.log ('key found : '+b.key);
	console.log ('last log : '+time);
	Cookies.set('key', b.key);
}

$(window).on("load", function() {


	/*======================================================================
	/***********************************************************************
	
		Identification
		
	***********************************************************************/

	var terminalkey = Cookies.get('key');
	console.log('cookies key : '+terminalkey)
	makeCorsRequest(terminalkey);
	
	


/*	$.ajax({
		url: 'http://s1pierro.free.fr/acces.php',
		dataType: 'json',
		type: 'POST',
		data: 'cookie=' + terminalkey,
		success: function(data) {
			userdata=data;
			loads1pnav();
			if ( userdata["cookie_adv"] == 1 )
			$('#cookie_adv').show();
		}
	});
	console.log ('terminalkey : '+terminalkey)

*/

	/*======================================================================
	/***********************************************************************
	
		Initialisations
		
	***********************************************************************/
	var container = document.getElementById("renderbox");
	var bannercontainer = document.getElementById("bannerRenderbox");
	
	
	document.getElementById("banquise").disabled = true;
	document.getElementById("cappuccino").disabled = false;
	document.getElementById("bois").disabled = true;
	/*  Recuperation des Parametres client
	 ***********************************************************************/
	if (Cookies.get('fen') != undefined) chess.load(Cookies.get('fen'));
	if (Cookies.get('vue') == undefined) {
		view = 'desktop';
		Cookies.set('vue', 'desktop');
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
	viewChessBoard(container);
	/*  configuration hammerJS
	 ***********************************************************************/
	var myElement = document.getElementById('svg8');
	var mc = new Hammer(myElement);
// Tap recognizer with minimal 2 taps
mc.add( new Hammer.Tap({ event: 'doubletap', taps: 2 }) );
// Single tap recognizer
mc.add( new Hammer.Tap({ event: 'singletap' }) );


// we want to recognize this simulatenous, so a quadrupletap will be detected even while a tap has been recognized.
mc.get('doubletap').recognizeWith('singletap');
// we only want to trigger a tap, when we don't have detected a doubletap
mc.get('singletap').requireFailure('doubletap');

	 
	mc.get('pan').set({
		direction: Hammer.DIRECTION_ALL
	});




/*	var myElement = document.getElementById('svg8');
	var mc = new Hammer(myElement);
	
	
	
	mc.get('pan').set({
		direction: Hammer.DIRECTION_ALL
	});
	mc.on("doubletap", function(ev) {
		//
	});
*/	mc.on("singletap", function(ev) {
		Log('tap');
	});

	/*======================================================================
	/***********************************************************************
	
		Évenements fenetre
		
	***********************************************************************/
	$(window).on('resize', function() {
		clearWayables();
		disposeapplicationlayers(Cookies.get('vue'));
		viewChessBoard(container);
	});
	
	/*======================================================================
	/***********************************************************************
	
		interactions UI  ( interface textuelle )
		
	/* togglable item render engine */
	$('body').on('click', '.toggle', function() {

		$( this ).parent('.toggleArea').children('.selectedToggle').removeClass('selectedToggle');
		$( this ).addClass('selectedToggle');
	});
	
	/**********************************************************************/
	$('body').on('click', '#toggleWww', function() {
		$('#config').css('display', 'none');
		$('#www').css('display', 'block');
	});
	
	$('body').on('click', '#toggleConfig', function() {
		$('#config').css('display', 'block');
		$('#www').css('display', 'none');
	});
	
	
	$('body').on('click', '#toggleCelShaderUltraThin', function() {
		renderProcessConfig ('celShader', 'ultrathin');
	});
	$('body').on('click', '#toggleCelShaderThin', function() {
		renderProcessConfig ('celShader', 'thin');
	});
	$('body').on('click', '#toggleCelShaderMedium', function() {
		renderProcessConfig ('celShader', 'medium');
	});
	$('body').on('click', '#toggleCelShaderLarge', function() {
		renderProcessConfig ('celShader', 'large');
	});
	
	$('body').on('click', '#endGameLayerFooter', function() {
		closeEndGameLayer();
	});
	$('body').on('click', '#turnLeft', function() {
		if (view != 'mobile') {
			rotateViewZlock(0, 45, 0);
			viewChessBoard(container);
		}
	});
	$('body').on('click', '#turnRight', function() {
		if (view != 'mobile') {
			rotateViewZlock(0, -45, 0);
			viewChessBoard(container);
		}
	});
	$('body').on('click', '*', function() {
		$('.banner').css('display', 'none');
	});
	$('body').on('click', '#toggleViewMobile', function() {
		clearWayables();
		view = 'mobile';
		renderProcessConfig ('renderType', '2d');
		//TODO write a understandable function in renderer.js to modify rendering process 
		renderProcess[2] = drawpiecesWriteIdMobileDisplay;
		Cookies.set('vue', 'mobile');
		disposeapplicationlayers('mobile');
		viewChessBoard(container);
	});
	$('body').on('click', '#toggleViewDesktop', function() {
		clearWayables();
		view = 'desktop';
		renderProcessConfig ('renderType', '3d');
		//TODO write a understandable function in renderer.js to modify rendering process 
		renderProcess[2] = drawpiecesWriteIdDisplayExperimentalLighted;
		Cookies.set('vue', 'desktop');
		disposeapplicationlayers('desktop');
		viewChessBoard(container);
	});
	$('body').on('click', '#toggleViewAuto', function() {
		clearWayables();
		view = 'auto';
		Cookies.set('vue', 'auto');
		disposeapplicationlayers('auto');
		viewChessBoard(container);
	});
	$('body').on('click', '#resetBoard', function() {
		chess.reset();
		clearWayables();
		disposeapplicationlayers('desktop');
		viewChessBoard(container);
	});
	
	/* Theme selector */
	$('body').on('click', '#toggleThemeCapucino', function() {
		document.getElementById("banquise").disabled = true;
		document.getElementById("cappuccino").disabled = false;
		document.getElementById("bois").disabled = true;
		viewChessBoard(container);
	});
	$('body').on('click', '#toggleThemeBanquise', function() {
		document.getElementById("banquise").disabled = false;
		document.getElementById("cappuccino").disabled = true;
		document.getElementById("bois").disabled = true;
		viewChessBoard(container);
	});
	$('body').on('click', '#toggleThemeBois', function() {
		document.getElementById("banquise").disabled = true;
		document.getElementById("cappuccino").disabled = true;
		document.getElementById("bois").disabled = false;
		viewChessBoard(container);
	});
	/* Render quality */
	$('body').on('click', '#toggleRenderingLow', function() {
		renderProcessConfig ('quality', 'low');
		viewChessBoard(container);
	});
	$('body').on('click', '#toggleRenderingMiddle', function() {
		renderProcessConfig ('quality', 'medium');
		viewChessBoard(container);
	});
	$('body').on('click', '#toggleRenderingHight', function() {
		renderProcessConfig ('quality', 'hight');
		viewChessBoard(container);
	});
	/*======================================================================
	/***********************************************************************
	
		interactions Plateau
		
	***********************************************************************/
	mc.on("pan", function(ev) {
		if (view != 'mobile') {
			rotateViewZlock(ev.velocityY * 15, ev.velocityX * 15, 0);
			viewChessBoard(container);
		}
		else {
			window.scrollBy(0,-ev.velocityY*20);
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
		viewChessBoard(container);
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
		viewChessBoard(container);
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
		viewChessBoard(container);
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
		viewChessBoard(container);
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
			viewChessBoard(container);
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
			if (move.flags == 'q' || move.flags == 'k') audiocastle.play();
			buildPieces();
			selectedPiece = "none";
			clearWayables();
			viewChessBoard(container);
			checkGameState();
			Cookies.set('fen', chess.fen());
		}
	});
	/*$('#svg8').on('mousewheel', function(event) {
		if (view != 'mobile') {
			translateView(0, 0, event.deltaY * event.deltaFactor);
			viewChessBoard(container);
		}
	});*/
	//playspin = setInterval(spinview, 10);
	
	function spinview(){	
		
		 rotateViewZlock (0, 0.1, 0 );
		 viewChessBoard(container);
	 }
});
