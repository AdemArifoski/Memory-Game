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


click = 0;
// Increases height of settingspanel and displays credits when credits buttons is clicked
document.getElementById("creditsButton").addEventListener("click", function(){
  click++;
  const settingsPanel = document.getElementById("settingsPanel");
  const credits = document.getElementById("credits");
  settingsPanel.style.height = "600px";
  if(click % 2 !== 0) {
    credits.style.display = "block";
  } else {
    credits.style.display = "none";
    settingsPanel.style.height = "";
  }
  
});


let token = localStorage.getItem('token')


let isLoading = false
let isAuthenticating = false
let isRegistration = false
let selectedTab = 'All'

const apiBase = '/'

// elements
const nav = document.querySelector('nav')
const header = document.querySelector('header')
const main = document.querySelector('main')
const navElements = document.querySelectorAll('.tab-button')
const authContent = document.getElementById('auth')
const textError = document.getElementById('error')
const email = document.getElementById('emailInput')
const password = document.getElementById('passwordInput')
const registerBtn = document.getElementById('registerBtn')
const authBtn = document.getElementById('authBtn')
const addTodoBtn = document.getElementById('addTodoBtn')
const loginButn = document.getElementById('loginButton')

loginButn.addEventListener("click", function() {
  authContent.style.display = "block";
});


async function toggleIsRegister() {
  isRegistration = !isRegistration
  registerBtn.innerText = isRegistration ? 'Sign in' : 'Sign up'
  document.querySelector('#auth > div h2').innerText = isRegistration ? 'Sign Up' : 'Login'
  document.querySelector('.register-content p').innerText = isRegistration ? 'Already have an account?' : 'Don\'t have an account?'
  document.querySelector('.register-content button').innerText = isRegistration ? 'Sign in' : 'Sign up'
}

async function authenticate() {
  // access email and pass values
  const emailVal = email.value
  const passVal = password.value

  // guard clauses... if authenticating, return
  if (
      isLoading ||
      isAuthenticating ||
      !emailVal ||
      !passVal ||
      passVal.length < 6 ||
      !emailVal.includes('@')
  ) { return }

  // reset error and set isAuthenticating to true
  error.style.display = 'none'
  isAuthenticating = true
  authBtn.innerText = 'Authenticating...'

  try {
      let data
      if (isRegistration) {
          // register an account
          const response = await fetch(apiBase + 'auth/register', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ username: emailVal, password: passVal })
          })
          data = await response.json()
      } else {
          // login an account
          const response = await fetch(apiBase + 'auth/login', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ username: emailVal, password: passVal })
          })
          data = await response.json()
      }

      if (data.token) {
          token = data.token
          localStorage.setItem('token', token)

          // authenicating into loading
          authBtn.innerText = 'Loading...'

          // fetch todos
          //await fetchTodos()

          // show dashboard
          showDashboard()
      } else {
          throw Error('❌ Failed to authenticate...')
      }

  } catch (err) {
      console.log(err.message)
      error.innerText = err.message
      error.style.display = 'block'
  } finally {
      authBtn.innerText = 'Submit'
      isAuthenticating = false
  }
}


function logout() {
  // wipe states and clear cached token
}


// PAGE RENDERING LOGIC
async function showDashboard() {
  // Hide authentication panel
  document.getElementById('auth').style.display = 'none';

  // Show menu and header
  document.getElementById('menu').style.display = 'block';
  document.querySelector('header').style.display = 'flex';
  

  //await fetchTodos()
}

// CRUD LOGIC
/*async function fetchTodos() {
  isLoading = true
  const response = await fetch(apiBase + 'todos', {
    headers: { 'Authorization': token }
  })
  const todosData = await response.json()
  todos = todosData
  isLoading = false
  renderTodos()
}*/


// load page and read local storage for key

// default to login screen

// if is authenticated, show menu
if (token) {
  async function run() {
    //await fetchTodos()
    showDashboard()
  }
  run()
}


