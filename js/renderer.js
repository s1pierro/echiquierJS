var viewangle = 140;
var fmat = genimat();
var rmat = genimat();
var tmat = gentmat(0, 0, 100);
var pmat = gentmat(0, 0, 0);
var ts1 = Date.now();
var ts2 = Date.now();
var increment = 0.0;

var ZlockANGx = 196;
var ZlockANGy = 230;
var ZlockANGz = 0;
var zoom = 1000;



container = document.getElementById("renderbox");



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
/*
createClass('.'+name,'fill: rgb('+Math.floor( difuse.r*0.75)+', '+Math.floor( difuse.g*0.75)+', '+Math.floor( difuse.b*0.75)+');');
//createClass('.'+name,'fill: rgb('+Math.floor( difuse.r*0.6)+', '+Math.floor( difuse.g*0.6)+', '+Math.floor( difuse.b*0.6)+');');


// Warning On Chromium web browser, framerate is dramaticaly affected by css rules quantity.
/*
createClass('.'+name+'-step-0', ' fill: rgb('+Math.floor( difuse.r*0.5)+', '+Math.floor( difuse.g*0.5)+', '+Math.floor( difuse.b*0.5)+');');
createClass('.'+name+'-step-1', 'fill: rgb('+Math.floor( difuse.r*0.5)+', '+Math.floor( difuse.g*0.5)+', '+Math.floor( difuse.b*0.5)+');');
createClass('.'+name+'-step-2', 'fill: rgb('+Math.floor( difuse.r*0.5)+', '+Math.floor( difuse.g*0.5)+', '+Math.floor( difuse.b*0.5)+');');
createClass('.'+name+'-step-3', 'fill: rgb('+Math.floor( difuse.r*0.5)+', '+Math.floor( difuse.g*0.5)+', '+Math.floor( difuse.b*0.5)+');');
createClass('.'+name+'-step-4', 'fill: rgb('+Math.floor( difuse.r*0.5)+', '+Math.floor( difuse.g*0.5)+', '+Math.floor( difuse.b*0.5)+');');
createClass('.'+name+'-step-5', 'fill: rgb('+Math.floor( difuse.r*0.5)+', '+Math.floor( difuse.g*0.5)+', '+Math.floor( difuse.b*0.5)+');');
createClass('.'+name+'-step-6', 'fill: rgb('+Math.floor( difuse.r*0.5)+', '+Math.floor( difuse.g*0.5)+', '+Math.floor( difuse.b*0.5)+');');
createClass('.'+name+'-step-7', 'fill: rgb('+Math.floor( difuse.r*0.5)+', '+Math.floor( difuse.g*0.5)+', '+Math.floor( difuse.b*0.5)+');');
createClass('.'+name+'-step-8', 'fill: rgb('+Math.floor( difuse.r*0.5)+', '+Math.floor( difuse.g*0.5)+', '+Math.floor( difuse.b*0.5)+');');
createClass('.'+name+'-step-9', 'fill: rgb('+Math.floor( difuse.r*0.5)+', '+Math.floor( difuse.g*0.5)+', '+Math.floor( difuse.b*0.5)+');');
createClass('.'+name+'-step-10', 'fill: rgb('+Math.floor( difuse.r*0.5)+', '+Math.floor( difuse.g*0.5)+', '+Math.floor( difuse.b*0.5)+');');
createClass('.'+name+'-step-11', 'fill: rgb('+Math.floor( difuse.r*0.96)+', '+Math.floor( difuse.g*0.96)+', '+Math.floor( difuse.b*0.96)+');');
createClass('.'+name+'-step-12', 'fill: rgb('+Math.floor( difuse.r*0.97)+', '+Math.floor( difuse.g*0.97)+', '+Math.floor( difuse.b*0.97)+');');
createClass('.'+name+'-step-13', 'fill: rgb('+Math.floor( difuse.r*0.98)+', '+Math.floor( difuse.g*0.98)+', '+Math.floor( difuse.b*0.98)+');');
createClass('.'+name+'-step-14', 'fill: rgb('+Math.floor( difuse.r*0.99)+', '+Math.floor( difuse.g*0.99)+', '+Math.floor( difuse.b*0.99)+');');
createClass('.'+name+'-step-15', 'fill: rgb('+Math.floor( difuse.r*1.0)+', '+Math.floor( difuse.g*1.0)+', '+Math.floor( difuse.b*1.0)+');');*/
var cssRule =  '\n.'+name+'\n{\n	fill: rgb('+Math.floor( difuse.r*0.6)+', '+Math.floor( difuse.g*0.6)+', '+Math.floor( difuse.b*0.6)+');\n}';
cssRule +=  '\n.'+name+'-step-15\n{\n	fill: rgb('+Math.floor( difuse.r*1.0)+', '+Math.floor( difuse.g*1.0)+', '+Math.floor( difuse.b*1.0)+');\n}';
cssRule +=  '\n.'+name+'-step-14\n{\n	fill: rgb('+Math.floor( difuse.r*1.0)+', '+Math.floor( difuse.g*1.0)+', '+Math.floor( difuse.b*1.0)+');\n}';
cssRule +=  '\n.'+name+'-step-13\n{\n	fill: rgb('+Math.floor( difuse.r*1.0)+', '+Math.floor( difuse.g*1.0)+', '+Math.floor( difuse.b*1.0)+');\n}';
cssRule +=  '\n.'+name+'-step-12\n{\n	fill: rgb('+Math.floor( difuse.r*1.0)+', '+Math.floor( difuse.g*1.0)+', '+Math.floor( difuse.b*1.0)+');\n}';
cssRule +=  '\n.'+name+'-step-11\n{\n	fill: rgb('+Math.floor( difuse.r*1.0)+', '+Math.floor( difuse.g*1.0)+', '+Math.floor( difuse.b*1.0)+');\n}';

