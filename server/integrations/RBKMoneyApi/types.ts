export interface IRBKMoneyConfig {
	apiUrl: string;
	apiKey: string;
	shopId: string;
}

export interface IRBKMoneyInvoice {
	amount: number;
	dueDate?: Date;
	currency?: string;
	product: string;
	metadata: object;
	description?: string;
}

export interface IInvoiceMetadata {
	orderId: string;
}
export interface IIncomeInvoice {
	id: string;
	shopID: string;
	createdAt: Date;
	status: string;
	dueDate: Date;
	amount: number;
	currency: string;
	metadata: IInvoiceMetadata;
	product: string;
}

export interface IIncomeInvoiceStatus {
	eventType: string;
	eventID: number;
	occuredAt: Date;
	topic: string;
	invoice: IIncomeInvoice;
}

export enum RBKInvoiceEventTypeEnum {
	PAID = 'InvoicePaid',
}

export enum RBKInvoicePayTypeEnum {
	PAID = 'paid',
}
