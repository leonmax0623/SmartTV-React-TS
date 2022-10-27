import * as moment from 'moment';
import * as Agenda from 'agenda';

import {OWMFeed} from 'shared/collections/OWMFeed';
import {methodNames} from 'shared/constants/methodNames';

function updateOwm(agenda: Agenda) {
	const yesterday = moment()
		.add(-1, 'day')
		.endOf('day')
		.toDate();

	// Макс 60 запросов в минуту. Лимит 50 на всякий случай
	OWMFeed.find({lastUpdate: {$lte: yesterday}, error: false}, {limit: 50}).forEach((feed) => {
		Meteor.call(methodNames.owm.update, feed.location);
	});

	if (OWMFeed.findOne({lastUpdate: {$lte: yesterday}, error: false})) {
		agenda.define(
			'Update next OWM objects',
			Meteor.bindEnvironment(function() {
				updateOwm(agenda);
			}),
		);

		// Повторно через 5 минут, если есть что обновлять
		agenda.schedule('in 5 minutes', 'Update next OWM objects');
	}
}

export default (agenda: Agenda) => {
	agenda.define(
		'Update OWM',
		Meteor.bindEnvironment(() => {
			updateOwm(agenda);
		}),
	);

	// В 1:00 каждый день
	agenda.every('0 13 * * *', 'Update OWM');
};
