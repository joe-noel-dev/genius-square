import {
  Game,
  Action,
  getValidActions,
  applyAction,
  simulate,
  gameStats,
  isComplete,
} from '../game/game';
import _ from 'lodash';
import assert from 'assert';

interface GameNode {
  game: Game;
  score: number;
  numSimulations: number;
  children: GameNode[];
  parent?: GameNode;
  action?: Action;
}

function isLeaf(node: GameNode): boolean {
  return node.children.length === 0;
}

function valueForNode(node: GameNode): number {
  if (node.numSimulations === 0) return Infinity;
  const explorationConstant = 1; // Math.SQRT2;
  return (
    node.score / node.numSimulations +
    explorationConstant *
      Math.sqrt(Math.log(node.parent!.numSimulations) / node.numSimulations)
  );
}

function bestChild(node: GameNode): GameNode {
  assert(node.children.length > 0);
  let best: GameNode = node.children[0];
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

function findCandidate(node: GameNode): GameNode {
  return isLeaf(node) ? node : findCandidate(bestChild(node));
}

function addNewNodes(parent: GameNode) {
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

function applyScore(node: GameNode, score: number) {
  node.score += score;
  node.numSimulations++;
  if (node.parent) {
    applyScore(node.parent, score);
  }
}

function rollout(node: GameNode): Game {
  const result = simulate(node.game);
  const stats = gameStats(result);

  if (stats.complete) {
    console.log('Found solution');
  }

  let score = 0;
  if (stats.complete) score = 1;
  if (stats.numShapesNotPlaced < 2) score += 0.5;
  if (stats.numCellsNotPlaced < 2) score += 0.5;

  applyScore(node, score);

  return result;
}

export class Solver {
  game: Game;
  root: GameNode;
  onUpdate: (game: Game) => void;
  intervalId: number = 0;
  onComplete?: (game: Game) => void;

  constructor(game: Game, onUpdate: (game: Game) => void) {
    this.game = game;
    this.root = {
      game: this.game,
      score: 0,
      numSimulations: 0,
      children: [],
      parent: undefined,
      action: undefined,
    };
    this.onUpdate = onUpdate;
  }

  stop() {
    clearInterval(this.intervalId);
    this.intervalId = 0;
  }

  async solve(intervalMs: number): Promise<Game> {
    return new Promise((resolve) => {
      this.intervalId = setInterval(() => this.runSimulation(), intervalMs);
      this.onComplete = resolve;
    });
  }

  runSimulation() {
    const candidate = findCandidate(this.root);

    let solution = candidate.game;

    if (candidate.numSimulations === 0) {
      solution = rollout(candidate);
    } else {
      addNewNodes(candidate);
      if (candidate.children.length) {
        solution = rollout(candidate.children[0]);
      }
    }

    if (isComplete(solution)) {
      this.stop();

      if (this.onComplete) {
        this.onComplete(solution);
      }
    } else {
      this.onUpdate(solution);
    }
  }
}
