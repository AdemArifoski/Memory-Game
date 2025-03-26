
//Hides Level 2 to 10 
for (let i = 2; i <= 10; i++) {
  document.getElementById(`level${i}`).style.display = "none";
}


function createGame(containerId, className, resetButton, timerId, modalContainerId, playAgainButtonId, totalPairs) {
  let firstFlippedCard = null;
  let secondFlippedCard = null;
  let isChecking = false;
  let matchCount = 0;
  const timer = document.querySelector(`#${timerId}`);
  let startTime = 0;
  let elapsedTime = 0;
  let paused = true;
  let intervalId;
  let positionChangeInterval;
  let mins = 0;
  let secs = 0;

  function animeImages() {
    const cards = document.querySelectorAll(`${className}`);

    cards.forEach(card => {
      card.addEventListener('click', function () {
        if (isChecking || this.classList.contains("boxOpen")) return;
        this.classList.add("boxOpen");

        if (!firstFlippedCard) {
          firstFlippedCard = this;
          if (paused) {
            paused = false;
            startTime = Date.now() - elapsedTime;
            intervalId = setInterval(updateTime, 1000);
            positionChangeInterval = setInterval(swapImages, 5000); // Start position change interval
          }
        } else {
          secondFlippedCard = this;
          isChecking = true;

          if (firstFlippedCard.dataset.value === secondFlippedCard.dataset.value) {
            matchCount++;
            firstFlippedCard.style.visibility = "hidden";
            secondFlippedCard.style.visibility = "hidden";

            if (matchCount === totalPairs) {
              elapsedTime = Date.now() - startTime;
              clearInterval(intervalId);
              clearInterval(positionChangeInterval); // Stop position change
              setTimeout(() => {
                document.getElementById(modalContainerId).classList.add("show");
              }, 500);
            }

            firstFlippedCard = null;
            secondFlippedCard = null;
            isChecking = false;
          } else {
            setTimeout(() => {
              firstFlippedCard.classList.remove("boxOpen");
              secondFlippedCard.classList.remove("boxOpen");
              firstFlippedCard = null;
              secondFlippedCard = null;
              isChecking = false;
            }, 1200);
          }
        }
      });
    });

    shuffleCards(cards);
  }

  function shuffleCards(cards) {
    const shuffledCards = Array.from(cards).sort(() => Math.random() - 0.5);
    const container = document.getElementById(containerId);
    container.innerHTML = "";
    shuffledCards.forEach(card => {
      container.appendChild(card);
    });
  }

  function swapImages() {
    const minionElements = Array.from(document.querySelectorAll(`${className}`)).filter(img => img.style.visibility !== "hidden");

    if (minionElements.length < 2) return;

    const randomIndex1 = Math.floor(Math.random() * minionElements.length);
    let randomIndex2;
    do {
      randomIndex2 = Math.floor(Math.random() * minionElements.length);
    } while (randomIndex1 === randomIndex2);

    const img1 = minionElements[randomIndex1];
    const img2 = minionElements[randomIndex2];

    const img1Rect = img1.getBoundingClientRect();
    const img2Rect = img2.getBoundingClientRect();

    const translateX = img2Rect.left - img1Rect.left;
    const translateY = img2Rect.top - img1Rect.top;

    img1.style.transform = `translate(${translateX}px, ${translateY}px)`;
    img2.style.transform = `translate(${-translateX}px, ${-translateY}px)`;

    setTimeout(() => {
      const parent = img1.parentNode;
      const nextSibling1 = img1.nextElementSibling;
      const nextSibling2 = img2.nextElementSibling;

      parent.insertBefore(img2, nextSibling1);
      parent.insertBefore(img1, nextSibling2);

      img1.style.transform = '';
      img2.style.transform = '';
    }, 1000);
  }

  document.getElementById(resetButton).addEventListener('click', function () {
    resetGame();
  });

  function resetGame() {
    firstFlippedCard = null;
    secondFlippedCard = null;
    isChecking = false;
    matchCount = 0;
    paused = true;
    clearInterval(intervalId);
    clearInterval(positionChangeInterval);
    startTime = 0;
    elapsedTime = 0;
    mins = 0;
    secs = 0;
    timer.textContent = "00:00";

    const cards = document.querySelectorAll(`${className}`);
    cards.forEach(card => {
      card.classList.remove('boxOpen');
      card.style.visibility = "visible";
    });

    shuffleCards(cards);
  }

  document.getElementById(playAgainButtonId).addEventListener("click", function () {
    document.getElementById(modalContainerId).classList.remove("show");
    resetGame();
  });

  function updateTime() {
    elapsedTime = Date.now() - startTime;
    secs = Math.floor((elapsedTime / 1000) % 60);
    mins = Math.floor((elapsedTime / (1000 * 60)) % 60);
    secs = pad(secs);
    mins = pad(mins);
    timer.textContent = `${mins}:${secs}`;

    function pad(unit) {
      return (("0") + unit).length > 2 ? unit : "0" + unit;
    }
  }

  animeImages();
}

createGame("imgContainer1", ".itachi1", "resetButton1", "timer1", "modalContainer1", "playAgainButton1", 8);

function changeLevel(level) {
 
  // Clears the previous level's numbers
  document.getElementById(`level${level - 1}`).style.display = "none";
  

  // Displays the current level
  document.getElementById(`level${level}`).style.display = "block";


  // Create the game for the current level
  const imgContainerId = `imgContainer${level}`;
  const itachiClass = `.itachi${level}`;
  const resetButton = `resetButton${level}`
  const timerId = `timer${level}`
  const modalContainerId = `modalContainer${level}`;
  const playAgainButtonId = `playAgainButton${level}`;
  const numberCount = 8 + ((level - 1) * 2); // Adjust the count based on level

  createGame(imgContainerId, itachiClass, resetButton, timerId, modalContainerId, playAgainButtonId, numberCount);

}


function changeBackLevel(level){
  // Clears the current level's numbers
  document.getElementById(`level${level}`).style.display = "none";

    
  // Displays the previous level
  document.getElementById(`level${level - 1}`).style.display = "block";
  
  // Create the game for the current level
  const imgContainerId = `imgContainer${level - 1}`;
  const itachiClass = `.itachi${level - 1}`;
  const resetButton = `resetButton${level - 1}`
  const timerId = `timer${level - 1}`
  const modalContainerId = `modalContainer${level - 1}`;
  const playAgainButtonId = `playAgainButton${level - 1}`;
  const numberCount = 6 + ((level - 1) * 2); // Adjust the count based on level
  
  createGame(imgContainerId, itachiClass, resetButton, timerId, modalContainerId, playAgainButtonId, numberCount);
}




function changeBackToMenu(){
  window.location.assign("./menu.html");
}

