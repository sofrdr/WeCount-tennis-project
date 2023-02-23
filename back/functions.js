/**
 * Retourne la valeur max d'un tableau
 *
 * @param   {Array}  array
 *
 * @return  {Number}
 */
const getValueMax = (array) => {
  return Math.max.apply(null, array);
};

/**
 * Retourne la valeur min d'un tableau
 *
 * @param   {Array}  array
 *
 * @return  {Number}
 */
const getValueMin = (array) => {
  return Math.min.apply(null, array);
};

/**
 * Calcule le score du match et renvoie un objet avec le gagnant et les résultats
 *
 * @param   {String}  player1
 * @param   {String}  player2
 * @param   {Array}  list
 *
 * @return  {Object}
 */
const findMatchWinner = (player1, player2, list) => {
  let [player1Points, player1GamesWon, player1Sets] = [0, 0, 0];
  let [player2Points, player2GamesWon, player2Sets] = [0, 0, 0];
  let winner = "";
  let results = [];

  const resetPoints = () => {
    player1Points = 0;
    player2Points = 0;
  };

  const resetGames = () => {
    player1GamesWon = 0;
    player2GamesWon = 0;
  };

  for (let i = 0; i < list.length; i++) {
    if (list[i] === player1) {
      player1Points++;
    } else {
      player2Points++;
    }

    // Si on est dans le cas d'un jeu décisif (les 2 joueurs ont gagné 6 jeux )

    if (player1GamesWon === 6 && player2GamesWon === 6) {
      if (player1Points >= 7 && player1Points - player2Points >= 2) {
        player1GamesWon++;
        results.push({ set: [player1GamesWon, player2GamesWon] });
        player1Sets++;
        resetPoints();
        resetGames();
      }

      if (player2Points >= 7 && player2Points - player1Points >= 2) {
        player2GamesWon++;
        results.push({ set: [player1GamesWon, player2GamesWon] });
        player2Sets++;
        resetGames();
        resetPoints();
      }

      // Sinon pour tous les autres jeux
    } else {
      // Si le joueur a au moins 4pts et que l'écart est d'au moins 2 alors le joueur 1 gagne le jeu et les points sont remis à 0
      if (player1Points >= 4 && player1Points - player2Points >= 2) {
        player1GamesWon++;
        resetPoints();
      }

      if (player2Points >= 4 && player2Points - player1Points >= 2) {
        player2GamesWon++;
        resetPoints();
      }

      /* Si le joueur a gagné au moins 6 jeux et que l'écart de jeux est d'au moins 2 : le set est enregistré dans les résultats, 
      le joueur gagne le set, les jeux sont remis à 0 */
      if (player1GamesWon >= 6 && player1GamesWon - player2GamesWon >= 2) {
        results.push({ set: [player1GamesWon, player2GamesWon] });
        player1Sets++;
        resetGames();
      }

      if (player2GamesWon >= 6 && player2GamesWon - player1GamesWon >= 2) {
        results.push({ set: [player1GamesWon, player2GamesWon] });
        player2Sets++;
        resetGames();
      }
    }

    // Si un joueur gagne 3 sets il gagne la partie
    if (player1Sets === 3) {
      winner = player1;
    }
    if (player2Sets === 3) {
      winner = player2;
    }

    // Si au dernier point la partie n'a pas de gagnant, le résultat du set en cours est enregistré (en nombre de jeux)
    if (!winner && i === list.length - 1) {
      results.push({ set: [player1GamesWon, player2GamesWon] });

      // Le résultat du jeu en cours est enregistré (en nombre de points)
      const currentGameScore = [player1Points, player2Points];
      let min;
      let max;
      if (player1Points !== player2Points) {
        max = getValueMax(currentGameScore);
        min = getValueMin(currentGameScore);
      }

      // Le nombre de points est converti en score (notation 0, 15, 30, 40, -, AV)
      const currentGame = currentGameScore.map((score) => {
        if (score > 4) {
          if (score === min) {
            return "-";
          } else if (score === max) {
            return "AV";
          } else {
            return 40;
          }
        }
        switch (score) {
          case 0:
            return 0;
          case 1:
            return 15;
          case 2:
            return 30;
          case 3:
            return 40;
          case 4:
            return 40;

          default:
            return score;
        }
      });

      results.push({ currentGame });
    }

    // S'il y a un gagnant la boucle est stoppée
    if (winner) {
      break;
    }
  }

  return { results, winner };
};

module.exports = { findMatchWinner };
