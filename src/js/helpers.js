function createElement(
  {
    tag,
    classes = [],
    attributes = {},
    innerText = '',
  },
) {
  const element = document.createElement(tag);

  if (classes.length > 0) {
    element.classList.add(...classes);
  }

  Object.entries(attributes).forEach(([key, value]) => element.setAttribute(key, value));

  if (innerText) {
    element.innerText = innerText;
  }

  return element;
}

function importAll(r) {
  return r.keys().map(r);
}

function getRandomInteger(min, max) {
  const rand = min + Math.random() * (max + 1 - min);
  return Math.floor(rand);
}

export { createElement, importAll, getRandomInteger };
