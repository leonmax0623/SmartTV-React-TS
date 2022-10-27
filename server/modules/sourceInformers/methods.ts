import {Meteor} from 'meteor/meteor';
import {HTTP} from 'meteor/http';
import {Monti} from 'meteor/montiapm:agent';
import convert from 'xml-js';
import * as moment from 'moment/moment';
import weather from 'openweather-apis';
import Parser from 'rss-parser';
import Sendpulse from 'sendpulse-api';

import {CurrencyFeed, ICurrencyFeed} from 'shared/collections/CurrencyFeed';
import {RssFeed} from 'shared/collections/RssFeed';
import {OWMFeed} from 'shared/collections/OWMFeed';
import {YaScheduleFeed} from 'shared/collections/YaScheduleFeed';
import {YaStationsFeed} from 'shared/collections/YaStationsFeed';
import {methodNames} from 'shared/constants/methodNames';
import {getSettings} from '../dataSources/utils';

Meteor.methods({
	// прогноз на завтра
	[methodNames.currency.update]: function() {
		// url for currency http://www.cbr.ru/scripts/XML_daily.asp
		const apiUrl = 'http://www.cbr.ru/scripts/XML_daily.asp';
		const xml = HTTP.call('GET', apiUrl);
		const feed = CurrencyFeed.findOne() || <ICurrencyFeed>{};

		if (xml && xml.statusCode === 200) {
			const json = convert.xml2js(xml.content!, {
				compact: true,
				instructionHasAttributes: true,
				ignoreDeclaration: true,
				ignoreAttributes: true,
				ignoreInstruction: true,
				ignoreComment: true,
				alwaysChildren: true,
				nativeTypeAttributes: true,
				nativeType: true,
			});

			if (json && json.ValCurs && json.ValCurs.Valute) {
				CurrencyFeed.upsert(
					{_id: feed._id},
					{
						$set: {
							tomorrow: {
								currency: normolizeObject(json.ValCurs.Valute),
								date: moment()
									.add(1, 'day')
									.toDate(),
							},
							updatedAt: new Date(),
						},
					},
				);

				return true;
			}
		}
	},

	// прогноз на сегодня
	[methodNames.currency.updateTodayValue]: function() {
		const feed = CurrencyFeed.findOne();

		if (feed) {
			CurrencyFeed.upsert(
				{_id: feed._id},
				{
					$set: {
						today: feed.tomorrow,
						updatedAt: new Date(),
					},
				},
			);
		}
	},

	[methodNames.ya.getYaSchedule]: function({transport, from, to}) {
		if (this.isSimulation) return true;
		if (!transport || !from || !to) return true;
		this.unblock();

		const settings = getSettings('yandex');
		if (!settings) return;

		const toFeed = YaStationsFeed.findOne({title: to});
		const fromFeed = YaStationsFeed.findOne({title: from});

		if (!toFeed || !fromFeed) {
			let errorMessage = 'Не верно указанно место ';
			errorMessage += !toFeed ? 'назначения' : 'отправления';

			YaScheduleFeed.upsert(
				{from, to, transport},
				{
					$set: {
						errorMessage,
						from,
						to,
						transport,
						date: new Date(),
						error: true,
					},
				},
			);
			return;
		}

		try {
			const result = HTTP.get('https://api.rasp.yandex.net/v3.0/search/', {
				params: {
					apikey: settings.apiKey,
					format: 'json',
					from: fromFeed.codes.yandex_code,
					to: toFeed.codes.yandex_code,
					lang: 'ru_ru',
					page: '1',
					date: moment().format('YYYY-MM-DD'),
					limit: '20',
					transport_types: transport,
				},
			});

			if (result && result.statusCode === 200 && result.data) {
				YaScheduleFeed.upsert(
					{from, to, transport},
					{
						$set: {
							from,
							to,
							transport,
							date: new Date(),
							segments: result.data.segments,
							search: result.data.search,
							lastUpdate: new Date(),
						},
						$unset: {
							error: 1,
							errorMessage: 1,
						},
					},
				);
			}

			return result;
		} catch (error) {
			return error;
		}
	},

	// Метод наполнения базы городами и кодами yandex
	[methodNames.ya.getYaStations]: function() {
		if (this.isSimulation) return true;
		this.unblock();

		const settings = getSettings('yandex');
		if (!settings) return;

		if (YaStationsFeed.findOne()) {
			return true;
		}

		try {
			const result = HTTP.get('https://api.rasp.yandex.net/v3.0/stations_list/', {
				params: {
					apikey: settings.apiKey,
					lang: 'ru_ru',
					format: 'json',
				},
			});

			if (
				result &&
				result.statusCode === 200 &&
				result.content &&
				JSON.parse(result.content).countries
			) {
				JSON.parse(result.content).countries.forEach((country) => {
					if (country.regions && country.regions.length) {
						country.regions.forEach((region) => {
							if (region.settlements && region.settlements.length) {
								region.settlements.forEach((settlement) => {
									YaStationsFeed.insert({
										country: {
											title: country.title,
											codes: country.codes,
										},
										...settlement,
									});
								});
							}
						});
					} else {
						YaStationsFeed.insert(country);
					}
				});
			}
		} catch (error) {
			return error;
		}
	},

	[methodNames.owm.update]: function(location) {
		const token = getSettings('owm');
		if (!token) return;

		if (!location) return true;
		this.unblock();

		weather.setAPPID(token.token);
		weather.setLang('ru');
		weather.setUnits('metric');
		weather.setCity(location);

		weather.getWeatherForecast(
			Meteor.bindEnvironment(function(err, res) {
				if (err || (res && res.cod !== '200')) {
					OWMFeed.update(
						{location},
						{
							$set: {
								error: true,
								//TODO Я не вижу этого поля в IOWMFeed, возможно это не работает
								message: err,
								location,
								lastUpdate: new Date(),
							},
						},
						{
							upsert: true,
						},
					);
					throw new Meteor.Error(404, err);
				}

				if (res && res.cod === '200') {
					OWMFeed.update(
						{location},
						{
							$set: {
								list: res.list,
								error: false,
								location: location,
								city: res.city,
								lastUpdate: new Date(),
							},
						},
						{
							upsert: true,
						},
					);
				}
			}),
		);

		return;
	},

	[methodNames.rss.updateFeed]: function(rssUrl) {
		if (this.isSimulation) return true;
		if (!rssUrl) return true;
		this.unblock();

		// Skip if we already have some recent feed
		const latest = RssFeed.findOne({rssUrl});
		const now = new Date();

		if (latest && now.getTime() - (latest.updatedAt?.getTime() || 0) < 1000 * 60 * 60) {
			return;
		}

		const parser = new Parser();

		parser.parseURL(
			rssUrl,
			Meteor.bindEnvironment((err, feed) => {
				if (feed && feed.items) {
					RssFeed.update(
						{rssUrl},
						{
							$set: {
								rssUrl,
								rssTitle: feed.title,
								rssDescription: feed.description,
								rssImageUrl: feed.image?.url,
								feed: feed.items.map(
									({title, content, author, enclosure, pubDate, link}: any) => ({
										title,
										content,
										pubDate,
										link,
										author,
										enclosure,
									}),
								),
								updatedAt: new Date(),
							},
							$unset: {
								error: 1,
							},
						},
						{
							upsert: true,
						},
					);
				}

				if (err) {
					Monti.trackError('rss-error', err.message);
					RssFeed.update(
						{rssUrl: rssUrl},
						{
							$set: {
								error: true,
							},
						},
						{
							upsert: true,
						},
					);
				}
			}),
		);
	},

	// Метод отправки пользователей в sendpulse
	[methodNames.sendpulse.uploadUsers]: function() {
		if (this.isSimulation) return true;
		this.unblock();

		const settings = getSettings('sendpulse');

		if (!settings) return;

		const {apiUserId, apiSecret} = settings;
		const users = Meteor.users.find().fetch();

		try {
			Sendpulse.init(apiUserId, apiSecret, Meteor.settings.tmpDir, (token: any) => {
				if (token && token.is_error) {
					// tslint:disable-next-line:no-console
					console.log('Get token error!');

					return;
				}

				const createAddressBook = (addressBook: any) => {
					if (addressBook && addressBook.id) {
						Sendpulse.addEmails(
							// tslint:disable-next-line:no-empty
							() => {},
							addressBook.id,
							users
								.filter(({emails}) => emails)
								.map(({emails, name, surname, phone, company}) => ({
									email: emails[0].address,
									variables: {name, surname, phone, company},
								})),
						);
					}
				};
				const getAddressBooks = (addressBooks: any) => {
					if (addressBooks) {
						const addressBook = addressBooks.find(
							({name}: any) => name === Meteor.settings.domain,
						);

						if (!addressBook) {
							Sendpulse.createAddressBook(createAddressBook, Meteor.settings.domain);
						}
					}
				};

				Sendpulse.listAddressBooks(getAddressBooks);
			});
		} catch (error) {
			// tslint:disable-next-line:no-console
			console.log('error: ', error);
			return error;
		}
	},

	// Метод отправки и обновления пользователя в sendpulse
	[methodNames.sendpulse.uploadUser]: function(user) {
		if (this.isSimulation || !user) return true;
		this.unblock();

		const settings = getSettings('sendpulse');

		if (!settings) return;

		const {apiUserId, apiSecret} = settings;

		try {
			Sendpulse.init(apiUserId, apiSecret, Meteor.settings.tmpDir, (token: any) => {
				if (token && token.is_error) {
					// tslint:disable-next-line:no-console
					console.log('Get token error!');

					return;
				}

				const getAddressBooks = (addressBooks: any) => {
					if (addressBooks) {
						const addressBook = addressBooks.find(
							({name}: any) => name === Meteor.settings.domain,
						);

						if (addressBook && addressBook.id) {
							const {emails, name, surname, phone, company} = user;
							const sendData = [
								{
									email: emails[0].address,
									variables: {
										name,
										surname,
										phone,
										company,
									},
								},
							];

							Sendpulse.addEmails(
								// tslint:disable-next-line:no-empty
								() => {},
								addressBook.id,
								sendData,
							);
						}
					}
				};

				Sendpulse.listAddressBooks(getAddressBooks);
			});
		} catch (error) {
			// tslint:disable-next-line:no-console
			console.log('error: ', error);
			return error;
		}
	},
});

function normolizeObject(object: any[]) {
	object.forEach((item) => {
		Object.keys(item).forEach((key) => (item[key] = item[key]._text));
	});

	return object;
}
