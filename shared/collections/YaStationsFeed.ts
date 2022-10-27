import {Mongo} from 'meteor/mongo';

export interface ICodes {
	yandex_code: string;
}

export interface ICountry {
	title: string;
	codes: ICodes;
}

export interface IStations {
	direction? : string;
	codes: ICodes;
	station_type: string;
	title: string;
	longitude : number;
	transport_type : string;
	latitude : number;
}

export interface IStationsFeed {
	_id?: string;
	title: string;
	country: ICountry;
	codes: ICodes;
	stations: IStations[];
}

export const YaStationsFeed = new Mongo.Collection<IStationsFeed>('yaStationsFeed');
