import Controller from './utils/Controller';
import Model from './utils/Model';

async function run(): Promise<void> {
  const puzzle = Controller.argvGetter();
  if (!puzzle) return;
  const sudokuToSolve = await Model.getSudoku(puzzle);
  const result = Controller.solve(sudokuToSolve);
  if (result) {
    console.table(result);
  } else {
    console.log('No solution found');
  }
}

void run();
