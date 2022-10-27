import {Mongo} from 'meteor/mongo';
import {SlideElementTypeEnum} from 'shared/collections/SlideElements';
import {Meteor} from 'meteor/meteor';


export interface IStatisticsSlideshows {
	_id?: string;
	elementId: string;
	sessionId: string;
	userId?: string;
	renderCount?: number;
	renderTime?: number;
	yearDay: number,
	year: number,
	lastRenderDate: Date;
}

export interface IStatisticsResultItem {
	daysPassed: number;
	type: SlideElementTypeEnum;
	id: string;
	statisticId?: string;
	slidesCount: number;
	today: number[];
	week: number[];
	month: number[];
}

export interface IStatisticsGroupTotalItem {
	today: {
		days: number;
		time: string;
	}
	week: {
		days: number;
		time: string;
	}
	month: {
		days: number;
		time: string;
	}
	daysPassed?: number;
}



export const StatisticsSlideshows = new Mongo.Collection<IStatisticsSlideshows>('statistics_slideshows');

if (Meteor.isServer) {
	StatisticsSlideshows._ensureIndex({elementId: 1, year: 1, yearDay: 1});
}
