import {Mongo} from 'meteor/mongo';

export interface IToken {
	_id?: string;
	service?: string;
	token?: string;
	accessToken?: string;
	apiKey?: string;
	apiUserId?: string;
	apiSecret?: string;
	createdAt?: Date;
	publicKey?: string;
	secretSessionKey?: string;
	consumer_key?: string;
	consumer_secret?: string;
	access_token_key?: string;
	access_token_secret?: string;
	accessKey?: string;
	apiUrl?: string;
	shopId?: string;
}

export const Tokens = new Mongo.Collection<IToken>('tokens');
