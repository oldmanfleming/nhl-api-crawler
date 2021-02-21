export enum Zone {
	Defensive = 'DEFENSIVE',
	Neutral = 'NEUTRAL',
	Offensive = 'OFFENSIVE',
}

export enum EventType {
	Hit = 'HIT',
	OnIceHit = 'ON_ICE_HIT',
	HitAgainst = 'HIT_AGAINST',
	OnIceHitAgainst = 'ON_ICE_HIT_AGAINST',
	BlockedShot = 'BLOCKED_SHOT',
	OnIceBlockedShot = 'ON_ICE_BLOCKED_SHOT',
	ShotBlocked = 'SHOT_BLOCKED',
	OnIceShotBlocked = 'ON_ICE_SHOT_BLOCKED',
	ShotMissed = 'SHOT_MISSED',
	OnIceShotMissed = 'ON_ICE_SHOT_MISSED',
	OnIceMissedShot = 'ON_ICE_MISSED_SHOT',
	Shot = 'SHOT',
	OnIceShot = 'ON_ICE_SHOT',
	Save = 'SAVE',
	OnIceSave = 'ON_ICE_SAVE',
	FaceoffWin = 'FACEOFF_WIN',
	OnIceFaceoffWin = 'ON_ICE_FACEOFF_WIN',
	FaceoffLoss = 'FACEOFF_LOSS',
	OnIceFaceoffLoss = 'ON_ICE_FACEOFF_LOSS',
	PenaltyAgainst = 'PENALTY_AGAINST',
	OnIcePenaltyAgainst = 'ON_ICE_PENALTY_AGAINST',
	PenaltyFor = 'PENALTY_FOR',
	OnIcePenaltyFor = 'ON_ICE_PENALTY_FOR',
	Goal = 'GOAL',
	Assist = 'ASSIST',
	OnIceGoal = 'ON_ICE_GOAL',
	GoalAllowed = 'GOAL_ALLOWED',
	OnIceGoalAllowed = 'ON_ICE_GOAL_ALLOWED',
	Takeaway = 'TAKEAWAY',
	OnIceTakeaway = 'ON_ICE_TAKEAWAY',
	Giveaway = 'GIVEAWAY',
	OnIceGiveaway = 'ON_ICE_GIVEAWAY',
	OnIceOffside = 'ON_ICE_OFFSIDE',
	OnIceIcing = 'ON_ICE_ICING',
	OnIcePuckOutOfPlay = 'ON_ICE_PUCK_OUT_OF_PLAY',
	ShootOutGoal = 'SHOOTOUT_GOAL',
	ShootOutGoalAllowed = 'SHOOTOUT_GOAL_ALLOWED',
	ShootOutShot = 'SHOOTOUT_SHOT',
	ShootOutSave = 'SHOOTOUT_SAVE',
	ShootOutMiss = 'SHOOTOUT_MISS',
	ShootOutOnIceMiss = 'SHOOTOUT_ON_ICE_MISS',
}

export interface Event {
	gamePk: number;
	gameType: string;
	timestamp: Date;
	idx: number;
	type: EventType;
	secondaryType: string;
	secondaryNumber: number;
	playTime: number;
	playerId: number;
	playerType: string;
	playerHandedness: string;
	players: number[];
	opposingPlayers: number[];
	teamId: number;
	opposingTeamId: number;
	teamStrength: number;
	opposingStrength: number;
	teamScore: number;
	opposingTeamScore: number;
	isHome: boolean;
	x?: number;
	y?: number;
	zone?: Zone;
}
