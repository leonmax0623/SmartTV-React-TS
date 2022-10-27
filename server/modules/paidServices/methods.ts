import {Meteor} from 'meteor/meteor';
import {methodNames} from 'shared/constants/methodNames';
import {IMethodReturn} from 'shared/models/Methods';
import {check} from 'meteor/check';
import {IResponseError, IResponseSuccess} from 'shared/models/Response';
import {
	IPaidServiceFull,
	IPaidServiceOffer,
	IPaidServicePackage,
	IPaidServicePackagePaidServiceOffer,
	IPaidServicePackagePaidServiceOfferFull,
	IPaidServicePayment,
	PaidService,
	PaidServiceKeysEnum,
	PaidServiceOffer,
	PaidServiceOrder,
	PaidServicePackage,
	PaidServicePackagePaidServiceOffer,
	PaidServicePayment,
} from 'shared/collections/PaidServices';
import {Cart} from 'shared/collections/Cart';
import {calculateCart} from 'shared/cart/calculateCart';
import moment from 'moment';
import {
	IPayKeeperConfig,
	IPayKeeperInvoice,
	IPayKeeperInvoiceStatus,
} from 'server/integrations/PayKeeper/models';
import {PayKeeper} from 'server/integrations/PayKeeper';

const getPaymentSettings = (): IPayKeeperConfig | undefined => {
	const {serverUrl, user, password} = Meteor.settings.services.payKeeper || {};
	if (!serverUrl || !user || !password) return;

	return {
		serverUrl,
		user,
		password,
	};
};

