import React from "react";
import styled from "styled-components";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin: 50px auto;

  .set-container {
    display: flex;
    text-align: center;
    margin-top: 20px;
  }
  .single-set {
    &-result {
      display: flex;
      flex-direction: column;
    }
  }
  .players {
    display: flex;
    flex-direction: column;
    justify-content: end;
  }
  .score-data {
    border: 1px solid black;
    width: 150px;
    padding: 5px;
  }
`;

const Scores = ({ results, winner, player1, player2 }) => {
  return (
    <Wrapper>
      {" "}
      <p>
        Résultat :{" "}
        {winner ? (
          <b>{`Le vainqueur est ${winner}`}</b>
        ) : (
          <b>Jeu en cours, pas de vainqueur</b>
        )}
      </p>
      <div className="set-container">
        <div className="players">
          <div className="score-data">{player1}</div>
          <div className="score-data">{player2}</div>
        </div>
        {results.map((item, i) => {
          let { set, currentGame } = item;
          return (
            <div key={i} className="single-set-container">
              <div className="score-data">
                {Object.keys(item) == "set"
                  ? ` Set ${i + 1}  `
                  : "Current Game"}
              </div>
              {set &&
                set.map((score, i) => (
                  <div key={i} className="score-data">
                    {score}
                  </div>
                ))}
              {currentGame &&
                currentGame.map((score, i) => (
                  <div key={i} className="score-data">
                    {" "}
                    {score}
                  </div>
                ))}
            </div>
          );
        })}
      </div>
    </Wrapper>
  );
};

export default Scores;
