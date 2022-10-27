import {Mongo} from 'meteor/mongo';
import {Class} from 'meteor/jagi:astronomy';
import {
	IPaidServiceOfferWithPackages,
	IPaidServicePackagePaidServiceOfferFull,
} from 'shared/collections/PaidServices';

export interface ICartItem {
	id: string;
	serviceId: string;
	offerId: string;
	packagesIds: string[];
	changePlanAfter: boolean;
	renew?: boolean;
}
export const CartItem = Class.create<ICartItem>({
	name: 'CartItem',
	fields: {
		id: String,
		serviceId: String,
		offerId: String,
		packagesIds: [String],
		changePlanAfter: Boolean,
		renew: {
			type: Boolean,
			optional: true,
		},
	},
});
export interface ICart {
	_id: string;
	userId: string;
	createdAt: Date;
	item?: ICartItem;
}
export const Cart = Class.create<ICart>({
	name: 'Cart',
	collection: new Mongo.Collection<ICart>('cart'),
	fields: {
		userId: String,
		createdAt: Date,
		item: {
			type: CartItem,
			optional: true,
		},
	},
});
export interface ICartNormalized extends ICart {
	discount: number;
	price: number;
	priceDiscount: number;
	priceDiscountMonthly: number;
}
