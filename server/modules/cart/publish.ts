import {Meteor} from 'meteor/meteor';
import {publishNames} from 'shared/constants/publishNames';
import {Cart} from 'shared/collections/Cart';

Meteor.publish(publishNames.cart.list, function() {
	const userId = this.userId;
	if (userId) {
		const myCart = Cart.findOne({userId});
		if (!myCart) {
			const createCart = new Cart({
				userId,
				createdAt: new Date(),
			});
			createCart.save();
		}

		return Cart.find({userId});
	}

	return this.ready();
});
