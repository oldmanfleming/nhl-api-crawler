export interface Shift {
    timestamp: Date;
    gamePk: number;
    gameType: string;
    playerId: number;
    isHome: boolean;
    teamId: number;
    opposingTeamId: number;
    teamStrength: number;
    opposingStrength: number;
    teamScore: number;
    opposingTeamScore: number;
    startTime: number;
    endTime: number;
    length: number;
}
