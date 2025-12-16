import  writeToFirestore from "./writeToFirestore.js";
import sendToGoogleSheet, { getOrCreatePlayerID} from "./writeToGS.js"
import { sendToServer, sendToServerLives } from "./writeToDB.js";

//Hides Level 2 to 10 
for (let i = 2; i <= 10; i++) {
  document.getElementById(`level${i}`).style.display = "none";
}

let token = localStorage.getItem('token');
// Object to store timer interval IDs for each level, allowing independent timer control per level
const levelTimers = {}; // Stores interval IDs for each level

const playerID = getOrCreatePlayerID();






function createGame(containerId, className, resetButton, timerId, modalContainerId, gameOverId, totalPairs, levelNumber){
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

  let moves = 0;

  let matchStartTime = 0;
  let gamePoints = 0;

  function minionImages() {
    const cards = document.querySelectorAll(`${className}`); // Get all card elements

    // Clone each card to remove old event listeners
    cards.forEach(card => {
      const newCard = card.cloneNode(true); // Deep clone with no event listeners
      card.parentNode.replaceChild(newCard, card);
    });

    const refreshedCards = document.querySelectorAll(`${className}`);

    // Function to handle card click
    refreshedCards.forEach(card => {
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
            // Store the timer's interval ID for this level so it can be cleared later when switching levels
            levelTimers[levelNumber] = intervalId;
          }

          //Track time when first card of pair is flipped
          matchStartTime = Date.now();

        } else {
          secondFlippedCard = this;
          isChecking = true; // Start checking for match

          // Increment moves after the second card is flipped
          moves++; // Increment moves counter

          // Check for match
          if (firstFlippedCard.dataset.value === secondFlippedCard.dataset.value) {

            // Match found
            matchCount++; // Increment match counter

            // Remove matched cards
            firstFlippedCard.style.visibility = "hidden";
            secondFlippedCard.style.visibility = "hidden";

            // Calculate how much time passed between flipping the first and second card 
            const matchTime = Date.now() - matchStartTime;

            // Define the key used to store total points in localStorage
            const totalPointsKey = "totalPointsMedium"; 

            // Retrieve the current total points from localStorage and convert to a number
            let currentPoints = parseInt(localStorage.getItem(totalPointsKey));

            // If no points are stored yet, initialize to 0
            if (isNaN(currentPoints)) currentPoints = 0;

            // Award points based on how fast the player found the match:
            // 10 points if within 5 seconds
            // 5 points if within 6–10 seconds
            // 1 point if more than 10 seconds
            if (matchTime <= 5000) {
              currentPoints += 10;
              gamePoints += 10;
            } else if (matchTime <= 10000) {
              currentPoints += 5;
              gamePoints += 5;
            } else {
              currentPoints += 1;
              gamePoints += 1;
            }

            // Save the updated points back to localStorage
            localStorage.setItem(totalPointsKey, currentPoints);

            // Update the on-screen display with the new total points
            document.getElementById("totalPoints").textContent = currentPoints;
            document.getElementById(`totalPointsValue${levelNumber}`).textContent = currentPoints;
            //Display the points earned during current game
            document.getElementById(`pointsValue${levelNumber}`).textContent = gamePoints;



            // Check if all matches are found
            if (matchCount === totalPairs){
              elapsedTime = Date.now() - startTime; // Save how much time passed
              clearInterval(intervalId); // Stop the timer


              // Display Popup
              setTimeout(() => {
                document.getElementById(modalContainerId).classList.add("show");
              }, 500); // Delay display Popup after 0,5 sec

              //Remove Popup
              setTimeout(() => {
                const popup = document.getElementById(modalContainerId);

                // Only proceed if popup still displayed
                if (popup && popup.classList.contains("show")) {
                  popup.classList.remove("show");
                  resetGame();
                }
              }, 10000); //Remove after 10 sec

              // Display Time in Your Score
              const currentScore = `${mins}:${secs}`;
              const scoreElement = document.getElementById(`scoreValue${levelNumber}`);
              if (scoreElement) {
                scoreElement.textContent = currentScore;
              }

                // Display Moves in Your Moves
              const currentMoves = `${moves}`;
              const movesElement = document.getElementById(`movesValue${levelNumber}`);
              if (movesElement) {
                movesElement.textContent = currentMoves;
              }


              function bestTime(mode){
                const highScoreKey = `highScoreMediumLvl${levelNumber}_${mode}`;
                // Get the previously saved best time from localStorage
                const previousHighScore = localStorage.getItem(highScoreKey);

                // Check if there's no previous high score or if the current score is lower than the previous
                if (!previousHighScore || timeToSeconds(currentScore) < timeToSeconds(previousHighScore)) {
                  // Save the current score as the new high score in localStorage
                  localStorage.setItem(highScoreKey, currentScore); 
                }

                // Retrieve the best time
                const bestTime = localStorage.getItem(highScoreKey);
                // Display the best time in High Score
                document.getElementById(`highScoreValue${levelNumber}`).textContent = bestTime;

               return bestTime; // return value so it can be sent to Google Sheets
              }


              function bestMoves(mode){
                const bestMovesKey = `bestMovesMediumLvl${levelNumber}_${mode}`;
                // Get the previously saved best moves from localStorage
                const previousBestMoves = localStorage.getItem(bestMovesKey);

                // Check if there's no previous best moves or if the current moves are lower than the previous
                if (!previousBestMoves || parseInt(currentMoves) < parseInt(previousBestMoves)) {
                  // Save the current moves as the new best moves in localStorage
                  localStorage.setItem(bestMovesKey, currentMoves); 
                }

                // Retrieve the best moves
                const bestMoves = localStorage.getItem(bestMovesKey);
                // Display the best moves in Best Moves
                document.getElementById(`bestMovesValue${levelNumber}`).textContent = bestMoves;

                return bestMoves; // return value so it can be sent to Google Sheets
              }

              //If lives mode is displayed
              if(document.getElementById("classicModeButton").style.display === "none"){

                // Get the current level
                const currentLevel = levelNumber; 
                const mode = "lives";  // Mode identifier

                // Create a unique key for this level + mode
                const keyForLivesModeMedium = `numberOfTimesPlayedMedium_level${currentLevel}_${mode}`;

                // Get current count or 0
                let numberOfTimesPlayedMedium = parseInt(localStorage.getItem(keyForLivesModeMedium)) || 0;

                // Increment
                numberOfTimesPlayedMedium++;

                // Save it
                localStorage.setItem(keyForLivesModeMedium, numberOfTimesPlayedMedium);

                //Get mode-specific best time and best moves
                const bestTimeResult = bestTime(mode);
                const bestMovesResult = bestMoves(mode);

                //sent data to google sheets
                sendToGoogleSheet({
                  "PlayerID": playerID,
                  "Difficulty": "Medium",
                  "Mode": "Lives",
                  "Level": `Level ${levelNumber} completed`,
                  "Time": currentScore,
                  "Number of times played": `Level ${levelNumber} played ${numberOfTimesPlayedMedium} times`,
                  "Moves": currentMoves, 
                  "Points": gamePoints,
                  "Best Time": bestTimeResult,
                  "Best Moves":bestMovesResult,
                  "Total Points": currentPoints
                });

                function runFirebaseLogic() {

                  writeToFirestore("medium", {
                    "PlayerID": playerID,
                    "Mode": "Lives",
                    "Level": `Level ${levelNumber} completed`,
                    "Time": currentScore,
                    "Number of times played": `Level ${levelNumber} played ${numberOfTimesPlayedMedium} times`,
                    "Moves": currentMoves, 
                    "Points": gamePoints,
                    "Best Time": bestTimeResult,
                    "Best Moves":bestMovesResult,
                    "Total Points": currentPoints,
                    "Date": window.serverTimestamp()
                  });
                 
                }

                //Run immediately if Firebase is already ready
                if (window.firebaseReady) {
                  runFirebaseLogic();
                } else {
                  // Or wait for the event if not ready yet
                  window.addEventListener("firebase-ready", runFirebaseLogic);
                }

                if(token){
                  sendToServer({
                    difficulty: "Medium",
                    mode: "Lives",
                    level: `Level ${levelNumber} completed`,
                    time: currentScore,
                    number_of_times_played: `Level ${levelNumber} played ${numberOfTimesPlayedMedium} times`,
                    moves: currentMoves,
                    points: gamePoints,
                    best_time: bestTimeResult,
                    best_moves: bestMovesResult,
                    total_points: currentPoints
                  });
                }

                //classic Mode is displayed
              }else{

                // Get the current level
                const currentLevel = levelNumber; 
                const mode = "classic";  // Mode identifier

                // Create a unique key for this level + mode
                const keyForClassicModeMedium = `numberOfTimesPlayedMedium_level${currentLevel}_${mode}`;


                // Get current count or 0
                let numberOfTimesPlayedClassicMedium = parseInt(localStorage.getItem(keyForClassicModeMedium)) || 0;

                // Increment
                numberOfTimesPlayedClassicMedium++;

                // Save it
                localStorage.setItem(keyForClassicModeMedium, numberOfTimesPlayedClassicMedium);

                // Get mode-specific best time and best moves
                const bestTimeResult = bestTime(mode);
                const bestMovesResult = bestMoves(mode);

                //sent data to google sheets
                sendToGoogleSheet({
                  "PlayerID": playerID,
                  "Difficulty": "Medium",
                  "Mode": "Classic",
                  "Level": `Level ${levelNumber} completed`,
                  "Time": currentScore,
                  "Number of times played": `Level ${levelNumber} played ${numberOfTimesPlayedClassicMedium} times`,
                  "Moves": currentMoves, 
                  "Points": gamePoints,
                  "Best Time": bestTimeResult,
                  "Best Moves":bestMovesResult,
                  "Total Points": currentPoints
                });

                function runFirebaseLogic() {

                  writeToFirestore("medium", {
                    "PlayerID": playerID,
                    "Mode": "Classic",
                    "Level": `Level ${levelNumber} completed`,
                    "Time": currentScore,
                    "Number of times played": `Level ${levelNumber} played ${numberOfTimesPlayedClassicMedium} times`,
                    "Moves": currentMoves, 
                    "Points": gamePoints,
                    "Best Time": bestTimeResult,
                    "Best Moves":bestMovesResult,
                    "Total Points": currentPoints,
                    "Date": window.serverTimestamp()
                  });
                  
                }

                //Run immediately if Firebase is already ready
                if (window.firebaseReady) {
                  runFirebaseLogic();
                } else {
                  // Or wait for the event if not ready yet
                  window.addEventListener("firebase-ready", runFirebaseLogic);
                }

                if(token){
                    sendToServer( {
                    difficulty: "Medium",
                    mode: "Classic",
                    level: `Level ${levelNumber} completed`,
                    time: currentScore,
                    number_of_times_played: `Level ${levelNumber} played ${numberOfTimesPlayedClassicMedium} times`,
                    moves: currentMoves,
                    points: gamePoints,
                    best_time: bestTimeResult,
                    best_moves: bestMovesResult,
                    total_points: currentPoints
                  });
                }


              }
              

              
              

              // If lives mode is displayed, get lives back when all cards match and be able to go to next level
              if (document.getElementById("classicModeButton").style.display === "none") {
                for (let i = 1; i <= 9; i++) {
                  if (document.getElementById(`level${i}`).style.display !== "none") {
                    if (lives < 5) {
                      lives = 5;
                      document.getElementById("totalLives").textContent = lives;
                    }
                    changeLevelOnClickForLivesMode(i, i + 1);
                    break; // Stop after handling the first visible level
                  }
                }
              }
        
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

              //If lives mode is displayed, decrease number of lives when cards don't match
              if(document.getElementById("classicModeButton").style.display === "none"){
                lives--;
                document.getElementById("totalLives").innerText = lives;

                // Save updated lives to localStorage
                localStorage.setItem("totalLivesMedium", lives);
              }

              
              //If lives mode is displayed
              if(document.getElementById("classicModeButton").style.display === "none"){
                //If no lives left
                if(lives === 0){
                  setTimeout(() =>{
                    // Stop the timer and reset
                    paused = true;

                    let timeForAllLivesLost = timer.textContent;

                    const mode = "lives";

                    // retain the number of times played and completed the levels
                    //let playedTimesLives = parseInt(localStorage.getItem(`numberOfTimesPlayed_level${levelNumber}_${mode}`));

                    let currentPoints = parseInt(localStorage.getItem("totalPointsMedium"));

                    // Create a unique key for this level + lives mode for not completed
                    const keyForLivesModeNotCompletedMedium = `numberOfTimesPlayedNotCompletedMedium_level${levelNumber}_${mode}`;

                    // Get current count or 0
                    let numberOfTimesPlayedLivesNotCompletedMedium = parseInt(localStorage.getItem(keyForLivesModeNotCompletedMedium)) || 0;

                    // Increment
                    numberOfTimesPlayedLivesNotCompletedMedium++;

                    // Save it
                    localStorage.setItem(keyForLivesModeNotCompletedMedium, numberOfTimesPlayedLivesNotCompletedMedium);

                    //combine number of times played and completed + not completed
                    //let livesModeAllNumberPlayed = playedTimesLives + numberOfTimesPlayedLivesNotCompleted;
                  

                    const bestTime = localStorage.getItem(`highScoreMediumLvl${levelNumber}_lives`);
                    const bestMoves = localStorage.getItem(`bestMovesMediumLvl${levelNumber}_lives`);
                    //sent data to google sheets
                    sendToGoogleSheet({
                      "PlayerID": playerID,
                      "Difficulty": "Medium",
                      "Mode": "Lives",
                      "Level": `Level ${levelNumber} not completed`,
                      "Time": timeForAllLivesLost,
                      "Number of times played": `Level ${levelNumber} played ${numberOfTimesPlayedLivesNotCompletedMedium} times`,
                      "Moves": moves, 
                      "Points": gamePoints,
                      "Best Time": bestTime,
                      "Best Moves": bestMoves,
                      "Total Points": currentPoints
                    });

                    function runFirebaseLogic() {
          
                      writeToFirestore("medium", {
                        "PlayerID": playerID,
                        "Mode": "Lives",
                        "Level": `Level ${levelNumber} not completed`,
                        "Time": timeForAllLivesLost,
                        "Number of times played": `Level ${levelNumber} played ${numberOfTimesPlayedLivesNotCompletedMedium} times`,
                        "Moves": moves, 
                        "Points": gamePoints,
                        "Best Time": bestTime,
                        "Best Moves": bestMoves,
                        "Total Points": currentPoints,
                        "Date": window.serverTimestamp()
                      })
                      
                    }

                    //Run immediately if Firebase is already ready
                    if (window.firebaseReady) {
                      runFirebaseLogic();
                    } else {
                      // Or wait for the event if not ready yet
                      window.addEventListener("firebase-ready", runFirebaseLogic);
                    }

                    if(token){
                      sendToServer({
                        difficulty: "Medium",
                        mode: "Lives",
                        level: `Level ${levelNumber} not completed`,
                        time: timeForAllLivesLost,
                        number_of_times_played: `Level ${levelNumber} played ${numberOfTimesPlayedLivesNotCompletedMedium} times`,
                        moves: moves,
                        points: gamePoints,
                        best_time: bestTime,
                        best_moves: bestMoves,
                        total_points: currentPoints
                      });
                    }


                    clearInterval(intervalId);
                    startTime = 0;
                    elapsedTime = 0;
                    mins = 0; 
                    secs = 0; 
                    timer.textContent = "00:00"; // Reset timer display

                    //Reset moves
                    moves = 0;
                    
                    //Display popup for game over
                    document.getElementById(gameOverId).classList.add("show");

                  }, 1000);

                  //When restart game go back to lvl 1
                  for(let i = 1; i <= 10; i++){
                    document.getElementById(`restart${i}`).addEventListener("click", function(){
                      
                      document.getElementById(gameOverId).classList.remove("show");
                      resetGame();
                      changeBackToLevelOne();

                      lives = 5;
                      document.getElementById("totalLives").textContent = lives;
                      
                    });
                  }   
                }
              }
          }
        }
      });
    });

    // Shuffle the cards and display them immediately
    shuffleCards(refreshedCards);
  }

  minionImages();

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
    document.getElementById(modalContainerId).classList.remove("show");
    resetGame();
  });

  function resetGame(){

    // Check if in Classic Mode AND if game started AND not all matches found
    if (document.getElementById("classicModeButton").style.display !== "none") {
      const mode = "classic";
      if (!paused && matchCount !== totalPairs) {
        const currentScore = timer.textContent;
        const currentLevel = levelNumber;
        const currentPoints = parseInt(localStorage.getItem("totalPointsMedium")) || 0;

        const keyForClassicModeNotCompletedMedium = `numberOfTimesPlayedNotCompletedMedium_level${currentLevel}_${mode}`;
        let numberOfTimesPlayedClassicNotCompletedMedium = parseInt(localStorage.getItem(keyForClassicModeNotCompletedMedium)) || 0;
        numberOfTimesPlayedClassicNotCompletedMedium++;
        localStorage.setItem(keyForClassicModeNotCompletedMedium, numberOfTimesPlayedClassicNotCompletedMedium);

        const bestTime = localStorage.getItem(`highScoreMediumLvl${levelNumber}_classic`);
        const bestMoves = localStorage.getItem(`bestMovesMediumLvl${levelNumber}_classic`);
        sendToGoogleSheet({
          "PlayerID": playerID,
          "Difficulty": "Medium",
          "Mode": "Classic",
          "Level": `Level ${levelNumber} not completed`,
          "Time": currentScore,
          "Number of times played": `Level ${levelNumber} played ${numberOfTimesPlayedClassicNotCompletedMedium} times`,
          "Moves": moves, 
          "Points": gamePoints,
          "Best Time": bestTime,
          "Best Moves": bestMoves,
          "Total Points": currentPoints
        });

        function runFirebaseLogic() {

          writeToFirestore("medium", {
            "PlayerID": playerID,
            "Mode": "Classic",
            "Level": `Level ${levelNumber} not completed`,
            "Time": currentScore,
            "Number of times played": `Level ${levelNumber} played ${numberOfTimesPlayedClassicNotCompletedMedium} times`,
            "Moves": moves, 
            "Points": gamePoints,
            "Best Time": bestTime,
            "Best Moves": bestMoves,
            "Total Points": currentPoints,
            "Date": window.serverTimestamp()
          })
        }

        //Run immediately if Firebase is already ready
        if (window.firebaseReady) {
          runFirebaseLogic();
        } else {
        // Or wait for the event if not ready yet
          window.addEventListener("firebase-ready", runFirebaseLogic);
        }

        if(token){
          sendToServer({
            difficulty: "Medium",
            mode: "Classic",
            level: `Level ${levelNumber} not completed`,
            time: currentScore,
            number_of_times_played: `Level ${levelNumber} played ${numberOfTimesPlayedClassicNotCompletedMedium} times`,
            moves: moves,
            points: gamePoints,
            best_time: bestTime,
            best_moves: bestMoves,
            total_points: currentPoints
          });
        }

      }
    }

    // Reset flipped card states
    firstFlippedCard = null;
    secondFlippedCard = null;
    isChecking = false;
    matchCount = 0;

    //Reset moves and points earned during a match
    moves = 0;
    gamePoints = 0;
  
    // Stop the timer and reset
    paused = true;
    clearInterval(intervalId);
    startTime = 0;
    elapsedTime = 0;
    mins = 0; 
    secs = 0; 
    timer.textContent = "00:00"; // Reset timer display

    const cards = document.querySelectorAll(`${className}`);
  
    // Reset all card styles before shuffling
    cards.forEach(card => {
      card.classList.remove('boxOpen');
      card.style.visibility = "visible"; // Restore visibility in case they were matched
    });

    // Call minionImages again to reattach clean event listeners
    minionImages();
  }


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

  //Function to convert the timer to seconds
  function timeToSeconds(timeStr) {
    const [min, sec] = timeStr.split(':').map(Number);
    return min * 60 + sec;
  }

  
  const totalLivesKey = "totalLivesMedium";

  // Initialize lives from localStorage or default to 5
  let lives = parseInt(localStorage.getItem(totalLivesKey));
  if (isNaN(lives) || lives < 5) lives = 5;
  document.getElementById("totalLives").textContent = lives;

  const extraLife = document.getElementById("extraLife");
  const fiveExtraLives = document.getElementById("fiveLives");

  extraLife.addEventListener("click", function () {
    // Only allow in lives mode and when the time didn't start
    if (document.getElementById("classicModeButton").style.display === "none" && paused) {

      // Retrieve the current total points from localStorage and convert to a number
      let currentPoints = parseInt(localStorage.getItem("totalPointsMedium"));

      // Check if user has enough points
      if (currentPoints >= 100) {
        // Deduct 100 points
        currentPoints -= 100;
        //Update new total Points in lacalStorage
        localStorage.setItem("totalPointsMedium", currentPoints);

        // Update points in display
        document.getElementById("totalPoints").textContent = currentPoints;
        document.getElementById("totalPointsValue1").textContent = currentPoints;

        // Increase lives by 1
        lives++;
        // Update new total lives in localStorage
        localStorage.setItem("totalLivesMedium", lives);
        // Update new total lives in display
        document.getElementById("totalLives").textContent = lives;

        //sent data to google sheets
        sendToGoogleSheet({
          "PlayerID": playerID,
          "Difficulty": "Medium",
          "Mode": "Lives",
          "Lives Purchased": "+1",
          "Total Lives": lives      
        });

        function runFirebaseLogic() {

          writeToFirestore("medium", {
            "PlayerID": playerID,
            "Mode": "Lives",
            "Lives Purchased": "+1",
            "Total Lives": lives,
            "Date": window.serverTimestamp()
          });
          
        }

        //Run immediately if Firebase is already ready
        if (window.firebaseReady) {
          runFirebaseLogic();
        } else {
        // Or wait for the event if not ready yet
          window.addEventListener("firebase-ready", runFirebaseLogic);
        }

        if(token){
          sendToServerLives({
            difficulty: "Medium",
            mode: "Lives",
            lives_purchased: 1,
            total_lives: lives 
          });
        }

      } 
    }

    
  });

  fiveExtraLives.addEventListener("click", function () {
    // Only allow in lives mode and when the time didn't start
    if (document.getElementById("classicModeButton").style.display === "none" && paused) {

      // Retrieve the current total points from localStorage and convert to a number
      let currentPoints = parseInt(localStorage.getItem("totalPointsMedium"));

      // Check if user has enough points
      if (currentPoints >= 500) {
        // Deduct 500 points
        currentPoints -= 500;
        //Update new total Points in storage
        localStorage.setItem("totalPointsMedium", currentPoints);

        // Update points in display
        document.getElementById("totalPoints").textContent = currentPoints;
        document.getElementById("totalPointsValue1").textContent = currentPoints;

        // Increase lives by 5
        lives+=5;
        // Update new total lives in localStorage
        localStorage.setItem("totalLivesMedium", lives);
        // Update new total lives in display
        document.getElementById("totalLives").textContent = lives;

        //sent data to google sheets
        sendToGoogleSheet({
          "PlayerID": playerID,
          "Difficulty": "Medium",
          "Mode": "Lives",
          "Lives Purchased": "+5",
          "Total Lives": lives      
        });

        function runFirebaseLogic() {
    

          writeToFirestore("medium", {
            "PlayerID": playerID,
            "Mode": "Lives",
            "Lives Purchased": "+5",
            "Total Lives": lives, 
            "Date": window.serverTimestamp()
          });
          
        }

        //Run immediately if Firebase is already ready
        if (window.firebaseReady) {
          runFirebaseLogic();
        } else {
        // Or wait for the event if not ready yet
          window.addEventListener("firebase-ready", runFirebaseLogic);
        }

        if(token){
          sendToServerLives( {
            difficulty: "Medium",
            mode: "Lives",
            lives_purchased: 5,
            total_lives: lives 
          });
        }

      } 
    }

    
  });

  
  const moreLives = document.getElementById("moreLives");
  const moreLivesValue = document.getElementById("moreLivesValue");
  const priceMoreLives = document.getElementById("priceMoreLives");

  // Set base price and base lives
  const baseLives = 10;
  const pricePerLife = 100;

  // Function to update price
  function updatePrice() {
    const livesSelected = parseInt(moreLivesValue.value);
    if (isNaN(livesSelected)) return;

    const difference = livesSelected - baseLives;
    const totalPrice = 1000 + (difference * pricePerLife);
    priceMoreLives.textContent = `${totalPrice}🪙`;
  }

  
  // Listen for changes in the input
  moreLivesValue.addEventListener("input", updatePrice);

  // Initialize on load
  updatePrice();

  moreLives.addEventListener("click", function () {

    const selectedLives = parseInt(moreLivesValue.value);
    // Only allow in lives mode and when the time didn't start
    if (document.getElementById("classicModeButton").style.display === "none" && paused) {
      
      if (isNaN(selectedLives)) return;

      const difference = selectedLives - baseLives;
      const totalPrice = 1000 + (difference * pricePerLife);

      let currentPoints = parseInt(localStorage.getItem("totalPointsMedium"));
      if (isNaN(currentPoints)) currentPoints = 0;

      // Check if user has enough points
      if (currentPoints >= totalPrice) {
        // Deduct points
        currentPoints -= totalPrice;
        localStorage.setItem("totalPointsMedium", currentPoints);
        document.getElementById("totalPoints").textContent = currentPoints;
        document.getElementById("totalPointsValue1").textContent = currentPoints;

        // Update lives
        lives += selectedLives;
        localStorage.setItem("totalLivesMedium", lives);
        document.getElementById("totalLives").textContent = lives;

        //sent data to google sheets
        sendToGoogleSheet({
          "PlayerID": playerID,
          "Difficulty": "Medium",
          "Mode": "Lives",
          "Lives Purchased": "+" + selectedLives,
          "Total Lives": lives      
        });

        function runFirebaseLogic() {

          writeToFirestore("medium", {
            "PlayerID": playerID,
            "Mode": "Lives",
            "Lives Purchased": "+" + selectedLives,
            "Total Lives": lives, 
            "Date": window.serverTimestamp()
          });
        }

        //Run immediately if Firebase is already ready
        if (window.firebaseReady) {
          runFirebaseLogic();
        } else {
        // Or wait for the event if not ready yet
          window.addEventListener("firebase-ready", runFirebaseLogic);
        }

        if(token){
          sendToServerLives({
            difficulty: "Medium",
            mode: "Lives",
            lives_purchased: selectedLives,
            total_lives: lives 
          });
        }

      } 
    }

    
  });

}

