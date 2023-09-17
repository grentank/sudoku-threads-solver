export const sudokuDimention = 9;

export type SudokuDimentionType = typeof sudokuDimention;
export type SudokuValidNumberType = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
export type SudokuUknownNumberType = null;
export type SudokuNumberType = SudokuValidNumberType | SudokuUknownNumberType;
export type SudokuRowType = SudokuNumberType[];
export type SudokuGridType = SudokuRowType[];
