import {Mongo} from 'meteor/mongo';
import {Class} from 'meteor/jagi:astronomy';

import {getDefaultTimestamp} from 'shared/utils/collections';
import {ISlideshowStyles, SlideshowStyles} from 'shared/collections/Slideshows';
import {SlideTeaser, ISlideTeaser} from './Slides';

const SlideMockups = new Mongo.Collection<ISlideMockup>('slideMockups');

export interface ISlideMockup {
	_id: string;
	name: string;
	userId?: string;
	isDefault: boolean;
	createdAt: Date;
	updatedAt: Date;
	styles: ISlideshowStyles;
	teaser: ISlideTeaser;
}

export const SlideMockup = Class.create<ISlideMockup>({
	name: 'SlideMockup',
	collection: SlideMockups,

	fields: {
		name: String,
		userId: {
			type: String,
			default: undefined,
			immutable: true,
			optional: true,
		},
		isDefault: {
			type: Boolean,
			default: false,
			optional: true,
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
		styles: {
			type: SlideshowStyles,
			optional: true,
		},
		teaser: {
			type: SlideTeaser,
			optional: true,
		},
	},

	secured: true,

	behaviors: {timestamp: getDefaultTimestamp()},
});
