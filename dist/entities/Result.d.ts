export declare enum ResultType {
    Win = "WIN",
    Loss = "LOSS",
    OTLoss = "OT_LOSS"
}
export interface Result {
    timestamp: Date;
    gamePk: number;
    isHome: boolean;
    teamId: number;
    opposingTeamId: number;
    teamScore: number;
    opposingTeamScore: number;
    resultType: ResultType;
    points: number;
    goalieStartId: number;
    goalieDecisionId: number;
}
