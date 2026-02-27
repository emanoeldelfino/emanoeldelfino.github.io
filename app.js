const jsonKeysWithTextSelector = {
  "title": "title",
  "about": "a[href='#about']",
  "projects": "a[href='#projects']",
  "contact": "a[href='#contact']",
  "about-h1": "#about h1",
  "about-h2": "#about h2",
  "projects-h2": "#projects h2",
  "projects-p1": ".project-tile:nth-child(1) p",
  "projects-p2": ".project-tile:nth-child(2) p",
  "projects-p3": ".project-tile:nth-child(3) p",
  "projects-p4": ".project-tile:nth-child(4) p",
  "projects-p5": ".project-tile:nth-child(5) p",
  "projects-p6": ".project-tile:nth-child(6) p",
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

function setLanguage(languageJson) {
  if (selectedLanguageJson === languageJson)
    return;

  selectedLanguageJson = languageJson;

  documentRoot.style.setProperty("--typewriterChars", languageJson["about-h1"].length);

  jsonKeysWithSelector.forEach((item) => {
    if (item.selector === null)
      return;

    item.selector.innerHTML = languageJson[item.jsonKey];
  })
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
    setLanguage(langJson[lang]);
    window.location.hash = `#/${lang}`;
    return;
  }

  fetch(`./language/${lang}.json`)
    .then(response => response.json())
    .then(json => {
      langJson[lang] = json;
      setLanguage(langJson[lang]);
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

document.querySelector('.hamburger-menu').addEventListener('click', () => {
  let navLinks = document.querySelector('.nav-links');

  navLinks.style.display = navLinks.style.display === 'block' ? 'none' : 'block';
});
