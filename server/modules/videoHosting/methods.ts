import {Meteor} from 'meteor/meteor';
import {check} from 'meteor/check';
import {channelId, videoId} from '@gonetone/get-youtube-id-by-url';
import {methodNames} from 'shared/constants/methodNames';
import {VimeoInstance, VimeoVideoStatusEnum} from 'server/integrations/Vimeo';
import {IResponseError} from 'shared/models/Response';
import {VideoHosting} from 'shared/collections/VideoHosting';

Meteor.methods({
	[methodNames.videoHosting.createVideo]({
		size,
		name,
	}): IResponseError | {uploadLink: string; uri: string; link: string} {
		if (!size) {
			return {
				error: {
					fields: {
						video: 'Выберите файл',
					},
				},
			};
		}
		if (!name) {
			return {
				error: {
					fields: {
						name: 'Заполните имя',
					},
				},
			};
		}
		const response = VimeoInstance.createVideo({size, name});
		if (!response.content) {
			throw new Meteor.Error('Unable to create video', 'Ошибка создания видео');
		}
		let data;
		try {
			data = JSON.parse(response.content);
		} catch (e) {
			throw new Meteor.Error('Unable to create video', 'Ошибка создания видео');
		}
		const uploadLink = data?.upload?.upload_link;
		const uri = data?.uri;
		const link = data?.link;
		if (!uploadLink || !uri || !link) {
			throw new Meteor.Error('Unable to create video', 'Ошибка создания видео');
		}

		return {uploadLink, uri, link};
	},
	[methodNames.videoHosting.saveVideo]({
		name,
		link,
		videoId,
		size,
	}: {
		name: string;
		link: string;
		videoId: number;
		size: number;
	}) {
		const userId = this.userId;
		if (!userId) {
			throw new Meteor.Error('Access denied', 'Недостаточно прав');
		}
		if (!name) {
			throw new Meteor.Error('`name` is not provided', 'Название видео отсутствует');
		}
		if (!videoId) {
			throw new Meteor.Error('`ID` is not provided', 'Идентификатор видео отсутствует');
		}

		const newVideoHosting = new VideoHosting({
			userId,
			name,
			size,
			link,
			vimeoVideoId: videoId,
			vimeoVideoProcessed: false,
			vimeoVideoStatus: VimeoVideoStatusEnum.IN_PROGRESS,
		});

		newVideoHosting.save();
	},
	[methodNames.videoHosting.removeVideo]({videoId}: {videoId: string}) {
		const userId = this.userId;

		if (!userId) {
			throw new Meteor.Error('Access denied', 'Недостаточно прав');
		}
		if (!videoId) {
			throw new Meteor.Error('videoID not provided', 'Отсутствует идентификатор видео');
		}

		const foundVideo = VideoHosting.findOne({userId, _id: videoId});

		if (!foundVideo) {
			throw new Meteor.Error('Not-found', 'Видео не найдено');
		}

		if (foundVideo.vimeoVideoId) {
			try {
				VimeoInstance.removeVideoById(foundVideo.vimeoVideoId);
			} catch (e) {}
		}
		foundVideo.remove();
	},
	[methodNames.videoHosting.renameVideo]({_id, name}: {_id: string; name: string}) {
		check(name, String);
		check(_id, String);

		const userId = this.userId;

		if (!userId) {
			throw new Meteor.Error('Access denied', 'Недостаточно прав');
		}
		if (!name) {
			throw new Meteor.Error('`name` is not provided', 'Введите название видео');
		}
		if (!_id) {
			throw new Meteor.Error('`ID` is not provided', 'Идентификатор видео отсутствует');
		}

		const foundVideo = VideoHosting.findOne({_id});

		if (!foundVideo) {
			throw new Meteor.Error('Not found', 'Видео не найдено');
		}
		VideoHosting.update({_id}, {$set: {name}});

		try {
			VimeoInstance.renameVideo(foundVideo.vimeoVideoId, name);
		} catch (e) {}
	},
	[methodNames.videoHosting.getChanelId](url) {
		return channelId(url);
	},
	[methodNames.videoHosting.getVideoId](url) {
		return videoId(url);
	},
	[methodNames.videoHosting.checkVimeoVideos]() {
		if (!Meteor.isServer) return;

		const requestQuery = {
			vimeoVideoStatus: {
				$ne: VimeoVideoStatusEnum.AVAILABLE,
			},
		};
		const requestFilters = {vimeoVideoId: 1};
		const data = VideoHosting.find(requestQuery, requestFilters);

		if (!data.count()) return;

		const inProgressVideoIds = data.map(({_id, vimeoVideoId}) => ({_id, vimeoVideoId}));

		inProgressVideoIds.forEach((inProgressVideoId) => {
			const response = VimeoInstance.getVideoById(inProgressVideoId.vimeoVideoId);

			let video;
			try {
				video = JSON.parse(response.content);
			} catch (e) {
				throw new Meteor.Error('Vimeo error', 'Ошибка получения данных с Vimeo');
			}
			if (video) {
				const pictures = (Array.isArray(video.pictures.sizes)
					? video.pictures.sizes
					: []
				).filter((pic) => pic.width > 250 && pic.width < 650);
				const thumbnail = pictures[0]?.link;

				VideoHosting.update(
					{_id: inProgressVideoId._id},
					{
						$set: {
							thumbnail,
							duration: video.duration || 0,
							vimeoVideoStatus: video.status,
							vimeoVideoProcessed: video.status === VimeoVideoStatusEnum.AVAILABLE,
						},
					},
				);
			}
		});
	},
});
