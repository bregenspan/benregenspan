/*
 *  Perform any initialization of scripts we need, specific to homepage
 */

/*global require, window:true*/

require.config({
    shim: {
        "underscore": {
            exports: "_"
        }
    },
    paths: {
        "underscore": "lib/underscore"
    }
});

require(["dom-util", "scroll-nav", "lib/polyfill/RaF", "lib/polyfill/addEventListener"], function(DomUtil, ScrollNav) {
    'use strict';

    var doc = document,
        $ = DomUtil.$;

    // Pretty Webfonts (TODO: drop Skrollr as dependency, use ScrollNav)
    window.WebFontConfig = {
        google: { families: [ 'Open+Sans:400,600', 'Noto+Serif::latin'] }
    };
    (function() {
        var wf = doc.createElement('script');
        wf.src = ('https:' === doc.location.protocol ? 'https' : 'http') +
          '://ajax.googleapis.com/ajax/libs/webfont/1/webfont.js';
        wf.type = 'text/javascript';
        wf.async = 'true';
        var s = doc.getElementsByTagName('script')[0];
        s.parentNode.insertBefore(wf, s);
    })();


    // Stupid Pinterest widget
    (function(d){
        var f = d.getElementsByTagName('SCRIPT')[0], p = d.createElement('SCRIPT');
        p.type = 'text/javascript';
        p.async = true;
        p.src = '//assets.pinterest.com/js/pinit.js';
        f.parentNode.insertBefore(p, f);
    }(doc));



    var slice = Array.prototype.slice;
    var sections = slice.call(doc.getElementsByTagName('section')).concat(
            slice.call(doc.getElementsByClassName('project')));
    var nav = new ScrollNav(sections);

    nav.addHandler('comicSans', function (section) {
        section.className += ' comic-sans';
    }, function (section) {
        section.className = section.className.replace('comic-sans', '');
    });

    nav.addStyleChanges([
        {
            el: $('sidebar'),
            0: 'top:120px',
            200: 'top:10px'
        },
        {
            el: $('title'),
            0: 'opacity:1; top:22px; transform:rotate(9deg)',
            200: 'opacity:0; top:500px; transform:rotate(130deg)'
        }
    ]);



    /* Animate Abe Lincoln favicon */
    (function () {
        var canvas = doc.createElement('canvas'),
            ctx,
            img = doc.createElement('img');

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
    }());
});
