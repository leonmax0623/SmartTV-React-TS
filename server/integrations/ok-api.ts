import {HTTP} from 'meteor/http';
import crypto from 'crypto';

const objectToQuery = (query, prefix = '') =>
	Object.keys(query)
		.sort()
		.reduce((str, key) => {
			return str + `${prefix}${key}=${query[key]}`;
		}, '');

export class OKApi {
	constructor({publicKey, accessToken, secretSessionKey}) {
		this.publicKey = publicKey;
		this.accessToken = accessToken;
		this.secretSessionKey = secretSessionKey;
		this.apiUrl = 'https://api.ok.ru/fb.do';

		this.defaultQuery = {
			application_key: this.publicKey,
			format: 'json',
		};
	}

	getWall(groupId, count) {
		const method = 'stream.get';
		const patterns = 'POST';
		const fields = 'feed.*, media_topic.*, group_photo.*, video.*';
		const query = {
			...this.defaultQuery,
			count,
			fields,
			gid: groupId,
			method,
			patterns,
		};

		const sig = this.createSig(query);

		return this.makeRequest({...query, sig});
	}

	groupGetInfo(groupId) {
		const method = 'group.getInfo';
		const fields = 'name';

		const query = {
			...this.defaultQuery,
			uids: groupId,
			fields,
			method,
		};

		const sig = this.createSig(query);

		return this.makeRequest({...query, sig});
	}

	urlInfo(url) {
		const method = 'url.getInfo';
		const query = {
			...this.defaultQuery,
			method,
			url,
		};

		const sig = this.createSig(query);

		return this.makeRequest({...query, sig});
	}

	createSig(query) {
		const str = objectToQuery(query);
		return crypto
			.createHash('md5')
			.update(`${str}${this.secretSessionKey}`)
			.digest('hex');
	}

	makeRequest(query) {
		const params = {...query, access_token: this.accessToken};

		return HTTP.call('GET', this.apiUrl, {params});
	}
}
