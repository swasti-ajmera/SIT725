const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const cors = require("cors");
const catController = require("./controllers/catController");
const { connectDB } = require("./models/catModel");

// New
const http = require("http");  // For creating the HTTP server
const socketIo = require("socket.io"); // Importing socket.io correctly

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));

// Routes
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "index.html"));
});

app.get("/api/cats", catController.getCats);
app.post("/api/cat", catController.addCat);

// MongoDB connection and server start
connectDB()
  .then(() => {
    // Create HTTP server and attach socket.io
    const server = http.createServer(app);
    const io = socketIo(server);

    io.on("connection", (socket) => {
      console.log("a user connected");

      socket.on("disconnect", () => {
        console.log("user disconnected");
      });
    });

    // Start the server after successful DB connection
    server.listen(port, () => {
      console.log(`Server started on port ${port}`);
    });
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
    process.exit(1);
  });
