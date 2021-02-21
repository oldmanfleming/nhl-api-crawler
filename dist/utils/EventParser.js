"use strict";
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
exports.getEvents = exports.getEvent = void 0;
/* eslint-disable @typescript-eslint/typedef */
var Constants_1 = require("./Constants");
var Event_1 = require("../entities/Event");
var Utils_1 = require("./Utils");
function getEvent(eventType, playerId, metaInfo) {
    var _a;
    var gamePk = metaInfo.gamePk, gameType = metaInfo.gameType, play = metaInfo.play, teams = metaInfo.teams, homePlayers = metaInfo.homePlayers, awayPlayers = metaInfo.awayPlayers, homeGoalieId = metaInfo.homeGoalieId, awayGoalieId = metaInfo.awayGoalieId;
    var event = Object.assign({
        gamePk: gamePk,
        gameType: gameType,
        idx: play.about.eventIdx,
        timestamp: new Date(play.about.dateTime),
        playTime: Utils_1.getTotalSeconds(play.about.period, play.about.periodTime, gameType),
        type: eventType,
    });
    // player info
    var player;
    var isHome = false;
    if (teams.home.players["ID" + playerId]) {
        player = teams.home.players["ID" + playerId];
        isHome = true;
    }
    else {
        player = teams.away.players["ID" + playerId];
        isHome = false;
    }
    event.playerId = player.person.id;
    event.playerType = player.position.abbreviation;
    event.playerHandedness = player.person.shootsCatches;
    // team info
    event.isHome = isHome;
    event.teamId = isHome ? teams.home.team.id : teams.away.team.id;
    event.opposingTeamId = isHome ? teams.away.team.id : teams.home.team.id;
    event.teamScore = isHome ? play.about.goals.home : play.about.goals.away;
    event.opposingTeamScore = isHome ? play.about.goals.away : play.about.goals.home;
    //strength
    event.teamStrength = isHome ? homePlayers.size : awayPlayers.size;
    event.opposingStrength = isHome ? awayPlayers.size : homePlayers.size;
    // final players on ice
    var homePlayersPlusGoalie = __spread(homePlayers);
    if (homeGoalieId)
        homePlayersPlusGoalie.push(homeGoalieId);
    var awayPlayersPlusGoalie = __spread(awayPlayers);
    if (awayGoalieId)
        awayPlayersPlusGoalie.push(awayGoalieId);
    event.players = isHome ? homePlayersPlusGoalie : awayPlayersPlusGoalie;
    event.opposingPlayers = isHome ? awayPlayersPlusGoalie : homePlayersPlusGoalie;
    // normalize coordinates and zone
    if (play.coordinates.x !== undefined && play.coordinates.y !== undefined) {
        var _b = play.coordinates, x = _b.x, y = _b.y;
        var period = play.about.period;
        if ((isHome && period % 2 !== 0) || (!isHome && period % 2 === 0)) {
            // is home and period odd
            // is away and period even
            if (x > 0) {
                event.zone = Event_1.Zone.Defensive;
            }
            else if (x < 0) {
                event.zone = Event_1.Zone.Offensive;
            }
            else {
                event.zone = Event_1.Zone.Neutral;
            }
            event.x = x;
            event.y = y;
        }
        else if ((isHome && period % 2 === 0) || (!isHome && period % 2 !== 0)) {
            // is home and period even
            // is away and period odd
            if (x > 0) {
                event.zone = Event_1.Zone.Offensive;
            }
            else if (x < 0) {
                event.zone = Event_1.Zone.Defensive;
            }
            else {
                event.zone = Event_1.Zone.Neutral;
            }
            event.x = -x;
            event.y = y;
        }
    }
    // additional info
    event.secondaryType = (_a = play.result.secondaryType) !== null && _a !== void 0 ? _a : play.result.description;
    if (play.result.gameWinningGoal) {
        event.secondaryNumber = 1;
    }
    else if (play.result.emptyNet) {
        event.secondaryNumber = 2;
    }
    else if (play.result.penaltyMinutes) {
        event.secondaryNumber = play.result.penaltyMinutes;
    }
    return event;
}
exports.getEvent = getEvent;
function getEvents(gamePk, gameEvents, gameShifts) {
    var e_1, _a, e_2, _b, e_3, _c, e_4, _d, e_5, _e, e_6, _f, e_7, _g, e_8, _h, e_9, _j, e_10, _k, e_11, _l, e_12, _m, e_13, _o, e_14, _p, e_15, _q, e_16, _r, e_17, _s, e_18, _t, e_19, _u, e_20, _v, e_21, _w, e_22, _x, e_23, _y;
    var events = [];
    var gameType = gameEvents.data.gameData.game.type;
    var teams = gameEvents.data.liveData.boxscore.teams;
    var plays = gameEvents.data.liveData.plays.allPlays;
    var playerProfiles = gameEvents.data.gameData.players;
    var shifts = gameShifts.data.data;
    try {
        for (var plays_1 = __values(plays), plays_1_1 = plays_1.next(); !plays_1_1.done; plays_1_1 = plays_1.next()) {
            var play = plays_1_1.value;
            var homeGoalieId = void 0;
            var homePlayers = new Set();
            var awayGoalieId = void 0;
            var awayPlayers = new Set();
            try {
                for (var shifts_1 = (e_2 = void 0, __values(shifts)), shifts_1_1 = shifts_1.next(); !shifts_1_1.done; shifts_1_1 = shifts_1.next()) {
                    var shift = shifts_1_1.value;
                    var startTime = Utils_1.getTotalSeconds(shift.period, shift.startTime, gameType);
                    var endTime = Utils_1.getTotalSeconds(shift.period, shift.endTime, gameType);
                    var playTime = Utils_1.getTotalSeconds(play.about.period, play.about.periodTime, gameType);
                    var player = playerProfiles["ID" + shift.playerId];
                    if (!player || !shift.duration) {
                        continue;
                    }
                    if ((startTime < playTime && playTime < endTime) ||
                        (play.result.eventTypeId !== Constants_1.EventTypeId.Faceoff && playTime === endTime && playTime !== startTime) ||
                        (play.result.eventTypeId === Constants_1.EventTypeId.Faceoff && startTime === playTime && endTime !== playTime)) {
                        if (shift.teamId === teams.home.team.id && player.primaryPosition.abbreviation === Constants_1.PositionAbbreviation.Goalie) {
                            homeGoalieId = shift.playerId;
                        }
                        else if (shift.teamId === teams.home.team.id && player.primaryPosition.abbreviation !== Constants_1.PositionAbbreviation.Goalie) {
                            homePlayers.add(shift.playerId);
                        }
                        else if (shift.teamId === teams.away.team.id && player.primaryPosition.abbreviation === Constants_1.PositionAbbreviation.Goalie) {
                            awayGoalieId = shift.playerId;
                        }
                        else if (shift.teamId === teams.away.team.id && player.primaryPosition.abbreviation !== Constants_1.PositionAbbreviation.Goalie) {
                            awayPlayers.add(shift.playerId);
                        }
                    }
                }
            }
            catch (e_2_1) { e_2 = { error: e_2_1 }; }
            finally {
                try {
                    if (shifts_1_1 && !shifts_1_1.done && (_b = shifts_1.return)) _b.call(shifts_1);
                }
                finally { if (e_2) throw e_2.error; }
            }
            var metaInfo = {
                gamePk: gamePk,
                gameType: gameType,
                play: play,
                teams: teams,
                homePlayers: homePlayers,
                awayPlayers: awayPlayers,
                homeGoalieId: homeGoalieId,
                awayGoalieId: awayGoalieId,
            };
            if (play.about.periodType !== Constants_1.PeriodType.Shootout) {
                switch (play.result.eventTypeId) {
                    case Constants_1.EventTypeId.Goal: {
                        var goalEvent = getEvent(Event_1.EventType.Goal, play.players[0].player.id, metaInfo);
                        events.push(goalEvent);
                        var playerIds = [goalEvent.playerId];
                        for (var i = 1; i < play.players.length; i++) {
                            var player = play.players[i];
                            playerIds.push(player.player.id);
                            if (player.playerType === Constants_1.PlayerType.Goalie) {
                                events.push(getEvent(Event_1.EventType.GoalAllowed, player.player.id, metaInfo));
                            }
                            else {
                                events.push(getEvent(Event_1.EventType.Assist, player.player.id, metaInfo));
                            }
                        }
                        try {
                            for (var homePlayers_1 = (e_3 = void 0, __values(homePlayers)), homePlayers_1_1 = homePlayers_1.next(); !homePlayers_1_1.done; homePlayers_1_1 = homePlayers_1.next()) {
                                var homePlayerId = homePlayers_1_1.value;
                                if (!playerIds.includes(homePlayerId))
                                    events.push(getEvent(goalEvent.isHome ? Event_1.EventType.OnIceGoal : Event_1.EventType.OnIceGoalAllowed, homePlayerId, metaInfo));
                            }
                        }
                        catch (e_3_1) { e_3 = { error: e_3_1 }; }
                        finally {
                            try {
                                if (homePlayers_1_1 && !homePlayers_1_1.done && (_c = homePlayers_1.return)) _c.call(homePlayers_1);
                            }
                            finally { if (e_3) throw e_3.error; }
                        }
                        try {
                            for (var awayPlayers_1 = (e_4 = void 0, __values(awayPlayers)), awayPlayers_1_1 = awayPlayers_1.next(); !awayPlayers_1_1.done; awayPlayers_1_1 = awayPlayers_1.next()) {
                                var awayPlayerId = awayPlayers_1_1.value;
                                if (!playerIds.includes(awayPlayerId))
                                    events.push(getEvent(goalEvent.isHome ? Event_1.EventType.OnIceGoalAllowed : Event_1.EventType.OnIceGoal, awayPlayerId, metaInfo));
                            }
                        }
                        catch (e_4_1) { e_4 = { error: e_4_1 }; }
                        finally {
                            try {
                                if (awayPlayers_1_1 && !awayPlayers_1_1.done && (_d = awayPlayers_1.return)) _d.call(awayPlayers_1);
                            }
                            finally { if (e_4) throw e_4.error; }
                        }
                        break;
                    }
                    case Constants_1.EventTypeId.Shot: {
                        var shotEvent = getEvent(Event_1.EventType.Shot, play.players[0].player.id, metaInfo);
                        var saveEvent = getEvent(Event_1.EventType.Save, play.players[1].player.id, metaInfo);
                        events.push(shotEvent);
                        events.push(saveEvent);
                        try {
                            for (var homePlayers_2 = (e_5 = void 0, __values(homePlayers)), homePlayers_2_1 = homePlayers_2.next(); !homePlayers_2_1.done; homePlayers_2_1 = homePlayers_2.next()) {
                                var homePlayerId = homePlayers_2_1.value;
                                if (homePlayerId !== shotEvent.playerId && homePlayerId !== saveEvent.playerId)
                                    events.push(getEvent(shotEvent.isHome ? Event_1.EventType.OnIceShot : Event_1.EventType.OnIceSave, homePlayerId, metaInfo));
                            }
                        }
                        catch (e_5_1) { e_5 = { error: e_5_1 }; }
                        finally {
                            try {
                                if (homePlayers_2_1 && !homePlayers_2_1.done && (_e = homePlayers_2.return)) _e.call(homePlayers_2);
                            }
                            finally { if (e_5) throw e_5.error; }
                        }
                        try {
                            for (var awayPlayers_2 = (e_6 = void 0, __values(awayPlayers)), awayPlayers_2_1 = awayPlayers_2.next(); !awayPlayers_2_1.done; awayPlayers_2_1 = awayPlayers_2.next()) {
                                var awayPlayerId = awayPlayers_2_1.value;
                                if (awayPlayerId !== shotEvent.playerId && awayPlayerId !== saveEvent.playerId)
                                    events.push(getEvent(shotEvent.isHome ? Event_1.EventType.OnIceSave : Event_1.EventType.OnIceShot, awayPlayerId, metaInfo));
                            }
                        }
                        catch (e_6_1) { e_6 = { error: e_6_1 }; }
                        finally {
                            try {
                                if (awayPlayers_2_1 && !awayPlayers_2_1.done && (_f = awayPlayers_2.return)) _f.call(awayPlayers_2);
                            }
                            finally { if (e_6) throw e_6.error; }
                        }
                        break;
                    }
                    case Constants_1.EventTypeId.BlockedShot: {
                        var blockedShotEvent = getEvent(Event_1.EventType.BlockedShot, play.players[0].player.id, metaInfo);
                        var shotBlockedEvent = getEvent(Event_1.EventType.ShotBlocked, play.players[1].player.id, metaInfo);
                        events.push(blockedShotEvent);
                        events.push(shotBlockedEvent);
                        if (blockedShotEvent.isHome && homeGoalieId)
                            events.push(getEvent(Event_1.EventType.OnIceBlockedShot, homeGoalieId, metaInfo));
                        if (!blockedShotEvent.isHome && awayGoalieId)
                            events.push(getEvent(Event_1.EventType.OnIceShotBlocked, awayGoalieId, metaInfo));
                        try {
                            for (var homePlayers_3 = (e_7 = void 0, __values(homePlayers)), homePlayers_3_1 = homePlayers_3.next(); !homePlayers_3_1.done; homePlayers_3_1 = homePlayers_3.next()) {
                                var homePlayerId = homePlayers_3_1.value;
                                if (homePlayerId !== blockedShotEvent.playerId && homePlayerId !== shotBlockedEvent.playerId)
                                    events.push(getEvent(blockedShotEvent.isHome ? Event_1.EventType.OnIceBlockedShot : Event_1.EventType.OnIceShotBlocked, homePlayerId, metaInfo));
                            }
                        }
                        catch (e_7_1) { e_7 = { error: e_7_1 }; }
                        finally {
                            try {
                                if (homePlayers_3_1 && !homePlayers_3_1.done && (_g = homePlayers_3.return)) _g.call(homePlayers_3);
                            }
                            finally { if (e_7) throw e_7.error; }
                        }
                        try {
                            for (var awayPlayers_3 = (e_8 = void 0, __values(awayPlayers)), awayPlayers_3_1 = awayPlayers_3.next(); !awayPlayers_3_1.done; awayPlayers_3_1 = awayPlayers_3.next()) {
                                var awayPlayerId = awayPlayers_3_1.value;
                                if (awayPlayerId !== blockedShotEvent.playerId && awayPlayerId !== shotBlockedEvent.playerId)
                                    events.push(getEvent(blockedShotEvent.isHome ? Event_1.EventType.OnIceShotBlocked : Event_1.EventType.OnIceBlockedShot, awayPlayerId, metaInfo));
                            }
                        }
                        catch (e_8_1) { e_8 = { error: e_8_1 }; }
                        finally {
                            try {
                                if (awayPlayers_3_1 && !awayPlayers_3_1.done && (_h = awayPlayers_3.return)) _h.call(awayPlayers_3);
                            }
                            finally { if (e_8) throw e_8.error; }
                        }
                        break;
                    }
                    case Constants_1.EventTypeId.MissedShot: {
                        var shotMissEvent = getEvent(Event_1.EventType.ShotMissed, play.players[0].player.id, metaInfo);
                        events.push(shotMissEvent);
                        if (shotMissEvent.isHome && awayGoalieId)
                            events.push(getEvent(Event_1.EventType.OnIceMissedShot, awayGoalieId, metaInfo));
                        if (!shotMissEvent.isHome && homeGoalieId)
                            events.push(getEvent(Event_1.EventType.OnIceMissedShot, homeGoalieId, metaInfo));
                        try {
                            for (var homePlayers_4 = (e_9 = void 0, __values(homePlayers)), homePlayers_4_1 = homePlayers_4.next(); !homePlayers_4_1.done; homePlayers_4_1 = homePlayers_4.next()) {
                                var homePlayerId = homePlayers_4_1.value;
                                if (homePlayerId !== shotMissEvent.playerId)
                                    events.push(getEvent(shotMissEvent.isHome ? Event_1.EventType.OnIceShotMissed : Event_1.EventType.OnIceMissedShot, homePlayerId, metaInfo));
                            }
                        }
                        catch (e_9_1) { e_9 = { error: e_9_1 }; }
                        finally {
                            try {
                                if (homePlayers_4_1 && !homePlayers_4_1.done && (_j = homePlayers_4.return)) _j.call(homePlayers_4);
                            }
                            finally { if (e_9) throw e_9.error; }
                        }
                        try {
                            for (var awayPlayers_4 = (e_10 = void 0, __values(awayPlayers)), awayPlayers_4_1 = awayPlayers_4.next(); !awayPlayers_4_1.done; awayPlayers_4_1 = awayPlayers_4.next()) {
                                var awayPlayerId = awayPlayers_4_1.value;
                                if (awayPlayerId !== shotMissEvent.playerId)
                                    events.push(getEvent(shotMissEvent.isHome ? Event_1.EventType.OnIceMissedShot : Event_1.EventType.OnIceShotMissed, awayPlayerId, metaInfo));
                            }
                        }
                        catch (e_10_1) { e_10 = { error: e_10_1 }; }
                        finally {
                            try {
                                if (awayPlayers_4_1 && !awayPlayers_4_1.done && (_k = awayPlayers_4.return)) _k.call(awayPlayers_4);
                            }
                            finally { if (e_10) throw e_10.error; }
                        }
                        break;
                    }
                    case Constants_1.EventTypeId.Faceoff: {
                        var faceOffWinEvent = getEvent(Event_1.EventType.FaceoffWin, play.players[0].player.id, metaInfo);
                        var faceOffLoseEvent = getEvent(Event_1.EventType.FaceoffLoss, play.players[1].player.id, metaInfo);
                        events.push(faceOffWinEvent);
                        events.push(faceOffLoseEvent);
                        try {
                            for (var homePlayers_5 = (e_11 = void 0, __values(homePlayers)), homePlayers_5_1 = homePlayers_5.next(); !homePlayers_5_1.done; homePlayers_5_1 = homePlayers_5.next()) {
                                var homePlayerId = homePlayers_5_1.value;
                                if (homePlayerId !== faceOffWinEvent.playerId && homePlayerId !== faceOffLoseEvent.playerId) {
                                    events.push(getEvent(faceOffWinEvent.isHome ? Event_1.EventType.OnIceFaceoffWin : Event_1.EventType.OnIceFaceoffLoss, homePlayerId, metaInfo));
                                }
                            }
                        }
                        catch (e_11_1) { e_11 = { error: e_11_1 }; }
                        finally {
                            try {
                                if (homePlayers_5_1 && !homePlayers_5_1.done && (_l = homePlayers_5.return)) _l.call(homePlayers_5);
                            }
                            finally { if (e_11) throw e_11.error; }
                        }
                        try {
                            for (var awayPlayers_5 = (e_12 = void 0, __values(awayPlayers)), awayPlayers_5_1 = awayPlayers_5.next(); !awayPlayers_5_1.done; awayPlayers_5_1 = awayPlayers_5.next()) {
                                var awayPlayerId = awayPlayers_5_1.value;
                                if (awayPlayerId !== faceOffWinEvent.playerId && awayPlayerId !== faceOffLoseEvent.playerId) {
                                    events.push(getEvent(faceOffWinEvent.isHome ? Event_1.EventType.OnIceFaceoffLoss : Event_1.EventType.OnIceFaceoffWin, awayPlayerId, metaInfo));
                                }
                            }
                        }
                        catch (e_12_1) { e_12 = { error: e_12_1 }; }
                        finally {
                            try {
                                if (awayPlayers_5_1 && !awayPlayers_5_1.done && (_m = awayPlayers_5.return)) _m.call(awayPlayers_5);
                            }
                            finally { if (e_12) throw e_12.error; }
                        }
                        break;
                    }
                    case Constants_1.EventTypeId.Takeaway: {
                        var takeAwayEvent = getEvent(Event_1.EventType.Takeaway, play.players[0].player.id, metaInfo);
                        events.push(takeAwayEvent);
                        try {
                            for (var homePlayers_6 = (e_13 = void 0, __values(homePlayers)), homePlayers_6_1 = homePlayers_6.next(); !homePlayers_6_1.done; homePlayers_6_1 = homePlayers_6.next()) {
                                var homePlayerId = homePlayers_6_1.value;
                                if (homePlayerId !== takeAwayEvent.playerId)
                                    events.push(getEvent(takeAwayEvent.isHome ? Event_1.EventType.OnIceTakeaway : Event_1.EventType.OnIceGiveaway, homePlayerId, metaInfo));
                            }
                        }
                        catch (e_13_1) { e_13 = { error: e_13_1 }; }
                        finally {
                            try {
                                if (homePlayers_6_1 && !homePlayers_6_1.done && (_o = homePlayers_6.return)) _o.call(homePlayers_6);
                            }
                            finally { if (e_13) throw e_13.error; }
                        }
                        try {
                            for (var awayPlayers_6 = (e_14 = void 0, __values(awayPlayers)), awayPlayers_6_1 = awayPlayers_6.next(); !awayPlayers_6_1.done; awayPlayers_6_1 = awayPlayers_6.next()) {
                                var awayPlayerId = awayPlayers_6_1.value;
                                if (awayPlayerId !== takeAwayEvent.playerId)
                                    events.push(getEvent(takeAwayEvent.isHome ? Event_1.EventType.OnIceGiveaway : Event_1.EventType.OnIceTakeaway, awayPlayerId, metaInfo));
                            }
                        }
                        catch (e_14_1) { e_14 = { error: e_14_1 }; }
                        finally {
                            try {
                                if (awayPlayers_6_1 && !awayPlayers_6_1.done && (_p = awayPlayers_6.return)) _p.call(awayPlayers_6);
                            }
                            finally { if (e_14) throw e_14.error; }
                        }
                        break;
                    }
                    case Constants_1.EventTypeId.Giveaway: {
                        var giveAwayEvent = getEvent(Event_1.EventType.Giveaway, play.players[0].player.id, metaInfo);
                        events.push(giveAwayEvent);
                        try {
                            for (var homePlayers_7 = (e_15 = void 0, __values(homePlayers)), homePlayers_7_1 = homePlayers_7.next(); !homePlayers_7_1.done; homePlayers_7_1 = homePlayers_7.next()) {
                                var homePlayerId = homePlayers_7_1.value;
                                if (homePlayerId !== giveAwayEvent.playerId)
                                    events.push(getEvent(giveAwayEvent.isHome ? Event_1.EventType.OnIceGiveaway : Event_1.EventType.OnIceTakeaway, homePlayerId, metaInfo));
                            }
                        }
                        catch (e_15_1) { e_15 = { error: e_15_1 }; }
                        finally {
                            try {
                                if (homePlayers_7_1 && !homePlayers_7_1.done && (_q = homePlayers_7.return)) _q.call(homePlayers_7);
                            }
                            finally { if (e_15) throw e_15.error; }
                        }
                        try {
                            for (var awayPlayers_7 = (e_16 = void 0, __values(awayPlayers)), awayPlayers_7_1 = awayPlayers_7.next(); !awayPlayers_7_1.done; awayPlayers_7_1 = awayPlayers_7.next()) {
                                var awayPlayerId = awayPlayers_7_1.value;
                                if (awayPlayerId !== giveAwayEvent.playerId)
                                    events.push(getEvent(giveAwayEvent.isHome ? Event_1.EventType.OnIceTakeaway : Event_1.EventType.OnIceGiveaway, awayPlayerId, metaInfo));
                            }
                        }
                        catch (e_16_1) { e_16 = { error: e_16_1 }; }
                        finally {
                            try {
                                if (awayPlayers_7_1 && !awayPlayers_7_1.done && (_r = awayPlayers_7.return)) _r.call(awayPlayers_7);
                            }
                            finally { if (e_16) throw e_16.error; }
                        }
                        break;
                    }
                    case Constants_1.EventTypeId.Hit: {
                        var hitEvent = getEvent(Event_1.EventType.Hit, play.players[0].player.id, metaInfo);
                        var hitAgainstEvent = getEvent(Event_1.EventType.HitAgainst, play.players[1].player.id, metaInfo);
                        events.push(hitEvent);
                        events.push(hitAgainstEvent);
                        try {
                            for (var homePlayers_8 = (e_17 = void 0, __values(homePlayers)), homePlayers_8_1 = homePlayers_8.next(); !homePlayers_8_1.done; homePlayers_8_1 = homePlayers_8.next()) {
                                var homePlayerId = homePlayers_8_1.value;
                                if (homePlayerId !== hitEvent.playerId && homePlayerId !== hitAgainstEvent.playerId)
                                    events.push(getEvent(hitEvent.isHome ? Event_1.EventType.OnIceHit : Event_1.EventType.OnIceHitAgainst, homePlayerId, metaInfo));
                            }
                        }
                        catch (e_17_1) { e_17 = { error: e_17_1 }; }
                        finally {
                            try {
                                if (homePlayers_8_1 && !homePlayers_8_1.done && (_s = homePlayers_8.return)) _s.call(homePlayers_8);
                            }
                            finally { if (e_17) throw e_17.error; }
                        }
                        try {
                            for (var awayPlayers_8 = (e_18 = void 0, __values(awayPlayers)), awayPlayers_8_1 = awayPlayers_8.next(); !awayPlayers_8_1.done; awayPlayers_8_1 = awayPlayers_8.next()) {
                                var awayPlayerId = awayPlayers_8_1.value;
                                if (awayPlayerId !== hitEvent.playerId && awayPlayerId !== hitAgainstEvent.playerId)
                                    events.push(getEvent(hitEvent.isHome ? Event_1.EventType.OnIceHitAgainst : Event_1.EventType.OnIceHit, awayPlayerId, metaInfo));
                            }
                        }
                        catch (e_18_1) { e_18 = { error: e_18_1 }; }
                        finally {
                            try {
                                if (awayPlayers_8_1 && !awayPlayers_8_1.done && (_t = awayPlayers_8.return)) _t.call(awayPlayers_8);
                            }
                            finally { if (e_18) throw e_18.error; }
                        }
                        break;
                    }
                    case Constants_1.EventTypeId.Penalty: {
                        var penaltyAgainstEvent = getEvent(Event_1.EventType.PenaltyAgainst, play.players[0].player.id, metaInfo);
                        events.push(penaltyAgainstEvent);
                        var penaltyForEvent = void 0;
                        if (play.players.length > 1) {
                            penaltyForEvent = getEvent(Event_1.EventType.PenaltyFor, play.players[1].player.id, metaInfo);
                        }
                        try {
                            for (var homePlayers_9 = (e_19 = void 0, __values(homePlayers)), homePlayers_9_1 = homePlayers_9.next(); !homePlayers_9_1.done; homePlayers_9_1 = homePlayers_9.next()) {
                                var homePlayerId = homePlayers_9_1.value;
                                if (homePlayerId !== penaltyAgainstEvent.playerId && (!penaltyForEvent || penaltyForEvent.playerId !== homePlayerId))
                                    events.push(getEvent(penaltyAgainstEvent.isHome ? Event_1.EventType.OnIcePenaltyAgainst : Event_1.EventType.OnIcePenaltyFor, homePlayerId, metaInfo));
                            }
                        }
                        catch (e_19_1) { e_19 = { error: e_19_1 }; }
                        finally {
                            try {
                                if (homePlayers_9_1 && !homePlayers_9_1.done && (_u = homePlayers_9.return)) _u.call(homePlayers_9);
                            }
                            finally { if (e_19) throw e_19.error; }
                        }
                        try {
                            for (var awayPlayers_9 = (e_20 = void 0, __values(awayPlayers)), awayPlayers_9_1 = awayPlayers_9.next(); !awayPlayers_9_1.done; awayPlayers_9_1 = awayPlayers_9.next()) {
                                var awayPlayerId = awayPlayers_9_1.value;
                                if (awayPlayerId !== penaltyAgainstEvent.playerId && (!penaltyForEvent || penaltyForEvent.playerId !== awayPlayerId))
                                    events.push(getEvent(penaltyAgainstEvent.isHome ? Event_1.EventType.OnIcePenaltyFor : Event_1.EventType.OnIcePenaltyAgainst, awayPlayerId, metaInfo));
                            }
                        }
                        catch (e_20_1) { e_20 = { error: e_20_1 }; }
                        finally {
                            try {
                                if (awayPlayers_9_1 && !awayPlayers_9_1.done && (_v = awayPlayers_9.return)) _v.call(awayPlayers_9);
                            }
                            finally { if (e_20) throw e_20.error; }
                        }
                        break;
                    }
                    case Constants_1.EventTypeId.Stop: {
                        var players = __spread(homePlayers, awayPlayers);
                        if (play.result.description === Constants_1.Description.Icing) {
                            try {
                                for (var players_1 = (e_21 = void 0, __values(players)), players_1_1 = players_1.next(); !players_1_1.done; players_1_1 = players_1.next()) {
                                    var playerId = players_1_1.value;
                                    events.push(getEvent(Event_1.EventType.OnIceIcing, playerId, metaInfo));
                                }
                            }
                            catch (e_21_1) { e_21 = { error: e_21_1 }; }
                            finally {
                                try {
                                    if (players_1_1 && !players_1_1.done && (_w = players_1.return)) _w.call(players_1);
                                }
                                finally { if (e_21) throw e_21.error; }
                            }
                        }
                        else if (play.result.description === Constants_1.Description.Offside) {
                            try {
                                for (var players_2 = (e_22 = void 0, __values(players)), players_2_1 = players_2.next(); !players_2_1.done; players_2_1 = players_2.next()) {
                                    var playerId = players_2_1.value;
                                    events.push(getEvent(Event_1.EventType.OnIceOffside, playerId, metaInfo));
                                }
                            }
                            catch (e_22_1) { e_22 = { error: e_22_1 }; }
                            finally {
                                try {
                                    if (players_2_1 && !players_2_1.done && (_x = players_2.return)) _x.call(players_2);
                                }
                                finally { if (e_22) throw e_22.error; }
                            }
                        }
                        else if (play.result.description.includes(Constants_1.Description.Puck)) {
                            try {
                                for (var players_3 = (e_23 = void 0, __values(players)), players_3_1 = players_3.next(); !players_3_1.done; players_3_1 = players_3.next()) {
                                    var playerId = players_3_1.value;
                                    events.push(getEvent(Event_1.EventType.OnIcePuckOutOfPlay, playerId, metaInfo));
                                }
                            }
                            catch (e_23_1) { e_23 = { error: e_23_1 }; }
                            finally {
                                try {
                                    if (players_3_1 && !players_3_1.done && (_y = players_3.return)) _y.call(players_3);
                                }
                                finally { if (e_23) throw e_23.error; }
                            }
                        }
                        break;
                    }
                    default:
                        break;
                }
            }
            else {
                switch (play.result.eventTypeId) {
                    case Constants_1.EventTypeId.Goal: {
                        events.push(getEvent(Event_1.EventType.ShootOutGoal, play.players[0].player.id, metaInfo));
                        events.push(getEvent(Event_1.EventType.ShootOutGoalAllowed, play.players[1].player.id, metaInfo));
                        break;
                    }
                    case Constants_1.EventTypeId.Shot: {
                        events.push(getEvent(Event_1.EventType.ShootOutShot, play.players[0].player.id, metaInfo));
                        events.push(getEvent(Event_1.EventType.ShootOutSave, play.players[1].player.id, metaInfo));
                        break;
                    }
                    case Constants_1.EventTypeId.MissedShot: {
                        var shotMissEvent = getEvent(Event_1.EventType.ShootOutMiss, play.players[0].player.id, metaInfo);
                        events.push(shotMissEvent);
                        if (shotMissEvent.isHome && awayGoalieId)
                            events.push(getEvent(Event_1.EventType.ShootOutOnIceMiss, awayGoalieId, metaInfo));
                        if (!shotMissEvent.isHome && homeGoalieId)
                            events.push(getEvent(Event_1.EventType.ShootOutOnIceMiss, homeGoalieId, metaInfo));
                        break;
                    }
                    default:
                        break;
                }
            }
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (plays_1_1 && !plays_1_1.done && (_a = plays_1.return)) _a.call(plays_1);
        }
        finally { if (e_1) throw e_1.error; }
    }
    return events;
}
exports.getEvents = getEvents;
