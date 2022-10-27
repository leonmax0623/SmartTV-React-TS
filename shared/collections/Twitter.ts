import {Mongo} from 'meteor/mongo';
import {Enum} from 'meteor/jagi:astronomy';

export interface ITwitterFeedItem {
	id: number;
	createdAt: string;
	twitterId: string;
	text: string;
	photo: string;
	isGif?: boolean;
	video?: string;
	retweetCount?: number;
	favoriteCount?: number;
	user: {
		twitterId: number;
		name: string;
		imageUrl: string;
		profileName: string;
		url: string;
	};
}

export interface ITwitterFeed {
	_id?: string;
	query: string;
	createdAt: Date;
	ends: Date;
	feed: ITwitterFeedItem[];
}

export const Twitter = new Mongo.Collection<ITwitterFeed>('twitter');

export enum TwitterGetTypeEnum {
	PROFILE_NAME = 'PROFILE_NAME',
	HASHTAG = 'HASHTAG',
	LIST = 'LIST',
	COLLECTION = 'COLLECTION',
	// MOMENT = 'MOMENT',
}

interface ITwitterGetType {
	PROFILE_NAME: string;
	HASHTAG: string;
	LIST: string;
	COLLECTION: string;
	// MOMENT: string;
}

export const TwitterGetType = Enum.create<ITwitterGetType>({
	name: 'TwitterGetType',
	identifiers: {
		PROFILE_NAME: TwitterGetTypeEnum.PROFILE_NAME,
		HASHTAG: TwitterGetTypeEnum.HASHTAG,
		LIST: TwitterGetTypeEnum.LIST,
		COLLECTION: TwitterGetTypeEnum.COLLECTION,
		// MOMENT: TwitterGetTypeEnum.MOMENT,
	},
});

export const TwitterGetTypeText: {
	[key in TwitterGetTypeEnum]: string;
} = {
	[TwitterGetTypeEnum.PROFILE_NAME]: 'Имя пользователя',
	[TwitterGetTypeEnum.HASHTAG]: 'Тег',
	[TwitterGetTypeEnum.LIST]: 'Список',
	[TwitterGetTypeEnum.COLLECTION]: 'Коллекция',
	// [TwitterGetTypeEnum.MOMENT]: 'Момент',
};
