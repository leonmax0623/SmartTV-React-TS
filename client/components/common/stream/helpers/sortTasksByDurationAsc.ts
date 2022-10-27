import {IDateRange} from 'client/components/common/stream/helpers/isTimeOverlap';

export function sortTasksByDurationAsc(dates: IDateRange[]) {
	if (!dates || !Array.isArray(dates)) return [];

	return dates.sort((a, b) => {
		const durationA = +a.endDate - +a.startDate;
		const durationB = +b.endDate - +b.startDate;
		if (durationA < durationB) {
			return -1;
		}

		if (durationA > durationB) {
			return 1;
		}

		return 0;
	});
}
