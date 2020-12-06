import {
  Game,
  Action,
  getValidActions,
  applyAction,
  simulate,
  gameStats,
} from '../game/game';
import _ from 'lodash';
import assert from 'assert';

export interface Node {
  game: Game;
  score: number;
  numSimulations: number;
  children: Node[];
  parent?: Node;
  action?: Action;
}

function isLeaf(node: Node): boolean {
  return node.children.length === 0;
}

function valueForNode(node: Node): number {
  if (node.numSimulations === 0) return Infinity;
  const explorationConstant = 1; // Math.SQRT2;
  return (
    node.score / node.numSimulations +
    explorationConstant *
      Math.sqrt(Math.log(node.parent!.numSimulations) / node.numSimulations)
  );
}

function bestChild(node: Node): Node {
  assert(node.children.length > 0);
  let best: Node = node.children[0];
  let bestValue = valueForNode(node.children[0]);

  node.children.forEach((child) => {
    const value = valueForNode(child);
    if (value > bestValue) {
      bestValue = value;
      best = child;
    }
  });

  return best;
}

function findCandidate(node: Node): Node {
  return isLeaf(node) ? node : findCandidate(bestChild(node));
}

function addNewNodes(parent: Node) {
  const actions = getValidActions(parent.game);
  actions.forEach((action) => {
    const newGame = _.cloneDeep(parent.game) as Game;
    applyAction(action, newGame);
    parent.children.push({
      game: newGame,
      score: 0,
      numSimulations: 0,
      children: [],
      parent,
      action,
    });
  });
}

function applyScore(node: Node, score: number) {
  node.score += score;
  node.numSimulations++;
  if (node.parent) {
    applyScore(node.parent, score);
  }
}

function rollout(node: Node, onSolution: (game: Game) => void): Game {
  const result = simulate(node.game);
  const stats = gameStats(result);

  if (stats.complete) {
    onSolution(result);
    console.log('Found solution');
  }

  let score = 0;
  if (stats.complete) score = 1;
  if (stats.numShapesNotPlaced < 2) score += 0.5;
  if (stats.numCellsNotPlaced < 2) score += 0.5;

  applyScore(node, score);

  return result;
}

export function generateTree(game: Game): Node {
  return {
    game,
    score: 0,
    numSimulations: 0,
    children: [],
    parent: undefined,
    action: undefined,
  };
}

export function solve(root: Node, onSolution: (game: Game) => void) {
  const candidate = findCandidate(root);

  let incompleteSolution = candidate.game;

  if (candidate.numSimulations === 0) {
    incompleteSolution = rollout(candidate, onSolution);
  } else {
    addNewNodes(candidate);
    if (candidate.children.length) {
      incompleteSolution = rollout(candidate.children[0], onSolution);
    }
  }

  return incompleteSolution;
}