createGame("imgContainer1", ".minion1","resetButton1", "timer1", "modalContainer1", "gameOver1", 8, 1);

// Wait for the HTML to be fully loaded before running this code
window.addEventListener("DOMContentLoaded", function () {
  const totalPointsKey = "totalPointsMedium";
  const storedPoints = localStorage.getItem(totalPointsKey);

  // Display total points if available
  if (storedPoints !== null) {
    document.getElementById("totalPoints").textContent = storedPoints;
  }

  // Loop through each level to load and display high scores and best moves
  for (let level = 1; level <= 10; level++) {
    const highScoreKey = `highScoreMediumLvl${level}`;
    const bestMovesKey = `bestMovesMediumLvl${level}`;

    const storedHighScore = localStorage.getItem(highScoreKey);
    const storedBestMoves = localStorage.getItem(bestMovesKey);

    // Display high score for this level if it exists
    if (storedHighScore !== null) {
      const highScoreElem = document.getElementById(`highScoreValue${level}`);
      if (highScoreElem) {
        highScoreElem.textContent = storedHighScore;
      }
    }

    // Display best moves for this level if it exists
    if (storedBestMoves !== null) {
      const bestMovesElem = document.getElementById(`bestMovesValue${level}`);
      if (bestMovesElem) {
        bestMovesElem.textContent = storedBestMoves;
      }
      
    }
  }
});



