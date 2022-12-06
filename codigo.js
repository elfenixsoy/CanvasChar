//A "from scratch" approach to building a Canvas Line Chart



//=========::MATH UTIL::=======
(function (window){

    var MathUtil = {};


	
	//used for radiansToDegrees and degreesToRadians
	MathUtil.PI_180 = Math.PI/180;
	MathUtil.ONE80_PI = 180/Math.PI;
	
	//precalculations for values of 90, 270 and 360 in radians
	MathUtil.PI2 = Math.PI*2;
	MathUtil.HALF_PI = Math.PI/2;
	MathUtil.PI_AND_HALF = Math.PI+ Math.PI/2;
	MathUtil.NEGATIVE_HALF_PI = -Math.PI/2;

    //keep degrees between 0 and 360
    MathUtil.constrainDegreeTo360 = function(degree){
        return (360 + degree % 360) % 360;//hmmm... looks a bit weird?!
    };

    MathUtil.constrainRadianTo2PI = function(rad){
        return (MathUtil.PI2 + rad % MathUtil.PI2) % MathUtil.PI2;//equally so...
    };

    MathUtil.radiansToDegrees = function(rad){
        return rad*MathUtil.ONE80_PI;
    };

    MathUtil.degreesToRadians = function(degree){
        return degree * MathUtil.PI_180;
    };

	//return number between 1 and 0
	MathUtil.normalize = function(value, minimum, maximum){
		return (value - minimum) / (maximum - minimum);
	};

	//map normalized number to values
	MathUtil.interpolate = function(normValue, minimum, maximum){
		return minimum + (maximum - minimum) * normValue;
	};

	//map a value from one set to another
	MathUtil.map = function(value, min1, max1, min2, max2){
		return MathUtil.interpolate( MathUtil.normalize(value, min1, max1), min2, max2);
	};




    MathUtil.clamp = function(min,max,value){
        if(value < min){
            return min;
        }
        if(value > max){
            return max;
        }
        return value;
    };

    MathUtil.clampRGB = function(value){
        return MathUtil.clamp(0, 255, Math.round(value));
    };

	MathUtil.getRandomNumberInRange = function(min, max){
		return min + Math.random() * (max - min);
	};

    //from : http://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb
    MathUtil.getRandomHexColorString = function() {
        return MathUtil.rgbToHex(Math.floor(Math.random()*255), Math.floor(Math.random()*255), Math.floor(Math.random()*255));
    }

    //from : http://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb
    MathUtil.rgbToHex = function(r, g, b) {
        return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    }

    MathUtil.hexToRgb = function(hex) {
        // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
        var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
        hex = hex.replace(shorthandRegex, function(m, r, g, b) {
            return r + r + g + g + b + b;
        });

        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    }

    window.MathUtil = MathUtil;
	
}(window));



//=========::GEOM::=======

