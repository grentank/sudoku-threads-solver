import { Worker, isMainThread, workerData, parentPort } from 'worker_threads';
import type { RecursionState } from './types/states';
import Controller from './utils/Controller';
import Model from './utils/Model';
import View from './utils/View';
import type { SudokuGridType } from './types/sudoku';

async function run(): Promise<void> {
  if (isMainThread) {
    const timeStart = Date.now();
    const puzzle = Controller.argvGetter();
    if (!puzzle) return;
    const sudokuToSolve = await Model.getSudoku(puzzle);
    console.table(sudokuToSolve);
    const state: RecursionState = {
      solution: null,
      iterations: 0,
      minNulls: sudokuToSolve.flat().filter((el) => el === null).length,
    };
    // Controller.solve(sudokuToSolve, state);

    const sudokuGrid = structuredClone(sudokuToSolve);
    const isRecursionInvalid = Controller.insertAllValidNumbers(sudokuGrid);
    if (isRecursionInvalid) return;
    if (!Model.hasEmptySpaces(sudokuGrid)) {
      state.solution = sudokuGrid;
      return;
    }

    const workers: Worker[] = [];

    Model.iterateThroughSudoku(sudokuGrid, (rowIndex, colIndex, cell, flag) => {
      if (cell) return;
      const possibleValues = Controller.getPossibleValues(sudokuGrid, [rowIndex, colIndex]);
      if (possibleValues.length > 1) {
        for (let curGuessInd = 0; curGuessInd < possibleValues.length; curGuessInd += 1) {
          const currentGuess = possibleValues[curGuessInd];
          sudokuGrid[rowIndex][colIndex] = currentGuess;
          const currentNulls = sudokuGrid.flat().filter((n) => n === null).length;
          if (currentNulls < state.minNulls) state.minNulls = currentNulls;

          const worker = new Worker(__filename, { workerData: { sudokuGrid, state } });
          workers.push(worker);
          worker.on('message', (receivedState: RecursionState) => {
            if (receivedState.solution) {
              state.solution = receivedState.solution;
              flag.stop = true;
              workers.forEach((w) => void w.terminate());
              View.renderSudoku(state.solution, state);
              const processDuration = Date.now() - timeStart;
              console.log('Duration:', processDuration, 'ms');
            }
          });
          if (state.solution) flag.stop = true;
        }
      }
    });

    // eslint-disable-next-line no-useless-return
    if (!Model.hasEmptySpaces(sudokuGrid)) return;
  } else {
    const { sudokuGrid, state } = workerData as {
      sudokuGrid: SudokuGridType;
      state: RecursionState;
    };
    Controller.solve(sudokuGrid, state);
    if (state.solution) {
      parentPort?.postMessage(state);
    }
  }
  //   if (state.solution) {
  //     View.clearRenderSudoku(sudokuToSolve, state);
  //     View.renderSudoku(state.solution, state);
  //     console.log('Iterations:', state.iterations);
  //   } else {
  //     console.log('No solution found');
  //   }
}

void run();
