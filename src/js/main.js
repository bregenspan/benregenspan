import debounce from 'debounce';
import WebFont from 'webfontloader';

import { $ } from './dom-util';
import ScrollNav from './scroll-nav';
import animateFavicon from './animated-favicon';
import loadFacebookSDK from './tags/facebook';
import loadGA from './tags/ga';

import 'main.scss';

const doc = document;
const bod = doc.body;

function initialize () {
  const slice = Array.prototype.slice;
  const sections = slice.call(doc.getElementsByTagName('section')).concat(
    slice.call(doc.getElementsByClassName('project')));
  const nav = new ScrollNav(sections);

  window.addEventListener('resize', debounce(nav.redrawConnectors, 500));

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

let annoyingMode = false;
let veryAnnoyingMode = false;
let imageCredit;
let imageCreditText;
let expandLink;

// Wrap event handler to match exact element and not bubble
function eventHandlerFor (element, handler, otherElHandler) {
  return function (e) {
    if (e.stopPropagation) {
      e.stopPropagation();
    }
    if (typeof e.cancelBubble !== 'undefined') {
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

/* Make background go crazy for psychedelic unicorns on-hover */
function toggleAnnoyingMode (on) {
  if (!annoyingMode && on) {
    annoyingMode = true;
    bod.className += ' annoying';
  } else if (!on && !veryAnnoyingMode) {
    annoyingMode = false;
    bod.className = bod.className.replace(' annoying', '');
  }
}

function toggleVeryAnnoyingMode (on) {
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

let giphyPromise;
function initializeGiphy () {
  if (giphyPromise) {
    return giphyPromise;
  }
  giphyPromise = import(/* webpackChunkName: "giphy" */ 'giphy')
    .then(Giphy => new Giphy.default('dc6zaTOxFJmzC')) // eslint-disable-line new-cap
    .catch(error => console.log('Failed to load Giphy JS SDK', error));
  return giphyPromise;
}

bod.addEventListener('click', eventHandlerFor(bod, function () {
  initializeGiphy()
    .then(g => g.getRandomMrDiv(function (o) {
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
      const text = 'GIF by: <a href="http://mrdiv.tumblr.com/" target="_blank">' +
                       'mr. div</a>' + '<br>' +
                        'Via <a href="' + o.url + '" target="_blank">Giphy</a>';
      imageCreditText.innerHTML = text;
    }));
}));

WebFont.load({
  google: {
    families: ['Open+Sans:400,600', 'Noto+Serif::latin']
  },
  active: initialize,
  inactive: initialize
});

animateFavicon();

loadFacebookSDK();
loadGA();
