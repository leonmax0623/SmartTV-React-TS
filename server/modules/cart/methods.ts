import {Meteor} from 'meteor/meteor';
import {methodNames} from 'shared/constants/methodNames';
import {Cart, CartItem, ICart, ICartItem, ICartNormalized} from 'shared/collections/Cart';
import {IResponseError, IResponseSuccess} from 'shared/models/Response';
import {Random} from 'meteor/random';
import {calculateCart} from 'shared/cart/calculateCart';

/*
*
const calculatePrice = (currentOffer: IPaidServiceOfferWithPackages): IPlanPrices => {
	const packagesPrices: number[] = [];
	(Array.isArray(formData.checkedPackagesIds) ? formData.checkedPackagesIds : []).forEach(
		(packageId) => {
			const foundPackage = (Array.isArray(currentPackages) ? currentPackages : []).find(
				(packageItem) => packageItem?._id === packageId,
			);
			if (foundPackage?.price) {
				packagesPrices.push(foundPackage.price);
			}
		},
	);
	const packagesTotal = packagesPrices.reduce((a, b) => a + b, 0);

	const months = currentOffer?.months || 0;
	const price = (currentOffer?.price || 0) + packagesTotal;
	const discount = currentOffer.discount || 0;
	const priceDiscount = price - price * (discount / 100);
	const priceDiscountMonthly = priceDiscount / months;

	return {
			discount,
			price: Math.ceil(price),
			priceDiscount: Math.ceil(priceDiscount),
			priceDiscountMonthly: Math.ceil(priceDiscountMonthly),
	};
};
*
* */

Meteor.methods({
	[methodNames.cart.data](): ICartNormalized | undefined {
		const userId = this.userId;
		if (!userId) return;
		const userCart = Cart.findOne({userId});
		if (!userCart) return;

		const prices = calculateCart({packagesIds: userCart.item?.packagesIds || []});

		const data: ICart = {
			...userCart,
		};

		return data;
	},
	[methodNames.cart.updateItem]({
		serviceId,
		offerId,
		packagesIds,
		changePlanAfter,
		renew,
	}: ICartItem): IResponseSuccess | IResponseError {
		const userId = this.userId;

		if (!userId) {
			return {
				error: {
					message: 'Недостаточно прав',
				},
			};
		}

		if (!serviceId) {
			return {
				error: {
					message: 'ID услуги отсутствует',
				},
			};
		}
		if (!offerId) {
			return {
				error: {
					message: 'ID оффера отсутствует',
				},
			};
		}

		const userCart = Cart.findOne({userId});
		if (userCart) {
			const newCartItem = new CartItem({
				serviceId,
				offerId,
				packagesIds,
				changePlanAfter,
				renew,
				id: Random.id(),
			});
			userCart.item = newCartItem;
			userCart.save();
		}

		return {message: 'Корзина успещно обновлена'};
	},
	[methodNames.cart.clear]() {
		const userId = this.userId;

		if (!userId) {
			throw new Meteor.Error('Недостаточно прав');
		}

		const userCart = Cart.findOne({userId});
		userCart.item = undefined;
		userCart.save();
	},
});
