import type { SudokuGridType } from './sudoku';

export type RecursionState = {
  solution: SudokuGridType | null;
  iterations: number;
  minNulls: number;
};
