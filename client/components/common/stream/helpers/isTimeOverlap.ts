import * as Moment from 'moment';
import {extendMoment} from 'moment-range';

const moment = extendMoment(Moment);

export interface IDateRange {
	startDate: Date;
	endDate: Date;
	rRule?: string;
	slideshowNumId?: string;
}

export default function isTimeOverlap(date: IDateRange, datesList: IDateRange[]): boolean {
	return datesList.some((item) => {
		const itemRange = moment.range(moment(item.startDate), moment(item.endDate));

		return itemRange.overlaps(moment.range(moment(date.startDate), moment(date.endDate)));
	});
}
