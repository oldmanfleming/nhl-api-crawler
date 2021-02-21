import { assert, object, string } from 'joi';
import request from 'axios';

import { Team } from './entities/Team';
import { Player } from './entities/Player';
import { Shift } from './entities/Shift';
import { Event } from './entities/Event';
import { Result } from './entities/Result';

import TeamProfile, { TeamData } from './interfaces/TeamProfile';
import PlayerProfile, { Person } from './interfaces/PlayerProfile';
import PlayerList from './interfaces/PlayerList';
import GameEvents from './interfaces/GameEvent';
import GameShifts from './interfaces/GameShifts';
import GameSummaries from './interfaces/GameSummaries';

import { getResults } from './utils/ResultParser';
import { getEvents } from './utils/EventParser';
import { constructEvents } from './utils/EventConstructor';
import { getShifts } from './utils/ShiftParser';
import { GameType } from './utils/Constants';

export const crawlTeams = async () => {
  const teams: Team[] = [];
  const teamProfiles: TeamProfile = await request(`http://statsapi.web.nhl.com/api/v1/teams`);
  for (let i: number = 0; i < teamProfiles.data.teams.length; i += 1) {
    const teamData: TeamData = teamProfiles.data.teams[i];
    const team: Team = {
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
  return teams;
}

export const crawlPlayers = async (startYear: string, endYear: string) => {
  assert(
    { startYear, endYear },
    object({
      startYear: string().length(8).alphanum().required(),
      endYear: string().length(8).alphanum().required(),
    }),
  );

  const playerIdSet: Set<number> = new Set();

  let countRequest: PlayerList = await request(
    `https://api.nhle.com/stats/rest/en/skater/summary?cayenneExp=seasonId>=${startYear}%20and%20seasonId<=${endYear}`,
  );
  for (let i: number = 0; i < countRequest.data.total; i += 100) {
    console.log(`fetching ${i}`);
    const playerList: PlayerList = await request(
      `https://api.nhle.com/stats/rest/en/skater/summary?start=${i}&limit=${100}&cayenneExp=seasonId>=${startYear}%20and%20seasonId<=${endYear}`,
    );
    for (const player of playerList.data.data) {
      playerIdSet.add(player.playerId);
    }
  }

  countRequest = await request(`https://api.nhle.com/stats/rest/en/goalie/summary?cayenneExp=seasonId>=${startYear}%20and%20seasonId<=${endYear}`);
  for (let i: number = 0; i < countRequest.data.total; i += 100) {
    console.log(`fetching ${i}`);
    const playerList: PlayerList = await request(
      `https://api.nhle.com/stats/rest/en/goalie/summary?start=${i}&limit=${100}&cayenneExp=seasonId>=${startYear}%20and%20seasonId<=${endYear}`,
    );
    for (const player of playerList.data.data) {
      playerIdSet.add(player.playerId);
    }
  }

  const playerProfiles: Player[] = [];
  for (const playerId of playerIdSet) {
    console.log(`fetching ${playerId}`);
    const playerProfile: PlayerProfile = await request(`https://statsapi.web.nhl.com/api/v1/people/${playerId}?expand=person`);
    const playerData: Person = playerProfile.data.people[0];
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
  }
  
  return playerProfiles;
}

export const crawlGames = async (startDate: string, endDate: string) => {
  assert(
    {startDate, endDate},
    object({
      startDate: string().required(),
      endDate: string().required(),
    }),
  );

  // if you use 00 hours, daylight savings will fuck you and skip/redo a day
  const startDateTime: Date = new Date(`${startDate}T12:00:00.000Z`);
  const endDateTime: Date = new Date(`${endDate}T12:00:00.000Z`);

  for (const date: Date = startDateTime; date <= endDateTime; date.setDate(date.getDate() + 1)) {
    console.log(`beginning date ${date.toISOString().split('T')[0]}`);

    const schedule: any = await request(`https://statsapi.web.nhl.com/api/v1/schedule?date=${date.toISOString().split('T')[0]}`);

    if (!schedule.data.dates.length) {
      console.log(`no games found for ${date.toISOString()}`);
      continue;
    }

    const games: any = schedule.data.dates[0].games.filter(
      (game: any) => game.gameType !== GameType.AllStarGameType && game.gameType !== GameType.PreSeasonGameType,
    );

    const gameResults: { events: Event[], results: Result[], shifts: Shift[] }[] = [];
    for (const game of games) {
      const gamePk: number = game.gamePk;
      console.log(`Beginning game ${gamePk}`);

      const gameEvents: GameEvents = await request(`https://statsapi.web.nhl.com/api/v1/game/${gamePk}/feed/live`);
      const gameShifts: GameShifts = await request(`https://api.nhle.com/stats/rest/en/shiftcharts?cayenneExp=gameId=${gamePk}`);
      const gameSummaries: GameSummaries = await request(
        `https://api.nhle.com/stats/rest/en/team/summary?reportType=basic&isGame=true&reportName=teamsummary&cayenneExp=gameId=${gamePk}`,
      );

      if (gameEvents.data.gameData.status.abstractGameState !== 'Final') {
        throw new Error('Game state not final yet');
      }

      if (!gameShifts.data.data.length) {
        throw new Error('Game shifts not found');
      }

      if (!gameSummaries.data.data.length) {
        throw new Error('Game summaries not found');
      }

      const events: Event[] = gameEvents.data.liveData.plays.allPlays.length ? getEvents(gamePk, gameEvents, gameShifts) : constructEvents(gameEvents);

      const results: Result[] = getResults(gamePk, gameEvents, gameSummaries, gameShifts);

      const shifts: Shift[] = getShifts(gameShifts, gameEvents);

      gameResults.push({ events, results, shifts });
    }

    return gameResults;
  }
}