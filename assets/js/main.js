const CV_DATA_PATH = 'assets/data/cv-data.json';
const CONTACT_ICONS = {
   linkedin: {
      src: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAA8klEQVQYlXWPsUoDYRCEv/39STyUJGCRQsFCohAsBMHS1iaFiO+gFj6AWNjZ+AAWgq2IhdjoA4iCYCOIiCFoKsVI0OCReCE3NnoWXhaG2VlmYJb5HV1ObKreDFWQRD/46qsmP9rkP78YLgS802fs6U3j7S7BVJF7gUmYGYpjnMANGD3niK28pQeA4zUqp7dU9s5ZXShzdnLDUqfLYDHHy9EKi77WoAQQ9cg0Q0ZqDUr7F4wNZQlj4e6emV4/YNel9Vme5fBxm9GrDWYAruvMpRrzAa2MJ8p6IoBWh1yqMe1pr99V/0lKNN6SzB/pR5klZ74Ba2xlwAyOEe4AAAAASUVORK5CYIIA',
      width: 10,
      height: 10
   },
   email: {
      src: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAJCAYAAAAGuM1UAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAA7EAAAOxAGVKw4bAAABaklEQVQYlX2QX0vTcRyFn8/I3yQQLWlimzZoZgjaje+hLiIw/cU0w6SfxPYWLILexNRpiGShOJuIUK+hO2mEirp06w/iXESEot/Thbv23JyL5+Y8xz7vqnd4hsVihTgXpDvKeuYxQejprObnA/y2K9qvMQMM1RroaqWQGSJIZsmFtg8sMTzDwtJzexBtpAwIgQwA3Wph482InvhT5MtVYiGA3UNuJrPkllPcv95EGUMG6oiwOTeqwb4Maz9+E0Vg4bRzYAZS4hpbb59Z0p8kX1+nf3OjNuhPkS8d0V6bK8JpOS/lXOdLbX/84u51vdLm1+/u9npJPR0vVPxU0N3EuCt6KefCKcnCaSnezM7CGA/7J1gtVYl5lzhG2MkZXvtVvi2O0fcoy4e9CvFQa6PK7wL8gUmtlKrEADs5pf74VB5gexVuJKfJvQ80EGnQT7vzWoXDvzQf/FEEmZ0fCZJkBud+qKWBX02XOfoPXBebcdT8AAUAAAAASUVORK5CYIIA',
      width: 12,
      height: 9
   },
   location: {
      src: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAANCAYAAACUwi84AAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAA7EAAAOxAGVKw4bAAABUUlEQVQYlTXIzyvDcRzH8ef7MxT5kXbgW1uoRbP5kZTTbn6W/Bly4STFLg5LufgH5OIfUA4cKCknSVYbltO3EYcRW20rfF8OeNbz8kASpYrCi/vai6Xlx9LyF/e1V6ooLAn7qAZtYxlyj+8WRQIAMyKdFK/TJEPVoc2ds4JNAoRbKbU0WbX2SUu5TkelTrs7vWMasFSM84eM9Txk6EnFOBfY6R3T7qUsD2A2yVFzo2rNjarNJjky4LmM5+Ld5BH4r/QGMhfInP9KH4JBT/mG4Yhlr3wmdi9YOs4xD/D4TgSDkYjduPkhDkGScMU3RYtviko4kBZGOHAzCR33d1lBgMxMZoakeDe3k3FOnDOC1SltGwj0uxlrM7ZlIJPE1zeh8S2y9y8aBEh4lrvcYDTkCJCEJPJPSrQtq96+EtTunzXw7w38FffIr8+RMSzo76Lw7z+9WKdj6Hi70QAAAABJRU5ErkJgggAA',
      width: 8,
      height: 13
   }
};
const RATING_SYMBOL = '🔷';

const EDIT_CREDENTIALS = {
   username: 'admin',
   password: 'changeme'
};

const STORAGE_KEYS = {
   override: 'cvDataOverride',
   auth: 'cvEditorAuth'
};

function myFunction() {
   document.body.classList.toggle('dark-mode');
}

async function loadCvData() {
   const response = await fetch(CV_DATA_PATH, { cache: 'no-cache' });
   if (!response.ok) {
      throw new Error(`HTTP ${response.status} fetching ${CV_DATA_PATH}`);
   }
   const remoteData = await response.json();
   window.originalCvData = cloneData(remoteData);

   const stored = getStoredOverride();
   return stored ? stored : cloneData(remoteData);
}

function renderCv(data) {
   const root = document.getElementById('cv-root');
   if (!root) {
      return;
   }

   window.cvData = cloneData(data);

   root.innerHTML = '';
   root.appendChild(buildHeader(window.cvData.profile));

   appendSection(root, 'WHO AM I', () => createSummary(window.cvData.summary), 'summary');
   appendSection(root, 'SKILLS', () => createSkills(window.cvData.skills), 'skills');
   appendSection(root, 'PROFESSIONAL EXPERIENCES', () => createExperienceSection(window.cvData.experiences), 'experiences');
   appendSection(root, 'CERTIFICATIONS', () => createCertifications(window.cvData.certifications), 'certifications');
   appendSection(root, 'EDUCATION', () => createEducation(window.cvData.education), 'education');
   appendSection(root, 'LANGUAGES', () => createLanguages(window.cvData.languages), 'languages');
   appendSection(root, 'REFERENCES', () => createReferences(window.cvData.references));

   renderEditorControls(root);

   initExperienceControls();
}

