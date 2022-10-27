import {Mongo} from 'meteor/mongo';
import {Enclosure} from 'rss-parser';

export interface IRssFeed {
	_id?: string;
	rssUrl: string;
	rssImageUrl: string;
	rssTitle: string;
	rssDescription: string;
	error?: boolean;
	updatedAt: Date;
	feed: IRssFeedItem[];
}

export interface IRssFeedItem {
	title?: string;
	content?: string;
	pubDate?: string;
	link?: string;
	author?: string;
	enclosure?: Enclosure;
}

export const RssFeed = new Mongo.Collection<IRssFeed>('rss_feed');
