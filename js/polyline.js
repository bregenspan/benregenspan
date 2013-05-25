var Point = function (x, y) {
    this.x = x;
    this.y = y;
}

Point.prototype.greaterThan = function (point) {
    return (this.y > point.y || this.x > point.x);
}

Point.prototype.equals = function (point) {
    return (this.y === point.y && this.x === point.x);
}

// shim layer with setTimeout fallback
    window.requestAnimFrame = (function(){
      return  window.requestAnimationFrame       || 
              window.webkitRequestAnimationFrame || 
              window.mozRequestAnimationFrame    || 
              window.oRequestAnimationFrame      || 
              window.msRequestAnimationFrame     || 
              function( callback ){
                window.setTimeout(callback, 1000 / 60);
              };
    })();

function AnimatedPolyline (segments, ctx, callback) {
    this.segments = segments;
    this.ctx = ctx;
    this.callback = callback || function () {};

    // index in coordinates array where current segment beginsAQ
    var idx = this.currentSegmentIndex = 0;

    this.position = segments[0]; 

    _.bindAll(this);
}

AnimatedPolyline.prototype.draw = function () {
    var me = this;
    this.timeout = setTimeout(function () {
        requestAnimFrame(me.draw);
        me.render();
    }, 10);
};

AnimatedPolyline.prototype.finish = function () {
    window.clearTimeout(this.timeout);
    this.callback();
};

AnimatedPolyline.prototype.render = function () {
    var ctx = this.ctx;
    var idx = this.currentSegmentIndex;
    var targetPos = this.segments[idx + 1];

    var pos = this.position;
 
    if (targetPos.greaterThan(pos)) {
        ctx.beginPath();
        ctx.moveTo(pos.x, pos.y);
        
        if (targetPos.y > pos.y) {
           pos.y += 2;
        }
        if (targetPos.x > pos.x) {
           pos.x += 2;
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

var coordinates = [
    new Point(3, 2),
    new Point(195, 2),
    new Point(195, 195),
    new Point(301, 196)
];

var line = new AnimatedPolyline(coordinates, document.getElementById('canvas').getContext('2d'));
line.draw();
