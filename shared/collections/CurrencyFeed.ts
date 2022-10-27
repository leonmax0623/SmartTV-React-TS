import {Mongo} from 'meteor/mongo';

import {SlideElementCurrenciesEnum} from 'shared/collections/SlideElements';

export interface ICurrencyItem {
	NumCode: number;
	CharCode: SlideElementCurrenciesEnum;
	Nominal: number;
	Name: string;
	Value: string;
}

export interface ICurrencyFeed {
	_id?: string;
	tomorrow: {
		currency: ICurrencyItem[];
		date: Date;
	};
	today: {
		currency: ICurrencyItem[];
		date: Date;
	};
	updatedAt: Date;
}

export const CurrencyFeed = new Mongo.Collection<ICurrencyFeed>('сurrency-feed');
