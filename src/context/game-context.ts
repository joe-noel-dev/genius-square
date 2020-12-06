import {Game, generateGame} from '../game/game';
import React from 'react';

export const GameContext = React.createContext<Game>(generateGame());
export const useGame = () => React.useContext(GameContext);
