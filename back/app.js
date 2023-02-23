const express = require("express");
const { findMatchWinner } = require("./functions");

const port = 3001;

const app = express();
app.use(express.json());
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

// Configuration des en-têtes
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});

// Configuration de la route et de la réponse
app.post("/api/results", (req, res) => {
  const { list, players } = req.body;
  const player1 = players[0];
  const player2 = players[1];

  try {
    if (!list || !players) {
      throw new Error();
    }

    const { results, winner } = findMatchWinner(player1, player2, list);
    res.status(200).json({ results, winner });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});
