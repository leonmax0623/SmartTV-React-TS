import * as moment from 'moment';
import * as Agenda from 'agenda';

import {YaScheduleFeed} from 'shared/collections/YaScheduleFeed';
import {methodNames} from 'shared/constants/methodNames';

export default function(agenda: Agenda): void {
	agenda.define(
		'Update Ya schedule',
		Meteor.bindEnvironment(function() {
			const yesterday = moment()
				.add(-1, 'day')
				.endOf('day')
				.toDate();

			YaScheduleFeed.find({lastUpdate: {$lte: yesterday}, error: {$exists: false}}).forEach(
				({transport, from, to}) => {
					Meteor.call(methodNames.ya.getYaSchedule, {transport, from, to});
				},
			);
		}),
	);

	// В 2:00 каждый день
	agenda.every('0 3 * * *', 'Update Ya schedule');
}