(function (window){

    var Geom = {};

    //==================================================
    //=====================::POINT::====================
    //==================================================

    Geom.Point = function (x,y){
        this.x = isNaN(x) ? 0 : x;
        this.y = isNaN(y) ? 0 : y;
    };

    Geom.Point.prototype.clone = function(){
        return new Geom.Point(this.x,this.y);
    };

    Geom.Point.prototype.update = function(x, y){
        this.x = isNaN(x) ? this.x : x;
        this.y = isNaN(y) ? this.y : y;
    };

    Geom.Point.prototype.add = function(x, y){
        this.x += isNaN(x) ? 0 : x;
        this.y += isNaN(y) ? 0 : y;
    };

    Geom.Point.prototype.equals = function(point){
        return this.x==point.x && this.y==point.y;
    };

    Geom.Point.prototype.toString = function(){
        return "{x:"+this.x+" , y:"+this.y+"}";
    };

    Geom.Point.interpolate = function(pointA, pointB, normal){
        return new Geom.Point(Sakri.MathUtil.interpolate(normal, pointA.x, pointB.x) , Sakri.MathUtil.interpolate(normal, pointA.y, pointB.y));
    };

    Geom.Point.distanceBetweenTwoPoints = function( point1, point2 ){
        //console.log("Math.pow(point2.x - point1.x,2) : ",Math.pow(point2.x - point1.x,2));
        return Math.sqrt( Math.pow(point2.x - point1.x,2) + Math.pow(point2.y - point1.y,2) );
    };

    Geom.Point.angleBetweenTwoPoints = function(p1,p2){
        return Math.atan2(p1.y-p2.y, p1.x-p2.x);
    };

	//==================================================
	//===================::RECTANGLE::==================
	//==================================================

	Geom.Rectangle = function (x, y, width, height){
		this.update(x, y, width, height);
	};
	
	Geom.Rectangle.prototype.update = function(x, y, width, height){
		this.x = isNaN(x) ? 0 : x;
		this.y = isNaN(y) ? 0 : y;
		this.width = isNaN(width) ? 0 : width;
		this.height = isNaN(height) ? 0 : height;
	};
	
	Geom.Rectangle.prototype.updateToRect = function(rect){
		this.x = rect.x;
		this.y = rect.y;
		this.width = rect.width;
		this.height = rect.height;
	};
	
	Geom.Rectangle.prototype.scaleX = function(scaleBy){
		this.width *= scaleBy;
	};
	
	Geom.Rectangle.prototype.scaleY = function(scaleBy){
		this.height *= scaleBy;
	};
	
	Geom.Rectangle.prototype.scale = function(scaleBy){
		this.scaleX(scaleBy);
		this.scaleY(scaleBy);
	};

	Geom.Rectangle.prototype.getRight = function(){
		return this.x + this.width;
	};
	
	Geom.Rectangle.prototype.getBottom = function(){
		return this.y + this.height;
	};

    Geom.Rectangle.prototype.getCenter = function(){
        return new Geom.Point(this.getCenterX(), this.getCenterY());
    };

    Geom.Rectangle.prototype.getCenterX = function(){
        return this.x + this.width/2;
    };

    Geom.Rectangle.prototype.getCenterY=function(){
        return this.y + this.height/2;
    };

    Geom.Rectangle.prototype.containsPoint = function(x, y){
        return x >= this.x && y >= this.y && x <= this.getRight() && y <= this.getBottom();
    };
    Geom.Rectangle.prototype.containsRect = function(rect){
        return this.containsPoint(rect.x, rect.y) && this.containsPoint(rect.getRight(), rect.getBottom());
    };
	

	Geom.Rectangle.prototype.clone = function(){
		return new Geom.Rectangle(this.x, this.y, this.width, this.height);
	};
	
	Geom.Rectangle.prototype.toString = function(){
		return "Rectangle{x:"+this.x+" , y:"+this.y+" , width:"+this.width+" , height:"+this.height+"}";
	};


    window.Geom = Geom;
    
}(window));



//=========::UNIT ANIMATOR::=======

//animates a number from 0-1 (with optional easing) for a given duration and a framerate
//this is used to animate or tweeen visuals which are set up using interpolation