function renderError(message) {
   const root = document.getElementById('cv-root');
   if (!root) {
      return;
   }

   root.innerHTML = '';
   const container = createElement('div', {
      style: {
         padding: '16pt',
         border: '1px solid #ff6b6b',
         backgroundColor: 'rgba(255, 107, 107, 0.1)',
         borderRadius: '6px'
      }
   });

   const heading = createElement('h2', {
      text: 'Unable to load CV content',
      style: {
         paddingBottom: '8pt'
      }
   });

   const detail = createElement('p', {
      text: message,
      style: {
         paddingBottom: '6pt'
      }
   });

   const tip = createElement('p', {
      text: 'Tip: If you are viewing this file locally, run it through a local web server so the browser can fetch cv-data.json.',
      style: {
         fontStyle: 'italic',
         fontSize: '11pt'
      }
   });

   container.appendChild(heading);
   container.appendChild(detail);
   container.appendChild(tip);
   root.appendChild(container);
}

function buildHeader(profile = {}) {
   const fragment = document.createDocumentFragment();
   fragment.appendChild(createBreak());

   const nameParagraph = createElement('p', {
      style: {
         paddingLeft: '0pt',
         textIndent: '0pt',
         lineHeight: '50pt',
         textAlign: 'center'
      }
   });

   const nameSpan = createElement('span', {
      text: profile.name || '',
      style: {
         color: '#5c9dff',
         fontFamily: 'monospace',
         fontStyle: 'normal',
         fontWeight: 'normal',
         textDecoration: 'none',
         fontSize: '36px'
      }
   });

   nameParagraph.appendChild(nameSpan);
   fragment.appendChild(nameParagraph);
   fragment.appendChild(buildContactsTable(profile.contacts || []));
   fragment.appendChild(createBreak());

   return fragment;
}

function buildContactsTable(contacts) {
   const table = createElement('table', {
      style: {
         marginRight: 'auto',
         marginLeft: 'auto',
         border: 'none'
      }
   });

   contacts.forEach((contact) => {
      const row = createContactRow(contact);
      if (row) {
         table.appendChild(row);
      }
   });

   return table;
}

function createContactRow(contact) {
   const icon = CONTACT_ICONS[contact.type];
   if (!icon) {
      return null;
   }

   const row = document.createElement('tr');
   const iconCell = createElement('td', { style: { border: 'none' } });
   const detailCell = createElement('td', { style: { border: 'none' } });

   const img = createElement('img', {
      attrs: {
         src: icon.src,
         width: String(icon.width),
         height: String(icon.height)
      }
   });

   const link = createElement('a', {
      attrs: {
         href: contact.url || '#',
         target: '_blank',
         rel: 'noopener noreferrer'
      }
   });

   const detailText = createElement('p', {
      className: 'connect-details',
      text: contact.label || ''
   });

   link.appendChild(detailText);
   iconCell.appendChild(img);
   detailCell.appendChild(link);
   row.appendChild(iconCell);
   row.appendChild(detailCell);

   return row;
}

function appendSection(root, title, builder, editorTarget) {
   const fragment = document.createDocumentFragment();
   fragment.appendChild(createSectionHeading(title, editorTarget));
   fragment.appendChild(createRule());
   const content = builder ? builder() : null;
   if (content) {
      fragment.appendChild(content);
   }
   fragment.appendChild(createBreak());
   root.appendChild(fragment);
}

function createSectionHeading(title, editorTarget) {
   const wrapper = createElement('div', { className: 'heading-row' });
   const heading = createElement('h1', {
      className: 'heading1',
      text: title
   });
   wrapper.appendChild(heading);

   const normalizedTitle = (title || '').toLowerCase();
   const controls = createElement('div', { className: 'heading-controls' });
   if (normalizedTitle.includes('professional experience')) {
      const expand = createElement('button', {
         className: 'btn-link',
         text: 'Expand all',
         attrs: { type: 'button', id: 'experience-toggle' }
      });
      controls.appendChild(expand);
   }

   if (editorTarget) {
      const edit = createElement('button', {
         className: 'btn-link section-edit-link',
         text: 'Edit',
         attrs: { type: 'button', 'data-editor-target': editorTarget }
      });
      edit.addEventListener('click', () => handleHeadingEditClick(editorTarget));
      controls.appendChild(edit);
   }

   if (controls.childNodes.length) {
      wrapper.appendChild(controls);
   }

   return wrapper;
}

function createSummary(summaryText = '') {
   return createElement('p', {
      text: summaryText,
      style: {
         paddingLeft: '16pt',
         textIndent: '0pt',
         textAlign: 'justify'
      }
   });
}

