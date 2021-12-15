"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getYesterday = void 0;
const getYesterday = () => {
    let d = new Date();
    d.setDate(d.getDate() - 1);
    d.setSeconds(59);
    d.setMilliseconds(0);
    d.setHours(32);
    d.setMinutes(59);
    return d;
};
exports.getYesterday = getYesterday;
