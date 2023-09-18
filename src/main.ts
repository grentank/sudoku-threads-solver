import type { RecursionState } from './types/states';
import Controller from './utils/Controller';
import Model from './utils/Model';
import View from './utils/View';

async function run(): Promise<void> {
  const puzzle = Controller.argvGetter();
  if (!puzzle) return;
  const sudokuToSolve = await Model.getSudoku(puzzle);
  console.table(sudokuToSolve);
  const state: RecursionState = {
    solution: null,
    iterations: 0,
    minNulls: sudokuToSolve.flat().filter((el) => el === null).length,
  };
  Controller.solve(sudokuToSolve, state);
  if (state.solution) {
    View.clearRenderSudoku(sudokuToSolve, state);
    View.renderSudoku(state.solution, state);
    console.log('Iterations:', state.iterations);
  } else {
    console.log('No solution found');
  }
}

void run();
