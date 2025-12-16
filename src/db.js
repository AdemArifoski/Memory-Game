import { DatabaseSync } from "node:sqlite";

// Check if running on Render (or production)
const isProd = process.env.NODE_ENV;

// Use in-memory for local dev, persistent file for Render
const db = new DatabaseSync(
  isProd ? "/data/game.db" : ":memory:"
);




// Execute SQL statements from strings
db.exec(` 
 CREATE TABLE players (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE,
    password TEXT
  );
`)

db.exec(` 
  CREATE TABLE game_results (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    player_id INTEGER,             
    difficulty TEXT,            
    mode TEXT,                  
    level TEXT,             
    time TEXT,               
    number_of_times_played TEXT,
    moves INTEGER,
    points INTEGER,
    best_time TEXT,
    best_moves INTEGER,
    total_points INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(player_id) REFERENCES players(id)
  );
`)

db.exec(`
  CREATE TABLE player_lives (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    player_id INTEGER,
    difficulty TEXT,
    mode TEXT,
    lives_purchased INTEGER,
    total_lives INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(player_id) REFERENCES players(id)
  );
`)



export default db