import {Mongo} from 'meteor/mongo';
import {Class, Enum} from 'meteor/jagi:astronomy';
import {SlideElementTransitionEnum, SlideElementType} from 'shared/collections/SlideElements';

export enum SlideVectorElementTagsEnum {
	ELEMENT = 'element',
	CLOCK = 'clock',
	WEATHER = 'weather',
	FOOD = 'food',
	RIBBON = 'ribbon',
}

interface ISlideVectorElementTag {
	ELEMENT: string;
	CLOCK: string;
	WEATHER: string;
	FOOD: string;
	RIBBON: string;
}

export const SlideVectorElementTagText: {[key in SlideVectorElementTagsEnum]: string} = {
	[SlideVectorElementTagsEnum.ELEMENT]: 'Элементы',
	[SlideVectorElementTagsEnum.CLOCK]: 'Часы',
	[SlideVectorElementTagsEnum.WEATHER]: 'Погода',
	[SlideVectorElementTagsEnum.FOOD]: 'Еда',
	[SlideVectorElementTagsEnum.RIBBON]: 'Лента',
};

export const SlideVectorElementTag = Enum.create<ISlideVectorElementTag>({
	name: 'SlideVectorElementTag',
	identifiers: {
		ELEMENT: SlideVectorElementTagsEnum.ELEMENT,
		CLOCK: SlideVectorElementTagsEnum.CLOCK,
		WEATHER: SlideVectorElementTagsEnum.WEATHER,
		RIBBON: SlideVectorElementTagsEnum.RIBBON,
		FOOD: SlideVectorElementTagsEnum.FOOD,
	},
});

export interface ISlideVectorElement {
	_id: string;
	name: string;
	path: number;
	tags: SlideVectorElementTagsEnum[];
}

const SlideVectorElements = new Mongo.Collection<ISlideVectorElement>('slideVectorElements');

export const SlideVectorElement = Class.create<ISlideVectorElement>({
	name: 'SlideVectorElements',
	collection: SlideVectorElements,

	fields: {
		name: {
			type: String,
			immutable: true,
			optional: true,
			default: false,
		},
		path: {
			type: String,
		},
		tags: {
			type: [SlideVectorElementTag],
		},
	},

	secured: true,
});
