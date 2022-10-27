import {Mongo} from 'meteor/mongo';

export interface IOWMWeather {
	id: number;
	main: string;
	description: string;
	icon: string;
}

export interface IOWMFeedItem {
	dt: number;
	interval?: number;
	main: {
		temp: number;
		temp_min: number;
		temp_max: number;
		pressure: number;
		sea_level: number;
		grnd_level: number;
		humidity: number;
		temp_kf: number;
	};
	weather: IOWMWeather[];
	clouds: {
		all: number;
	};
	wind: {
		speed: number;
		deg: number;
	};
	snow: {
		'3h': number;
	};
	sys: {
		pod: string;
	};
	dt_txt: string;
}

export interface IOWMFeed {
	_id?: string;
	location: string;
	city: {
		id: number;
		name: string;
		coord: {
			lat: number;
			lon: number;
		};
		country: string;
		population: number;
	};
	error?: boolean;
	lastUpdate: Date;
	list: IOWMFeedItem[];
}

export const OWMFeed = new Mongo.Collection<IOWMFeed>('owm_feed');
