const dayInc = 12;
const xLabelInterval = 40;

function onLoad() {
	canvas = document.getElementById("canvas");
	canvas.width = window.innerWidth - 20;
	context = canvas.getContext("2d");

	canvas.height = Math.min(240, canvas.height);
	width = canvas.width - 40;
	startTime = new Date();
	startTime.setFullYear(startTime.getFullYear() - 8);
	endTime = new Date();
	endTime.setFullYear(endTime.getFullYear() + 2);

	paint();
}

function paint() {
	context.clearRect(0, 0, canvas.width, canvas.height);
	context.lineWidth = "2";
	const points = [];
	let maxY = 0,
		minY = 999999;

	const now = new Date();
	let time = new Date(startTime);
	do {
		const jd = calculateJD(time);
		//const jd = 2452878.910416667;
		const earth = getEarthHelio(jd);
		const mars = getMarsHelio(jd);
		const d = calcDistance(earth[0], earth[1], earth[2], mars[0], mars[1], mars[2]);
		points.push({
			x: new Date(time),
			y: d
		});
		minY = Math.min(minY, d);
		maxY = Math.max(maxY, d);
		time.setDate(time.getDate() + dayInc);
	} while (time < endTime);

	context.beginPath();
	for (let i in points) {
		const x = timeToX(points[i].x);
		//		var x = width * (points[i].x - points[0].x) / (points[points.length - 1].x - points[0].x);
		const y = canvas.height * (1 - (points[i].y - minY) / (maxY - minY));
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
	context.moveTo(0, canvas.height);
	context.lineTo(width, canvas.height);
	context.stroke();
	context.closePath();

	context.beginPath();
	time = new Date(startTime);
	let isOffset = false;
	do {
		const x = timeToX(time);
		context.moveTo(x, canvas.height - 8);
		context.lineTo(x, canvas.height + 8);
		writeText(formatTime(time), x, canvas.height - (isOffset ? 12 : 22), x > 40, 12);
		isOffset = !isOffset;
		time.setDate(time.getDate() + xLabelInterval * dayInc);
	} while (time < endTime);
	context.stroke();
	context.closePath();

	context.beginPath();
	context.strokeStyle = "#00ff00";
	const x = timeToX(now);
	context.moveTo(x, 0);
	context.lineTo(x, canvas.height);
	context.stroke();
	context.closePath();

	writeText(formatTime(now), x, 40, true, 14);

	const jd = calculateJD(now);
	const earth = getEarthHelio(jd);
	const mars = getMarsHelio(jd);
	const d = calcDistance(earth[0], earth[1], earth[2], mars[0], mars[1], mars[2]);
	writeText(d.toFixed(2), x, 20, true, 14);

}

function onMouseMove(e) {
	paint();
	const x = e.pageX - canvas.offsetLeft;
	context.beginPath();
	context.strokeStyle = "#008080";
	context.moveTo(x, 0);
	context.lineTo(x, canvas.height);
	context.stroke();
	context.closePath();

	const time = xToTime(x);
	const jd = calculateJD(time);
	const earth = getEarthHelio(jd);
	const mars = getMarsHelio(jd);
	const d = calcDistance(earth[0], earth[1], earth[2], mars[0], mars[1], mars[2]);
	context.strokeStyle = "#000000";
	writeText(d.toFixed(2), x, 20, x > 40, 14);
	writeText(formatTime(time), x, 40, x > 40, 14);

}

function timeToX(time) {
	const x = width * (time.getTime() - startTime.getTime()) / (endTime.getTime() - startTime.getTime());
	return x;
}

function xToTime(x) {
	const time = new Date(startTime.getTime() + x * (endTime.getTime() - startTime.getTime()) / width);
	return time;
}

function formatTime(time) {
	let month = time.getMonth() + 1;
	if (month < 10) {
		month = "0" + month;
	}
	const timeStr = time.getFullYear() + "/" + month + "/" + time.getDate();
	return timeStr;
}

function writeText(text, x, y, isCentered, height) {
	const dims = context.measureText(text);
	context.font = height + "pt Calibri";
	context.fillStyle = "rgba(255, 255, 255, 0.6)";
	//	context.fillStyle = "#ff0000";
	context.fillRect(x - (isCentered ? dims.width / 2 : 0), y - height - 2, dims.width, height + 4);
	context.textAlign = isCentered ? "center" : "left";
	context.fillStyle = "#000000";
	context.fillText(text, x, y);
}
