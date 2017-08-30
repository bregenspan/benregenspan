/**
 *  Connector draws a line between two DOM elements using <canvas>.
 *
 *  Usage:
 *
 *  var c = new Connector(document.getElementById('mySource'),
 *                         document.getElementById('myTarget'));
 *  c.draw();
 *
 *  TODO: support choice of source and target edges. For now, left and right edges are used.
 */

import { getRelPosition } from 'dom-util';
import EventTarget from 'lib/event_target';

import Point from './point';
import AnimatedPolyline from './polyline';

const style = {
  'marginLeft': 5,
  'marginRight': 50
};

export default class Connector extends EventTarget {
  constructor (prefs) {
    const parentEl = prefs.parentEl;
    const src = prefs.src;
    const dest = prefs.dest;
    prefs.style = prefs.style || {};
    for (let option in prefs.style) {
      style[option] = prefs.style[option];
    }

    super();

    this.src = src;
    this.dest = dest;
    this.parentEl = parentEl;
  }

  fireMoveEvent (x, y) {
    // adjust from canvas-relative coordinates to div#content -relative coordinates
    this.fire({
      x: x + parseInt(this.canvas.style.left, 10),
      y: y + parseInt(this.canvas.style.top, 10),
      type: 'move'
    });
  }

  clear () {
    this.line = null;
    this.canvas.parentNode.removeChild(this.canvas);
    this.canvas = null;
    this.ctx = null;
  }

  draw (animated) {
    if (typeof animated === 'undefined') {
      animated = true;
    }

    const src = this.src;
    const dest = this.dest;
    const parentEl = this.parentEl;

    const srcPosition = getRelPosition(src, parentEl);
    const destPosition = getRelPosition(dest, parentEl);

    let srcX = srcPosition[0] + src.offsetWidth + style.marginLeft;
    let srcY = srcPosition[1] + (src.offsetHeight / 2);

    let destX = destPosition[0] + (dest.offsetWidth / 2);
    let destY = destPosition[1] + (dest.offsetHeight / 2);

    const top = Math.min(destY, srcY);
    const left = Math.min(destX, srcX);

    const MARGIN = 25;

    srcX -= left - MARGIN;
    destX -= left;
    srcY -= top - MARGIN;
    destY -= top;

    const canvas = this.canvas = document.createElement('canvas');
    canvas.height = Math.abs(destY - srcY) + (MARGIN * 2);
    canvas.width = Math.abs(destX - srcX) + (MARGIN * 2);
    canvas.style.position = 'absolute';
    canvas.style.top = top - MARGIN + 'px';
    canvas.style.left = left - MARGIN + 'px';
    parentEl.appendChild(canvas);
    this.ctx = canvas.getContext('2d');

    this.line = new AnimatedPolyline({
      segments: [
        new Point(srcX, srcY),
        new Point(srcX + 20, srcY),
        new Point(destX, destY)
      ],
      ctx: this.ctx,
      callback: (o) => this.fire('completed'),
      moveCallback: (o) => {
        if (o.animated) {
          this.fireMoveEvent(o.x, o.y);
        }
      }
    });
    this.line.draw(animated);
  }
}
