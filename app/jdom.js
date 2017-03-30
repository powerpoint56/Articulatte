// jweiss 2017
"use strict";

window.jd = ((window, document) => {
  const cache = {};
  function find(selector, parent) {
    if (parent) {
      return parent.querySelector(selector);
    } else {
      return cache[selector] || (cache[selector] = document.querySelector(selector));
    }
  }

  function create(tag, attributes, children, parent) {
    const el = document.createElement(tag);
    if (typeof attributes === "string") {
      el.textContent = attributes;
    } else if (attributes !== null && typeof attributes === "object") {
      for (let x in attributes) {
        if (x === "_") {
          el.textContent = attributes[x];
        } else if (x === "style" && attributes[x] !== null && typeof attributes[x] === "object") {
          for (let y in attributes[x]) {
            el.style.setProperty(y, attributes[x][y]);
          }
        } else {
          el.setAttribute(x, attributes[x]);
        }
      }
    }
    if (Array.isArray(children)) {
      for (let x of children) {
        el.appendChild(x);
      }
    }
    if (parent) {
      parent.appendChild(el);
    }
    return el;
  }

  return {
    find: find,
    f: find,
    create: create,
    c: create
  };
})(window, document);
