import { assert, date, object, string } from 'joi'
import request from 'axios'

import { Team } from './entities/Team'
import { Player } from './entities/Player'
import { Shift } from './entities/Shift'
import { Event } from './entities/Event'
import { Result } from './entities/Result'

import TeamProfile, { TeamData } from './interfaces/TeamProfile'
import PlayerProfile, { Person } from './interfaces/PlayerProfile'
import PlayerList from './interfaces/PlayerList'
import GameEvents from './interfaces/GameEvent'
import GameShifts from './interfaces/GameShifts'
import GameSummaries from './interfaces/GameSummaries'

import { getResults } from './utils/ResultParser'
import { getEvents } from './utils/EventParser'
import { getShifts } from './utils/ShiftParser'

export const crawlTeams = async () => {
  console.log('Beginning team crawl')
  const teams: Team[] = []
  const teamProfiles: TeamProfile = await request(`http://statsapi.web.nhl.com/api/v1/teams`)
  for (let i: number = 0; i < teamProfiles.data.teams.length; i += 1) {
    const teamData: TeamData = teamProfiles.data.teams[i]
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
    }
    teams.push(team)
  }
  console.log('Finished team crawl')
  return teams
}

export const crawlPlayers = async (startYear: string, endYear: string) => {
  assert(
    { startYear, endYear },
    object({
      startYear: string().length(8).alphanum().required(),
      endYear: string().length(8).alphanum().required(),
    })
  )

  console.log('Beginning player crawl')

  const playerIdSet: Set<number> = new Set()

  let countRequest: PlayerList = await request(
    `https://api.nhle.com/stats/rest/en/skater/summary?cayenneExp=seasonId>=${startYear}%20and%20seasonId<=${endYear}`
  )
  for (let i: number = 0; i < countRequest.data.total; i += 100) {
    const playerList: PlayerList = await request(
      `https://api.nhle.com/stats/rest/en/skater/summary?start=${i}&limit=${100}&cayenneExp=seasonId>=${startYear}%20and%20seasonId<=${endYear}`
    )
    for (const player of playerList.data.data) {
      playerIdSet.add(player.playerId)
    }
  }

  countRequest = await request(
    `https://api.nhle.com/stats/rest/en/goalie/summary?cayenneExp=seasonId>=${startYear}%20and%20seasonId<=${endYear}`
  )
  for (let i: number = 0; i < countRequest.data.total; i += 100) {
    const playerList: PlayerList = await request(
      `https://api.nhle.com/stats/rest/en/goalie/summary?start=${i}&limit=${100}&cayenneExp=seasonId>=${startYear}%20and%20seasonId<=${endYear}`
    )
    for (const player of playerList.data.data) {
      playerIdSet.add(player.playerId)
    }
  }

  const playerProfiles: Player[] = []
  for (const playerId of playerIdSet) {
    console.log(`fetching player ${playerId}`)
    const playerProfile: PlayerProfile = await request(`https://statsapi.web.nhl.com/api/v1/people/${playerId}?expand=person`)
    const playerData: Person = playerProfile.data.people[0]
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
    })
  }

  console.log('finished player crawl')

  return playerProfiles
}

export const crawlEvents = async (startDate: string, endDate: string) => {
  console.log('Beginning event crawl')

  const gamePks = await crawlGames(startDate, endDate)

  const events: Event[] = []
  for (const gamePk of gamePks) {
    console.log(`Beginning game ${gamePk}`)

    const gameEvents: GameEvents = await request(`https://statsapi.web.nhl.com/api/v1/game/${gamePk}/feed/live`)
    const gameShifts: GameShifts = await request(`https://api.nhle.com/stats/rest/en/shiftcharts?cayenneExp=gameId=${gamePk}`)

    if (gameEvents.data.gameData.status.abstractGameState !== 'Final') {
      console.error(`Game state not final for game ${gamePk} - skipping game...`)
      continue
    }

    if (!gameShifts.data.data.length) {
      console.error(`Game shifts not found for game ${gamePk} - skipping game...`)
      continue
    }

    if (!gameEvents.data.liveData.plays.allPlays.length) {
      console.error(`Game events not found for game ${gamePk} - skipping game...`)
      continue
    }

    const eventsByGame: Event[] = getEvents(gamePk, gameEvents, gameShifts)
    events.concat(eventsByGame)

    console.log(`Finsihed game ${gamePk}`)
  }

  console.log('Finished event crawl')

  return events
}

