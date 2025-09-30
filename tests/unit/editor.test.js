const test = require('node:test');
const assert = require('node:assert/strict');
const { loadMainWithSandbox, createTestData } = require('../helpers/dom-sandbox');

test('collectEditorData merges summary updates without touching other sections', () => {
  const { sandbox, hooks } = loadMainWithSandbox();
  sandbox.window.cvData = createTestData();

  const form = sandbox.document.createElement('form');
  const summarySection = hooks.createSummaryEditor(sandbox.window.cvData.summary);
  const summaryTextarea = summarySection.querySelector('textarea[name="summary"]');
  summaryTextarea.value = 'Updated summary content.';
  form.appendChild(summarySection);

  const result = hooks.collectEditorData(form);

  assert.equal(result.summary, 'Updated summary content.');
  assert.equal(
    JSON.stringify(result.skills),
    JSON.stringify(sandbox.window.cvData.skills)
  );
  assert.equal(
    JSON.stringify(result.experiences),
    JSON.stringify(sandbox.window.cvData.experiences)
  );
});

test('collectEditorData replaces skills when provided while keeping summary intact', () => {
  const { sandbox, hooks } = loadMainWithSandbox();
  sandbox.window.cvData = createTestData();

  const form = sandbox.document.createElement('form');
  const skillsSection = hooks.createSkillsEditor(sandbox.window.cvData.skills);
  const skillEditor = skillsSection.querySelector('.skill-editor');

  const categoryInput = skillEditor.querySelector('.skill-category');
  const itemsTextarea = skillEditor.querySelector('.skill-items');
  const ratingInput = skillEditor.querySelector('.skill-rating');

  categoryInput.value = 'Automation';
  itemsTextarea.value = 'Playwright\nCypress';
  ratingInput.value = '5';

  form.appendChild(skillsSection);

  const result = hooks.collectEditorData(form);

  assert.equal(result.summary, sandbox.window.cvData.summary);
  assert.equal(
    JSON.stringify(result.skills),
    JSON.stringify([
      {
        category: 'Automation',
        items: ['Playwright', 'Cypress'],
        rating: 5
      }
    ])
  );
});
