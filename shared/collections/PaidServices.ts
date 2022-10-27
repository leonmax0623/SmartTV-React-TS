import {Mongo} from 'meteor/mongo';
import {Class} from 'meteor/jagi:astronomy';

/**
 * Тарифы
 */

export enum PaidServiceKeysEnum {
	DEMO = 'demo',
	PREMIUM = 'premium',
}
export const PaidServicesInitialData = {
	[PaidServiceKeysEnum.DEMO]: {
		key: PaidServiceKeysEnum.DEMO,
		title: 'Демо',
		description: 'Все функции станут доступны на 1 месяц',
	},
	[PaidServiceKeysEnum.PREMIUM]: {
		key: PaidServiceKeysEnum.PREMIUM,
		title: 'Премиум',
		description:
			'Премиум тариф открывает новые возможности для представления вашего бизнеса в оффлайне',
	},
};

export interface IPaidService {
	_id: string;
	title: string;
	key: PaidServiceKeysEnum;
	description: string;
}

export const PaidService = Class.create<IPaidService>({
	name: 'PaidService',
	collection: new Mongo.Collection<IPaidService>('paidService'),
	fields: {
		title: String,
		key: String,
		description: String,
	},
});

/**
 * Офферы
 */
export interface IPaidServiceOffer {
	_id: string;
	paidServiceId: string;
	title: string;
	months: number;
	price: number;
	discount: number;
	defaultSelected?: boolean;
}
export interface IPaidServiceWithOffer extends IPaidService {
	offers: IPaidServiceOffer[];
}
export interface IPaidServiceFull extends IPaidService {
	offers: IPaidServiceOfferWithPackages[];
}
export interface IPaidServiceOfferWithPackages extends IPaidServiceOffer {
	packagesList: IPaidServicePackagePaidServiceOfferFull[];
}
export const PaidServiceOffer = Class.create<IPaidServiceOffer>({
	name: 'PaidServiceOffer',
	collection: new Mongo.Collection<IPaidServiceOffer>('paidServiceOffer'),
	fields: {
		paidServiceId: String,
		title: String,
		months: Number,
		price: Number,
		discount: Number,
		defaultSelected: {
			type: Boolean,
			optional: true,
		},
	},
});

/*
IPaidServiceFull: {
	...PaidService: IPaidService
	offers(IPaidServiceOfferWithPackages): [
		{
			...PaidServiceOffer: IPaidServiceOffer
			packagesList(IPaidServicePackagePaidServiceOfferFull): [
				{
					...PaidServicePackagePaidServiceOffer: IPaidServicePackagePaidServiceOffer
					paidServicePackage: IPaidServicePackage;
				}
			]
		}
	]
}
*/

/**
 * Пакеты
 */

export enum PaidServicePackagesEnum {
	VIDEO_HOSTING = 'VIDEO_HOSTING', // Видеохостинг
	SLIDESHOW_STREAM = 'SLIDESHOW_STREAM', // Запуск слайд-шоу по расписанию
	STATISTICS = 'STATISTICS', // Сбор и просмотр статистики по элементам
}

export const PaidServicePackagesInitialData = {
	[PaidServicePackagesEnum.VIDEO_HOSTING]: {
		key: PaidServicePackagesEnum.VIDEO_HOSTING,
		title: 'Видеохостинг',
	},
	[PaidServicePackagesEnum.SLIDESHOW_STREAM]: {
		key: PaidServicePackagesEnum.SLIDESHOW_STREAM,
		title: 'Запуск слайд-шоу по расписанию',
	},
	[PaidServicePackagesEnum.STATISTICS]: {
		key: PaidServicePackagesEnum.STATISTICS,
		title: 'Сбор и просмотр статистики по элементам',
	},
};

export interface IPaidServicePackage {
	_id: string;
	title: string;
	key: string;
}
export const PaidServicePackage = Class.create<IPaidServicePackage>({
	name: 'PaidServicePackage',
	collection: new Mongo.Collection<IPaidServicePackage>('paidServicePackage'),
	fields: {
		title: String,
		key: String,
	},
});

/**
 * Добавление пакеты к офферу
 */
export interface IPaidServicePackagePaidServiceOffer {
	_id: string;
	paidServiceOfferId: string;
	paidServicePackageId: string;
	price: number;
}
export interface IPaidServicePackagePaidServiceOfferFull
	extends IPaidServicePackagePaidServiceOffer {
	paidServicePackage: IPaidServicePackage;
}
export const PaidServicePackagePaidServiceOffer = Class.create<IPaidServicePackagePaidServiceOffer>(
	{
		name: 'PaidServicePackagePaidServiceOffer',
		collection: new Mongo.Collection<IPaidServicePackagePaidServiceOffer>(
			'paidServicePackagePaidServiceOffer',
		),
		fields: {
			paidServiceOfferId: String,
			paidServicePackageId: String,
			price: Number,
		},
	},
);

/**
 * Заказы
 */
export interface IPaidServiceOrder {
	_id: string;
	userId: string;
	paymentId: string;
	paidService: IPaidService;
	offer: IPaidServiceOffer;
	packages: IPaidServicePackagePaidServiceOffer[];
	paid: boolean;
	price: number;
	priceDiscount: number;
	priceDiscountMonthly: number;
	discount: number;
	startedAt: Date;
	expiredAt: Date;
	changePlanAfter: boolean;
	renew?: boolean;
	permissions?: string[];
}
export const PaidServiceOrder = Class.create<IPaidServiceOrder>({
	name: 'PaidServiceOrder',
	collection: new Mongo.Collection<IPaidServiceOrder>('paidServiceOrder'),
	fields: {
		userId: String,
		paymentId: String,
		paidService: PaidService,
		offer: PaidServiceOffer,
		packages: [PaidServicePackagePaidServiceOffer],
		paid: Boolean,
		price: Number,
		priceDiscount: Number,
		priceDiscountMonthly: Number,
		discount: Number,
		startedAt: Date,
		expiredAt: Date,
		changePlanAfter: Boolean,
		renew: {
			type: Boolean,
			optional: true,
		},
		permissions: {
			type: [String],
			optional: true,
		},
	},
});

/**
 * Оплата
 */
export interface IPaidServicePayment {
	_id: string;
	paid: boolean;
	userId: string;
	paidService: IPaidService;
	offer: IPaidServiceOffer;
	packages: IPaidServicePackagePaidServiceOffer[];
	price: number;
	priceDiscount: number;
	priceDiscountMonthly: number;
	discount: number;
	invoiceId: string;
	invoiceUrl: string;
	changePlanAfter: boolean;
	renew?: boolean;
}
export const PaidServicePayment = Class.create<IPaidServicePayment>({
	name: 'paidServicePayment',
	collection: new Mongo.Collection<IPaidServicePayment>('paidServicePayment'),
	fields: {
		paid: {
			type: Boolean,
			default: false,
		},
		userId: String,
		paidService: PaidService,
		offer: PaidServiceOffer,
		packages: [PaidServicePackagePaidServiceOffer],
		price: Number,
		priceDiscount: Number,
		priceDiscountMonthly: Number,
		discount: Number,
		invoiceId: String,
		invoiceUrl: String,
		changePlanAfter: Boolean,
		renew: {
			type: Boolean,
			optional: true,
		},
	},
});

export enum PaidServicePaymentKeysEnum {
	CARD_ONLINE = 'CARD_ONLINE',
	INVOICE = 'INVOICE',
}
