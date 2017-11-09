// FIXME UNUSABLE


function gererateThemeCss ()
{
	generateMaterialsCSS ('blancs', {r:255, g:255, b:255});
	generateMaterialsCSS ('noirs', {r:110, g:110, b:110});
	generateMaterialsCSS ('selectedPiece', {r:0, g:0, b:220});

	generateMaterialsCSS ('HARDbrown',{r:128, g:51, b:0} );
	generateMaterialsCSS ('HARDcream',{r:255, g:230, b:128} );

//	generateMaterialsCSS ('blancs', {r:253, g:251, b:235});
/*	generateMaterialsCSS ('blancs', {r:253, g:231, b:135});
	generateMaterialsCSS ('noirs', {r:169, g:162, b:137});
	generateMaterialsCSS ('selectedPiece', {r:0, g:0, b:220});

	generateMaterialsCSS ('HARDbrown', {r:80, g:80, b:80});
	generateMaterialsCSS ('HARDcream',{r:245, g:245, b:245} );
*/
/*createClass('.piece.lineMask',  'fill: none !important;'+
				'opacity: 1.0 !important;'+
				'stroke: #000 !important;'+
				'stroke-linejoin: round;'+
				'stroke-width: 1.4px !important;'
);
*/
//createClass('.', '');
}function generateMaterialsCSS (name, difuse)
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
