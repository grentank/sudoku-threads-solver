"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function argvGetter() {
    var _a = process.argv, arg = _a[2];
    if (!arg)
        return null;
    var parsed = parseInt(arg, 10);
    if (Number.isNaN(parsed))
        return null;
    return parsed;
}
exports.default = argvGetter;
