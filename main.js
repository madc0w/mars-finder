var dayInc = 12;
var xLabelInterval = 40;

function onLoad() {
	canvas = document.getElementById("canvas");
	canvas.width = window.innerWidth - 20;
	context = canvas.getContext("2d");

	width = canvas.width - 40;
	startTime = new Date(2000, 0, 1);
	endTime = new Date();
	endTime.setDate(endTime.getDate() + 800);

	paint();
}

function paint() {
	context.clearRect(0, 0, canvas.width, canvas.height);
	context.lineWidth = "2";
	var points = [];
	var maxY = 0,
		minY = 999999;

	var now = new Date();
	var time = new Date(startTime);
	do {
		var jd = calculateJD(time);
		//var jd = 2452878.910416667;
		var earth = getEarthHelio(jd);
		var mars = getMarsHelio(jd);
		var d = calcDistance(earth[0], earth[1], earth[2], mars[0], mars[1], mars[2]);
		points.push({
			x : new Date(time),
			y : d
		});
		minY = Math.min(minY, d);
		maxY = Math.max(maxY, d);
		time.setDate(time.getDate() + dayInc);
	} while (time < endTime);

	context.beginPath();
	for (var i in points) {
		var x = timeToX(points[i].x);
		//		var x = width * (points[i].x - points[0].x) / (points[points.length - 1].x - points[0].x);
		var y = canvas.height * (1 - (points[i].y - minY) / (maxY - minY));
		if (i == 0) {
			context.moveTo(x, y);
		} else {
			context.lineTo(x, y);
		}
	}
	context.strokeStyle = "#ff0000";
	context.stroke();
	context.closePath();

	context.beginPath();
	context.strokeStyle = "#000000";
	context.moveTo(0, canvas.height / 2);
	context.lineTo(width, canvas.height / 2);
	context.stroke();
	context.closePath();

	context.beginPath();
	context.font = "12pt Calibri";
	var time = new Date(startTime);
	var isOffset = false;
	do {
		var x = timeToX(time);
		context.moveTo(x, canvas.height / 2 - 8);
		context.lineTo(x, canvas.height / 2 + 8);
		if (x > 40) {
			context.textAlign = "center";
		} else {
			context.textAlign = "left";
		}
		context.fillText(formatTime(time), x, canvas.height / 2 + (isOffset ? 22 : 42));
		isOffset = !isOffset;
		time.setDate(time.getDate() + xLabelInterval * dayInc);
	} while (time < endTime);
	context.stroke();
	context.closePath();

	context.beginPath();
	context.strokeStyle = "#00ff00";
	var x = timeToX(now);
	context.moveTo(x, 0);
	context.lineTo(x, canvas.height);
	context.stroke();
	context.closePath();

	context.strokeStyle = "#000000";
	context.font = "14pt Calibri";
	context.textAlign = "center";
	context.fillText(formatTime(now), x, canvas.height - 20);

	context.textAlign = "center";
	var jd = calculateJD(now);
	var earth = getEarthHelio(jd);
	var mars = getMarsHelio(jd);
	var d = calcDistance(earth[0], earth[1], earth[2], mars[0], mars[1], mars[2]);
	context.fillText(d.toFixed(2), x, 20);

}

function onClick(e) {
	paint();
	var x = e.pageX - canvas.offsetLeft;
	var time = xToTime(x);
	var jd = calculateJD(time);
	var earth = getEarthHelio(jd);
	var mars = getMarsHelio(jd);
	var d = calcDistance(earth[0], earth[1], earth[2], mars[0], mars[1], mars[2]);
	context.strokeStyle = "#000000";
	context.font = "14pt Calibri";
	if (x > 40) {
		context.textAlign = "center";
	} else {
		context.textAlign = "left";
	}
	context.fillText(d.toFixed(2), x, 40);
	context.fillText(formatTime(time), x, canvas.height - 20);

	context.beginPath();
	context.strokeStyle = "#008080";
	context.moveTo(x, 0);
	context.lineTo(x, canvas.height);
	context.stroke();
	context.closePath();
}

function timeToX(time) {
	var x = width * (time.getTime() - startTime.getTime()) / (endTime.getTime() - startTime.getTime());
	return x;
}

function xToTime(x) {
	var time = new Date(startTime.getTime() + x * (endTime.getTime() - startTime.getTime()) / width);
	return time;
}

function formatTime(time) {
	var month = time.getMonth() + 1;
	if (month < 10) {
		month = "0" + month;
	}
	var timeStr = time.getFullYear() + "/" + month + "/" + time.getDate();
	return timeStr;
}
