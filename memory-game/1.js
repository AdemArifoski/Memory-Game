// Variables to track the state of flipped cards and checking status
let firstFlippedCard = null;  
let secondFlippedCard = null;
let isChecking = false; 

let matchCount = 0; // Counter for matched pairs
let totalPairs = 4;

const timer = document.querySelector("#timer"); 

let startTime = 0;
let elapsedTime = 0; 
let intervalId; 
let mins = 0; 
let secs = 0; 

// Function to display rows of numbers in the game
function displayRowNumbers(containerId, className) {
  let numbers = [1, 2, 3, 4]; // Numbers to display

  // Function to display the numbers in the specified container
  function displayNumbers(nums) {
    document.getElementById(containerId).innerHTML = ""; // Clear existing numbers

    for (let i = 0; i < nums.length; i++) {
      let box = document.createElement("div"); 
      box.className = className; 
      box.innerHTML = nums[i]; 
      box.dataset.value = nums[i]; 

      // Click event for the card
      box.onclick = function() {
        if (isChecking || this.classList.contains("boxOpen")) return; // Ignore if already open or checking
        this.classList.add("boxOpen"); // Mark the card as open


        if (!firstFlippedCard) { // If no card is flipped yet
          firstFlippedCard = this; // Set the first flipped card

          // Start the timer only if it hasn't been started yet
          if (!intervalId) {
            startTime = Date.now() - elapsedTime; // Calculate the start time
            intervalId = setInterval(updateTime, 1000); // Start the timer
          }

        } else { // If a card is already flipped
          secondFlippedCard = this; // Set the second flipped card
          isChecking = true; // Indicate checking is in progress

          // Check if the values of the two flipped cards match
          if (firstFlippedCard.dataset.value === secondFlippedCard.dataset.value) {

            // Match found
            matchCount++; // Increment match counter

            // Check if all matches are found
            if (matchCount === totalPairs) {
              clearInterval(intervalId); // Stop the timer
            }

            // Match found, reset cards
            firstFlippedCard = null;
            secondFlippedCard = null;
            isChecking = false;

          } else {
            // No match, hide cards after a short delay
            setTimeout(() => {
              firstFlippedCard.classList.remove("boxOpen");
              secondFlippedCard.classList.remove("boxOpen");
              firstFlippedCard = null;
              secondFlippedCard = null;
              isChecking = false; // Reset checking status
            }, 1200);
          }
        }
      };

      // Append the box to the specified container
      document.querySelector(`#${containerId}`).appendChild(box);
    }
  }

  // Shuffle and display the numbers
  let shuffledNumbers = numbers.sort(() => Math.random() - 0.5);
  displayNumbers(shuffledNumbers);

  // Reset button functionality
  document.getElementById("resetButton").addEventListener('click', function() {
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

    // Shuffle and display new numbers
    let newShuffledNumbers = numbers.sort(() => Math.random() - 0.5);
    displayNumbers(newShuffledNumbers);
  });
}

// Call the function for both rows
displayRowNumbers("numberContainer", "number");
displayRowNumbers("numberContainer2", "number2");

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











