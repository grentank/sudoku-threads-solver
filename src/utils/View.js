"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var View = /** @class */ (function () {
    function View() {
    }
    View.renderSudoku = function (sudokuGrid) {
        console.log(sudokuGrid.map(function (row) { return row.join('\t'); }).join('\n'));
    };
    View.clearRenderSudoku = function (sudokuGrid) {
        console.clear();
        this.renderSudoku(sudokuGrid);
    };
    return View;
}());
exports.default = View;
