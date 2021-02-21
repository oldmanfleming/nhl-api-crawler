/* eslint-disable @typescript-eslint/no-non-null-assertion */
import GameShifts from '../interfaces/GameShifts';
import { getTotalSeconds } from './Utils';
import GameEvents, { PlayerProfile2 } from '../interfaces/GameEvent';
import { Shift } from '../entities/Shift';
import { PositionAbbreviation, EventTypeId } from './Constants';

export function getShifts(gameShifts: GameShifts, gameEvents: GameEvents): Shift[] {
	const shifts: Shift[] = [];
	const gameType: string = gameEvents.data.gameData.game.type;
	const gamePk: number = gameEvents.data.gameData.game.pk;
	const timestamp: Date = new Date(gameEvents.data.gameData.datetime.dateTime);
	const endTime: number = gameEvents.data.liveData.linescore.currentPeriod * 1200;
	const homeTeamId: number = gameEvents.data.gameData.teams.home.id;
	const awayTeamId: number = gameEvents.data.gameData.teams.away.id;

	// get all the ticks of goals scored
	const homeGoals: Set<number> = new Set<number>();
	const awayGoals: Set<number> = new Set<number>();
	for (const event of gameEvents.data.liveData.plays.allPlays) {
		if (event.result.eventTypeId === EventTypeId.Goal) {
			const playTime: number = getTotalSeconds(event.about.period, event.about.periodTime, gameType);
			if (event.team.id === homeTeamId) {
				homeGoals.add(playTime);
			} else {
				awayGoals.add(playTime);
			}
		}
	}

	const homePlayerShifts: Map<number, Shift> = new Map<number, Shift>();
	const awayPlayerShifts: Map<number, Shift> = new Map<number, Shift>();
	let prevHomeOnIceStrength: number = 0;
	let prevAwayOnIceStrength: number = 0;
	let homeScore: number = 0;
	let awayScore: number = 0;
	for (let tick: number = 0; tick < endTime; tick++) {
		const homePlayersOnIce: Set<number> = new Set<number>();
		const awayPlayersOnIce: Set<number> = new Set<number>();
		let homeOnIceStrength: number = 0;
		let awayOnIceStrength: number = 0;
		for (const shift of gameShifts.data.data) {
			const startTime: number = getTotalSeconds(shift.period, shift.startTime, gameType);
			const endTime: number = getTotalSeconds(shift.period, shift.endTime, gameType);
			const player: PlayerProfile2 | undefined = gameEvents.data.gameData.players[`ID${shift.playerId}`];
			if (!player || !shift.duration) {
				continue;
			}
			if (startTime <= tick && tick < endTime) {
				if (shift.teamId === homeTeamId) {
					homePlayersOnIce.add(shift.playerId);
					if (player.primaryPosition.abbreviation !== PositionAbbreviation.Goalie) {
						homeOnIceStrength += 1;
					}
				} else {
					awayPlayersOnIce.add(shift.playerId);
					if (player.primaryPosition.abbreviation !== PositionAbbreviation.Goalie) {
						awayOnIceStrength += 1;
					}
				}
			}
		}
		// update score
		if (homeGoals.has(tick)) {
			homeScore += 1;
		}
		if (awayGoals.has(tick)) {
			awayScore += 1;
		}

		//strength/score change, complete shifts for players in map and remove
		if (homeOnIceStrength !== prevHomeOnIceStrength || awayOnIceStrength !== prevAwayOnIceStrength || homeGoals.has(tick) || awayGoals.has(tick)) {
			for (const shift of [...homePlayerShifts.values()]) {
				shift.endTime = shift.startTime + shift.length;
				shifts.push(shift);
			}
			for (const shift of [...awayPlayerShifts.values()]) {
				shift.endTime = shift.startTime + shift.length;
				shifts.push(shift);
			}
			homePlayerShifts.clear();
			awayPlayerShifts.clear();
		}

		// any players that are no longer on the ice need to have their shift completed and removed from list
		for (const player of [...homePlayerShifts]) {
			const [playerId, shift] = player;
			if (!homePlayersOnIce.has(playerId)) {
				shift.endTime = shift.startTime + shift.length;
				shifts.push(shift);
				homePlayerShifts.delete(playerId);
			}
		}
		for (const player of [...awayPlayerShifts]) {
			const [playerId, shift] = player;
			if (!awayPlayersOnIce.has(playerId)) {
				shift.endTime = shift.startTime + shift.length;
				shifts.push(shift);
				awayPlayerShifts.delete(playerId);
			}
		}

		// any players that are on the ice for this tick need to either have a new shift created if they just got on, or add a tick to their existing shift if they were already on the ice
		for (const playerId of homePlayersOnIce) {
			if (homePlayerShifts.has(playerId)) {
				const shift: Shift = homePlayerShifts.get(playerId)!;
				shift.length += 1;
				homePlayerShifts.set(playerId, shift);
			} else {
				homePlayerShifts.set(
					playerId,
					Object.assign({
						gamePk,
						gameType,
						timestamp,
						playerId,
						isHome: true,
						teamId: homeTeamId,
						opposingTeamId: awayTeamId,
						teamStrength: homeOnIceStrength,
						opposingStrength: awayOnIceStrength,
						teamScore: homeScore,
						opposingTeamScore: awayScore,
						startTime: tick,
						length: 1,
					}),
				);
			}
		}
		for (const playerId of awayPlayersOnIce) {
			if (awayPlayerShifts.has(playerId)) {
				const shift: Shift = awayPlayerShifts.get(playerId)!;
				shift.length += 1;
				awayPlayerShifts.set(playerId, shift);
			} else {
				awayPlayerShifts.set(
					playerId,
					Object.assign({
						gamePk,
						gameType,
						timestamp,
						playerId,
						isHome: false,
						teamId: awayTeamId,
						opposingTeamId: homeTeamId,
						teamStrength: awayOnIceStrength,
						opposingStrength: homeOnIceStrength,
						teamScore: awayScore,
						opposingTeamScore: homeScore,
						startTime: tick,
						length: 1,
					}),
				);
			}
		}

		prevHomeOnIceStrength = homeOnIceStrength;
		prevAwayOnIceStrength = awayOnIceStrength;
	}

	for (const shift of [...homePlayerShifts.values()]) {
		shift.endTime = shift.startTime + shift.length;
		shifts.push(shift);
	}
	for (const shift of [...awayPlayerShifts.values()]) {
		shift.endTime = shift.startTime + shift.length;
		shifts.push(shift);
	}

	return shifts;
}
