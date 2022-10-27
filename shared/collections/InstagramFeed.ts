import {Mongo} from 'meteor/mongo';

export interface InstagramFeedItem {
	id: string;
	thumbnail_src: string;
	display_src: string;
	date: Date;
	caption: string;
	likes: number;
}

export interface IInstagramFeed {
	_id?: string;
	pageId: string;
	name: string;
	createdAt: Date;
	feed: InstagramFeedItem[];
}

export const InstagramFeed = new Mongo.Collection<IInstagramFeed>('instagram_feed');
