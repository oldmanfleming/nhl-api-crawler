import GameEvents from '../interfaces/GameEvent';
import GameSummaries, { Summary } from '../interfaces/GameSummaries';
import { Result, ResultType } from '../entities/Result';
import GameShifts from '../interfaces/GameShifts';
import { HomeRoad, PositionAbbreviation } from './Constants';
import { getTotalSeconds } from './Utils';

export function getResult(gamePk: number, gameEvents: GameEvents, gameShifts: GameShifts, teamSummary: Summary, opposingTeamSummary: Summary): Result {
	const result: Result = Object.assign({
		timestamp: new Date(teamSummary.gameDate),
		gamePk,
	});

	const isHome: boolean = teamSummary.homeRoad === HomeRoad.Home;
	result.isHome = isHome;
	result.teamId = teamSummary.teamId;
	result.opposingTeamId = opposingTeamSummary.teamId;
	result.teamScore = isHome ? gameEvents.data.liveData.linescore.teams.home.goals : gameEvents.data.liveData.linescore.teams.away.goals;
	result.opposingTeamScore = isHome ? gameEvents.data.liveData.linescore.teams.away.goals : gameEvents.data.liveData.linescore.teams.home.goals;
	result.points = teamSummary.points;

	if (teamSummary.wins) {
		result.resultType = ResultType.Win;
		result.goalieDecisionId = gameEvents.data.liveData.decisions.winner.id;
	} else if (teamSummary.otLosses) {
		result.resultType = ResultType.OTLoss;
		result.goalieDecisionId = gameEvents.data.liveData.decisions.loser.id;
	} else {
		result.resultType = ResultType.Loss;
		result.goalieDecisionId = gameEvents.data.liveData.decisions.loser.id;
	}

	for (const shift of gameShifts.data.data) {
		const startTime: number = getTotalSeconds(shift.period, shift.startTime, gameEvents.data.gameData.game.type);
		if (
			shift.teamId === teamSummary.teamId &&
			startTime === 0 &&
			gameEvents.data.gameData.players[`ID${shift.playerId}`].primaryPosition.abbreviation === PositionAbbreviation.Goalie
		) {
			result.goalieStartId = shift.playerId;
		}
	}

	return result;
}

export function getResults(gamePk: number, gameEvents: GameEvents, gameSummaries: GameSummaries, gameShifts: GameShifts): Result[] {
	return [
		getResult(gamePk, gameEvents, gameShifts, gameSummaries.data.data[0], gameSummaries.data.data[1]),
		getResult(gamePk, gameEvents, gameShifts, gameSummaries.data.data[1], gameSummaries.data.data[0]),
	];
}
