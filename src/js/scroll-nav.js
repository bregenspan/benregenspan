import debounce from 'debounce';

import {
  $,
  getTransformPropertyName
} from './dom-util';
import Connector from './connector/connector';

const doc = document;
const bod = doc.body;
const win = window;

const unicorn = $('unicorn');
const unicornHeight = unicorn.offsetHeight;
const unicornWidth = unicorn.offsetWidth;

const ACTIVE = 'active';
const ACTIVE_REGEX = new RegExp(ACTIVE + '\\w*');
const COMPLETED = 'journey-completed';
const STARTED = 'journey-started';
const MARGIN = 20;

/**
 * Manages scroll-driven effects
 *
 * TODO: split out scroll-monitoring logic from business logic
 *  (Just use e.g. https://github.com/stutrek/scrollMonitor for scroll-monitoring logic)
 */
export default class ScrollNav {
  constructor (sections) {
    this.sections = sections;
    this.currentSection = undefined;
    this.activeConnector = undefined;

    this.sectionActivateHandlers = {};
    this.sectionDeactivateHandlers = {};

    this.foreachSection(section => {
      section.addEventListener('click', () => this.activateSection(section));
    });

    window.setTimeout(() => {
      if (!this.currentSection && !bod.scrollTop) {
        this.activateSection($('about'));
      }
    }, 1000);

    // Cache DOM positioning and size properties for sections
    const calculateSectionProperties = () => {
      for (let i = 0, ilen = this.sections.length; i < ilen; i++) {
        const section = this.sections[i];
        const posTop = section.offsetTop;
        section.setAttribute('data-offset-top', posTop);
        section.setAttribute('data-client-height', section.clientHeight);
      }
    };

    window.addEventListener('resize', debounce(calculateSectionProperties), 60);
    calculateSectionProperties();

    window.addEventListener('scroll', debounce(() => {
      const position = this.position();
      const height = this.browserHeight();
      const activatePosition = position + (height / 2.5);

      for (let i = 0, ilen = this.sections.length; i < ilen; i++) {
        const section = this.sections[i];
        const posTop = parseInt(section.getAttribute('data-offset-top'), 10);
        const posBottom = posTop + parseInt(section.getAttribute('data-client-height'), 10);

        if (activatePosition < posBottom && activatePosition > posTop) {
          if (this.activateSection(section)) { break; }
        }
      }
    }, 90));
  }

  position () {
    return win.pageYOffset || bod.scrollTop;
  }

  browserHeight () {
    return win.innerHeight || doc.documentElement.clientHeight || bod.clientHeight;
  }

  foreachSection (func) {
    for (let i = 0, ilen = this.sections.length; i < ilen; i++) {
      func(this.sections[i]);
    }
  }

  // Return the main figure for the specified section
  getFigureForSection (section) {
    let figure = section.getElementsByTagName('figure');
    if (!figure.length) return false;
    return figure[0];
  }

  // Get first child of the active section with the specified tag name
  getChildByTagName (tagName) {
    let els = this.currentSection.getElementsByTagName(tagName);
    if (!els.length) return false;
    return els[0];
  }

  activateSection (section) {
  // let's consider this a success; the section is already current
    if (section === this.currentSection) return true;

    // skip if section wasn't found or is already active
    if (!section || ACTIVE_REGEX.test(section.className)) {
      return false;
    }

    let figure = this.getFigureForSection(section);
    if (!figure && !this.hasHandlerForSection(section)) return false;

    // don't listen on sections that contain project sub-sections (we listen to the sub-sections)
    if (section.tagName.toLowerCase() === 'section' &&
            section.getElementsByClassName('project').length) {
      return false;
    }

    // Deactivate last section
    if (this.currentSection) {
      this.callSectionHandler(true);
    }

    this.currentSection = section;

    section.className = section.className.replace(ACTIVE, '');
    section.className += ' ' + ACTIVE;

    if (figure) {
      figure.style.top = (this.position() +
                document.documentElement.clientHeight - figure.offsetHeight - MARGIN) + 'px';
      this.drawConnector();
    }

    this.callSectionHandler();
    return true;
  };

  // FIXME: this does nothing!
  addStyleChanges (elements) {
    /*
    let processPref = function (element, styles, offset) {
    };
    for (let i = 0, ilen = elements.length; i < ilen; i++) {
      let elementPref = elements[i];
      let element = elementPref.el;
       elementPref.forEach((pref) => processPref(element, elementPref));
    }
    */
  }

  addHandler (sectionId, activateHandler, deactivateHandler) {
    this.sectionActivateHandlers[sectionId] = activateHandler;
    this.sectionDeactivateHandlers[sectionId] = deactivateHandler;
  }

  hasHandlerForSection (section) {
    if (typeof this.sectionActivateHandlers[section.id] === 'function') {
      return true;
    }
    return false;
  }

  callSectionHandler (deactivate) {
    const section = this.currentSection;
    const id = section.id;
    let handlers = this.sectionActivateHandlers;
    if (deactivate) {
      handlers = this.sectionDeactivateHandlers;
    }
    if (typeof handlers[id] === 'function') {
      handlers[id].call(null, section);
    }
  }

  getConnector (section) {
    const title = this.getChildByTagName('h3') || this.getChildByTagName('h2');
    const figure = this.getFigureForSection(section);
    let connector = section.connector;

    if (connector) {
      return connector;
    }

    connector = new Connector({
      parentEl: $('content'),
      src: title,
      dest: figure,
      style: {
        marginRight: 50,
        marginLeft: 5
      }
    });

    connector.addListener('move', (e) => {
      if (unicorn.style.visibility === 'hidden') {
        unicorn.style.visibility = 'visible';
      }
      if (unicorn.className) {
        unicorn.className = '';
      }
      const translate = 'translate(' + (e.x - (unicornWidth / 2)) + 'px,' + (e.y - (unicornHeight / 2)) + 'px) translateY(0)';
      unicorn.style[getTransformPropertyName()] = translate;
    });

    connector.addListener('completed', (e) => {
      unicorn.className = COMPLETED;
      if (this.timeout) {
        window.clearTimeout(this.timeout);
      }
      this.timeout = window.setTimeout(() => {
        unicorn.style.visibility = 'hidden';
      }, 2000);
    });

    connector.addListener('cleared', () => {
      unicorn.style.visibility = 'hidden';
      if (!this.currentSection) return;
      this.currentSection.className = this.currentSection.className.replace('active', '');
    });

    section.connector = connector;
    return connector;
  }

  showUnicorn () {
    unicorn.className = STARTED;
    unicorn.style.visibility = 'visible';
    if (this.timeout) {
      window.clearTimeout(this.timeout);
      delete this.timeout;
    }
  }

  drawConnector () {
    this.activeConnector = this.getConnector(this.currentSection);
    this.showUnicorn();
    this.activeConnector.draw();
  }

  redrawConnectors = () => {
    this.foreachSection(function (section) {
      const connector = section.connector;
      if (!connector) {
        return;
      }
      connector.clear();
      connector.draw();
    });
  }
}
