"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HomeRoad = exports.GameType = exports.PositionAbbreviation = exports.PlayerType = exports.SecondaryEventType = exports.PeriodType = exports.Side = exports.Description = exports.EventTypeId = void 0;
var EventTypeId;
(function (EventTypeId) {
    EventTypeId["Hit"] = "HIT";
    EventTypeId["BlockedShot"] = "BLOCKED_SHOT";
    EventTypeId["MissedShot"] = "MISSED_SHOT";
    EventTypeId["Shot"] = "SHOT";
    EventTypeId["Save"] = "SAVE";
    EventTypeId["Faceoff"] = "FACEOFF";
    EventTypeId["Penalty"] = "PENALTY";
    EventTypeId["Goal"] = "GOAL";
    EventTypeId["Takeaway"] = "TAKEAWAY";
    EventTypeId["Giveaway"] = "GIVEAWAY";
    EventTypeId["GameScheduled"] = "GAME_SCHEDULED";
    EventTypeId["Stop"] = "STOP";
})(EventTypeId = exports.EventTypeId || (exports.EventTypeId = {}));
var Description;
(function (Description) {
    Description["Icing"] = "Icing";
    Description["Offside"] = "Offside";
    Description["GoalieStopped"] = "Goalie Stopped";
    Description["Puck"] = "Puck";
})(Description = exports.Description || (exports.Description = {}));
var Side;
(function (Side) {
    Side["Home"] = "HOME";
    Side["Away"] = "AWAY";
})(Side = exports.Side || (exports.Side = {}));
var PeriodType;
(function (PeriodType) {
    PeriodType["Regular"] = "REGULAR";
    PeriodType["Shootout"] = "SHOOTOUT";
})(PeriodType = exports.PeriodType || (exports.PeriodType = {}));
var SecondaryEventType;
(function (SecondaryEventType) {
    SecondaryEventType["Fighting"] = "Fighting";
    SecondaryEventType["Tripping"] = "Tripping";
    SecondaryEventType["WristShot"] = "Wrist Shot";
    SecondaryEventType["SnapShot"] = "Snap Shot";
    SecondaryEventType["SlapShot"] = "Slap Shot";
    SecondaryEventType["TipIn"] = "Tip-In";
    SecondaryEventType["Backhand"] = "Backhand";
})(SecondaryEventType = exports.SecondaryEventType || (exports.SecondaryEventType = {}));
var PlayerType;
(function (PlayerType) {
    PlayerType["Assist"] = "Assist";
    PlayerType["Goalie"] = "Goalie";
})(PlayerType = exports.PlayerType || (exports.PlayerType = {}));
var PositionAbbreviation;
(function (PositionAbbreviation) {
    PositionAbbreviation["Defenseman"] = "D";
    PositionAbbreviation["Goalie"] = "G";
    PositionAbbreviation["LeftWing"] = "LW";
    PositionAbbreviation["RightWing"] = "RW";
    PositionAbbreviation["Centre"] = "C";
})(PositionAbbreviation = exports.PositionAbbreviation || (exports.PositionAbbreviation = {}));
var GameType;
(function (GameType) {
    GameType["RegularGameType"] = "R";
    GameType["PlayoffGameType"] = "P";
    GameType["AllStarGameType"] = "A";
    GameType["PreSeasonGameType"] = "PR";
})(GameType = exports.GameType || (exports.GameType = {}));
var HomeRoad;
(function (HomeRoad) {
    HomeRoad["Home"] = "H";
    HomeRoad["Road"] = "R";
})(HomeRoad = exports.HomeRoad || (exports.HomeRoad = {}));
