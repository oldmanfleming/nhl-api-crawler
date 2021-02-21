import { GameType } from './Constants';

export function timeToInt(time: string): number {
	let leadMinute: number;
	let smallMinute: number;
	let leadSecond: number;
	let smallSecond: number;
	if (time.length === 5) {
		leadMinute = parseInt(time[0], 10);
		smallMinute = parseInt(time[1], 10);
		leadSecond = parseInt(time[3], 10);
		smallSecond = parseInt(time[4], 10);
	} else {
		leadMinute = 0;
		smallMinute = parseInt(time[0], 10);
		leadSecond = parseInt(time[2], 10);
		smallSecond = parseInt(time[3], 10);
	}

	return leadMinute * 600 + smallMinute * 60 + leadSecond * 10 + smallSecond;
}

export function getTotalSeconds(period: number, time: string, gameType: string): number {
	let seconds: number = timeToInt(time);
	for (let i: number = 1; i < period; i += 1) {
		if (i < 4 || gameType === GameType.PlayoffGameType) {
			seconds += 1200;
		} else {
			seconds += 300;
		}
	}
	return seconds;
}
