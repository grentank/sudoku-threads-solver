import type { SudokuGridType } from '../types/sudoku';

export default class View {
  static renderSudoku(sudokuGrid: SudokuGridType): void {
    console.log(sudokuGrid.map((row) => row.join('\t')).join('\n'));
  }

  static clearRenderSudoku(sudokuGrid: SudokuGridType): void {
    console.clear();
    this.renderSudoku(sudokuGrid);
  }
}
