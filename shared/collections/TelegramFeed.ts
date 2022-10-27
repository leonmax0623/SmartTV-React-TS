import {Mongo} from 'meteor/mongo';

export interface ITelegramFeedItem {
	_id?: string;
	messageUserImgSrc?: string;
	messageOwnerName?: string;
	textRaw?: string;
	footerRaw?: string;
	photosRaw?: string;
	raw: string;
}

export interface ITelegramFeed {
	_id?: string;
	pageId: string;
	lastUpdate: Date;
	createdAt: Date;
	feed: ITelegramFeedItem[];
}

export const TelegramFeed = new Mongo.Collection<ITelegramFeed>('telegram_feed');
