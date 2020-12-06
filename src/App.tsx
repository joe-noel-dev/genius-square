import React, {useState} from 'react';
import {Grid} from './components/Grid';
import {Title} from './components/Title';
import {Game, generateGame} from './game/game';
import {Solver} from './solver/solver';
import {GameContext} from './context/game-context';
import {Buttons} from './components/Buttons';
import styled from 'styled-components';

const Container = styled.main`
  padding: 1rem;
`;

function App() {
  const [game, setGame] = useState<Game>(generateGame());
  const [solver, setSolver] = useState<Solver>(new Solver(game));

  const onUpdate = (game: Game) => {
    setGame(game);
  };

  const solve = async () => {
    const solution = await solver.solve(10, onUpdate);
    setGame(solution);
  };

  const newGame = () => {
    solver.stop();
    const game = generateGame();
    setGame(game);
    setSolver(new Solver(game));
  };

  return (
    <Container>
      <GameContext.Provider value={game}>
        <Title />
        <Grid />
        <Buttons onNewGame={newGame} onSolve={solve} />
      </GameContext.Provider>
    </Container>
  );
}

export default App;
