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






