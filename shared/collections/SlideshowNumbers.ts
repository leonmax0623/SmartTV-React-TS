import {Mongo} from 'meteor/mongo';
import {Class} from 'meteor/jagi:astronomy';

export interface ISlideshowNumber {
	_id: string;
	number: string;
	isAvailableForSlideshow: boolean;
	isAvailableForSlideStream: boolean;
	isAvailableForAppSet: boolean;
}

const SlideshowsNumbers = new Mongo.Collection<ISlideshowNumber>('slideshowNumbers');

export const SlideshowNumber = Class.create<ISlideshowNumber>({
	name: 'SlideshowNumbers',
	collection: SlideshowsNumbers,
	fields: {
		number: String,
		isAvailableForSlideshow: Boolean,
		isAvailableForSlideStream: Boolean,
		isAvailableForAppSet: Boolean,
	},
});

if (Meteor.isServer) {
	SlideshowsNumbers._ensureIndex({number: 1}, {unique: true});
}
