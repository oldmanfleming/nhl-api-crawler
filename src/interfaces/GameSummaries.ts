export interface Summary {
	faceoffWinPct: number;
	gameDate: string;
	gameId: number;
	gamesPlayed: number;
	goalsAgainst: number;
	goalsAgainstPerGame: number;
	goalsFor: number;
	goalsForPerGame: number;
	homeRoad: string;
	losses: number;
	opponentTeamAbbrev: string;
	otLosses: number;
	penaltyKillNetPct: number;
	penaltyKillPct: number;
	pointPct: number;
	points: number;
	powerPlayNetPct: number;
	powerPlayPct: number;
	regulationAndOtWins: number;
	shotsAgainstPerGame: number;
	shotsForPerGame: number;
	teamFullName: string;
	teamId: number;
	ties?: any;
	wins: number;
	winsInRegulation: number;
	winsInShootout: number;
}

export interface GameSummariesData {
	data: Summary[];
	total: number;
}

export default interface GameSummaries {
	data: GameSummariesData;
}
