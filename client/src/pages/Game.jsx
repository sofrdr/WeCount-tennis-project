import React, { useState } from "react";
import styled from "styled-components";
import PointsList from "../components/PointsList";
import Scores from "../components/Scores";

const Wrapper = styled.main`
  margin: 20px;
  .players-container {
    display: flex;
    flex-direction: row;

    .player1,
    .player2 {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: flex-end;
      margin-right: 30px;
    }

    .player-name,
    .player-level {
      margin: 5px 0;

      > label {
        margin-right: 5px;
      }
      > input {
        width: 200px;
      }
    }
  }
  .score-btn {
    display: flex;
    flex-direction: column;
    width: 200px;
    margin-top: 30px;
  }
  button {
    margin: 5px;
    padding: 5px 10px;
  }
`;

const Game = () => {
  const [player1, setPlayer1] = useState({
    name: "",
    level: 1,
  });

  const [player2, setPlayer2] = useState({
    name: "",
    level: 1,
  });

  const [error, setError] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
  const [isListVisible, setIsListVisible] = useState(false);
  const [list, setList] = useState([]);
  const [winner, setWinner] = useState("");
  const [results, setResults] = useState("");

  const url = "http://localhost:3001/api/results";

  /**
   *
   * @param {string} name
   * @param {function} setPlayer
   *
   * Mettre à jour nom du joueur à chaque changement dans le formulaire
   */
  const updateName = (name, setPlayer) => {
    setPlayer((prevState) => {
      return { ...prevState, name };
    });
  };

  /**
   *
   * @param {number} level
   * @param {function} setPlayer
   *
   * Mettre à jour niveau du joueur à chaque changement dans le formulaire
   */
  const updateLevel = (level, setPlayer) => {
    setPlayer((prevState) => {
      return { ...prevState, level };
    });
  };

  /**
   * Passe isPlaying à true et réinitialise les résultats
   */
  const startGame = () => {
    setIsPlaying(true);
    setResults("");
  };

  /**
   * Réinitialise les states
   */
  const restartGame = () => {
    setIsPlaying(false);
    setResults("");
    setPlayer1({ name: "", level: 1 });
    setPlayer2({ name: "", level: 1 });
    setList([]);
  };

  // Création d'une liste de 150 valeurs aléatoires entre 0 et 10
  const randomValues = [];
  for (let i = 0; i < 150; i++) {
    randomValues.push(Math.random() * 10);
  }

  /**
   *
   * @param {Event} e
   * Génère une liste de points après un contrôle des entrées
   */
  const generatePoints = (e) => {
    e.preventDefault();
    const players = [player1, player2];
    const regex =
      /^(?=.\D{0,}$)[\u00c0-\u01ffa-zA-Z]+(?:['-\s][\u00c0-\u01ffa-zA-Z]+)*$/;
    let pointsArray;
    try {
      setError("");
      for (let player of players) {
        const { level, name } = player;
        if (level === 0) {
          throw new Error("Veuillez selectionner votre niveau");
        }
        if (level < 1 || level > 10) {
          throw new Error("Veuillez sélectionner un niveau entre 1 et 10");
        }
        if (!name || regex.test(name) === false) {
          throw new Error("Veuillez saisir un nom de joueur valide");
        }
      }

      startGame();

      // Si les joueurs sont de même niveau, ils ont chacun 50% de chance de gagner
      pointsArray = randomValues.map((value) => {
        if (player1.level === player2.level) {
          if (value < 5) {
            return player1.name;
          } else {
            return player2.name;
          }
          // Le joueur de meilleur niveau a 70% de chances de gagner
        } else if (player1.level > player2.level) {
          if (value < 7) {
            return player1.name;
          } else {
            return player2.name;
          }
        } else {
          if (value < 7) {
            return player2.name;
          } else {
            return player1.name;
          }
        }
      });
    } catch (error) {
      console.log(error);
      setError(error.message);
    }

    setList(pointsArray);
    setIsListVisible(true);
  };

  /**
   * Envoyer au back un objet list et un objet players
   * On reçoit en réponse un objet winner (le gagnant du match) et un objet results (la liste des résultats)
   */
  const sendResults = async () => {
    const players = [player1.name, player2.name];
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ list, players }),
      });
      const data = await response.json();
      const { results, winner } = data;
      setResults(results);
      setWinner(winner);
    } catch (error) {
      console.log(error);
      setError(error.message);
    }
  };

  return (
    <Wrapper>
      <form onSubmit={generatePoints}>
        <div className="players-container">
          <div className="player1">
            <div className="player-name">
              <label htmlFor="name-player1">Nom joueur 1</label>
              <input
                type="text"
                id="name-player1"
                value={player1.name}
                onChange={(e) => updateName(e.target.value, setPlayer1)}
              />
            </div>
            <div className="player-level">
              <label htmlFor="level-player1">Niveau joueur 1</label>
              <input
                type="number"
                min="1"
                max="10"
                id="level-player1"
                value={player1.level}
                onChange={(e) => updateLevel(e.target.value, setPlayer1)}
              />
            </div>
          </div>

          <div className="player2">
            <div className="player-name">
              <label htmlFor="name-player2">Nom joueur 2</label>
              <input
                type="text"
                id="name-player2"
                value={player2.name}
                onChange={(e) => updateName(e.target.value, setPlayer2)}
              />
            </div>
            <div className="player-level">
              <label htmlFor="level-player2">Niveau joueur 2</label>
              <input
                type="number"
                max="10"
                min="1"
                id="level-player2"
                value={player2.level}
                onChange={(e) => updateLevel(e.target.value, setPlayer2)}
              />
            </div>
          </div>
        </div>

        <button type="submit">Lancer le jeu</button>
      </form>

      <div>{error && <div>{error}</div>}</div>

      {isListVisible && <PointsList list={list} />}
      <div className="score-btn">
        {isPlaying && (
          <button onClick={() => setIsListVisible(!isListVisible)}>
            {isListVisible
              ? "Masquer le détail des points"
              : "Afficher le détail des points"}
          </button>
        )}

        {isPlaying && <button onClick={sendResults}>Voir le score</button>}
      </div>

      {results ? (
        <div>
          <Scores
            results={results}
            winner={winner}
            player1={player1.name}
            player2={player2.name}
          />

          <button onClick={restartGame}>Rejouer</button>
        </div>
      ) : (
        ""
      )}
    </Wrapper>
  );
};

export default Game;