function createSkills(skills = []) {
   const table = createElement('table', {
      attrs: { border: '1', cellspacing: '2', cellpadding: '2' },
      style: {
         paddingLeft: '6pt',
         width: 'auto'
      }
   });

   skills.forEach((skill) => {
      const row = document.createElement('tr');

      const categoryCell = createElement('td', {
         style: { width: '30%' }
      });
      const categoryHeading = createElement('h2', {
         text: skill.category || '',
         style: {
            paddingTop: '4pt',
            paddingLeft: '6pt',
            textIndent: '4pt',
            textAlign: 'left'
         }
      });
      categoryCell.appendChild(categoryHeading);

      const detailCell = createElement('td', {
         style: { width: '50%' }
      });
      const detailParagraph = createElement('p', {
         className: 's1',
         text: (skill.items || []).join(', '),
         style: {
            paddingTop: '2pt',
            paddingLeft: '6pt',
            textIndent: '0pt',
            lineHeight: '123%',
            textAlign: 'left'
         }
      });
      detailCell.appendChild(detailParagraph);

      const ratingCell = createElement('td', {
         style: {
            width: '20%',
            textAlign: 'left'
         },
         text: formatRating(skill.rating)
      });

      row.appendChild(categoryCell);
      row.appendChild(detailCell);
      row.appendChild(ratingCell);
      table.appendChild(row);
   });

   return table;
}

function createExperienceSection(experiences = []) {
   const container = document.createElement('div');

   experiences.forEach((experience) => {
      container.appendChild(createExperienceEntry(experience));
   });

   return container;
}

function createExperienceEntry(experience = {}) {
   const details = createElement('details', { className: 'experience-item' });
   const summary = createElement('summary', { className: 'experience-summary' });
   const jobHeading = createElement('h2', { className: 'job' });

   const headingParts = [];

   if (experience.title) {
      let titleText = experience.title;
      if (experience.employmentType) {
         titleText += ` (${experience.employmentType})`;
      }
      headingParts.push(document.createTextNode(titleText));
   }

   if (experience.company) {
      headingParts.push(createElement('i', { text: experience.company }));
   }

   if (experience.dateLabel) {
      headingParts.push(createElement('span', { className: 's2', text: experience.dateLabel }));
   }

   if (experience.location) {
      headingParts.push(createElement('span', { className: 'p', text: experience.location }));
   }

   headingParts.forEach((node, index) => {
      if (index > 0) {
         jobHeading.appendChild(document.createTextNode(' | '));
      }
      jobHeading.appendChild(node);
   });

   summary.appendChild(jobHeading);
   details.appendChild(summary);

   const contentWrapper = createElement('div', { className: 'experience-content' });

   (experience.sections || []).forEach((section) => {
      const sectionContainer = document.createElement('div');
      sectionContainer.appendChild(createExperienceSectionContent(section));
      contentWrapper.appendChild(sectionContainer);
   });

   details.appendChild(contentWrapper);
   return details;
}

function initExperienceControls() {
   const toggle = document.getElementById('experience-toggle');
   if (!toggle) {
      return;
   }

   toggle.textContent = 'Expand all';

   toggle.addEventListener('click', () => {
      const items = Array.from(document.querySelectorAll('.experience-item'));
      if (!items.length) {
         return;
      }

      const shouldExpand = items.some((item) => !item.open);
      items.forEach((item) => {
         item.open = shouldExpand;
      });

      toggle.textContent = shouldExpand ? 'Collapse all' : 'Expand all';
   });
}

function createExperienceSectionContent(section = {}) {
   const fragment = document.createDocumentFragment();

   if (section.heading) {
      const headingParagraph = createElement('p', { className: 'job-resp' });
      headingParagraph.appendChild(createElement('i', { text: section.heading }));
      fragment.appendChild(headingParagraph);
   }

   (section.items || []).forEach((item) => {
      const isHighlight = typeof section.heading === 'string' && section.heading.toLowerCase().includes('highlight');
      const className = isHighlight ? 'sub-job-items' : 'job-items';
      const bullet = createElement('p', { className });
      bullet.textContent = `- ${item}`;
      fragment.appendChild(bullet);
   });

   return fragment;
}

function createCertifications(certifications = []) {
   const wrapper = document.createElement('div');

   certifications.forEach((cert) => {
      const certContainer = document.createElement('div');
      const title = createElement('h2', {
         className: 'cert-title',
         text: cert.title || ''
      });
      const detail = createElement('p', {
         className: 'cert-detail',
         text: formatCertificationDetail(cert)
      });
      certContainer.appendChild(title);
      certContainer.appendChild(detail);
      wrapper.appendChild(certContainer);
   });

   return wrapper;
}

function formatCertificationDetail(cert = {}) {
   if (cert.issuer && cert.date) {
      return `${cert.issuer} (${cert.date})`;
   }
   return cert.issuer || cert.date || '';
}

function createEducation(education = []) {
   const wrapper = document.createElement('div');

   education.forEach((record) => {
      const container = document.createElement('div');
      const institution = createElement('h2', {
         text: [record.institution, record.location].filter(Boolean).join(', '),
         style: {
            paddingTop: '4pt',
            paddingLeft: '6pt',
            textIndent: '0pt',
            textAlign: 'left'
         }
      });
      const degree = createElement('p', {
         className: 's1',
         text: record.degree || '',
         style: {
            paddingTop: '2pt',
            paddingLeft: '10pt',
            textIndent: '0pt',
            textAlign: 'left'
         }
      });
      const dates = createElement('p', {
         className: 's2',
         text: record.dates || '',
         style: {
            paddingTop: '3pt',
            paddingLeft: '10pt',
            textIndent: '0pt',
            textAlign: 'left'
         }
      });
      const location = record.location
         ? createElement('p', {
              text: record.location,
              style: {
                 paddingLeft: '10pt',
                 textIndent: '0pt',
                 textAlign: 'left'
              }
           })
         : null;

      container.appendChild(institution);
      container.appendChild(degree);
      container.appendChild(dates);
      if (location) {
         container.appendChild(location);
      }
      wrapper.appendChild(container);
   });

   return wrapper;
}

