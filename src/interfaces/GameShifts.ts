export interface Shift {
	id: number;
	detailCode: number;
	duration: string;
	endTime: string;
	eventDescription: string;
	eventDetails: string;
	eventNumber: number;
	firstName: string;
	gameId: number;
	gamePeriod: number;
	gameStateId: number;
	hexValue: string;
	homeScore: number;
	homeTeamId: number;
	lastName: string;
	period: number;
	playerId: number;
	shiftNumber: number;
	startTime: string;
	teamAbbrev: string;
	teamId: number;
	teamName: string;
	typeCode: number;
	visitingScore: number;
	visitingTeamId: number;
}

export interface GameShiftsData {
	data: Shift[];
	total: number;
}

export default interface GameShifts {
	data: GameShiftsData;
}
