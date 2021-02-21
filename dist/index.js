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
        while (_) try {
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.crawlResults = exports.crawlShifts = exports.crawlEvents = exports.crawlPlayers = exports.crawlTeams = void 0;
var joi_1 = require("joi");
var axios_1 = __importDefault(require("axios"));
var ResultParser_1 = require("./utils/ResultParser");
var EventParser_1 = require("./utils/EventParser");
var ShiftParser_1 = require("./utils/ShiftParser");
var crawlTeams = function () { return __awaiter(void 0, void 0, void 0, function () {
    var teams, teamProfiles, i, teamData, team;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                console.log('Beginning team crawl');
                teams = [];
                return [4 /*yield*/, axios_1.default("http://statsapi.web.nhl.com/api/v1/teams")];
            case 1:
                teamProfiles = _a.sent();
                for (i = 0; i < teamProfiles.data.teams.length; i += 1) {
                    teamData = teamProfiles.data.teams[i];
                    team = {
                        id: teamData.id,
                        name: teamData.name,
                        venue: teamData.venue.name,
                        city: teamData.venue.city,
                        abbreviation: teamData.abbreviation,
                        teamName: teamData.teamName,
                        locationName: teamData.locationName,
                        division: teamData.division.name,
                        divisionId: teamData.division.id,
                        conference: teamData.conference.name,
                        conferenceId: teamData.conference.id,
                    };
                    teams.push(team);
                }
                console.log('Finished team crawl');
                return [2 /*return*/, teams];
        }
    });
}); };
exports.crawlTeams = crawlTeams;
var crawlPlayers = function (startYear, endYear) { return __awaiter(void 0, void 0, void 0, function () {
    var playerIdSet, countRequest, i, playerList, _a, _b, player, i, playerList, _c, _d, player, playerProfiles, playerIdSet_1, playerIdSet_1_1, playerId, playerProfile, playerData, e_1_1;
    var e_2, _e, e_3, _f, e_1, _g;
    return __generator(this, function (_h) {
        switch (_h.label) {
            case 0:
                joi_1.assert({ startYear: startYear, endYear: endYear }, joi_1.object({
                    startYear: joi_1.string().length(8).alphanum().required(),
                    endYear: joi_1.string().length(8).alphanum().required(),
                }));
                console.log('Beginning player crawl');
                playerIdSet = new Set();
                return [4 /*yield*/, axios_1.default("https://api.nhle.com/stats/rest/en/skater/summary?cayenneExp=seasonId>=" + startYear + "%20and%20seasonId<=" + endYear)];
            case 1:
                countRequest = _h.sent();
                i = 0;
                _h.label = 2;
            case 2:
                if (!(i < countRequest.data.total)) return [3 /*break*/, 5];
                return [4 /*yield*/, axios_1.default("https://api.nhle.com/stats/rest/en/skater/summary?start=" + i + "&limit=" + 100 + "&cayenneExp=seasonId>=" + startYear + "%20and%20seasonId<=" + endYear)];
            case 3:
                playerList = _h.sent();
                try {
                    for (_a = (e_2 = void 0, __values(playerList.data.data)), _b = _a.next(); !_b.done; _b = _a.next()) {
                        player = _b.value;
                        playerIdSet.add(player.playerId);
                    }
                }
                catch (e_2_1) { e_2 = { error: e_2_1 }; }
                finally {
                    try {
                        if (_b && !_b.done && (_e = _a.return)) _e.call(_a);
                    }
                    finally { if (e_2) throw e_2.error; }
                }
                _h.label = 4;
            case 4:
                i += 100;
                return [3 /*break*/, 2];
            case 5: return [4 /*yield*/, axios_1.default("https://api.nhle.com/stats/rest/en/goalie/summary?cayenneExp=seasonId>=" + startYear + "%20and%20seasonId<=" + endYear)];
            case 6:
                countRequest = _h.sent();
                i = 0;
                _h.label = 7;
            case 7:
                if (!(i < countRequest.data.total)) return [3 /*break*/, 10];
                return [4 /*yield*/, axios_1.default("https://api.nhle.com/stats/rest/en/goalie/summary?start=" + i + "&limit=" + 100 + "&cayenneExp=seasonId>=" + startYear + "%20and%20seasonId<=" + endYear)];
            case 8:
                playerList = _h.sent();
                try {
                    for (_c = (e_3 = void 0, __values(playerList.data.data)), _d = _c.next(); !_d.done; _d = _c.next()) {
                        player = _d.value;
                        playerIdSet.add(player.playerId);
                    }
                }
                catch (e_3_1) { e_3 = { error: e_3_1 }; }
                finally {
                    try {
                        if (_d && !_d.done && (_f = _c.return)) _f.call(_c);
                    }
                    finally { if (e_3) throw e_3.error; }
                }
                _h.label = 9;
            case 9:
                i += 100;
                return [3 /*break*/, 7];
            case 10:
                playerProfiles = [];
                _h.label = 11;
            case 11:
                _h.trys.push([11, 16, 17, 18]);
                playerIdSet_1 = __values(playerIdSet), playerIdSet_1_1 = playerIdSet_1.next();
                _h.label = 12;
            case 12:
                if (!!playerIdSet_1_1.done) return [3 /*break*/, 15];
                playerId = playerIdSet_1_1.value;
                console.log("fetching player " + playerId);
                return [4 /*yield*/, axios_1.default("https://statsapi.web.nhl.com/api/v1/people/" + playerId + "?expand=person")];
            case 13:
                playerProfile = _h.sent();
                playerData = playerProfile.data.people[0];
                playerProfiles.push({
                    id: playerData.id,
                    fullName: playerData.fullName,
                    firstName: playerData.firstName,
                    lastName: playerData.lastName,
                    primaryNumber: parseInt(playerData.primaryNumber),
                    birthDate: playerData.birthDate,
                    currentAge: playerData.currentAge,
                    birthCity: playerData.birthCity,
                    birthCountry: playerData.birthCountry,
                    nationality: playerData.nationality,
                    height: playerData.height,
                    weight: playerData.weight,
                    active: playerData.active,
                    alternateCaptain: playerData.alternateCaptain,
                    captain: playerData.captain,
                    rookie: playerData.rookie,
                    shootsCatches: playerData.shootsCatches,
                    rosterStatus: playerData.rosterStatus,
                    primaryPosition: playerData.primaryPosition.type,
                    currentTeamId: playerData.currentTeam && playerData.currentTeam.id,
                });
                _h.label = 14;
            case 14:
                playerIdSet_1_1 = playerIdSet_1.next();
                return [3 /*break*/, 12];
            case 15: return [3 /*break*/, 18];
            case 16:
                e_1_1 = _h.sent();
                e_1 = { error: e_1_1 };
                return [3 /*break*/, 18];
            case 17:
                try {
                    if (playerIdSet_1_1 && !playerIdSet_1_1.done && (_g = playerIdSet_1.return)) _g.call(playerIdSet_1);
                }
                finally { if (e_1) throw e_1.error; }
                return [7 /*endfinally*/];
            case 18:
                console.log('finished player crawl');
                return [2 /*return*/, playerProfiles];
        }
    });
}); };
exports.crawlPlayers = crawlPlayers;
var crawlEvents = function (startDate, endDate) { return __awaiter(void 0, void 0, void 0, function () {
    var gamePks, events, gamePks_1, gamePks_1_1, gamePk, gameEvents, gameShifts, eventsByGame, e_4_1;
    var e_4, _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                console.log('Beginning event crawl');
                return [4 /*yield*/, crawlGames(startDate, endDate)];
            case 1:
                gamePks = _b.sent();
                events = [];
                _b.label = 2;
            case 2:
                _b.trys.push([2, 8, 9, 10]);
                gamePks_1 = __values(gamePks), gamePks_1_1 = gamePks_1.next();
                _b.label = 3;
            case 3:
                if (!!gamePks_1_1.done) return [3 /*break*/, 7];
                gamePk = gamePks_1_1.value;
                console.log("Beginning game " + gamePk);
                return [4 /*yield*/, axios_1.default("https://statsapi.web.nhl.com/api/v1/game/" + gamePk + "/feed/live")];
            case 4:
                gameEvents = _b.sent();
                return [4 /*yield*/, axios_1.default("https://api.nhle.com/stats/rest/en/shiftcharts?cayenneExp=gameId=" + gamePk)];
            case 5:
                gameShifts = _b.sent();
                if (gameEvents.data.gameData.status.abstractGameState !== 'Final') {
                    console.error("Game state not final for game " + gamePk + " - skipping game...");
                    return [3 /*break*/, 6];
                }
                if (!gameShifts.data.data.length) {
                    console.error("Game shifts not found for game " + gamePk + " - skipping game...");
                    return [3 /*break*/, 6];
                }
                if (!gameEvents.data.liveData.plays.allPlays.length) {
                    console.error("Game events not found for game " + gamePk + " - skipping game...");
                    return [3 /*break*/, 6];
                }
                eventsByGame = EventParser_1.getEvents(gamePk, gameEvents, gameShifts);
                events.concat(eventsByGame);
                console.log("Finsihed game " + gamePk);
                _b.label = 6;
            case 6:
                gamePks_1_1 = gamePks_1.next();
                return [3 /*break*/, 3];
            case 7: return [3 /*break*/, 10];
            case 8:
                e_4_1 = _b.sent();
                e_4 = { error: e_4_1 };
                return [3 /*break*/, 10];
            case 9:
                try {
                    if (gamePks_1_1 && !gamePks_1_1.done && (_a = gamePks_1.return)) _a.call(gamePks_1);
                }
                finally { if (e_4) throw e_4.error; }
                return [7 /*endfinally*/];
            case 10:
                console.log('Finished event crawl');
                return [2 /*return*/, events];
        }
    });
}); };
exports.crawlEvents = crawlEvents;
var crawlShifts = function (startDate, endDate) { return __awaiter(void 0, void 0, void 0, function () {
    var gamePks, shifts, gamePks_2, gamePks_2_1, gamePk, gameEvents, gameShifts, shiftsByGame, e_5_1;
    var e_5, _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                console.log('Beginning shift crawl');
                return [4 /*yield*/, crawlGames(startDate, endDate)];
            case 1:
                gamePks = _b.sent();
                shifts = [];
                _b.label = 2;
            case 2:
                _b.trys.push([2, 8, 9, 10]);
                gamePks_2 = __values(gamePks), gamePks_2_1 = gamePks_2.next();
                _b.label = 3;
            case 3:
                if (!!gamePks_2_1.done) return [3 /*break*/, 7];
                gamePk = gamePks_2_1.value;
                console.log("Beginning game " + gamePk);
                return [4 /*yield*/, axios_1.default("https://statsapi.web.nhl.com/api/v1/game/" + gamePk + "/feed/live")];
            case 4:
                gameEvents = _b.sent();
                return [4 /*yield*/, axios_1.default("https://api.nhle.com/stats/rest/en/shiftcharts?cayenneExp=gameId=" + gamePk)];
            case 5:
                gameShifts = _b.sent();
                if (gameEvents.data.gameData.status.abstractGameState !== 'Final') {
                    console.error("Game state not final for game " + gamePk + " - skipping game...");
                    return [3 /*break*/, 6];
                }
                if (!gameShifts.data.data.length) {
                    console.error("Game shifts not found for game " + gamePk + " - skipping game...");
                    return [3 /*break*/, 6];
                }
                if (!gameEvents.data.liveData.plays.allPlays.length) {
                    console.error("Game events not found for game " + gamePk + " - skipping game...");
                    return [3 /*break*/, 6];
                }
                shiftsByGame = ShiftParser_1.getShifts(gameShifts, gameEvents);
                shifts.concat(shiftsByGame);
                console.log("Finsihed game " + gamePk);
                _b.label = 6;
            case 6:
                gamePks_2_1 = gamePks_2.next();
                return [3 /*break*/, 3];
            case 7: return [3 /*break*/, 10];
            case 8:
                e_5_1 = _b.sent();
                e_5 = { error: e_5_1 };
                return [3 /*break*/, 10];
            case 9:
                try {
                    if (gamePks_2_1 && !gamePks_2_1.done && (_a = gamePks_2.return)) _a.call(gamePks_2);
                }
                finally { if (e_5) throw e_5.error; }
                return [7 /*endfinally*/];
            case 10:
                console.log('Finished shift crawl');
                return [2 /*return*/, shifts];
        }
    });
}); };
exports.crawlShifts = crawlShifts;
var crawlResults = function (startDate, endDate) { return __awaiter(void 0, void 0, void 0, function () {
    var gamePks, results, gamePks_3, gamePks_3_1, gamePk, gameEvents, gameShifts, gameSummaries, resultsByGame, e_6_1;
    var e_6, _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                console.log('Beginning result crawl');
                return [4 /*yield*/, crawlGames(startDate, endDate)];
            case 1:
                gamePks = _b.sent();
                results = [];
                _b.label = 2;
            case 2:
                _b.trys.push([2, 9, 10, 11]);
                gamePks_3 = __values(gamePks), gamePks_3_1 = gamePks_3.next();
                _b.label = 3;
            case 3:
                if (!!gamePks_3_1.done) return [3 /*break*/, 8];
                gamePk = gamePks_3_1.value;
                console.log("Beginning game " + gamePk);
                return [4 /*yield*/, axios_1.default("https://statsapi.web.nhl.com/api/v1/game/" + gamePk + "/feed/live")];
            case 4:
                gameEvents = _b.sent();
                return [4 /*yield*/, axios_1.default("https://api.nhle.com/stats/rest/en/shiftcharts?cayenneExp=gameId=" + gamePk)];
            case 5:
                gameShifts = _b.sent();
                return [4 /*yield*/, axios_1.default("https://api.nhle.com/stats/rest/en/team/summary?reportType=basic&isGame=true&reportName=teamsummary&cayenneExp=gameId=" + gamePk)];
            case 6:
                gameSummaries = _b.sent();
                if (gameEvents.data.gameData.status.abstractGameState !== 'Final') {
                    console.error("Game state not final for game " + gamePk + " - skipping game...");
                    return [3 /*break*/, 7];
                }
                if (!gameShifts.data.data.length) {
                    console.error("Game shifts not found for game " + gamePk + " - skipping game...");
                    return [3 /*break*/, 7];
                }
                if (!gameEvents.data.liveData.plays.allPlays.length) {
                    console.error("Game events not found for game " + gamePk + " - skipping game...");
                    return [3 /*break*/, 7];
                }
                resultsByGame = ResultParser_1.getResults(gamePk, gameEvents, gameSummaries, gameShifts);
                results.concat(resultsByGame);
                console.log("Finsihed game " + gamePk);
                _b.label = 7;
            case 7:
                gamePks_3_1 = gamePks_3.next();
                return [3 /*break*/, 3];
            case 8: return [3 /*break*/, 11];
            case 9:
                e_6_1 = _b.sent();
                e_6 = { error: e_6_1 };
                return [3 /*break*/, 11];
            case 10:
                try {
                    if (gamePks_3_1 && !gamePks_3_1.done && (_a = gamePks_3.return)) _a.call(gamePks_3);
                }
                finally { if (e_6) throw e_6.error; }
                return [7 /*endfinally*/];
            case 11:
                console.log('Finished result crawl');
                return [2 /*return*/, results];
        }
    });
}); };
exports.crawlResults = crawlResults;
var crawlGames = function (startDate, endDate) { return __awaiter(void 0, void 0, void 0, function () {
    var startDateTime, endDateTime, gamePks, date_1, schedule, gamePksForDate;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                joi_1.assert({ startDate: startDate, endDate: endDate }, joi_1.object({
                    startDate: joi_1.date().required(),
                    endDate: joi_1.date().required(),
                }));
                startDateTime = new Date(startDate + "T12:00:00.000Z");
                endDateTime = new Date(endDate + "T12:00:00.000Z");
                gamePks = [];
                date_1 = startDateTime;
                _a.label = 1;
            case 1:
                if (!(date_1 <= endDateTime)) return [3 /*break*/, 4];
                return [4 /*yield*/, axios_1.default("https://statsapi.web.nhl.com/api/v1/schedule?date=" + date_1.toISOString().split('T')[0])];
            case 2:
                schedule = _a.sent();
                if (!schedule.data.dates.length) {
                    return [3 /*break*/, 3];
                }
                gamePksForDate = schedule.data.dates[0].games.map(function (game) { return game.gamePk; });
                gamePks.concat(gamePksForDate);
                _a.label = 3;
            case 3:
                date_1.setDate(date_1.getDate() + 1);
                return [3 /*break*/, 1];
            case 4:
                console.log(gamePks.length + " games found between " + startDate + " and " + endDate);
                return [2 /*return*/, gamePks];
        }
    });
}); };
