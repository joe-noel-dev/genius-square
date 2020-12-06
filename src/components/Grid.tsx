import React, {useContext} from 'react';
import styled from 'styled-components';
import {GameContext} from '../context/game-context';
import {Row} from './Row';

const Container = styled.div`
  margin: 1rem;
`;

interface GridProps {}

export const Grid = (props: GridProps) => {
  const game = useContext(GameContext);
  return (
    <Container>
      {[...Array(game.height)].map((_, index) => (
        <Row key={index} rowIndex={index} />
      ))}
    </Container>
  );
};
