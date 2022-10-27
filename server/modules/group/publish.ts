import {Meteor} from 'meteor/meteor';
import {publishNames} from 'shared/constants/publishNames';
import {Group} from 'shared/collections/Groups';

Meteor.publish(publishNames.group.groups, function() {
	if (this.userId) {
		return Group.find({userId: this.userId});
	}

	return this.ready();
});