function createLanguages(languages = []) {
   if (!languages.length) {
      return null;
   }

   return createElement('p', {
      text: languages.join(', '),
      style: {
         paddingTop: '3pt',
         paddingLeft: '10pt',
         textIndent: '0pt',
         textAlign: 'left'
      }
   });
}

function createReferences(text = '') {
   if (!text) {
      return null;
   }

   return createElement('p', {
      text,
      style: {
         paddingTop: '3pt',
         paddingLeft: '10pt',
         textIndent: '0pt',
         textAlign: 'left'
      }
   });
}

function renderEditorControls(root) {
   const container = createElement('div', { className: 'editor-controls' });
   const editButton = createElement('button', {
      className: 'btn-primary',
      text: 'Edit CV'
   });

   const editorPanel = createEditorPanel();

   editButton.addEventListener('click', () => {
      handleEditClick(editorPanel);
   });

   container.appendChild(editButton);
   root.appendChild(container);
   root.appendChild(editorPanel);
}

function createEditorPanel() {
   const overlay = createElement('div', {
      className: 'editor-overlay hidden',
      attrs: { id: 'cv-editor-overlay' }
   });

   const panel = createElement('div', {
      className: 'editor-panel',
      attrs: { id: 'cv-editor-panel' }
   });

   const heading = createElement('h2', { text: 'Edit CV Data' });
   const form = createElement('form', {
      className: 'editor-form',
      attrs: { id: 'cv-editor-form' }
   });
   form.addEventListener('submit', (event) => {
      event.preventDefault();
   });
   const actions = createElement('div', { className: 'editor-actions' });
   const save = createElement('button', { text: 'Save changes' });
   const reset = createElement('button', { text: 'Reset to defaults' });
   const cancel = createElement('button', { text: 'Cancel' });
   const message = createElement('div', {
      className: 'editor-message',
      attrs: { id: 'editor-message' }
   });

   save.addEventListener('click', () => handleEditorSave(overlay));
   reset.addEventListener('click', () => handleEditorReset(overlay));
   cancel.addEventListener('click', () => hideEditorPanel(overlay));

   actions.appendChild(save);
   actions.appendChild(reset);
   actions.appendChild(cancel);

   panel.appendChild(heading);
   panel.appendChild(form);
   panel.appendChild(actions);
   panel.appendChild(message);

   overlay.appendChild(panel);

   overlay.addEventListener('click', (event) => {
      if (event.target === overlay) {
         hideEditorPanel(overlay);
      }
   });

   return overlay;
}

function handleHeadingEditClick(targetSection) {
   const panel = document.getElementById('cv-editor-overlay');
   if (!panel) {
      return;
   }
   handleEditClick(panel, targetSection);
}

function handleEditClick(panel, targetSection = null) {
   if (!isEditorAuthorized() && !authorizeEditor()) {
      return;
   }

   populateEditorPanel(panel, targetSection);
   panel.classList.remove('hidden');
   focusEditorSection(panel, targetSection);
}

function populateEditorPanel(panel, targetSection) {
   const form = panel.querySelector('#cv-editor-form');
   const message = panel.querySelector('#editor-message');
   if (form) {
      buildEditorForm(form, window.cvData || {}, targetSection);
   }
   if (message) {
      message.textContent = '';
      message.classList.remove('error', 'success');
   }
   if (panel) {
      panel.dataset.activeEditorSection = targetSection || '';
   }
   const heading = panel.querySelector('.editor-panel h2');
   if (heading) {
      heading.textContent = targetSection
         ? `Edit ${getSectionLabel(targetSection)}`
         : 'Edit CV Data';
   }
}

function buildEditorForm(form, data, targetSection) {
   const working = data ? cloneData(data) : {};
   form.innerHTML = '';

   const sections = [
      { key: 'summary', node: createSummaryEditor(working.summary) },
      { key: 'skills', node: createSkillsEditor(working.skills) },
      { key: 'experiences', node: createExperiencesEditor(working.experiences) },
      { key: 'certifications', node: createCertificationsEditor(working.certifications) },
      { key: 'education', node: createEducationEditor(working.education) },
      { key: 'languages', node: createLanguagesEditor(working.languages) }
   ];

   sections
      .filter(({ key, node }) => node && (!targetSection || key === targetSection))
      .forEach(({ node }) => {
         form.appendChild(node);
      });
}

function getSectionLabel(key) {
   const labels = {
      summary: 'Summary',
      skills: 'Skills',
      experiences: 'Professional Experiences',
      certifications: 'Certifications',
      education: 'Education',
      languages: 'Languages'
   };
   return labels[key] || 'CV Data';
}

function focusEditorSection(panel, targetSection) {
   if (!targetSection) {
      return;
   }
   const form = panel.querySelector('#cv-editor-form');
   if (!form) {
      return;
   }
   Array.from(form.querySelectorAll('.editor-section-target')).forEach((node) => {
      node.classList.remove('editor-section-target');
   });
   const section = form.querySelector(`[data-editor-section="${targetSection}"]`);
   if (!section) {
      return;
   }
   section.classList.add('editor-section-target');
   requestAnimationFrame(() => {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
   });
   window.setTimeout(() => {
      section.classList.remove('editor-section-target');
   }, 1600);
}

