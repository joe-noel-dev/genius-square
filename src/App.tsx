import React, {useEffect, useState} from 'react';
import {Grid} from './components/Grid';
import {Game, generateGame} from './game/game';
import {generateTree, Node, solve} from './tree/tree';
import './App.css';

function App() {
  const [game, setGame] = useState<Game>(generateGame());
  const [tree] = useState<Node>(generateTree(game));

  useEffect(() => {
    const intervalId = setInterval(() => {
      const currentSolution = solve(tree, (solution) => {
        setGame(solution);
        clearInterval(intervalId);
      });

      setGame(currentSolution);
    }, 10);

    return () => clearInterval(intervalId);
  }, [tree]);

  return (
    <div className="App">
      <Grid game={game} />
    </div>
  );
}

export default App;
