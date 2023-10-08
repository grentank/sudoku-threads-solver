"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var worker_threads_1 = require("worker_threads");
var Controller_1 = require("./utils/Controller");
var Model_1 = require("./utils/Model");
var View_1 = require("./utils/View");
function run() {
    return __awaiter(this, void 0, void 0, function () {
        var timeStart_1, puzzle, sudokuToSolve, state_1, sudokuGrid_1, isRecursionInvalid, workers_1, _a, sudokuGrid, state;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (!worker_threads_1.isMainThread) return [3 /*break*/, 2];
                    timeStart_1 = Date.now();
                    puzzle = Controller_1.default.argvGetter();
                    if (!puzzle)
                        return [2 /*return*/];
                    return [4 /*yield*/, Model_1.default.getSudoku(puzzle)];
                case 1:
                    sudokuToSolve = _b.sent();
                    console.table(sudokuToSolve);
                    state_1 = {
                        solution: null,
                        iterations: 0,
                        minNulls: sudokuToSolve.flat().filter(function (el) { return el === null; }).length,
                    };
                    sudokuGrid_1 = structuredClone(sudokuToSolve);
                    isRecursionInvalid = Controller_1.default.insertAllValidNumbers(sudokuGrid_1);
                    if (isRecursionInvalid)
                        return [2 /*return*/];
                    if (!Model_1.default.hasEmptySpaces(sudokuGrid_1)) {
                        state_1.solution = sudokuGrid_1;
                        return [2 /*return*/];
                    }
                    workers_1 = [];
                    Model_1.default.iterateThroughSudoku(sudokuGrid_1, function (rowIndex, colIndex, cell, flag) {
                        if (cell)
                            return;
                        var possibleValues = Controller_1.default.getPossibleValues(sudokuGrid_1, [rowIndex, colIndex]);
                        if (possibleValues.length > 1) {
                            for (var curGuessInd = 0; curGuessInd < possibleValues.length; curGuessInd += 1) {
                                var currentGuess = possibleValues[curGuessInd];
                                sudokuGrid_1[rowIndex][colIndex] = currentGuess;
                                var currentNulls = sudokuGrid_1.flat().filter(function (n) { return n === null; }).length;
                                if (currentNulls < state_1.minNulls)
                                    state_1.minNulls = currentNulls;
                                var worker = new worker_threads_1.Worker(__filename, { workerData: { sudokuGrid: sudokuGrid_1, state: state_1 } });
                                workers_1.push(worker);
                                worker.on('message', function (receivedState) {
                                    if (receivedState.solution) {
                                        state_1.solution = receivedState.solution;
                                        flag.stop = true;
                                        workers_1.forEach(function (w) { return void w.terminate(); });
                                        View_1.default.renderSudoku(state_1.solution, state_1);
                                        var processDuration = Date.now() - timeStart_1;
                                        console.log('Duration:', processDuration, 'ms');
                                    }
                                });
                                if (state_1.solution)
                                    flag.stop = true;
                            }
                        }
                    });
                    // eslint-disable-next-line no-useless-return
                    if (!Model_1.default.hasEmptySpaces(sudokuGrid_1))
                        return [2 /*return*/];
                    return [3 /*break*/, 3];
                case 2:
                    _a = worker_threads_1.workerData, sudokuGrid = _a.sudokuGrid, state = _a.state;
                    Controller_1.default.solve(sudokuGrid, state);
                    if (state.solution) {
                        worker_threads_1.parentPort === null || worker_threads_1.parentPort === void 0 ? void 0 : worker_threads_1.parentPort.postMessage(state);
                    }
                    _b.label = 3;
                case 3: return [2 /*return*/];
            }
        });
    });
}
void run();
