import fromPairs from 'lodash/fromPairs';
import {SlideshowNumber} from 'shared/collections/SlideshowNumbers';

export const removeUndefinedFields = (fieldList: object) =>
	fromPairs(Object.entries(fieldList).filter(([_, value]) => value !== undefined));

export const replaceUndefinedFields = (fieldList: object) =>
	fromPairs(
		Object.entries(fieldList).map(([_, value]) => (value === undefined ? [_, ''] : [_, value])),
	);

type TNumIdType = 'slideshow' | 'slideStream' | 'appSet';

export const getUniqNumId = (type: TNumIdType, lockNumber: boolean = true) => {
	if (!Meteor.isServer) return;

	let filterKey: string;
	if (type === 'slideshow') filterKey = 'isAvailableForSlideshow';
	if (type === 'slideStream') filterKey = 'isAvailableForSlideStream';
	if (type === 'appSet') filterKey = 'isAvailableForAppSet';

	const uniqNumber = Promise.await(
		SlideshowNumber.definition.collection
			.rawCollection()
			.aggregate([{$match: {[filterKey]: true}}, {$sample: {size: 1}}])
			.toArray(),
	)?.[0];

	if (!uniqNumber) throw new Meteor.Error(500, 'No numbers left');

	if (lockNumber) {
		const slideshowNumber = SlideshowNumber.findOne({_id: uniqNumber._id});
		slideshowNumber[filterKey] = false;
		slideshowNumber.save();
	}

	return uniqNumber.number;
};
