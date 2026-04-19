import { Dimensions } from 'react-native';

export const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export const COLORS = {
  bg: '#fafaf8',
  fg: '#1a1a1a',
  gray: '#888888',
  lightGray: '#e8e6e0',
  accent: '#f5a623',
  accent2: '#e8445a',
  accent3: '#4ecdc4',
  border: '#333333',
  white: '#ffffff',
  green: '#4caf50',
  purple: '#9b59b6',
};

export const MIN_CAPACITY = 3;
export const MAX_CAPACITY = 10;
export const DEFAULT_ROUND_DURATION = 30;
export const DEFAULT_ROUNDS = 10;

export const PLAYER_COLORS = [
  COLORS.accent,
  COLORS.accent2,
  COLORS.accent3,
  COLORS.purple,
  '#2ecc71',
  '#3498db',
  '#e67e22',
  '#1abc9c',
  '#e74c3c',
  '#8e44ad',
];

export const ASYNC_STORAGE_KEYS = {
  USER_PROFILE: '@user:profile',
  GAME_HISTORY: '@user:gameHistory',
};
