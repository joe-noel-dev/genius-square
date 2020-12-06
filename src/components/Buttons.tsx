import React from 'react';
import styled from 'styled-components';

interface ButtonsProps {
  onNewGame(): void;
  onSolve(): void;
}

const Container = styled.div`
  padding: 1rem 0;
`;

const Button = styled.button`
  background: none;
  margin-right: 1rem;
  padding: 1rem 2rem;

  &:last-child {
    margin-right: 0;
  }
`;

export const Buttons = (props: ButtonsProps) => {
  return (
    <Container>
      <Button onClick={props.onNewGame}>New Game</Button>
      <Button onClick={props.onSolve}>Solve</Button>
    </Container>
  );
};
