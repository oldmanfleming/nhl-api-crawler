import { Event, EventType } from '../entities/Event'
import GameEvents, { Team, PlayerStats, Stats, GoalieStats, SkaterStats } from '../interfaces/GameEvent'

function parseBoxScore(gamePk: number, gameType: string, timestamp: Date, team: Team, isHome: boolean, opposingTeamId: number): Event[] {
  const events: Event[] = []
  let eventIdx: number = 0
  Object.keys(team.players).forEach((key: string) => {
    const player: PlayerStats = team.players[key]
    const playerStats: Stats = player.stats

    const baseEvent: Event = Object.assign({
      gamePk,
      gameType,
      timestamp,
      secondaryType: '',
      secondaryNumber: 0,
      playTime: 0,
      playerId: player.person.id,
      playerType: player.position.abbreviation,
      playerHandedness: player.person.shootsCatches,
      players: [],
      opposingPlayers: [],
      isHome,
      teamId: team.team.id,
      opposingTeamId,
      teamScore: 0,
      opposingTeamScore: 0,
    })

    if (playerStats.goalieStats) {
      const goalieStats: GoalieStats = playerStats.goalieStats
      for (let i: number = 0; i < goalieStats.powerPlaySaves; i += 1) {
        const event: Event = Object.assign(baseEvent)
        event.type = EventType.Save
        event.idx = eventIdx++
        event.opposingStrength = 5
        event.teamStrength = 4
        events.push(event)
      }
      for (let i: number = 0; i < goalieStats.shortHandedSaves; i += 1) {
        const event: Event = Object.assign(baseEvent)
        event.type = EventType.Save
        event.idx = eventIdx++
        event.opposingStrength = 4
        event.teamStrength = 5
        events.push(event)
      }
      for (let i: number = 0; i < goalieStats.evenSaves; i += 1) {
        const event: Event = Object.assign(baseEvent)
        event.type = EventType.Save
        event.idx = eventIdx++
        event.opposingStrength = 5
        event.teamStrength = 5
        events.push(event)
      }

      // Goals Allowed
      for (let i: number = 0; i < goalieStats.powerPlayShotsAgainst - goalieStats.powerPlaySaves; i += 1) {
        const event: Event = Object.assign(baseEvent)
        event.type = EventType.GoalAllowed
        event.idx = eventIdx++
        event.opposingStrength = 5
        event.teamStrength = 4
        events.push(event)
      }
      for (let i: number = 0; i < goalieStats.evenShotsAgainst - goalieStats.evenSaves; i += 1) {
        const event: Event = Object.assign(baseEvent)
        event.type = EventType.GoalAllowed
        event.idx = eventIdx++
        event.opposingStrength = 5
        event.teamStrength = 5
        events.push(event)
      }
      for (let i: number = 0; i < goalieStats.shortHandedShotsAgainst - goalieStats.shortHandedSaves; i += 1) {
        const event: Event = Object.assign(baseEvent)
        event.type = EventType.GoalAllowed
        event.idx = eventIdx++
        event.opposingStrength = 4
        event.teamStrength = 5
        events.push(event)
      }
    } else if (playerStats.skaterStats) {
      const skaterStats: SkaterStats = playerStats.skaterStats
      for (let i: number = 0; i < skaterStats.goals - skaterStats.powerPlayGoals - skaterStats.shortHandedGoals; i += 1) {
        const event: Event = Object.assign(baseEvent)
        event.type = EventType.Goal
        event.idx = eventIdx++
        event.opposingStrength = 5
        event.teamStrength = 5
        events.push(event)
      }
      for (let i: number = 0; i < skaterStats.powerPlayGoals; i += 1) {
        const event: Event = Object.assign(baseEvent)
        event.type = EventType.Goal
        event.idx = eventIdx++
        event.opposingStrength = 4
        event.teamStrength = 5
        events.push(event)
      }
      for (let i: number = 0; i < skaterStats.shortHandedGoals; i += 1) {
        const event: Event = Object.assign(baseEvent)
        event.type = EventType.Goal
        event.idx = eventIdx++
        event.opposingStrength = 5
        event.teamStrength = 4
        events.push(event)
      }
      // Assists
      for (let i: number = 0; i < skaterStats.assists - skaterStats.powerPlayAssists - skaterStats.shortHandedAssists; i += 1) {
        const event: Event = Object.assign(baseEvent)
        event.type = EventType.Assist
        event.idx = eventIdx++
        event.opposingStrength = 5
        event.teamStrength = 5
        events.push(event)
      }
      for (let i: number = 0; i < skaterStats.powerPlayAssists; i += 1) {
        const event: Event = Object.assign(baseEvent)
        event.type = EventType.Assist
        event.idx = eventIdx++
        event.opposingStrength = 4
        event.teamStrength = 5
        events.push(event)
      }
      for (let i: number = 0; i < skaterStats.shortHandedAssists; i += 1) {
        const event: Event = Object.assign(baseEvent)
        event.type = EventType.Assist
        event.idx = eventIdx++
        event.opposingStrength = 5
        event.teamStrength = 4
        events.push(event)
      }

      // Others
      for (
        let i: number = 0;
        i < skaterStats.shots - skaterStats.goals - skaterStats.powerPlayGoals - skaterStats.shortHandedGoals;
        i += 1
      ) {
        const event: Event = Object.assign(baseEvent)
        event.type = EventType.Shot
        event.idx = eventIdx++
        event.opposingStrength = 5
        event.teamStrength = 5
        events.push(event)
      }
      for (let i: number = 0; i < skaterStats.hits; i += 1) {
        const event: Event = Object.assign(baseEvent)
        event.type = EventType.Hit
        event.idx = eventIdx++
        event.opposingStrength = 5
        event.teamStrength = 5
        events.push(event)
      }
      for (let i: number = 0; i < skaterStats.faceOffWins; i += 1) {
        const event: Event = Object.assign(baseEvent)
        event.type = EventType.FaceoffWin
        event.idx = eventIdx++
        event.opposingStrength = 5
        event.teamStrength = 5
        events.push(event)
      }
      for (let i: number = 0; i < skaterStats.faceoffTaken - skaterStats.faceOffWins; i += 1) {
        const event: Event = Object.assign(baseEvent)
        event.type = EventType.FaceoffLoss
        event.idx = eventIdx++
        event.opposingStrength = 5
        event.teamStrength = 5
        events.push(event)
      }
      for (let i: number = 0; i < skaterStats.takeaways; i += 1) {
        const event: Event = Object.assign(baseEvent)
        event.type = EventType.Takeaway
        event.idx = eventIdx++
        event.opposingStrength = 5
        event.teamStrength = 5
        events.push(event)
      }
      for (let i: number = 0; i < skaterStats.giveaways; i += 1) {
        const event: Event = Object.assign(baseEvent)
        event.type = EventType.Giveaway
        event.idx = eventIdx++
        event.opposingStrength = 5
        event.teamStrength = 5
        events.push(event)
      }
      for (let i: number = 0; i < skaterStats.blocked; i += 1) {
        const event: Event = Object.assign(baseEvent)
        event.type = EventType.BlockedShot
        event.idx = eventIdx++
        event.opposingStrength = 5
        event.teamStrength = 5
        events.push(event)
      }
    }
  })
  return events
}

export function constructEvents(gameEvents: GameEvents): Event[] {
  const gamePk: number = gameEvents.data.gamePk
  const timestamp: Date = new Date(gameEvents.data.gameData.datetime.dateTime)
  const gameType: string = gameEvents.data.gameData.game.type

  const homeTeam: Team = gameEvents.data.liveData.boxscore.teams.home
  const awayTeam: Team = gameEvents.data.liveData.boxscore.teams.away

  const homeEvents: Event[] = parseBoxScore(gamePk, gameType, timestamp, homeTeam, true, awayTeam.team.id)
  const awayEvents: Event[] = parseBoxScore(gamePk, gameType, timestamp, awayTeam, false, homeTeam.team.id)

  return [...homeEvents, ...awayEvents]
}
