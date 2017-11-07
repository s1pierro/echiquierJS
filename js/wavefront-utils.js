
var wvft = {};
var way2 = [{square:'a4', move:'a4'}, {square:'a3', move:'a3'}];

var buffer = {};
var boardwvft = {};
var boardbuffer = {};
var xmax = 0, xmin = 0;
var ymax = 0, ymin = 0;
var zmax = 0, zmin = 0;
	
var xmid = 0;
var ymid = 0;
var zmid = 0;
	



function getFaceId(f) {
	var tmp = $(f).attr('class');
	var tmp2 = tmp.match(/id.+id/gi) + '';
	if (tmp2.includes('id')) tmp2=tmp2.slice(2, tmp2.length-2);
	return tmp2;
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
function parsewavefront(objText, id) {
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
	for (var i = 0 ; i < obj.triangles.length ; i++ )
		obj.triangles[i].id  = id;
	genzmap(obj);
	obj.nv = nv;
	obj.nt = nt;
	obj.ng = ng;
	return obj;
}

function loadWavefrontFromHTLM(object, id) {
	
			Log('getting wavefront from '+id);
			var contents = $(object).text();
			var obj = parsewavefront(contents, id);
			Log('loaded : '+obj.nv+' vertices, '+obj.nt+' triangles');
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
function genPpcszmap(pcs) {
	var tmp = new Array();

	for (var i = 0; i < altPieces.length; i++)
		buffer.vertices[i] = applymat(fmat, altPieces[i].w.vertices[0]);

	for (var i = 0; i < altPieces.length; i++) {
		var tmp2 = new Array(i, buffer.vertices[i][2]);
		tmp.push(tmp2);
	}
	pcs.zmap = tmp;
	pcs.zmap.sort(function(a, b) {
		return b[1] - a[1];
	});
}
function switchMaterialWavefront(w, value) {

	for ( var j = 0 ; j < w.nt  ; j++)
		w.triangles[ j ].mat = value;
}

function switchMaterialInWavefront(w, target, value) {

	for ( var j = 0 ; j < w.nt  ; j++)
	if ( w.triangles[ j ].mat == target) w.triangles[ j ].mat = value;
}
function switchMaterialInWavefrontById(w, id, value) {

	for ( var j = 0 ; j < w.nt  ; j++)
	if ( w.triangles[ j ].id == id) w.triangles[ j ].mat = value;
}
function changeId (w, target, value) {

	for ( var j = 0 ; j < w.triangles.length  ; j++)
		if ( w.triangles[ j ].id == target) w.triangles[ j ].id = value;
}
/*function switchMaterial(target, value) {

	for ( var j = 0 ; j < buffer.nt  ; j++)
	if ( buffer.triangles[ j ].mat == target) buffer.triangles[ j ].mat = value;
}*/
function genNormales(obj) {
	for (var i = 0; i < obj.nt; i += 1) {
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
	for ( var i = 0 ; i <  wvft.nt ; i++ )
		if ( wvft.triangles[i].mat == m )
		{
			addElementToList ( tmp, wvft.triangles[i][0] );
			addElementToList ( tmp, wvft.triangles[i][1] );
			addElementToList ( tmp, wvft.triangles[i][2] );
		}
	return tmp;
		
}
function getVerticesById (id)
{	

	var tmp = [];
	for ( var i = 0 ; i <  wvft.nt ; i++ )
		if ( wvft.triangles[i].id == id )
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
function translateWavefront (wavefront, x, y, z)
{

	for ( var i = 0 ; i < wavefront.vertices.length ; i ++ )
	{

		wavefront.vertices[i][0] =  parseFloat(wavefront.vertices[i][0])+x;
		wavefront.vertices[i][1] =  parseFloat(wavefront.vertices[i][1])+y;
		wavefront.vertices[i][2] =  parseFloat(wavefront.vertices[i][2])+z;

	}	
}
function rotateWavefront (wavefront, x, y, z)
{
	var tmpmat = genrmat(x, y, z);
	var tmp = wavefront;
	for (var i = 0; i < wavefront.vertices.length; i++)
		wavefront.vertices[i] = applymat(tmpmat, wavefront.vertices[i]);
	genNormales(wavefront); 

}
function translateVerticesByMaterial (material, x, y, z)
{
	var vertices = getVerticesByMaterial (material);
	translateVertices (vertices, x, y, z);
}
function translateVerticesById (id, x, y, z)
{
	var vertices = getVerticesById (id);
	translateVertices (vertices, x, y, z);
}
function deleteVerticeFromWavefront (v)
{
	for ( var i = 0 ; i < wvft.nt ; i++ )
		for ( var j = 0 ; j < 3 ; j++ )
			if (wvft.triangles[i][j] > v)
				wvft.triangles[i][j] = wvft.triangles[i][j]-1;
	wvft.vertices.splice(v, 1);
}
function deleteTrianglesFromWavefrontByMaterial (m)
{
	for ( var i = 0 ; i < wvft.nt ; i++ )
		if (wvft.triangles[i].mat == m )
		{
			wvft.triangles.splice(i, 1);
			wvft.nt--;
			i--;
		}
	var vertices = getVerticesByMaterial (m);
	for ( var i = 0 ; i < vertices.length ; i++ )
		deleteVerticeFromWavefront (vertices[i]);
	buffer = $.extend(true, {}, wvft);
}
function deleteTrianglesFromWavefrontById (id)
{
	for ( var i = 0 ; i < wvft.nt ; i++ )
		if (wvft.triangles[i].id == id )
		{
			wvft.triangles.splice(i, 1);
			wvft.nt--;
			i--;
		}
	var vertices = getVerticesById (id);
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
		var tmp = [parseInt(b.triangles[i][0])+inc,parseInt(b.triangles[i][1])+inc,parseInt(b.triangles[i][2])+inc ];
		tmp.n = b.triangles[i].n;
		tmp.mat = b.triangles[i].mat;
		tmp.id = b.triangles[i].id;
		a.triangles.push(tmp);
		
	}
	a.nt = a.nt+b.nt;
	a.nv = a.nv+b.nv;

}
////////////////////////////////////////////////////////////////////////////////
// chessboard function  ////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

