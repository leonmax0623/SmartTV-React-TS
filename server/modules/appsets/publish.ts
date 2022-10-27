import {Meteor} from 'meteor/meteor';

import {AppSets} from 'shared/collections/AppSets';
import {Slideshow} from 'shared/collections/Slideshows';
import {publishNames} from 'shared/constants/publishNames';

Meteor.publish(publishNames.appsets.appsets, function() {
	return AppSets.find({});
});

Meteor.publish(publishNames.appsets.myAppsets, function() {
	return AppSets.find({userId: this.userId});
});

Meteor.publish(publishNames.appsets.mySlideshows, function() {
	return Slideshow.find({userId: this.userId});
});
