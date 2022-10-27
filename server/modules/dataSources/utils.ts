import {Tokens} from 'shared/collections/Tokens';
import {OKFeed, OkFeedMessageItem, OkFeedItem} from 'shared/collections/OkFeed';
import {IVkService} from 'shared/collections/Users';
import {HTTP} from 'meteor/http';
import {VKFeed, IVKFeedItem} from 'shared/collections/VKFeed';
import {TelegramFeed, ITelegramFeedItem} from 'shared/collections/TelegramFeed';
import {Meteor} from 'meteor/meteor';
import {FBFeed, IFbFeed, IFbPage} from 'shared/collections/FBFeed';
import moment from 'moment';
import {JSDOM} from 'jsdom';
// @ts-ignore
import {Facebook} from 'fb';

import {IUser} from 'client/components/user/ProfilePage';
import {OKApi} from '../../integrations/ok-api';
import {SlideElementTwitterHashtagFilterEnum} from 'shared/collections/SlideElements';
import {Monti} from 'meteor/montiapm:agent';

export const getSettings = (service: string) => Tokens.findOne({service});

export const refreshGroupMessages = function(api: OKApi, groupId: string, amount: number) {
	try {
		const result = api.getWall(groupId, amount);

		let messages: OkFeedItem[] = [];
		if (result.data.entities && result.data.entities.media_topics) {
			const {group_photos, videos} = result.data.entities;

			result.data.entities.media_topics.forEach((topic: {created_ms: any; media: any[]}) => {
				let content = {
					date: topic.created_ms,
					messages: [] as OkFeedMessageItem,
				};
				topic.media.forEach((media, index: number) => {
					content.messages[index] = {
						type: media.type,
					};
					if (media.type === 'text') {
						content.messages[index].text = media.text;
					} else if (media.type === 'video') {
						const currentVideo = media.movie_refs[0];
						const videoInfo = videos.find(
							(video: {ref: any}) => video.ref === currentVideo,
						);

						content.messages[index].img = videoInfo.base_thumbnail_url;
						content.messages[index].title = videoInfo.title;
					} else if (media.type === 'movie') {
						const currentVideo = media.movie_refs[0];
						const videoInfo = videos.find(
							(video: {ref: any}) => video.ref === currentVideo,
						);

						content.messages[index].img = videoInfo.base_thumbnail_url;
						content.messages[index].title = videoInfo.title;
					} else if (media.type === 'photo') {
						const currentPhoto = media.photo_refs[0];
						const photoInfo = group_photos.find(
							(photo: {ref: any}) => photo.ref === currentPhoto,
						);

						content.messages[index].img = photoInfo.pic_max;
					} else if (media.type === 'link') {
						content.messages[index].title = media.title;
						content.messages[index].description = media.description;
						content.messages[index].img = media.url_image;
						content.messages[index].type = media.type;
						content.messages[index].domain = media.domain;
						content.messages[index].url = media.url;
					}
				});
				messages.push(content as OkFeedItem);
			});
		}

		OKFeed.update(
			{groupId: groupId},
			{
				$set: {
					messages: messages,
					lastUpdate: new Date(),
					lock: false,
				},
			},
			{
				upsert: true,
			},
		);
	} catch (e) {
		// TODO: Inform on a network error, timeout, or HTTP error in the 400 or 500 range.
		console.log(e);
		return;
	}
};

export const refreshGroupInfo = function(api: OKApi, groupId: string) {
	try {
		const result = api.groupGetInfo(groupId);

		if (result && result.data && result.data[0]) {
			OKFeed.update(
				{groupId},
				{
					$set: {
						name: result.data[0].name,
						lastUpdate: new Date(),
						lock: false,
					},
				},
				{
					upsert: true,
				},
			);
		}
	} catch (e) {
		// TODO: Inform on a network error, timeout, or HTTP error in the 400 or 500 range.
		console.log(e);
		return;
	}
};

