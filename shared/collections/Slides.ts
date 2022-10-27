import {Mongo} from 'meteor/mongo';
import {Class} from 'meteor/jagi:astronomy';

import {getDefaultTimestamp} from 'shared/utils/collections';
import {ISlideshowStyles, SlideshowStyles} from 'shared/collections/Slideshows';
import {Meteor} from 'meteor/meteor';

const Slides = new Mongo.Collection<ISlide>('slides');

export interface ISlide {
	_id: string;
	slideshowId: string;
	position: number;
	styles: ISlideshowStyles;
	hideProgressbar?: boolean;
	teaser: ISlideTeaser;
	createdAt: Date;
	updatedAt: Date;
}

export interface ISlideTeaser {
	enabled: boolean;
	text: string;
	color: string;
	duration: number;
	opacity: number;
}

export const SlideTeaser = Class.create<ISlideTeaser>({
	name: 'SlideTeaser',

	fields: {
		enabled: Boolean,
		text: String,
		color: String,
		duration: Number,
		opacity: Number,
	},
});

export const Slide = Class.create<ISlide>({
	name: 'Slides',
	collection: Slides,

	fields: {
		slideshowId: {
			type: String,
			immutable: true,
		},
		position: Number,
		styles: SlideshowStyles,
		teaser: {
			type: SlideTeaser,
			optional: true,
			default: () => ({
				enabled: false,
				text: 'Введите тизер',
				color: '#000000',
				duration: 30,
				opacity: 0.6,
			}),
		},
		createdAt: {
			type: Date,
			immutable: true,
			optional: true,
		},
		updatedAt: {
			type: Date,
			optional: true,
		},
	},

	secured: true,

	behaviors: {timestamp: getDefaultTimestamp()},
});

if (Meteor.isServer) {
	Slides._ensureIndex({slideshowId: 1});
}
