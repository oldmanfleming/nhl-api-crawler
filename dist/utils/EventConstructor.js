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
Object.defineProperty(exports, "__esModule", { value: true });
exports.constructEvents = void 0;
var Event_1 = require("../entities/Event");
function parseBoxScore(gamePk, gameType, timestamp, team, isHome, opposingTeamId) {
    var events = [];
    var eventIdx = 0;
    Object.keys(team.players).forEach(function (key) {
        var player = team.players[key];
        var playerStats = player.stats;
        var baseEvent = Object.assign({
            gamePk: gamePk,
            gameType: gameType,
            timestamp: timestamp,
            secondaryType: '',
            secondaryNumber: 0,
            playTime: 0,
            playerId: player.person.id,
            playerType: player.position.abbreviation,
            playerHandedness: player.person.shootsCatches,
            players: [],
            opposingPlayers: [],
            isHome: isHome,
            teamId: team.team.id,
            opposingTeamId: opposingTeamId,
            teamScore: 0,
            opposingTeamScore: 0
        });
        if (playerStats.goalieStats) {
            var goalieStats = playerStats.goalieStats;
            for (var i = 0; i < goalieStats.powerPlaySaves; i += 1) {
                var event_1 = Object.assign(baseEvent);
                event_1.type = Event_1.EventType.Save;
                event_1.idx = eventIdx++;
                event_1.opposingStrength = 5;
                event_1.teamStrength = 4;
                events.push(event_1);
            }
            for (var i = 0; i < goalieStats.shortHandedSaves; i += 1) {
                var event_2 = Object.assign(baseEvent);
                event_2.type = Event_1.EventType.Save;
                event_2.idx = eventIdx++;
                event_2.opposingStrength = 4;
                event_2.teamStrength = 5;
                events.push(event_2);
            }
            for (var i = 0; i < goalieStats.evenSaves; i += 1) {
                var event_3 = Object.assign(baseEvent);
                event_3.type = Event_1.EventType.Save;
                event_3.idx = eventIdx++;
                event_3.opposingStrength = 5;
                event_3.teamStrength = 5;
                events.push(event_3);
            }
            // Goals Allowed
            for (var i = 0; i < goalieStats.powerPlayShotsAgainst - goalieStats.powerPlaySaves; i += 1) {
                var event_4 = Object.assign(baseEvent);
                event_4.type = Event_1.EventType.GoalAllowed;
                event_4.idx = eventIdx++;
                event_4.opposingStrength = 5;
                event_4.teamStrength = 4;
                events.push(event_4);
            }
            for (var i = 0; i < goalieStats.evenShotsAgainst - goalieStats.evenSaves; i += 1) {
                var event_5 = Object.assign(baseEvent);
                event_5.type = Event_1.EventType.GoalAllowed;
                event_5.idx = eventIdx++;
                event_5.opposingStrength = 5;
                event_5.teamStrength = 5;
                events.push(event_5);
            }
            for (var i = 0; i < goalieStats.shortHandedShotsAgainst - goalieStats.shortHandedSaves; i += 1) {
                var event_6 = Object.assign(baseEvent);
                event_6.type = Event_1.EventType.GoalAllowed;
                event_6.idx = eventIdx++;
                event_6.opposingStrength = 4;
                event_6.teamStrength = 5;
                events.push(event_6);
            }
        }
        else if (playerStats.skaterStats) {
            var skaterStats = playerStats.skaterStats;
            for (var i = 0; i < skaterStats.goals - skaterStats.powerPlayGoals - skaterStats.shortHandedGoals; i += 1) {
                var event_7 = Object.assign(baseEvent);
                event_7.type = Event_1.EventType.Goal;
                event_7.idx = eventIdx++;
                event_7.opposingStrength = 5;
                event_7.teamStrength = 5;
                events.push(event_7);
            }
            for (var i = 0; i < skaterStats.powerPlayGoals; i += 1) {
                var event_8 = Object.assign(baseEvent);
                event_8.type = Event_1.EventType.Goal;
                event_8.idx = eventIdx++;
                event_8.opposingStrength = 4;
                event_8.teamStrength = 5;
                events.push(event_8);
            }
            for (var i = 0; i < skaterStats.shortHandedGoals; i += 1) {
                var event_9 = Object.assign(baseEvent);
                event_9.type = Event_1.EventType.Goal;
                event_9.idx = eventIdx++;
                event_9.opposingStrength = 5;
                event_9.teamStrength = 4;
                events.push(event_9);
            }
            // Assists
            for (var i = 0; i < skaterStats.assists - skaterStats.powerPlayAssists - skaterStats.shortHandedAssists; i += 1) {
                var event_10 = Object.assign(baseEvent);
                event_10.type = Event_1.EventType.Assist;
                event_10.idx = eventIdx++;
                event_10.opposingStrength = 5;
                event_10.teamStrength = 5;
                events.push(event_10);
            }
            for (var i = 0; i < skaterStats.powerPlayAssists; i += 1) {
                var event_11 = Object.assign(baseEvent);
                event_11.type = Event_1.EventType.Assist;
                event_11.idx = eventIdx++;
                event_11.opposingStrength = 4;
                event_11.teamStrength = 5;
                events.push(event_11);
            }
            for (var i = 0; i < skaterStats.shortHandedAssists; i += 1) {
                var event_12 = Object.assign(baseEvent);
                event_12.type = Event_1.EventType.Assist;
                event_12.idx = eventIdx++;
                event_12.opposingStrength = 5;
                event_12.teamStrength = 4;
                events.push(event_12);
            }
            // Others
            for (var i = 0; i < skaterStats.shots - skaterStats.goals - skaterStats.powerPlayGoals - skaterStats.shortHandedGoals; i += 1) {
                var event_13 = Object.assign(baseEvent);
                event_13.type = Event_1.EventType.Shot;
                event_13.idx = eventIdx++;
                event_13.opposingStrength = 5;
                event_13.teamStrength = 5;
                events.push(event_13);
            }
            for (var i = 0; i < skaterStats.hits; i += 1) {
                var event_14 = Object.assign(baseEvent);
                event_14.type = Event_1.EventType.Hit;
                event_14.idx = eventIdx++;
                event_14.opposingStrength = 5;
                event_14.teamStrength = 5;
                events.push(event_14);
            }
            for (var i = 0; i < skaterStats.faceOffWins; i += 1) {
                var event_15 = Object.assign(baseEvent);
                event_15.type = Event_1.EventType.FaceoffWin;
                event_15.idx = eventIdx++;
                event_15.opposingStrength = 5;
                event_15.teamStrength = 5;
                events.push(event_15);
            }
            for (var i = 0; i < skaterStats.faceoffTaken - skaterStats.faceOffWins; i += 1) {
                var event_16 = Object.assign(baseEvent);
                event_16.type = Event_1.EventType.FaceoffLoss;
                event_16.idx = eventIdx++;
                event_16.opposingStrength = 5;
                event_16.teamStrength = 5;
                events.push(event_16);
            }
            for (var i = 0; i < skaterStats.takeaways; i += 1) {
                var event_17 = Object.assign(baseEvent);
                event_17.type = Event_1.EventType.Takeaway;
                event_17.idx = eventIdx++;
                event_17.opposingStrength = 5;
                event_17.teamStrength = 5;
                events.push(event_17);
            }
            for (var i = 0; i < skaterStats.giveaways; i += 1) {
                var event_18 = Object.assign(baseEvent);
                event_18.type = Event_1.EventType.Giveaway;
                event_18.idx = eventIdx++;
                event_18.opposingStrength = 5;
                event_18.teamStrength = 5;
                events.push(event_18);
            }
            for (var i = 0; i < skaterStats.blocked; i += 1) {
                var event_19 = Object.assign(baseEvent);
                event_19.type = Event_1.EventType.BlockedShot;
                event_19.idx = eventIdx++;
                event_19.opposingStrength = 5;
                event_19.teamStrength = 5;
                events.push(event_19);
            }
        }
    });
    return events;
}
function constructEvents(gameEvents) {
    var gamePk = gameEvents.data.gamePk;
    var timestamp = new Date(gameEvents.data.gameData.datetime.dateTime);
    var gameType = gameEvents.data.gameData.game.type;
    var homeTeam = gameEvents.data.liveData.boxscore.teams.home;
    var awayTeam = gameEvents.data.liveData.boxscore.teams.away;
    var homeEvents = parseBoxScore(gamePk, gameType, timestamp, homeTeam, true, awayTeam.team.id);
    var awayEvents = parseBoxScore(gamePk, gameType, timestamp, awayTeam, false, homeTeam.team.id);
    return __spread(homeEvents, awayEvents);
}
exports.constructEvents = constructEvents;