Meteor.methods({
	[methodNames.paidServices.editService]({
		serviceId,
		title: newTitle,
		description: newDescription,
	}: {
		serviceId: string;
		title: string;
		description: string;
	}): IMethodReturn {
		check(serviceId, String);
		check(newTitle, String);
		check(newDescription, String);
		if (!this.userId) {
			return {status: false, message: 'Недостаточно прав'};
		}

		if (!newTitle.trim()) {
			return {status: false, message: 'Название услуги не может быть пустым'};
		}
		if (!newDescription.trim()) {
			return {status: false, message: 'Описание услуги не может быть пустым'};
		}

		const foundService = PaidService.findOne({_id: serviceId});

		if (!foundService) {
			return {status: false, message: 'Услуга не найдена'};
		}

		if (
			foundService.title === newTitle.trim() &&
			foundService.description === (newDescription || '').trim()
		) {
			return {status: false, message: 'Нет изменений'};
		}

		foundService.title = newTitle;
		foundService.description = newDescription;
		foundService.save();

		return {status: true, message: 'Услуга успешно добавлена'};
	},
	[methodNames.paidServices.resetDefaultSelectedOffer]() {
		PaidServiceOffer.update({defaultSelected: {$eq: true}}, {$set: {defaultSelected: false}});
	},
	[methodNames.paidServices.addOffer]({
		serviceId: paidServiceId,
		title,
		months,
		price,
		discount,
		defaultSelected,
	}: {
		serviceId: string;
		title: string;
		months: number;
		price: number;
		discount: number;
		defaultSelected: boolean;
	}): IMethodReturn {
		if (!paidServiceId) {
			return {status: false, message: 'ID услуги не может быть пустым'};
		}
		if (!months || months <= 0) {
			return {status: false, message: 'Неверное значение'};
		}
		if (price < 0) {
			return {status: false, message: 'Неверное значение'};
		}
		if (discount && discount <= 0) {
			return {status: false, message: 'Неверное значение'};
		}

		const foundService = PaidService.findOne({_id: paidServiceId});
		if (!foundService) {
			return {status: false, message: 'Услуга не найдена'};
		}

		if (defaultSelected) {
			Meteor.call(methodNames.paidServices.resetDefaultSelectedOffer);
		}

		const paidServiceDuration = new PaidServiceOffer({
			paidServiceId,
			title,
			months,
			defaultSelected,
			price: price || 0,
			discount: discount || 0,
		});
		paidServiceDuration.save();

		return {status: true, message: ''};
	},
	[methodNames.paidServices.updateOffer]({
		_id,
		title,
		months,
		price,
		discount,
		defaultSelected,
	}: IPaidServiceOffer): IMethodReturn {
		check(_id, String);
		check(title, String);
		check(months, Number);
		check(price, Number);
		check(discount, Number);

		if (!_id) {
			return {status: false, message: 'ID оффера не может быть пустым'};
		}
		if (!title) {
			return {status: false, message: 'Заголовок не может быть пустым'};
		}
		if (!months || months <= 0) {
			return {status: false, message: 'Продолжительность не может быть пустым'};
		}
		if (price < 0) {
			return {status: false, message: 'Неверное значение'};
		}
		if (discount && discount <= 0) {
			return {status: false, message: 'Неверное значение'};
		}
		const foundOffer = PaidServiceOffer.findOne({_id});

		if (!foundOffer) {
			return {status: false, message: 'Оффер с таким ID не найдено'};
		}

		if (defaultSelected) {
			Meteor.call(methodNames.paidServices.resetDefaultSelectedOffer);
		}

		foundOffer.title = title;
		foundOffer.months = months;
		foundOffer.price = price;
		foundOffer.discount = discount;
		foundOffer.defaultSelected = defaultSelected;
		foundOffer.save();

		return {status: true, message: ''};
	},
	[methodNames.paidServices.deleteOffer](serviceDurationId: string): IMethodReturn {
		check(serviceDurationId, String);
		if (!serviceDurationId) {
			return {status: false, message: 'ID цены не может быть пустым'};
		}
		const foundPaidServiceDuration = PaidServiceOffer.findOne({_id: serviceDurationId});

		if (!foundPaidServiceDuration) {
			return {status: false, message: 'Цена с таким ID не найдено'};
		}
		foundPaidServiceDuration.remove();

		return {status: true, message: ''};
	},
	[methodNames.paidServices.editPackage]({
		_id,
		title,
	}: {
		_id: string;
		title: string;
	}): IResponseSuccess | IResponseError {
		check(_id, String);
		check(title, String);
		if (!_id) {
			return {
				error: {
					message: 'ID пакета не передано',
				},
			};
		}
		if (!title || (title && !title.trim())) {
			return {
				error: {
					fields: {
						title: 'Введите заголовок',
					},
				},
			};
		}
		const foundPackage = PaidServicePackage.findOne({_id});
		if (!foundPackage) {
			return {
				error: {
					message: 'Такой пакет не найден',
				},
			};
		}
		foundPackage.title = title;
		foundPackage.save();

		return {message: 'Пакет успешно сохранен'};
	},
	[methodNames.paidServices.addPackageToOffer]({
		offerId,
		packageId,
		price,
	}: {
		offerId: string;
		packageId: string;
		price: string;
	}): IResponseSuccess | IResponseError {
		check(offerId, String);
		check(packageId, String);
		check(price, Number);
		if (!offerId) {
			return {
				error: {
					message: 'ID оффера не передан',
				},
			};
		}
		if (!packageId) {
			return {
				error: {
					message: 'ID пакета не передан',
				},
			};
		}
		if (!price) {
			return {
				error: {
					message: 'Цена пакета для данного оффера не передана',
				},
			};
		}
		const existingOfferPackage = PaidServicePackagePaidServiceOffer.findOne({
			paidServiceOfferId: offerId,
			paidServicePackageId: packageId,
		});
		if (existingOfferPackage) {
			return {
				error: {
					message: 'Этот пакет уже добавлен',
				},
			};
		}
		const offerPackage = new PaidServicePackagePaidServiceOffer({
			price,
			paidServiceOfferId: offerId,
			paidServicePackageId: packageId,
		});
		offerPackage.save();

		return {message: 'Пакет успешно добавлен в оффер'};
	},
	[methodNames.paidServices.removePackageFromOffer](
		offerPackageId: string,
	): IResponseSuccess | IResponseError {
		check(offerPackageId, String);
		if (!offerPackageId) {
			return {
				error: {
					message: 'ID пакета не передан',
				},
			};
		}
		const foundOfferPackage = PaidServicePackagePaidServiceOffer.findOne({_id: offerPackageId});
		if (!foundOfferPackage) {
			return {
				error: {
					message: 'Такой пакет не найден',
				},
			};
		}
		foundOfferPackage.remove();

		return {message: 'Пакет успешно удален'};
	},
	[methodNames.paidServices.createOrder](): IPaidServicePayment | IResponseError {
		const userId = this.userId;
		if (!userId) {
			return {
				error: {
					message: 'Недостаточно прав',
				},
			};
		}

		const paymentConfig = getPaymentSettings();
		if (!paymentConfig) {
			return {
				error: {
					message: 'Ошибка связи с банком',
				},
			};
		}

		const PaymentApi = new PayKeeper(paymentConfig);

		const userCart = Cart.findOne({userId});

		if (!userCart?.item) {
			return {
				error: {
					message: 'Корзина пустая',
				},
			};
		}
		const cartItem = userCart.item;
		const paidService = PaidService.findOne({key: PaidServiceKeysEnum.PREMIUM});

		const offer = PaidServiceOffer.findOne({_id: cartItem.offerId});
		if (!offer || !offer?.months) {
			return {
				error: {
					message: 'Оффер не существует',
				},
			};
		}
		const packageList = PaidServicePackagePaidServiceOffer.find({
			_id: {$in: cartItem.packagesIds},
		}).fetch();

		const cartPrices = calculateCart({offer, packageList, packagesIds: cartItem.packagesIds});

		const order = new PaidServicePayment({
			userId,
			paidService,
			offer,
			packages: packageList,
			price: cartPrices.price,
			priceDiscount: cartPrices.priceDiscount,
			priceDiscountMonthly: cartPrices.priceDiscountMonthly,
			discount: cartPrices.discount,
			invoiceId: '',
			invoiceUrl: '',
			changePlanAfter: cartItem.changePlanAfter,
			renew: cartItem.renew,
		});
		order.save();
		const orderId = order.get('_id');
		const sumPenny = cartPrices.priceDiscount; // В копейках;

		const invoiceResult = PaymentApi.createInvoice({
			pay_amount: sumPenny,
			clientid: userId,
			orderid: orderId,
			service_name: 'Оплата услуг на PRTV',
		});
		if (!invoiceResult || !invoiceResult.data.invoice_id || !invoiceResult.data.invoice_url) {
			return {
				error: {
					message: 'Ошибка оформления заказа',
				},
			};
		}

		order.set('invoiceUrl', invoiceResult.data.invoice_url);
		order.set('invoiceId', invoiceResult.data.invoice_id);
		order.save();

		return order;
	},
	[methodNames.paidServices.checkInvoiceStatus](invoiceID: string) {
		const paymentConfig = getPaymentSettings();
		if (!paymentConfig) {
			return {
				error: {
					message: 'Ошибка связи с банком',
				},
			};
		}

		const PaymentApi = new PayKeeper(paymentConfig);
		const response = PaymentApi.getInvoiceById(invoiceID);
		if (!response?.data) {
			return {
				error: {
					message: 'Ошибка связи с банком',
				},
			};
		}
		const invoice: IPayKeeperInvoice = response.data;

		return invoice;
	},
	[methodNames.paidServices.isInvoicePayed](invoiceID: string): boolean {
		const invoice = Meteor.call(methodNames.paidServices.checkInvoiceStatus, invoiceID);

		if (!invoice) return false;
		if (invoice.error) return false;

		if (invoice.status === IPayKeeperInvoiceStatus.paid) {
			/**
			 * В случае, если webhook не сработает, т.е. если банк не сможет нас уведомить о состоянии платежа
			 * во время проверки статуса подтверждаем, если счет уже оплачен
			 */
			try {
				Meteor.call(methodNames.paidServices.verifyPayment, {invoice: {id: invoiceID}});
			} catch (e) {
				console.warn('платеж, возможно уже активирован');
			}

			return true;
		}

		return false;
	},
	[methodNames.paidServices.verifyPayment](orderId: string) {
		if (!Meteor.isServer) {
			return {
				error: {
					message: 'Недостаточно прав',
				},
			};
		}
		if (!orderId) {
			return {
				error: {
					message: 'Идентификатор заказа не найден',
				},
			};
		}

		const currentPayment = PaidServicePayment.findOne({_id: orderId});
		const paymentUserId = currentPayment.userId;
		if (!currentPayment) {
			return {
				error: {
					message: 'Заказ не найден',
				},
			};
		}
		const paymentId = currentPayment.get('_id');

		const foundOrderCount = PaidServiceOrder.find({paymentId}).count();
		if (foundOrderCount) {
			return {
				error: {
					message: 'Этот платеж уже использован',
				},
			};
		}

		currentPayment.paid = true;

		const {
			userId,
			paidService,
			offer,
			packages,
			paid,
			price,
			priceDiscount,
			priceDiscountMonthly,
			discount,
			changePlanAfter,
			renew,
		} = currentPayment;

		const permissions: string[] = [];
		packages.forEach((paidServicePackage) => {
			const originalPackages = PaidServicePackage.findOne({
				_id: paidServicePackage.paidServicePackageId,
			});
			const key = originalPackages?.key;
			if (key) {
				permissions.push(key);
			}
		});

		if (renew) {
			const currentOrder = PaidServiceOrder.findOne({userId}, {sort: {expiredAt: -1}});
			currentOrder.expiredAt = moment(currentOrder.expiredAt)
				.add(offer.months, 'months')
				.toDate();
			currentOrder.save();
		} else {
			const lastEndingUserOrderExpireDate = Meteor.call(
				methodNames.paidServices.getLastEndingOrderExpireDateByUserId,
			);
			let startedAt = new Date();
			if (lastEndingUserOrderExpireDate && changePlanAfter) {
				startedAt = moment(lastEndingUserOrderExpireDate).toDate();
			}
			const expiredAt = moment(startedAt)
				.add(offer.months, 'months')
				.toDate();

			const newOrder = new PaidServiceOrder({
				userId,
				paymentId,
				paidService,
				offer,
				packages,
				paid,
				price,
				priceDiscount,
				priceDiscountMonthly,
				discount,
				startedAt,
				expiredAt,
				changePlanAfter,
				permissions,
			});
			newOrder.save();
		}

		return {message: 'Заказ успешно оплачен'};
	},
	[methodNames.paidServices.getUserPermissions](userId: string) {
		if (!userId) return [];

		const userOrders = PaidServiceOrder.find(
			{userId, expiredAt: {$gt: new Date()}},
			{sort: {expiredAt: 1}},
		).fetch();

		const permissions: string[] = [];
		(Array.isArray(userOrders) ? userOrders : []).forEach((order) => {
			(Array.isArray(order.permissions) ? order.permissions : []).forEach((permission) => {
				permissions.push(permission);
			});
		});

		return permissions;
	},
	[methodNames.paidServices.isGranted](
		permission: string | string[],
		uId?: string,
	): {[key: string]: boolean} {
		const userId = uId || this.userId;
		const permissionsList = Meteor.call(methodNames.paidServices.getUserPermissions, userId);

		if (!permissionsList?.length) return {};

		if (typeof permission === 'string') {
			return {
				[permission]: permissionsList.includes(permission),
			};
		}

		const result = {};

		permission.forEach((permissionItem) => {
			result[permissionItem] = permissionsList.includes(permissionItem);
		});

		return result;
	},
});
