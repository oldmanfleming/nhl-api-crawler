import GameEvents from '../interfaces/GameEvent';
import GameSummaries, { Summary } from '../interfaces/GameSummaries';
import { Result } from '../entities/Result';
import GameShifts from '../interfaces/GameShifts';
export declare function getResult(gamePk: number, gameEvents: GameEvents, gameShifts: GameShifts, teamSummary: Summary, opposingTeamSummary: Summary): Result;
export declare function getResults(gamePk: number, gameEvents: GameEvents, gameSummaries: GameSummaries, gameShifts: GameShifts): Result[];
