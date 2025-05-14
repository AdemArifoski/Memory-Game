function changeToEasyDifficulty() {
  window.location.assign("./easy-difficulty.html");
}

function changeToMediumDifficulty() {
  window.location.assign("./medium-difficulty.html");
}

function changeToHardDifficulty() {
  window.location.assign("./hard-difficulty.html");
}

document.getElementById("easyButton").addEventListener("click", function() {
  document.getElementById("optionsForEasyDifficulty").classList.add("show");
  document.getElementById("optionsForMediumDifficulty").classList.remove("show");
  document.getElementById("optionsForHardDifficulty").classList.remove("show");
});

document.getElementById("mediumButton").addEventListener("click", function() {
  document.getElementById("optionsForMediumDifficulty").classList.add("show");
  document.getElementById("optionsForEasyDifficulty").classList.remove("show");
  document.getElementById("optionsForHardDifficulty").classList.remove("show");
});

document.getElementById("hardButton").addEventListener("click", function() {
  document.getElementById("optionsForHardDifficulty").classList.add("show");
  document.getElementById("optionsForEasyDifficulty").classList.remove("show");
  document.getElementById("optionsForMediumDifficulty").classList.remove("show");
});






// Show the settings panel when the settings icon is clicked
const settingsIcon = document.querySelector(".settingsIcon");
if (settingsIcon) {
  settingsIcon.addEventListener("click", function () {
    document.getElementById("settingsPanel").style.display = "block";
  });
}

// Hide the settings panel when the close button is clicked
document.querySelector(".closeButton").addEventListener("click", function () {
  document.getElementById("settingsPanel").style.display = "none";
  
});



const translations = {
  en: {
    preSettings: "Settings",
    settingsTitle: "Settings",
    languageLabel: "Language",
    languageOptions: {
      en: "English",
      de: "German",
      fr: "French"
    },
    selectDifficulty: "Select Difficulty",
    hardDifficulty: "Hard",
    mediumDifficulty: "Medium",
    easyDifficulty: "Easy",
    selectTopic: "Select Topic",
    selectNumber: "Numbers"
    
  },
  de: {
    preSettings: "Einstellungen",
    settingsTitle: "Einstellungen",
    languageLabel: "Sprache",
    languageOptions: {
      en: "Englisch",
      de: "Deutsch",
      fr: "Französisch"
    },
    selectDifficulty: "Schwierigkeitsgrad",
    hardDifficulty: "Schwierig",
    mediumDifficulty: "Mittel",
    easyDifficulty: "Einfach",
    selectTopic: "Thema auswählen",
    selectNumber: "Zahlen"
  },
  fr: {
    preSettings: "Paramètres",
    settingsTitle: "Paramètres",
    languageLabel: "Langue",
    languageOptions: {
      en: "Anglais",
      de: "Allemand",
      fr: "Français"
    },
    selectDifficulty: "Sélectionner difficulté",
    hardDifficulty: "Difficile",
    mediumDifficulty: "Moyenne",
    easyDifficulty: "Facile",
    selectTopic: "Sélectionner un sujet",
    selectNumber: "Nombres"
  }
};

const languageSelect = document.querySelector("select");
let preSeting = document.getElementById("preSettings");
let settings = document.getElementById("settings");
let langLabel = document.getElementById("languageLabel");
let langOptionEN = document.getElementById("en");
let langOptionDE = document.getElementById("de");
let langOptionFR = document.getElementById("fr");
let selectDifficulty = document.getElementById("selectDifficulty");
let hard = document.getElementById("hardButton");
let medium = document.getElementById("mediumButton");
let easy = document.getElementById("easyButton");
const selectTopics = [
  document.getElementById("selectTopic1"),
  document.getElementById("selectTopic2"),
  document.getElementById("selectTopic3")
];
let numbers = document.getElementById("numbers");


languageSelect.addEventListener("change", (e) => {
  setLanguage(e.target.value)
});

const setLanguage = (language) => {
  if(language == "en") {
    preSeting.childNodes[0].nodeValue = translations.en.preSettings + " ";
    settings.innerText = translations.en.settingsTitle;
    langLabel.innerText = translations.en.languageLabel;
    langOptionEN.innerText = translations.en.languageOptions.en;
    langOptionDE.innerText = translations.en.languageOptions.de;
    langOptionFR.innerText = translations.en.languageOptions.fr;
    selectDifficulty.innerText =translations.en.selectDifficulty;
    hard.innerText = translations.en.hardDifficulty;
    medium.innerHTML = translations.en.mediumDifficulty;
    easy.innerHTML = translations.en.easyDifficulty;
    selectTopics.forEach(selectTopic => {
      selectTopic.innerText = translations.en.selectTopic;
    });
    numbers.innerText = translations.en.selectNumber;

  } else if(language == "de"){
    preSeting.childNodes[0].nodeValue = translations.de.preSettings + " ";
    settings.innerText = translations.de.settingsTitle;
    langLabel.innerText = translations.de.languageLabel;
    langOptionEN.innerText = translations.de.languageOptions.en;
    langOptionDE.innerText = translations.de.languageOptions.de;
    langOptionFR.innerText = translations.de.languageOptions.fr;
    selectDifficulty.innerText =translations.de.selectDifficulty;
    hard.innerText = translations.de.hardDifficulty;
    medium.innerHTML = translations.de.mediumDifficulty;
    easy.innerHTML = translations.de.easyDifficulty;
    selectTopics.forEach(selectTopic => {
      selectTopic.innerText = translations.de.selectTopic;
    });
    numbers.innerText = translations.de.selectNumber;
  } else if(language == "fr"){
    preSeting.childNodes[0].nodeValue = translations.fr.preSettings + " ";
    settings.innerText = translations.fr.settingsTitle;
    langLabel.innerText = translations.fr.languageLabel;
    langOptionEN.innerText = translations.fr.languageOptions.en;
    langOptionDE.innerText = translations.fr.languageOptions.de;
    langOptionFR.innerText = translations.fr.languageOptions.fr;
    selectDifficulty.innerText =translations.fr.selectDifficulty;
    hard.innerText = translations.fr.hardDifficulty;
    medium.innerHTML = translations.fr.mediumDifficulty;
    easy.innerHTML = translations.fr.easyDifficulty;
    selectTopics.forEach(selectTopic => {
      selectTopic.innerText = translations.fr.selectTopic;
    });
    numbers.innerText = translations.fr.selectNumber;
  }

};    