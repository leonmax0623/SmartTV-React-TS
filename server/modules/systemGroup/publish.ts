import {Meteor} from 'meteor/meteor';
import {publishNames} from 'shared/constants/publishNames';
import {SystemGroup} from 'shared/collections/SystemGroups';

Meteor.publish(publishNames.system_group.groups, function() {
	if (this.userId) {
		return SystemGroup.find({});
	}

	return this.ready();
});
