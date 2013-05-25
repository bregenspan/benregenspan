// http://paulirish.com/2011/requestanimationframe-for-smart-animating/
// http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating
 
// requestAnimationFrame polyfill by Erik Möller. fixes from Paul Irish and Tino Zijdel
 
// MIT license 
(function() {
    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame'] 
                                   || window[vendors[x]+'CancelRequestAnimationFrame'];
    }
 
    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function(callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function() { callback(currTime + timeToCall); }, 
              timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };
 
    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
}());


var Point = function (x, y) {
    this.x = x;
    this.y = y;
};

Point.prototype.greaterThan = function (point) {
    return (this.y > point.y || this.x > point.x);
};

Point.prototype.equals = function (point) {
    return (this.y === point.y && this.x === point.x);
};

function AnimatedPolyline (segments, ctx, callback) {
    this.finished = false;
    this.segments = segments;
    this.ctx = ctx;
    this.callback = callback || function () {};
    ctx.lineCap = 'round';

    // index in coordinates array where current segment beginsAQ
    var idx = this.currentSegmentIndex = 0;

    this.position = segments[0]; 
}

AnimatedPolyline.prototype.draw = function (lastRender) {

    if (this.finished) {
        return;
    }

    if (typeof lastRender === 'undefined') {
        lastRender = new Date().getTime();
    }

    var delta = new Date().getTime() - lastRender;
    this.renderTick(delta);
    lastRender = new Date().getTime();

    // set up our next frame
    var me = this;
    window.requestAnimationFrame(function () {
        me.draw(lastRender);
    });
};

AnimatedPolyline.prototype.finish = function () {
    this.finished = true;
    window.clearTimeout(this.timeout);
    this.callback();
};

AnimatedPolyline.prototype.renderTick = function (delta) {
    var interval = 60 / 1000;
    var ctx = this.ctx;
    var idx = this.currentSegmentIndex;
    var targetPos = this.segments[idx + 1];

    // 2px / frame @ 60 target fps
    var moveAmount = delta * interval * 4;

    console.log(moveAmount);
    var pos = this.position;
 
    if (targetPos.greaterThan(pos)) {
        ctx.beginPath();
        ctx.moveTo(pos.x, pos.y);
        
        if (targetPos.y > pos.y) {
           pos.y += moveAmount;
        }
        if (targetPos.x > pos.x) {
           pos.x += moveAmount;
        }
        
        if (pos.x > targetPos.x) {
            pos.x = targetPos.x;    
        }
        if (pos.y > targetPos.y) {
            pos.y = targetPos.y;   
        }
        
        ctx.lineTo(pos.x, pos.y);
        ctx.lineWidth = 4;
        ctx.stroke();

    } else if (targetPos.equals(pos)) {
        this.currentSegmentIndex += 1;
        if (this.currentSegmentIndex === this.segments.length - 1) {
            this.finish();
        }
    }
};