function createSummaryEditor(summary = '') {
   const section = createEditorSection('Summary');
   section.setAttribute('data-editor-section', 'summary');
   const textarea = createElement('textarea', {
      className: 'editor-input editor-summary',
      attrs: { name: 'summary', rows: '5', placeholder: 'Enter summary' }
   });
   textarea.value = summary || '';
   section.appendChild(createField('Summary', textarea));
   return section;
}

function createSkillsEditor(skills = []) {
   const section = createEditorSection('Skills');
   section.setAttribute('data-editor-section', 'skills');
   const list = createElement('div', { className: 'editor-collection', attrs: { 'data-collection': 'skills' } });
   const entries = Array.isArray(skills) && skills.length ? skills : [{}];
   entries.forEach((skill) => {
      list.appendChild(createSkillEditorItem(skill));
   });

   const addButton = createElement('button', {
      className: 'editor-add',
      text: 'Add skill',
      attrs: { type: 'button' }
   });
   addButton.addEventListener('click', () => {
      list.appendChild(createSkillEditorItem());
   });

   section.appendChild(list);
   section.appendChild(addButton);
   return section;
}

function createSkillEditorItem(skill = {}) {
   const item = createElement('div', { className: 'editor-item skill-editor' });

   const categoryInput = createElement('input', {
      className: 'editor-input skill-category',
      attrs: { type: 'text', placeholder: 'Category' }
   });
   categoryInput.value = skill.category || '';

   const itemsTextarea = createElement('textarea', {
      className: 'editor-input skill-items',
      attrs: { rows: '3', placeholder: 'One item per line' }
   });
   itemsTextarea.value = Array.isArray(skill.items) ? skill.items.join('\n') : '';

   const ratingInput = createElement('input', {
      className: 'editor-input skill-rating',
      attrs: { type: 'number', min: '0', max: '5', step: '1', placeholder: '0-5' }
   });
   if (skill.rating !== undefined && skill.rating !== null) {
      ratingInput.value = String(skill.rating);
   }

   item.appendChild(createField('Category', categoryInput));
   item.appendChild(createField('Items', itemsTextarea));
   item.appendChild(createField('Rating', ratingInput));
   item.appendChild(createRemoveButton(() => item.remove(), 'Remove skill'));

   return item;
}

function createExperiencesEditor(experiences = []) {
   const section = createEditorSection('Experiences');
   section.setAttribute('data-editor-section', 'experiences');
   const list = createElement('div', { className: 'editor-collection', attrs: { 'data-collection': 'experiences' } });
   const entries = Array.isArray(experiences) && experiences.length ? experiences : [{}];
   entries.forEach((experience) => {
      list.appendChild(createExperienceEditorItem(experience));
   });

   const addButton = createElement('button', {
      className: 'editor-add',
      text: 'Add experience',
      attrs: { type: 'button' }
   });
   addButton.addEventListener('click', () => {
      list.appendChild(createExperienceEditorItem());
   });

   section.appendChild(list);
   section.appendChild(addButton);
   return section;
}

function createExperienceEditorItem(experience = {}) {
   const item = createElement('div', { className: 'editor-item experience-editor' });

   const titleInput = createElement('input', {
      className: 'editor-input experience-title',
      attrs: { type: 'text', placeholder: 'Title' }
   });
   titleInput.value = experience.title || '';

   const employmentInput = createElement('input', {
      className: 'editor-input experience-employmentType',
      attrs: { type: 'text', placeholder: 'Employment type (optional)' }
   });
   employmentInput.value = experience.employmentType || '';

   const companyInput = createElement('input', {
      className: 'editor-input experience-company',
      attrs: { type: 'text', placeholder: 'Company' }
   });
   companyInput.value = experience.company || '';

   const dateInput = createElement('input', {
      className: 'editor-input experience-dateLabel',
      attrs: { type: 'text', placeholder: 'Date label' }
   });
   dateInput.value = experience.dateLabel || '';

   const locationInput = createElement('input', {
      className: 'editor-input experience-location',
      attrs: { type: 'text', placeholder: 'Location' }
   });
   locationInput.value = experience.location || '';

   item.appendChild(createField('Title', titleInput));
   item.appendChild(createField('Employment type', employmentInput));
   item.appendChild(createField('Company', companyInput));
   item.appendChild(createField('Date label', dateInput));
   item.appendChild(createField('Location', locationInput));

   const sectionsHeading = createElement('h4', {
      className: 'editor-subheading',
      text: 'Sections'
   });
   item.appendChild(sectionsHeading);

   const sectionsList = createElement('div', {
      className: 'editor-subcollection',
      attrs: { 'data-collection': 'experience-sections' }
   });
   const sections = Array.isArray(experience.sections) && experience.sections.length ? experience.sections : [{}];
   sections.forEach((section) => {
      sectionsList.appendChild(createExperienceSectionEditor(section));
   });

   const addSectionButton = createElement('button', {
      className: 'editor-add editor-add-nested',
      text: 'Add section',
      attrs: { type: 'button' }
   });
   addSectionButton.addEventListener('click', () => {
      sectionsList.appendChild(createExperienceSectionEditor());
   });

   item.appendChild(sectionsList);
   item.appendChild(addSectionButton);
   item.appendChild(createRemoveButton(() => item.remove(), 'Remove experience'));

   return item;
}

