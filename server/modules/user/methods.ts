import {Meteor} from 'meteor/meteor';
import {check} from 'meteor/check';
import {Random} from 'meteor/random';
import {Accounts} from 'meteor/accounts-base';
import request from 'request';

import {ServiceEnum, UserSchema} from 'shared/collections/Users';
import {methodNames} from 'shared/constants/methodNames';
import {IUser} from 'client/components/user/ProfilePage';
import {VKFeed} from 'shared/collections/VKFeed';
import {SlideElement, SlideElementTypeEnum} from 'shared/collections/SlideElements';
import {Slideshow} from 'shared/collections/Slideshows';
import {Group} from 'shared/collections/Groups';
import {sharedConsts} from 'shared/constants/sharedConsts';
import {getSettings} from 'server/modules/dataSources/utils';

Accounts.onCreateUser((options, user: IUser) => {
	const email = options.email || (user.services.facebook && user.services.facebook.email);
	const emailExists = Meteor.users.findOne({'emails.address': email});

	if (emailExists) {
		throw new Error('Указанный e-mail уже используется');
	}

	if (user.services.facebook) {
		user.name = user.services.facebook.name;
		user.emails = [{address: user.services.facebook.email}];
	} else {
		user.name = options.profile.name;
		user.company = options.profile.company;

		delete options.profile;
	}

	user.status = 'new';
	user.projectServices = {
		vk: null,
		google: null,
		facebook: null,
	};

	Meteor.call(methodNames.sendpulse.uploadUser, user);

	const group = new Group({
		userId: user._id,
		name: sharedConsts.user.slideShowGroupDefault,
	});

	group.save();

	// Don't forget to return the new user object at the end!
	return user;
});

