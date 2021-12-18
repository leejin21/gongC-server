"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLastWeekSundayThisTime = exports.getYesterday = void 0;
const getYesterday = () => {
    let d = new Date();
    d.setDate(d.getDate() - 1);
    d.setSeconds(59);
    d.setMilliseconds(0);
    d.setHours(25);
    d.setMinutes(59);
    return d;
};
exports.getYesterday = getYesterday;
const getLastWeekSundayThisTime = () => {
    let d = new Date();
    d.getDay();
    if (d.getDay() == 0) {
        d.setDate(d.getDate() - 7);
    }
    d.setDate(d.getDate() - d.getDay());
    console.log(d);
    return d;
};
exports.getLastWeekSundayThisTime = getLastWeekSundayThisTime;
