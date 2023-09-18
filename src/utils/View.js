"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var View = /** @class */ (function () {
    function View() {
    }
    View.renderSudoku = function (sudokuGrid, state) {
        console.log(sudokuGrid.map(function (row) { return row.map(function (num) { return num || ' '; }).join(' '); }).join('\n'));
        console.log('Iterations:', state.iterations, 'MinNulls:', state.minNulls);
    };
    View.clearRenderSudoku = function (sudokuGrid, state) {
        console.clear();
        this.renderSudoku(sudokuGrid, state);
    };
    return View;
}());
exports.default = View;
