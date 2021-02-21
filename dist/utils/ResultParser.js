"use strict";
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getResults = exports.getResult = void 0;
var Result_1 = require("../entities/Result");
var Constants_1 = require("./Constants");
var Utils_1 = require("./Utils");
function getResult(gamePk, gameEvents, gameShifts, teamSummary, opposingTeamSummary) {
    var e_1, _a;
    var result = Object.assign({
        timestamp: new Date(teamSummary.gameDate),
        gamePk: gamePk,
    });
    var isHome = teamSummary.homeRoad === Constants_1.HomeRoad.Home;
    result.isHome = isHome;
    result.teamId = teamSummary.teamId;
    result.opposingTeamId = opposingTeamSummary.teamId;
    result.teamScore = isHome ? gameEvents.data.liveData.linescore.teams.home.goals : gameEvents.data.liveData.linescore.teams.away.goals;
    result.opposingTeamScore = isHome
        ? gameEvents.data.liveData.linescore.teams.away.goals
        : gameEvents.data.liveData.linescore.teams.home.goals;
    result.points = teamSummary.points;
    if (teamSummary.wins) {
        result.resultType = Result_1.ResultType.Win;
        result.goalieDecisionId = gameEvents.data.liveData.decisions.winner.id;
    }
    else if (teamSummary.otLosses) {
        result.resultType = Result_1.ResultType.OTLoss;
        result.goalieDecisionId = gameEvents.data.liveData.decisions.loser.id;
    }
    else {
        result.resultType = Result_1.ResultType.Loss;
        result.goalieDecisionId = gameEvents.data.liveData.decisions.loser.id;
    }
    try {
        for (var _b = __values(gameShifts.data.data), _c = _b.next(); !_c.done; _c = _b.next()) {
            var shift = _c.value;
            var startTime = Utils_1.getTotalSeconds(shift.period, shift.startTime, gameEvents.data.gameData.game.type);
            if (shift.teamId === teamSummary.teamId &&
                startTime === 0 &&
                gameEvents.data.gameData.players["ID" + shift.playerId].primaryPosition.abbreviation === Constants_1.PositionAbbreviation.Goalie) {
                result.goalieStartId = shift.playerId;
            }
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
        }
        finally { if (e_1) throw e_1.error; }
    }
    return result;
}
exports.getResult = getResult;
function getResults(gamePk, gameEvents, gameSummaries, gameShifts) {
    return [
        getResult(gamePk, gameEvents, gameShifts, gameSummaries.data.data[0], gameSummaries.data.data[1]),
        getResult(gamePk, gameEvents, gameShifts, gameSummaries.data.data[1], gameSummaries.data.data[0]),
    ];
}
exports.getResults = getResults;