function createExperienceSectionEditor(section = {}) {
   const container = createElement('div', { className: 'editor-subitem experience-section-editor' });

   const headingInput = createElement('input', {
      className: 'editor-input experience-section-heading',
      attrs: { type: 'text', placeholder: 'Heading (optional)' }
   });
   headingInput.value = section.heading || '';

   const itemsTextarea = createElement('textarea', {
      className: 'editor-input experience-section-items',
      attrs: { rows: '3', placeholder: 'One bullet per line' }
   });
   itemsTextarea.value = Array.isArray(section.items) ? section.items.join('\n') : '';

   container.appendChild(createField('Heading', headingInput));
   container.appendChild(createField('Items', itemsTextarea));
   container.appendChild(createRemoveButton(() => container.remove(), 'Remove section'));

   return container;
}

function createCertificationsEditor(certifications = []) {
   const section = createEditorSection('Certifications');
   section.setAttribute('data-editor-section', 'certifications');
   const list = createElement('div', { className: 'editor-collection', attrs: { 'data-collection': 'certifications' } });
   const entries = Array.isArray(certifications) && certifications.length ? certifications : [{}];
   entries.forEach((cert) => {
      list.appendChild(createCertificationEditorItem(cert));
   });

   const addButton = createElement('button', {
      className: 'editor-add',
      text: 'Add certification',
      attrs: { type: 'button' }
   });
   addButton.addEventListener('click', () => {
      list.appendChild(createCertificationEditorItem());
   });

   section.appendChild(list);
   section.appendChild(addButton);
   return section;
}

function createCertificationEditorItem(certification = {}) {
   const item = createElement('div', { className: 'editor-item certification-editor' });

   const titleInput = createElement('input', {
      className: 'editor-input certification-title',
      attrs: { type: 'text', placeholder: 'Title' }
   });
   titleInput.value = certification.title || '';

   const issuerInput = createElement('input', {
      className: 'editor-input certification-issuer',
      attrs: { type: 'text', placeholder: 'Issuer (optional)' }
   });
   issuerInput.value = certification.issuer || '';

   const dateInput = createElement('input', {
      className: 'editor-input certification-date',
      attrs: { type: 'text', placeholder: 'Date (optional)' }
   });
   dateInput.value = certification.date || '';

   item.appendChild(createField('Title', titleInput));
   item.appendChild(createField('Issuer', issuerInput));
   item.appendChild(createField('Date', dateInput));
   item.appendChild(createRemoveButton(() => item.remove(), 'Remove certification'));

   return item;
}

function createEducationEditor(education = []) {
   const section = createEditorSection('Education');
   section.setAttribute('data-editor-section', 'education');
   const list = createElement('div', { className: 'editor-collection', attrs: { 'data-collection': 'education' } });
   const entries = Array.isArray(education) && education.length ? education : [{}];
   entries.forEach((record) => {
      list.appendChild(createEducationEditorItem(record));
   });

   const addButton = createElement('button', {
      className: 'editor-add',
      text: 'Add education',
      attrs: { type: 'button' }
   });
   addButton.addEventListener('click', () => {
      list.appendChild(createEducationEditorItem());
   });

   section.appendChild(list);
   section.appendChild(addButton);
   return section;
}

function createEducationEditorItem(record = {}) {
   const item = createElement('div', { className: 'editor-item education-editor' });

   const institutionInput = createElement('input', {
      className: 'editor-input education-institution',
      attrs: { type: 'text', placeholder: 'Institution' }
   });
   institutionInput.value = record.institution || '';

   const degreeInput = createElement('input', {
      className: 'editor-input education-degree',
      attrs: { type: 'text', placeholder: 'Degree (optional)' }
   });
   degreeInput.value = record.degree || '';

   const datesInput = createElement('input', {
      className: 'editor-input education-dates',
      attrs: { type: 'text', placeholder: 'Dates (optional)' }
   });
   datesInput.value = record.dates || '';

   const locationInput = createElement('input', {
      className: 'editor-input education-location',
      attrs: { type: 'text', placeholder: 'Location (optional)' }
   });
   locationInput.value = record.location || '';

   item.appendChild(createField('Institution', institutionInput));
   item.appendChild(createField('Degree', degreeInput));
   item.appendChild(createField('Dates', datesInput));
   item.appendChild(createField('Location', locationInput));
   item.appendChild(createRemoveButton(() => item.remove(), 'Remove education'));

   return item;
}

function createLanguagesEditor(languages = []) {
   const section = createEditorSection('Languages');
   section.setAttribute('data-editor-section', 'languages');
   const textarea = createElement('textarea', {
      className: 'editor-input editor-languages',
      attrs: { rows: '3', placeholder: 'One language per line', name: 'languages' }
   });
   textarea.value = Array.isArray(languages) ? languages.join('\n') : '';
   section.appendChild(createField('Languages', textarea));
   return section;
}

