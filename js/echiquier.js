var selectedfaces = [];
var nselectedfaces = 0;
var selectedPiece = "none";
var playspin;
var spinning = true;
	var plateau = [ 

	  [["wt2"],["wk2"],["wf2"],["wk"],["wq"],["wf1"],["wk1"],["wt1"]],
	  [["wp8"],["wp7"],["wp6"],["wp5"],["wp4"],["wp3"],["wp2"],["wp1"]],
	  [["free"],["free"],["free"],["free"],["free"],["free"],["free"],["free"]],
	  [["free"],["free"],["free"],["free"],["free"],["free"],["free"],["free"]],
	  [["free"],["free"],["free"],["free"],["free"],["free"],["free"],["free"]],
	  [["free"],["free"],["free"],["free"],["free"],["free"],["free"],["free"]],
	  [["bp1"],["bp2"],["bp3"],["bp4"],["bp5"],["bp6"],["bp7"],["bp8"]],
	  [["bt1"],["bk1"],["bf1"],["bk"],["bq"],["bf2"],["bk2"],["bt2"]]];

function Log(s)
{
	console.log(s);
}
function showPmoves(x, y)
{



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
$(window).on("load", function() {

	$("body").append('<object hidden type="audio/mpeg" width="100" height="40" data="../chesssound/start1.ogg"><param name="filename" value="../chesssound/start1.ogg" /><param name="autostart" value="true" /><param name="loop" value="false" /></object>');

	disposeapplicationlayers(170/297);


	loadPiecesWavefront();
	loadBoardWavefront();
	initViewZlock();


	
	addToWayables(1, 1, 0);

	console.log(plateau[1][1]);

	
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
		if (selectedPiece != "none") switchMaterial ("selectedPiece", selectedPiece );
		selectedPiece = m;
		clearWayables ()
		addToWayables(getPiecePositionX(selectedPiece), getPiecePositionY(selectedPiece), 0);
		switchMaterial (m, "selectedPiece");
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
	
	playspin = setInterval(spinview, 1);
	
	function spinview(){	

		 rotateViewZlock (0, increment, 0 );
		 viewChessBoard()
	 }

});
