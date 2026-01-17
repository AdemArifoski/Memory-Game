
export async function sendToServer(data) {
  let token = localStorage.getItem('token'); 
 
  try {
    const response = await fetch("/game_results", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": token
      },
      body: JSON.stringify(data)
    });

    const result = await response.json();
    console.log("Server response:", result);

    // handle token expiration
    if (result.message === "Token expired") {
      localStorage.removeItem('token'); // remove expired token
      alert("Your session has expired. Go back to menu and log in again.");
    }

  } catch (error) {
    console.error("Failed to send to server:", error);
    
  }
 
}

export async function sendToServerLives(data) {
  let token = localStorage.getItem('token'); 

  try {
    const response = await fetch("/player_lives", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": token
      },
      body: JSON.stringify(data)
    });

    const result = await response.json();
    console.log("Server response:", result);

    // handle token expiration
    if (result.message === "Token expired") {
      localStorage.removeItem('token'); // remove expired token
      alert("Your session has expired. Go back to menu and log in again.");
    }


  } catch (error) {
    console.error("Failed to save player lives:", error);
  }
}


