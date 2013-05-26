var AnimatedPolyline = (function (Point) {
    'use strict';

    var AnimatedPolyline = function (segments, ctx, callback) {
        this.finished = false;
        this.segments = segments;
        this.ctx = ctx;
        this.callback = callback || function () {};

        // array index of beginning position of current segment
        var idx = this.currentSegmentIndex = 0;

        this.startSegment();
    };

    AnimatedPolyline.prototype.startSegment = function () {
        var idx = this.currentSegmentIndex,
            segments = this.segments;
           
        // Finish if we've exhausted our line segments
        if (this.currentSegmentIndex >= segments.length - 1) {
            this.finish();
            return;
        }

        this.currentPoint = segments[idx];
        this.nextPoint = segments[idx + 1];

        this.xDirection = true;
        this.yDirection = true;

        if (this.nextPoint.x - this.currentPoint.x < 0) {
            this.xDirection = false;            
        }
        if (this.nextPoint.y - this.currentPoint.y < 0) {
            this.yDirection = false;
        }
    };

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
        var targetPos = this.nextPoint;

        // 2px / frame @ 60 target fps
        var moveAmount = delta * interval * 4;

        var pos = this.currentPoint;
       
         console.log(pos, this.nextPoint);
        
        //console.log(pos);
        if (!targetPos.equals(pos)) {
            ctx.beginPath();
            ctx.lineCap = 'round';
            ctx.strokeStyle = '#ccc';
            ctx.moveTo(pos.x, pos.y);

            var yDiff = Math.abs(targetPos.y - pos.y),
                xDiff = Math.abs(targetPos.x - pos.x);

            if (moveAmount > yDiff) {
                // amount we're about to move exceeds amount we need to
                pos.y = targetPos.y;
            } else if (this.yDirection && targetPos.y > pos.y) {
                pos.y += moveAmount;
            } else if (!this.yDirection && targetPos.y < pos.y) {
                pos.y -= moveAmount;
            }

            if (moveAmount > xDiff) {
                // amount we're about to move exceeds what we need to
                pos.x = targetPos.x;
            } else if (this.xDirection && targetPos.x > pos.x) {
                pos.x += moveAmount;
            } else if (!this.xDirection && targetPos.x < pos.x) {
                pos.x -= moveAmount;
            }

            ctx.lineTo(pos.x, pos.y);
            ctx.lineWidth = 4;
            ctx.stroke();

        } else if (targetPos.equals(pos)) {
            this.currentSegmentIndex += 1;
            this.startSegment();
        }
    };

    return AnimatedPolyline;

}(Point));
