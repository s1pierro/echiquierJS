
var wvft = {};
var way = [[0, 0][0, 0]];
var nWay = 0;
var buffer = {};
var boardwvft = {};
var boardbuffer = {};
var xmax = 0, xmin = 0;
var ymax = 0, ymin = 0;
var zmax = 0, zmin = 0;
	
var xmid = 0;
var ymid = 0;
var zmid = 0;
	
var viewangle = 100;

	var vtxlist = [0, 1];
	vtxlist.nv = 2;
	
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
			console.log('nv: '+nv);
	if (triMatches) {
		obj.triangles = triMatches.map(function(tri) {
			nt++;
			var triangles = tri.split(" ");
			triangles.shift();
			return triangles;
		});
	}
			console.log('nt: '+nt);
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
			//console.log('group '+mat);
		} else if (gMatch[0] == 'f')
		{	
			obj.triangles[ng].mat = mat;
		//	console.log(ng+' : '+obj.triangles[ng].mat);
			ng++;
		}
	
		
			
		});
	}
	genzmap(obj);
	obj.nv = nv;
	obj.nt = nt;
	obj.ng = ng;
	
	return obj;
}

function genzmap(obj) {
	var tmp = new Array();

	for (var i = 0; i < obj.nt; i++) {
		var tmp2 = new Array(i, (obj.vertices[obj.triangles[i][2] - 1][2] + obj.vertices[obj.triangles[i][1] - 1][2] + obj.vertices[obj.triangles[i][0] - 1][2]));
		tmp.push(tmp2);
	}
	obj.zmap = tmp;
	obj.zmap.sort(function(a, b) {
		return b[1] - a[1];
	});
}
function switchMaterial(target, value) {

	for ( var j = 0 ; j < buffer.nt  ; j++)
	if ( buffer.triangles[ j ].mat == target) buffer.triangles[ j ].mat = value;

}


function patchwvtf(o) {
	for (var i = 0; i < o.nt ; i++)
	for (var j = 0; j < 3 ; j++) 
	o.triangles[i][j] = o.triangles[i][j] - 1;
	
}

function gennormales() {
	for (var i = 0; i < wvft.nt; i += 1) {
		wvft.triangles[i].n = normalisevertex(vectorproduct(vectfromvertices(wvft.vertices[wvft.triangles[i][0] - 1], wvft.vertices[wvft.triangles[i][2] - 1]).s, vectfromvertices(wvft.vertices[wvft.triangles[i][0] - 1], wvft.vertices[wvft.triangles[i][1] - 1]).s));
	}
}
function gennormalesboard() {
	for (var i = 0; i < boardwvft.nt; i += 1) {
		boardwvft.triangles[i].n = normalisevertex(vectorproduct(vectfromvertices(boardwvft.vertices[boardwvft.triangles[i][0] - 1], boardwvft.vertices[boardwvft.triangles[i][2] - 1]).s, vectfromvertices(boardwvft.vertices[boardwvft.triangles[i][0] - 1], boardwvft.vertices[boardwvft.triangles[i][1] - 1]).s));
	}
}
function loadExempleWavefront() {
			Log('getting wavefront demo');
			var contents = $('#exemple').text();
			Log('parsing wavefront demo');
			var obj = parsewavefront(contents);
			Log('creating buffer');
			
			wvft = $.extend(true, {}, obj);
			gennormales();
			//patchwvtf();
			buffer = $.extend(true, {}, wvft);
			//movetoviewable ();

}
function loadPiecesWavefront() {
			Log('getting pieces wavefront');
			var contents = $('#pieces').text();
			Log('parsing pieces wavefront');
			var obj = parsewavefront(contents);
			Log('creating buffer');
			
			wvft = $.extend(true, {}, obj);
			gennormales();
			//patchwvtf();
			buffer = $.extend(true, {}, wvft);
			//movetoviewable ();

}
function loadBoardWavefront() {
			Log('getting wavefront demo');
			var contents = $('#board').text();
			Log('parsing wavefront demo');
			var obj = parsewavefront(contents);
			Log('creating buffer');
			
			boardwvft = $.extend(true, {}, obj);
			gennormalesboard();
			//patchwvtf();
			boardbuffer = $.extend(true, {}, boardwvft);
			//movetoviewable ();

}
function clearWayables ()
{
			var contents = $('#board').text();
			var obj = parsewavefront(contents);
			boardwvft = $.extend(true, {}, obj);
			gennormalesboard();
			boardbuffer = $.extend(true, {}, boardwvft);
			nWay = 0;
			way.splice(0, way.length );
}
function addVtx ( v )
{
	var exist = false;
	
	for ( var i = 0 ; i < vtxlist.nv ; i++ )
		if ( vtxlist[i] == v ) exist = true;
		
	if ( exist == false )
	{
		vtxlist.push(v);
		vtxlist.nv++;
	}

}