const classicModeButton = document.getElementById("classicModeButton");
const modeSelection = document.getElementById("modeSelection");
const livesButton = document.getElementById('livesModeButton');
const livesElement = document.getElementById("lives");
const shop = document.querySelector(".preShop");

classicModeButton.addEventListener("click", function(){
  modeSelection.style.display = "none";
  livesElement.style.display = "none";
  document.body.style.pointerEvents = "auto"; 
  changeLevelOnClick();
  changeBackLevelOnClick();
  
});
livesButton.addEventListener('click', () => {
  modeSelection.style.display = "none";
  classicModeButton.style.display = "none";
  livesElement.style.display = "block";
  document.body.style.pointerEvents = "auto";  
  shop.style.display = "block";

  messageOverButton();

  changeBackLevelOnClick();
});


function messageOverButton(){
  // Message above the next level button only for lives mode
  for (let i = 1; i <= 9; i++) {
    const wrapper = document.getElementById(`wrapMessage${i}`);
    const button = document.getElementById(`nextButton${i}`);

    const message = button.querySelector(".completeMessage");

    wrapper.addEventListener("mouseenter", () => {
      message.style.display = "block";
      message.style.opacity = "1";
    });

    wrapper.addEventListener("mouseleave", () => {
      message.style.display = "none";
      message.style.opacity = "0";
    });
  }
}