Meteor.methods({
	// Set admin role for the user
	[methodNames.user.setAdminRole]: function(userId, adminRole) {
		const iam = this.userId;
		if (!iam || !Roles.userIsInRole(iam, 'admin')) return;

		check(userId, String);
		check(adminRole, Boolean);

		if (adminRole) {
			Roles.addUsersToRoles(userId, 'admin', Roles.GLOBAL_GROUP);
		} else {
			Roles.removeUsersFromRoles(userId, ['admin'], Roles.GLOBAL_GROUP);
		}
	},
	[methodNames.user.setTemplateEditorRole]: function(userId, adminRole) {
		const iam = this.userId;
		if (!iam || !Roles.userIsInRole(iam, 'admin')) return;

		check(userId, String);
		check(adminRole, Boolean);

		if (adminRole) {
			Roles.addUsersToRoles(userId, 'template_editor', Roles.GLOBAL_GROUP);
		} else {
			Roles.removeUsersFromRoles(userId, ['template_editor'], Roles.GLOBAL_GROUP);
		}
	},
	// Set new user status: new, approved, blocked
	[methodNames.user.setStatus]: function(obj) {
		const userId = this.userId;
		if (!userId || !Roles.userIsInRole(userId, 'admin')) return;

		check(obj._id, String);
		check(obj.status, String);

		Meteor.users.update(obj._id, {$set: {status: obj.status}});
	},

	[methodNames.user.setPassword]: function(userId, password) {
		if (!Meteor.userId() || !Roles.userIsInRole(Meteor.userId(), 'admin')) {
			throw new Meteor.Error(403, 'Permission denied');
		}

		check(userId, String);
		UserSchema.setPassword.validate({password});

		Accounts.setPassword(userId, password);
	},

	[methodNames.user.update]: function(userId, updateObj) {
		const context = UserSchema.Profile.newContext();
		context.validate(updateObj);
		if (!context.isValid()) {
			throw new Error('Ошибка проверки формы');
		}
		check(userId, String);

		// check permissions
		if (
			!Meteor.userId() ||
			(Meteor.userId() !== userId && !Roles.userIsInRole(Meteor.userId(), 'admin'))
		) {
			return;
		}
		//  everything seems cool, update the user
		Meteor.users.update(userId, {$set: updateObj});

		Meteor.call(methodNames.sendpulse.uploadUser, Meteor.user());
	},

	[methodNames.user.delete]: function(id) {
		if (!Meteor.userId() || !Roles.userIsInRole(Meteor.userId(), 'admin')) {
			throw new Meteor.Error(403, 'Permission denied');
		}

		check(id, String);

		Meteor.call(methodNames.sendpulse.uploadUser, Meteor.user());

		Meteor.users.remove(id);
	},

	[methodNames.user.prepareForFakeLogin]: function(obj) {
		if (!Meteor.userId() || !Roles.userIsInRole(Meteor.userId(), 'admin')) {
			throw new Meteor.Error(403, 'Permission denied');
		}

		var token = Random.secret();
		Meteor.users.update(obj._id, {
			$set: {'services.fakeAuth.token': token},
		});
		return token;
	},

	[methodNames.user.sendVerificationEmail]: function() {
		const userId = Meteor.userId();

		if (!userId) {
			throw new Meteor.Error(403, 'Permission denied');
		}

		this.unblock();

		Accounts.sendVerificationEmail(userId);
	},

	async [methodNames.twitter.getAuthToken](oauthCallback: string) {
		const settings = getSettings('twitter');

		if (!settings?.consumer_key || !settings?.consumer_secret) {
			throw new Meteor.Error('Нет настроек twitter');
		}

		const options = {
			headers: {
				Accept: '*/*',
				Connection: 'close',
				'User-Agent': 'node-twitter/1',
			},
			oauth: {
				consumer_key: settings.consumer_key!,
				consumer_secret: settings.consumer_secret,
				token: '3523118355-tJSxi7diUrab5fMyWbUvyqOwCWaOHNSbCRldAR4'!,
				token_secret: 't2duPM8h7ek95RB8VdxhJbwmd4J5Y6JRUG1WuBTluvuSe'!,
			},
			method: 'post',
			url: 'https://api.twitter.com/oauth/request_token',
			form: {
				oauth_callback: oauthCallback,
			},
		};

		const {error, data} = await new Promise((resolve) =>
			request(options, (error, response, data) => {
				resolve({error, data});
			}),
		);

		if (error) {
			return {error: 'Ошибка при получении токена'};
		}

		const authToken = data.match(/oauth_token=(.*?)&/)[1];

		if (!authToken) {
			return {error: 'Ошибка при поиске в ответе токена'};
		}

		return {authToken};
	},

	[methodNames.user.toggleService]: (
		data: {
			state?: string;
			error?: boolean;
			code?: string;
			oauth_token?: string;
			oauth_verifier?: string;
		},
		appId,
		isEnable,
	) => {
		check(data, Object);
		check(appId, String);
		check(isEnable, Boolean);

		const user = Meteor.user();
		if (!user || !data || data.error) {
			throw new Meteor.Error(403, 'Permission denied');
		}

		const [serviceName, redirectUri] = (data.state || '').split('::');

		switch (serviceName) {
			case ServiceEnum.GOOGLE:
				if (isEnable && !data.code) {
					throw new Meteor.Error(403, 'Permission denied');
				}

				if (isEnable && data.code) {
					if (!Meteor.settings.services[ServiceEnum.GOOGLE]) {
						throw new Meteor.Error(
							methodNames.user.toggleService,
							'Service is not configured in the configuration file',
						);
					}

					const {secret} = Meteor.settings.services[ServiceEnum.GOOGLE];

					HTTP.post(
						'https://oauth2.googleapis.com/token',
						{
							params: {
								client_id: appId,
								client_secret: secret,
								redirect_uri: redirectUri,
								code: data.code,
								grant_type: 'authorization_code',
							},
						},
						(err: any, res: any) => {
							if (err) {
								throw new Meteor.Error(
									err.response.statusCode,
									err.response.data.error_description,
								);
							}

							Meteor.users.update(
								{_id: user._id},
								{
									$set: {
										'projectServices.google': res.data,
									},
								},
							);
						},
					);
				} else {
					Meteor.users.update(
						{_id: user._id},
						{
							$set: {
								'projectServices.google': null,
							},
						},
					);
				}

				break;

			case ServiceEnum.VK:
				if (isEnable && !data.code) {
					throw new Meteor.Error(403, 'Permission denied');
				}

				if (isEnable && data.code) {
					if (!Meteor.settings.services[ServiceEnum.VK]) {
						throw new Meteor.Error(
							methodNames.user.toggleService,
							'Service is not configured in the configuration file',
						);
					}

					const {secret} = Meteor.settings.services[ServiceEnum.VK];

					HTTP.post(
						'https://oauth.vk.com/access_token',
						{
							params: {
								client_id: appId,
								client_secret: secret,
								redirect_uri: redirectUri,
								code: data.code,
							},
						},
						(err: any, res: any) => {
							if (err) {
								throw new Meteor.Error(
									err.response.statusCode,
									err.response.data.description,
								);
							}

							Meteor.users.update(
								{_id: user._id},
								{
									$set: {
										'projectServices.vk': res.data,
									},
								},
							);
						},
					);
				} else {
					Meteor.users.update(
						{_id: user._id},
						{
							$set: {
								'projectServices.vk': null,
							},
						},
					);
				}

				break;

			case ServiceEnum.FACEBOOK:
				if (isEnable && !data.code) {
					throw new Meteor.Error(403, 'Permission denied');
				}

				if (isEnable && data.code) {
					if (!Meteor.settings.services[ServiceEnum.FACEBOOK]) {
						throw new Meteor.Error(
							methodNames.user.toggleService,
							'Service is not configured in the configuration file',
						);
					}

					const {appSecret} = Meteor.settings.services[ServiceEnum.FACEBOOK];

					HTTP.post(
						`https://graph.facebook.com/oauth/access_token?client_id=${appId}&client_secret=${appSecret}&redirect_uri=${redirectUri}&code=${data.code}`,
						{},
						(err: any, res: any) => {
							if (err) {
								throw new Meteor.Error(
									err.response.statusCode,
									err.response.data.description,
								);
							}

							Meteor.users.update(
								{_id: user._id},
								{
									$set: {
										'projectServices.facebook': res.data,
									},
								},
							);
						},
					);
				} else {
					Meteor.users.update(
						{_id: user._id},
						{
							$set: {
								'projectServices.facebook': null,
							},
						},
					);
				}

				break;

			case ServiceEnum.TWITTER:
			default:
				// Нужно, так как state не поддерживается
				if (isEnable && !(data.oauth_token || data.oauth_verifier)) {
					throw new Meteor.Error(403, 'Permission denied');
				}

				if (isEnable && data.oauth_token && data.oauth_verifier) {
					HTTP.post(
						'https://api.twitter.com/oauth/access_token',
						{
							params: {
								oauth_consumer_key: appId,
								oauth_token: data.oauth_token,
								oauth_verifier: data.oauth_verifier,
							},
						},
						(err: any, res: any) => {
							if (err) {
								throw new Meteor.Error(
									err.response.statusCode,
									err.response.data.description,
								);
							}

							function parseQuery(queryString: string) {
								const query = {};
								const pairs = (queryString[0] === '?'
									? queryString.substr(1)
									: queryString
								).split('&');

								for (const pair of pairs) {
									const pairArr = pair.split('=');
									query[decodeURIComponent(pairArr[0])] = decodeURIComponent(
										pairArr[1] || '',
									);
								}
								return query;
							}

							Meteor.users.update(
								{_id: user._id},
								{
									$set: {
										'projectServices.twitter': parseQuery(res.content),
									},
								},
							);
						},
					);
				} else {
					Meteor.users.update(
						{_id: user._id},
						{
							$set: {
								'projectServices.twitter': null,
							},
						},
					);
				}

				break;
		}

		// Нужно для обхода ожидания обновления feed при переходе из сообщения о необходимости подключить сервис
		// решая тем самым проблему с нербходимостью переключать vkMethodShow для правильного отображения
		// TODO Вынести в отдельную функцию, когда появится необходимость (при расширении на другие соцсети например)
		const slideShowIds = Slideshow.find({userId: user._id}, {fields: {_id: 1}})
			.fetch()
			.map(({_id}) => _id);
		const groupIds = SlideElement.find(
			{
				slideshowId: {$in: slideShowIds},
				type: SlideElementTypeEnum.VKONTAKTE,
			},
			{fields: {vkGroupId: 1}},
		)
			.fetch()
			.map(({vkGroupId}) => vkGroupId || '');

		VKFeed.update({pageId: {$in: groupIds}}, {$set: {isNeedUpdate: true}}, {multi: true});
	},

	[methodNames.user.refreshGoogleToken]: (appId: string, userId: string) => {
		check(appId, String);
		check(userId, String);

		const {secret} = Meteor.settings.services[ServiceEnum.GOOGLE];
		const user = Meteor.users.findOne({_id: userId});

		if (!user) {
			return;
		}

		const {projectServices} = user as IUser;

		if (!projectServices || !projectServices.google) {
			return;
		}

		const {
			google: {refresh_token},
		} = projectServices;

		try {
			HTTP.post(
				'https://oauth2.googleapis.com/token',
				{
					params: {
						refresh_token,
						client_id: appId,
						client_secret: secret,
						grant_type: 'refresh_token',
					},
				},
				(err: any, res: any) => {
					if (err) {
						throw new Meteor.Error(
							err.response.statusCode,
							err.response.data.error_description,
						);
					}

					Meteor.users.update(
						{_id: userId},
						{
							$set: {
								'projectServices.google': {...projectServices.google, ...res.data},
							},
						},
					);
				},
			);
		} catch (e) {}
	},
});
