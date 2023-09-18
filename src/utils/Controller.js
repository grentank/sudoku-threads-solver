"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
var Model_1 = require("./Model");
var View_1 = require("./View");
var Controller = /** @class */ (function () {
    function Controller() {
    }
    Controller.argvGetter = function () {
        var _a = process.argv, arg = _a[2];
        if (!arg)
            return null;
        var parsed = parseInt(arg, 10);
        if (Number.isNaN(parsed))
            return null;
        return parsed;
    };
    Controller.insertAllValidNumbers = function (sudokuGrid) {
        var _this = this;
        // const sudokuGrid = structuredClone(initSudoku);
        var insertsState = { amountOfInserts: 1, recursionInvalid: false };
        while (insertsState.amountOfInserts !== 0) {
            insertsState.amountOfInserts = 0;
            Model_1.default.iterateThroughSudoku(sudokuGrid, function (rowIndex, colIndex, cell) {
                if (cell)
                    return;
                var possibleValues = _this.getPossibleValues(sudokuGrid, [rowIndex, colIndex]);
                if (possibleValues.length === 1) {
                    // eslint-disable-next-line prefer-destructuring
                    sudokuGrid[rowIndex][colIndex] = possibleValues[0];
                    insertsState.amountOfInserts += 1;
                }
                else if (possibleValues.length === 0) {
                    insertsState.recursionInvalid = true;
                }
            });
        }
        return insertsState.recursionInvalid;
    };
    Controller.solve = function (initSudoku, state) {
        var _this = this;
        if (state.solution)
            return;
        state.iterations += 1;
        if (state.iterations % 10000 === 0)
            View_1.default.clearRenderSudoku(initSudoku, state);
        var sudokuGrid = structuredClone(initSudoku);
        var isRecursionInvalid = this.insertAllValidNumbers(sudokuGrid);
        if (isRecursionInvalid)
            return;
        if (!Model_1.default.hasEmptySpaces(sudokuGrid)) {
            state.solution = sudokuGrid;
            return sudokuGrid;
        }
        Model_1.default.iterateThroughSudoku(sudokuGrid, function (rowIndex, colIndex, cell, flag) {
            if (cell)
                return;
            var possibleValues = _this.getPossibleValues(sudokuGrid, [rowIndex, colIndex]);
            if (possibleValues.length > 1) {
                for (var curGuessInd = 0; curGuessInd < possibleValues.length; curGuessInd += 1) {
                    var currentGuess = possibleValues[curGuessInd];
                    sudokuGrid[rowIndex][colIndex] = currentGuess;
                    var currentNulls = sudokuGrid.flat().filter(function (n) { return n === null; }).length;
                    if (currentNulls < state.minNulls)
                        state.minNulls = currentNulls;
                    _this.solve(sudokuGrid, state);
                    if (state.solution)
                        flag.stop = true;
                }
            }
        });
        if (!Model_1.default.hasEmptySpaces(sudokuGrid))
            return sudokuGrid;
        // console.log('Recursion failed');
        // console.table(sudokuGrid)
    };
    Controller.getPossibleValues = function (sudoku, indexes) {
        var allValues = Model_1.default.generateSudokuNumbers();
        var sudokuRow = sudoku[indexes[0]];
        var sudokuCol = sudoku.map(function (row) { return row[indexes[1]]; });
        var sudokuBox = Model_1.default.getSudokuBox(sudoku, indexes);
        var withoutDuplicates = Array.from(new Set(__spreadArray(__spreadArray(__spreadArray([], sudokuRow, true), sudokuCol, true), sudokuBox, true))).filter(function (n) { return n !== null; });
        var possibleValues = allValues.filter(function (n) { return !withoutDuplicates.includes(n); });
        return possibleValues;
    };
    return Controller;
}());
exports.default = Controller;
