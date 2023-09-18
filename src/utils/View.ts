import type { RecursionState } from '../types/states';
import type { SudokuGridType } from '../types/sudoku';

export default class View {
  static renderSudoku(sudokuGrid: SudokuGridType, state: RecursionState): void {
    console.log(sudokuGrid.map((row) => row.map((num) => num || ' ').join(' ')).join('\n'));
    console.log('Iterations:', state.iterations, 'MinNulls:', state.minNulls);
  }

  static clearRenderSudoku(sudokuGrid: SudokuGridType, state: RecursionState): void {
    console.clear();
    this.renderSudoku(sudokuGrid, state);
  }
}
