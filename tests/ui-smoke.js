const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.join(__dirname, '..');

function read(file) {
  return fs.readFileSync(path.join(ROOT, file), 'utf8');
}

test('Bootstrap HTML exposes mount point and assets', () => {
  const html = read('index.html');
  assert.match(html, /div id="cv-root"/, 'cv-root container missing');
  assert.match(html, /assets\/js\/main.js/, 'main script not loaded');
});

test('Experience toggle handler exists in script', () => {
  const js = read('assets/js/main.js');
  assert.match(js, /initExperienceControls\(\)/, 'initExperienceControls not invoked');
  assert.match(js, /experience-toggle/, 'experience-toggle reference missing in script');
});
