import {IDateRange} from 'client/components/common/stream/helpers/isTimeOverlap';
import {RRule} from 'rrule';

export function buildVirtualDates(dates: IDateRange[]) {
	if (!dates || !Array.isArray(dates) || !dates.length) return [];

	const datesSorted = dates.reverse();

	const datesNormalized = [];

	datesSorted.forEach((dateItem) => {
		datesNormalized.push(dateItem);

		if (dateItem.rRule) {
			const parsedRrule = RRule.fromString(dateItem.rRule);
			const allDatesFromRule = parsedRrule.all();
			(Array.isArray(allDatesFromRule) ? allDatesFromRule : []).forEach((item) => {
				if (!(item instanceof Date)) return;
				const startDate = new Date(item);
				const endDate = new Date(item);

				startDate.setHours(dateItem.startDate.getHours());
				startDate.setMinutes(dateItem.startDate.getMinutes());
				startDate.setSeconds(0);

				endDate.setHours(dateItem.endDate.getHours());
				endDate.setMinutes(dateItem.endDate.getMinutes());
				endDate.setSeconds(0);

				datesNormalized.push({
					...(dateItem || {}),
					startDate,
					endDate,
				});
			});
		}
	});

	return datesNormalized;
}
