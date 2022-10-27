import {IDateRange} from 'client/components/common/stream/helpers/isTimeOverlap';
import isTimeOverlap from 'client/components/common/stream/helpers/isTimeOverlap';
import {buildVirtualDates} from "client/components/common/stream/helpers/buildVirtualDates";

export default function isTimeBusy(dates: IDateRange[], date: IDateRange) {
	if (!dates || !Array.isArray(dates) || !dates.length) return false;
	if (!date || !date.startDate || !date.endDate) return false;

	const datesNormalized = buildVirtualDates(dates);

	return isTimeOverlap(date, datesNormalized);
}
