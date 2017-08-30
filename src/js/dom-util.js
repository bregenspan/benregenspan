import memoize from 'lodash/memoize';

const doc = document;
const body = doc.body;

export function $ (id) {
  return doc.getElementById(id);
}

/* 
 * Get position of `node` relative to a specified
 *      `ancestor`
 */
export function getRelPosition (node, ancestor) {
  let top = 0;
  let left = 0;

  while (node) {
    if (node.tagName) {
      top = top + node.offsetTop;
      left = left + node.offsetLeft;
      node = node.offsetParent;
    } else {
      node = node.parentNode;
    }
    if (node === ancestor) {
      node = null;
    }
  }

  return [left, top];
};

/*
 * Get prefixed or un-prefixed name of "transform" property
 * in this browser.
 */
export const getTransformPropertyName = memoize(function () {
  const prefixes = ['', 'webkit', 'moz', 'ms'];
  for (let i = 0, ilen = prefixes.length; i < ilen; i++) {
    const prefix = prefixes[i];
    const propertyName = prefix + (prefix ? 'T' : 't') + 'ransform';
    if (typeof body.style[propertyName] !== 'undefined') {
      return propertyName;
    }
  }
});