function createEditorSection(title) {
   const section = createElement('section', { className: 'editor-section' });
   const heading = createElement('h3', {
      className: 'editor-section-title',
      text: title
   });
   section.appendChild(heading);
   return section;
}

function createField(labelText, control) {
   const wrapper = createElement('label', { className: 'editor-field' });
   const label = createElement('span', {
      className: 'editor-label',
      text: labelText
   });
   wrapper.appendChild(label);
   wrapper.appendChild(control);
   return wrapper;
}

function createRemoveButton(handler, label = 'Remove') {
   const button = createElement('button', {
      className: 'editor-remove',
      text: label,
      attrs: { type: 'button' }
   });
   button.addEventListener('click', handler);
   return button;
}

function collectEditorData(form) {
   const base = window.cvData ? cloneData(window.cvData) : {};

   const summary = readSummary(form);
   if (summary.present) {
      base.summary = summary.value;
   }

   const skills = readSkills(form);
   if (skills.present) {
      base.skills = skills.value;
   }

   const experiences = readExperiences(form);
   if (experiences.present) {
      base.experiences = experiences.value;
   }

   const certifications = readCertifications(form);
   if (certifications.present) {
      base.certifications = certifications.value;
   }

   const education = readEducation(form);
   if (education.present) {
      base.education = education.value;
   }

   const languages = readLanguages(form);
   if (languages.present) {
      base.languages = languages.value;
   }

   return base;
}

function readSummary(form) {
   const textarea = form.querySelector('textarea[name="summary"]');
   if (!textarea) {
      return { present: false, value: null };
   }
   return { present: true, value: textarea.value.trim() };
}

function readSkills(form) {
   const container = form.querySelector('[data-collection="skills"]');
   if (!container) {
      return { present: false, value: null };
   }

   const value = Array.from(form.querySelectorAll('.skill-editor')).map((node, index) => {
      const category = getInputValue(node, '.skill-category');
      const items = splitLines(getTextValue(node, '.skill-items'));
      const ratingRaw = getInputValue(node, '.skill-rating');
      const rating = ratingRaw === '' ? 0 : Number(ratingRaw);
      if (ratingRaw !== '' && (!Number.isFinite(rating) || rating < 0)) {
         throw new Error(`Skill #${index + 1} rating must be zero or a positive number`);
      }

      if (!category && !items.length && ratingRaw === '') {
         return null;
      }

      return {
         category,
         items,
         rating
      };
   }).filter(Boolean);

   return { present: true, value };
}

function readExperiences(form) {
   const container = form.querySelector('[data-collection="experiences"]');
   if (!container) {
      return { present: false, value: null };
   }

   const value = Array.from(form.querySelectorAll('.experience-editor'))
      .map((node, index) => {
         const title = getInputValue(node, '.experience-title');
         const employmentType = getInputValue(node, '.experience-employmentType');
         const company = getInputValue(node, '.experience-company');
         const dateLabel = getInputValue(node, '.experience-dateLabel');
         const location = getInputValue(node, '.experience-location');

         const sections = Array.from(node.querySelectorAll('.experience-section-editor'))
            .map((sectionNode, sectionIndex) => {
               const heading = getInputValue(sectionNode, '.experience-section-heading');
               const itemsText = getTextValue(sectionNode, '.experience-section-items');
               const items = splitLines(itemsText);

               if (!heading && !items.length) {
                  return null;
               }
               if (!items.length) {
                  throw new Error(`Experience #${index + 1} section #${sectionIndex + 1} must include at least one item`);
               }

               return {
                  heading: heading || undefined,
                  items
               };
            })
            .filter(Boolean);

         const hasTopLevelFields = [title, employmentType, company, dateLabel, location].some(Boolean);
         if (!hasTopLevelFields && !sections.length) {
            return null;
         }

         return {
            title,
            employmentType: employmentType || undefined,
            company: company || undefined,
            dateLabel: dateLabel || undefined,
            location: location || undefined,
            sections
         };
      })
      .filter(Boolean);

   return { present: true, value };
}

function readCertifications(form) {
   const container = form.querySelector('[data-collection="certifications"]');
   if (!container) {
      return { present: false, value: null };
   }

   const value = Array.from(form.querySelectorAll('.certification-editor'))
      .map((node) => {
         const title = getInputValue(node, '.certification-title');
         const issuer = getInputValue(node, '.certification-issuer');
         const date = getInputValue(node, '.certification-date');

         if (!title && !issuer && !date) {
            return null;
         }

         return {
            title,
            issuer: issuer || undefined,
            date: date || undefined
         };
      })
      .filter(Boolean);

   return { present: true, value };
}

function readEducation(form) {
   const container = form.querySelector('[data-collection="education"]');
   if (!container) {
      return { present: false, value: null };
   }

   const value = Array.from(form.querySelectorAll('.education-editor'))
      .map((node) => {
         const institution = getInputValue(node, '.education-institution');
         const degree = getInputValue(node, '.education-degree');
         const dates = getInputValue(node, '.education-dates');
         const location = getInputValue(node, '.education-location');

         if (!institution && !degree && !dates && !location) {
            return null;
         }

         return {
            institution,
            degree: degree || undefined,
            dates: dates || undefined,
            location: location || undefined
         };
      })
      .filter(Boolean);

   return { present: true, value };
}

