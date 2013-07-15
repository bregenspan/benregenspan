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
        veryAnnoyingMode = false,
        imageCredit,
        imageCreditText,
        expandLink;

    // Wrap event handler to match exact element and not bubble
    function eventHandlerFor(element, handler, otherElHandler) {
        return function (e) {
            if (e.stopPropagation) {
                e.stopPropagation();
            }
            if (typeof e.cancelBubble !== "undefined") {
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

    function toggleAnnoyingMode(on) {
        if (!annoyingMode && on) {
            annoyingMode = true;
            bod.className += ' annoying';
        } else if (!on && !veryAnnoyingMode) {
            annoyingMode = false;
            bod.className = bod.className.replace(' annoying', '');
        }
    }

    function toggleVeryAnnoyingMode(on) {
        toggleAnnoyingMode(on);
        if (!veryAnnoyingMode && on) {
            veryAnnoyingMode = true;
            bod.className += ' hugely-annoying';
        } else if (!on) {
            veryAnnoyingMode = false;
            bod.className = bod.className.replace('hugely-annoying', '');
        }
    }

    bod.addEventListener('mouseover', eventHandlerFor(bod, function () {
        if (!annoyingMode) {
            annoyingMode = true;
            bod.className += ' annoying';
        }
    }, function () {
        toggleAnnoyingMode(false);
    }));

    var g = new Giphy('dc6zaTOxFJmzC');
    bod.addEventListener('click', eventHandlerFor(bod, function () {
        g.getRandomMrDiv(function (o) {
            toggleAnnoyingMode(true);
            bod.style.backgroundImage = 'url(' + o.img + ')';

            if (!imageCredit) {
                imageCredit = doc.createElement('div');
                imageCredit.id = 'imageCredit';
                imageCredit.className = 'image-credit';

                expandLink = doc.createElement('a');
                expandLink.className = 'expand-link hidden';
                expandLink.innerHTML = '&rarr;';
                expandLink.addEventListener('click', function (e) {
                    e.preventDefault();
                    if (expandLink.expanded) {
                        expandLink.expanded = false;
                        toggleVeryAnnoyingMode(false);
                    } else {
                        expandLink.expanded = true;
                        toggleVeryAnnoyingMode(true);
                    }
                    return false;
                });
                imageCredit.appendChild(expandLink);

                imageCreditText = doc.createElement('span');
                imageCredit.appendChild(imageCreditText);


                bod.appendChild(imageCredit);
                window.setTimeout(function () {
                    expandLink.className = expandLink.className.replace('hidden', '');
                }, 0);
            }
            var text = 'GIF by: <a href="http://mrdiv.tumblr.com/" target="_blank">' +
                       'mr. div</a>' + '<br>' +
                        'Via <a href="' + o.url + '" target="_blank">Giphy</a>';
            imageCreditText.innerHTML = text;
        });
    }));

    // Pretty Webfonts (TODO: drop Skrollr as dependency, use ScrollNav)
    WebFont.load({
        google: { families: [ 'Open+Sans:400,600', 'Noto+Serif::latin'] },
        active: initialize,
        inactive: initialize
    });



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
