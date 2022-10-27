import {Meteor} from 'meteor/meteor';
import {xml2js} from 'xml-js';
import each from 'lodash/each';

import {
	CitiesCollection,
	IWeatherDB,
	ICity,
	IWeatherItem,
	ITraffic,
} from 'shared/collections/Cities';
import {methodNames} from 'shared/constants/methodNames';

interface IUpdateDataResult {
	content?: string;
	statusCode: number;
}

Meteor.methods({
	// Add page
	[methodNames.cities.getInfo]: (regionId, callback, always) => {
		// No client due to crossdomain XML request
		if (Meteor.isServer) {
			try {
				let result = HTTP.get(
					`https://export.yandex.ru/bar/reginfo.xml?region=${regionId}`,
				);

				typeof callback === 'function' && callback(null, result);

				return;
			} catch (e) {
				callback(e, null);

				return false;
			} finally {
				typeof always === 'function' && always();
			}
		}
	},

	[methodNames.cities.update]: (name: string) => {
		const updateData = (
			result: IUpdateDataResult,
			callback: (err?: boolean, db?: IWeatherDB) => void,
		) => {
			// TODO разобраться с отсутствующим типом метода
			let json = xml2js.parseStringSync(result);
			// Data seems good
			let weatherParent = json.info.weather[0],
				weather = weatherParent ? weatherParent.day[0].day_part : undefined,
				trafficNode = json.info.traffic[0];

			let parts = [],
				keysToLoad = {
					pressure: 'pressure',
					dampness: 'dampness',
					wind_speed: 'windSpeed',
				};

			if (weather) {
				// weather parts
				for (let j = 0; j < weather.length; j++) {
					let item: IWeatherItem = {
						dayPart: weather[j].$.type,
					};

					// Exact temperature or an interval
					if (weather[j].temperature) {
						item.temperature = parseInt(weather[j].temperature[0]._);
					} else if (weather[j].temperature_from && weather[j].temperature_to) {
						item.temperatureFrom = parseInt(weather[j].temperature_from[0]._);
						item.temperatureTo = parseInt(weather[j].temperature_to[0]._);
					}

					if (weather[j].weather_type && weather[j].weather_code) {
						item.weatherType = weather[j].weather_type[0];
						item.weatherCode = weather[j].weather_code[0];
					}

					each(weather[j], (val, key) => {
						if (!keysToLoad[key]) {
							return;
						}

						item[keysToLoad[key]] = parseInt(val[0]);
					});
					parts.push(item);
				}
			}

			// also save traffic
			let traffic: ITraffic = {};
			if (trafficNode) {
				traffic.level = trafficNode.region[0].level[0];
				traffic.hint = trafficNode.region[0].hint[0]._;
			}

			let now = new Date();
			const db: IWeatherDB = {
				weather: parts,
				traffic,
				updatedAt: now,
				expire: new Date(now.getTime() + 4 * 60 * 60000),
			};

			typeof callback === 'function' && callback(null, db);
		};

		// Case insensetive query
		// let query = { name: { $regex: new RegExp('^' + name, 'i') } };
		let query = {name: name};
		let city: ICity = CitiesCollection.findOne(query);

		let now = new Date();
		if (!city) throw new Error('Город ' + name + ' не найден');
		// Already updating
		if (city.lock) return false;
		// Still relevant
		if (city.expire && city.expire.getTime() > now.getTime()) {
			return false;
		}

		// Lock up
		CitiesCollection.upsert(query, {$set: {lock: true}});

		Meteor.call(
			'cities.getYandexCityInfo',
			city.yid,
			(err, result) => {
				if (result && result.content && result.statusCode === 200) {
					updateData(result.content, (err, db) => {
						// Finally store the data
						CitiesCollection.upsert(query, {$set: db});
					});
				} else if (err) {
					throw new Error(`Ошибка получения данных города: ${err}`);
				}
			},
			() => {
				// Unlock
				CitiesCollection.update(query, {$unset: {lock: true}});
			},
		);

		return false;
	},
});
