import {Meteor} from 'meteor/meteor';
import {HTTP} from 'meteor/http';
import Twit, {RequestParams} from 'twitter';
import {check} from 'meteor/check';
import axios, {AxiosResponse} from 'axios';
import xmlParser from 'xml-js';

import {InstagramFeed} from 'shared/collections/InstagramFeed';
import {OKFeed} from 'shared/collections/OkFeed';
import {VKFeed} from 'shared/collections/VKFeed';
import {TelegramFeed} from 'shared/collections/TelegramFeed';
import {
	ITwitterFeed,
	ITwitterFeedItem,
	Twitter,
	TwitterGetTypeEnum,
} from 'shared/collections/Twitter';
import {methodNames} from 'shared/constants/methodNames';
import {OKApi} from '../../integrations/ok-api';
import {
	fbUpdateGroup,
	fbUpdateMePages,
	getSettings,
	refreshGroupInfo,
	refreshGroupMessages,
	vkUpdateGroup,
	telegramUpdateGroup,
	vkUpdateGroupPhotoAlbum,
	vkUpdateUserWall,
} from './utils';
import {
	ISlideElement,
	ITwitterUserForCollections,
	SlideElement,
	SlideElementTwitterHashtagFilterEnum,
	SlideElementVkMethodShowEnum,
	SlideElementTelegramMethodShowEnum,
} from 'shared/collections/SlideElements';
import {ServiceEnum} from 'shared/collections/Users';
import {makeQueryTwitter} from 'shared/utils/twitter';
import {IUser} from 'client/components/user/ProfilePage';
import KJUR from 'jsrsasign';

// @ts-ignore
global.regeneratorRuntime = require('babel-runtime/regenerator');

