
export async function sendToServer(data) {
  let token = localStorage.getItem('token'); 
  const start = performance.now();

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
    const duration = performance.now() - start;

    console.log(`Server write took ${duration.toFixed(2)} ms`);
    console.log("Server response:", result);

    // handle token expiration
    if (result.message === "Token expired") {
      localStorage.removeItem('token'); // remove expired token
      alert("Your session has expired. Go back to menu and log in again.");
    }

    return {
      success: true,
      duration,
      result
    };

  } catch (error) {
    const duration = performance.now() - start;
    console.error("Failed to send to server:", error);

    return {
      success: false,
      duration,
      error
    };
  }
}

export async function sendToServerLives(data) {
  let token = localStorage.getItem('token'); 
  const start = performance.now();

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
    const duration = performance.now() - start;

    console.log(`Player lives write took ${duration.toFixed(2)} ms`);
    console.log("Server response:", result);

    // handle token expiration
    if (result.message === "Token expired") {
      localStorage.removeItem('token'); // remove expired token
      alert("Your session has expired. Go back to menu and log in again.");
    }

    return {
      success: true,
      duration,
      result
    };

  } catch (error) {
    const duration = performance.now() - start;

    console.error("Failed to save player lives:", error);

    return {
      success: false,
      duration,
      error
    };
  }
}