export const fbUpdateGroup = (
	appId: string,
	appSecret: string,
	accessToken: string,
	pageId: string,
) => {
	// Skip if we already have some recent feed
	const latest = FBFeed.findOne({pageId});
	const now = new Date();

	if (latest && now.getTime() - latest.createdAt.getTime() < 1000 * 60 * 60) {
		return;
	}

	const fb = new Facebook();
	fb.options({appId, appSecret, accessToken});

	let groupId: string;

	fb.api(
		pageId,
		{fields: 'picture,name,id'},
		Meteor.bindEnvironment(
			(res: {error: any; id: string; name?: string; picture: {data: {url?: string}}}) => {
				if (!res || res.error) {
					console.log(!res ? 'Failed to load Facebook' : res.error);
					// TODO: Add error throwing with some promise or future call
					// if (res.error) throw new Meteor.Error("Ошибка получения описания страницы Facebook: " + res.error.message);
					return;
				}

				if (res.id) {
					groupId = res.id;
				}

				FBFeed.upsert(
					{pageId},
					{
						$set: {
							pageId,
							name: res.name,
							picture: res.picture ? res.picture.data.url : '',
							createdAt: new Date(),
						},
					},
				);

				// Update the page's feed
				fb.api(
					(groupId || pageId) + '/posts',
					{fields: 'message,created_time,permalink_url,attachments'},
					Meteor.bindEnvironment((resInner: {error: any; data: IFbFeed[]}) => {
						if (!resInner || resInner.error) {
							console.log(!resInner ? 'Failed to load Facebook' : resInner.error);
							// TODO: Add error throwing with some promise or future call
							// if (res.error) throw new Meteor.Error("Ошибка получения данных Facebook: " + res.error.message);
							return;
						}

						FBFeed.upsert(
							{pageId},
							{
								$set: {
									feed: resInner.data.map(
										({
											message,
											attachments,
											link,
											created_time,
											permalink_url,
										}) => ({
											message,
											attachments,
											link,
											permalinkUrl: permalink_url,
											createdTime: moment(
												created_time,
												'YYYY-MM-DDTHH:mm:ssZ',
											).toDate(),
										}),
									) as IFbFeed[],
									createdAt: new Date(),
								},
							},
						);
					}),
				);
			},
		),
	);
};

export const fbUpdateMePages = (appId: string, appSecret: string, accessToken: string) => {
	const user = Meteor.user() as IUser;

	if (!user) {
		return;
	}

	// Skip if we already have some recent feed
	const now = new Date();

	if (user.fbPagesUpdate && now.getTime() - user.fbPagesUpdate.getTime() < 1000 * 60 * 60) {
		return;
	}

	const fb = new Facebook();
	fb.options({appSecret, appId, accessToken});

	fb.api(
		'me/accounts',
		{},
		Meteor.bindEnvironment((res: {error?: any; data?: IFbPage[]}) => {
			if (!res || res.error || !res.data) {
				console.log(!res ? 'Failed to load Facebook' : res.error);
				// TODO: Add error throwing with some promise or future call
				// if (res.error) throw new Meteor.Error("Ошибка получения описания страницы Facebook: " + res.error.message);
				return;
			}

			Meteor.users.update(
				{_id: user._id},
				{
					$set: {
						fbPages: res.data,
						fbPagesUpdate: new Date(),
					},
				},
			);
		}),
	);
};

interface IVKParams {
	group_id?: string;
	access_token: string;
	v: string;
	owner_id?: string;
	count: number;
	domain?: string;
}

