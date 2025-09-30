const test = require('node:test');
const assert = require('node:assert/strict');
const { loadMainWithSandbox, createTestData } = require('../helpers/dom-sandbox');

test('handleEditClick opens modal with targeted section', async () => {
  const { sandbox, hooks } = loadMainWithSandbox();
  sandbox.window.cvData = createTestData();

  const overlay = hooks.createEditorPanel();
  sandbox.document.body.appendChild(overlay);

  hooks.handleEditClick(overlay, 'summary');

  assert.equal(overlay.classList.contains('hidden'), false, 'overlay should be visible');

  const heading = overlay.querySelector('h2');
  assert.equal(heading.textContent, 'Edit Summary');

  const form = overlay.querySelector('#cv-editor-form');
  assert.equal(form.children.length, 1, 'only targeted section should render');
  assert.equal(
    form.children[0].getAttribute('data-editor-section'),
    'summary'
  );

  hooks.handleEditClick(overlay, null);

  await new Promise((resolve) => setTimeout(resolve, 0));

  assert.equal(form.children.length, 6, 'full editor should render all sections');
});
