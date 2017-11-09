/** @constructor */
function Vector(o, s, n) {
	this.o = o;
	this.s = s;
	this.n = n;
}
window['Vector'] = Vector;

function logVector(vect) {
	console.log('origine: ' + vect.o + ' sens: ' + vect.s + ' norme: ' + vect.n);
}
window['logVector'] = logVector;

function magnitudevertex(a) {
	return Math.sqrt(a[0] * a[0] + a[1] * a[1] + a[2] * a[2]);
}
window['magnitudevertex'] = magnitudevertex;
function normalisevertex(q) {
	var v = [0, 0, 0];
	var norme = magnitudevertex(q);
	v[0] = q[0] / norme;
	v[1] = q[1] / norme;
	v[2] = q[2] / norme;
	return v;
}
window['normalisevertex'] = normalisevertex;

function vectorproduct(a, b) {
	var c = [a[1] * b[2] - a[2] * b[1],
		a[2] * b[0] - a[0] * b[2],
		a[0] * b[1] - a[1] * b[0]
	];
	return c;
}
window['vectorproduct'] = vectorproduct;

function scalarproduct (a, b)
{

	var c = a[0] * b[0] + a[1] * b[1] + a[2] * b[2] ;
	return c;

}
window['scalarproduct'] = scalarproduct;

function multiplymatrix(m1, m2) {
	var m = [];
	m.length = 16;
	var a, b, c;
	for (b = 0; b < 4; b++)
		for (a = 0; a < 4; a++) {
			m[a + b * 4] = 0;
			for (c = 0; c < 4; c++) m[a + b * 4] += m1[c + b * 4] * m2[a + c * 4];
		}
	return m;
}
window['multiplymatrix'] = multiplymatrix;

function applypersp(v) {
	//var v1 = $.extend(true, [], v);
	v1[0] = v[0] * (viewangle / v[2]);
	v1[1] = v[1] * (viewangle / v[2]);
	v1[2] = v[2];
	return v1;
}
window['applypersp'] = applypersp;

function applymat(m, v) {
	var v1 = $.extend(true, [], v);
	v1[0] = m[0] * v[0] + m[1] * v[1] + m[2] * v[2] + m[3];
	v1[1] = m[4] * v[0] + m[5] * v[1] + m[6] * v[2] + m[7];
	v1[2] = m[8] * v[0] + m[9] * v[1] + m[10] * v[2] + m[11];
	return v1;
}
window['applymat'] = applymat;
function applymatNpersp(m, v) {
	var v1 = [];
	v1.lenth = 3;
	v1[2] = m[8] * v[0] + m[9] * v[1] + m[10] * v[2] + m[11];
	v1[0] = (m[0] * v[0] + m[1] * v[1] + m[2] * v[2] + m[3]) * (viewangle / v1[2]);
	v1[1] = (m[4] * v[0] + m[5] * v[1] + m[6] * v[2] + m[7]) * (viewangle / v1[2]);
	return v1;
}
window['applymatNpersp'] = applymatNpersp;

function genimat() {
	var m = [];
	m.length = 16;
	var a, b;
	for (a = 0; a < 4; a++)
		for (b = 0; b < 4; b++) {
			if (a == b) m[a + b * 4] = 1;
			else m[a + b * 4] = 0;
		}
	return m;
}
window['genimat'] = genimat;

function gentmat(x, y, z) {
	var m = genimat();
	m[3] = x;
	m[7] = y;
	m[11] = z;
	return m;
}
window['gentmat'] = gentmat;

function genrmat(x, y, z) {
	var xd = x * (Math.PI / 180);
	var yd = y * (Math.PI / 180);
	var zd = z * (Math.PI / 180);
	var m = genimat();
	var A = Math.cos(xd);
	var B = Math.sin(xd);
	var C = Math.cos(yd);
	var D = Math.sin(yd);
	var E = Math.cos(zd);
	var F = Math.sin(zd);
	var AD = A * D;
	var BD = B * D;
	m[0] = C * E;
	m[1] = -C * F;
	m[2] = -D;
	m[4] = -BD * E + A * F;
	m[5] = BD * F + A * E;
	m[6] = -B * C;
	m[8] = AD * E + B * F;
	m[9] = -AD * F + B * E;
	m[10] = A * C;
	m[3] = m[7] = m[11] = m[12] = m[13] = m[14] = 0;
	m[15] = 1;
	return m;
}
window['genrmat'] = genrmat;

function vectfromvertices(a, b) {
	var n = Math.sqrt((b[0] - a[0]) * (b[0] - a[0]) + (b[1] - a[1]) * (b[1] - a[1]) + (b[2] - a[2]) * (b[2] - a[2]));
	var s = [(b[0] - a[0]) / n, (b[1] - a[1]) / n, (b[2] - a[2]) / n];
	var vect = new Vector(a, s, n);
	return vect;
}
window['vectfromvertices'] = vectfromvertices;

