import express from "express"
import db from "../db.js"

const router = express.Router()

// Get all scores for logged-in user
router.get("/", (req, res) => { 
  const getGameResults = db.prepare("SELECT * FROM game_results WHERE player_id = ?")   
  const results = getGameResults.all(req.playerId)
  res.json(results) 
})



// Create a player entry
router.post("/", (req,res) => { 
  const {
    difficulty,
    mode,
    level,
    time,
    number_of_times_played,
    moves,
    points,
    best_time,
    best_moves,
    total_points
  } = req.body;


  const insertResult = db.prepare(`
    INSERT INTO game_results 
    (player_id, difficulty, mode, level, time, number_of_times_played, moves, points, best_time, best_moves, total_points) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  const result = insertResult.run(
      req.playerId, 
      difficulty, 
      mode, 
      level, 
      time, 
      number_of_times_played, 
      moves, 
      points, 
      best_time, 
      best_moves, 
      total_points
  );
  
  res.json({
      id: result.lastInsertRowid,
      difficulty,
      mode,
      level,
      time,
      number_of_times_played,
      moves,
      points,
      best_time,
      best_moves,
      total_points
  });
})




export default router