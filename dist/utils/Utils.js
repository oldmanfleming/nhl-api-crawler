"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTotalSeconds = exports.timeToInt = void 0;
var Constants_1 = require("./Constants");
function timeToInt(time) {
    var leadMinute;
    var smallMinute;
    var leadSecond;
    var smallSecond;
    if (time.length === 5) {
        leadMinute = parseInt(time[0], 10);
        smallMinute = parseInt(time[1], 10);
        leadSecond = parseInt(time[3], 10);
        smallSecond = parseInt(time[4], 10);
    }
    else {
        leadMinute = 0;
        smallMinute = parseInt(time[0], 10);
        leadSecond = parseInt(time[2], 10);
        smallSecond = parseInt(time[3], 10);
    }
    return leadMinute * 600 + smallMinute * 60 + leadSecond * 10 + smallSecond;
}
exports.timeToInt = timeToInt;
function getTotalSeconds(period, time, gameType) {
    var seconds = timeToInt(time);
    for (var i = 1; i < period; i += 1) {
        if (i < 4 || gameType === Constants_1.GameType.PlayoffGameType) {
            seconds += 1200;
        }
        else {
            seconds += 300;
        }
    }
    return seconds;
}
exports.getTotalSeconds = getTotalSeconds;
