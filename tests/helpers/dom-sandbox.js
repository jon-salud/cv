const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

function createStorage(initial = {}) {
  const store = { ...initial };
  return {
    getItem(key) {
      return Object.prototype.hasOwnProperty.call(store, key) ? store[key] : null;
    },
    setItem(key, value) {
      store[key] = String(value);
    },
    removeItem(key) {
      delete store[key];
    },
    clear() {
      Object.keys(store).forEach((key) => delete store[key]);
    }
  };
}

function createClassList(element) {
  const set = new Set();

  function sync() {
    element._className = Array.from(set).join(' ');
  }

  return {
    add(...names) {
      names.filter(Boolean).forEach((name) => set.add(name));
      sync();
    },
    remove(...names) {
      names.forEach((name) => set.delete(name));
      sync();
    },
    contains(name) {
      return set.has(name);
    },
    setFromString(str) {
      set.clear();
      if (str) {
        str
          .split(/\s+/)
          .filter(Boolean)
          .forEach((name) => set.add(name));
      }
      sync();
    },
    toString() {
      return element._className || '';
    }
  };
}

function createElementNode(tag, doc) {
  const node = {
    ownerDocument: doc,
    tagName: tag.toUpperCase(),
    _children: [],
    style: {},
    attributes: {},
    dataset: {},
    parentNode: null,
    nodeType: tag === '#TEXT' ? 3 : 1,
    value: '',
    _innerHTML: '',
    _className: ''
  };

  node.classList = createClassList(node);

  Object.defineProperty(node, 'className', {
    get() {
      return node.classList.toString();
    },
    set(value) {
      node.classList.setFromString(value);
    }
  });

  Object.defineProperty(node, 'innerHTML', {
    get() {
      return node._innerHTML;
    },
    set(value) {
      node._innerHTML = value;
      if (value === '') {
        node._children.forEach((child) => {
          child.parentNode = null;
        });
        node._children = [];
      }
    }
  });

  Object.defineProperty(node, 'children', {
    get() {
      return node._children.slice();
    }
  });

  node.appendChild = function appendChild(child) {
    if (!child) {
      return null;
    }

    if (child.isFragment) {
      child._children.slice().forEach((grandchild) => {
        appendChild.call(node, grandchild);
      });
      child._children = [];
      return child;
    }

    if (child.parentNode) {
      child.parentNode.removeChild(child);
    }

    child.parentNode = node;
    node._children.push(child);
    return child;
  };

  node.removeChild = function removeChild(child) {
    const index = node._children.indexOf(child);
    if (index >= 0) {
      node._children.splice(index, 1);
      child.parentNode = null;
    }
    return child;
  };

  node.remove = function remove() {
    if (node.parentNode) {
      node.parentNode.removeChild(node);
    }
  };

  node.setAttribute = function setAttribute(name, value) {
    node.attributes[name] = value;
    if (name === 'id') {
      doc._elementsById[value] = node;
    }
    if (name.startsWith('data-')) {
      node.dataset[name.slice(5)] = value;
    }
  };

  node.getAttribute = function getAttribute(name) {
    return node.attributes[name];
  };

  node.addEventListener = function addEventListener() {};
  node.removeEventListener = function removeEventListener() {};
  node.scrollIntoView = function scrollIntoView() {};

  node.querySelectorAll = function querySelectorAll(selector) {
    const results = [];

    function traverse(current) {
      current._children.forEach((child) => {
        if (matchesSelector(child, selector)) {
          results.push(child);
        }
        traverse(child);
      });
    }

    traverse(node);
    return results;
  };

  node.querySelector = function querySelector(selector) {
    return node.querySelectorAll(selector)[0] || null;
  };

  return node;
}