export const vkUpdateUserWall = (pageId: string, projectService: IVkService) => {
	let profile;
	const params: IVKParams = {
		count: 50,
		access_token: projectService.access_token!,
		v: '5.131',
	};

	const profileResult = HTTP.call('GET', 'https://api.vk.com/method/users.get', {
		params: {...params, fields: 'photo_50, photo_100, photo_200'},
	});
	if (profileResult && profileResult.data && profileResult.data.response) {
		profile = profileResult.data.response[0];
	}

	// Now get the feed
	const result = HTTP.call('GET', 'https://api.vk.com/method/wall.get', {
		params: {...params, extended: 1},
	});

	if (result && result.data && result.data.response) {
		const {items, groups} = result.data.response;

		VKFeed.update(
			{pageId},
			{
				$set: {
					feed: items.map((item: IVKFeedItem) => {
						const group = groups.find((g: {id: string}) => {
							if (!item.copy_history) {
								return false;
							}

							const copyHistory = item.copy_history[0];

							return (
								g.id.toString().toString() ===
								(copyHistory.owner_id || copyHistory.from_id || false)
									.toString()
									.replace('-', '')
							);
						});

						if (!item.copy_history) {
							return item;
						}

						return {
							...item,
							copy_history: [
								{
									...item.copy_history[0],
									name: group && group.name,
									photoSmall: group && group.photo_50,
									photoMiddle: group && group.photo_100,
									photoLarge: group && group.photo_200,
								},
							],
						};
					}),
					createdAt: new Date(),
					name: profile && `${profile.first_name} ${profile.last_name}`,
					gid: profile && profile.id,
					photoSmall: profile && profile.photo_50,
					photoMiddle: profile && profile.photo_100,
					photoLarge: profile && profile.photo_200,
				},
			},
			{
				upsert: true,
			},
		);
	}
};

export const telegramUpdateGroup = (pageId: string) => {
	const result = HTTP.call('GET', `https://t.me/s/${pageId}`);
	if (result && result.content) {
		const {document} = new JSDOM(result.content).window;
		const posts = document.querySelectorAll('.tgme_widget_message_wrap');
		if (posts.length === 0) {
			throw new Meteor.Error(404, 'Проверьте что такой канал существует');
		}
		let feed: ITelegramFeedItem[] = [];
		posts.forEach((post) => {
			const _id = post.querySelector('.tgme_widget_message')?.getAttribute('data-post') || '';
			const messageUserImgSrc = post.querySelector('.tgme_widget_message_user img')?.src;
			const messageOwnerName = post.querySelector('.tgme_widget_message_author')?.outerHTML;
			const textRaw = post.querySelector('.tgme_widget_message_text')?.outerHTML;
			const footerRaw = post.querySelector('.tgme_widget_message_footer')?.outerHTML;
			const photosRaw = post.querySelector('.tgme_widget_message_photo_wrap')?.outerHTML;
			const raw = post.outerHTML;
			feed.push({
				_id,
				messageUserImgSrc,
				messageOwnerName,
				textRaw,
				footerRaw,
				photosRaw,
				raw,
			});
		});
		// TODO. Perfomance: Not very efficient. Better prepare a feed and update once.
		TelegramFeed.update(
			{pageId},
			{
				$set: {
					pageId,
					createdAt: new Date(),
					feed: feed,
				},
			},
			{
				upsert: true,
			},
		);
	}
};
export const vkUpdateGroup = (pageId: string) => {
	let needOwner = false;
	let fixedPageId;

	if (/^public\d+|^club\d+/.test(pageId)) {
		// https://vk.com/public41851890
		// group_id === 41851890
		// Нужен еще 1 параметр owner_id === -41851890
		fixedPageId = pageId.replace(/^public|^club/, '');
		needOwner = true;
	}

	const token = getSettings('vk');
	if (!token) return;

	let isSetProfile;
	let result = HTTP.call('GET', 'https://api.vk.com/method/groups.getById', {
		params: {group_id: fixedPageId || pageId, access_token: token.token, v: '5.131'},
	});

	if (result && result.data && result.data.response) {
		isSetProfile = true;

		VKFeed.update(
			{pageId},
			{
				$set: {
					pageId,
					name: result.data.response[0].name,
					gid: result.data.response[0].gid || result.data.response[0].id,
					photoSmall: result.data.response[0].photo_50,
					photoMiddle: result.data.response[0].photo_100,
					photoLarge: result.data.response[0].photo_200,
					createdAt: new Date(),
				},
				$unset: {
					error: 1,
				},
			},
			{
				upsert: true,
			},
		);
	} else if (result && result.data && result.data.error) {
		Monti.trackError('vk-error', result.data.error?.error_msg);
		VKFeed.update(
			{pageId},
			{
				$set: {
					pageId,
					createdAt: new Date(),
					error: true,
				},
			},
			{
				upsert: true,
			},
		);
	}

	const params: IVKParams = {
		count: 50,
		access_token: token.token!,
		v: '5.131',
	};
	if (needOwner) {
		params.owner_id = `-${fixedPageId}`;
	}

	// Now get the feed
	result = HTTP.call('GET', 'https://api.vk.com/method/wall.get', {
		params: {...params, domain: fixedPageId || pageId},
	});

	if (result && result.data && result.data.response) {
		if (typeof result.data.response[0] === 'number') result.data.response.shift();

		const {items} = result.data.response;
		VKFeed.update(
			{pageId},
			{
				$set: {
					feed: items,
					createdAt: new Date(),
					name: isSetProfile ? undefined : '',
					photoSmall: isSetProfile ? undefined : '',
					photoMiddle: isSetProfile ? undefined : '',
					photoLarge: isSetProfile ? undefined : '',
				},
			},
			{
				upsert: true,
			},
		);
	}
};

