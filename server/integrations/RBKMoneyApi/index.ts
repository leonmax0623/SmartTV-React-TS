import {IRBKMoneyConfig, IRBKMoneyInvoice} from 'server/integrations/RBKMoneyApi/types';
import {HTTP} from 'meteor/http';
import moment from 'moment';

export class RBKMoneyApi {
	private apiUrl: string;
	private apiKey: string;
	private shopId: string;
	public apiEndpoints: {
		[key: string]: {
			method: string;
			url: (key?: string) => string;
		};
	};

	constructor({apiUrl, apiKey, shopId}: IRBKMoneyConfig) {
		this.apiUrl = apiUrl;
		this.apiKey = apiKey;
		this.shopId = shopId;

		this.apiEndpoints = {
			createInvoice: {
				method: 'POST',
				url: () => '/processing/invoices',
			},
			getInvoiceById: {
				method: 'GET',
				url: (invoiceID) => `/processing/invoices/${invoiceID}`,
			},
		};
	}

	createUrl(path: string) {
		return `${this.apiUrl}${path}`;
	}

	buildHeaders({Token}: {Token?: string} = {Token: this.apiKey}) {
		const now = new Date();

		return {
			'X-Request-ID': now.getTime(),
			Authorization: `Bearer ${Token}`,
			'Content-Type': 'application/json; charset=utf-8',
		};
	}

	getInvoiceById(invoiceID: string) {
		if (!invoiceID) {
			throw new Meteor.Error('Идентификатор инвойса отсутствует');
		}
		const {method, url} = this.apiEndpoints.getInvoiceById;

		return HTTP.call(method, this.createUrl(url(invoiceID)), {
			headers: this.buildHeaders(),
		});
	}
	createInvoice(data: IRBKMoneyInvoice) {
		const {url, method} = this.apiEndpoints.createInvoice;
		const dueDate = moment()
			.add(15, 'minutes')
			.format();

		return HTTP.call(method, this.createUrl(url()), {
			data: {
				dueDate,
				currency: 'RUB',
				shopID: this.shopId,
				...data,
			},
			headers: this.buildHeaders(),
		});
	}
}
