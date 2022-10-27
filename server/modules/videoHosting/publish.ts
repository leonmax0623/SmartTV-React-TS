import {Meteor} from 'meteor/meteor';
import {publishNames} from 'shared/constants/publishNames';
import {VideoHosting} from 'shared/collections/VideoHosting';

Meteor.publish(publishNames.videoHosting.videos, function() {
	const userId = this.userId;

	if (userId) {
		return VideoHosting.find({userId});
	}

	this.ready();
});
