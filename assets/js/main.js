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

function myFunction() {
   document.body.classList.toggle('dark-mode');
}

async function loadCvData() {
   const response = await fetch(CV_DATA_PATH, { cache: 'no-cache' });
   if (!response.ok) {
      throw new Error(`HTTP ${response.status} fetching ${CV_DATA_PATH}`);
   }
   return response.json();
}

function renderCv(data) {
   const root = document.getElementById('cv-root');
   if (!root) {
      return;
   }

   root.innerHTML = '';
   root.appendChild(buildHeader(data.profile));

   appendSection(root, 'WHO AM I', () => createSummary(data.summary));
   appendSection(root, 'SKILLS', () => createSkills(data.skills));
   appendSection(root, 'PROFESSIONAL EXPERIENCES', () => createExperienceSection(data.experiences));
   appendSection(root, 'CERTIFICATIONS', () => createCertifications(data.certifications));
   appendSection(root, 'EDUCATION', () => createEducation(data.education));
   appendSection(root, 'LANGUAGES', () => createLanguages(data.languages));
   appendSection(root, 'REFERENCES', () => createReferences(data.references));

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

function appendSection(root, title, builder) {
   const fragment = document.createDocumentFragment();
   fragment.appendChild(createSectionHeading(title));
   fragment.appendChild(createRule());
   const content = builder ? builder() : null;
   if (content) {
      fragment.appendChild(content);
   }
   fragment.appendChild(createBreak());
   root.appendChild(fragment);
}

function createSectionHeading(title) {
   const wrapper = createElement('div', { className: 'heading-row' });
   const heading = createElement('h1', {
      className: 'heading1',
      text: title
   });
   wrapper.appendChild(heading);

   const normalizedTitle = (title || '').toLowerCase();
   if (normalizedTitle.includes('professional experience')) {
      const button = createElement('button', {
         className: 'btn-link',
         text: 'Expand all',
         attrs: { type: 'button', id: 'experience-toggle' }
      });
      wrapper.appendChild(button);
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
