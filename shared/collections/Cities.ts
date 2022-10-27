import {Mongo} from 'meteor/mongo';

export interface IWeatherItem {
	dayPart: string;
	temperature?: number;
	temperatureFrom?: number;
	temperatureTo?: number;
	weatherType?: string;
	weatherCode?: string;
	humidity?: string;
	pressure?: string;
	windSpeed?: string;
}

export interface ITraffic {
	level?: string;
	hint?: string;
}

export interface IWeatherDB {
	weather: IWeatherItem[];
	traffic: ITraffic;
	updatedAt: Date;
	expire: Date;
}

export interface ICity {
	_id?: string;
	timezone?: string;
	lat?: string;
	lon?: string;
	utcoffset?: string;
	name?: string;
	yid?: string;
	lock?: boolean;
	expire?: Date;
	weather?: IWeatherItem[];
	traffic?: ITraffic;
}

export const CitiesCollection = new Mongo.Collection<ICity>('cities');

if (Meteor.isServer) {
	CitiesCollection._ensureIndex({name: 1});
}