export const vkUpdateGroupPhotoAlbum = (pageId: string, projectService: IVkService) => {
	let fixedPageId;

	if (/^public\d+|^club\d+/.test(pageId)) {
		// https://vk.com/public41851890
		// group_id === 41851890
		// Нужен еще 1 параметр owner_id === -41851890
		fixedPageId = pageId.replace(/^public|^club/, '');
	}

	const token = getSettings('vk');
	if (!token) return;

	let ownerId;
	let isSetProfile;
	let result = HTTP.call('GET', 'https://api.vk.com/method/groups.getById', {
		params: {group_id: fixedPageId || pageId, access_token: token.token, v: '5.131'},
	});

	if (result && result.data && result.data.response) {
		isSetProfile = true;
		ownerId = result.data.response[0].id;

		VKFeed.upsert(
			{pageId},
			{
				$set: {
					pageId,
					name: result.data.response[0].name,
					gid: result.data.response[0].gid || result.data.response[0].id,
					photoSmall: result.data.response[0].photo_50,
					photoMiddle: result.data.response[0].photo_100,
					photoLarge: result.data.response[0].photo_200,
					createdAt: new Date(),
				},
				$unset: {
					error: 1,
				},
			},
		);
	} else if (result && result.data && result.data.error) {
		Monti.trackError('vk-error', result.data.error?.error_msg);
		VKFeed.upsert(
			{pageId},
			{
				$set: {
					pageId,
					createdAt: new Date(),
					error: true,
				},
			},
		);
	}

	const params: IVKParams = {
		count: 50,
		access_token: projectService.access_token!,
		v: '5.103',
	};

	// Now get the feed
	result = HTTP.call('GET', 'https://api.vk.com/method/photos.getAll', {
		params: {...params, owner_id: `-${ownerId}`, photo_sizes: 1, skip_hidden: 1},
	});

	if (result && result.data && result.data.response) {
		if (typeof result.data.response[0] === 'number') result.data.response.shift();

		const {items} = result.data.response;

		VKFeed.upsert(
			{pageId},
			{
				$set: {
					feed: items,
					createdAt: new Date(),
					name: isSetProfile ? undefined : '',
					photoSmall: isSetProfile ? undefined : '',
					photoMiddle: isSetProfile ? undefined : '',
					photoLarge: isSetProfile ? undefined : '',
				},
			},
		);
	}
};

export const makeTwitterHashtagFilter = (
	twitterHashtagFilter?: SlideElementTwitterHashtagFilterEnum,
) => {
	switch (twitterHashtagFilter) {
		case SlideElementTwitterHashtagFilterEnum.IMAGES:
			return ' filter:images';

		case SlideElementTwitterHashtagFilterEnum.NATIVE_VIDEO:
			return ' filter:native_video';

		case SlideElementTwitterHashtagFilterEnum.POPULAR:
			return ' sort:popular';
	}

	return '';
};
