export enum EventTypeId {
	Hit = 'HIT',
	BlockedShot = 'BLOCKED_SHOT',
	MissedShot = 'MISSED_SHOT',
	Shot = 'SHOT',
	Save = 'SAVE',
	Faceoff = 'FACEOFF',
	Penalty = 'PENALTY',
	Goal = 'GOAL',
	Takeaway = 'TAKEAWAY',
	Giveaway = 'GIVEAWAY',
	GameScheduled = 'GAME_SCHEDULED',
	Stop = 'STOP',
}

export enum Description {
	Icing = 'Icing',
	Offside = 'Offside',
	GoalieStopped = 'Goalie Stopped',
	Puck = 'Puck',
}

export enum Side {
	Home = 'HOME',
	Away = 'AWAY',
}

export enum PeriodType {
	Regular = 'REGULAR',
	Shootout = 'SHOOTOUT',
}

export enum SecondaryEventType {
	Fighting = 'Fighting',
	Tripping = 'Tripping',
	WristShot = 'Wrist Shot',
	SnapShot = 'Snap Shot',
	SlapShot = 'Slap Shot',
	TipIn = 'Tip-In',
	Backhand = 'Backhand',
}

export enum PlayerType {
	Assist = 'Assist',
	Goalie = 'Goalie',
}

export enum PositionAbbreviation {
	Defenseman = 'D',
	Goalie = 'G',
	LeftWing = 'LW',
	RightWing = 'RW',
	Centre = 'C',
}

export enum GameType {
	RegularGameType = 'R',
	PlayoffGameType = 'P',
	AllStarGameType = 'A',
	PreSeasonGameType = 'PR',
}

export enum HomeRoad {
	Home = 'H',
	Road = 'R',
}
