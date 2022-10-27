import {Mongo} from 'meteor/mongo';
import {Class} from 'meteor/jagi:astronomy';
import {VimeoVideoStatusEnum} from 'server/integrations/Vimeo';

export interface IVideoHosting {
	_id: string;
	userId: string;
	name: string;
	link: string;
	size: number;
	vimeoVideoId: number;
	vimeoVideoStatus: VimeoVideoStatusEnum;
	vimeoVideoProcessed: boolean;
	duration?: number;
	thumbnail?: string;
}

export const VideoHosting = Class.create<IVideoHosting>({
	name: 'videoHosting',
	collection: new Mongo.Collection<IVideoHosting>('videoHosting'),
	fields: {
		userId: String,
		name: String,
		link: String,
		size: Number,
		vimeoVideoId: Number,
		vimeoVideoStatus: String,
		vimeoVideoProcessed: Boolean,
		duration: {
			type: Number,
			optional: true,
		},
		thumbnail: {
			type: String,
			optional: true,
		},
	},
});
