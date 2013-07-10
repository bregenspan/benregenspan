/*
 *  Perform any initialization of scripts we need, specific to homepage
 */

/*global require, window:true, document*/

require.config({
    shim: {
        "underscore": {
            exports: "_"
        },
        "lib/xdr": {
            exports: "xdr"
        },
        "lib/webfont": {
            exports: "WebFont"
        }
    },
    paths: {
        "underscore": "lib/underscore"
    }
});

require(["underscore", "dom-util", "scroll-nav", "giphy", "lib/webfont", "lib/polyfill/RaF", "lib/polyfill/addEventListener"], function(_, DomUtil, ScrollNav, Giphy, WebFont) {
    'use strict';

    var doc = document,
        bod = doc.body,
        $ = DomUtil.$;

    function initialize() {
        var slice = Array.prototype.slice;
        var sections = slice.call(doc.getElementsByTagName('section')).concat(
                slice.call(doc.getElementsByClassName('project')));
        var nav = new ScrollNav(sections);

        window.addEventListener('resize', _.debounce(nav.redrawConnectors, 500));

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
    }



    /* Make background go crazy for psychedelic unicorns on-hover */
    var annoyingMode = false,
        imageCredit;

    // Wrap event handler to match exact element and not bubble
    function eventHandlerFor(element, handler, otherElHandler) {
        return function (e) {
            if (e.stopPropagation) {
                e.stopPropagation();
            }
            if (typeof e.cancelBubble != "undefined") {
                e.cancelBubble = true;
            }
            if (e.target !== element) {
                if (otherElHandler) {
                    otherElHandler(e);
                }
                return;
            }
            handler(e);
        };
    }

    bod.addEventListener('mouseover', eventHandlerFor(bod, function () {
        if (!annoyingMode) {
            annoyingMode = true;
            bod.className += ' annoying';
        }
    }, function () {
        if (annoyingMode) {
            annoyingMode = false;
            bod.className = bod.className.replace(/\w*annoying/, '');
        }
    }));

    var g = new Giphy('dc6zaTOxFJmzC');
    bod.addEventListener('click', eventHandlerFor(bod, function () {
        g.getRandomMrDiv(function (o) {
            if (!annoyingMode) {
                annoyingMode = true;
                bod.className += ' annoying';
            }
            bod.style.backgroundImage = 'url(' + o.img + ')';

            if (!imageCredit) {
                imageCredit = doc.createElement('div');
                imageCredit.id = 'imageCredit';
                imageCredit.className = 'image-credit';
                bod.appendChild(imageCredit);
            }
            var text = 'Credit: mr. div' + '<br>' +
                       'Via <a href="' + o.url + '" target="_blank">Giphy</a>';
            imageCredit.innerHTML = text;
        });
    }));
    

    // Pretty Webfonts (TODO: drop Skrollr as dependency, use ScrollNav)
    WebFont.load({
        google: { families: [ 'Open+Sans:400,600', 'Noto+Serif::latin'] },
        active: initialize,
        inactive: initialize
    });


    // Stupid Pinterest widget
    (function(d){
        var f = d.getElementsByTagName('SCRIPT')[0], p = d.createElement('SCRIPT');
        p.type = 'text/javascript';
        p.async = true;
        p.src = '//assets.pinterest.com/js/pinit.js';
        f.parentNode.insertBefore(p, f);
    }(doc));


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