if (!token) {
  loginButn.style.display = "block";
}












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
    selectNumber: "Numbers",
    credits1: "Naruto characters:",
    credits2: "Images used for a school project.",
    credits3: "Found on Pinterest.",
    credits4: "Found on Google Images.",
    credits5: "Demon Slayer characters:",
    credits6: "Number image:",
    credits7: "Light and Dark Mode images",
    credits8: "Credits",
    credits9: "Image Credits",
    
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
    selectNumber: "Zahlen",
    credits1: "Naruto Charaktere:",
    credits2: "Bilder für ein Schulprojekt verwendet.",
    credits3: "Auf Pinterest gefunden.",
    credits4: "Auf Google Bilder gefunden.",
    credits5: "Demon Slayer Charaktere:",
    credits6: "Zahlenbild:",
    credits7: "Bilder für Hell-/Dunkelmodus:",
    credits8: "Credits",
    credits9: "Bildnachweise"

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
    selectNumber: "Nombres",
    credits1: "Personnages de Naruto:",
    credits2: "Images utilisé pour un projet scolaire.",
    credits3: "Trouvé sur Pinterest.",
    credits4: "Trouvé sur Google Images.",
    credits5: "Personnages de Demon Slayer:",
    credits6: "Image de chiffre:",
    credits7: "Images du mode clair/sombre:",
    credits8: "Crédits",
    credits9: "Crédits d'image"

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
let creditsOnImages1 = document.getElementById("narutoCredits1");
let creditsOnImages2 = document.getElementById("narutoCredits2");
let creditsOnImages3 = document.getElementById("demonSlayerCredits1");
let creditsOnImages4 = document.getElementById("demonSlayerCredits2");
let creditsOnImages5 = document.getElementById("numberCredits1");
let creditsOnImages6 = document.getElementById("numberCredits2");
let creditsOnImages7 = document.getElementById("iightDarkCredits1");
let creditsOnImages8 = document.getElementById("iightDarkCredits2");
let creditsOnImages9 = document.getElementById("minionsCredits1");
let creditsOnImages10 = document.getElementById("minionsCredits2");
let imageCredits1 = document.getElementById("creditsButton");
let imageCredits2 = document.getElementById("imageCredits");
let imagePar = document.getElementById("imagesPar");

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
    creditsOnImages1.innerText = translations.en.credits1;
    creditsOnImages2.innerText = translations.en.credits3;
    creditsOnImages3.innerText = translations.en.credits5;
    creditsOnImages4.innerText = translations.en.credits3;
    creditsOnImages5.innerText = translations.en.credits6;
    creditsOnImages6.innerText = translations.en.credits3;
    creditsOnImages7.innerText = translations.en.credits7;
    creditsOnImages8.innerText = translations.en.credits4;
    imageCredits1.innerText =  translations.en.credits8;
    imageCredits2.innerText =  translations.en.credits9;
    creditsOnImages10.innerText = translations.en.credits3;
    imagePar.innerText = translations.en.credits2;

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
    creditsOnImages1.innerText = translations.de.credits1;
    creditsOnImages2.innerText = translations.de.credits3;
    creditsOnImages3.innerText = translations.de.credits5;
    creditsOnImages4.innerText = translations.de.credits3;
    creditsOnImages5.innerText = translations.de.credits6;
    creditsOnImages6.innerText = translations.de.credits3;
    creditsOnImages7.innerText = translations.de.credits7;
    creditsOnImages8.innerText = translations.de.credits4;
    imageCredits1.innerText =  translations.de.credits8;
    imageCredits2.innerText =  translations.de.credits9;
    creditsOnImages10.innerText = translations.de.credits3;
    imagePar.innerText = translations.de.credits2;

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
    creditsOnImages1.innerText = translations.fr.credits1;
    creditsOnImages2.innerText = translations.fr.credits3;
    creditsOnImages3.innerText = translations.fr.credits5;
    creditsOnImages4.innerText = translations.fr.credits3;
    creditsOnImages5.innerText = translations.fr.credits6;
    creditsOnImages6.innerText = translations.fr.credits3;
    creditsOnImages7.innerText = translations.fr.credits7;
    creditsOnImages8.innerText = translations.fr.credits4;
    imageCredits1.innerText =  translations.fr.credits8;
    imageCredits2.innerText =  translations.fr.credits9;
    creditsOnImages10.innerText = translations.fr.credits3;
    imagePar.innerText = translations.fr.credits2;
  }

};    