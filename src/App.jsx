import { nanoid } from "nanoid";
import { useState } from "react";
import Confetti from "react-confetti";
import { useWindowSize } from "react-use";
import "./App.css";
import Die from "./Die";

function App() {
  const [dice, setDice] = useState(() => generateNewDice());
  const [rollCount, setRollCount] = useState(0);
  const [gameCount, setGameCount] = useState(0);
  const [scores, setScores] = useState([]);

  const { width, height } = useWindowSize();

  console.log(`scores.length: ${scores.length}`)

  //Game is won if all dice are held && all dice have the same value
  const gameWon =
    dice.every((die) => die.isHeld) &&
    dice.every((die) => die.value === dice[0].value);

  function generateNewDice() {
    return new Array(10).fill(0).map((die) => ({
      value: Math.ceil(Math.random() * 6),
      isHeld: false,
      id: nanoid(),
    }));
  }

  function toggleHold(id) {
    setDice(
      dice.map((die) =>
        die.id === id
          ? {
              ...die,
              isHeld: !die.isHeld,
            }
          : die
      )
    );
  }

  function rollDice() {
    setDice(
      dice.map((die) =>
        die.isHeld ? die : { ...die, value: Math.ceil(Math.random() * 6) }
      )
    );
    setRollCount((prev) => prev + 1);
  }

  function newGame() {
    setDice(generateNewDice());
    setRollCount(0);
    setGameCount((prev) => prev + 1);
    setScores(prev => {
      // aktualisiertes Scores Array schreiben
      const newScores = [
        ...prev,
        {
          rollCount: rollCount,
          isHighScore: false,
          date: new Date(Date.now()),
          id: nanoid()
        }
      ]
      // Aktuellen Highscore bestimmen und in newScores anpassen
      if(newScores.length > 0){
        const highScoreId = newScores.reduce((min, current) =>
          current.rollCount < min.rollCount ? current : min).id;
        return newScores.map(score => 
          score.id === highScoreId
            ? {...score, isHighScore: true}
            : {...score, isHighScore: false}
        )
      }

      // return score list
      return newScores
    }
    )
  }

  const sortedScores = [...scores].sort((a, b) => a.rollCount - b.rollCount);

  return (
    <>
      {gameWon && <Confetti width={width} height={height} />}
      {gameWon && <h1 style={{gridArea:"head"}}>You won!</h1>}
      <p style={{gridArea:"stats-left"}}>Rolls: {rollCount}</p>
      <p style={{gridArea:"stats-right"}}>Games played: {gameCount}</p>
      <div className="dice-container">
        {dice.map((die) => (
          <Die
            value={die.value}
            key={die.id}
            isHeld={die.isHeld}
            toggleHold={() => toggleHold(die.id)}
          />
        ))}
      </div>
      <button className="rollButton" onClick={gameWon ? newGame : rollDice}>
        {gameWon ? "New Game" : "Roll"}
      </button>

      {scores.length > 0 && (
        <section className="scoreSection">
          <h2>Your Top 5 Scores</h2>
          <ul>
            {sortedScores.slice(0,5).map((score, index) => (
              <li
                key={index}
                className={`score ${score.isHighScore ? "highscore" : ''}`}
              >
                <span>{score.rollCount}</span>
                <span>{score.date.toLocaleString()}</span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </>
  );
}

export default App;
