import {Meteor} from 'meteor/meteor';
import {publishNames} from 'shared/constants/publishNames';
import {
	PaidService,
	PaidServiceOffer,
	PaidServiceOrder,
	PaidServicePackage,
	PaidServicePackagePaidServiceOffer,
} from 'shared/collections/PaidServices';

Meteor.publish(publishNames.paidServices.services, function() {
	if (this.userId) {
		return PaidService.find({});
	}

	return this.ready();
});

Meteor.publish(publishNames.paidServices.serviceOffers, function() {
	if (this.userId) {
		return PaidServiceOffer.find({});
	}

	return this.ready();
});

Meteor.publish(publishNames.paidServices.packages, function() {
	if (this.userId) {
		return PaidServicePackage.find({});
	}

	return this.ready();
});

Meteor.publish(publishNames.paidServices.offerPackages, function() {
	if (this.userId) {
		return PaidServicePackagePaidServiceOffer.find({});
	}

	return this.ready();
});

Meteor.publish(publishNames.paidServices.orders, function() {
	const userId = this.userId;
	if (userId) {
		return PaidServiceOrder.find(
			{userId, expiredAt: {$gte: new Date()}},
			{sort: {expiredAt: 1}},
		);
	}

	return this.ready();
});