//Function to handle lvl transition by clicking on next level button
function changeLevelOnClick() {
  for (let i = 1; i <= 9; i++) {
    const buttonId = "nextButton" + i;
    const button = document.getElementById(buttonId);
    
    if (button) {
      button.addEventListener("click", function() {
        changeLevel(i + 1);
      });
    }
  }
}

//Function to handle lvl transition by clicking on go back button
function changeBackLevelOnClick() {
  for (let i = 2; i <= 10; i++) {
    const backButton = document.getElementById(`backButton${i}`);
    if (backButton) {
      backButton.addEventListener("click", () => {
        changeBackLevel(i);
      });
    }
  }
}



//Function to handle lvl transition by clicking on next level button for lives mode
function changeLevelOnClickForLivesMode(buttonNumber, nextLevel) {
  const buttonId = "nextButton" + buttonNumber;
  const button = document.getElementById(buttonId);

  if (button) {
    const clonedButton = button.cloneNode(true); // Clone the button

    // Ensure the cloned button keeps the 'nextButton' class
    clonedButton.classList.add("nextButton");

    // Keep the same ID 
    clonedButton.id = buttonId;
    
     // Find the span inside the cloned button
    const span = clonedButton.querySelector('.completeMessage');

    // Retain the class and text for the span
    span.classList.add("completeMessage");

    // Replace old button with the clone
    button.parentNode.replaceChild(clonedButton, button);

    // Add the event listener to the new button
    clonedButton.addEventListener("click", function () {
      changeLevel(nextLevel);
    });
  }
}


