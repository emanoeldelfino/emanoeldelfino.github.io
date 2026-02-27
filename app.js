const jsonKeysWithTextSelector = {
  "title": "title",
  "about": "a[href='#about']",
  "projects": "a[href='#projects']",
  "contact": "a[href='#contact']",
  "about-h1": "#about h1",
  "about-h2": "#about h2",
  "projects-h2": "#projects h2",
  "contact-h2": "#contact h2"
};

const jsonKeysWithSelector = Object.entries(jsonKeysWithTextSelector).map(([jsonKey, selectorText]) => {
  return {
    jsonKey: jsonKey,
    selector: document.querySelector(selectorText)
  };
});

const documentRoot = document.documentElement;

let selectedLanguageJson;

function setLanguage(languageJson, langCode) {
  if (selectedLanguageJson === languageJson)
    return;

  selectedLanguageJson = languageJson;

  documentRoot.style.setProperty("--typewriterChars", languageJson["about-h1"].length);

  jsonKeysWithSelector.forEach((item) => {
    if (item.selector === null)
      return;

    item.selector.innerHTML = languageJson[item.jsonKey];
  });

  if (window.projectsConfig) {
    const projectTitles = document.querySelectorAll('.project-tile p');
    projectTitles.forEach((p, index) => {
      const proj = window.projectsConfig[index];
      if (proj && proj.title[langCode]) {
        p.textContent = proj.title[langCode];
      }
    });
  }
}

let langJson = {};

function getFlag(lang) {
  switch (lang) {
    case "pt":
      return "br"
    case "en":
      return "us"
    default:
      return lang
  }
}

const hash = window.location.hash;

let language = "pt";

if (hash === "#/es") {
  language = "es";
} else if (hash === "#/en") {
  language = "en";
}

function loadAndSetLanguage(lang) {
  if (langJson[lang]) {
    setLanguage(langJson[lang], lang);
    window.location.hash = `#/${lang}`;
    return;
  }

  fetch(`./language/${lang}.json`)
    .then(response => response.json())
    .then(json => {
      langJson[lang] = json;
      setLanguage(langJson[lang], lang);
      window.location.hash = `#/${lang}`;
    })
    .catch((error) => {
      console.error(`Could not load ${lang}.json file:`, error);
    });
}

// Load initial language
loadAndSetLanguage(language);

// Set up event listeners for flags
["pt", "en", "es"].forEach((lang) => {
  let flag = getFlag(lang);
  let flagIcon = document.querySelector(`.${flag}-flag`);

  if (flagIcon === null)
    return;

  flagIcon.addEventListener("click", () => {
    loadAndSetLanguage(lang);
  });
});

// Fetch projects config and render HTML blocks dynamically
fetch('./projects.json')
  .then(response => response.json())
  .then(projects => {
    window.projectsConfig = projects;

    const projectsGrid = document.querySelector('.projects-grid');
    projectsGrid.innerHTML = '';

    projects.forEach(project => {
      const tile = document.createElement('div');
      tile.className = 'project-tile';

      const link = document.createElement('a');
      link.href = project.link;
      link.target = '_blank';

      const img = document.createElement('img');
      img.src = project.image;
      img.alt = project.alt;

      const p = document.createElement('p');

      link.appendChild(img);
      link.appendChild(p);
      tile.appendChild(link);
      projectsGrid.appendChild(tile);
    });

    if (selectedLanguageJson) {
      const currentLang = Object.keys(langJson).find(key => langJson[key] === selectedLanguageJson);
      const savedLangJson = selectedLanguageJson;
      selectedLanguageJson = null;
      setLanguage(savedLangJson, currentLang);
    }
  })
  .catch(error => console.error('Error loading projects:', error));

document.querySelector('.hamburger-menu').addEventListener('click', () => {
  let navLinks = document.querySelector('.nav-links');

  navLinks.style.display = navLinks.style.display === 'block' ? 'none' : 'block';
});
