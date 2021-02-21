import GameEvents, { AllPlay, Teams3 } from '../interfaces/GameEvent';
import GameShifts from '../interfaces/GameShifts';
import { Event, EventType } from '../entities/Event';
interface MetaInfo {
    gamePk: number;
    gameType: string;
    play: AllPlay;
    teams: Teams3;
    homePlayers: Set<number>;
    awayPlayers: Set<number>;
    homeGoalieId?: number;
    awayGoalieId?: number;
}
export declare function getEvent(eventType: EventType, playerId: number, metaInfo: MetaInfo): Event;
export declare function getEvents(gamePk: number, gameEvents: GameEvents, gameShifts: GameShifts): Event[];
export {};