//Function to go back to lvl 1 for lives mode
function changeBackToLevelOne() {
  // Hide all levels (1–10)
  for (let i = 1; i <= 10; i++) {
    const levelEl = document.getElementById(`level${i}`);
    if (levelEl) levelEl.style.display = "none";
  }


  // Show level 1
  document.getElementById("level1").style.display = "block";

  // Reset event listeners for next level button 1 to 9
  for (let i = 1; i <= 9; i++) {
    const oldButton = document.getElementById(`nextButton${i}`);
    const newButton = oldButton.cloneNode(true);
    oldButton.parentNode.replaceChild(newButton, oldButton);
    
  }

   // Reattach hover message 
  messageOverButton();

  // Create game for level 1
  createGame("imgContainer1", ".minion1","resetButton1", "timer1", "modalContainer1", "gameOver1", 8, 1);
}


function changeLevel(level) {

  // Stop timer of previous level
  const prevTimer = levelTimers[level - 1];
  if (prevTimer) clearInterval(prevTimer);

  // Reset timer display and variables for previous level
  const prevTimerElement = document.getElementById(`timer${level - 1}`);
  if (prevTimerElement) prevTimerElement.textContent = "00:00";
 
  // Clears the previous level's numbers
  document.getElementById(`level${level - 1}`).style.display = "none";
  

  // Displays the current level
  document.getElementById(`level${level}`).style.display = "block";


  // Create the game for the current level
  const imgContainerId = `imgContainer${level}`;
  const minionClass = `.minion${level}`;
  const resetButton = `resetButton${level}`
  const timerId = `timer${level}`
  const modalContainerId = `modalContainer${level}`;
  const gameOverId = `gameOver${level}`;
  const numberCount = 8 + ((level - 1) * 2); // Adjust the count based on level
  const levelNumber = level;

  createGame(imgContainerId, minionClass, resetButton, timerId, modalContainerId, gameOverId, numberCount, levelNumber);

}


function changeBackLevel(level){

  // Stop current level's timer
  const currTimer = levelTimers[level];
  if (currTimer) clearInterval(currTimer);


  // Reset timer display and variables for current level
  const currTimerElement = document.getElementById(`timer${level}`);
  if (currTimerElement) currTimerElement.textContent = "00:00";

  // Clears the current level's numbers
  document.getElementById(`level${level}`).style.display = "none";

    
  // Displays the previous level
  document.getElementById(`level${level - 1}`).style.display = "block";
  
  // Create the game for the current level
  const imgContainerId = `imgContainer${level - 1}`;
  const minionClass = `.minion${level - 1}`;
  const resetButton = `resetButton${level - 1}`
  const timerId = `timer${level - 1}`
  const modalContainerId = `modalContainer${level - 1}`;
  const gameOverId = `gameOver${level - 1}`;
  const numberCount = 6 + ((level - 1) * 2); // Adjust the count based on level
  const levelNumber = level - 1;
  
  createGame(imgContainerId, minionClass, resetButton, timerId, modalContainerId, gameOverId, numberCount, levelNumber);
}


document.getElementById("backButton1").addEventListener("click", () => {
  window.location.assign("./menu.html");
});


// Show the shop panel when the shop icon is clicked
const shopIcon = document.querySelector(".shopIcon");
if (shopIcon) {
  shopIcon.addEventListener("click", function () {
    document.getElementById("shopPanel").style.display = "block";
  });
}

// Show the shop panel when the shop title is clicked
document.querySelector(".preShop").addEventListener("click", function () {
  document.getElementById("shopPanel").style.display = "block";
});

