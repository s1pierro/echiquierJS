
var wvft = {};
var way = [[0, 0][0, 0]];

var buffer = {};
var boardwvft = {};
var boardbuffer = {};
var xmax = 0, xmin = 0;
var ymax = 0, ymin = 0;
var zmax = 0, zmin = 0;
	
var xmid = 0;
var ymid = 0;
var zmid = 0;


function getfaceid(f) {
	var tmp = $(f).attr('class');
	var tmp2 = tmp.match(/fc\d+cf/) + '+';
	var faceid = parseInt(tmp2.match(/\d+/));
	return faceid;
}
function getfacematerial(f) {
	var tmp = $(f).attr('class');
	var tmp2 = tmp.match(/fc\d+cf/) + '+';
	var faceid = parseInt(tmp2.match(/\d+/));
	var material = wvft.triangles[faceid].mat
	
	return material;
}
function movetoviewable ()
{
	xmax = wvft.vertices[0][0];
	xmax = wvft.vertices[0][0];
	ymax = wvft.vertices[0][1];
	ymax = wvft.vertices[0][1];
	zmax = wvft.vertices[0][2];
	zmax = wvft.vertices[0][2];

	for ( var i = 0 ; i < nv ; i++)
	{
		if ( wvft.vertices[i][0] > xmax ) xmax = parseFloat(wvft.vertices[i][0]);
		if ( wvft.vertices[i][0] < xmin ) xmin = parseFloat(wvft.vertices[i][0]);
		if ( wvft.vertices[i][1] > ymax ) ymax = parseFloat(wvft.vertices[i][1]);
		if ( wvft.vertices[i][1] < ymin ) ymin = parseFloat(wvft.vertices[i][1]);
		if ( wvft.vertices[i][2] > zmax ) zmax = parseFloat(wvft.vertices[i][2]);
		if ( wvft.vertices[i][2] < zmin ) zmin = parseFloat(wvft.vertices[i][2]);
	}
	var xmid = (xmax+xmin)/2;
	var ymid = (ymax+ymin)/2;
	var zmid = (zmax+zmin)/2;
	console.log('max; '+xmax+' '+ymax+' '+zmax);
	console.log('min; '+xmin+' '+ymin+' '+zmin);
	console.log('mid; '+xmid+' '+ymid+' '+zmid);
	pmat = gentmat (-xmid, -ymid, -zmid);
}
function readWavefrontFile(evt) {
	var f = evt.target.files[0];
	if (f) {
		var r = new FileReader();
		r.onload = function(e) {
			var contents = e.target.result;
			var obj = parsewavefront(e.target.result);
			wvft = $.extend(true, {}, obj);
			gennormales();
			buffer = $.extend(true, {}, wvft);
			movetoviewable ();

	initView();
		}
		r.readAsText(f);
	} else {
		alert("Failed to load file");
	}
}
function parsewavefront(objText) {
	var nv = 0;
	var nt = 0;
	var ng = 0;
	var obj = {};
	var vertexMatches = objText.match(/^v( -?\d+(\.\d+)?){3}$/gm);
	var triMatches = objText.match(/^f( \d+){3}$/gm);
	var gMatches = objText.match(/^f( \d+){3}$|^usemtl (.+)$/gm);
	if (vertexMatches) {
		obj.vertices = vertexMatches.map(function(vertex) {
			nv++;
			var vertices = vertex.split(" ");
			vertices.shift();
			return vertices;
		});
	}

	if (triMatches) {
		obj.triangles = triMatches.map(function(tri) {
			nt++;
			var triangles = tri.split(" ");
			triangles.shift();
			return triangles;
		});
	}

	var mat = 'mat';
	if (gMatches) {
		gMatches.map(function(g) {
			var inc = true;
			var gMatch = g.split(" ");
			if (gMatch[0] == 'usemtl')
			{
				gMatch.shift();
				inc = false;
				mat = gMatch[0];
			} else if (gMatch[0] == 'f')
			{	
				obj.triangles[ng].mat = mat;
				ng++;
			}
		});
	}
	genzmap(obj);

	obj.ng = ng;
	return obj;
}

function loadWavefrontFromHTLM(id) {
	
			Log('getting wavefront from '+id);
			var contents = $(id).text();
			var obj = parsewavefront(contents);
			Log('loaded : '+obj.vertices.length+' vertices, '+obj.triangles.length+' triangles');
			genNormales(obj);			
			return obj;
}
function genzmap(obj) {
	var tmp = new Array();

	for (var i = 0; i < obj.triangles.length; i++) {
		var tmp2 = new Array(i, (obj.vertices[obj.triangles[i][2] - 1][2] + obj.vertices[obj.triangles[i][1] - 1][2] + obj.vertices[obj.triangles[i][0] - 1][2]));
		tmp.push(tmp2);
	}
	obj.zmap = tmp;
	obj.zmap.sort(function(a, b) {
		return b[1] - a[1];
	});
}
function switchMaterial(target, value) {

	for ( var j = 0 ; j < wvft.triangles.length  ; j++)
	if ( wvft.triangles[ j ].mat == target) wvft.triangles[ j ].mat = value;
}
function patchwvtf(o) {
	for (var i = 0; i < o.triangles.length ; i++)
	for (var j = 0; j < 3 ; j++) 
	o.triangles[i][j] = o.triangles[i][j] - 1;
	
}
function genNormales(obj) {
	for (var i = 0; i < obj.triangles.length; i += 1) {
		obj.triangles[i].n = normalisevertex(vectorproduct(vectfromvertices(obj.vertices[obj.triangles[i][0] - 1], obj.vertices[obj.triangles[i][2] - 1]).s, vectfromvertices(obj.vertices[obj.triangles[i][0] - 1], obj.vertices[obj.triangles[i][1] - 1]).s));
	}
}

