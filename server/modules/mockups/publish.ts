import {Meteor} from 'meteor/meteor';

import {SlideMockup} from 'shared/collections/SlideMockups';
import {publishNames} from 'shared/constants/publishNames';

Meteor.publish(publishNames.mockups.userMockups, function() {
	const userId = this.userId;

	if (userId) {
		return SlideMockup.find(
			{
				$or: [{isDefault: true}, {userId}],
			},
			{sort: {createdAt: 1}},
		);
	}

	this.ready();
});

Meteor.publish(publishNames.mockups.allMockups, function() {
	if (Roles.userIsInRole(this.userId, 'admin')) {
		return SlideMockup.find({}, {sort: {createdAt: 1}});
	}

	this.ready();
});
