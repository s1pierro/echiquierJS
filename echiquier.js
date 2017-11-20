var userdata = new Array();
var lastGotEvent = -90;
var gameType = 'local';
//var opponent = '';

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

/************************************************************************************************
-------------------------------------------------------------------------------------------------

	GAME ENGINE ( no deals with online server )

*/

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
function disposeapplicationlayers ()
{		
	var w = $(window).width();
	var h = $(window).height();
/*	if ( option == 'auto' )
	{ */

	if ( ( w > 700 || h > 700 ) || ( h<w && w>600 ) )
		view = 'desktop';
	else view = 'mobile';
/*	}*/
	console.log('###########  #####  #########  ');
	console.log('#         #  #   #  #       #  ');
	console.log('#         #  #   #  #########  ');
	console.log('###########  #####     ###      ');
	
	console.log('w '+w+', h '+h);
	console.log('view '+ view);

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
		renderProcessConfig ('renderType', '2d');
		buildPieces ();
		initViewZlock(270, 0, 0, 800);
	}
	else {
		renderProcessConfig ('renderType', '3d');
		buildPieces ();
		initViewZlock(192, 90, 0, 1000);
	}
}
function checkGameState() {
	if (chess.insufficient_material()) {

		$('#gameHistory').prepend("<strong>Partie nulle, materiel insuffisant</strong>");
	}
	if (chess.in_check()) {
		if (chess.turn() == 'w') {
		}
		if (chess.turn() == 'b') {
		}
	}
	if (chess.in_threefold_repetition()) {
		$('#gameHistory').prepend('<strong>Partie nulle, répétition</strong>');

	}
	if (chess.in_checkmate()) {
		if (chess.turn() == 'w') $('#gameHistory').prepend('<strong>Les blancs sont en Echec et mat</strong>');
		if (chess.turn() == 'b') $('#gameHistory').prepend('<strong>Les noirs sont en Echec et mat</strong>');

	}
	if (chess.in_check()) {
		if (chess.turn() == 'w') switchMaterialInWavefrontById(buffer, 'wk', 'incheck');
		if (chess.turn() == 'b') switchMaterialInWavefrontById(buffer, 'bk', 'incheck');

		audiocheck.play();
	}
	if (chess.game_over()) {


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
/************************************************************************************************
-------------------------------------------------------------------------------------------------

	Online game functions ( dealing with online server )

*/
function logTerminal (k) {
	
	console.log('##-> terminal\'s loggin request');

	$.ajax({
		url: 'http://s1pierro.free.fr/echiquierJS/acces.php',
		dataType: 'json',
		crossDomain: true,
		type: 'POST',
		data: { key: k},
		success: function(jsn) {
				
			var a = new Date(jsn.date*1000);
			var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
			var year = a.getFullYear();
			var month = months[a.getMonth()];
			var date = a.getDate();
			var hour = a.getHours();
			var min = a.getMinutes();
			var sec = a.getSeconds();
			var time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec ;
		 	$('#userNameInput').val(jsn.user);
			$('.layerFooter').prepend('<span class="lighttext">'+jsn.key+'</span> '+jsn.user+'<br>'+'derniere connexion : '+time+'<br>');
			console.log ('key '+jsn.key);
			Cookies.set('key', jsn.key, { expires: 365 });
			Cookies.set('usr', jsn.user, { expires: 365 });
			console.log ('user '+jsn.user);
			console.log ('last '+jsn.date);
			userdata=jsn;
		}
	});
	

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
function getRoomContent() {

	$.ajax({
		url: 'room.php',
		dataType: 'json',
		data: {getroom: 1},
		type: 'POST',
		success: function(b)
		{
		console.log('#room');
			$('#room').text('');
			$('#chessGames').text('');
			$('#endedChessGames').text('');

			var jsn = b;
			for ( var i = 0 ; i < jsn.length ; i+=2 )
			{
				var comp = jsn[i]+'';
				if ( comp != "anonyme" && comp != userdata.user ) 
				{
					if ( userdata.user == 'anonyme' || userdata.user == undefined )
						$('#room').append(jsn[i]+
						' <span class="lighttext"> '+jsn[i+1]+
						'</span><br>');
					else 
						$('#room').append(jsn[i]+
						' <span class="lighttext"> '+jsn[i+1]+
						'</span><br><a id="'+jsn[i]+
						'" class="suggest">proposer une partie</a><br>');
				}
			}
			if ( userdata.user == 'anonyme' || userdata.user == undefined )
				$('#room').prepend('<p class="alert">'+
							'Vous devez choisir un nom d\'utilisateur'+
							' sur cet appareil pour jouer en ligne.'+
						   '</p>');
		}
	});
	$.ajax({
		url: 'room.php',
		dataType: 'json',
		type: 'POST',
		data: { getGames: Cookies.get('usr'), key: Cookies.get('key')},
		success: function(b) {
			var jsn = b;
			for ( var i = 0 ; i < jsn.length ; i+=5 )
			{
				var tst = jsn[i+4];
				if ( tst.includes('#'))
					$('#endedChessGames').append('<a class="gameItem" id="'+
								jsn[i]+'">partie contre '+jsn[i+1]+
								'</a><br>');
				else
					$('#chessGames').append('<a class="gameItem" id="'+
								jsn[i]+'">partie contre '+jsn[i+1]+
								'</a><br>');
			}
		}
	});
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
 	$('#userNameInput').val(b.user);
	$('.layerFooter').prepend('<span class="lighttext">'+b.key+'</span> '+b.user+'<br>'+'derniere connexion : '+time+'<br>');
	
	console.log ('key '+b.key);
	Cookies.set('key', b.key, { expires: 365 });
	Cookies.set('usr', b.user, { expires: 365 });
	console.log ('user '+b.user);
	console.log ('last '+b.date);
	userdata=b;	
	listenRoomEvents ();
}
var opponent = "local";
var playerColor = 'both';
var gKey;

function getNsetOnlineGame ( gamekey ) {

	clearInterval(gameEventListeningHandler);
	var d = 'getGame='+gamekey+'&key='+Cookies.get('key')+'&user='+userdata.user;
	console.log('ajax. data : '+d);		
	$.ajax({
		url: 'roomevents.php',
		dataType: 'html',
		type: 'POST',
		data: d,
		success: function(b) {
			var jsn = JSON.parse(b);
			gKey=gamekey;
			opponent = jsn.opponent;
			chess.load_pgn(jsn.pgn);
			playerColor = jsn.color;
			opponent = jsn.opponent;
			buildPieces ();
			viewChessBoard(document.getElementById("renderbox"));
			gameType = gamekey;
			if (playerColor=='w'
			$('#gameTitle').html('<img src="./pictures/wpawn.svg" class="svgicon '+col+'"></img> Partie contre '+jsn.opponent);
			if (playerColor=='b')
			$('#gameTitle').html('<img src="./pictures/bpawn.svg" class="svgicon '+col+'"></img> Partie contre '+jsn.opponent);
			$('#gameHistory').html('<p>'+chess.pgn({
				max_width: 35,
				newline_char: '<br>'
			})+'</p>');
			
			
			if ( chess.turn() != playerColor )
				gameEventListeningHandler = setInterval(function(){listenGame(gKey)}, 1000);
		}
	});
}
function submitMove (gamekey, m) {

	$.ajax({
		url: 'roomevents.php',
		dataType: 'json',
		type: 'POST',
		data: {submitmove: gamekey, move: m, key: Cookies.get('key'), user:userdata.user},
		success: function(r) {
		
		console.log('reponse : '+r);

		}
	});
}
function validateOpponentMove () {
}
function deleteMoveEvent (gameKey)
{
	console.log ('deleting '+gameKey+'\nuser '+userdata.user+'\nkey '+Cookies.get('key'));
	$.ajax({
		url: 'roomevents.php',
		dataType: 'json',
		type: 'POST',
		data: {deleteevent: gameKey, key: Cookies.get('key'), user: userdata.user},
		success: function(response)
		{
			console.log ('delete reponse'+response);
		}
	});	
}
function listenGame (gameKey)
{
	$.ajax({
		url: 'roomevents.php',
		dataType: 'json',
		type: 'POST',
		data: {listengame: gameKey, key: Cookies.get('key'), user:userdata.user},
		success: function(response)
		{
			var j = response;
			console.log('#-# listenGame #-#');

			console.log('type: '+j.eventType);
			console.log('move: '+j.eventContent);

			if (j.eventType=="submitMove" && lastGotEvent != j.eventId )
			{	
				lastGotEvent = j.eventId;
				clearInterval(gameEventListeningHandler);
				movePiece (j.eventContent);
				$.ajax({
					url: 'roomevents.php',
					dataType: 'html',
					type: 'POST',
					data: { updatepgn: gameKey,
						key: Cookies.get('key'),
						user: userdata.user,
						pgn:  chess.pgn() },
					success: function(response) {}
				});
				deleteMoveEvent(j.eventKey);
			}
		}
	});
}
function listenRoomEvents () {

	getRoomContent();
	var d = 'get='+lastGotEvent+'&key='+Cookies.get('key')+'&user='+userdata.user;
	$.ajax({
		url: 'roomevents.php',
		dataType: 'json',
		type: 'POST',
		data: d,
		success: function(response) {
			var j = response;//JSON.parse(response);
			console.log('#got event '+j.eventType);
			if (j.eventType=="suggestGame")
			{
				$('#popUp').css('display', 'block');
				$('#shadow').css('display', 'block');
				$('#popTitle').html('Voulez vous jouer une partie contre <span id="opponent">'+j.eventContent+'</span> ?');
				$('#popContent').html('<button id="accept'+j.eventId+'accept" class="popAccept right-side">ok</button><button class="popDecline right-side" id="ev'+j.eventId+'ev">Non merci</button>');				
			}
		}
	});
}
function movePiece (m)
{
	var move = chess.move(m);
	Cookies.set('pgn', chess.pgn());
			clearWayables();
			selectedPiece = "none";
	buildPieces ();
	if (move.flags == 'n') audiomove.play();
	if (move.flags == 'b') audiomove.play();
	if (move.flags == 'e') audiocapture.play();
	if (move.flags == 'c') audiocapture.play();
	if (move.flags == 'cp') audioenpassant.play();
	if (move.flags == 'q' || move.flags == 'k') audiocastle.play();
	
	viewChessBoard(document.getElementById("renderbox") );
			
	$('#gameHistory').html('<p>'+chess.pgn({
		max_width: 35,
		newline_char: '<br>'
	})+'</p>');
	checkGameState();
	return move;

}
function acceptGame ( color, pgn, opponent) {


	
	
	

}
function suggestGame ( opnt) {

	
	
	

}

var gameEventListeningHandler;
var eventListeningHandler;

$(window).on("load", function() {

	
	/*======================================================================
	/***********************************************************************
	
		Identification
		
	***********************************************************************/

	var terminalkey = Cookies.get('key');
	console.log('cookies key : '+terminalkey)
	//makeCorsRequest(terminalkey);

	logTerminal (k);
	

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


	eventListeningHandler = setInterval(function(){listenRoomEvents()}, 15000);


	var container = document.getElementById("renderbox");
	var bannercontainer = document.getElementById("bannerRenderbox");
	
	
	document.getElementById("banquise").disabled = false;
	document.getElementById("cappuccino").disabled = true;
	document.getElementById("bois").disabled = true;
	/*  Recuperation des Parametres client
	 ***********************************************************************/
//	if (Cookies.get('ev') != undefined) lastGotEvent = Cookies.get('ev');
	if (Cookies.get('pgn') != undefined) chess.load_pgn(Cookies.get('pgn'));
/*	if (Cookies.get('vue') == undefined) {
		view = 'desktop';
		Cookies.set('vue', 'desktop');
		Log('setting cookie vue');
	} else {
		if (Cookies.get('vue') == 'auto') view = 'auto';
		if (Cookies.get('vue') == 'mobile') view = 'mobile';
		if (Cookies.get('vue') == 'desktop') view = 'desktop';
	}*/
	view = 'auto';

	/*  Chargement du wavefront du plateau
	 ***********************************************************************/
	boardwvft = $.extend(true, {}, loadWavefrontFromHTLM('#board', 'board'));
	boardbuffer = $.extend(true, {}, boardwvft);
	buffer = $.extend(true, {}, boardwvft);
	/*  Mise en page de l'application
	 ***********************************************************************/
	disposeapplicationlayers();
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

	/*  configuration partie
	 ***********************************************************************/
	 
	
	
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
	
	/**********************************************************************
	   PAGES                                                             */
	   
	$('body').on('click', '#toggleWww', function() {
		$('#config').css('display', 'none');
		$('#www').css('display', 'block');
		$('#game').css('display', 'none');
		$('#about').css('display', 'none');
	});
	$('body').on('click', '#toggleConfig', function() {
		$('#config').css('display', 'block');
		$('#www').css('display', 'none');
		$('#game').css('display', 'none');
		$('#about').css('display', 'none');
	});
	$('body').on('click', '#toggleAbout', function() {
		$('#about').css('display', 'block');
		$('#www').css('display', 'none');
		$('#game').css('display', 'none');
		$('#config').css('display', 'none');
	});
	$('body').on('click', '#toggleGame', function() {
		$('#about').css('display', 'none');
		$('#config').css('display', 'none');
		$('#www').css('display', 'none');
		$('#game').css('display', 'block');
		getRoomContent();
	});
	$('body').on('click', '#endGameLayerFooter', function() {
		closeEndGameLayer();
	});
	
	/**********************************************************************
	   VIEW BUTTONS                                                           */
	
	$('body').on('click', '#turnRight', function() {
		if (view != 'mobile') {
			rotateViewZlock(0, -45, 0);
			viewChessBoard(container);
		}
	});
	$('body').on('click', '*', function() {
		$('.banner').css('display', 'none');
	});
	$('body').on('click', '#resetBoard', function() {
		chess.reset();
		clearWayables();
		disposeapplicationlayers('desktop');
		viewChessBoard(container);
		$('#gameHistory').html('<p>'+chess.pgn({
			max_width: 35,
			newline_char: '<br>'
		})+'</p>');
		playerColor = 'both';
		opponent = 'local';

	});	

	
	
	/**********************************************************************
	   DISPLAY SETTINGS                                                  */
	   
	/* Cel-shader */
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
	
	$('body').on('click', '#turnLeft', function() {
		if (view != 'mobile') {
			rotateViewZlock(0, 45, 0);
			viewChessBoard(container);
		}
	});
	/* View type */
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
	
	/**********************************************************************
	  ROoM           	                                             */
	   
	$('body').on('click', '.suggest', function() {

		console.log('id : '+this.id);
		$('#popUp').css('display', 'block');
		$('#shadow').css('display', 'block');

		$('#popTitle').html('Voulez vous proposer une partie a <span id="opponent">'+this.id+'</span> ?');
		
		$('#popContent').html('<button class="popSuggest right-side">ok</button><button class="popCancel right-side">Annuler</button>');
		
		//suggestGame ( this.id );
	});

	$('body').on('click', '.popCancel', function() {
		$('#popUp').css('display', 'none');
		$('#shadow').css('display', 'none');

	});
	$('body').on('click', '.popDecline', function() {

		var tmp = this.id;
		var tmp2 = tmp.match(/ev\d+ev/) + '+';
		var tmpid = parseInt(tmp2.match(/\d+/));

		lastGotEvent = tmpid;
		Cookies.set('ev', lastGotEvent);

		$.ajax({
			url: 'roomevents.php',
			dataType: 'html',
			type: 'POST',
			data: 'declinegame=1&key='+Cookies.get('key')+'&user='+userdata.user+
				'&opponent='+$('#opponent').text(),
			success: function(html) {
				$('#popUp').css('display', 'none');
				$('#shadow').css('display', 'none');
			}
		});
		

	});
	$('body').on('click', '.popAccept', function() {

		var mp = this.id;
		var mp2 = mp.match(/accept\d+accept/) + '+';
		var mpid = parseInt(mp2.match(/\d+/));
		lastGotEvent = mpid;
		Cookies.set('ev', lastGotEvent);
		$.ajax({
			url: 'roomevents.php',
			dataType: 'html',
			type: 'POST',
			data: 'acceptgame=1&key='+Cookies.get('key')+'&user='+userdata.user+
				'&opponent='+$('#opponent').text(),
			success: function(resp) {
				$('#popUp').css('display', 'none');
				$('#shadow').css('display', 'none');
				var jsn = JSON.parse(resp);
				getNsetOnlineGame ( jsn.gkey);
				window.scroll(0, 0);
			}
		});
	});
	$('body').on('click', '.popSuggest', function() {

		suggestGame ( this.id );

		$.ajax({
			url: 'roomevents.php',
			dataType: 'html',
			type: 'POST',
			data: 'push=1&key='+Cookies.get('key')+'&user='+userdata.user+'&eventtype=suggestGame'+
				'&eventtarget='+$('#opponent').text()+'&eventcontent='+userdata.user,
			success: function(html) {
				$('#popUp').css('display', 'none');
				$('#shadow').css('display', 'none');
			}
		});
	});
	   
	$('body').on('click', '.gameItem', function() {
		clearInterval(eventListeningHandler);
		getNsetOnlineGame ( this.id);
		window.scroll(0, 0);
	});
	   
	   
	/**********************************************************************
	   USER SETTINGS                                                     */
	   
	$('body').on('click', '#submitNewName', function() {

	        var name = $('#userNameInput').val();
		console.log('submit user name : '+name+' from user key '+Cookies.get('key'));
		$.ajax({
		        url: 'setusername.php',
		        dataType: 'html',
		        type: 'POST',
		        data: 'newName=' + name + '&key=' + Cookies.get('key'),
		        success: function(html) {

				$('#config').append(html);
		        }
      		});

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
		$('#gameHistory').html('<p>'+chess.pgn({
			max_width: 35,
			newline_char: '<br>'
		})+'</p>');
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
		$('#gameHistory').html('<p>'+chess.pgn({
			max_width: 35,
			newline_char: '<br>'
		})+'</p>');
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
		$('#gameHistory').html('<p>'+chess.pgn({
			max_width: 35,
			newline_char: '<br>'
		})+'</p>');
		buildPieces();
		selectedPiece = "none";
		clearWayables();
		viewChessBoard(container);
		checkGameState();
		closePromotionUI();
	});
	$('body').on('click', '#BishopPromotion', function() {
		var move = movePiece (way[selectedway].move);
		if (move != null ) submitMove(gKey, move.san);	/// ONLINE stuff
		closePromotionUI();
	});
	$('body').on('click', '.piece', function() {
		var id = getFaceId(this);
		console.log('chess.turn() : '+chess.turn()+' userdata '+playerColor);
		if (chess.turn() == Pieces[id].color && (playerColor == chess.turn()||playerColor == 'both')) 			{
			clearWayables();
			switchMaterialWavefront(Pieces[id].w, "selectedPiece");
			if (selectedPiece != "none") {
				if (Pieces[selectedPiece].color == 'w')
					switchMaterialWavefront(Pieces[selectedPiece].w, 'blancs');
				if (Pieces[selectedPiece].color == 'b')
					switchMaterialWavefront(Pieces[selectedPiece].w, 'noirs');
			}
			switchMaterialWavefront(Pieces[id].w, "selectedPiece");
			selectedPiece = id;
			showWay(selectedPiece);
			viewChessBoard(container);
		}
	});
	$('body').on('click', '.way', function() {
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
		
			var move = movePiece (way[selectedway].move);
			if (move != null && opponent !='local' )
			{/// ONLINE stuff
				gameEventListeningHandler = setInterval(function(){listenGame(gKey)}, 1000);
				submitMove(gKey, move.san);
			}

		}
	});
});
