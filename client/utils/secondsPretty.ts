export default function secondsPretty(seconds: number): string {
	if (!seconds) {
		return '';
	}
	const hoursUnit = Math.floor(seconds / 3600);
	const minutesUnit = Math.floor(seconds / 60);
	const secondsUnit = seconds - minutesUnit * 60;

	return `${hoursUnit > 0 ? `${hoursUnit}:` : ``}${minutesUnit}:${secondsUnit}`;
}
