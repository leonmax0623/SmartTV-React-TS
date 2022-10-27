import * as moment from 'moment/moment';
import * as Agenda from 'agenda';

import {OKFeed} from 'shared/collections/OkFeed';
import {methodNames} from 'shared/constants/methodNames';

export default function(agenda: Agenda): void {
	agenda.define(
		'Update OK wall',
		Meteor.bindEnvironment(function() {
			const yesterday = moment()
				.add(-1, 'day')
				.endOf('day')
				.toDate();

			OKFeed.find({lastUpdate: {$lte: yesterday}}).forEach((feed) => {
				Meteor.call(methodNames.ok.updateFeed, feed.groupLink);
			});
		}),
	);

	// В 2:00 каждый день
	agenda.every('0 2 * * *', 'Update OK wall');
}
