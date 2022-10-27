import {Meteor} from 'meteor/meteor';
import {check} from 'meteor/check';

import {CitiesCollection} from 'shared/collections/Cities';
import {publishNames} from 'shared/constants/publishNames';

Meteor.publish(publishNames.cities.oneCity, (city: string) => {
	check(city, String);

	return CitiesCollection.find({name: city});
});
