import express from "express"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import db from "../db.js"

const router = express.Router()

// Register a new user endpoint /auth/register
router.post("/register", (req, res) => {
  const { username, password } = req.body
  // save the username and an irreversibly encrypted password
  // save gilgamesh@gmail.com | ahaahah.ahahahah.ahahaahah

  // encrypt the password
  const hashedPassword = bcrypt.hashSync(password, 8)

  // save the new user and hashed password to the db
  try {
    const insertUser = db.prepare(`INSERT INTO players (username, password)
    VALUES (?, ?)`)
    const result = insertUser.run(username, hashedPassword)


    // Insert a default game result for the new player
    const insertDefaultGame = db.prepare(`
      INSERT INTO game_results
      (player_id, difficulty, mode, level, time, number_of_times_played, moves, points, best_time, best_moves, total_points)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    insertDefaultGame.run(
      result.lastInsertRowid,       
      "Easy",            
      "Classic",            
      "Level 1 not completed",                 
      "00:00",           
      "Level 1 played 0 times",                 
      0,                 
      0,                 
      "00:00",           
      0,                 
      0                  
    );

    // Insert a default lives for the new player
    const insertDefaultLives = db.prepare(`
      INSERT INTO player_lives
      (player_id, difficulty, mode, lives_purchased, total_lives)
      VALUES (?, ?, ?, ?, ?)
    `);

    insertDefaultLives.run(
      result.lastInsertRowid,       
      "Easy",            
      "Lives",            
      0,                 
      5,                             
    );

    // create a token
    const token = jwt.sign({id: result.lastInsertRowid}, process.env.JWT_SECRET, { expiresIn: "1m" })
    res.json({ token })
  } catch (err) {
    console.log(err.message)
    res.sendStatus(503)
  }

})

router.post("/login", (req, res) => { 
  // we get their email, and we look up the password associated with that email in the database
  // but we get it back and see it's encrypted, which means that we cannot compare it 
  // to the one the user just trying to login
  // so what we can do, is again, one way encrypt the password the user just entered

  const {username, password} = req.body

  try {
    const getPlayer = db.prepare("SELECT * FROM players WHERE username = ?")
    const player = getPlayer.get(username)

    // if we cannot find a player associated with that username, return out from the function
    if (!player) {return res.status(404).send({message: "User not found"})}

    const passwordIsValid = bcrypt.compareSync(password, player.password)
    // if the password does not match, return out of the function
    if (!passwordIsValid) {return res.status(401).send({message: "Invalid password"})}
    console.log(player)
    // then we have a successful authentication
    const token = jwt.sign({ id: player.id}, process.env.JWT_SECRET, {expiresIn: "1m"})
    res.json({ token })
  } catch (err) {
    console.log(err.message)
    res.sendStatus(503)
  }
})


export default router
