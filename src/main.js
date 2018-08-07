'use strict';
(function() {
	// global variables

var penalties = [{"Date":1998,"Low":33,"Range":21},
{"Date":1999,"Low":39,"Range":15},
{"Date":2000,"Low":35,"Range":10},
{"Date":2001,"Low":37,"Range":11},
{"Date":2002,"Low":42,"Range":13},
{"Date":2003,"Low":39,"Range":22},
{"Date":2004,"Low":44,"Range":15},
{"Date":2005,"Low":39,"Range":7},
{"Date":2006,"Low":39,"Range":18},
{"Date":2007,"Low":35,"Range":9},
{"Date":2008,"Low":33,"Range":12},
{"Date":2009,"Low":37,"Range":16},
{"Date":2010,"Low":50,"Range":27},
{"Date":2011,"Low":36,"Range":12},
{"Date":2012,"Low":41,"Range":24},
{"Date":2013,"Low":46,"Range":17},
{"Date":2014,"Low":37,"Range":7},
{"Date":2015,"Low":41,"Range":28},
{"Date":2016,"Low":42,"Range":18},
{"Date":2017,"Low":38,"Range":17}];

	// called once on page load
	var init = function() {

var condense = function(a) {
	return a.split("/").join("").split("-").join("").split(",").join("").split(".").join("").split(" ").join("").split("'").join("").split("&").join("");
	};

function nWC(x) {
	var fraction;
	if (x % 1 !== 0) {
		x = Number(x).toFixed(2)
	}
    var parts = x.toString().split(".");

    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    if (parts.length !== 1) {
    	fraction = true;
    	parts = parts[0]+"."+parts[1];
    	//parts = Number(parts);
    }



    if (fraction === true) {

    }


    return parts;

}


var verticalBarChart = function(divname,data,interval,prefix,suffix) {
document.getElementById(divname).innerHTML = '<div id="key"></div><div id="topper">xxxx</div><div id="main"><div id="lines"></div><div id="bars"></div></div><div id="labels"></span></div>';


var element = document.getElementById(divname);
element.classList.add("verticalBarChart");

document.getElementById(divname).style.display = "inline-block";

	var namesNode = [];
	var values = [];
	var max = "";
	var min = "";
	var range = "";
	var less = "";
	var linesAdd = "";
	var limit = "";

	var labelsLeft = document.createElement("span");
	labelsLeft.setAttribute('class','left');
	var leftText = document.createTextNode(data[0].Date);
	labelsLeft.appendChild(leftText);
	document.querySelector("#"+divname+" #labels").appendChild(labelsLeft);

	var labelsRight = document.createElement("span");
	labelsRight.setAttribute('class','right');
	var RightText = document.createTextNode(data[Number(data.length - 1)].Date);
	labelsRight.appendChild(RightText);
	document.querySelector("#"+divname+" #labels").appendChild(labelsRight);



	for (var i in data[0]) {
		if (i !=="Date") {
			namesNode.push(i);
		}
	}


	for (var i in data) {

		if (Number(namesNode.length) === 1) {
		data[i].Value = data[i][namesNode[0]];
		} else {
		data[i].Value = 0;
		for (var j in namesNode) {
			data[i].Value = Number(data[i].Value) + Number(data[i][namesNode[j]]);
		}
		}

	}

	for (var i=0; i<data.length; i++) {
		values.push(data[i].Value);
	}





	var max = Math.max.apply(Math, values);
	var min = Math.min.apply(Math, values);

	if (min >= 0) {
		range = Math.abs(Number(Math.floor(max/interval))*interval);
		less = 0;
	} else {
		if (max > 0) {
			range = Math.abs(Number(Math.floor(max/interval))*interval) + Math.abs(Number(Math.floor(min/interval))*interval);
		} else {
			range = Math.abs(Number(Math.floor(min/interval))*interval);
		}
		less = Number(Math.floor(min/interval));
	}

	var lines = Number(Math.ceil(range/interval))

	if (min >= 0) {
		linesAdd = lines + 1;
	} else {
		linesAdd = Math.floor(max/interval)+1;

		if (linesAdd < 0) {
			linesAdd = 1;
		}
	}

	var mainh = document.querySelector("#"+divname+" #main").clientHeight;
	var barw = document.querySelector("#"+divname+" #bars").clientWidth;


	for (var j=Number(linesAdd-1); j>Number(less-1); j--) {
		//console.log(lines, linesAdd);


	var label = document.createElement("div");
	label.setAttribute('class','label');
	var labelText = document.createTextNode(prefix+nWC(j*interval)+suffix);
	label.appendChild(labelText);
	var row = document.createElement('div');
	row.setAttribute('class','row');
	row.setAttribute('id','row'+j);
	row.style.height = Number(mainh/(lines+1))+"px";
	row.appendChild(label);
	document.querySelector("#"+divname+" #lines").appendChild(row);
	}

	for (var i=0; i<data.length; i++) {
		limit = Number((lines+1)*interval);

		var recordtop;
		if (less === 0) {
			recordtop = 100*Number((limit - Math.abs(data[i].Value))/limit);
		} else {
			if (data[i].Value < 0) {
				recordtop = 100*Number(interval*linesAdd/limit);
			} else {
				recordtop = 100*Number((interval*linesAdd-data[i].Value)/limit);
			}
		}
		var recordh = 100*Number(Math.abs(data[i].Value)/limit);

		var days = document.createElement('div');
		days.setAttribute('class','day');
		days.setAttribute('id','day'+i);
		days.style.width = Number(100/Number(data.length) - 1)+"%";
		var record = document.createElement('div');
		record.setAttribute('class','record');
		record.setAttribute('id','record'+i);
		record.setAttribute('data-rh',recordh);
		record.style.top = recordtop+'%';
		record.style.height = recordh+'%';
		days.appendChild(record);

		document.querySelector("#"+divname+" #bars").appendChild(days);

		if (Number(namesNode.length) > 1) {
			var secondBar = document.createElement('div');
			secondBar.setAttribute('class','second');
			secondBar.style.height = Number(100*data[i][namesNode[1]])/Number(data[i].Value)+'%';

			document.querySelector("#"+divname+" #bars #record"+i).appendChild(secondBar);
		}

		if (data[i].Value < 0) {
			document.querySelector("#"+divname+" #record"+i).classList.add("neg");
		} else {
			document.querySelector("#"+divname+" #record"+i).classList.add("pos");
		}



	}

	if (Number(namesNode.length) > 1) {
		for (var i in namesNode) {
		var keyEl = document.createElement('div');
		keyEl.setAttribute('class','keyel');
		var keySq = document.createElement('div');
		keySq.classList.add('keysq','color'+i);
		var keytxt = document.createElement('div');
		keytxt.setAttribute('class','keytxt');
		var keyText = document.createTextNode(namesNode[i]);
		keytxt.appendChild(keyText);
		keyEl.appendChild(keySq);
		keyEl.appendChild(keytxt);
		document.querySelector("#"+divname+" #key").appendChild(keyEl);
		}
	}

	var topper = document.querySelector("#"+divname+" #topper");
	topper.innerHTML = "";
	var intervalText = document.createTextNode(prefix+nWC(linesAdd*interval)+suffix);
	topper.appendChild(intervalText);



	document.querySelector('#'+divname+' #bars').style.height = mainh+"px";



var pos, they, thex;



		var dayHover = document.querySelectorAll("#"+divname+" .day");
	  	for (var x = 0; x < dayHover.length; x++) {
	  	dayHover[x].addEventListener("mouseover", function(evt){

			for (var i in data) {


			pos = document.querySelector("#"+divname+" #main");
			thex = evt.pageX - pos.offsetLeft;
			they = evt.pageY - pos.offsetTop;
			var mainW = document.querySelector("#"+divname+" #main").clientWidth;
			var mainH = document.querySelector("#"+divname+" #main").clientHeight;

			if (thex > mainW - 200) { thex = mainW - 200 };
			if (they > mainH - 200) { they = mainH - 100 };



			if (this.id == "day"+i) {

				var tagLabel = document.createElement('div');
				tagLabel.setAttribute('class','labelClass');
				tagLabel.setAttribute('id','label');
				tagLabel.style.top = they+"px";
				tagLabel.style.left = thex+"px";
				var content = document.createElement('div');
				content.setAttribute('class','value');
				var tagSpan = document.createElement('span');
				var tagSpanText = document.createTextNode('High: ');
				var tagLabelText = document.createTextNode(prefix+nWC(data[i].Value)+suffix);
				tagSpan.appendChild(tagSpanText);
				content.appendChild(tagSpan);
				content.appendChild(tagLabelText);
				tagLabel.appendChild(content);


				if (Number(namesNode.length) === 1) {

				tagLabel.innerHTML = '';

				var content = document.createElement('div');
				content.setAttribute('class','value');
				var contentText = document.createTextNode(prefix+nWC(data[i].Value)+suffix);
				content.appendChild(contentText);
				tagLabel.appendChild(content);


					//content = '<div class="value">'+prefix+nWC(data[i].Value)+suffix+'</div>'


				} else {
					for (var j in namesNode) {



				var content = document.createElement('div');
				content.setAttribute('class','value');
				var contentSpan = document.createElement('span');
				contentSpan.style.fontWeight = "bold";
				var contentSpanText = document.createTextNode(namesNode[j]+": ");
				var contentText = document.createTextNode(prefix+nWC(data[i][namesNode[j]])+suffix);
				contentSpan.appendChild(contentSpanText);
				content.appendChild(contentSpan);
				content.appendChild(contentText);
				tagLabel.appendChild(content);



					}
				}

				var nameDiv = document.createElement('div');
				nameDiv.setAttribute('class','name');
				var nameText = document.createTextNode(data[i].Date);
				nameDiv.appendChild(nameText);



				document.querySelector('#'+divname+' #main').appendChild(tagLabel);
				tagLabel.prepend(nameDiv);

				this.classList.add("active");
		}

	}
		});
	  	}




	var dayLeave = document.querySelectorAll("#"+divname+" .day");
	for (var x = 0; x < dayLeave.length; x++) {
	dayLeave[x].addEventListener("mouseleave", function(){

		var labelLeave = document.querySelectorAll("#"+divname+" .labelClass");

		for (var y = 0; y < labelLeave.length; y++) {
			labelLeave[y].remove();
	}

		this.classList.remove('active');




	});
	}



	};

verticalBarChart("penalties",penalties,10,"","°");

document.getElementById('key').innerHTML = '<div class="keyel"><div class="keysq color1"></div><div class="keytxt">Range of temperatures</div></div>'

	};

	// called automatically on article page resize
	window.onResize = function(width) {

	};

	// called when the graphic enters the viewport
	window.enterView = function() {

	};


	// graphic code









	// run code
	init();
})();
