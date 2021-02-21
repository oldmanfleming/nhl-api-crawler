export interface MetaData {
	wait: number;
	timeStamp: string;
}

export interface Game {
	pk: number;
	season: string;
	type: string;
}

export interface Datetime {
	dateTime: Date;
	endDateTime: Date;
}

export interface Status {
	abstractGameState: string;
	codedGameState: string;
	detailedState: string;
	statusCode: string;
	startTimeTBD: boolean;
}

export interface TimeZone {
	id: string;
	offset: number;
	tz: string;
}

export interface Venue {
	id: number;
	name: string;
	link: string;
	city: string;
	timeZone: TimeZone;
}

export interface Division {
	id: number;
	name: string;
	nameShort: string;
	link: string;
	abbreviation: string;
}

export interface Conference {
	id: number;
	name: string;
	link: string;
}

export interface Franchise {
	franchiseId: number;
	teamName: string;
	link: string;
}

export interface Team {
	id: number;
	name: string;
	link: string;
	venue: Venue;
	abbreviation: string;
	triCode: string;
	teamName: string;
	locationName: string;
	firstYearOfPlay: string;
	division: Division;
	conference: Conference;
	franchise: Franchise;
	shortName: string;
	officialSiteUrl: string;
	franchiseId: number;
	active: boolean;
}

export interface Teams {
	away: Team;
	home: Team;
}

export interface CurrentTeam {
	id: number;
	name: string;
	link: string;
	triCode: string;
}

export interface PrimaryPosition {
	code: string;
	name: string;
	type: string;
	abbreviation: string;
}

export interface PlayerProfile2 {
	id: number;
	fullName: string;
	link: string;
	firstName: string;
	lastName: string;
	primaryNumber: string;
	birthDate: string;
	currentAge: number;
	birthCity: string;
	birthCountry: string;
	nationality: string;
	height: string;
	weight: number;
	active: boolean;
	alternateCaptain: boolean;
	captain: boolean;
	rookie: boolean;
	shootsCatches: string;
	rosterStatus: string;
	currentTeam: CurrentTeam;
	primaryPosition: PrimaryPosition;
}

export interface Players {
	[key: string]: PlayerProfile2;
}

export interface Venue3 {
	id: number;
	name: string;
	link: string;
}

export interface GameData {
	game: Game;
	datetime: Datetime;
	status: Status;
	teams: Teams;
	players: Players;
	venue: Venue3;
}

export interface Strength {
	code: string;
	name: string;
}

export interface Result {
	event: string;
	eventCode: string;
	eventTypeId: string;
	description: string;
	secondaryType: string;
	strength: Strength;
	gameWinningGoal?: boolean;
	emptyNet?: boolean;
	penaltySeverity: string;
	penaltyMinutes?: number;
}

export interface Goals {
	away: number;
	home: number;
}

export interface About {
	eventIdx: number;
	eventId: number;
	period: number;
	periodType: string;
	ordinalNum: string;
	periodTime: string;
	periodTimeRemaining: string;
	dateTime: Date;
	goals: Goals;
}

export interface Coordinates {
	x?: number;
	y?: number;
}

export interface Player2 {
	id: number;
	fullName: string;
	link: string;
}

export interface Player {
	player: Player2;
	playerType: string;
	seasonTotal?: number;
}

export interface Team {
	id: number;
	name: string;
	link: string;
	triCode: string;
}

export interface AllPlay {
	result: Result;
	about: About;
	coordinates: Coordinates;
	players: Player[];
	team: Team;
}

export interface PlaysByPeriod {
	startIndex: number;
	plays: number[];
	endIndex: number;
}

export interface Result2 {
	event: string;
	eventCode: string;
	eventTypeId: string;
	description: string;
}

export interface Goals2 {
	away: number;
	home: number;
}

export interface About2 {
	eventIdx: number;
	eventId: number;
	period: number;
	periodType: string;
	ordinalNum: string;
	periodTime: string;
	periodTimeRemaining: string;
	dateTime: Date;
	goals: Goals2;
}

export interface Coordinates2 {
	x?: number;
	y?: number;
}

export interface CurrentPlay {
	result: Result2;
	about: About2;
	coordinates: Coordinates2;
}

export interface Plays {
	allPlays: AllPlay[];
	scoringPlays: number[];
	penaltyPlays: number[];
	playsByPeriod: PlaysByPeriod[];
	currentPlay: CurrentPlay;
}

export interface Home2 {
	goals: number;
	shotsOnGoal: number;
	rinkSide: string;
}

export interface Away2 {
	goals: number;
	shotsOnGoal: number;
	rinkSide: string;
}

export interface Period {
	periodType: string;
	startTime: Date;
	endTime: Date;
	num: number;
	ordinalNum: string;
	home: Home2;
	away: Away2;
}

export interface Away3 {
	scores: number;
	attempts: number;
}

export interface Home3 {
	scores: number;
	attempts: number;
}

export interface ShootoutInfo {
	away: Away3;
	home: Home3;
}

