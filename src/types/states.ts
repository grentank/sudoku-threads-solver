import type { SudokuGridType, SudokuNumberType } from './sudoku';

export type RecursionState = {
  solution: SudokuGridType | null;
  iterations: number;
  minNulls: number;
};

export type IterateThroughSudokuCallback = (
  rowIndex: number,
  colIndex: number,
  cell: SudokuNumberType,
  flag: { stop: boolean },
) => void;
