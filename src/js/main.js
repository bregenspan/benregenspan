import debounce from 'debounce';

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

  document.getElementsByTagName('html')[0].classList.remove('loading');

  animateFavicon();
  loadFacebookSDK();
  loadGA();
}

let annoyingMode = false;
let gifViewerMode = false;
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
    bod.classList.add('annoying');
  } else if (!on && !gifViewerMode) {
    annoyingMode = false;
    bod.className = bod.classList.remove('annoying');
  }
}

function toggleGifViewer (on) {
  toggleAnnoyingMode(on);
  if (!gifViewerMode && on) {
    gifViewerMode = true;
    bod.classList.add('gif-mode');
  } else if (!on) {
    gifViewerMode = false;
    bod.classList.remove('gif-mode');
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
    .then(Giphy => new Giphy.default('edf9d49ffe4c45ed881c35edd4b14151')) // eslint-disable-line new-cap
    .catch(error => console.log('Failed to load Giphy JS SDK', error));
  return giphyPromise;
}

bod.addEventListener('click', eventHandlerFor(bod, function () {
  initializeGiphy()
    .then(g => g.randomGIF('abstract'))
    .then((o) => {
      toggleAnnoyingMode(true);
      bod.style.backgroundImage = 'url(' + o.images.original.url + ')';

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
            toggleGifViewer(false);
          } else {
            expandLink.expanded = true;
            toggleGifViewer(true);
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

      let creditURL = o.source_post_url || o.source;
      if (creditURL.indexOf('http') !== 0) {
        creditURL = o.url;
      }

      const text = `
          GIF by:
          <a href="${creditURL}" target="_blank">${o.username}</a><br>
          Via <a href="${o.url}" target="_blank">Giphy</a>
      `;
      imageCreditText.innerHTML = text;
    })
    .catch(error => console.error('Error retrieving GIF', error));
}));

initialize();
