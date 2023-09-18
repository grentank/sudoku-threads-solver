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

  static insertAllValidNumbers(sudokuGrid: SudokuGridType): boolean {
    // const sudokuGrid = structuredClone(initSudoku);
    const insertsState = { amountOfInserts: 1, recursionInvalid: false };
    while (insertsState.amountOfInserts !== 0) {
      insertsState.amountOfInserts = 0;
      Model.iterateThroughSudoku(sudokuGrid, (rowIndex, colIndex, cell) => {
        if (cell) return;
        const possibleValues = this.getPossibleValues(sudokuGrid, [rowIndex, colIndex]);
        if (possibleValues.length === 1) {
          // eslint-disable-next-line prefer-destructuring
          sudokuGrid[rowIndex][colIndex] = possibleValues[0];
          insertsState.amountOfInserts += 1;
        } else if (possibleValues.length === 0) {
          insertsState.recursionInvalid = true;
        }
      });
    }
    return insertsState.recursionInvalid;
  }

  static solve(initSudoku: SudokuGridType, state: RecursionState): SudokuGridType | undefined {
    if (state.solution) return;
    state.iterations += 1;
    if (state.iterations % 10000 === 0) View.clearRenderSudoku(initSudoku, state);
    const sudokuGrid = structuredClone(initSudoku);
    const isRecursionInvalid = this.insertAllValidNumbers(sudokuGrid);
    if (isRecursionInvalid) return;
    if (!Model.hasEmptySpaces(sudokuGrid)) {
      state.solution = sudokuGrid;
      return sudokuGrid;
    }

    Model.iterateThroughSudoku(sudokuGrid, (rowIndex, colIndex, cell, flag) => {
      if (cell) return;
      const possibleValues = this.getPossibleValues(sudokuGrid, [rowIndex, colIndex]);
      if (possibleValues.length > 1) {
        for (let curGuessInd = 0; curGuessInd < possibleValues.length; curGuessInd += 1) {
          const currentGuess = possibleValues[curGuessInd];
          sudokuGrid[rowIndex][colIndex] = currentGuess;
          const currentNulls = sudokuGrid.flat().filter((n) => n === null).length;

          if (currentNulls < state.minNulls) state.minNulls = currentNulls;
          this.solve(sudokuGrid, state);
          if (state.solution) flag.stop = true;
        }
      }
    });

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
