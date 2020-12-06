import React, {useContext} from 'react';
import styled from 'styled-components';
import {GameContext} from '../context/game-context';
import {Cell} from './Cell';

interface RowProps {
  rowIndex: number;
}

const Container = styled.div`
  display: flex;
`;

export const Row = (props: RowProps) => {
  const game = useContext(GameContext);
  return (
    <Container>
      {[...Array(game.width)].map((_, index) => (
        <Cell key={index} columnIndex={index} rowIndex={props.rowIndex} />
      ))}
    </Container>
  );
};
