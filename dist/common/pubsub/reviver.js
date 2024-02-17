"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reviver = void 0;
const mongoose_1 = require("mongoose");
const reviver = (key, value) => {
    const isISO8601Z = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*)?)Z$/;
    if (typeof value === 'string' && isISO8601Z.test(value)) {
        const tempDateNumber = Date.parse(value);
        if (!isNaN(tempDateNumber)) {
            return new Date(tempDateNumber);
        }
    }
    if (key === '_id') {
        return new mongoose_1.Types.ObjectId(value);
    }
    return value;
};
exports.reviver = reviver;
//# sourceMappingURL=reviver.js.map