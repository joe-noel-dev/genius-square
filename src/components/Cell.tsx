import {colourForPosition, containsToken, Game} from '../game/game';

import React from 'react';
import styled, {css} from 'styled-components';

interface CellProps {
  rowIndex: number;
  columnIndex: number;
  game: Game;
}

const borderStyle = css`3px solid black`;

interface ContainerProps {
  rowIndex: number;
  backgroundColour: string;
}

const Container = styled.div<ContainerProps>`
  width: 4rem;
  height: 4rem;

  display: flex;
  align-items: center;
  justify-content: center;

  background-color: ${(props) => props.backgroundColour || 'white'};

  border-right: ${borderStyle};
  border-bottom: ${borderStyle};

  border-top: ${(props) => (props.rowIndex === 0 ? borderStyle : 'none')};

  &:first-child {
    border-left: ${borderStyle};
  }
`;

const Token = styled.div`
  height: 80%;
  width: 80%;
  background-color: burlywood;
  border-radius: 100%;
`;

export const Cell = (props: CellProps) => {
  const position = {
    x: props.columnIndex,
    y: props.rowIndex,
  };

  const hasToken = containsToken(position, props.game);
  let colour = colourForPosition(position, props.game);
  return (
    <Container rowIndex={props.rowIndex} backgroundColour={colour}>
      {hasToken && <Token />}
    </Container>
  );
};
