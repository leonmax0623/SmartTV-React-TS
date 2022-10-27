import {Mongo} from 'meteor/mongo';

export interface IFb {
	_id?: string;
	pageId?: string;
	name?: string;
	picture?: string;
	createdAt: Date;
	feed?: IFbFeed[];
}

interface IFbAttachmentImage {
	src?: string;
	width?: number;
	height?: number;
}

export interface IFbAttachment {
	media?: {
		image?: IFbAttachmentImage;
	};
	description?: string;
	type?: string;
	url?: string;
}

export interface IFbFeed {
	id: string;
	created_time?: string;
	createdTime?: Date;
	message?: string;
	link?: string;
	permalink_url?: string;
	permalinkUrl?: string;
	attachments?: {data: IFbAttachment[]};
}

export interface IFbPage {
	name?: string;
	id?: string;
}

export const FBFeed = new Mongo.Collection<IFb>('fb_feed');
