import { readFile } from 'fs/promises';
import { sudokuDimention } from '../types/sudoku';
import type { SudokuGridType, SudokuRowType, SudokuValidNumberType } from '../types/sudoku';
import type { IterateThroughSudokuCallback } from '../types/states';

export default class Model {
  static async getSudoku(puzzle: number): Promise<SudokuGridType> {
    const fileData = await readFile(`./src/data/sudokuData.txt`, 'utf-8');
    const sudokus = fileData.split('\n');
    const targetSudoku = sudokus[puzzle - 1];

    const validNumbers = this.generateSudokuNumbers();

    const sudokuFromFile = new Array(sudokuDimention)
      .fill(1)
      .map((el, index) =>
        targetSudoku.slice(index * sudokuDimention, (index + 1) * sudokuDimention).split(''),
      );

    const sudokuGrid = sudokuFromFile.map((row) =>
      row.map((item) => {
        const parsed = parseInt(item, 10);
        if (Number.isNaN(parsed)) return null;
        if (!validNumbers.includes(parsed as SudokuValidNumberType)) return null;
        return parsed as SudokuValidNumberType;
      }),
    );
    return sudokuGrid;
  }

  static generateSudokuNumbers(): SudokuValidNumberType[] {
    const sudokuNumbers: SudokuValidNumberType[] = [];
    for (let i = 1; i <= sudokuDimention; i += 1) {
      sudokuNumbers.push(i as SudokuValidNumberType);
    }
    return sudokuNumbers;
  }

  static getSudokuBox(sudoku: SudokuGridType, indexes: [number, number]): SudokuRowType {
    const topLeftCorner = [indexes[0] - (indexes[0] % 3), indexes[1] - (indexes[1] % 3)];
    // console.log(indexes, '->', topLeftCorner);
    const result: SudokuRowType = [];
    for (let i = topLeftCorner[0]; i < topLeftCorner[0] + 3; i += 1) {
      for (let j = topLeftCorner[1]; j < topLeftCorner[1] + 3; j += 1) {
        if (!(i === indexes[0] && j === indexes[1])) result.push(sudoku[i][j]);
      }
    }
    // console.log(indexes, ', topleft:', topLeftCorner, 'result:', result);
    return result;
  }

  static hasEmptySpaces(sudoku: SudokuGridType): boolean {
    for (let i = 0; i < sudokuDimention; i += 1) {
      for (let j = 0; j < sudokuDimention; j += 1) {
        if (sudoku[i][j] === null) return true;
      }
    }
    return false;
  }

  static iterateThroughSudoku(
    sudokuGrid: SudokuGridType,
    callback: IterateThroughSudokuCallback,
  ): void {
    const flag = { stop: false };
    for (let rowIndex = 0; rowIndex < sudokuGrid.length; rowIndex += 1) {
      const row = sudokuGrid[rowIndex];
      for (let colIndex = 0; colIndex < row.length; colIndex += 1) {
        const cell = row[colIndex];
        callback(rowIndex, colIndex, cell, flag);
        if (flag.stop) return;
      }
    }
  }
}
