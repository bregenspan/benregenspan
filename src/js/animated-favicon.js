define([], function () {

    var doc = document, 
        canvas = doc.createElement('canvas'),
        img = doc.createElement('img'),
        ctx;

    return function () {
        if (canvas.getContext && typeof canvas.toDataURL === 'function') {
            canvas.height = canvas.width = 16;
            ctx = canvas.getContext('2d');
            img.onload = function () {
                var img = this,
                    position = canvas.height,
                    link = doc.getElementById('favicon'),
                    newLink;

                var loop = function () {
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
            img.src = 'favicon.png';
        }
    };
});
