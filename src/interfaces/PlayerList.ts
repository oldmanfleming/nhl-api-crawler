export interface PlayerItem {
	assists: number;
	evGoals: number;
	evPoints: number;
	faceoffWinPct?: number;
	gameWinningGoals: number;
	gamesPlayed: number;
	goals: number;
	lastName: string;
	otGoals: number;
	penaltyMinutes: number;
	playerId: number;
	plusMinus: number;
	points: number;
	pointsPerGame: number;
	positionCode: string;
	ppGoals: number;
	ppPoints: number;
	seasonId: number;
	shGoals: number;
	shPoints: number;
	shootingPct: number;
	shootsCatches: string;
	shots: number;
	skaterFullName: string;
	teamAbbrevs: string;
	timeOnIcePerGame: number;
}

export interface Data {
	data: PlayerItem[];
	total: number;
}

export default interface PlayerList {
	data: Data;
}
