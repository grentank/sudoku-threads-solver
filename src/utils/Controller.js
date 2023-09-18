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
    Controller.insertAllValidNumbers = function (initSudoku) {
        var sudokuGrid = JSON.parse(JSON.stringify(initSudoku)); // structuredClone(initSudoku);
        var amountOfInserts = 1;
        while (amountOfInserts !== 0) {
            amountOfInserts = 0;
            for (var rowIndex = 0; rowIndex < sudokuGrid.length; rowIndex += 1) {
                var row = sudokuGrid[rowIndex];
                for (var colIndex = 0; colIndex < row.length; colIndex += 1) {
                    var cell = row[colIndex];
                    if (cell)
                        continue;
                    var possibleValues = this.getPossibleValues(sudokuGrid, [rowIndex, colIndex]);
                    if (possibleValues.length === 1) {
                        // eslint-disable-next-line prefer-destructuring
                        sudokuGrid[rowIndex][colIndex] = possibleValues[0];
                        amountOfInserts += 1;
                    }
                }
            }
        }
        return sudokuGrid;
    };
    Controller.solve = function (initSudoku, state) {
        if (state.solution)
            return;
        state.iterations += 1;
        var sudokuGridClone = JSON.parse(JSON.stringify(initSudoku)); // structuredClone(initSudoku);
        var sudokuGrid = this.insertAllValidNumbers(sudokuGridClone);
        for (var rowIndex = 0; rowIndex < sudokuGrid.length; rowIndex += 1) {
            var row = sudokuGrid[rowIndex];
            for (var colIndex = 0; colIndex < row.length; colIndex += 1) {
                var cell = row[colIndex];
                if (cell)
                    continue;
                var possibleValues = this.getPossibleValues(sudokuGrid, [rowIndex, colIndex]);
                if (possibleValues.length === 1) {
                    // eslint-disable-next-line prefer-destructuring
                    sudokuGrid[rowIndex][colIndex] = possibleValues[0];
                }
                else if (possibleValues.length > 1) {
                    for (var currentGuessIndex = 0; currentGuessIndex < possibleValues.length; currentGuessIndex += 1) {
                        var currentGuess = possibleValues[currentGuessIndex];
                        sudokuGrid[rowIndex][colIndex] = currentGuess;
                        var currentNulls = sudokuGrid.flat().filter(function (n) { return n === null; }).length;
                        if (currentNulls < state.minNulls)
                            state.minNulls = currentNulls;
                        var recursionResult = this.solve(sudokuGrid, state);
                        if (recursionResult) {
                            state.solution = recursionResult;
                            return recursionResult;
                        }
                    }
                }
                else if (possibleValues.length === 0) {
                    return;
                }
            }
        }
        if (!Model_1.default.hasEmptySpaces(sudokuGrid))
            return sudokuGrid;
        // console.log('Recursion failed');
        // console.table(sudokuGrid)
        if (state.iterations % 10000 === 0)
            View_1.default.clearRenderSudoku(sudokuGrid, state);
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
