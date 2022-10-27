import {Meteor} from 'meteor/meteor';
import {Vimeo} from 'server/integrations/Vimeo/Vimeo';

const vimeoSettings = Meteor.settings.vimeo;
if (!vimeoSettings) {
	throw new Error('Отсутствует конфигурация Vimeo');
}
const {userId, accessToken} = vimeoSettings;
export const VimeoInstance = new Vimeo({userId, accessToken});

export enum VimeoVideoStatusEnum {
	IN_PROGRESS = 'in_progress',
	TRANSCODING = 'transcoding',
	TRANSCODING_STARTING = 'transcode_starting',
	AVAILABLE = 'available',
}
