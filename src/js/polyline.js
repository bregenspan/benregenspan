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
        ctx.lineCap = 'round';
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
