(function() {
    var myCanvas, myContext, codePanel, points, drawConfig, selectPointKey = null, preEvent;
    function initCanvas(isBezier2) {
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
        if (isBezier2) {
            points.cp1 = {
                x: 250,
                y: 100
            }
        } else {
            points.cp1 = {
                x: 150,
                y: 100
            };
            points.cp2 = {
                x: 350,
                y: 100
            }
        }
        drawConfig = {
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
        myContext.lineCap = "round";
        myContext.lineJoin = "round";
        myCanvas.onmousedown = onCanvasMouseDown;
        myCanvas.onmousemove = onCanvasMouseMove;
        myCanvas.onmouseup = myCanvas.onmouseout = onCanvasMouseup;
        drawCanvas()
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
            myContext.stroke()
        }
        renderCode()
    }
    function renderCode() {
        if (codePanel) {
            codePanel.firstChild.nodeValue = 'canvas = document.getElementById("canvas");\nctx = canvas.getContext("2d")\nctx.lineWidth = ' + drawConfig.curve.width + ';\nctx.strokeStyle = "' + drawConfig.curve.color + '";\nctx.beginPath();\nctx.moveTo(' + points.p1.x + ", " + points.p1.y + ");\n" + (points.cp2 ? "ctx.bezierCurveTo(" + points.cp1.x + ", " + points.cp1.y + ", " + points.cp2.x + ", " + points.cp2.y + ", " + points.p2.x + ", " + points.p2.y + ");" : "ctx.quadraticCurveTo(" + points.cp1.x + ", " + points.cp1.y + ", " + points.p2.x + ", " + points.p2.y + ");") + "\nctx.stroke();"
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
    myCanvas = document.getElementById("canvas");
    codePanel = document.getElementById("code");
    if (myCanvas.getContext) {
        myContext = myCanvas.getContext("2d");
        initCanvas(myCanvas.className == "bezier")
    }
    var btn = document.getElementById("button");
    var title = document.getElementById("title").getElementsByTagName("span")[0];
    btn.onclick = function() {
        delete myContext;
        if (myCanvas.className == "bezier") {
            this.innerHTML = "切换成二次贝塞尔曲线生成工具";
            title.innerHTML = "三次";
            myCanvas.className = "bezier1";
            myContext = myCanvas.getContext("2d");
            initCanvas(false)
        } else {
            this.innerHTML = "切换成三次贝塞尔曲线生成工具";
            title.innerHTML = "二次";
            myCanvas.className = "bezier";
            myContext = myCanvas.getContext("2d");
            initCanvas(true)
        }
    }
})();