Meteor.methods({
	// TODO: Переделать на новую архитектуру и использовать Graph API
	[methodNames.instagram.updateFeed]: function(pageId) {
		if (this.isSimulation) return true;
		if (!pageId) return true;

		// Skip if we already have some recent feed
		const latest = InstagramFeed.findOne({pageId}, {sort: {createdAt: -1}});
		const now = new Date().getTime();

		if (latest && now - latest.createdAt.getTime() < 1000 * 60 * 60) {
			return;
		}

		// Instagram has a hack to load content in JSON format (which could be disabled in future)
		// https://www.instagram.com/apple/?__a=1
		return new Promise((resolve) =>
			HTTP.get(
				`https://www.instagram.com/${pageId}/?__a=1`,
				{
					data: {some: 'json', stuff: 1},
					// User must be authed now to use this quirky method
					headers: {cookie: Meteor.settings.instagram.cookies},
				},
				(error: Error, result: any) => {
					if (error) {
						resolve(`Error loading Instagram: ${JSON.stringify(error)}`);
					}

					if (result && result.data && result.data.graphql && result.data.graphql.user) {
						const feed = [];
						const media = result.data.graphql.user.edge_owner_to_timeline_media;

						if (media && media.edges) {
							for (let i = 0; i < media.edges.length; i += 1) {
								const node = media.edges[i].node;
								feed.push({
									id: node.id,
									thumbnail_src: node.thumbnail_src,
									display_src: node.display_url,
									date: new Date(node.taken_at_timestamp * 1000),
									caption: node.edge_media_to_caption.edges[0]
										? node.edge_media_to_caption.edges[0].node.text
										: '',
									likes: node.edge_media_preview_like.count,
								});
							}
						}

						InstagramFeed.update(
							{pageId},
							{
								$set: {
									pageId,
									feed,
									name: result.data.graphql.user.username,
									createdAt: new Date(),
								},
							},
							{
								upsert: true,
							},
						);
					}
				},
			),
		);
	},

	[methodNames.ok.updateFeed]: function(groupLink, amount = 5) {
		if (this.isSimulation) return true;
		if (!groupLink) return true;
		this.unblock();

		const settings = getSettings('ok');
		if (!settings) return;

		// Skip if we already have some recent feed
		const latest = OKFeed.findOne({groupLink});
		const now = new Date();

		if (latest && now.getTime() - latest.lastUpdate.getTime() < 1000 * 60 * 60) {
			return;
		}

		OKFeed.update(
			{groupLink},
			{
				$set: {
					lastUpdate: new Date(),
					lock: true,
				},
			},
			{
				upsert: true,
			},
		);

		const OK = new OKApi(settings);

		try {
			// get groupId from group url
			const result = OK.urlInfo(groupLink);

			if (result && result.data && result.data.objectId) {
				const groupId = result.data.objectId;

				OKFeed.update(
					{groupLink},
					{
						$set: {
							groupId,
							lastUpdate: new Date(),
						},
					},
					{
						upsert: true,
					},
				);

				refreshGroupInfo(OK, groupId);

				refreshGroupMessages(OK, groupId, amount);
				return true;
			}

			throw new Meteor.Error(404, 'Проверьте указанные данные');
		} catch (e) {
			// TODO: Inform on a network error, timeout, or HTTP error in the 400 or 500 range.
			console.log(e);
			throw new Meteor.Error(404, e);
		}
	},
	[methodNames.vk.getVideo]: function(videoLink) {
		if (this.isSimulation || !this.userId || !videoLink) return;
		this.unblock();

		const {projectServices} = Meteor.user() as IUser;

		const accessToken = projectServices?.vk?.access_token;
		if (accessToken) {
			const regex = /(video|clip)?(.([\d]+)_(\d+))/i;
			const videoLinkRegex = videoLink.match(regex);
			if (videoLinkRegex === null) {
				throw new Meteor.Error('Incorrect Link');
			}
			const vkVideoId = videoLinkRegex[2];
			try {
				const result = HTTP.call('GET', 'https://api.vk.com/method/video.get', {
					params: {
						videos: vkVideoId,
						access_token: accessToken,
						count: 1,
						v: '5.131',
					},
				});

				if (result && result.data && result.data.error) {
					throw new Meteor.Error(result.data.error.error_msg);
				}

				if (result && result.data && result.data.response) {
					const responce = result.data.response;
					if (responce.items.length > 0) {
						return responce.items;
					} else {
						throw new Meteor.Error('vk-video-not-found', 'Видео не найдено');
					}
				}
			} catch (error) {
				console.log({error});
				throw new Meteor.Error(error.error, error.reason);
			}
		} else {
			throw new Meteor.Error('vk-no-access-token', 'Подключите ВК сервис в профиле');
		}
	},
	[methodNames.vk.updateFeed]: function(pageId, element: ISlideElement, toggle = false) {
		check(pageId, String);

		if (this.isSimulation || !this.userId || !pageId || !element) return;

		this.unblock();

		const {projectServices} = Meteor.user() as IUser;
		const {vkMethodShow} = element;

		// Skip if we already have some recent feed
		if (!toggle) {
			const latest = VKFeed.findOne({pageId});
			const now = new Date();

			if (
				latest &&
				!latest.isNeedUpdate &&
				now.getTime() - latest.createdAt.getTime() < 1000 * 60 * 60
			) {
				return;
			}

			VKFeed.update({pageId}, {$set: {isNeedUpdate: false}});
		}

		if (
			vkMethodShow === SlideElementVkMethodShowEnum.USER_WALL &&
			projectServices &&
			projectServices.vk
		) {
			const {vk} = projectServices;

			try {
				vkUpdateUserWall(pageId, vk);

				return;
			} catch (e) {
				// TODO: Inform on a network error, timeout, or HTTP error in the 400 or 500 range.
				console.log(e);
				return;
			}
		}

		if (
			vkMethodShow === SlideElementVkMethodShowEnum.GROUP_PHOTO_ALBUM &&
			projectServices &&
			projectServices.vk
		) {
			const {vk} = projectServices;

			try {
				vkUpdateGroupPhotoAlbum(pageId, vk);

				return;
			} catch (e) {
				// TODO: Inform on a network error, timeout, or HTTP error in the 400 or 500 range.
				console.log(e);
				return;
			}
		}

		if (vkMethodShow === SlideElementVkMethodShowEnum.GROUP) {
			try {
				vkUpdateGroup(pageId);

				return;
			} catch (e) {
				// TODO: Inform on a network error, timeout, or HTTP error in the 400 or 500 range.
				console.log(e);
				return;
			}
		}
	},

	[methodNames.telegram.updateFeed]: function(pageId, element: ISlideElement, toggle = false) {
		check(pageId, String);
		if (this.isSimulation || !this.userId || !pageId || !element) return;

		this.unblock();

		const {telegramMethodShow} = element;
		if (telegramMethodShow === SlideElementTelegramMethodShowEnum.CHANNEL) {
			try {
				telegramUpdateGroup(pageId);
				return;
			} catch (e) {
				throw new Meteor.Error(404, 'Проверьте что такой канал существует');
			}
		}
	},

	[methodNames.twitter.updateFeed](
		tagOrName: string,
		getType: TwitterGetTypeEnum,
		elementId: string,
	) {
		const element = SlideElement.findOne(elementId);
		const now = new Date().getTime();
		let ends = 0;

		const query = {query: makeQueryTwitter(getType, tagOrName, element)};

		// Check if feed is already exists
		const twitterRecord = Twitter.findOne(query);
		if (twitterRecord) {
			ends = twitterRecord.ends.getTime();
		}

		const updateTwitterFeed = (newTweets: ITwitterFeedItem[], twitterItem?: ITwitterFeed) => {
			if (twitterItem) {
				Twitter.update(
					{_id: twitterItem._id},
					{
						$set: {
							ends: new Date(now + 30 * 60000),
							feed: [...newTweets, ...twitterItem.feed].slice(0, 100),
						},
					},
				);
			} else {
				const db = {
					query: makeQueryTwitter(getType, tagOrName, element),
					createdAt: new Date(),
					ends: new Date(now + 30 * 60000),
					feed: newTweets,
				};

				Twitter.upsert(query, db);
			}
		};

		// Update only if old enough
		if (now > ends) {
			const settings = getSettings('twitter');

			if (!settings) {
				throw new Meteor.Error('Нет настроек twitter');
			}

			const client = new Twit({
				consumer_key: settings.consumer_key!,
				consumer_secret: settings.consumer_secret!,
				access_token_key: settings.access_token_key!,
				access_token_secret: settings.access_token_secret!,
			});

			const commonParams = {
				count: 50,
				result_type:
					element.twitterHashtagFilter === SlideElementTwitterHashtagFilterEnum.POPULAR
						? 'popular'
						: 'recent',
				include_entities: true,
				tweet_mode: 'extended',
			};

			if (
				element.twitterHashtagFilter &&
				![
					SlideElementTwitterHashtagFilterEnum.POPULAR,
					SlideElementTwitterHashtagFilterEnum.RECENT,
				].includes(element.twitterHashtagFilter)
			) {
				commonParams.result_type = 'mixed';
			}

			let params: RequestParams;

			switch (getType) {
				case TwitterGetTypeEnum.HASHTAG:
					params = {
						...commonParams,
						q: makeQueryTwitter(getType, tagOrName, element).replace(/\ssort.*$/, ''),
					};

					if (twitterRecord?.feed.length) {
						params.since_id = twitterRecord!.feed[0].twitterId;
					}

					client.get(
						'search/tweets',
						params,
						Meteor.bindEnvironment((error, data) => {
							if (!error && data && data.statuses) {
								updateTwitterFeed(data.statuses.map(formData), twitterRecord);
							}
						}),
					);

					break;

				case TwitterGetTypeEnum.PROFILE_NAME:
					params = {
						...commonParams,
						screen_name: tagOrName,
					};

					if (twitterRecord?.feed.length) {
						params.since_id = twitterRecord!.feed[0].twitterId;
					}

					client.get(
						'statuses/user_timeline',
						params,
						Meteor.bindEnvironment((error, data) => {
							if (!error && data) {
								updateTwitterFeed(data.map(formData), twitterRecord);
							}
						}),
					);

					break;

				case TwitterGetTypeEnum.LIST:
					if (!element.twitterListId) {
						return;
					}

					params = {
						...commonParams,
						list_id: element.twitterListId,
					};

					if (twitterRecord?.feed.length) {
						params.since_id = twitterRecord!.feed[0].twitterId;
					}

					client.get(
						'lists/statuses',
						params,
						Meteor.bindEnvironment((error, data) => {
							if (!error && data) {
								updateTwitterFeed(data.map(formData), twitterRecord);
							}
						}),
					);

					break;

				case TwitterGetTypeEnum.COLLECTION:
					if (!element.twitterCollectionId) {
						return;
					}

					params = {
						...commonParams,
						id: element.twitterCollectionId,
					};

					if (twitterRecord?.feed.length) {
						params.since_id = twitterRecord!.feed[0].twitterId;
					}

					client.get(
						'collections/entries',
						params,
						Meteor.bindEnvironment((error, data) => {
							if (!error && data) {
								const users = Object.keys(data.objects?.users).map(
									(k) => data.objects?.users[k],
								);
								updateTwitterFeed(
									Object.values(data.objects?.tweets || {}).map((d: any, i) =>
										formData({...d, users}, i),
									),
									twitterRecord,
								);
							}
						}),
					);

					break;
			}
		}
	},

	[methodNames.twitter.getLists](elementId: string) {
		const settings = getSettings('twitter');

		if (!settings) {
			throw new Meteor.Error('Нет настроек twitter');
		}

		const client = new Twit({
			consumer_key: settings.consumer_key!,
			consumer_secret: settings.consumer_secret!,
			access_token_key: settings.access_token_key!,
			access_token_secret: settings.access_token_secret!,
		});

		const element = SlideElement.findOne(elementId);

		const params = {
			count: 50,
			screen_name: element.twitterProfileNameForList,
		};

		client.get(
			'lists/ownerships',
			params,
			Meteor.bindEnvironment(
				(error: boolean, data: {lists?: {id_str: string; name: string}[]}) => {
					SlideElement.update(
						{_id: elementId},
						{
							$set: {
								twitterLists:
									data?.lists?.map(({id_str, name}) => ({
										label: name,
										listId: id_str,
									})) || [],
							},
						},
					);
				},
			),
		);
	},

	[methodNames.twitter.getCollections](elementId: string) {
		const settings = getSettings('twitter');

		if (!settings) {
			throw new Meteor.Error('Нет настроек twitter');
		}

		const client = new Twit({
			consumer_key: settings.consumer_key!,
			consumer_secret: settings.consumer_secret!,
			access_token_key: settings.access_token_key!,
			access_token_secret: settings.access_token_secret!,
		});

		const element = SlideElement.findOne(elementId);

		const params = {
			count: 50,
			screen_name: element.twitterProfileNameForCollection,
		};

		client.get(
			'collections/list',
			params,
			Meteor.bindEnvironment(
				(
					error: boolean,
					data: {
						objects: {
							timelines?: {[key: string]: {name: string}};
							users?: {[key: string]: ITwitterUserForCollections};
						};
					},
				) => {
					SlideElement.update(
						{_id: elementId},
						{
							$set: {
								twitterCollections: Object.values(
									data?.objects.timelines || {},
								)?.map(({name}, i) => ({
									label: name,
									collectionId: Object.keys(data?.objects.timelines!)[i],
								})),
								twitterUsersForCollections: Object.values(
									data?.objects.users || {},
								),
							},
						},
					);
				},
			),
		);
	},

	[methodNames.fb.updateFeed](userId, pageId) {
		check(userId, String);
		// const userToken = getSettings('facebook');

		const {appSecret, appId} = Meteor.settings.services[ServiceEnum.FACEBOOK];
		const {projectServices} = Meteor.users.findOne({_id: userId}) as IUser;
		const accessToken =
			projectServices && projectServices.facebook && projectServices.facebook.access_token;

		if (!appSecret || !appId || !accessToken) {
			return;
		}

		if (pageId) {
			fbUpdateGroup(appId, appSecret, accessToken, pageId);
		} else {
			fbUpdateMePages(appId, appSecret, accessToken);
		}

		return;
	},

	[methodNames.zoom.getSignature](elementId) {
		check([elementId], [String]);

		const slideElement = SlideElement.findOne({_id: elementId});

		if (!slideElement) throw new Meteor.Error(400, 'Element not fount');

		const iat = Math.round((new Date().getTime() - 30000) / 1000);
		const exp = iat + 60 * 60 * 2;

		const oHeader = {alg: 'HS256', typ: 'JWT'};

		const oPayload = {
			sdkKey: slideElement.zoom_sdkKey,
			mn: slideElement.zoom_meetingNumber,
			role: slideElement.zoom_role,
			iat: iat,
			exp: exp,
			appKey: slideElement.zoom_sdkKey,
			tokenExp: iat + 60 * 60 * 2,
		};

		const sHeader = JSON.stringify(oHeader);
		const sPayload = JSON.stringify(oPayload);

		return KJUR.jws.JWS.sign('HS256', sHeader, sPayload, slideElement.zoom_sdkSecret);
	},

	async [methodNames.airQuality.getData]({
		bounds,
		elementWidth,
		elementHeight,
		iconSize,
		substanceType,
	}) {
		check(bounds, [[Number]]);
		check(elementWidth, Number);
		check(elementHeight, Number);
		check(iconSize, Number);
		check(substanceType, String);

		const settings = getSettings('elecont');

		if (!settings) {
			throw new Meteor.Error('Нет настроек elecont');
		}

		const params = {
			ApiKey: settings.apiKey,
			la: 'ru-ru',
			top: bounds[1][0],
			left: bounds[0][1],
			bottom: bounds[0][0],
			right: bounds[1][1],
			numberX: Math.round(elementWidth / iconSize),
			numberY: Math.round(elementHeight / iconSize),
			type: substanceType,
			srcT: 2,
		};
		const response = await getAirQualityData(params);

		return JSON.parse(xmlParser.xml2json(response.data, {compact: true, spaces: 4}))?.AQIRegion;
	},
});

