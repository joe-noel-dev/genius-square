import React from 'react';
import styled from 'styled-components';
import {Game} from '../game/game';
import {Row} from './Row';

const Container = styled.div`
  margin: 1rem;
`;

interface GridProps {
  game: Game;
}

export const Grid = (props: GridProps) => {
  return (
    <Container>
      {[...Array(props.game.height)].map((_, index) => (
        <Row key={index} game={props.game} rowIndex={index} />
      ))}
    </Container>
  );
};