console.log (cssRule);
$('#ui').append(cssRule);
}

function initViewZlock(x, y, z, zm)
{
	//zoom = zm;
	pmat = gentmat(0, 0, 0);
	tmat = gentmat(0, 0, zoom);
	ZlockANGx = x;
	ZlockANGy = y;
	ZlockANGz = z;
	
	rmat = genrmat( x, y, z);
	genfmat();
	viewChessBoard();
}


var renderProcess = [genfmat, drawboard, drawpiecesWriteIdDisplayExperimentalLighted, adjustRenderFrame ];
function initRenderer (attr, value)
{
	renderProcessConfig ('renderType', '3d');
	renderProcessConfig ('celShader', 'medium');
}
function renderProcessConfig (attr, value)
{
	if (attr == 'renderType')
	{
		if ( value == '3d')
			renderProcess = [genfmat, drawboard, drawpiecesWriteIdDisplayExperimentalLighted, adjustRenderFrame ];
		if ( value == '2d')
			renderProcess = [genfmat, drawboard, drawpiecesWriteIdMobileDisplay, adjustRenderFrame ];
	}
	if (attr == 'celShader')
	{
		if ( value == 'ultrathin')
			$('.lineMask').css('stroke-width', '0.23px');
		
		if ( value == 'thin')
			$('.lineMask').css('stroke-width', '0.23px');


		if ( value == 'medium')
			$('.lineMask').css('stroke-width', '0.23px');


		if ( value == 'large')
			$('.lineMask').css('stroke-width', '0.23px');

	}
	if (attr == 'quality')
	{
		if ( value == 'low') $('svg').attr('shape-rendering', 'optimisedSpeed');
		if ( value == 'medium')	$('svg').attr('shape-rendering', 'crispEdges');
		if ( value == 'hight') $('svg').attr('shape-rendering', 'geometricPrecision');		
	}
}
function viewChessBoard()
{
	renderProcess[0]();
	renderProcess[1]();
	renderProcess[2]();
	if ( ZlockANGx < 230 && ZlockANGx > 190 ) renderProcess[3]();
}
	
function getCSSRule(ruleName) {
    ruleName = ruleName.toLowerCase();
    var result = null;
    var find = Array.prototype.find;

    find.call(document.styleSheets, styleSheet => {
        result = find.call(styleSheet.css=Rules, cssRule => {
            return cssRule instanceof CSSStyleRule 
                && cssRule.selectorText.toLowerCase() == ruleName;
        });
        return result != null;
    });
    return result;
}

function adjustRenderFrame()
{

	var w = $(window).width();
	var h = $(window).height();
	var ratio = w/h;
	var zooom = (97.5/ratio);

 		var coef = ((ZlockANGx-190)/22)*(2*(h/3))+h/3;


		console.log ('ZlockANGx : '+ZlockANGx+' h :'+coef);
		if (coef > h) coef=h;
		if (coef > w) coef=w;
		
		if (coef < h/3) coef=h/3;
		console.log ('ZlockANGx : '+ZlockANGx+' checked h :'+coef);
		$('#svg8').attr('width', w);
		$('#svg8').attr('height', coef);//(ZlockANGx/240));	
		if (w > h) $("#svg8").attr('viewBox', '-'+(zooom*ratio)/2+' -'+((coef/h)*zooom)/2+' '+(zooom*ratio)+' '+(coef/h)*zooom);
		else
		{
		zooom=97.5;
		$("#svg8").attr('viewBox', '-'+(zooom)/2+' -'+((coef/h)*zooom)/2+' '+(zooom)+' '+(coef/h)*zooom);
		}
}

