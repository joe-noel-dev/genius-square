import React from 'react';
import styled from 'styled-components';
import {Game} from '../game/game';
import {Cell} from './Cell';

interface RowProps {
  game: Game;
  rowIndex: number;
}

const Container = styled.div`
  display: flex;
`;

export const Row = (props: RowProps) => {
  return (
    <Container>
      {[...Array(props.game.width)].map((_, index) => (
        <Cell
          key={index}
          columnIndex={index}
          rowIndex={props.rowIndex}
          game={props.game}
        />
      ))}
    </Container>
  );
};