// Hide the shop panel when the close button is clicked
document.querySelector(".closeButtonShop").addEventListener("click", function () {
  document.getElementById("shopPanel").style.display = "none";
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


// Get references to the audio element and volume controls
const volumeSlider = document.getElementById("volume");
const volumeInput = document.getElementById("volumeValue");
const backgroundmusic = document.getElementById("backgroundmusic");

// Function to apply volume based on user input
function applyVolume(value) {
  const clamped = Math.max(0, Math.min(100, value));       // Keep value between 0 and 100
  const normalized = clamped / 100;                        // Convert to 0.0–1.0 for audio volume
  volumeSlider.value = clamped;                            // Sync slider
  volumeInput.value = clamped;                             // Sync number input
  backgroundmusic.volume = normalized;                     // Set actual audio volume for backgroundmusic
}

// Update volume when the slider is moved
volumeSlider.addEventListener("input", () => {
  applyVolume(volumeSlider.value);
});

// Update volume when a number is typed into the input
volumeInput.addEventListener("change", () => {
  applyVolume(volumeInput.value);
  
});

// Set initial volume on page load
applyVolume(15);


function zoomInOut() {
  const zoomSlider = document.getElementById("zoom");
  const zoomInput = document.getElementById("zoomValue");

  // Get all levels that need zooming
  const levelElements = [];
  for (let i = 1; i <= 5; i++) {
    const el = document.getElementById(`level${i}`);
    if (el) levelElements.push(el);
  }

  function applyZoom(value) {
    const clamped = Math.max(50, Math.min(200, value));   // Keep value between 50 and 200
    zoomSlider.value = clamped;                           // Sync slider
    zoomInput.value = clamped;                            // Sync number input
    const scale = clamped / 100;                          // Convert to 0.5–2.0 

    // Apply zoom to all level elements
    levelElements.forEach(level => {
      level.style.transform = `scale(${scale})`;
      
    });
  }

  // Update zoom when the slider is moved
  zoomSlider.addEventListener("input", () => {
    applyZoom(zoomSlider.value)
  });

  // Update zoom when a number is typed into the input
  zoomInput.addEventListener("change", () => {
    applyZoom(zoomInput.value)
  });

  // Set initial zoom to 100
  applyZoom(100); 
}


zoomInOut();



const themeSelect = document.getElementById("theme");
const lightImg = document.getElementById("lightmode");
const darkImg = document.getElementById("darkmode");

function updateThemeBackground() {
  const theme = themeSelect.value;
  if (theme === "light") {
    lightImg.style.display = "block";
    darkImg.style.display = "none";
  } else if (theme === "dark") {
    lightImg.style.display = "none";
    darkImg.style.display = "block";
  }
}

// Update on selection change
themeSelect.addEventListener("change", updateThemeBackground);


updateThemeBackground();


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
    themeLabel: "Theme",
    themeOptions: {
      light: "Light",
      dark: "Dark"
    },
    volumeLabel: "Volume",
    zoomLabel: "Zoom",
    levelTitles: {
      level1: "Level 1",
      level2: "Level 2",
      level3: "Level 3",
      level4: "Level 4",
      level5: "Level 5",
      level6: "Level 6",
      level7: "Level 7",
      level8: "Level 8",
      level9: "Level 9",
      level10: "Level 10"
    },
    timeDisplay: "Time:",
    backButton: "Go Back",
    resetButton: "Reset Game",
    nextButton: "Next Level",
    modalTitle: "Congratulations!",
    score: "Your Score:",
    highScore: "High Score:",
    moves: "Your Moves:",
    bestMoves: "Best Moves:",
    points: "Points Earned:",
    totalPoints: "Total Points:",
    pointsOnScreen: "🪙Points:",
    livesOnScreen: "❤️Lives:",
    shopOnScreen: "Shop",
    selectGameMode: "Select Game Mode",
    classicMode: "Classic Mode",
    livesMode: "Lives Mode",
    restartButton: "Restart",
    message: "Complete this level to continue"
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
    themeLabel: "Anzeige",
    themeOptions: {
      light: "Hell",
      dark: "Dunkel"
    },
    volumeLabel: "Lautstärke",
    zoomLabel: "Zoom",
    levelTitles: {
      level1: "Stufe 1",
      level2: "Stufe 2",
      level3: "Stufe 3",
      level4: "Stufe 4",
      level5: "Stufe 5",
      level6: "Stufe 6",
      level7: "Stufe 7",
      level8: "Stufe 8",
      level9: "Stufe 9",
      level10: "Stufe 10"
    },
    timeDisplay: "Zeit:",
    backButton: "Zurück",
    resetButton: "Zurücksetzen",
    nextButton: "Nächste",
    modalTitle: " Glückwunsch!",
    score: "Dein Punktestand:",
    highScore: "Höchster Punktestand:",
    moves: "Deine Züge:",
    bestMoves: "Beste Züge:",
    points: "Erreichte Punkte:",
    totalPoints: "Gesamtpunktzahl:",
    pointsOnScreen: "🪙Punkte:",
    livesOnScreen: "❤️Leben:",
    shopOnScreen: "Shop",
    selectGameMode: "Wählen Sie den Spielmodus",
    classicMode: "Klassischer Modus",
    livesMode: "Leben Modus",
    restartButton: "Neustart",
    message: "Level abschließen, um weiterzukommen"
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
    themeLabel: "Thème",
    themeOptions: {
      light: "Clair",
      dark: "Sombre"
    },
    volumeLabel: "Volume",
    zoomLabel: "Zoom",
    levelTitles: {
      level1: "Niveau 1",
      level2: "Niveau 2",
      level3: "Niveau 3",
      level4: "Niveau 4",
      level5: "Niveau 5",
      level6: "Niveau 6",
      level7: "Niveau 7",
      level8: "Niveau 8",
      level9: "Niveau 9",
      level10: "Niveau 10"
    },
    timeDisplay: "Temps:",
    backButton: "Précédent",
    resetButton: "Réinitialiser",
    nextButton: "Suivant",
    modalTitle: "Félicitations!",
    score: "Votre score:",
    highScore: "Meilleur score:",
    moves: "Vos coups:",
    bestMoves: "Meilleurs coups:",
    points: "Points gagnés:",
    totalPoints: "Total des points:",
    pointsOnScreen: "🪙Points:",
    livesOnScreen: "❤️Vies :",
    shopOnScreen: "Boutique",
    selectGameMode: "Sélectionner le mode de jeu",
    classicMode: "Mode Classique",
    livesMode: "Mode Vies",
    restartButton: "Redémarrer",
    message: "Terminez ce niveau pour continuer"
  }
};