function rotateViewZlock(x, y)
{
	ZlockANGy -= y;
	ZlockANGx += x;

	if ( ZlockANGx < 190 ) ZlockANGx = 190;
	
	if ( ZlockANGx > 220 ) ZlockANGx = 220;
	
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
      svg.setAttribute('class', 'fc'+j+'cf face '+buffer.triangles[ j ].mat+' '+buffer.triangles[ j ].mat+'-step-'+Math.floor(n*16));
		container.appendChild(svg);

	}

	ts2 = Date.now();
	increment = -(ts2-ts1)/1000;
	ts1 = Date.now();
}
function drawpiecesWriteId() {
	

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
       //svg.setAttribute('class', 'id'+buffer.triangles[ j ].id+'id piece '+buffer.triangles[j].mat+' '+buffer.triangles[ j ].mat+'-step-14');
       svg.setAttribute('class', 'id'+buffer.triangles[ j ].id+'id piece '+buffer.triangles[j].mat+' '+buffer.triangles[ j ].mat+'-step-'+Math.floor(n*16));

		container.appendChild(svg);

	}

	ts2 = Date.now();
	increment = -(ts2-ts1)/1000;
	ts1 = Date.now();
}
function drawpiecesWriteIdMobileDisplay() {
	
	var tmpWvft2 = {};
	genPpcszmap(Pieces);
	for ( var v = 0 ; v < Pieces.zmap.length ; v++ )
	{

		var u = Pieces.zmap[v][0];	

		var tmpWvft = Pieces[u].w;
	buffer = $.extend(true, {}, tmpWvft);	
	for (var i = 0; i < tmpWvft.vertices.length; i++)
		buffer.vertices[i] = applymatNpersp(fmat, tmpWvft.vertices[i]);
	for (var i = 0; i < tmpWvft.triangles.length; i++)
		buffer.triangles[i].n = applymat(rmat, tmpWvft.triangles[i].n);


	for (var j = 0; j < tmpWvft.triangles.length ; j++)
	{
		
		var n = buffer.triangles[ j ].n[2];
		
		var svg = document.createElementNS("http://www.w3.org/2000/svg",'polygon');
		var trigon = buffer.vertices[ tmpWvft.triangles[ j ][0] - 1 ][0] + ',' + buffer.vertices[ tmpWvft.triangles[ j ][0] - 1 ][1] + ' ' + buffer.vertices[ tmpWvft.triangles[ j ][1] - 1 ][0] + ',' + buffer.vertices[ tmpWvft.triangles[ j ][1] - 1 ][1] + ' ' + buffer.vertices[ tmpWvft.triangles[ j ][2] - 1 ][0] + ',' + buffer.vertices[ tmpWvft.triangles[ j ][2] - 1 ][1];
      svg.setAttribute('points',trigon);
       svg.setAttribute('class', 'id'+tmpWvft.triangles[ j ].id+'id lineMask');

		container.appendChild(svg);

	}
	for (var j = 0; j < tmpWvft.triangles.length ; j++)
//	for (var i = 0; i < tmpWvft.triangles.length ; i++)
	{
	//	var j = tmpWvft.zmap[i][0];
	//	var n = buffer.triangles[ j ].n[2];
		
		var svg = document.createElementNS("http://www.w3.org/2000/svg",'polygon');
		var trigon = buffer.vertices[ tmpWvft.triangles[ j ][0] - 1 ][0] + ',' + buffer.vertices[ tmpWvft.triangles[ j ][0] - 1 ][1] + ' ' + buffer.vertices[ tmpWvft.triangles[ j ][1] - 1 ][0] + ',' + buffer.vertices[ tmpWvft.triangles[ j ][1] - 1 ][1] + ' ' + buffer.vertices[ tmpWvft.triangles[ j ][2] - 1 ][0] + ',' + buffer.vertices[ tmpWvft.triangles[ j ][2] - 1 ][1];
      svg.setAttribute('points',trigon);
       svg.setAttribute('class', 'id'+tmpWvft.triangles[ j ].id+'id piece '+tmpWvft.triangles[j].mat+' '+tmpWvft.triangles[ j ].mat+'-step-13');

		container.appendChild(svg);

	}
}

	ts2 = Date.now();
	increment = -(ts2-ts1)/1000;
	ts1 = Date.now();
}

