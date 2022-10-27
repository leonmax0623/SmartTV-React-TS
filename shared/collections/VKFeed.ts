import {Mongo} from 'meteor/mongo';

export interface IVkFeed {
	_id?: string;
	pageId: string;
	name: string;
	lock: boolean;
	lastUpdate: Date;
	error?: boolean;
	createdAt: Date;
	isNeedUpdate?: boolean;
	photoSmall?: string;
	photoMiddle?: string;
	photoLarge?: string;
	feed: IVKFeedItem[];
}

export interface IVKFeedItem {
	id?: number;
	from_id?: number;
	owner_id?: number;
	date: number;
	marked_as_ads: number;
	post_type: string;
	text: string;
	is_pinned: number;
	attachments: any[];
	copy_history?: IVKFeedItem[];
	name?: string;
	photoSmall?: string;
	photoMiddle?: string;
	photoLarge?: string;
}

export interface IVKFeedItemAlbum {
	id?: number;
	album_id?: number;
	user_id?: number;
	owner_id?: number;
	sizes?: IVKFeedItemAlbumSize[];
	text?: string;
	date?: number;
	real_offset?: number;
	likes?: IVKFeedItemAlbumLikes;
	reposts?: IVKFeedItemAlbumCount;
	comments?: IVKFeedItemAlbumCount;
	can_comment?: number;
	tags?: IVKFeedItemAlbumCount;
}

interface IVKFeedItemAlbumCount {
	count?: number;
}

export interface IVKFeedItemAlbumSize {
	type: VKFeedItemAlbumSizeTypeEnum;
	url: string;
	width: number;
	height: number;
}

interface IVKFeedItemAlbumLikes extends IVKFeedItemAlbumCount {
	user_likes?: number;
}

export enum VKFeedItemAlbumSizeTypeEnum {
	M = 'm',
	O = 'o',
	P = 'p',
	Q = 'q',
	R = 'r',
	S = 's',
	W = 'w',
	X = 'x',
	Y = 'y',
	Z = 'z',
}

export const VKFeed = new Mongo.Collection<IVkFeed>('vk_feed');
