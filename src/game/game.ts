import assert from 'assert';
import _ from 'lodash';

type Rotation = number;

export interface Position {
  x: number;
  y: number;
}

function equal(a: Position, b: Position): boolean {
  return a.x === b.x && a.y === b.y;
}

export interface Shape {
  colour: string;
  shape: Position[];
  validRotations: Rotation[];
}

// eslint-disable-next-line
function rotate(position: Position, numRotations: number): Position {
  const rotations = [
    {rotation: 0, cosTheta: 1, sinTheta: 0},
    {rotation: 1, cosTheta: 0, sinTheta: 1},
    {rotation: 2, cosTheta: -1, sinTheta: 0},
    {rotation: 3, cosTheta: 0, sinTheta: -1},
  ];

  const angles = rotations.find((r) => r.rotation === numRotations)!;

  return {
    x: position.x * angles.cosTheta - position.y * angles.sinTheta,
    y: position.y * angles.cosTheta + position.x * angles.sinTheta,
  };
}

// eslint-disable-next-line
function translate(position: Position, by: Position): Position {
  return {x: position.x + by.x, y: position.y + by.y};
}

function positionsForShape(
  shape: Shape,
  position: Position,
  rotation: Rotation
) {
  return shape.shape
    .map((p) => rotate(p, rotation))
    .map((p) => translate(p, position));
}

export interface Game {
  tokens: Position[];
  shapes: {
    shape: Shape;
    positions?: Position[];
  }[];
  width: number;
  height: number;
}

function generateShapes(): Shape[] {
  return [
    {
      colour: 'grey',
      shape: [
        {x: 0, y: 0},
        {x: 1, y: 0},
        {x: 2, y: 0},
        {x: 3, y: 0},
      ],
      validRotations: [0, 1],
    },
    {
      colour: 'yellow',
      shape: [
        {x: 0, y: 0},
        {x: 1, y: 0},
        {x: 2, y: 0},
        {x: 1, y: 1},
      ],
      validRotations: [0, 1, 2, 3],
    },
    {
      colour: 'green',
      shape: [
        {x: 0, y: 0},
        {x: 1, y: 0},
        {x: 1, y: 1},
        {x: 0, y: 1},
      ],
      validRotations: [0],
    },
    {
      colour: 'red',
      shape: [
        {x: 0, y: 0},
        {x: 1, y: 0},
        {x: 1, y: 1},
        {x: 2, y: 1},
      ],
      validRotations: [0, 1],
    },
    {
      colour: 'lightblue',
      shape: [
        {x: 0, y: 0},
        {x: 1, y: 0},
        {x: 2, y: 0},
        {x: 2, y: 1},
      ],
      validRotations: [0, 1, 2, 3],
    },
    {
      colour: 'orange',
      shape: [
        {x: 0, y: 0},
        {x: 1, y: 0},
        {x: 2, y: 0},
      ],
      validRotations: [0, 1],
    },

    {
      colour: 'purple',
      shape: [
        {x: 0, y: 0},
        {x: 1, y: 0},
        {x: 1, y: 1},
      ],
      validRotations: [0, 1, 2, 3],
    },
    {
      colour: 'brown',
      shape: [
        {x: 0, y: 0},
        {x: 1, y: 0},
      ],
      validRotations: [0, 1],
    },
    {
      colour: 'blue',
      shape: [{x: 0, y: 0}],
      validRotations: [0],
    },
  ];
}

function rollToPosition(value: string): Position {
  assert(value.length === 2);
  return {
    x: parseInt(value.charAt(1)) - 1,
    y: value.charCodeAt(0) - 'A'.charCodeAt(0),
  };
}

function generateTokens(): Position[] {
  return [
    ['A5', 'F2', 'E1', 'B6', 'A5', 'F2'],
    ['A6', 'F1'],
    ['C3', 'E3', 'D3', 'D4', 'B4', 'C4'],
    ['A1', 'F3', 'D1', 'E2', 'D2', 'C1'],
    ['E4', 'F5', 'E6', 'F4', 'D5', 'E5'],
    ['A4', 'F6', 'C5', 'D6', 'C6', 'B5'],
    ['A2', 'C2', 'B1', 'B3', 'B2', 'A3'],
  ].map((dice) =>
    rollToPosition(dice[Math.floor(Math.random() * dice.length)])
  );
}

