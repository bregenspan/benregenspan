const doc = document;
const canvas = doc.createElement('canvas');
const img = doc.createElement('img');

export default function animatedFavicon () {
  if (canvas.getContext && typeof canvas.toDataURL === 'function') {
    canvas.height = canvas.width = 16;
    const ctx = canvas.getContext('2d');
    img.onload = function () {
      const img = this;
      let position = canvas.height;
      let link = doc.getElementById('favicon');
      let newLink;

      const loop = function () {
        newLink = link.cloneNode(true);
        ctx.clearRect(0, 0, canvas.height, canvas.width);
        ctx.drawImage(img, 0, position);
        newLink.setAttribute('href', canvas.toDataURL());
        link.parentNode.replaceChild(newLink, link);
        link = newLink;
        if (position > 0) {
          position--;
          window.setTimeout(loop, 100);
        } else {
          position = canvas.height;
          window.setTimeout(loop, 10000);
        }
      };
      loop();
    };
    img.src = require('../favicon.png');
  }
};
