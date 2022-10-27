import {Mongo} from 'meteor/mongo';
import {Class} from 'meteor/jagi:astronomy';

/*
	endDate: Wed Aug 25 2021 16:00:00 GMT+0200 (Восточная Европа, стандартное время) {}
	notes: "234234234"
	rRule: "RRULE:INTERVAL=130;FREQ=DAILY;COUNT=30" // "RRULE:INTERVAL=1;FREQ=DAILY;UNTIL=20210914T080000Z"
	startDate: Wed Aug 25 2021 15:30:00 GMT+0200 (Восточная Европа, стандартное время) {}
	title: "324234"

	allDay: false
	endDate: Tue Aug 24 2021 10:30:00 GMT+0200 (Восточная Европа, стандартное время) {}
	rRule: "RRULE:INTERVAL=7;FREQ=YEARLY;COUNT=5;BYMONTH=8;BYMONTHDAY=24"
	startDate: Tue Aug 24 2021 10:00:00 GMT+0200 (Восточная Европа, стандартное время) {}

*/
export interface ISlideStreamSchedule {
	id: string;
	slideshowNumId: string;
	startDate: Date;
	endDate: Date;
	rRule?: string;
	exDate?: Date;
}

export const SlideStreamSchedule = Class.create<ISlideStreamSchedule>({
	name: 'SlideStreamSchedule',
	fields: {
		id: String,
		slideshowNumId: String,
		startDate: Date,
		endDate: Date,
		rRule: {
			type: String,
			optional: true,
		},
		exDate: {
			type: Date,
			optional: true,
		},
	},
});

export interface ISlideStream {
	_id: string;
	userId: string;
	code: string;
	title: string;
	password?: string;
	schedules?: ISlideStreamSchedule[];
}
export const SlideStream = Class.create<ISlideStream>({
	name: 'SlideStream',
	collection: new Mongo.Collection<ISlideStream>('slideStream'),
	fields: {
		userId: String,
		code: String,
		title: String,
		password: {
			type: String,
			optional: true,
		},
		schedules: {
			type: [SlideStreamSchedule],
			optional: true,
		},
	},
	behaviors: {
		timestamp: {
			createdFieldName: 'createdAt',
			updatedFieldName: 'updatedAt',
		},
	},
});
