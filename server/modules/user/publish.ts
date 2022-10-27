import {Meteor} from 'meteor/meteor';
import {check} from 'meteor/check';
import {publishNames} from 'shared/constants/publishNames';

function userSearchSelector(searchText?: string) {
	if (!searchText || searchText === undefined) {
		return {};
	}
	const query = {
		$or: [
			{_id: searchText},
			{
				name: {
					$regex: searchText,
					$options: 'i',
				},
			},
			{
				company: {
					$regex: searchText,
					$options: 'i',
				},
			},
			{
				'emails.address': {
					$regex: searchText,
					$options: 'i',
				},
			},
		],
	};
	return query;
}

Meteor.publish(publishNames.user.users, function({search}) {
	const userId = this.userId;
	if (userId && Roles.userIsInRole(userId, 'admin')) {
		let query = {};
		if (search?.length > 0) {
			check(search, String);
			query = {
				$and: [{...userSearchSelector(search)}],
			};
		}
		return Meteor.users.find(query, {limit: 10});
	}
	return this.ready();
});

Meteor.publish(publishNames.user.oneUserProfile, function(userId) {
	const adminId = this.userId;
	if (userId && Roles.userIsInRole(adminId, 'admin')) {
		return Meteor.users.find({_id: userId});
	}
	return this.ready();
});

// User's profile (used in login, signup and profile editor)
Meteor.publish(publishNames.user.userProfile, function() {
	// Only return few fields
	const options = {
		fields: {
			status: 1,
			address: 1,
			name: 1,
			surname: 1,
			phone: 1,
			company: 1,
			'projectServices.google.expires_in': 1,
			'projectServices.vk.expires_in': 1,
			'projectServices.vk.user_id': 1,
			'projectServices.facebook.expires_in': 1,
			'projectServices.twitter.user_id': 1,
			fbPages: 1,
			slideShowGroups: 1,
			planId: 1,
		},
	};

	return Meteor.users.find({_id: this.userId}, options);
});

Meteor.publish(publishNames.user.userServices, (userId) => {
	// Only return few fields
	const options = {
		fields: {
			'projectServices.google.expires_in': 1,
			'projectServices.google.access_token': 1,
			'projectServices.vk.expires_in': 1,
			'projectServices.vk.user_id': 1,
			'projectServices.facebook.expires_in': 1,
			'projectServices.twitter.user_id': 1,
		},
	};

	return Meteor.users.find({_id: userId}, options);
});