(function (window){

    window.requestAnimationFrame =
        window.__requestAnimationFrame ||
            window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.oRequestAnimationFrame ||
            window.msRequestAnimationFrame ||
            (function () {
                return function (callback, element) {
                    var lastTime = element.__lastTime;
                    if (lastTime === undefined) {
                        lastTime = 0;
                    }
                    var currTime = Date.now();
                    var timeToCall = Math.max(1, 33 - (currTime - lastTime));
                    window.setTimeout(callback, timeToCall);
                    element.__lastTime = currTime + timeToCall;
                };
            })();
    
	//constructor, duration and framerate must be in milliseconds
	var UnitAnimator = function(duration, canvas, updateCallBack, completeCallBack){
        this.easingFunction = UnitAnimator.easeLinear;//default
        this.animating = false;
        this.canvas = canvas;
        var scope = this;
        this.loopFunction = function(){scope.loop();};
		this.reset(duration, updateCallBack, completeCallBack);

	};

	//t is "time" this.millisecondsAnimated
	//b is the "beginning" value
	//c is "change" or the difference of end-start value
	//d is this.duration
	
	//classic Robert Penner easing functions
	//http://www.robertpenner.com/easing/
	
	
	UnitAnimator.easeLinear = function(t, b, c, d){
		return c * (t / d) + b;
	};
	
	//SINE
	UnitAnimator.easeInSine = function (t, b, c, d){
		return -c * Math.cos(t/d * MathUtil.HALF_PI) + c + b;
	};
	UnitAnimator.easeOutSine = function (t, b, c, d){
		return c * Math.sin(t/d * MathUtil.HALF_PI) + b;
	};
	UnitAnimator.easeInOutSine = function (t, b, c, d){
		return -c/2 * (Math.cos(Math.PI*t/d) - 1) + b;
	};
	
	UnitAnimator.easingFunctions = [UnitAnimator.easeLinear,
                                    UnitAnimator.easeInSine, UnitAnimator.easeOutSine, UnitAnimator.easeInOutSine];
	
	UnitAnimator.getRandomEasingFunction = function(){
		return UnitAnimator.easingFunctions[Math.floor( Math.random()*UnitAnimator.easingFunctions.length )];
	};
	
	UnitAnimator.prototype.setRandomEasingFunction = function(){
		this.easingFunction = UnitAnimator.getRandomEasingFunction();
	};
	
	UnitAnimator.prototype.setEasingFunction = function(easingFunction){
		if(UnitAnimator.easingFunctions.indexOf(easingFunction) > -1){
			this.easingFunction = easingFunction;
		}
	};
	
	//easing (t, b, c, d)
	//@t is the current time (or position) of the tween. This can be seconds or frames, steps, seconds, ms, whatever � as long as the unit is the same as is used for the total time [3].
	//@b is the beginning value of the property.
	//@c is the change between the beginning and destination value of the property.
	//@d is the total time of the tween.
	UnitAnimator.prototype.getAnimationPercent = function(){
		return this.easingFunction(MathUtil.normalize(this.millisecondsAnimated, 0, this.duration), 0, 1, 1);
	};
	
	UnitAnimator.prototype.reset = function(duration, updateCallBack, completeCallBack){
		this.duration = duration;
		this.updateCallBack = updateCallBack;
		this.completeCallBack = completeCallBack;
	};
	
	UnitAnimator.prototype.start = function(easingFunction){
		//console.log("UnitAnimator.start()");
		if(easingFunction){
			this.setEasingFunction(easingFunction);
		}
        this.animating = true;
        this.animationStart = Date.now();
        this.millisecondsAnimated = 0;//keeps track of how long the animation has been running
		this.loop();
	};

    UnitAnimator.prototype.loop = function(){
        if(!this.animating){
            return;
        }
        this.update();
        window.requestAnimationFrame(this.loopFunction, canvas);
    }

	UnitAnimator.prototype.pause = function(){
		this.animating = false;
	};

    UnitAnimator.prototype.stop = function(){
        this.pause();
    };

	//refactor, make private
	UnitAnimator.prototype.update = function(){
		//console.log("UnitAnimator.update()",this.getAnimationPercent());
		this.millisecondsAnimated = Date.now() - this.animationStart;
		if(this.millisecondsAnimated >= this.duration){
			//console.log("UnitAnimator.update() animation complete");
			this.pause();
			this.millisecondsAnimated = this.duration;
			this.dispatchUpdate();
			this.dispatchComplete();
			return;
		}
		this.dispatchUpdate();
	};
	
	UnitAnimator.prototype.dispatchUpdate = function(){
		if(this.updateCallBack){
			//console.log("UnitAnimator.dispatchUpdate()",this.getAnimationPercent());
			this.updateCallBack();
		}
	};
	UnitAnimator.prototype.dispatchComplete = function(){
		if(this.completeCallBack){
			this.completeCallBack();
		}
	};

    window.UnitAnimator = UnitAnimator;
	
}(window));

