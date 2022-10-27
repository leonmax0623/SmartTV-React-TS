import {Meteor} from 'meteor/meteor';
import {publishNames} from 'shared/constants/publishNames';
import {Faq} from 'shared/collections/Faq';

Meteor.publish(publishNames.faq.list, () => {
	return Faq.find();
});
