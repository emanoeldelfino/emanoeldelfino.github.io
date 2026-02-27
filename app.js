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
    // Projects are dynamically loaded, so titles now come from fetched HTML
    // Translation logic is not applied here anymore since titles use the raw document <title>
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
  .then(projectLinks => {
    window.projectsConfig = projectLinks;

    const projectsGrid = document.querySelector('.projects-grid');
    projectsGrid.innerHTML = '';

    projectLinks.forEach(projectLink => {
      const tile = document.createElement('div');
      tile.className = 'project-tile';

      const link = document.createElement('a');
      link.href = projectLink;
      link.target = '_blank';

      const img = document.createElement('img');
      img.alt = "Loading Project Image...";
      // Fallback service placeholder until we resolve og:image
      img.src = `https://api.microlink.io/?url=${encodeURIComponent(projectLink)}&screenshot=true&meta=false&embed=screenshot.url`;

      const paragraph = document.createElement('p');
      paragraph.textContent = "Loading...";

      link.appendChild(img);
      link.appendChild(paragraph);
      tile.appendChild(link);
      projectsGrid.appendChild(tile);

      // Dynamically fetch the project's HTML to extract title and og:image
      fetch(projectLink)
        .then(res => res.text())
        .then(html => {
          const parser = new DOMParser();
          const doc = parser.parseFromString(html, 'text/html');

          // 1. Extract Title
          const titleElement = doc.querySelector('title');
          if (titleElement) {
            paragraph.textContent = titleElement.textContent;
          } else {
            paragraph.textContent = projectLink.split('/').pop(); // fallback to path
          }

          // 2. Extract og:image
          const ogImageElement = doc.querySelector('meta[property="og:image"]');
          if (ogImageElement && ogImageElement.content) {
            // Overwrite microlink screenshot with native OG image
            let imgUrl = ogImageElement.content;
            if (!imgUrl.startsWith("http")) {
              imgUrl = `${projectLink.replace(/\/$/, '')}/${imgUrl.replace(/^\//, '')}`;
            }
            img.src = imgUrl;
            img.alt = paragraph.textContent;
          }
        })
        .catch(err => {
          console.error(`Failed to fetch metadata for ${projectLink}:`, err);
          paragraph.textContent = projectLink.split('/').pop(); // fallback title
        });
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