var readyStateCheckInterval = setInterval( function() {
    if (document.readyState === "complete") {
        clearInterval(readyStateCheckInterval);
        init();
    }
}, 10);


//========================
//general properties for demo set up
//========================

var canvas;
var context;
var canvasContainer;
var htmlBounds;
var bounds;
var minimumStageWidth = 250;
var minimumStageHeight = 250;
var maxStageWidth = 500;
var maxStageHeight = 500;
var resizeTimeoutId = -1;

function init(){
    canvasContainer = document.getElementById("canvasContainer");
    window.onresize = resizeHandler;
    commitResize();
}

function getWidth( element ){return Math.max(element.scrollWidth,element.offsetWidth,element.clientWidth );}
function getHeight( element ){return Math.max(element.scrollHeight,element.offsetHeight,element.clientHeight );}

//avoid running resize scripts repeatedly if a browser window is being resized by dragging
function resizeHandler(){
    context.clearRect(0,0,canvas.width, canvas.height);
    clearTimeout(resizeTimeoutId);
    clearTimeoutsAndIntervals();
    resizeTimeoutId = setTimeout(commitResize, 300 );
}

function commitResize(){
    if(canvas){
        canvasContainer.removeChild(canvas);
    }
    canvas = document.createElement('canvas');
    canvas.style.position = "absolute";
    context = canvas.getContext("2d");
    canvasContainer.appendChild(canvas);

    htmlBounds = new Geom.Rectangle(0,0, getWidth(canvasContainer) , getHeight(canvasContainer));
    if(htmlBounds.width >= maxStageWidth){
        canvas.width = maxStageWidth;
        canvas.style.left = htmlBounds.getCenterX() - (maxStageWidth/2)+"px";
    }else{
        canvas.width = htmlBounds.width;
        canvas.style.left ="0px";
    }
    if(htmlBounds.height > maxStageHeight){
        canvas.height = maxStageHeight;
        canvas.style.top = htmlBounds.getCenterY() - (maxStageHeight/2)+"px";
    }else{
        canvas.height = htmlBounds.height;
        canvas.style.top ="0px";
    }
    bounds = new Geom.Rectangle(0,0, canvas.width, canvas.height);
    context.clearRect(0,0,canvas.width, canvas.height);

    if(bounds.width<minimumStageWidth || bounds.height<minimumStageHeight){
        stageTooSmallHandler();
        return;
    }

    startDemo();
}

function stageTooSmallHandler(){
    var warning = "Sorry, bigger screen required :(";
    context.font = "bold normal 24px sans-serif";
    context.fillText(warning, bounds.getCenterX() - context.measureText(warning).width/2, bounds.getCenterY()-12);
}




//========================
//Demo specific properties
//========================

var animating = false;
var margin = 40;
var min = 0;
var max = 100;
var dataProviderMin = 0;
var bgCanvas, bgContext, dataProvider, dataProviderMax, animator, barChartOpen, reflectionRect, colors, center, barWidth, pointSpacer, renderPoint;

function clearTimeoutsAndIntervals(){
    animator.pause();
}

function startDemo(){
    setRandomValues();
    setRandomColors();
    barWidth = (canvas.width/2) / dataProvider.length;
    pointSpacer = (canvas.width - margin * 2) / (dataProvider[0].length - 1);

    createBackground ();
    renderPoint = new Geom.Point();

    canvas.addEventListener("click", canvasClickHandler, false);
    barChartOpen = true;
    animator = new UnitAnimator(1500, canvas, updateBarChart);
    animator.setRandomEasingFunction();
    animator.start();
}

function setRandomValues(){
    dataProvider = [];
    var lines = 2 + Math.floor(Math.random() * 2);//between 2 and 3
    var points = 10 + Math.floor(Math.random() * 10);//between 10 and 40
    var i, line, pointValue;
    while(lines>0){
        line = [];
        pointValue = dataProvider.length * 30 + Math.floor(Math.random() * 30);
        for(i=0; i<points; i++){
            line[i] = pointValue;
            pointValue += Math.floor(-3 + Math.random() * 6);
            pointValue = Math.max(pointValue, 0);//don't go below 0 (why?)
        }
        dataProvider.push(line);
        //console.log("LineChart.setRandomValues() line : "+line.toString());
        lines--;
    }
}


