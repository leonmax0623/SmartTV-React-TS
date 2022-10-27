import {vimeoApiUrl} from 'server/integrations/Vimeo/helpers/vimeoApiUrl';
import {HTTP} from 'meteor/http';
import {IVimeoCreateVideo} from 'server/integrations/Vimeo/helpers/types';

export class Vimeo {
	readonly userId: string;
	readonly accessToken: string;

	constructor({userId, accessToken}: {userId: string; accessToken: string}) {
		this.userId = userId;
		this.accessToken = accessToken;
	}

	getHeaders() {
		return {
			Authorization: `Bearer ${this.accessToken}`,
		};
	}
	createVideo({size, ...restParams}: IVimeoCreateVideo) {
		const data = {
			...restParams,
			upload: {
				size,
				approach: 'tus',
			},
			privacy: {
				embed: 'public', // если надо, то поставить ограничение по домену
				view: 'unlisted',
				comments: 'nobody',
				add: false,
				download: false,
			},
		};

		return HTTP.post(vimeoApiUrl(`users/${this.userId}/videos`), {
			data,
			headers: this.getHeaders(),
		});
	}
	searchVideosByUris(ids: number[]) {
		if (!ids?.length) return;
		const uris = ids.map((id) => `/videos/${id}`).join(',');

		return HTTP.get(vimeoApiUrl(`videos?uris=${uris}`), {
			data: {
				uris,
			},
			headers: this.getHeaders(),
		});
	}
	getVideoById(id: number) {
		if (!id) return;

		return HTTP.get(vimeoApiUrl(`videos/${id}`), {
			headers: this.getHeaders(),
		});
	}
	removeVideoById(id: number) {
		if (!id) {
			throw new Error('Идентификатор видео отсутствует');
		}

		return HTTP.del(vimeoApiUrl(`videos/${id}`), {headers: this.getHeaders()});
	}
	renameVideo(id: number, name: string) {
		if (!id) {
			throw new Error('Идентификатор видео отсутствует');
		}
		if (!name) {
			throw new Error('Название видео отсутствует');
		}

		return HTTP.call('PATCH', vimeoApiUrl(`/videos/${id}`), {
			data: {
				name,
			},
			headers: this.getHeaders(),
		});
	}
}
