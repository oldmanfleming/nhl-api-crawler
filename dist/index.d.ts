import { Team } from './entities/Team';
import { Player } from './entities/Player';
import { Shift } from './entities/Shift';
import { Event } from './entities/Event';
import { Result } from './entities/Result';
export declare const crawlTeams: () => Promise<Team[]>;
export declare const crawlPlayers: (startYear: string, endYear: string) => Promise<Player[]>;
export declare const crawlGames: (startDate: string, endDate: string) => Promise<{
    events: Event[];
    results: Result[];
    shifts: Shift[];
}[] | undefined>;