function addElementToList ( l, e )
{
	var exist = false;
	for ( var i = 0 ; i < l.length ; i++ ) 	if ( l[i] == e ) exist = true;
	if ( exist == false ) l.push(e);

}

function getVerticesByMaterial (m)
{	

	var tmp = [];
	for ( var i = 0 ; i <  wvft.triangles.length ; i++ )
		if ( wvft.triangles[i].mat == m )
		{
			addElementToList ( tmp, wvft.triangles[i][0] );
			addElementToList ( tmp, wvft.triangles[i][1] );
			addElementToList ( tmp, wvft.triangles[i][2] );
		}
	return tmp;
		
}
function translateVertices (vertices, x, y, z)
{
	for ( var i = 0 ; i < vertices.length ; i ++ )
	{
		wvft.vertices[vertices[i]-1][0] =  parseFloat(wvft.vertices[vertices[i]-1][0])+x;
		wvft.vertices[vertices[i]-1][1] =  parseFloat(wvft.vertices[vertices[i]-1][1])+y;
		wvft.vertices[vertices[i]-1][2] =  parseFloat(wvft.vertices[vertices[i]-1][2])+z;
	}	
}
function translateVerticesByMaterial (material, x, y, z)
{
	var vertices = getVerticesByMaterial (material);
	translateVertices (vertices, x, y, z);
}
function deleteVerticeFromWavefront (v)
{
	for ( var i = 0 ; i < wvft.triangles.length ; i++ )
		for ( var j = 0 ; j < 3 ; j++ )
			if (wvft.triangles[i][j] > v)
				wvft.triangles[i][j] = wvft.triangles[i][j]-1;
	wvft.vertices.splice(v, 1);
}
function deleteTrianglesFromWavefrontByMaterial (m)
{
	for ( var i = 0 ; i < wvft.triangles.length ; i++ )
		if (wvft.triangles[i].mat == m )
		{
			wvft.triangles.splice(i, 1);
			//wvft.nt--;
			i--;
		}
	var vertices = getVerticesByMaterial (m);
	for ( var i = 0 ; i < vertices.length ; i++ )
		deleteVerticeFromWavefront (vertices[i]);
	buffer = $.extend(true, {}, wvft);
}


function mergeWavefronts (a, b)
{
	var inc = a.vertices.length;
	for ( var i = 0 ; i < b.vertices.length ; i++ )
		a.vertices.push (b.vertices[i]);
	for ( var i = 0 ; i < b.triangles.length ; i++ )
	{
		var tmp = [b.triangles[i][0]+inc,b.triangles[i][1]+inc,b.triangles[i][2]+inc ];
		tmp.n = [0, 0, 0];
		tmp.mat = b.triangles[i].mat;
		a.triangles.push(tmp);
		
	}
	// WTF'n here !!!???

		
}
// chessboard function
function clearWayables ()
{
	boardwvft = loadWavefrontFromHTLM('#board');
	boardbuffer = $.extend(true, {}, boardwvft);	
	way.splice(0, way.length );
}

function MovePiece (p, x, y, flags)
{
	var q = 0.01;
	for ( var i = 0 ; i < 100 ; i++ )
	{
		translateVerticesByMaterial (p, y*64.0*q, 0, -x*64.0*q);

	}
	
	//var q = 1;
	//translateVerticesByMaterial (p, y*64.0*q, 0, -x*64.0*q);
	

	var newX = ChessPiece(p).position.x +x;
	var newY = ChessPiece(p).position.y -y;
	
	plateau[ ChessPiece(p).position.x ][ ChessPiece(p).position.y ] = "free";

	var target = plateau[newX][newY]+"";
	
	if ( flags == 'c' | flags == 'cp' )
	{
		target = plateau[newX][newY]+"";
		killPiece (plateau[newX][newY]);
		switchMaterial ( target, "dead");
	}
	if ( flags == 'e')
	{
		if ( newX > 4 )
			target = plateau[newX-1][newY]+"";
		else
			target = plateau[newX+1][newY]+"";
		killPiece (target)
	}
	$("body").append('<object id="capture" hidden type="audio/mpeg" width="100" height="40" data="chesssound/capture2.ogg"><param name="filename" value="chesssound/capture2.ogg" /><param name="autostart" value="true" /><param name="loop" value="false" /></object>');
	plateau[newX][newY] = p;

}
function killPiece (p)
{

	deleteTrianglesFromWavefrontByMaterial (p);
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

	var n = [ 0.0, 1.0, 0.0];
	boardwvft.triangles[boardwvft.triangles.length-1].mat = "way"+way.length;
	boardwvft.triangles[boardwvft.triangles.length-1].n=n;
	boardwvft.triangles[boardwvft.triangles.length-2].mat = "way"+way.length;
	boardwvft.triangles[boardwvft.triangles.length-2].n=n;

	boardbuffer = $.extend(true, {}, boardwvft);
	var tmp = [x, y]
	way.push(tmp);	


}
