
// Variables to track the state of flipped cards and checking status
let firstFlippedCard = null;
let secondFlippedCard = null;
let isChecking = false;

let matchCount = 0; // Counter for matched pairs
const totalPairs = 10; // Total number of unique pairs in your game

const timer = document.querySelector("#timer"); 

let startTime = 0;
let elapsedTime = 0; 
let intervalId; 
let mins = 0; 
let secs = 0; 

function displayNumbers() {
  const cards = document.querySelectorAll('.number'); // Get all card elements

  // Function to handle card click
  cards.forEach(card => {
    card.addEventListener('click', function() {
      // Prevent action if already checking or card is open
      if (isChecking || this.classList.contains("boxOpen")) return;
      this.classList.add("boxOpen"); // Flip the card

      if (!firstFlippedCard) {
        firstFlippedCard = this;

        // Start the timer only if it hasn't been started yet
        if (!intervalId) {
          startTime = Date.now() - elapsedTime; // Calculate the start time
          intervalId = setInterval(updateTime, 1000); // Start the timer
        }

      } else {
        secondFlippedCard = this;
        isChecking = true; // Start checking for match

        // Check for match
        if (firstFlippedCard.dataset.value === secondFlippedCard.dataset.value) {

          // Match found
          matchCount++; // Increment match counter

          // Remove matched cards
          firstFlippedCard.style.visibility = "hidden";
          secondFlippedCard.style.visibility = "hidden";

          // Check if all matches are found
          if (matchCount === totalPairs){
            clearInterval(intervalId); // Stop the timer
          }
          
          // Match found
          firstFlippedCard = null;
          secondFlippedCard = null;
          isChecking = false; // Reset checking state
        } else {
            // No match found, flip back after a delay
            setTimeout(() => {
              firstFlippedCard.classList.remove("boxOpen");
              secondFlippedCard.classList.remove("boxOpen");
              firstFlippedCard = null; // Reset flipped cards
              secondFlippedCard = null;
              isChecking = false; // Reset checking state
            }, 1200); // Delay for flipping back
        }
      }
    });
  });

  // Shuffle the cards and display them immediately
  shuffleCards(cards);
}

// Shuffle function
function shuffleCards(cards) {
  const shuffledCards = Array.from(cards).sort(() => Math.random() - 0.5);
  const container = document.getElementById("imgContainer");
  container.innerHTML = ""; // Clear the container

  // Append shuffled cards to the container
  shuffledCards.forEach(card => {
    container.appendChild(card);
  });
}

// Reset button event listener
document.getElementById("resetButton").addEventListener('click', function() {
  // Reset flipped card states
  firstFlippedCard = null;
  secondFlippedCard = null;
  isChecking = false;
  matchCount = 0;

  // Stop the timer if it's running
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null; // Reset intervalId
  }
  
  elapsedTime = 0; // Reset elapsed time
  mins = 0; // Reset minutes
  secs = 0; // Reset seconds
  timer.textContent = "00:00"; // Reset timer display

  // Reset the appearance of all cards
  const cards = document.querySelectorAll('.number');
  cards.forEach(card => {
    card.classList.remove('boxOpen'); // Remove the boxOpen class
    card.style.visibility = "visible"; // Reset visibility to visible
  });

  // Shuffle the cards again and display
  shuffleCards(cards);
});


displayNumbers();

// Function to update the timer display
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

function changeBackToMenu(){
  window.location.assign("./menu.html");
}

function changeBackToLvl1(){
  window.location.assign("./easy-difficulty.html");
}

function changeToEasyDifficulty2(){
  window.location.assign("./easy-difficulty-lvl2.html");
}