var viewangle = 100;
var fmat = genimat();
var rmat = genimat();
var tmat = gentmat(0, 0, 100);
var pmat = gentmat(0, 0, 0);
var ts1 = Date.now();
var ts2 = Date.now();
var increment = 0.0;

var ZlockANGx = 222;
var ZlockANGy = 230;
var ZlockANGz = 0;

container = document.getElementById("renderbox");



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
	drawpieces();
}
function rotateViewZlock(x, y)
{
	ZlockANGy -= y;
	ZlockANGx += x;

	if ( ZlockANGx < 190 ) ZlockANGx = 190;
	
	if ( ZlockANGx > 270 ) ZlockANGx = 270;
	
	rmat = genrmat( ZlockANGx, ZlockANGy, ZlockANGz);
}
function translateView(x, y, z)
{
	var tmp = gentmat( x, y, z);
	tmat = multiplymatrix (tmp, tmat);
}
function genfmat() {
	var mat = multiplymatrix(rmat, pmat);
	fmat = multiplymatrix(tmat, mat);
}
function drawpieces() {
	

	for (var i = 0; i < wvft.vertices.length; i++)
		buffer.vertices[i] = applymatNpersp(fmat, wvft.vertices[i]);
	for (var i = 0; i < wvft.triangles.length; i++)
		buffer.triangles[i].n = applymat(rmat, wvft.triangles[i].n);
	genzmap(buffer);

	for (var i = 0; i < wvft.triangles.length ; i++)
	{
		var j = buffer.zmap[i][0];
		var n = buffer.triangles[ j ].n[2];
		
		var svg = document.createElementNS("http://www.w3.org/2000/svg",'polygon');
		var trigon = buffer.vertices[ buffer.triangles[ j ][0] - 1 ][0] + ',' + buffer.vertices[ buffer.triangles[ j ][0] - 1 ][1] + ' ' + buffer.vertices[ buffer.triangles[ j ][1] - 1 ][0] + ',' + buffer.vertices[ buffer.triangles[ j ][1] - 1 ][1] + ' ' + buffer.vertices[ buffer.triangles[ j ][2] - 1 ][0] + ',' + buffer.vertices[ buffer.triangles[ j ][2] - 1 ][1];
      svg.setAttribute('points',trigon);
      svg.setAttribute('class', 'fc'+j+'cf face '+buffer.triangles[ j ].mat+'-step-'+Math.floor(n*16)+' '+buffer.triangles[ j ].mat);
		container.appendChild(svg);

	}

	ts2 = Date.now();
	increment = -(ts2-ts1)/1000;
	ts1 = Date.now();
}
function drawboard() {
	
	for (var i = 0; i < boardwvft.vertices.length; i++)
		boardbuffer.vertices[i] = applymatNpersp(fmat, boardwvft.vertices[i]);
   	container.innerHTML = "";
	for (var j = 0; j < 76 ; j++) {

		var svg = document.createElementNS("http://www.w3.org/2000/svg",'polygon');
    		svg.setAttribute('points',boardbuffer.vertices[ boardbuffer.triangles[ j ][0] - 1 ][0] + ',' + boardbuffer.vertices[ boardbuffer.triangles[ j ][0] - 1 ][1] + ' ' + boardbuffer.vertices[ boardbuffer.triangles[ j ][1] - 1 ][0] + ',' + boardbuffer.vertices[ boardbuffer.triangles[ j ][1] - 1 ][1] + ' ' + boardbuffer.vertices[ boardbuffer.triangles[ j ][2] - 1 ][0] + ',' + boardbuffer.vertices[ boardbuffer.triangles[ j ][2] - 1 ][1]);
		svg.setAttribute('class', boardbuffer.triangles[ j ].mat);
		container.appendChild(svg);
	}
	for (var j = 76; j < boardbuffer.triangles.length ; j++) {

		var svg = document.createElementNS("http://www.w3.org/2000/svg",'polygon');
    		svg.setAttribute('points',boardbuffer.vertices[ boardbuffer.triangles[ j ][0] - 1 ][0] + ',' + boardbuffer.vertices[ boardbuffer.triangles[ j ][0] - 1 ][1] + ' ' + boardbuffer.vertices[ boardbuffer.triangles[ j ][1] - 1 ][0] + ',' + boardbuffer.vertices[ boardbuffer.triangles[ j ][1] - 1 ][1] + ' ' + boardbuffer.vertices[ boardbuffer.triangles[ j ][2] - 1 ][0] + ',' + boardbuffer.vertices[ boardbuffer.triangles[ j ][2] - 1 ][1]);
		svg.setAttribute('class', boardbuffer.triangles[ j ].mat+" way");
		container.appendChild(svg);
	}
}

