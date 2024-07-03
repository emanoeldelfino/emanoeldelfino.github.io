const jsonKeysWithTextSelector = {
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
  "projects-p5":".project-tile:nth-child(5) p", 
  "projects-p6": ".project-tile:nth-child(6) p", 
  "contact-h2": "#contact h2"
};

const jsonKeysWithSelector = Object.entries(jsonKeysWithTextSelector).map(([jsonKey, selectorText]) => {
  return {
    jsonKey: jsonKey,
    selector: document.querySelector(selectorText)
  };
});

const brazilFlagIcon = document.querySelector(".br-flag");
const unitedStatesFlagIcon = document.querySelector(".us-flag");
const spainFlagIcon = document.querySelector(".es-flag");
const documentRoot = document.documentElement;

let portugueseJson, englishJson, spanishJson, selectedLanguageJson;

function setLanguage(languageJson) {
  if (selectedLanguageJson === languageJson)
    return;

  selectedLanguageJson = languageJson;

  documentRoot.style.setProperty("--typewriterChars", languageJson["about-h1"].length);

  jsonKeysWithSelector.forEach((item) => {
    item.selector.innerHTML = languageJson[item.jsonKey];
  })
}

fetch("./language/pt.json")
  .then(response => response.json())
  .then(json => {
    portugueseJson = json;
  })
  .then(() => {
    setLanguage(portugueseJson);
  })

fetch("./language/en.json")
  .then(response => response.json())
  .then(json => {
    englishJson = json;
  })

fetch("./language/es.json")
.then(response => response.json())
.then(json => {
  spanishJson = json;
})

brazilFlagIcon.addEventListener("click", () => setLanguage(portugueseJson));
unitedStatesFlagIcon.addEventListener("click", () => setLanguage(englishJson));
spainFlagIcon.addEventListener("click", () => setLanguage(spanishJson));

document.querySelector('.hamburger-menu').addEventListener('click', () => {
  let navLinks = document.querySelector('.nav-links');

  navLinks.style.display = navLinks.style.display === 'block' ? 'none' : 'block';
});
