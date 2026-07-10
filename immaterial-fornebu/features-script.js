function calculateFeatures(tokenData)
{
  'use strict';

  class Random {
    constructor() {
      this.useA = false;
      let sfc32 = function (uint128Hex) {
        let a = parseInt(uint128Hex.substring(0, 8), 16);
        let b = parseInt(uint128Hex.substring(8, 16), 16);
        let c = parseInt(uint128Hex.substring(16, 24), 16);
        let d = parseInt(uint128Hex.substring(24, 32), 16);
        return function () {
          a |= 0;
          b |= 0;
          c |= 0;
          d |= 0;
          let t = (((a + b) | 0) + d) | 0;
          d = (d + 1) | 0;
          a = b ^ (b >>> 9);
          b = (c + (c << 3)) | 0;
          c = (c << 21) | (c >>> 11);
          c = (c + t) | 0;
          return (t >>> 0) / 4294967296;
        };
      };
      // seed prngA with first half of tokenData.hash
      this.prngA = new sfc32(tokenData.hash.substring(2, 34));
      // seed prngB with second half of tokenData.hash
      this.prngB = new sfc32(tokenData.hash.substring(34, 66));
      for (let i = 0; i < 1e6; i += 2) {
        this.prngA();
        this.prngB();
      }
    }
    // random number between 0 (inclusive) and 1 (exclusive)
    random_dec() {
      this.useA = !this.useA;
      return this.useA ? this.prngA() : this.prngB();
    }
    // random number between a (inclusive) and b (exclusive)
    random_num(a, b) {
      return a + (b - a) * this.random_dec();
    }
    // random integer between a (inclusive) and b (inclusive)
    // requires a < b for proper probability distribution
    random_int(a, b) {
      return Math.floor(this.random_num(a, b + 1));
    }
    // random boolean with p as percent liklihood of true
    random_bool(p) {
      return this.random_dec() < p;
    }
    // random value in an array of items
    random_choice(list) {
      return list[this.random_int(0, list.length - 1)];
    }
  }

  let R = new Random();

  let gradients = 
  [
  	//dB - desatBrightness, dR - desatRatio, vS - valueShift, sI - saturationIncrease
  	//{"dB":-0.07000000000000015,"dR":0.63,"vS":-0.1,"sI":0.5,"name":"coal","colors":["#4f4f4f","#262626","#1d1f23","#121519","#030406"],"stops":[2.6020852139652106e-17,0.35000000000000003,0.49999999999999994,0.6600000000000001,1]},
  	//{"dB":-0.30000000000000016,"dR":0.89,"vS":-0.1,"sI":0.5,"name":"coal","colors":["#3f3f3f","#232222","#0c0c0c","#050506","#000000"],"stops":[2.6020852139652106e-17,0.030000000000000027,0.29,0.4800000000000001,0.91]},
  	//{"dB":-0.020000000000000143,"dR":0.51,"vS":-0.1,"sI":0.5,"name":"coal","colors":["#4f4f4f","#393737","#1b1c1f","#121519","#030406"],"stops":[2.6020852139652106e-17,0.35000000000000003,0.49999999999999994,0.6600000000000001,1]},
  	{"dB":-0.04000000000000015,"dR":0.51,"vS":-0.1,"sI":0.5,"name":"coal","colors":["#4f4f4f","#333333","#151619","#090b0f","#020203"],"stops":[2.6020852139652106e-17,0.15000000000000002,0.31999999999999995,0.4900000000000001,1]},
  	{"dB":-0.02000000000000006,"dR":0.24,"vS":0.05,"sI":0.2,"name":"carbon","colors":["#bfbfbf","#a5a5a5","#7f8489","#171b23","#010203"],"stops":[2.6020852139652106e-17,0.12,0.24,0.76,1]},
  	{"dB":-0.13000000000000003,"dR":0.45000000000000007,"vS":-0.2,"sI":0,"name":"bone","colors":["#FFFFFF","#ebe7e5","#bfbaba","#6d767f","#444b5c"],"stops":[1.214306433183765e-17,0.25999999999999995,0.5400000000000001,0.9500000000000001,1]},
  	{"dB":-0.09000000000000001,"dR":0.4299999999999999,"vS":0,"sI":0.3,"name":"gold","colors":["#fff6ea","#e8c098","#8f623f","#6c4035","#000000"],"stops":[0,0.2600000000000001,0.75,0.87,1]},
  	{"dB":-0.16999999999999998,"dR":0.37999999999999995,"vS":0.03,"sI":0,"name":"fire","colors":["#f8a393","#ef6d6d","#db4d41","#a5343e","#460310"],"stops":[0,0.08,0.29000000000000004,0.6,1]},
  	{"dB":-0.07000000000000002,"dR":0.42000000000000004,"vS":-0.05,"sI":0.2,"name":"rose","colors":["#ffd2d2","#ebb2c6","#a85562","#853c3c","#62162c"],"stops":[0,0.24000000000000007,0.7899999999999999,0.9,1]},
  	{"dB":0.43,"dR":0.44999999999999996,"vS":-0.1,"sI":0.1,"name":"lavender","colors":["#fbf3f1","#fbf1f0","#e2c1ba","#d2a0aa","#c58484"],"stops":[3.469446951953614e-18,0.36000000000000004,0.82,0.9500000000000001,1]},
  	{"dB":0.020000000000000066,"dR":0.29000000000000004,"vS":-0.2,"sI":0.4,"name":"blush","colors":["#f8e2d0","#fba3a3","#9c405a","#661935","#4c1015"],"stops":[0,0.26,0.7599999999999999,0.93,1]},
  	{"dB":-0.04000000000000007,"dR":0.37999999999999995,"vS":-0.1,"sI":0.3,"name":"gill","colors":["#eae4eb","#cfc6c4","#9f9391","#8c7159","#8c6244"],"stops":[0.3400000000000001,0.66,0.8899999999999999,0.98,1]},
  	{"dB":-0.11,"dR":0.36000000000000004,"vS":-0.05,"sI":0.1,"name":"moss","colors":["#dbffc0","#8ea26e","#627955","#122c1c","#010605"],"stops":[0,0.25999999999999995,0.48,0.86,1]},
  	{"dB":-0.07000000000000006,"dR":0.39,"vS":-0.1,"sI":0.1,"name":"leaf","colors":["#c7e2af","#96af9b","#43624d","#1d392f","#091c1c"],"stops":[0,0.20000000000000004,0.5700000000000002,0.7300000000000001,1]},
  	{"dB":-0.03999999999999994,"dR":0.36000000000000004,"vS":-0.2,"sI":0.3,"name":"neon","colors":["#badfd3","#87cfb8","#6cc29b","#20695d","#123630"],"stops":[0,0.23999999999999996,0.33,0.97,1]},
  	{"dB":-0.16999999999999993,"dR":0.31999999999999995,"vS":0,"sI":0.2,"name":"shore","colors":["#acc6d8","#6395b2","#305372","#152b3f","#121929"],"stops":[1.734723475976807e-18,0.33,0.5800000000000001,0.8200000000000001,1]},
  	{"dB":-0.16999999999999996,"dR":0.52,"vS":0,"sI":0.2,"name":"space","colors":["#b7d2e2","#597282","#385366","#121c2c","#040516"],"stops":[1.734723475976807e-18,0.37,0.6000000000000001,0.87,1]},
  	{"dB":-0.07000000000000002,"dR":0.41000000000000003,"vS":-0.2,"sI":0.2,"name":"grape","colors":["#9286ac","#4b4e82","#3b3969","#141739","#0b0e1f"],"stops":[0,0.11000000000000001,0.29,0.84,1]},
  	{"dB":-0.03999999999999996,"dR":0.35,"vS":-0.1,"sI":0.2,"name":"plum","colors":["#ba95db","#9d88db","#363077","#100c3c","#0d0f1f"],"stops":[0,0.15999999999999998,0.5400000000000001,0.79,1]},
  	{"dB":0.76,"dR":0.51,"vS":-0.1,"sI":0.3,"name":"haze","colors":["#c3b2df","#585c95","#242a5c","#000033","#020026"],"stops":[0,0.36999999999999994,0.64,0.91,1]},
  	{"dB":0.09000000000000007,"dR":0.37999999999999995,"vS":0,"sI":0.3,"name":"peach","colors":["#ffd3a4","#f8bc99","#fb8353","#fb5149","#c52b25"],"stops":[2.6020852139652106e-17,0.21,0.46,0.8300000000000001,1]},
  	{"dB":-0.24,"dR":0.42999999999999994,"vS":0,"sI":0.3,"name":"depth","colors":["#7f95a5","#567d92","#223649","#112236","#02121f"],"stops":[0,0.32000000000000006,0.71,0.87,1]},
  	{"dB":-0.13000000000000003,"dR":0.29000000000000004,"vS":0.05,"sI":0.3,"name":"wine","colors":["#f57979","#bf354b","#6f162c","#3f030b","#190008"],"stops":[0,0.17,0.54,0.8200000000000001,1]},
  	{"dB":-0.11000000000000006,"dR":0.36000000000000004,"vS":0.05,"sI":0.3,"name":"wood","colors":["#6f6559","#464240","#292827","#161311","#191215"],"stops":[2.6020852139652106e-17,0.25,0.41,0.63,1]},
  	{"dB":0.12999999999999995,"dR":0.4899999999999999,"vS":0.05,"sI":0.3,"name":"honey","colors":["#fffdfa","#fbeccb","#fbda90","#bc8d51","#a75128"],"stops":[2.2551405187698492e-17,0.16000000000000003,0.51,0.87,1]},
  	{"dB":0.27999999999999997,"dR":0.3999999999999999,"vS":0.05,"sI":0.3,"name":"pale","colors":["#fffdfa","#fbeccb","#ffe7b4","#c89859","#d87f42"],"stops":[2.2551405187698492e-17,0.12000000000000002,0.44999999999999996,0.9500000000000001,1]},
  	{"dB":0.27999999999999997,"dR":0.3999999999999999,"vS":0.05,"sI":0.3,"name":"sun","colors":["#fffdfa","#ffe09d","#ffd16f","#eb9543","#cf6a42"],"stops":[2.2551405187698492e-17,0.12000000000000002,0.44999999999999996,0.9500000000000001,1]},
  	{"dB":-0.12999999999999995,"dR":0.41000000000000003,"vS":-0.1,"sI":0.2,"name":"berry","colors":["#a5d8fb","#298ebf","#0063b5","#0e336c","#001a56"],"stops":[1.734723475976807e-18,0.14,0.4600000000000001,0.8,1]},
  	{"dB":-0.25999999999999995,"dR":0.29,"vS":0.03,"sI":0,"name":"blood","colors":["#ff2145","#ff6d6d","#d52836","#821526","#16040f"],"stops":[0,0.22,0.49000000000000005,0.75,1]}
  ];

  let schemes = [
  	[0, 1],
  	[0, 1],
  	[0, 1, 2],
  	[1, 2],
  	[2, 3, 5],
  	[1, 2, 8],
  	[2, 1],	
  	[2, 3, 8],
  	[2, 3],
  	[8, 9],
  	[2, 25],
  	[4, 19,17, 19],
  	[3, 3, 3, 22, 4],
  	[3, 22],
  	[4, 19],
  	[3, 8], // 3,8 maybe?
  	[0, 2], //
  	[19, 18, 6],
  	[19, 19, 6, 7],
  	[19, 5],
  	[6, 6, 5],
  	[19, 2],
  	[2, 19],
  	[2, 2, 18],
  	[19, 19, 8],
  	[5, 7, 8],
  	[6, 7, 5],
  	[5, 8],
  	[6, 5, 0],
  	[6, 2],
  	[9, 10, 9, 10, 11],
  	[2, 9, 10],
  	[2],
  	[18],
  	[18, 24], //
  	[9, 10, 11, 17], //
  	[9, 19, 11], //
  	[10, 9, 9, 10, 8],
  	[8, 7, 6],
  	[9, 10], //
  	/*[3, 18, 13],*/
  	[8, 18],
  	[8, 22, 21, 23],
  	/*[14, 16, 15],*/
  	[16],
  	[12, 13, 8, 18],
  	[5, 7, 22, 6],
  	[21, 22, 23],
  	[20, 1],
  	[4, 2, 7],
  	[0, 1, 8, 20]
  ];


  let colorSchemes = [];

  function saveData (blob, fileName) 
  {
    var a = document.createElement("a");
    document.body.appendChild(a);
    a.style = "display: none";

    let url = window.URL.createObjectURL(blob);
    a.href = url;
    a.download = fileName;
    a.click();
    window.URL.revokeObjectURL(url);

    a.remove();
  };

  function clamp(val, low, high)
  {
    if (val < low) val = low;
    if (val > high) val = high;

    return val;
  }

  function mapRange(value, low1, high1, low2, high2, doClamp = false) 
  {
    let val = low2 + (high2 - low2) * (value - low1) / (high1 - low1);
    if (doClamp) val = clamp(val, low2, high2);
    return val;
  }

  function decimalToRgb(decimal) 
  {
    return {
      r: ((decimal >> 16) & 0xff) / 255,
      g: ((decimal >> 8) & 0xff) / 255,
      b: (decimal & 0xff) / 255,
    };
  }

  function decimalToLuminance (decimal)
  {
    let rgb = decimalToRgb(decimal);
    return (rgb.r + rgb.g + rgb.b) / 3;
  }

  function getUrlParams ()
  {
    let params = new Proxy(new URLSearchParams(window.location.search), {
      get: (searchParams, prop) => searchParams.get(prop),
    });

    return params;
  }

  let schemeIndex = R.random_int(0, schemes.length-1);
  //schemeIndex = 42;
  let gradientIndices = schemes[schemeIndex];

  let newIndices = [];

  // duplicate some gradients to add more variety within schemes
  for (let i = 0; i < gradientIndices.length; i++)
  {
  	let n = 1;
  	n = R.random_int(1, 5);

  	for (let j = 0; j < n; j++)
  	{
  		newIndices.push(gradientIndices[i]);
  	}
  }

  gradientIndices = newIndices;


  //gradientIndices = [2];

  //cool ones?
  //9, 19, 11
  // 24

  //gradientIndices = [0, 0, 9, 10]
  //console.log(gradientIndices);

  //gradientIndices = [];
  //gradientIndices = [2, 3, 8];

  let heightNoiseScale = R.random_dec();
  let heightNoiseAmp = mapRange(heightNoiseScale, 0.0, 1.0, .4, .2);
  heightNoiseScale = mapRange(heightNoiseScale, 0.0, 1.0, .9, 2.0);

  let angles = [
  	[-.55, 0.2],
  	[-.55,  0.3],
  	[-.55, 0.0],
  	[-.75, 0.0],
  	[-.75, 0.3],
  	[-.75, -0.3]
  ];

  let nLines = R.random_int(8, 13);
  let circleDistroAlgo = R.random_bool(.8) ? 1 : 0;
  let maxSteps = 12;
  if (nLines > 10) maxSteps -= (nLines-10);
  let nSteps = Math.round(R.random_int(8, maxSteps)) * 100;
  let angleIndex = R.random_int(0, angles.length-1);
  let angle = angles[angleIndex];

  let xRotation = angle[0];
  let yRotation = angle[1];

  let zoomLevelRat = 1.0 - R.random_dec();
  zoomLevelRat = 1.0 - Math.pow(1.0 - zoomLevelRat, 1.0);

  let zoomLevels = [4, 5, 6];
  if (nLines < 11) zoomLevels = zoomLevels.slice(0, zoomLevels.length-1);

  let zoomLevel = zoomLevels[Math.floor(zoomLevelRat * zoomLevels.length)];

  if (nLines < 12 && R.random_bool(.2))
  {
  	zoomLevelRat = 0.0;
  	zoomLevel = 3;
  }

  let minHoleThreshold = mapRange(zoomLevelRat, 0.0, 1.0, .3, .6);
  let maxHoleThreshold = mapRange(zoomLevelRat, 0.0, 1.0, .8, 1.0);

  let border;
  if (angle[1] == 0.0)
  {
  	border = false;
  }
  else
  {
  	border = R.random_bool(.6);
  }

  border = false;

  let doubleSided = false;
  if (gradientIndices.length > 1) doubleSided = R.random_bool(.5);

  let bendStrength = 0.0008;

  let flipX = R.random_bool(.5);
  let flipY = R.random_bool(.25);

  let attrStrength = R.random_num(0.07, .18);

  if (zoomLevel == zoomLevels[0]) flipY = false;

  if (zoomLevelRat > .8)
  {
  	zoomLevelRat = 1.0;
  	zoomLevel = 6.5;
  	bendStrength = 0.0015;
  	attrStrength *= 0.5;
  }


  let settings = {};

  settings = {
  	fadeIn: true,
  	applyVelocity: true,
  	applyHoles: true,
  	noiseStrength: .9,
  };

  function getDetailedFeatures ()
  { 
  	return {
  		angle: angle.toString(),
  		angleIndex: angleIndex,
  		border: border,
  		schemeIndex: schemeIndex,
  		gradientIndices: gradientIndices,
  		nLines: nLines,
  		circleDistroAlgo: circleDistroAlgo,
  		nSteps: nSteps, // affects details
  		//nSteps: 1200,
  		//nSteps: 1000,
  		startRadius: 3.0,
  		hideLines: true,
  		smallFolds: R.random_bool(.3),
  		zoomLevelRat: zoomLevelRat,
  		zoomLevel: zoomLevel,
  		xRotation: xRotation,
  		yRotation: yRotation,
  		doubleSided: doubleSided,
  		swirlSize: R.random_num(.05, .6),
  		swirlStrength: R.random_num(-.2, .2),
  		flipX: flipX,
  		flipY: flipY,
  		numCols: gradientIndices.length,
  		gradientIndices: gradientIndices,
  		multipleGradientProb: R.random_int(0, 2) * .5,
  		//multipleGradientProb: .,
  		colorDistributionType: R.random_int(0, 2),
  		heightNoiseScale: heightNoiseScale,
  		heightNoiseAmp: heightNoiseAmp,
  		minHoleThreshold: minHoleThreshold,
  		maxHoleThreshold: maxHoleThreshold,
  		allHoles: R.random_bool(.5),
  		//nLines: 10,
  		bendStrength: bendStrength,
  		attrStrength: attrStrength
  	}
  }

  let detailedFeatures = getDetailedFeatures();

  function getColorSchemeString (gradientIndices)
  {
  	let colorSchemeString = "";
  	let grads = {};

  	gradientIndices.forEach(i => 
  	{
  		let name = gradients[i].name;
  		grads[name] = name;
  	});

  	Object.keys(grads).forEach(key => 
  	{
  		if (colorSchemeString != "") colorSchemeString += ",";
    		colorSchemeString += key;
  	});

  	return colorSchemeString;
  }

  function getFeatures ()
  {
  	let colorSchemeString = getColorSchemeString(detailedFeatures.gradientIndices);
  	let schemeNames = [];

  	schemes.forEach((s) => 
  	{
  		schemeNames.push(getColorSchemeString(s));
  	});

  	schemeNames = [...new Set(schemeNames)];

  	if (window !== undefined) window.schemeNames = schemeNames;

  	//console.log(schemeNames);

  	let fidelity = "";

  	//let zoomLevelLabels = ["lowest", "low", "normal", "high", "ultra high"];
  	//[2.5, 3, 4, 5, 6.0];

  	switch (detailedFeatures.zoomLevel)
  	{
  		case 3:
  			fidelity = "lowest";
  			break;
  		case 4:
  			fidelity = "low";
  			break;
  		case 5:
  			fidelity = "medium";
  			break;
  		case 6:
  			fidelity = "high";
  			break;
  		case 6.5:
  			fidelity = "ultra high";
  			break;
  	}

  	let ss = Math.abs(detailedFeatures.swirlStrength);
  	let fluidity = "low";

  	if (ss > .15)
  	{
  		fluidity = "high";
  	}
  	else if (ss > .05)
  	{
  		fluidity = "medium";
  	}

  	return {
  		"fidelity": fidelity,
  		"fluidity": fluidity,
  		"color scheme": colorSchemeString,
  		"angle": detailedFeatures.angleIndex,
  		"direction": detailedFeatures.flipY ? "downwards" : "upwards",
  		"frame": detailedFeatures.border,
  		"double sided": detailedFeatures.doubleSided
  	}
  }

	return getFeatures();
}
