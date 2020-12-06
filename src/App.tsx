import React, {useEffect, useState} from 'react';
import {Grid} from './components/Grid';
import {Title} from './components/Title';
import {Game, generateGame} from './game/game';
import {Solver} from './solver/solver';
import './App.css';
import {GameContext} from './context/game-context';

function App() {
  const [game, setGame] = useState<Game>(generateGame());

  const onUpdate = (game: Game) => {
    setGame(game);
  };

  const [solver] = useState<Solver>(new Solver(game, onUpdate));

  useEffect(() => {
    const solve = async () => {
      const solution = await solver.solve(10);
      setGame(solution);
    };

    solve();
    return () => solver.stop();
  }, [solver]);

  return (
    <div className="App">
      <GameContext.Provider value={game}>
        <Title />
        <Grid />
      </GameContext.Provider>
    </div>
  );
}

export default App;
