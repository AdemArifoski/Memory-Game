//Funtion to assign Player ID
export function getOrCreatePlayerID() {
  let playerID = localStorage.getItem("playerID");

  if (!playerID) {
    // Get the last player number (or start at 1)
    let playerNumber = localStorage.getItem("playerNumber");
    playerNumber = playerNumber ? parseInt(playerNumber) + 1 : 1;

    // Save updated player number for next time
    localStorage.setItem("playerNumber", playerNumber);

    // Create a shorter ID like 'player-1', 'player-2', etc.
    playerID = 'player-' + playerNumber;

    // Save the playerID
    localStorage.setItem("playerID", playerID);
  }

  return playerID;
}

export default async function sendToGoogleSheet(data) {
  const scriptURL = "https://script.google.com/macros/s/AKfycbw6e4MqVwMhkGiPu8SKnJJOYvWDNeHuxuSENau3FzWltxfzeaNs1NBrlCukfQJIKrPm/exec"

  try {
    const response = await fetch(scriptURL, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: new URLSearchParams(data)
    });

    const result = await response.json();
    console.log("Sheets response:", result);


  } catch (err) {
    console.log("error:", err);
  }
}



