#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, '..', 'assets', 'data', 'cv-data.json');

function fail(message) {
  console.error(`\u274c ${message}`);
  process.exit(1);
}

function loadData() {
  if (!fs.existsSync(dataPath)) {
    fail(`cv-data.json was not found at ${dataPath}`);
  }

  try {
    const raw = fs.readFileSync(dataPath, 'utf-8');
    return JSON.parse(raw);
  } catch (error) {
    fail(`Unable to read or parse cv-data.json: ${error.message}`);
  }
}

function ensureString(value, message) {
  if (typeof value !== 'string' || !value.trim()) {
    fail(message);
  }
}

function ensureArray(value, message) {
  if (!Array.isArray(value) || value.length === 0) {
    fail(message);
  }
}

const data = loadData();

// Top-level keys
['profile', 'summary', 'skills', 'experiences', 'certifications', 'education'].forEach((key) => {
  if (!(key in data)) {
    fail(`Missing top-level key: ${key}`);
  }
});

// Profile validation
ensureString(data.profile.name, 'Profile name must be a non-empty string');
ensureArray(data.profile.contacts, 'Profile contacts must be a non-empty array');

data.profile.contacts.forEach((contact, index) => {
  ensureString(contact.type, `Contact at index ${index} is missing type`);
  ensureString(contact.label, `Contact at index ${index} is missing label`);
  ensureString(contact.url, `Contact at index ${index} is missing url`);
});

// Summary
ensureString(data.summary, 'Summary must be a non-empty string');

// Skills
ensureArray(data.skills, 'Skills must be a non-empty array');
data.skills.forEach((skill, index) => {
  ensureString(skill.category, `Skill entry ${index} is missing category`);
  ensureArray(skill.items, `Skill entry ${index} must include items`);
});

// Experiences
ensureArray(data.experiences, 'Experiences must be a non-empty array');
data.experiences.forEach((experience, index) => {
  ensureString(experience.title, `Experience entry ${index} is missing title`);
  ensureArray(experience.sections, `Experience entry ${index} must have sections`);
  experience.sections.forEach((section, sectionIndex) => {
    if (section.heading !== undefined && section.heading !== null) {
      ensureString(section.heading, `Section ${sectionIndex} in experience ${index} has invalid heading`);
    }
    ensureArray(section.items, `Section ${sectionIndex} in experience ${index} must include items`);
  });
});

console.log('\u2705 CV data passed validation checks.');
