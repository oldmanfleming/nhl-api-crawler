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
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spread = (this && this.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
    return ar;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getShifts = void 0;
var Utils_1 = require("./Utils");
var Constants_1 = require("./Constants");
function getShifts(gameShifts, gameEvents) {
    var e_1, _a, e_2, _b, e_3, _c, e_4, _d, e_5, _e, e_6, _f, e_7, _g, e_8, _h, e_9, _j, e_10, _k;
    var shifts = [];
    var gameType = gameEvents.data.gameData.game.type;
    var gamePk = gameEvents.data.gameData.game.pk;
    var timestamp = new Date(gameEvents.data.gameData.datetime.dateTime);
    var endTime = gameEvents.data.liveData.linescore.currentPeriod * 1200;
    var homeTeamId = gameEvents.data.gameData.teams.home.id;
    var awayTeamId = gameEvents.data.gameData.teams.away.id;
    // get all the ticks of goals scored
    var homeGoals = new Set();
    var awayGoals = new Set();
    try {
        for (var _l = __values(gameEvents.data.liveData.plays.allPlays), _m = _l.next(); !_m.done; _m = _l.next()) {
            var event_1 = _m.value;
            if (event_1.result.eventTypeId === Constants_1.EventTypeId.Goal) {
                var playTime = Utils_1.getTotalSeconds(event_1.about.period, event_1.about.periodTime, gameType);
                if (event_1.team.id === homeTeamId) {
                    homeGoals.add(playTime);
                }
                else {
                    awayGoals.add(playTime);
                }
            }
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (_m && !_m.done && (_a = _l.return)) _a.call(_l);
        }
        finally { if (e_1) throw e_1.error; }
    }
    var homePlayerShifts = new Map();
    var awayPlayerShifts = new Map();
    var prevHomeOnIceStrength = 0;
    var prevAwayOnIceStrength = 0;
    var homeScore = 0;
    var awayScore = 0;
    for (var tick = 0; tick < endTime; tick++) {
        var homePlayersOnIce = new Set();
        var awayPlayersOnIce = new Set();
        var homeOnIceStrength = 0;
        var awayOnIceStrength = 0;
        try {
            for (var _o = (e_2 = void 0, __values(gameShifts.data.data)), _p = _o.next(); !_p.done; _p = _o.next()) {
                var shift = _p.value;
                var startTime = Utils_1.getTotalSeconds(shift.period, shift.startTime, gameType);
                var endTime_1 = Utils_1.getTotalSeconds(shift.period, shift.endTime, gameType);
                var player = gameEvents.data.gameData.players["ID" + shift.playerId];
                if (!player || !shift.duration) {
                    continue;
                }
                if (startTime <= tick && tick < endTime_1) {
                    if (shift.teamId === homeTeamId) {
                        homePlayersOnIce.add(shift.playerId);
                        if (player.primaryPosition.abbreviation !== Constants_1.PositionAbbreviation.Goalie) {
                            homeOnIceStrength += 1;
                        }
                    }
                    else {
                        awayPlayersOnIce.add(shift.playerId);
                        if (player.primaryPosition.abbreviation !== Constants_1.PositionAbbreviation.Goalie) {
                            awayOnIceStrength += 1;
                        }
                    }
                }
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (_p && !_p.done && (_b = _o.return)) _b.call(_o);
            }
            finally { if (e_2) throw e_2.error; }
        }
        // update score
        if (homeGoals.has(tick)) {
            homeScore += 1;
        }
        if (awayGoals.has(tick)) {
            awayScore += 1;
        }
        //strength/score change, complete shifts for players in map and remove
        if (homeOnIceStrength !== prevHomeOnIceStrength ||
            awayOnIceStrength !== prevAwayOnIceStrength ||
            homeGoals.has(tick) ||
            awayGoals.has(tick)) {
            try {
                for (var _q = (e_3 = void 0, __values(__spread(homePlayerShifts.values()))), _r = _q.next(); !_r.done; _r = _q.next()) {
                    var shift = _r.value;
                    shift.endTime = shift.startTime + shift.length;
                    shifts.push(shift);
                }
            }
            catch (e_3_1) { e_3 = { error: e_3_1 }; }
            finally {
                try {
                    if (_r && !_r.done && (_c = _q.return)) _c.call(_q);
                }
                finally { if (e_3) throw e_3.error; }
            }
            try {
                for (var _s = (e_4 = void 0, __values(__spread(awayPlayerShifts.values()))), _t = _s.next(); !_t.done; _t = _s.next()) {
                    var shift = _t.value;
                    shift.endTime = shift.startTime + shift.length;
                    shifts.push(shift);
                }
            }
            catch (e_4_1) { e_4 = { error: e_4_1 }; }
            finally {
                try {
                    if (_t && !_t.done && (_d = _s.return)) _d.call(_s);
                }
                finally { if (e_4) throw e_4.error; }
            }
            homePlayerShifts.clear();
            awayPlayerShifts.clear();
        }
        try {
            // any players that are no longer on the ice need to have their shift completed and removed from list
            for (var _u = (e_5 = void 0, __values(__spread(homePlayerShifts))), _v = _u.next(); !_v.done; _v = _u.next()) {
                var player = _v.value;
                var _w = __read(player, 2), playerId = _w[0], shift = _w[1];
                if (!homePlayersOnIce.has(playerId)) {
                    shift.endTime = shift.startTime + shift.length;
                    shifts.push(shift);
                    homePlayerShifts.delete(playerId);
                }
            }
        }
        catch (e_5_1) { e_5 = { error: e_5_1 }; }
        finally {
            try {
                if (_v && !_v.done && (_e = _u.return)) _e.call(_u);
            }
            finally { if (e_5) throw e_5.error; }
        }
        try {
            for (var _x = (e_6 = void 0, __values(__spread(awayPlayerShifts))), _y = _x.next(); !_y.done; _y = _x.next()) {
                var player = _y.value;
                var _z = __read(player, 2), playerId = _z[0], shift = _z[1];
                if (!awayPlayersOnIce.has(playerId)) {
                    shift.endTime = shift.startTime + shift.length;
                    shifts.push(shift);
                    awayPlayerShifts.delete(playerId);
                }
            }
        }
        catch (e_6_1) { e_6 = { error: e_6_1 }; }
        finally {
            try {
                if (_y && !_y.done && (_f = _x.return)) _f.call(_x);
            }
            finally { if (e_6) throw e_6.error; }
        }
        try {
            // any players that are on the ice for this tick need to either have a new shift created if they just got on, or add a tick to their existing shift if they were already on the ice
            for (var homePlayersOnIce_1 = (e_7 = void 0, __values(homePlayersOnIce)), homePlayersOnIce_1_1 = homePlayersOnIce_1.next(); !homePlayersOnIce_1_1.done; homePlayersOnIce_1_1 = homePlayersOnIce_1.next()) {
                var playerId = homePlayersOnIce_1_1.value;
                if (homePlayerShifts.has(playerId)) {
                    var shift = homePlayerShifts.get(playerId);
                    shift.length += 1;
                    homePlayerShifts.set(playerId, shift);
                }
                else {
                    homePlayerShifts.set(playerId, Object.assign({
                        gamePk: gamePk,
                        gameType: gameType,
                        timestamp: timestamp,
                        playerId: playerId,
                        isHome: true,
                        teamId: homeTeamId,
                        opposingTeamId: awayTeamId,
                        teamStrength: homeOnIceStrength,
                        opposingStrength: awayOnIceStrength,
                        teamScore: homeScore,
                        opposingTeamScore: awayScore,
                        startTime: tick,
                        length: 1,
                    }));
                }
            }
        }
        catch (e_7_1) { e_7 = { error: e_7_1 }; }
        finally {
            try {
                if (homePlayersOnIce_1_1 && !homePlayersOnIce_1_1.done && (_g = homePlayersOnIce_1.return)) _g.call(homePlayersOnIce_1);
            }
            finally { if (e_7) throw e_7.error; }
        }
        try {
            for (var awayPlayersOnIce_1 = (e_8 = void 0, __values(awayPlayersOnIce)), awayPlayersOnIce_1_1 = awayPlayersOnIce_1.next(); !awayPlayersOnIce_1_1.done; awayPlayersOnIce_1_1 = awayPlayersOnIce_1.next()) {
                var playerId = awayPlayersOnIce_1_1.value;
                if (awayPlayerShifts.has(playerId)) {
                    var shift = awayPlayerShifts.get(playerId);
                    shift.length += 1;
                    awayPlayerShifts.set(playerId, shift);
                }
                else {
                    awayPlayerShifts.set(playerId, Object.assign({
                        gamePk: gamePk,
                        gameType: gameType,
                        timestamp: timestamp,
                        playerId: playerId,
                        isHome: false,
                        teamId: awayTeamId,
                        opposingTeamId: homeTeamId,
                        teamStrength: awayOnIceStrength,
                        opposingStrength: homeOnIceStrength,
                        teamScore: awayScore,
                        opposingTeamScore: homeScore,
                        startTime: tick,
                        length: 1,
                    }));
                }
            }
        }
        catch (e_8_1) { e_8 = { error: e_8_1 }; }
        finally {
            try {
                if (awayPlayersOnIce_1_1 && !awayPlayersOnIce_1_1.done && (_h = awayPlayersOnIce_1.return)) _h.call(awayPlayersOnIce_1);
            }
            finally { if (e_8) throw e_8.error; }
        }
        prevHomeOnIceStrength = homeOnIceStrength;
        prevAwayOnIceStrength = awayOnIceStrength;
    }
    try {
        for (var _0 = __values(__spread(homePlayerShifts.values())), _1 = _0.next(); !_1.done; _1 = _0.next()) {
            var shift = _1.value;
            shift.endTime = shift.startTime + shift.length;
            shifts.push(shift);
        }
    }
    catch (e_9_1) { e_9 = { error: e_9_1 }; }
    finally {
        try {
            if (_1 && !_1.done && (_j = _0.return)) _j.call(_0);
        }
        finally { if (e_9) throw e_9.error; }
    }
    try {
        for (var _2 = __values(__spread(awayPlayerShifts.values())), _3 = _2.next(); !_3.done; _3 = _2.next()) {
            var shift = _3.value;
            shift.endTime = shift.startTime + shift.length;
            shifts.push(shift);
        }
    }
    catch (e_10_1) { e_10 = { error: e_10_1 }; }
    finally {
        try {
            if (_3 && !_3.done && (_k = _2.return)) _k.call(_2);
        }
        finally { if (e_10) throw e_10.error; }
    }
    return shifts;
}
exports.getShifts = getShifts;