const languageSelect = document.querySelector("select");
let preSeting = document.getElementById("preSettings");
let settings = document.getElementById("settings");
let langLabel = document.getElementById("languageLabel");
let langOptionEN = document.getElementById("en");
let langOptionDE = document.getElementById("de");
let langOptionFR = document.getElementById("fr");
let theme = document.getElementById("themeLabel");
let themeOptionLight = document.getElementById("light");
let themeOptionDark = document.getElementById("dark");
let volume = document.getElementById("volumeLabel");
let zoom = document.getElementById("zoomLabel");
const lvls = [
  document.getElementById("levelTitle1"),
  document.getElementById("levelTitle2"),
  document.getElementById("levelTitle3"),
  document.getElementById("levelTitle4"),
  document.getElementById("levelTitle5"),
  document.getElementById("levelTitle6"),
  document.getElementById("levelTitle7"),
  document.getElementById("levelTitle8"),
  document.getElementById("levelTitle9"),
  document.getElementById("levelTitle10")
];
const times = [
  document.getElementById("time1"),
  document.getElementById("time2"),
  document.getElementById("time3"),
  document.getElementById("time4"),
  document.getElementById("time5"),
  document.getElementById("time6"),
  document.getElementById("time7"),
  document.getElementById("time8"),
  document.getElementById("time9"),
  document.getElementById("time10")
];
const backButtons = [
  document.getElementById("backButton1"),
  document.getElementById("backButton2"),
  document.getElementById("backButton3"),
  document.getElementById("backButton4"),
  document.getElementById("backButton5"),
  document.getElementById("backButton6"),
  document.getElementById("backButton7"),
  document.getElementById("backButton8"),
  document.getElementById("backButton9"),
  document.getElementById("backButton10")
];
const resetButtons = [
  document.getElementById("resetButton1"),
  document.getElementById("resetButton2"),
  document.getElementById("resetButton3"),
  document.getElementById("resetButton4"),
  document.getElementById("resetButton5"),
  document.getElementById("resetButton6"),
  document.getElementById("resetButton7"),
  document.getElementById("resetButton8"),
  document.getElementById("resetButton9"),
  document.getElementById("resetButton10")
];
const nextButtons = [
  document.getElementById("nextButton1"),
  document.getElementById("nextButton2"),
  document.getElementById("nextButton3"),
  document.getElementById("nextButton4"),
  document.getElementById("nextButton5")
];