function matchesSelector(node, selector) {
  if (!node || node.nodeType !== 1) {
    return false;
  }

  if (selector.startsWith('.')) {
    return node.classList.contains(selector.slice(1));
  }

  if (selector.startsWith('#')) {
    return node.attributes.id === selector.slice(1);
  }

  const attrRegex = /^(?:([a-zA-Z0-9_-]+))?\[([^=\]]+)="([^"]*)"\]$/;
  const attrMatch = selector.match(attrRegex);
  if (attrMatch) {
    const [, tag, attr, value] = attrMatch;
    if (tag && node.tagName.toLowerCase() !== tag.toLowerCase()) {
      return false;
    }
    return node.attributes[attr] === value;
  }

  return node.tagName.toLowerCase() === selector.toLowerCase();
}

function createDocument() {
  const doc = {
    _elementsById: Object.create(null)
  };

  doc.createElement = function createElement(tag) {
    return createElementNode(tag, doc);
  };

  doc.createTextNode = function createTextNode(text) {
    const node = createElementNode('#TEXT', doc);
    node.textContent = text;
    return node;
  };

  doc.createDocumentFragment = function createDocumentFragment() {
    const fragment = createElementNode('#FRAGMENT', doc);
    fragment.isFragment = true;
    return fragment;
  };

  doc.getElementById = function getElementById(id) {
    return doc._elementsById[id] || null;
  };

  doc.querySelector = function querySelector(selector) {
    return doc.body.querySelector(selector);
  };

  doc.querySelectorAll = function querySelectorAll(selector) {
    return doc.body.querySelectorAll(selector);
  };

  doc.addEventListener = function addEventListener() {};
  doc.removeEventListener = function removeEventListener() {};

  doc.body = createElementNode('body', doc);

  return doc;
}

function createSandbox(options = {}) {
  const { sessionAuthorized = true } = options;
  const document = createDocument();
  const localStorage = createStorage();
  const sessionStorage = createStorage(
    sessionAuthorized ? { cvEditorAuth: 'true' } : {}
  );

  const window = {
    document,
    localStorage,
    sessionStorage,
    console,
    alert() {},
    prompt() { return ''; },
    fetch() {
      return Promise.reject(new Error('fetch not available in tests'));
    },
    requestAnimationFrame(callback) {
      return setTimeout(callback, 0);
    },
    cancelAnimationFrame(id) {
      clearTimeout(id);
    },
    setTimeout,
    clearTimeout,
    setInterval,
    clearInterval
  };

  document.defaultView = window;

  const sandbox = {
    window,
    document,
    console,
    localStorage,
    sessionStorage,
    requestAnimationFrame: window.requestAnimationFrame,
    cancelAnimationFrame: window.cancelAnimationFrame,
    setTimeout,
    clearTimeout,
    setInterval,
    clearInterval
  };

  return sandbox;
}

function loadMainWithSandbox(options = {}) {
  const sandbox = createSandbox(options);
  const scriptPath = path.join(__dirname, '..', '..', 'assets', 'js', 'main.js');
  const code = fs.readFileSync(scriptPath, 'utf8');
  vm.runInNewContext(code, sandbox, { filename: 'main.js' });

  const hooks = sandbox.window.__cvTestHooks;
  if (!hooks) {
    throw new Error('Test hooks were not initialised.');
  }

  return { sandbox, hooks };
}

function createTestData() {
  return {
    profile: {
      name: 'Test User',
      contacts: [
        { type: 'email', label: 'test@example.com', url: 'mailto:test@example.com' }
      ]
    },
    summary: 'Original summary text.',
    skills: [
      {
        category: 'Tooling',
        items: ['Item A', 'Item B'],
        rating: 3
      }
    ],
    experiences: [
      {
        title: 'Engineer',
        company: 'Example Co',
        sections: [
          {
            heading: 'Highlights',
            items: ['Did something']
          }
        ]
      }
    ],
    certifications: [
      {
        title: 'Cert One',
        issuer: 'Issuer',
        date: '2020'
      }
    ],
    education: [
      {
        institution: 'Example University',
        degree: 'BSc',
        dates: '2010-2013',
        location: 'Remote'
      }
    ],
    languages: ['English'],
    references: 'Available on request.'
  };
}

module.exports = {
  loadMainWithSandbox,
  createTestData
};