function drawpiecesWriteIdDisplayExperimentalLighted() {  //optimised speed ( cut in lightening acuracy )
	
	
	//ts1 = Date.now();
	var tmpWvft2 = {};
	genPpcszmap(Pieces);
	for ( var v = 0 ; v < Pieces.zmap.length ; v++ )
	{
		var u = Pieces.zmap[v][0];	

		var tmpWvft = Pieces[u].w;
		buffer = $.extend(true, {}, tmpWvft);
	
		for (var i = 0; i < tmpWvft.vertices.length; i++)
			buffer.vertices[i] = applymatNpersp(fmat, tmpWvft.vertices[i]);
		for (var i = 0; i < tmpWvft.triangles.length; i++)
			buffer.triangles[i].n = applymat(rmat, tmpWvft.triangles[i].n);
		genzmap(buffer);
		for (var j = 0; j < tmpWvft.triangles.length ; j++)
		{
		
			var n = buffer.triangles[ j ].n[2];
			if (n>-0.3)
			{
				var svg = document.createElementNS("http://www.w3.org/2000/svg",'polygon');
				buffer.triangles[ j ].trigon = buffer.vertices[tmpWvft.triangles[j][0]-1][0]+','+buffer.vertices[tmpWvft.triangles[j][0]-1 ][1];
				for ( var k = 1 ; k < tmpWvft.triangles[j].length ; k++)
					buffer.triangles[ j ].trigon+= ' '+buffer.vertices[tmpWvft.triangles[j][k]-1][0]+','+buffer.vertices[tmpWvft.triangles[j][k]-1 ][1];
				svg.setAttribute('points',buffer.triangles[ j ].trigon);
				svg.setAttribute('class', 'id'+tmpWvft.triangles[ j ].id+'id lineMask');
				container.appendChild(svg);
			}
		}
		for (var i = 0; i < tmpWvft.triangles.length ; i++)
		{
			var j = buffer.zmap[i][0];
			var n = buffer.triangles[ j ].n[2];
			if (n>0.8)
			{
				var svg = document.createElementNS("http://www.w3.org/2000/svg",'polygon');
		 		svg.setAttribute('points',buffer.triangles[ j ].trigon);
				svg.setAttribute('class', 'id'+tmpWvft.triangles[ j ].id+'id piece '+tmpWvft.triangles[ j ].mat+'-step-15');
				container.appendChild(svg);
			}
			else if (n>-0.3)
			{
				var svg = document.createElementNS("http://www.w3.org/2000/svg",'polygon');
				svg.setAttribute('points',buffer.triangles[j].trigon);
				svg.setAttribute('class', 'id'+tmpWvft.triangles[ j ].id+'id piece '+tmpWvft.triangles[j].mat);
				container.appendChild(svg);
			}
		}
	}	
	/*ts2 = Date.now();
	
	console.log ( 'perf : '+(ts2-ts1));*/
}

function drawboard() {
	
	for (var i = 0; i < boardwvft.vertices.length; i++)
		boardbuffer.vertices[i] = applymatNpersp(fmat, boardwvft.vertices[i]);
   	container.innerHTML = "";
	for (var j = 0; j < 38 ; j++) {

		var svg = document.createElementNS("http://www.w3.org/2000/svg",'polygon');
    		svg.setAttribute('points',boardbuffer.vertices[ boardbuffer.triangles[ j ][0] - 1 ][0] + ',' + boardbuffer.vertices[ boardbuffer.triangles[ j ][0] - 1 ][1] + ' ' + boardbuffer.vertices[ boardbuffer.triangles[ j ][1] - 1 ][0] + ',' + boardbuffer.vertices[ boardbuffer.triangles[ j ][1] - 1 ][1] + ' ' + boardbuffer.vertices[ boardbuffer.triangles[ j ][2] - 1 ][0] + ',' + boardbuffer.vertices[ boardbuffer.triangles[ j ][2] - 1 ][1] + ' ' + boardbuffer.vertices[ boardbuffer.triangles[ j ][3] - 1 ][0] + ',' + boardbuffer.vertices[ boardbuffer.triangles[ j ][3] - 1 ][1]);
		svg.setAttribute('class', boardbuffer.triangles[ j ].mat+'-step-15 square');
		container.appendChild(svg);
	}
	for (var j = 38; j < boardbuffer.triangles.length ; j++) {

		var svg = document.createElementNS("http://www.w3.org/2000/svg",'polygon');
    		svg.setAttribute('points',boardbuffer.vertices[ boardbuffer.triangles[ j ][0] - 1 ][0] + ',' + boardbuffer.vertices[ boardbuffer.triangles[ j ][0] - 1 ][1] + ' ' + boardbuffer.vertices[ boardbuffer.triangles[ j ][1] - 1 ][0] + ',' + boardbuffer.vertices[ boardbuffer.triangles[ j ][1] - 1 ][1] + ' ' + boardbuffer.vertices[ boardbuffer.triangles[ j ][2] - 1 ][0] + ',' + boardbuffer.vertices[ boardbuffer.triangles[ j ][2] - 1 ][1]);
		svg.setAttribute('class', boardbuffer.triangles[ j ].mat+" way");
		container.appendChild(svg);
	}
}

