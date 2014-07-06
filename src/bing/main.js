/*
 * Adapted from: https://developer.mozilla.org/en-US/docs/Web/HTML/Manipulating_video_using_canvas
 */

var processor = {
  timerCallback: function() {
    if (this.video.paused || this.video.ended) {
      return;
    }
    this.computeFrame();
    var self = this;
    setTimeout(function () {
        self.timerCallback();
      }, 0);
  },

  doLoad: function() {
    this.video = document.getElementById("video");
	this.video.play();
	  
    this.helper = document.getElementById("helper");
    this.helperCtx = this.helper.getContext("2d");
    this.display = document.getElementById("display");
    this.displayCtx = this.display.getContext("2d");
    var self = this;
    this.video.addEventListener("playing", function() {
		self.width = self.video.videoWidth / 2;
		self.height = self.video.videoHeight / 2;
        self.timerCallback.apply(self);
      }, false);
    this.video.addEventListener("ended", function() {
		self.video.currentTime = 0;
		self.video.load();
		self.video.play();	
	});
  },

  computeFrame: function() {
    this.helperCtx.drawImage(this.video, 0, 0, this.width, this.height);
    var frame = this.helperCtx.getImageData(0, 0, this.width, this.height);
	var l = frame.data.length / 4;

    for (var i = 0; i < l; i++) {
      var r = frame.data[i * 4 + 0];
      var g = frame.data[i * 4 + 1];
      var b = frame.data[i * 4 + 2];
      if (g < 5 && r < 5 && b < 5) {
        frame.data[i * 4 + 3] = 0;
	  }
    }
    this.displayCtx.putImageData(frame, 0, 0);
    return;
  }
};
