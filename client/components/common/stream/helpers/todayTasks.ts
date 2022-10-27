import * as Moment from 'moment';
import {extendMoment} from 'moment-range';
import {IDateRange} from 'client/components/common/stream/helpers/isTimeOverlap';

const moment = extendMoment(Moment);

export function currentTasks(dates: IDateRange[]) {
	if (!dates || !Array.isArray(dates)) return [];

	return dates.filter((item) => {
		return moment.range(moment(item.startDate), moment(item.endDate)).contains(moment());
	});
}