function MovePiece (p, x, y)
{
	vtxlist.splice(0, vtxlist.length );
	vtxlist.nv = 0;
	for ( var i = 0 ; i <  wvft.nt ; i++ )
		if ( wvft.triangles[i].mat == p )
		{
			addVtx ( wvft.triangles[i][0] );
			addVtx ( wvft.triangles[i][1] );
			addVtx ( wvft.triangles[i][2] );
		
		}
	for ( var i = 0 ; i < vtxlist.length ; i ++ )
	{
		wvft.vertices[vtxlist[i]-1][0] =  parseFloat(wvft.vertices[vtxlist[i]-1][0])+(y*64.0);
		wvft.vertices[vtxlist[i]-1][2] =  parseFloat(wvft.vertices[vtxlist[i]-1][2])-(x*64.0);
	}

	var newX = getPiecePositionX(p) +x;
	var newY = getPiecePositionY(p) -y;
	
	plateau[ getPiecePositionX(p) ][ getPiecePositionY(p) ] = "free";
	if (plateau[newX][newY] != "free" )
	{
		console.log ("capture");
		var target = plateau[newX][newY]+"";
		console.log ("capture "+ target);
		vtxlist.splice(0, vtxlist.length );
		vtxlist.nv = 0;
		for ( var i = 0 ; i <  wvft.nt ; i++ )
			if ( wvft.triangles[i].mat == target )
			{
				addVtx ( wvft.triangles[i][0] );
				addVtx ( wvft.triangles[i][1] );
				addVtx ( wvft.triangles[i][2] );
		
			}
		for ( var i = 0 ; i < vtxlist.length ; i ++ )
		{
			wvft.vertices[vtxlist[i]-1][0] =  1000;
			wvft.vertices[vtxlist[i]-1][2] =  1000;
		}
		switchMaterial ( target, "dead");

	$("body").append('<object hidden type="audio/mpeg" width="100" height="40" data="chesssound/capture2.ogg"><param name="filename" value="chesssound/capture2.ogg" /><param name="autostart" value="true" /><param name="loop" value="false" /></object>');
console.log("capture");
	}
	else $("body").append('<object hidden type="audio/mpeg" width="100" height="40" data="chesssound/mov2.ogg"><param name="filename" value="chesssound/mov2.ogg" /><param name="autostart" value="true" /><param name="loop" value="false" /></object>');


	plateau[newX][newY] = p;
		console.log(plateau.join('\n') + '\n\n');
	//buffer = $.extend(true, {}, wvft);

}

function addToWayables (x, y, i)
{
	var xs = 224;
	var ys = 224;
	var mrg = 32;
	var stp = 64;
	var z = 0;
	var v = [-y*stp-mrg+xs, z, -x*stp-mrg+ys ];
	boardwvft.vertices.push(v);
	var v1 = [-y*stp-mrg+xs, z, -x*stp+mrg+ys ];
	boardwvft.vertices.push(v1);
	var v2 = [-y*stp+mrg+xs, z, -x*stp+mrg+ys ];
	boardwvft.vertices.push(v2);
	var v3 = [-y*stp+mrg+xs, z, -x*stp-mrg+ys ];
	boardwvft.vertices.push(v3);

	var tmp = boardwvft.nv;
	var t = [tmp+2, tmp+4, tmp+1];
	boardwvft.triangles.push(t);
	t = [tmp+4, tmp+2, tmp+3];
	boardwvft.triangles.push(t);

	boardwvft.nt = boardwvft.nt+2;
	boardwvft.nv = boardwvft.nv+4;

	var n = [ 0.0, 1.0, 0.0];
	boardwvft.triangles[boardwvft.nt-1].mat = "way"+nWay;
	boardwvft.triangles[boardwvft.nt-1].n=n;
	boardwvft.triangles[boardwvft.nt-2].mat = "way"+nWay;
	boardwvft.triangles[boardwvft.nt-2].n=n;
	

	boardbuffer = $.extend(true, {}, boardwvft);
	var tmp = [x, y]
	way.push(tmp);
	
	nWay++;
	console.log(way.join('\n') + '\n\n');
}
