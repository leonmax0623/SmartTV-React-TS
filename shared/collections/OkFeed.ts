import {Mongo} from 'meteor/mongo';

export interface OkFeedMessageItem {
	title?: string;
	description?: string;
	img?: string;
	type?: string;
	domain?: string;
	url?: string;
	text?: string;
}

export interface OkFeedItem {
	date?: number;
	messages?: OkFeedMessageItem[];
}

export interface IOk {
	_id?: string;
	groupLink: string;
	name: string;
	lock: boolean;
	lastUpdate: Date;
	createdAt: Date;
	messages: OkFeedItem[];
}

export const OKFeed = new Mongo.Collection<IOk>('ok_feed');
