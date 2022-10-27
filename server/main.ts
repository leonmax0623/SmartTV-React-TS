import {Meteor} from 'meteor/meteor';
import {Random} from 'meteor/random';
import {EJSON} from 'meteor/ejson';
import {Accounts} from 'meteor/accounts-base';
import {Picker} from 'meteor/meteorhacks:picker';
import {WebApp} from 'meteor/webapp';
import {Monti} from 'meteor/montiapm:agent';
import {Facebook} from 'fb';
import {ServiceConfiguration} from 'meteor/service-configuration';
import fs from 'fs';
import path from 'path';
import {parse, stringify} from 'svgson';

import {Config} from 'shared/constants/config';

import 'server/modules/mongo/extendWithSystemLogs';

// Modules
import './modules/slideshow';
import './modules/dataSources';
import './modules/user';
import './modules/appsets';
import './modules/mockups';
import './modules/sourceInformers';
import './modules/cities';
import './modules/group';
import './modules/systemGroup';
import './modules/paidServices';
import './modules/slideStream';
import './modules/cart';
import './modules/faq';
import './modules/videoHosting';
import './modules/statistics';

// Import collections and initialize API
import runScheduler from './scheduler/agenda';
import {startMigrations} from './migrations';
import {Tokens} from 'shared/collections/Tokens';
import 'shared/collections/Twitter';
import {CitiesCollection} from 'shared/collections/Cities';
import 'shared/collections/InstagramFeed';
import {AppSets} from 'shared/collections/AppSets';
import {Slideshow} from 'shared/collections/Slideshows';
import {methodNames} from 'shared/constants/methodNames';
import {ServiceEnum} from 'shared/collections/Users';
import {SystemGroup} from 'shared/collections/SystemGroups';
import {initWebhook} from 'server/integrations/PayKeeper/initWebhook';
import setPaidServiceData from 'server/fixtures/paidService';
import setFaqData from 'server/fixtures/faq';
import {SlideStream} from 'shared/collections/SlideStream';
import {PaidServicePackagesEnum} from 'shared/collections/PaidServices';

