"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var index_1 = require("./index");
var fs_1 = __importDefault(require("fs"));
// crawlGames('2018-12-05', '2018-12-06').then(results => fs.writeFileSync('./games.json', JSON.stringify(results)));
index_1.crawlPlayers('20182019', '20182019').then(function (results) { return fs_1.default.writeFileSync('./players.json', JSON.stringify(results)); });
// crawlTeams().then(results => fs.writeFileSync('./teams.json', JSON.stringify(results)));
