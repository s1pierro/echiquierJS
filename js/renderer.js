var fmat = genimat();
var rmat = genimat();
var tmat = gentmat(0, 0, 100);
var pmat = gentmat(0, 0, 0);
var $renderbox = $("#renderbox");
var material = "white";
var ts1 = Date.now();
var ts2 = Date.now();
var ts3 = Date.now();
var ts4 = Date.now();
var ts5 = Date.now();
var ts6 = Date.now();
var bufferid = 0;
var increment = 0.0;
var container;

var ZlockANGx = 222;
var ZlockANGy = 230;
var ZlockANGz = 0;

container = document.getElementById("renderbox");

function initView(x, y, z)
{
	pmat = gentmat(0, 330, 0);
	tmat = gentmat(0, 0, 1110);
	rmat = genrmat(222, 0, 0);
	genfmat();
	viewChessBoard();
}
function initViewZlock(x, y, z)
{
	pmat = gentmat(0, 22, 0);
	tmat = gentmat(0, 0, 1000);
	rmat = genrmat( ZlockANGx, ZlockANGy, ZlockANGz);
	genfmat();
	viewChessBoard();
}
function viewChessBoard()
{
	genfmat();
	drawboard();
	drawframe();
}
function rotateViewZlock(x, y)
{
	ZlockANGy -= y;
	ZlockANGx += x;

	if ( ZlockANGx < 190 ) ZlockANGx = 190;
	
	if ( ZlockANGx > 270 ) ZlockANGx = 270;
	
	rmat = genrmat( ZlockANGx, ZlockANGy, ZlockANGz);
}
function rotateView(x, y, z)
{
	var tmp = genrmat( x, y, z);
	rmat = multiplymatrix (tmp, rmat);
}
function translateView(x, y, z)
{
	var tmp = gentmat( x, y, z);
	tmat = multiplymatrix (tmp, tmat);
}
function spinOBJ()
{
		rx += 1;
		drawframe();
}
function highlightSelection()
{
	for (var i = 0; i < nselectedfaces ; i++) $('.fc'+selectedfaces[i]+'cf').addClass('active');
}
function genfmat() {
	var mat = multiplymatrix(rmat, pmat);
	fmat = multiplymatrix(tmat, mat);
}
function drawframe_nSort() {
	ts3 = Date.now();
	for (var i = 0; i < buffer.nv; i++) {
		buffer.vertices[i] = applymat(fmat, wvft.vertices[i]);
		buffer.vertices[i] = applypersp( buffer.vertices[i]);
	}
	for (var i = 0; i < buffer.nt; i++)
		buffer.triangles[i].n = applymat(rmat, wvft.triangles[i].n);
	genzmap(buffer);
	$renderbox.empty();

	for (var i = 0; i < buffer.nt ; i++) {
		var j = buffer.zmap[i][0];
		var n = buffer.triangles[ j ].n[2];
		if (n<0) $renderbox.appendSvg('polygon', { points: buffer.vertices[ buffer.triangles[ j ][0] - 1 ][0] + ',' + buffer.vertices[ buffer.triangles[ j ][0] - 1 ][1] + ' ' + buffer.vertices[ buffer.triangles[ j ][1] - 1 ][0] + ',' + buffer.vertices[ buffer.triangles[ j ][1] - 1 ][1] + ' ' + buffer.vertices[ buffer.triangles[ j ][2] - 1 ][0] + ',' + buffer.vertices[ buffer.triangles[ j ][2] - 1 ][1], class: 'fc'+j+'cf face '+buffer.triangles[ j ].mat+'-step-'+Math.floor(n*16)+' '+buffer.triangles[ j ].mat });
	}
	for (var i = 0; i < buffer.nt ; i++) {
		var j = buffer.zmap[i][0];
		var n = buffer.triangles[ j ].n[2];
		if (n>0) $renderbox.appendSvg('polygon', { points: buffer.vertices[ buffer.triangles[ j ][0] - 1 ][0] + ',' + buffer.vertices[ buffer.triangles[ j ][0] - 1 ][1] + ' ' + buffer.vertices[ buffer.triangles[ j ][1] - 1 ][0] + ',' + buffer.vertices[ buffer.triangles[ j ][1] - 1 ][1] + ' ' + buffer.vertices[ buffer.triangles[ j ][2] - 1 ][0] + ',' + buffer.vertices[ buffer.triangles[ j ][2] - 1 ][1], class: 'fc'+j+'cf face '+buffer.triangles[ j ].mat+'-step-'+Math.floor(n*16)+' '+buffer.triangles[ j ].mat	});
	}

	highlightSelection();
	ts2 = Date.now();
	console.log(1000/(ts2-ts1)  );
	ts1 = Date.now();
}
function drawframe() {
	
//	ts3 = Date.now();
	for (var i = 0; i < buffer.nv; i++)
		buffer.vertices[i] = applymatNpersp(fmat, wvft.vertices[i]);
//	ts4 = Date.now();
	for (var i = 0; i < buffer.nt; i++)
		buffer.triangles[i].n = applymat(rmat, wvft.triangles[i].n);

//	ts5 = Date.now();
	genzmap(buffer);
	//$renderbox.empty();
   //	container.innerHTML = "";
//	ts6 = Date.now();
	for (var i = 0; i < buffer.nt ; i++) {
		var j = buffer.zmap[i][0];
		var n = buffer.triangles[ j ].n[2];
		
		var svg = document.createElementNS("http://www.w3.org/2000/svg",'polygon');
      svg.setAttribute('points',buffer.vertices[ buffer.triangles[ j ][0] - 1 ][0] + ',' + buffer.vertices[ buffer.triangles[ j ][0] - 1 ][1] + ' ' + buffer.vertices[ buffer.triangles[ j ][1] - 1 ][0] + ',' + buffer.vertices[ buffer.triangles[ j ][1] - 1 ][1] + ' ' + buffer.vertices[ buffer.triangles[ j ][2] - 1 ][0] + ',' + buffer.vertices[ buffer.triangles[ j ][2] - 1 ][1]);
      svg.setAttribute('class', 'fc'+j+'cf face '+buffer.triangles[ j ].mat+'-step-'+Math.floor(n*16)+' '+buffer.triangles[ j ].mat);
//	      svg.setAttribute('class', buffer.triangles[ j ].mat);
	
		container.appendChild(svg);

	}

	ts2 = Date.now();
	//console.log(1000/(ts2-ts1));
	increment = -(ts2-ts1)/1000;
	ts1 = Date.now();
}
function drawpieces() {
	

	for (var i = 0; i < buffer.nv; i++)
		buffer.vertices[i] = applymatNpersp(fmat, wvft.vertices[i]);
	for (var i = 0; i < buffer.nt; i++)
		buffer.triangles[i].n = applymat(rmat, wvft.triangles[i].n);
	genzmap(buffer);

	for (var i = 0; i < buffer.nt ; i++)
	{
		var j = buffer.zmap[i][0];
		var n = buffer.triangles[ j ].n[2];
		
		var svg = document.createElementNS("http://www.w3.org/2000/svg",'polygon');
		var trigon = buffer.vertices[ buffer.triangles[ j ][0] - 1 ][0] + ',' + buffer.vertices[ buffer.triangles[ j ][0] - 1 ][1] + ' ' + buffer.vertices[ buffer.triangles[ j ][1] - 1 ][0] + ',' + buffer.vertices[ buffer.triangles[ j ][1] - 1 ][1] + ' ' + buffer.vertices[ buffer.triangles[ j ][2] - 1 ][0] + ',' + buffer.vertices[ buffer.triangles[ j ][2] - 1 ][1]
      svg.setAttribute('points',trigon);
      svg.setAttribute('class', 'fc'+j+'cf face '+buffer.triangles[ j ].mat+'-step-'+Math.floor(n*16)+' '+buffer.triangles[ j ].mat);
		container.appendChild(svg);

	}

	ts2 = Date.now();
	increment = -(ts2-ts1)/1000;
	ts1 = Date.now();
}
function drawboard() {
	
	for (var i = 0; i < boardbuffer.nv; i++)
		boardbuffer.vertices[i] = applymatNpersp(fmat, boardwvft.vertices[i]);
   	container.innerHTML = "";
	for (var j = 0; j < 76 ; j++) {
		var n = boardbuffer.triangles[ j ].n[2];
		var svg = document.createElementNS("http://www.w3.org/2000/svg",'polygon');
    		svg.setAttribute('points',boardbuffer.vertices[ boardbuffer.triangles[ j ][0] - 1 ][0] + ',' + boardbuffer.vertices[ boardbuffer.triangles[ j ][0] - 1 ][1] + ' ' + boardbuffer.vertices[ boardbuffer.triangles[ j ][1] - 1 ][0] + ',' + boardbuffer.vertices[ boardbuffer.triangles[ j ][1] - 1 ][1] + ' ' + boardbuffer.vertices[ boardbuffer.triangles[ j ][2] - 1 ][0] + ',' + boardbuffer.vertices[ boardbuffer.triangles[ j ][2] - 1 ][1]);
		svg.setAttribute('class', boardbuffer.triangles[ j ].mat);
		container.appendChild(svg);
	}
	for (var j = 76; j < boardbuffer.nt ; j++) {
		var n = boardbuffer.triangles[ j ].n[2];
		var svg = document.createElementNS("http://www.w3.org/2000/svg",'polygon');
    		svg.setAttribute('points',boardbuffer.vertices[ boardbuffer.triangles[ j ][0] - 1 ][0] + ',' + boardbuffer.vertices[ boardbuffer.triangles[ j ][0] - 1 ][1] + ' ' + boardbuffer.vertices[ boardbuffer.triangles[ j ][1] - 1 ][0] + ',' + boardbuffer.vertices[ boardbuffer.triangles[ j ][1] - 1 ][1] + ' ' + boardbuffer.vertices[ boardbuffer.triangles[ j ][2] - 1 ][0] + ',' + boardbuffer.vertices[ boardbuffer.triangles[ j ][2] - 1 ][1]);
		svg.setAttribute('class', boardbuffer.triangles[ j ].mat+" way");
		container.appendChild(svg);
	}
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

	$('#svg8').attr('width', w);
	$('#svg8').attr('height', h);	
 	$("#svg8").attr('viewBox', '-'+((zoom/2))+' -'+(zoom/ratio/2)+' '+zoom+' '+(zoom/ratio));

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


