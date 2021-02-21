/* eslint-disable @typescript-eslint/no-namespace */
export interface TimeZone {
	id: string;
	offset: number;
	tz: string;
}

export interface Venue {
	name: string;
	link: string;
	city: string;
	timeZone: TimeZone;
	id?: number;
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

export interface Person {
	id: number;
	fullName: string;
	link: string;
}

export interface Position {
	code: string;
	name: string;
	type: string;
	abbreviation: string;
}

export interface Roster2 {
	person: Person;
	jerseyNumber: string;
	position: Position;
}

export interface Roster {
	roster: Roster2[];
	link: string;
}

export interface TeamData {
	id: number;
	name: string;
	link: string;
	venue: Venue;
	abbreviation: string;
	teamName: string;
	locationName: string;
	firstYearOfPlay: string;
	division: Division;
	conference: Conference;
	franchise: Franchise;
	roster: Roster;
	shortName: string;
	officialSiteUrl: string;
	franchiseId: number;
	active: boolean;
}

export interface TeamProfileData {
	copyright: string;
	teams: TeamData[];
}

export default interface TeamProfile {
	data: TeamProfileData;
}