Meteor.startup(() => {
	startMigrations();
	runScheduler();

	const appId = Meteor.settings?.montiapm?.appId || process.env.MONTIAPM_APP_ID;
	const appSecret = Meteor.settings?.montiapm?.appSecret || process.env.MONTIAPM_APP_SECRET;

	if (appId && appSecret) {
		Monti.connect(appId, appSecret);
	}

	// Listen to incoming HTTP requests, can only be used on the server
	WebApp.rawConnectHandlers.use(function(req, res, next) {
		res.setHeader('Access-Control-Allow-Origin', '*');
		return next();
	});

	const {settings} = Meteor;
	const {smtp} = Meteor.settings;
	const {host, port} = smtp;
	const username = encodeURIComponent(smtp.username);
	const password = encodeURIComponent(smtp.password);

	// DEBUG: comment out the line to see emails contents on the server console
	process.env.MAIL_URL = `smtps://${username}:${password}@${host}:${port.toString()}`;

	// Fixtures
	if (Meteor.users.find().count() === 0) {
		// Admin account
		const userId = Accounts.createUser({
			email: settings.adminUser.email,
			password: settings.adminUser.password,
			profile: {
				phone: settings.adminUser.phone,
			},
		});
		Roles.addUsersToRoles(userId, 'admin', Roles.GLOBAL_GROUP);
	}

	setPaidServiceData();
	setFaqData();

	// TODO: dynamic check
	if (CitiesCollection.find().count() === 0) {
		console.info('Cities collection is empty, importing...');
		Assets.getText('cities-2016-08-19.json', function(err: object, data: string) {
			const cities: object = EJSON.parse(data);

			for (const el of Object.keys(cities)) {
				cities[el]['yid'] = el;
				CitiesCollection.insert(cities[el]);
			}
		});
	}

	if (SystemGroup.find().count() === 0) {
		console.info('SystemGroup collection is empty, importing...');
		const categories = [
			'Календарь',
			'Меню борд',
			'Бизнес',
			'Школа',
			'Подъезд',
			'Разное',
			'Подборка. Измайлово 1',
			'Подборка. Измайлово 2',
			'Подборка. Детская.',
			'Подборка. Ретро.',
		];
		categories.forEach((val, index) => SystemGroup.insert({name: val, order: index}));
	}

	// Uploads
	const mimeTypes = {
		jpeg: 'image/jpeg',
		jpg: 'image/jpeg',
		png: 'image/png',
		gif: 'image/gif',
		svg: 'image/svg+xml',
		webp: 'image/webp',
	};
	UploadServer.init({
		tmpDir: settings.tmpDir,
		uploadDir: settings.uploadsDir,
		checkCreateDirectories: true, // create the directories for you
		// callback when an upload is finished on the server
		finished(fileInfo, formFields) {
			if (fileInfo.type === mimeTypes.svg) {
				const svgContent = fs.readFileSync(
					path.join(settings.uploadsDir, fileInfo.path),
					'utf8',
				);
				parse(svgContent).then((svgJson) => {
					svgJson.attributes.preserveAspectRatio = 'none';
					fs.writeFileSync(
						path.join(settings.uploadsDir, fileInfo.path),
						stringify(svgJson),
					);
				});
			}

			// todo: for what this code?
			// populate form data to file
			if (typeof formFields === 'undefined') {
				return;
			}

			fileInfo.slideshowId = formFields.slideshowId;
			fileInfo.slideId = formFields.slideId;
			fileInfo.elementId = formFields.elementId;
		},
		mimeTypes,
		// generate unique file name
		getFileName(fileInfo) {
			let ext = '';
			if (fileInfo.type === mimeTypes.jpg) ext = '.jpg';
			if (fileInfo.type === mimeTypes.jpeg) ext = '.jpg';
			if (fileInfo.type === mimeTypes.png) ext = '.png';
			if (fileInfo.type === mimeTypes.gif) ext = '.gif';
			if (fileInfo.type === mimeTypes.svg) ext = '.svg';
			if (fileInfo.type === mimeTypes.webp) ext = '.webp';
			return Random.id() + ext;
		},
	});

	Accounts.registerLoginHandler('fakeLogin', function(options) {
		if (!(options.fakeLoginToken && typeof options.fakeLoginToken == 'string'))
			// typeof, not check
			return undefined; // don't handle

		var user = Meteor.users.findOne({
			'services.fakeAuth.token': options.fakeLoginToken,
		});

		if (user) {
			return {
				userId: user._id,
			};
		} else {
			return {
				error: new Meteor.Error(403, 'invalid token'),
			};
		}
	});

	// Facebook

	const {appId: fbAppId, appSecret: fbAppSecret} = Meteor.settings.services[ServiceEnum.FACEBOOK];

	// OAuth facebook setup

	ServiceConfiguration.configurations.remove({
		service: 'facebook',
	});

	ServiceConfiguration.configurations.insert({
		// @ts-ignore
		service: 'facebook',
		appId: fbAppId,
		secret: fbAppSecret,
	});

	// Get a facebook token (and update it from time to time)
	const RefreshFBToken = function() {
		const fb = new Facebook();
		fb.api(
			'oauth/access_token',
			{
				client_id: fbAppId,
				client_secret: fbAppSecret,
				grant_type: 'client_credentials',
			},
			Meteor.bindEnvironment(function(res) {
				if (!res || res.error) {
					console.log(!res ? 'Failed to get a facebook token' : res.error);
					return;
				}

				Tokens.update(
					{service: 'facebook'},
					{
						service: 'facebook',
						token: res.access_token,
						createdAt: new Date(),
					},
					{
						upsert: true,
					},
				);
			}),
		);
	};

	RefreshFBToken();
	Meteor.setInterval(RefreshFBToken, 1000 * 60 * 60 * 24);

	// Setup e-mail templates
	// Read more: http://docs.meteor.com/api/passwords.html#Accounts-emailTemplates
	Accounts.emailTemplates.siteName = Config.emailTemplates.siteName;
	Accounts.emailTemplates.from = Config.emailTemplates.from;

	Accounts.emailTemplates.resetPassword.subject = Config.emailTemplates.resetPassword.subject;
	//Accounts.emailTemplates.resetPassword.text = Config.emailTemplates.resetPassword.text;
	Accounts.emailTemplates.resetPassword.html = Config.emailTemplates.resetPassword.html;

	Accounts.emailTemplates.verifyEmail = Config.emailTemplates.verifyEmail;

	// API routes
	initWebhook();

	Picker.route('/api/set/:numId', function(params, req, res, next) {
		let numId = params.numId;
		const appset = AppSets.findOne({numId});
		let out = appset ? appset : {error: 'AppSet is not found'};
		// Notify the user on result
		res.writeHead(200, {'Content-Type': 'application/json'});
		res.end(JSON.stringify(out));
	});

	Picker.route('/api/slideShow/:numId', function(params, req, res, next) {
		const numId = params.numId;
		const app = Slideshow.findOne({numId});
		let out = app ? {appId: numId} : {error: 'App not found'};

		if (out.appId && app.password) {
			if (app.password === req.headers.password) {
				out = {appId: numId};
			} else {
				out = {appId: numId, error: 'Password is not correct'};
			}
		}

		// Notify the user on result
		res.writeHead(200, {'Content-Type': 'application/json'});
		res.end(JSON.stringify(out));
	});

	Picker.route('/api/stream/:numId', function(params, req, res, next) {
		const numId = params.numId;
		let app = SlideStream.findOne({code: numId});
		const streamUserId = app.userId;
		let out = app ? {streamId: numId} : {error: 'Stream not found'};
		if (!streamUserId) {
			out = {error: 'Доступ запрещен'};
		}
		const accessList = Meteor.call(
			methodNames.paidServices.isGranted,
			PaidServicePackagesEnum.SLIDESHOW_STREAM,
			streamUserId,
		);
		const isAccessGranted = accessList[PaidServicePackagesEnum.SLIDESHOW_STREAM];
		if (!isAccessGranted) {
			out = {error: 'Доступ запрещен'};
		}

		if (out.streamId && app.password) {
			if (app.password === req.headers.password) {
				out = {streamId: numId};
			} else {
				out = {streamId: numId, error: 'Password is not correct'};
			}
		}

		// Notify the user on result
		res.writeHead(200, {
			'Content-Type': 'application/json',
			'Access-Control-Allow-Origin': '*',
		});
		res.end(JSON.stringify(out));
	});

	// Insert yandex stations codes
	// Get a VK token
	const {services} = settings;
	// insert tokens from settings
	Object.keys(services).forEach((service) => {
		Tokens.update(
			{service},
			{
				...services[service],
				service,
				createdAt: new Date(),
			},
			{
				upsert: true,
			},
		);
	});

	// TODO: убрано из-за бага запуска приложения в докере
	// Meteor.call('getYaStations');

	Meteor.call(methodNames.sendpulse.uploadUsers);
});
