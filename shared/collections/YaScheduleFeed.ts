import {Mongo} from 'meteor/mongo';

export interface IYaSearchPoint {
	code: string;
	type: string;
	popular_title?: string;
	short_title?: string;
	title: string;
	station_type?: string;
	transport_type?: string;
	station_type_name?: string;
}

export interface IYaSearch {
	date: Date;
	to: IYaSearchPoint;
	from: IYaSearchPoint;
}

export interface IYaSegments {
	arrival: Date;
	from: IYaSearchPoint;
	thread: {
		uid: string;
		title: string;
		number: string;
		short_title: string;
		thread_method_link: string;
		carrier: {
			code?: number;
			contacts?: string;
			url?: string;
			logo_svg?: string;
			title?: string;
			phone?: string;
			codes: {
				icao?: string;
				sirena?: string;
				iata?: string;
			};
			address?: string;
			logo?: string;
			email?: string;
		};
		transport_type?: string;
		vehicle?: string;
		transport_subtype: {
			color?: string;
			code?: string;
			title?: string;
		};
		express_type: string;
	};
	departure_platform?: string;
	departure: Date;
	stops?: string;
	departure_terminal?: string;
	to: IYaSearchPoint;
	has_transfers: boolean;
	tickets_info?: string;
	duration: number;
	arrival_terminal?: string;
	start_date: Date;
	arrival_platform?: string;
}

export interface IYaScheduleFeed {
	_id?: string;
	from: string;
	to: string;
	transport: string;
	date: Date;
	lastUpdate: Date;
	search: IYaSearch;
	segments: IYaSegments[];
	errorMessage?: string;
}

export const YaScheduleFeed = new Mongo.Collection<IYaScheduleFeed>('yaScheduleFeed');