function readLanguages(form) {
   const textarea = form.querySelector('.editor-languages');
   if (!textarea) {
      return { present: false, value: null };
   }
   return { present: true, value: splitLines(textarea.value) };
}

function getInputValue(root, selector) {
   const node = root.querySelector(selector);
   return node && 'value' in node ? node.value.trim() : '';
}

function getTextValue(root, selector) {
   const node = root.querySelector(selector);
   return node && 'value' in node ? node.value : '';
}

function splitLines(text) {
   if (!text) {
      return [];
   }
   return text
      .split(/\r?\n/)
      .map((entry) => entry.trim())
      .filter(Boolean);
}

function handleEditorSave(panel) {
   const form = panel.querySelector('#cv-editor-form');
   const message = panel.querySelector('#editor-message');

   let parsed;
   try {
      if (!form) {
         throw new Error('Editor form not found');
      }
      parsed = collectEditorData(form);
      validateCvData(parsed);
   } catch (error) {
      showEditorMessage(message, error.message || 'Unable to save changes', true);
      return;
   }

   localStorage.setItem(STORAGE_KEYS.override, JSON.stringify(parsed));
   hideEditorPanel(panel);
   renderCv(parsed);
}

function handleEditorReset(panel) {
   localStorage.removeItem(STORAGE_KEYS.override);
   hideEditorPanel(panel);
   const base = window.originalCvData ? cloneData(window.originalCvData) : window.cvData;
   renderCv(base);
}

function hideEditorPanel(panel) {
   panel.classList.add('hidden');
}

function showEditorMessage(node, text, isError) {
   if (!node) {
      return;
   }
   node.textContent = text;
   node.classList.remove('error', 'success');
   node.classList.add(isError ? 'error' : 'success');
}

function isEditorAuthorized() {
   return sessionStorage.getItem(STORAGE_KEYS.auth) === 'true';
}

function authorizeEditor() {
   const username = window.prompt('Enter editor username');
   if (username === null) {
      return false;
   }
   const password = window.prompt('Enter editor password');
   if (password === null) {
      return false;
   }

   if (username === EDIT_CREDENTIALS.username && password === EDIT_CREDENTIALS.password) {
      sessionStorage.setItem(STORAGE_KEYS.auth, 'true');
      return true;
   }

   window.alert('Invalid credentials');
   return false;
}

function cloneData(data) {
   return JSON.parse(JSON.stringify(data));
}

function getStoredOverride() {
   const raw = localStorage.getItem(STORAGE_KEYS.override);
   if (!raw) {
      return null;
   }
   try {
      const parsed = JSON.parse(raw);
      validateCvData(parsed);
      return parsed;
   } catch (error) {
      console.warn('Invalid stored CV override removed:', error);
      localStorage.removeItem(STORAGE_KEYS.override);
      return null;
   }
}

function validateCvData(data) {
   if (typeof data !== 'object' || data === null) {
      throw new Error('CV data must be an object');
   }

   const requiredKeys = ['profile', 'summary', 'skills', 'experiences'];
   requiredKeys.forEach((key) => {
      if (!(key in data)) {
         throw new Error(`Missing key: ${key}`);
      }
   });

   if (!data.profile || typeof data.profile !== 'object') {
      throw new Error('Profile must be an object');
   }
   if (!Array.isArray(data.profile.contacts) || !data.profile.contacts.length) {
      throw new Error('Profile contacts must include entries');
   }
   if (typeof data.summary !== 'string' || !data.summary.trim()) {
      throw new Error('Summary must be a non-empty string');
   }
   if (!Array.isArray(data.skills) || !data.skills.length) {
      throw new Error('Skills must include entries');
   }
   if (!Array.isArray(data.experiences) || !data.experiences.length) {
      throw new Error('Experiences must include entries');
   }

   data.experiences.forEach((experience, index) => {
      if (!experience || typeof experience !== 'object') {
         throw new Error(`Experience #${index + 1} must be an object`);
      }
      if (!experience.title) {
         throw new Error(`Experience #${index + 1} is missing a title`);
      }
      if (!Array.isArray(experience.sections) || !experience.sections.length) {
         throw new Error(`Experience #${index + 1} must include sections`);
      }
   });
}

function createRule() {
   const hr = document.createElement('hr');
   hr.setAttribute('size', '1');
   hr.setAttribute('noshade', '');
   return hr;
}

function createBreak() {
   return document.createElement('br');
}

function createElement(tag, options = {}) {
   const element = document.createElement(tag);
   const { className, text, html, attrs = {}, style = {} } = options;

   if (className) {
      element.className = className;
   }
   if (text !== undefined) {
      element.textContent = text;
   }
   if (html !== undefined) {
      element.innerHTML = html;
   }

   Object.entries(attrs).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
         element.setAttribute(key, value);
      }
   });

   Object.entries(style).forEach(([key, value]) => {
      if (value !== undefined && value !== null && element.style) {
         element.style[key] = value;
      }
   });

   return element;
}

function formatRating(rating) {
   const count = Number.isFinite(rating) ? Math.max(0, rating) : 0;
   return RATING_SYMBOL.repeat(count);
}

document.addEventListener('DOMContentLoaded', () => {
   loadCvData()
      .then((data) => {
         renderCv(data);
      })
      .catch((error) => {
         console.error('Failed to load CV data', error);
         renderError('We could not load the CV data file.');
      });
});
