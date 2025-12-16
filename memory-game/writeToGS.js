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
  const scriptURL = "https://script.google.com/macros/s/AKfycbyzEsrf054wCW8OKgKcQoTxlOs2HC1JlQXHpLruVb8wDS3_FPXlb_zhCYDeSpL_l_rJSQ/exec"
  const start = performance.now();

  try {
    const res = await fetch(scriptURL, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: new URLSearchParams(data)
    });

    const result = await res.json();

    const end = performance.now();
    const duration = end - start;
    console.log(`Write to Google Sheets took ${duration.toFixed(2)} ms`);
    console.log("success:", result);
    return duration; // Return time taken

  } catch (err) {
    console.log("error:", err);
    return null; // So we can filter it out
  }
}

