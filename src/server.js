import express from "express"
import path, { dirname } from "path"
import { fileURLToPath } from "url"
import authRoutes from "./routes/authRoutes.js"
import gameRoutes from "./routes/gameRoutes.js"
import livesRoutes from "./routes/livesRoutes.js"
import authMiddleware from "./middleware/authMiddleware.js"

const app = express ()
const PORT = process.env.PORT || 5003

// Get the file path from the URL of the current module
const __filename = fileURLToPath(import.meta.url)
// Get the directory name from the file path
const __dirname = dirname(__filename)

// Middleware (this is to expect json so it can parse/ interpret the configuration)
app.use(express.json())
// Serves the HTML file from the /memory-game directory
// Tells express to serve all files from the public folder as static assets / file
// Any request for the css files will be resolved to the public directory
// .. is for up one level
app.use(express.static(path.join(__dirname, "../memory-game")))

// Serve favicon
app.use('/favicon_io', express.static(path.join(__dirname, "../favicon_io")));

// Serve memory-game-pictures folder (videos)
app.use('/memory-game-pictures', express.static(path.join(__dirname, "../memory-game-pictures")));

// Serving up the HTML file from the /memory-game directory
app.get("/", (req,res) => {
    res.sendFile(path.join(__dirname, "../memory-game/menu.html"))
})


// Routes
app.use("/auth", authRoutes)
app.use("/game_results", authMiddleware, gameRoutes)
app.use("/player_lives", authMiddleware, livesRoutes)


app.listen(PORT, () =>{
    console.log(`server has started on port: ${PORT}` )
})
