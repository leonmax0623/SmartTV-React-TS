import {Meteor} from 'meteor/meteor';
import {publishNames} from 'shared/constants/publishNames';
import {SlideStream} from 'shared/collections/SlideStream';

Meteor.publish(publishNames.slideStream.streams, function() {
	const userId = this.userId;
	if (userId) {
		return SlideStream.find({userId});
	}
	return this.ready();
});
Meteor.publish(publishNames.slideStream.streamById, function(streamId) {
	if (streamId) {
		return SlideStream.find({code: streamId});
	}
	return this.ready();
});
