(function(root){
	var style=document.createElement('style');
	style.innerHTML='html,body{height:100%;margin:0;}';
	document.head.appendChild(style);
	var rootElement=document.body;
	var myCanvas=document.createElement('canvas');
	myCanvas.width=rootElement.offsetWidth;
	myCanvas.height=rootElement.clientHeight;
	myCanvas.style.position='absolute';
	myCanvas.style.top='0';
	myCanvas.style.left='0';
	myCanvas.style.boxSizing="border-size";
	myCanvas.style.zIndex='999';
	myCanvas.style.display='none';
	var codePanel = document.createElement('div');
	codePanel.style.position='absolute';
	codePanel.style.left='0';
	codePanel.style.bottom='0';
	codePanel.style.background="#fafafa";
	codePanel.style.zIndex='1000';
	codePanel.style.display='none';
	var btn=document.createElement('button');
	btn.innerHTML='隐藏canvas';
	btn.style.position='absolute';
	btn.style.right='0';
	btn.style.bottom='0';
	btn.style.background="#fafafa";
	btn.style.zIndex='1000';
	btn.style.display='none';
	rootElement.appendChild(myCanvas);
	rootElement.appendChild(codePanel);
	rootElement.appendChild(btn);
	btn.onclick=function () {
		if(myCanvas.style.zIndex==='-1'){
			myCanvas.style.zIndex='999';
			btn.innerHTML='禁用canvas';

		}else{
			myCanvas.style.zIndex='-1';
			btn.innerHTML='操作canvas';
		}
	}
	var myContext=myCanvas.getContext('2d');
	var drawConfig,points,selectPointKey,preEvent;
	var drawConfig = {
		curve: {
			width: 6,
			color: "#0090D2"
		},
		cpline: {
			width: 0.5,
			color: "#ff7a99"
		},
		point: {
			radius: 9,
			width: 2,
			color: "#ff7a99",
			fill: "rgba(200,200,200,0.3)",
			arc1: 0,
			arc2: 2 * Math.PI
		}
	};

	initCanvas();
	function initCanvas() {
		points = {
			p1: {
				x: 100,
				y: 250
			},
			p2: {
				x: 400,
				y: 250
			}
		};
		points.cp1 = {
			x: 150,
			y: 100
		};
		points.cp2 = {
			x: 350,
			y: 100
		};

		myContext.lineCap = "round";
		myContext.lineJoin = "round";
		myCanvas.onmousedown = onCanvasMouseDown;
		myCanvas.onmousemove = onCanvasMouseMove;
		myCanvas.onmouseup = myCanvas.onmouseout = onCanvasMouseup;
		drawCanvas();
	}
	function drawCanvas() {
		myContext.clearRect(0, 0, myCanvas.width, myCanvas.height);
		myContext.lineWidth = drawConfig.cpline.width;
		myContext.strokeStyle = drawConfig.cpline.color;
		myContext.beginPath();
		myContext.moveTo(points.p1.x, points.p1.y);
		myContext.lineTo(points.cp1.x, points.cp1.y);
		if (points.cp2) {
			myContext.moveTo(points.p2.x, points.p2.y);
			myContext.lineTo(points.cp2.x, points.cp2.y)
		} else {
			myContext.lineTo(points.p2.x, points.p2.y)
		}
		myContext.stroke();
		myContext.lineWidth = drawConfig.curve.width;
		myContext.strokeStyle = drawConfig.curve.color;
		myContext.beginPath();
		myContext.moveTo(points.p1.x, points.p1.y);
		if (points.cp2) {
			myContext.bezierCurveTo(points.cp1.x, points.cp1.y, points.cp2.x, points.cp2.y, points.p2.x, points.p2.y)
		} else {
			myContext.quadraticCurveTo(points.cp1.x, points.cp1.y, points.p2.x, points.p2.y)
		}
		myContext.stroke();
		for (var key in points) {
			myContext.lineWidth = drawConfig.point.width;
			myContext.strokeStyle = drawConfig.point.color;
			myContext.fillStyle = drawConfig.point.fill;
			myContext.beginPath();
			myContext.arc(points[key].x, points[key].y, drawConfig.point.radius, drawConfig.point.arc1, drawConfig.point.arc2, true);
			myContext.fill();
			myContext.stroke();
		}
		renderCode();
	}
	function renderCode() {

			codePanel.innerHTML = '{x:'+points.p1.x + ',y:' + points.p1.y + '},{x:' +
				points.cp1.x + ",y:" + points.cp1.y + "},{x:" + points.cp2.x + ",y: " +
				points.cp2.y + "},{x: " + points.p2.x + ",y: " + points.p2.y + '}';
		if(typeof root.onMaskUpdate ==='function'){
			root.onMaskUpdate(Object.assign(points));
		}
	}
	function onCanvasMouseDown(event) {
		event = getPosition(event);
		var r, q;
		for (var pointKey in points) {
			r = points[pointKey].x - event.x;
			q = points[pointKey].y - event.y;
			//鼠标是否单击到这个圆点上
			if ((r * r) + (q * q) < drawConfig.point.radius * drawConfig.point.radius) {
				selectPointKey = pointKey;
				preEvent = event;
				myCanvas.style.cursor = "move";
				return
			}
		}
	}
	function onCanvasMouseMove(event) {
		if (selectPointKey) {
			event = getPosition(event);
			points[selectPointKey].x += event.x - preEvent.x;
			points[selectPointKey].y += event.y - preEvent.y;
			preEvent = event;
			drawCanvas()
		}
	}
	function onCanvasMouseup(event) {
		selectPointKey = null;
		myCanvas.style.cursor = "default";
		drawCanvas()
	}
	function getPosition(event) {
		event = (event ? event : window.event);
		return {
			x: event.pageX - myCanvas.offsetLeft,
			y: event.pageY - myCanvas.offsetTop
		}
	}

	if (myCanvas.getContext) {
		myContext = myCanvas.getContext("2d");
		// initCanvas()
	}

	function createMask(){
		myCanvas.style.display='block';
		codePanel.style.display='block';
		btn.style.display='block';
	}
	root.createMask=createMask;

})(window);