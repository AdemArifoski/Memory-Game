import express from "express"
import db from "../db.js"

const router = express.Router()

// Get all lives for logged-in user
router.get("/", (req, res) => { 
  const lives = db.prepare("SELECT * FROM player_lives WHERE player_id = ?")   
  const results = lives.all(req.playerId)
  res.json(results) 
})

router.post("/", (req, res) => {
  const { 
    difficulty, 
    mode, 
    lives_purchased, 
    total_lives 
  } = req.body;
  

  const insertLives = db.prepare(`
    INSERT INTO player_lives
    (player_id, difficulty, mode, lives_purchased, total_lives)
    VALUES (?, ?, ?, ?, ?)
  `);

  const result = insertLives.run(
    req.playerId,
    difficulty,
    mode,
    lives_purchased,
    total_lives
  );

  res.json({
    id: result.lastInsertRowid,
    difficulty,
    mode,
    lives_purchased,
    total_lives
  });
});

export default router