export const crawlShifts = async (startDate: string, endDate: string) => {
  console.log('Beginning shift crawl')

  const gamePks = await crawlGames(startDate, endDate)

  const shifts: Shift[] = []
  for (const gamePk of gamePks) {
    console.log(`Beginning game ${gamePk}`)

    const gameEvents: GameEvents = await request(`https://statsapi.web.nhl.com/api/v1/game/${gamePk}/feed/live`)
    const gameShifts: GameShifts = await request(`https://api.nhle.com/stats/rest/en/shiftcharts?cayenneExp=gameId=${gamePk}`)

    if (gameEvents.data.gameData.status.abstractGameState !== 'Final') {
      console.error(`Game state not final for game ${gamePk} - skipping game...`)
      continue
    }

    if (!gameShifts.data.data.length) {
      console.error(`Game shifts not found for game ${gamePk} - skipping game...`)
      continue
    }

    if (!gameEvents.data.liveData.plays.allPlays.length) {
      console.error(`Game events not found for game ${gamePk} - skipping game...`)
      continue
    }

    const shiftsByGame: Shift[] = getShifts(gameShifts, gameEvents)
    shifts.concat(shiftsByGame)

    console.log(`Finsihed game ${gamePk}`)
  }

  console.log('Finished shift crawl')

  return shifts
}

export const crawlResults = async (startDate: string, endDate: string) => {
  console.log('Beginning result crawl')

  const gamePks = await crawlGames(startDate, endDate)

  const results: Result[] = []
  for (const gamePk of gamePks) {
    console.log(`Beginning game ${gamePk}`)

    const gameEvents: GameEvents = await request(`https://statsapi.web.nhl.com/api/v1/game/${gamePk}/feed/live`)
    const gameShifts: GameShifts = await request(`https://api.nhle.com/stats/rest/en/shiftcharts?cayenneExp=gameId=${gamePk}`)
    const gameSummaries: GameSummaries = await request(
      `https://api.nhle.com/stats/rest/en/team/summary?reportType=basic&isGame=true&reportName=teamsummary&cayenneExp=gameId=${gamePk}`
    )

    if (gameEvents.data.gameData.status.abstractGameState !== 'Final') {
      console.error(`Game state not final for game ${gamePk} - skipping game...`)
      continue
    }

    if (!gameShifts.data.data.length) {
      console.error(`Game shifts not found for game ${gamePk} - skipping game...`)
      continue
    }

    if (!gameEvents.data.liveData.plays.allPlays.length) {
      console.error(`Game events not found for game ${gamePk} - skipping game...`)
      continue
    }

    const resultsByGame: Result[] = getResults(gamePk, gameEvents, gameSummaries, gameShifts)
    results.concat(resultsByGame)

    console.log(`Finsihed game ${gamePk}`)
  }

  console.log('Finished result crawl')

  return results
}

const crawlGames = async (startDate: string, endDate: string) => {
  assert(
    { startDate, endDate },
    object({
      startDate: date().required(),
      endDate: date().required(),
    })
  )

  // if you use 00 hours, daylight savings will fuck you and skip/redo a day
  const startDateTime: Date = new Date(`${startDate}T12:00:00.000Z`)
  const endDateTime: Date = new Date(`${endDate}T12:00:00.000Z`)

  const gamePks: number[] = []
  for (const date: Date = startDateTime; date <= endDateTime; date.setDate(date.getDate() + 1)) {
    const schedule: any = await request(`https://statsapi.web.nhl.com/api/v1/schedule?date=${date.toISOString().split('T')[0]}`)

    if (!schedule.data.dates.length) {
      continue
    }

    const gamePksForDate = schedule.data.dates[0].games.map((game: any) => game.gamePk)
    gamePks.concat(gamePksForDate)
  }

  console.log(`${gamePks.length} games found between ${startDate} and ${endDate}`)

  return gamePks
}