const modalTitles = [
  document.getElementById("modalTitle1"),
  document.getElementById("modalTitle2"),
  document.getElementById("modalTitle3"),
  document.getElementById("modalTitle4"),
  document.getElementById("modalTitle5"),
  document.getElementById("modalTitle6"),
  document.getElementById("modalTitle7"),
  document.getElementById("modalTitle8"),
  document.getElementById("modalTitle9"),
  document.getElementById("modalTitle10")
];
const scores = [
  document.getElementById("score1"),
  document.getElementById("score2"),
  document.getElementById("score3"),
  document.getElementById("score4"),
  document.getElementById("score5"),
  document.getElementById("score6"),
  document.getElementById("score7"),
  document.getElementById("score8"),
  document.getElementById("score9"),
  document.getElementById("score10")
];
const highScores = [
  document.getElementById("highScore1"),
  document.getElementById("highScore2"),
  document.getElementById("highScore3"),
  document.getElementById("highScore4"),
  document.getElementById("highScore5"),
  document.getElementById("highScore6"),
  document.getElementById("highScore7"),
  document.getElementById("highScore8"),
  document.getElementById("highScore9"),
  document.getElementById("highScore10")
];
const moves = [
  document.getElementById("moves1"),
  document.getElementById("moves2"),
  document.getElementById("moves3"),
  document.getElementById("moves4"),
  document.getElementById("moves5"),
  document.getElementById("moves6"),
  document.getElementById("moves7"),
  document.getElementById("moves8"),
  document.getElementById("moves9"),
  document.getElementById("moves10")
];
const bestMoves = [
  document.getElementById("bestMoves1"),
  document.getElementById("bestMoves2"),
  document.getElementById("bestMoves3"),
  document.getElementById("bestMoves4"),
  document.getElementById("bestMoves5"),
  document.getElementById("bestMoves6"),
  document.getElementById("bestMoves7"),
  document.getElementById("bestMoves8"),
  document.getElementById("bestMoves9"),
  document.getElementById("bestMoves10")
];
const points = [
  document.getElementById("points1"),
  document.getElementById("points2"),
  document.getElementById("points3"),
  document.getElementById("points4"),
  document.getElementById("points5"),
  document.getElementById("points6"),
  document.getElementById("points7"),
  document.getElementById("points8"),
  document.getElementById("points9"),
  document.getElementById("points10")
];
const totalPoints = [
  document.getElementById("totalPoints1"),
  document.getElementById("totalPoints2"),
  document.getElementById("totalPoints3"),
  document.getElementById("totalPoints4"),
  document.getElementById("totalPoints5"),
  document.getElementById("totalPoints6"),
  document.getElementById("totalPoints7"),
  document.getElementById("totalPoints8"),
  document.getElementById("totalPoints9"),
  document.getElementById("totalPoints10")

];
let pointsOncScrn = document.querySelector(".pointsOnScreen");
let livesOnScrn = document.getElementById("lives");
let shopOnScrn = document.querySelector(".preShop");
let shopTitle = document.getElementById("shopTitle");
let selectGameModeTitle = document.querySelector(".selectModeTitle");
let classicModeButn = document.getElementById("classicModeButton");
let livesModeButn = document.getElementById("livesModeButton");
const restartButtons = [
  document.getElementById("restart1"),
  document.getElementById("restart2"),
  document.getElementById("restart3"),
  document.getElementById("restart4"),
  document.getElementById("restart5"),
  document.getElementById("restart6"),
  document.getElementById("restart7"),
  document.getElementById("restart8"),
  document.getElementById("restart9"),
  document.getElementById("restart10")
];
const messageHovers = [
  document.getElementById("completeMessage1"),
  document.getElementById("completeMessage2"),
  document.getElementById("completeMessage3"),
  document.getElementById("completeMessage4")
];



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
    theme.innerText =translations.en.themeLabel;
    themeOptionLight.innerText = translations.en.themeOptions.light;
    themeOptionDark.innerText = translations.en.themeOptions.dark;
    volume.innerText = translations.en.volumeLabel;
    zoom.innerText = translations.en.zoomLabel;
    lvls.forEach((lvl, index) => {
      lvl.innerText = translations.en.levelTitles[`level${index + 1}`];
    });
    times.forEach(time => {
      time.innerText = translations.en.timeDisplay;
    });
    backButtons.forEach(backButton => {
      backButton.innerText = translations.en.backButton;
    });
    resetButtons.forEach(resetButton => {
      resetButton.innerText = translations.en.resetButton;
    });
    document.querySelectorAll(".nextButton").forEach(nextButton => {
      nextButton.childNodes[0].nodeValue = translations.en.nextButton + " ";
    });
    modalTitles.forEach(modalTitle => {
      modalTitle.innerText = translations.en.modalTitle;
    });
    scores.forEach(score => {
      score.childNodes[0].nodeValue = translations.en.score + " ";
    });
    highScores.forEach(highScore => {
      highScore.childNodes[0].nodeValue = translations.en.highScore + " ";
    });
    moves.forEach(move => {
      move.childNodes[0].nodeValue = translations.en.moves + " ";
    });
    bestMoves.forEach(bestMove => {
      bestMove.childNodes[0].nodeValue = translations.en.bestMoves + " ";
    });
    points.forEach(point => {
      point.childNodes[0].nodeValue = translations.en.points + " ";
    });
    totalPoints.forEach(totalPoint => {
      totalPoint.childNodes[0].nodeValue = translations.en.totalPoints + " ";
    });
    pointsOncScrn.childNodes[0].nodeValue = translations.en.pointsOnScreen + " ";
    livesOnScrn.childNodes[0].nodeValue = translations.en.livesOnScreen + " ";
    shopOnScrn.childNodes[0].nodeValue = translations.en.shopOnScreen + " ";
    shopTitle.innerText = translations.en.shopOnScreen;
    selectGameModeTitle.innerText = translations.en.selectGameMode;
    classicModeButn.innerText = translations.en.classicMode;
    livesModeButn.innerText = translations.en.livesMode;
    restartButtons.forEach(restartButton => {
      restartButton.innerText = translations.en.restartButton;
    });
    document.querySelectorAll(".completeMessage").forEach(messageHover => {
      messageHover.innerText = translations.en.message;
    });
  } else if(language == "de"){
    preSeting.childNodes[0].nodeValue = translations.de.preSettings + " ";
    settings.innerText = translations.de.settingsTitle;
    langLabel.innerText = translations.de.languageLabel;
    langOptionEN.innerText = translations.de.languageOptions.en;
    langOptionDE.innerText = translations.de.languageOptions.de;
    langOptionFR.innerText = translations.de.languageOptions.fr;
    theme.innerText =translations.de.themeLabel;
    themeOptionLight.innerText = translations.de.themeOptions.light;
    themeOptionDark.innerText = translations.de.themeOptions.dark;
    volume.innerText = translations.de.volumeLabel;
    zoom.innerText = translations.de.zoomLabel;
    lvls.forEach((lvl, index) => {
        lvl.innerText = translations.de.levelTitles[`level${index + 1}`];
    });
    times.forEach(time => {
      time.innerText = translations.de.timeDisplay;
    });
    backButtons.forEach(backButton => {
      backButton.innerText = translations.de.backButton;
    });
    resetButtons.forEach(resetButton => {
      resetButton.innerText = translations.de.resetButton;
    });;
    document.querySelectorAll(".nextButton").forEach(nextButton => {
      nextButton.childNodes[0].nodeValue = translations.de.nextButton + " ";
    });
    modalTitles.forEach(modalTitle => {
      modalTitle.innerText = translations.de.modalTitle;
    });
    scores.forEach(score => {
      score.childNodes[0].nodeValue = translations.de.score + " ";
    });
    highScores.forEach(highScore => {
      highScore.childNodes[0].nodeValue = translations.de.highScore + " ";
    });
    moves.forEach(move => {
      move.childNodes[0].nodeValue = translations.de.moves + " ";
    });
    bestMoves.forEach(bestMove => {
      bestMove.childNodes[0].nodeValue = translations.de.bestMoves + " ";
    });
    points.forEach(point => {
      point.childNodes[0].nodeValue = translations.de.points + " ";
    });
    totalPoints.forEach(totalPoint => {
      totalPoint.childNodes[0].nodeValue = translations.de.totalPoints + " ";
    });
    pointsOncScrn.childNodes[0].nodeValue = translations.de.pointsOnScreen + " ";
    livesOnScrn.childNodes[0].nodeValue = translations.de.livesOnScreen + " ";
    shopOnScrn.childNodes[0].nodeValue = translations.de.shopOnScreen + " ";
    shopTitle.innerText = translations.de.shopOnScreen;
    selectGameModeTitle.innerText = translations.de.selectGameMode;
    classicModeButn.innerText = translations.de.classicMode;
    livesModeButn.innerText = translations.de.livesMode;
    restartButtons.forEach(restartButton => {
      restartButton.innerText = translations.de.restartButton;
    });
    document.querySelectorAll(".completeMessage").forEach(messageHover => {
      messageHover.innerText = translations.de.message;
    });
  } else if(language == "fr"){
    preSeting.childNodes[0].nodeValue = translations.fr.preSettings + " ";
    settings.innerText = translations.fr.settingsTitle;
    langLabel.innerText = translations.fr.languageLabel;
    langOptionEN.innerText = translations.fr.languageOptions.en;
    langOptionDE.innerText = translations.fr.languageOptions.de;
    langOptionFR.innerText = translations.fr.languageOptions.fr;
    theme.innerText =translations.fr.themeLabel;
    themeOptionLight.innerText = translations.fr.themeOptions.light;
    themeOptionDark.innerText = translations.fr.themeOptions.dark;
    volume.innerText = translations.fr.volumeLabel;
    zoom.innerText = translations.fr.zoomLabel;
    lvls.forEach((lvl, index) => {
      lvl.innerText = translations.fr.levelTitles[`level${index + 1}`];
    });
    times.forEach(time => {
      time.innerText = translations.fr.timeDisplay;
    });
    backButtons.forEach(backButton => {
      backButton.innerText = translations.fr.backButton;
    });
    resetButtons.forEach(resetButton => {
      resetButton.innerText = translations.fr.resetButton;
    });
    document.querySelectorAll(".nextButton").forEach(nextButton => {
      nextButton.childNodes[0].nodeValue = translations.fr.nextButton + " ";
    });
    modalTitles.forEach(modalTitle => {
      modalTitle.innerText = translations.fr.modalTitle;
    });

    scores.forEach(score => {
      score.childNodes[0].nodeValue = translations.fr.score + " ";
    });
    highScores.forEach(highScore => {
      highScore.childNodes[0].nodeValue = translations.fr.highScore + " ";
    });
    moves.forEach(move => {
      move.childNodes[0].nodeValue = translations.fr.moves + " ";
    });
    bestMoves.forEach(bestMove => {
      bestMove.childNodes[0].nodeValue = translations.fr.bestMoves + " ";
    });
    points.forEach(point => {
      point.childNodes[0].nodeValue = translations.fr.points + " ";
    });
    totalPoints.forEach(totalPoint => {
      totalPoint.childNodes[0].nodeValue = translations.fr.totalPoints + " ";
    });
    pointsOncScrn.childNodes[0].nodeValue = translations.fr.pointsOnScreen + " "; 
    livesOnScrn.childNodes[0].nodeValue = translations.fr.livesOnScreen + " ";
    shopOnScrn.childNodes[0].nodeValue = translations.fr.shopOnScreen + " ";
    shopTitle.innerText = translations.fr.shopOnScreen;
    selectGameModeTitle.innerText = translations.fr.selectGameMode;
    classicModeButn.innerText = translations.fr.classicMode;
    livesModeButn.innerText = translations.fr.livesMode;
    restartButtons.forEach(restartButton => {
      restartButton.innerText = translations.fr.restartButton;
    });
    document.querySelectorAll(".completeMessage").forEach(messageHover => {
      messageHover.innerText = translations.fr.message;
    });
  }

};    