export function generateGame(): Game {
  return {
    tokens: generateTokens(),
    shapes: generateShapes().map((shape) => {
      return {shape};
    }),

    width: 6,
    height: 6,
  };
}

export function containsToken(position: Position, game: Game): boolean {
  return game.tokens.some((token) => equal(token, position));
}

export interface Action {
  shape: Shape;
  positions: Position[];
}

function isFree(position: Position, game: Game): boolean {
  if (position.x < 0) return false;
  if (position.x >= game.width) return false;
  if (position.y < 0) return false;
  if (position.y >= game.height) return false;

  if (containsToken(position, game)) return false;

  return !game.shapes.some((shape) => {
    if (!shape.positions) return false;
    return shape.positions.find((other) => equal(other, position));
  });
}

function areFree(positions: Position[], game: Game): boolean {
  return (
    positions.length > 0 &&
    positions.every((position) => isFree(position, game))
  );
}

function getActionsForShapeAndRotation(
  game: Game,
  shape: Shape,
  rotation: Rotation
): Action[] {
  let actions: Action[] = [];

  for (let column = 0; column < game.width; ++column) {
    for (let row = 0; row < game.height; ++row) {
      const positions = positionsForShape(shape, {x: column, y: row}, rotation);
      if (areFree(positions, game)) {
        actions.push({
          shape,
          positions,
        });
      }
    }
  }

  return actions;
}

function getActionsForShape(game: Game, shape: Shape): Action[] {
  let actions: Action[] = [];
  shape.validRotations.forEach((rotation) => {
    actions = actions.concat(
      getActionsForShapeAndRotation(game, shape, rotation)
    );
  });
  return actions;
}

export function getValidActions(game: Game): Action[] {
  const unplacedShapes = game.shapes.filter((shape) => !shape.positions);

  let actions: Action[] = [];
  unplacedShapes.forEach((shape) => {
    actions = actions.concat(getActionsForShape(game, shape.shape));
  });

  return actions;
}

export function applyAction(action: Action, game: Game) {
  const shape = game.shapes.find(
    (shape) => shape.shape.colour === action.shape.colour
  );
  shape!.positions = action.positions;
}

interface GameStats {
  numShapesPlaced: number;
  numShapesNotPlaced: number;
  numCellsPlaced: number;
  numCellsNotPlaced: number;
  complete: boolean;
}

export function gameStats(game: Game): GameStats {
  const stats: GameStats = {
    numShapesPlaced: 0,
    numShapesNotPlaced: 0,
    numCellsPlaced: 0,
    numCellsNotPlaced: 0,
    complete: true,
  };

  game.shapes.forEach((shape) => {
    if (shape.positions) {
      ++stats.numShapesPlaced;
      stats.numCellsPlaced += shape.shape.shape.length;
    } else {
      stats.complete = false;
      ++stats.numShapesNotPlaced;
      stats.numCellsNotPlaced += shape.shape.shape.length;
    }
  });

  return stats;
}

function shuffle<T>(array: T[]) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

export function simulate(game: Game): Game {
  const newGame = _.cloneDeep(game) as Game;

  const unplacedShapes = newGame.shapes.filter((shape) => !shape.positions);
  // shuffle(unplacedShapes);

  for (let shape of unplacedShapes) {
    const actions = getActionsForShape(newGame, shape.shape);
    if (actions.length === 0) continue;
    const actionIndex = Math.floor(Math.random() * actions.length);
    applyAction(actions[actionIndex], newGame);
  }
  return newGame;
}

export function colourForPosition(position: Position, game: Game): string {
  for (let shape of game.shapes) {
    if (!shape.positions) continue;
    if (shape.positions.some((shapePosition) => equal(position, shapePosition)))
      return shape.shape.colour;
  }

  return '';
}
