
//Hides Level 2
document.getElementById("level2").style.display="none";

//Hides Level 3
document.getElementById("level3").style.display="none";

//Hides Level 4
document.getElementById("level4").style.display="none";

//Hides Level 5
document.getElementById("level5").style.display="none";



function createGame(containerId, className, resetButton, timerId, modalContainerId, playAgainButtonId, totalPairs){
  // Variables to track the state of flipped cards and checking status
  let firstFlippedCard = null;
  let secondFlippedCard = null;
  let isChecking = false;

  let matchCount = 0; // Counter for matched pairs
  //const totalPairs = 0; // Total number of unique pairs in your game

  const timer = document.querySelector(`#${timerId}`); 

  let startTime = 0;
  let elapsedTime = 0;
  let paused = true; 
  let intervalId; 
  let mins = 0; 
  let secs = 0; 

 

  function displayNumbers() {
    const cards = document.querySelectorAll(`${className}`); // Get all card elements

    // Function to handle card click
    cards.forEach(card => {
      card.addEventListener('click', function() {
        // Prevent action if already checking or card is open
        if (isChecking || this.classList.contains("boxOpen")) return;
        this.classList.add("boxOpen"); // Flip the card

        if (!firstFlippedCard) {
          firstFlippedCard = this;

          // Start the timer only if it hasn't been started yet
          if (paused) {
            paused = false;
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
              elapsedTime = Date.now() - startTime; // Save how much time passed
              clearInterval(intervalId); // Stop the timer


              // Display Popup
              setTimeout(() => {
                document.getElementById(modalContainerId).classList.add("show");
              }, 500); // Delay display Popup 0,5 sec
        
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
              }, 1200); // Delay for flipping back 1,2 sec
          }
        }
      });
    });

    // Shuffle the cards and display them immediately
    shuffleCards(cards);
  }

  displayNumbers();

  // Shuffle function
  function shuffleCards(cards) {
    const shuffledCards = Array.from(cards).sort(() => Math.random() - 0.5);
    const container = document.getElementById(containerId);
    container.innerHTML = ""; // Clear the container

    // Append shuffled cards to the container
    shuffledCards.forEach(card => {
      container.appendChild(card);
    });
  }

  

  // Resets Game
  document.getElementById(resetButton).addEventListener('click', function() {
    resetGame();
  });

  function resetGame(){
    // Reset flipped card states
    firstFlippedCard = null;
    secondFlippedCard = null;
    isChecking = false;
    matchCount = 0;
  
    // Stop the timer and reset
    paused = true;
    clearInterval(intervalId);
    startTime = 0;
    elapsedTime = 0;
    mins = 0; 
    secs = 0; 
    timer.textContent = "00:00"; // Reset timer display
  
    // Reset the appearance of all cards
    const cards = document.querySelectorAll(`${className}`);
    cards.forEach(card => {
    card.classList.remove('boxOpen'); // Remove the boxOpen class
    card.style.visibility = "visible"; // Reset visibility to visible
    });
  
    // Shuffle the cards again and display
    shuffleCards(cards);
  }


  // Removes Popup abd resets the game
  document.getElementById(playAgainButtonId).addEventListener("click", function(){
    document.getElementById(modalContainerId).classList.remove("show");
    resetGame();
  
  });

  // Function to update the timer 
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
}

createGame("numberContainer1", ".number1","resetButton1", "timer1", "modalContainer1", "playAgainButton1", 10);




function changeLevel(level) {
 
  // Clears the previous level's numbers
  document.getElementById(`level${level - 1}`).style.display = "none";
  

  // Displays the current level
  document.getElementById(`level${level}`).style.display = "block";


  // Create the game for the current level
  const numberContainerId = `numberContainer${level}`;
  const numberClass = `.number${level}`;
  const resetButton = `resetButton${level}`
  const timerId = `timer${level}`
  const modalContainerId = `modalContainer${level}`;
  const playAgainButtonId = `playAgainButton${level}`;
  const numberCount = 10 + ((level - 1) * 5); // Adjust the count based on level

  createGame(numberContainerId, numberClass, resetButton, timerId, modalContainerId, playAgainButtonId, numberCount);

}


function changeBackLevel(level){
  // Clears the current level's numbers
  document.getElementById(`level${level}`).style.display = "none";

    
  // Displays the previous level
  document.getElementById(`level${level - 1}`).style.display = "block";
  
  // Create the game for the current level
  const numberContainerId = `numberContainer${level - 1}`;
  const numberClass = `.number${level - 1}`;
  const resetButton = `resetButton${level - 1}`
  const timerId = `timer${level - 1}`
  const modalContainerId = `modalContainer${level - 1}`;
  const playAgainButtonId = `playAgainButton${level - 1}`;
  const numberCount = 5 + ((level - 1) * 5); // Adjust the count based on level
  
  createGame(numberContainerId, numberClass, resetButton, timerId, modalContainerId, playAgainButtonId, numberCount);
}


function changeBackToMenu(){
  window.location.assign("./menu.html")
}