export interface Team2 {
	id: number;
	name: string;
	link: string;
	abbreviation: string;
	triCode: string;
}

export interface Home4 {
	team: Team2;
	goals: number;
	shotsOnGoal: number;
	goaliePulled: boolean;
	numSkaters: number;
	powerPlay: boolean;
}

export interface Team3 {
	id: number;
	name: string;
	link: string;
	abbreviation: string;
	triCode: string;
}

export interface Away4 {
	team: Team3;
	goals: number;
	shotsOnGoal: number;
	goaliePulled: boolean;
	numSkaters: number;
	powerPlay: boolean;
}

export interface Teams2 {
	home: Home4;
	away: Away4;
}

export interface IntermissionInfo {
	intermissionTimeRemaining: number;
	intermissionTimeElapsed: number;
	inIntermission: boolean;
}

export interface PowerPlayInfo {
	situationTimeRemaining: number;
	situationTimeElapsed: number;
	inSituation: boolean;
}

export interface Linescore {
	currentPeriod: number;
	currentPeriodOrdinal: string;
	currentPeriodTimeRemaining: string;
	periods: Period[];
	shootoutInfo: ShootoutInfo;
	teams: Teams2;
	powerPlayStrength: string;
	hasShootout: boolean;
	intermissionInfo: IntermissionInfo;
	powerPlayInfo: PowerPlayInfo;
}

export interface Team4 {
	id: number;
	name: string;
	link: string;
	abbreviation: string;
	triCode: string;
}

export interface TeamSkaterStats {
	goals: number;
	pim: number;
	shots: number;
	powerPlayPercentage: string;
	powerPlayGoals: number;
	powerPlayOpportunities: number;
	faceOffWinPercentage: string;
	blocked: number;
	takeaways: number;
	giveaways: number;
	hits: number;
}

export interface TeamStats {
	teamSkaterStats: TeamSkaterStats;
}

export interface Person {
	id: number;
	fullName: string;
	link: string;
	shootsCatches: string;
	rosterStatus: string;
}

export interface Position {
	code: string;
	name: string;
	type: string;
	abbreviation: string;
}

export interface GoalieStats {
	timeOnIce: string;
	assists: number;
	goals: number;
	pim: number;
	shots: number;
	saves: number;
	powerPlaySaves: number;
	shortHandedSaves: number;
	evenSaves: number;
	shortHandedShotsAgainst: number;
	evenShotsAgainst: number;
	powerPlayShotsAgainst: number;
}

export interface SkaterStats {
	timeOnIce: string;
	assists: number;
	goals: number;
	shots: number;
	hits: number;
	powerPlayGoals: number;
	powerPlayAssists: number;
	penaltyMinutes: number;
	faceOffWins: number;
	faceoffTaken: number;
	takeaways: number;
	giveaways: number;
	shortHandedGoals: number;
	shortHandedAssists: number;
	blocked: number;
	plusMinus: number;
	evenTimeOnIce: string;
	powerPlayTimeOnIce: string;
	shortHandedTimeOnIce: string;
}

export interface Stats {
	skaterStats?: SkaterStats;
	goalieStats?: GoalieStats;
}

export interface PlayerStats {
	person: Person;
	jerseyNumber: string;
	position: Position;
	stats: Stats;
}

export interface Players2 {
	[key: string]: PlayerStats;
}

export interface OnIcePlu {
	playerId: number;
	shiftDuration: number;
	stamina: number;
}

export interface Person2 {
	fullName: string;
	link: string;
}

export interface Position2 {
	code: string;
	name: string;
	type: string;
	abbreviation: string;
}

export interface Coach {
	person: Person2;
	position: Position2;
}

export interface Team5 {
	id: number;
	name: string;
	link: string;
	abbreviation: string;
	triCode: string;
}

export interface Team {
	team: Team5;
	teamStats: TeamStats;
	players: Players2;
	goalies: number[];
	skaters: number[];
	onIce: number[];
	onIcePlus: OnIcePlu[];
	scratches: number[];
	penaltyBox: any[];
	coaches: Coach[];
}

export interface Teams3 {
	away: Team;
	home: Team;
}

export interface Official2 {
	id: number;
	fullName: string;
	link: string;
}

export interface Official {
	official: Official2;
	officialType: string;
}

export interface Boxscore {
	teams: Teams3;
	officials: Official[];
}

export interface Info {
	id: number;
	fullName: string;
	link: string;
}

export interface Decisions {
	winner: Info;
	loser: Info;
	firstStar: Info;
	secondStar: Info;
	thirdStar: Info;
}

export interface LiveData {
	plays: Plays;
	linescore: Linescore;
	boxscore: Boxscore;
	decisions: Decisions;
}

export interface GameEventsData {
	copyright: string;
	gamePk: number;
	link: string;
	metaData: MetaData;
	gameData: GameData;
	liveData: LiveData;
}

export default interface GameEvents {
	data: GameEventsData;
}
