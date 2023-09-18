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
var promises_1 = require("fs/promises");
var sudoku_1 = require("../types/sudoku");
var Model = /** @class */ (function () {
    function Model() {
    }
    Model.getSudoku = function (puzzle) {
        return __awaiter(this, void 0, void 0, function () {
            var fileData, sudokus, targetSudoku, validNumbers, sudokuFromFile, sudokuGrid;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, promises_1.readFile)("./src/data/sudokuData.txt", 'utf-8')];
                    case 1:
                        fileData = _a.sent();
                        sudokus = fileData.split('\n');
                        targetSudoku = sudokus[puzzle - 1];
                        validNumbers = this.generateSudokuNumbers();
                        sudokuFromFile = new Array(sudoku_1.sudokuDimention)
                            .fill(1)
                            .map(function (el, index) {
                            return targetSudoku.slice(index * sudoku_1.sudokuDimention, (index + 1) * sudoku_1.sudokuDimention).split('');
                        });
                        sudokuGrid = sudokuFromFile.map(function (row) {
                            return row.map(function (item) {
                                var parsed = parseInt(item, 10);
                                if (Number.isNaN(parsed))
                                    return null;
                                if (!validNumbers.includes(parsed))
                                    return null;
                                return parsed;
                            });
                        });
                        return [2 /*return*/, sudokuGrid];
                }
            });
        });
    };
    Model.generateSudokuNumbers = function () {
        var sudokuNumbers = [];
        for (var i = 1; i <= sudoku_1.sudokuDimention; i += 1) {
            sudokuNumbers.push(i);
        }
        return sudokuNumbers;
    };
    Model.getSudokuBox = function (sudoku, indexes) {
        var topLeftCorner = [indexes[0] - (indexes[0] % 3), indexes[1] - (indexes[1] % 3)];
        // console.log(indexes, '->', topLeftCorner);
        var result = [];
        for (var i = topLeftCorner[0]; i < topLeftCorner[0] + 3; i += 1) {
            for (var j = topLeftCorner[1]; j < topLeftCorner[1] + 3; j += 1) {
                if (!(i === indexes[0] && j === indexes[1]))
                    result.push(sudoku[i][j]);
            }
        }
        // console.log(indexes, ', topleft:', topLeftCorner, 'result:', result);
        return result;
    };
    Model.hasEmptySpaces = function (sudoku) {
        for (var i = 0; i < sudoku_1.sudokuDimention; i += 1) {
            for (var j = 0; j < sudoku_1.sudokuDimention; j += 1) {
                if (sudoku[i][j] === null)
                    return true;
            }
        }
        return false;
    };
    return Model;
}());
exports.default = Model;
