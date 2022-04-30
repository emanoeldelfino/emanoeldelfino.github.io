const selectors = [
  "a[href='#about']", "a[href='#projects']", "a[href='#contact']",
  "#about h1", "#about h2", "#projects h2", ".project-tile:nth-child(1) p",
  ".project-tile:nth-child(2) p", ".project-tile:nth-child(3) p", ".project-tile:nth-child(4) p", ".project-tile:nth-child(5) p", ".project-tile:nth-child(6) p", "#contact h2", "footer p"
];

const selectorElems = selectors.map(selector => document.querySelector(selector));

const jsonKeys = [
  "about", "projects", "contact", "about-h1", "about-h2", "projects-h2", "projects-p1", "projects-p2", "projects-p3", "projects-p4", "projects-p5",
  "projects-p6", "contact-h2", "footer"
]

const flagIcon = document.querySelector(".flag");
const root = document.documentElement;

let lang, pt, en;
fetch("./language/pt.json")
  .then(response => response.json())
  .then(json => {
    pt = json;
    lang = pt;
})

fetch("./language/en.json")
  .then(response => response.json())
  .then(json => {
    en = json;
})

flagIcon.addEventListener("click", () => {
  if (flagIcon.src.includes("us")) {
    flagIcon.src = "images/br.svg";
    lang = en;
    root.style.setProperty("--typewriterChars", 18);
  } else {
    flagIcon.src = "images/us.svg";
    lang = pt;
    root.style.setProperty("--typewriterChars", 17);
  }
  selectorElems.forEach((selectorElem, index) => {
    selectorElem.innerHTML = lang[jsonKeys[index]];
  })
});
