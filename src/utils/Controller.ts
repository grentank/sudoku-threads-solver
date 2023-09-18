import type { SudokuGridType, SudokuValidNumberType } from '../types/sudoku';
import Model from './Model';

export default class Controller {
  static argvGetter(): number | null {
    const [, , arg] = process.argv;
    if (!arg) return null;
    const parsed = parseInt(arg, 10);
    if (Number.isNaN(parsed)) return null;
    return parsed;
  }

  static solve(initSudoku: SudokuGridType): SudokuGridType | undefined {
    const sudokuGrid = structuredClone(initSudoku);
    let amountOfInserts = 0;
    for (let rowIndex = 0; rowIndex < sudokuGrid.length; rowIndex += 1) {
      const row = sudokuGrid[rowIndex];
      for (let colIndex = 0; colIndex < row.length; colIndex += 1) {
        const cell = row[colIndex];
        const possibleValues = this.getPossibleValues(sudokuGrid, [rowIndex, colIndex]);

        if (possibleValues.length === 1) {
          // eslint-disable-next-line prefer-destructuring
          sudokuGrid[rowIndex][colIndex] = possibleValues[0];
          amountOfInserts += 1;
        } else if (possibleValues.length > 1) {
          for (
            let currentGuessIndex = 0;
            currentGuessIndex < possibleValues.length;
            currentGuessIndex += 1
          ) {
            const currentGuess = possibleValues[currentGuessIndex];
            sudokuGrid[rowIndex][colIndex] = currentGuess;
            const recursionResult = this.solve(sudokuGrid);
            if (recursionResult) return recursionResult;
          }
        }
      }
    }
    if (!Model.hasEmptySpaces(sudokuGrid)) return sudokuGrid;
  }

  static getPossibleValues(
    sudoku: SudokuGridType,
    indexes: [number, number],
  ): SudokuValidNumberType[] {
    const allValues = Model.generateSudokuNumbers();

    const sudokuRow = sudoku[indexes[0]];
    const sudokuCol = sudoku.map((row) => row[indexes[1]]);
    const sudokuBox = Model.getSudokuBox(sudoku, indexes);

    const withoutDuplicates = Array.from(
      new Set([...sudokuRow, ...sudokuCol, ...sudokuBox]),
    ).filter((n) => n !== null);
    const possibleValues = allValues.filter((n) => !withoutDuplicates.includes(n));
    return possibleValues;
  }
}
