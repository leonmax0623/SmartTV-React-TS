import {Meteor} from 'meteor/meteor';
import {methodNames} from 'shared/constants/methodNames';
import {PaidServiceOrder, IPaidServiceOrder} from 'shared/collections/PaidServices';

Meteor.methods({
	[methodNames.paidServices.getLastEndingOrderExpireDateByUserId](): Date | undefined {
		const userId = this.userId;
		if (!userId) return;
		const currentUserOrders = PaidServiceOrder.find({userId}, {sort: {expiredAt: -1}}).fetch();
		return currentUserOrders[0]?.expiredAt;
	},
});