const getAirQualityData = async (
	params: any,
	server = 'airquality.elecont.com',
): Promise<AxiosResponse> => {
	try {
		return await axios.get(`http://${server}/ElecontAirQuality`, {params, timeout: 5000});
	} catch (e) {
		return await getAirQualityData(params, 'airquality.eweatherhd.com');
	}
};

function formData(data: any, i: number) {
	// if (
	// 	data.full_text ===
	// 	"Sorry blue, I'm testing vents #amongus #demake #pico8 https://t.co/3PoBGBTJ3x"
	// ) {
	// 	console.log('data');
	// console.dir(data);
	// 	console.dir(data.entities?.media);
	// // console.dir(data.extended_entities?.media);
	// console.dir(data.extended_entities?.media[0].video_info.variants[0].url);
	// }

	let isGif = false;
	let video = data.extended_entities?.media?.find(({type}: any) => type === 'animated_gif')
		?.video_info.variants?.[0]?.url;

	if (!video && data.retweeted_status) {
		video = data.retweeted_status.extended_entities?.media?.find(
			({type}: any) => type === 'animated_gif',
		)?.video_info.variants?.[0]?.url;
	}
	if (!video && data.quoted_status) {
		video = data.quoted_status.extended_entities?.media?.find(
			({type}: any) => type === 'animated_gif',
		)?.video_info.variants?.[0]?.url;
	}
	if (video) {
		isGif = true;
	}

	if (!video) {
		video = data.extended_entities?.media
			?.find(({type}: any) => type === 'video')
			//иногда первым идет application/x-mpegURL по этому приходится фильтровать
			?.video_info.variants?.find(({content_type}: any) => content_type === 'video/mp4')?.url;
	}

	if (!video && data.retweeted_status) {
		video = data.retweeted_status.extended_entities?.media
			?.find(({type}: any) => type === 'video')
			?.video_info.variants?.find(({content_type}: any) => content_type === 'video/mp4')?.url;
	}

	if (!video && data.quoted_status) {
		video = data.quoted_status.extended_entities?.media
			?.find(({type}: any) => type === 'video')
			?.video_info.variants?.find(({content_type}: any) => content_type === 'video/mp4')?.url;
	}

	let photo =
		data.entities.media?.find(({type}: any) => type === 'photo') &&
		data.entities.media.find(({type}: any) => type === 'photo').media_url;

	if (!photo && data.retweeted_status) {
		photo =
			data.retweeted_status.entities?.media?.find(({type}: any) => type === 'photo') &&
			data.retweeted_status.entities.media.find(({type}: any) => type === 'photo').media_url;
	}

	const user =
		(data.users as ITwitterUserForCollections[] | undefined)?.find(
			({id}) => id === data.user.id,
		) || data.user;

	return {
		photo,
		video,
		isGif,
		id: data.id,
		createdAt: data.created_at,
		twitterId: data.id_str,
		text: data.full_text,
		retweetCount: data.retweet_count,
		favoriteCount: data.favorite_count,
		user: {
			twitterId: user.id,
			name: user.name,
			imageUrl: user.profile_image_url_https,
			profileName: user.screen_name,
			url: `https://twitter.com/${user.screen_name}`,
			verified: data.verified,
		},
	} as ITwitterFeedItem;
}
