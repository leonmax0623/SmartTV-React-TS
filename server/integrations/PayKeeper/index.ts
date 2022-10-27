import {HTTP} from 'meteor/http';

import {IPayKeeperConfig, IPayKeeperInvoiceData} from 'server/integrations/PayKeeper/models';
import moment from 'moment';
import queryString from 'query-string';

export class PayKeeper {
	private readonly serverUrl: string;
	private readonly user: string;
	private readonly password: string;

	constructor({serverUrl, user, password}: IPayKeeperConfig) {
		this.serverUrl = serverUrl;
		this.user = user;
		this.password = password;
	}

	getFullUrl(uri: string): string {
		return `${this.serverUrl}/${uri}`;
	}

	getHeaders() {
		if (!this.user || !this.password) {
			throw new Error('Токен доступа PayKeeper отсутствует');
		}

		const credentials = `${this.user}:${this.password}`;
		const credentialsBase64 = Buffer.from(credentials).toString('base64');

		return {
			'Content-Type': 'application/x-www-form-urlencoded',
			Authorization: `Basic ${credentialsBase64}`,
		};
	}

	getToken() {
		const url = this.getFullUrl('info/settings/token/');

		return HTTP.call('GET', url, {
			headers: this.getHeaders(),
		});
	}

	createInvoice(data: IPayKeeperInvoiceData) {
		const tokenResponse = this.getToken();
		const token = tokenResponse.data?.token;
		if (!token) {
			throw new Error('Ошибка получения токена с PayKeeper');
		}
		const url = this.getFullUrl('change/invoice/preview/');
		const expiry = moment()
			.add(1, 'day')
			.format('YYYY-MM-DD');

		return HTTP.call('POST', url, {
			content: queryString.stringify({
				...data,
				token,
				expiry,
			}),
			headers: this.getHeaders(),
		});
	}

	getInvoiceById(invoiceId: string) {
		const url = this.getFullUrl(`/info/invoice/byid/?id=${invoiceId}`);

		return HTTP.call('GET', url);
	}
}
