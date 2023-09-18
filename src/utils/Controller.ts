import type { RecursionState } from '../types/states';
import type { SudokuGridType, SudokuValidNumberType } from '../types/sudoku';
import Model from './Model';
import View from './View';

export default class Controller {
  static argvGetter(): number | null {
    const [, , arg] = process.argv;
    if (!arg) return null;
    const parsed = parseInt(arg, 10);
    if (Number.isNaN(parsed)) return null;
    return parsed;
  }

  static insertAllValidNumbers(initSudoku: SudokuGridType): SudokuGridType {
    const sudokuGrid = JSON.parse(JSON.stringify(initSudoku)) as SudokuGridType; // structuredClone(initSudoku);
    let amountOfInserts = 1;
    while (amountOfInserts !== 0) {
      amountOfInserts = 0;
      for (let rowIndex = 0; rowIndex < sudokuGrid.length; rowIndex += 1) {
        const row = sudokuGrid[rowIndex];
        for (let colIndex = 0; colIndex < row.length; colIndex += 1) {
          const cell = row[colIndex];
          if (cell) continue;
          const possibleValues = this.getPossibleValues(sudokuGrid, [rowIndex, colIndex]);
          if (possibleValues.length === 1) {
            // eslint-disable-next-line prefer-destructuring
            sudokuGrid[rowIndex][colIndex] = possibleValues[0];
            amountOfInserts += 1;
          }
        }
      }
    }
    return sudokuGrid;
  }

  static solve(initSudoku: SudokuGridType, state: RecursionState): SudokuGridType | undefined {
    if (state.solution) return;
    state.iterations += 1;
    const sudokuGridClone = JSON.parse(JSON.stringify(initSudoku)) as SudokuGridType; // structuredClone(initSudoku);
    const sudokuGrid = this.insertAllValidNumbers(sudokuGridClone);
    for (let rowIndex = 0; rowIndex < sudokuGrid.length; rowIndex += 1) {
      const row = sudokuGrid[rowIndex];
      for (let colIndex = 0; colIndex < row.length; colIndex += 1) {
        const cell = row[colIndex];
        if (cell) continue;
        const possibleValues = this.getPossibleValues(sudokuGrid, [rowIndex, colIndex]);

        if (possibleValues.length === 1) {
          // eslint-disable-next-line prefer-destructuring
          sudokuGrid[rowIndex][colIndex] = possibleValues[0];
        } else if (possibleValues.length > 1) {
          for (
            let currentGuessIndex = 0;
            currentGuessIndex < possibleValues.length;
            currentGuessIndex += 1
          ) {
            const currentGuess = possibleValues[currentGuessIndex];
            sudokuGrid[rowIndex][colIndex] = currentGuess;
            const currentNulls = sudokuGrid.flat().filter((n) => n === null).length;

            if (currentNulls < state.minNulls) state.minNulls = currentNulls;
            const recursionResult = this.solve(sudokuGrid, state);
            if (recursionResult) {
              state.solution = recursionResult;
              return recursionResult;
            }
          }
        } else if (possibleValues.length === 0) {
          return;
        } 
      }
    }
    if (!Model.hasEmptySpaces(sudokuGrid)) return sudokuGrid;
    // console.log('Recursion failed');
    // console.table(sudokuGrid)
    if (state.iterations % 10000 === 0) View.clearRenderSudoku(sudokuGrid, state);
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