function setRandomColors(){
    colors = [];
    while(colors.length != dataProvider.length){
        colors.push(getRandomFillStyleColor());
    }
}

function getRandomFillStyleColor(alpha){
    var c = [];
    for(var i=0; i<3; i++){
        c[i] = Math.floor(Math.random()*255);
    }
    return "rgba("+c[0]+","+c[1]+","+c[2]+","+(isNaN(alpha) ? 1 : alpha)+")";
}


var numberOfBackgroundLines = 9;
var darkColor = "#157b0f";
var lightColor = "#77fd6f";

var legendMargin = 10;


function createBackground(){
    if(!bgCanvas){
        bgCanvas = document.createElement('canvas');
    }
    bgCanvas.width = canvas.width;
    bgCanvas.height = canvas.height;
    bgContext = bgCanvas.getContext("2d");

    //draw background lines
    bgContext.strokeStyle = lightColor;
    bgContext.lineWidth = 1;
    bgContext.textBaseline = "bottom";
    var gap = bgCanvas.height / (numberOfBackgroundLines+1);
    var yPos = gap;
    var roundedYPos;
    var legendIncrement = (max - min)/(numberOfBackgroundLines+1);
    var legend = max - legendIncrement;
    bgContext.fillStyle = darkColor;
    bgContext.font = "bold 16px sans-serif";
    for(var i = 0; i < numberOfBackgroundLines; i++){
        bgContext.beginPath();
        roundedYPos = Math.round(yPos);
        bgContext.moveTo(0, roundedYPos);
        bgContext.lineTo(bgCanvas.width, roundedYPos);
        bgContext.stroke();
        bgContext.closePath();
        yPos += gap;
        bgContext.fillText(Math.round(legend), legendMargin , roundedYPos);
        legend-=legendIncrement;
    }
    bgContext.fillText( Math.round(legend), legendMargin , roundedYPos+gap);
}

function render(animationPercent){
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.drawImage(bgCanvas, 0, 0);
    for (var i = 0; i < dataProvider.length; i++) {
        renderLine(dataProvider[i], this.colors[i], animationPercent);
    }
}

function calculateYPosition(value, animationPercent){
    return MathUtil.interpolate( MathUtil.normalize(value, min, max) * animationPercent, bounds.getBottom(), 0)
}

function renderLine(line, color, animationPercent){
    if(animationPercent==0){
        return;
    }
    context.beginPath();
    context.strokeStyle = color;
    context.lineWidth = 3;
    context.moveTo(margin, calculateYPosition(line[0], animationPercent));
    //render lines
    for (var i = 1; i < line.length; i++) {
        renderPoint.x = margin + (pointSpacer * i);
        renderPoint.y = calculateYPosition(line[i], animationPercent);
        context.lineTo(renderPoint.x, renderPoint.y);
    }

    context.stroke();
    context.closePath();

    if(animationPercent!=1){
        return;
    }

    //render dots
    context.strokeStyle = color;
    context.fillStyle = "#FFFFFF";
    for (i = 0; i < line.length; i++) {
        context.beginPath();
        renderPoint.x = margin + pointSpacer * i;
        renderPoint.y = calculateYPosition(line[i], animationPercent);
        context.arc(renderPoint.x, renderPoint.y, 5, 0, MathUtil.PI2);
        context.fill();
        context.stroke();
        context.closePath();
    }
}

function updateBarChart(){
    render(animator.getAnimationPercent());
}

function updateBarChartReverse(){
    render(1 - animator.getAnimationPercent());
}

function canvasClickHandler(){
    if(animator.animating){
        return;
    }
    animator.reset(1500, barChartOpen ? updateBarChartReverse : updateBarChart);
    animator.setRandomEasingFunction();
    barChartOpen =! barChartOpen;
    animator.start();
}