function axe_ang_to_mat ( axe, ang )
{
	var m = genimat();
	var rcos = Math.cos( ang );
	var rsin = Math.sin( ang );
	m[0] =           rcos + axe[0]*axe[0]*(1-rcos);
	m[4] =  axe[2] * rsin + axe[1]*axe[0]*(1-rcos);
	m[8] = -axe[1] * rsin + axe[2]*axe[0]*(1-rcos);
	m[1] = -axe[2] * rsin + axe[0]*axe[1]*(1-rcos);
	m[5] =           rcos + axe[1]*axe[1]*(1-rcos);
	m[9] =  axe[0] * rsin + axe[2]*axe[1]*(1-rcos);
	m[2] =  axe[1] * rsin + axe[0]*axe[2]*(1-rcos);
	m[6] = -axe[0] * rsin + axe[1]*axe[2]*(1-rcos);
	m[10] =          rcos + axe[2]*axe[2]*(1-rcos);
	m[3] =  m[7] = m[11] = m[12] = m[13] = m[14] = 0;
	m[15] =  1;
	return m;
}

function geninterpmat(a, b)
{
	var m = axe_ang_to_mat (vectorproduct(a, b), scalarproduct(a, b));
	//TODO
	
}
window['geninterpmat'] = geninterpmat;


function matrixinverse(m) {

  var r = genimat();

  r[0] = m[5]*m[10]*m[15]-m[5]*m[14]*m[11]-m[6]*m[9]*m[15]+m[6]*m[13]*m[11]+m[7]*m[9]*m[14]-m[7]*m[13]*m[10];
  r[1] = -m[1]*m[10]*m[15]+m[1]*m[14]*m[11]+m[2]*m[9]*m[15]-m[2]*m[13]*m[11]-m[3]*m[9]*m[14]+m[3]*m[13]*m[10];
  r[2] = m[1]*m[6]*m[15]-m[1]*m[14]*m[7]-m[2]*m[5]*m[15]+m[2]*m[13]*m[7]+m[3]*m[5]*m[14]-m[3]*m[13]*m[6];
  r[3] = -m[1]*m[6]*m[11]+m[1]*m[10]*m[7]+m[2]*m[5]*m[11]-m[2]*m[9]*m[7]-m[3]*m[5]*m[10]+m[3]*m[9]*m[6];

  r[4] = -m[4]*m[10]*m[15]+m[4]*m[14]*m[11]+m[6]*m[8]*m[15]-m[6]*m[12]*m[11] - m[7]*m[8]*m[14] + m[7]*m[12]*m[10];
  r[5] = m[0]*m[10]*m[15] - m[0]*m[14]*m[11] - m[2]*m[8]*m[15] + m[2]*m[12]*m[11] + m[3]*m[8]*m[14] - m[3]*m[12]*m[10];
  r[6] = -m[0]*m[6]*m[15] + m[0]*m[14]*m[7] + m[2]*m[4]*m[15] - m[2]*m[12]*m[7] - m[3]*m[4]*m[14] + m[3]*m[12]*m[6];
  r[7] = m[0]*m[6]*m[11] - m[0]*m[10]*m[7] - m[2]*m[4]*m[11] + m[2]*m[8]*m[7] + m[3]*m[4]*m[10] - m[3]*m[8]*m[6];

  r[8] = m[4]*m[9]*m[15] - m[4]*m[13]*m[11] - m[5]*m[8]*m[15] + m[5]*m[12]*m[11] + m[7]*m[8]*m[13] - m[7]*m[12]*m[9];
  r[9] = -m[0]*m[9]*m[15] + m[0]*m[13]*m[11] + m[1]*m[8]*m[15] - m[1]*m[12]*m[11] - m[3]*m[8]*m[13] + m[3]*m[12]*m[9];
  r[10] = m[0]*m[5]*m[15] - m[0]*m[13]*m[7] - m[1]*m[4]*m[15] + m[1]*m[12]*m[7] + m[3]*m[4]*m[13] - m[3]*m[12]*m[5];
  r[11] = -m[0]*m[5]*m[11] + m[0]*m[9]*m[7] + m[1]*m[4]*m[11] - m[1]*m[8]*m[7] - m[3]*m[4]*m[9] + m[3]*m[8]*m[5];

  r[12] = -m[4]*m[9]*m[14] + m[4]*m[13]*m[10] + m[5]*m[8]*m[14] - m[5]*m[12]*m[10] - m[6]*m[8]*m[13] + m[6]*m[12]*m[9];
  r[13] = m[0]*m[9]*m[14] - m[0]*m[13]*m[10] - m[1]*m[8]*m[14] + m[1]*m[12]*m[10] + m[2]*m[8]*m[13] - m[2]*m[12]*m[9];
  r[14] = -m[0]*m[5]*m[14] + m[0]*m[13]*m[6] + m[1]*m[4]*m[14] - m[1]*m[12]*m[6] - m[2]*m[4]*m[13] + m[2]*m[12]*m[5];
  r[15] = m[0]*m[5]*m[10] - m[0]*m[9]*m[6] - m[1]*m[4]*m[10] + m[1]*m[8]*m[6] + m[2]*m[4]*m[9] - m[2]*m[8]*m[5];

  var det = m[0]*r[0] + m[1]*r[4] + m[2]*r[8] + m[3]*r[12];
  for (var i = 0; i < 16; i++) r[i] /= det;
  return r;
}
window['matrixinverse'] = matrixinverse;

