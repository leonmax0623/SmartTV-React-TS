import * as moment from 'moment/moment';
import * as Agenda from 'agenda';

import {RssFeed} from 'shared/collections/RssFeed';
import {methodNames} from 'shared/constants/methodNames';

export default function(agenda: Agenda): void {
	agenda.define(
		'Update Rss feed',
		Meteor.bindEnvironment(function() {
			const yesterday = moment()
				.add(-1, 'hour')
				.startOf('hour')
				.toDate();

			RssFeed.find({updatedAt: {$lte: yesterday}}).forEach((feed) => {
				Meteor.call(methodNames.rss.updateFeed, feed.rssUrl);
			});
		}),
	);

	// Каждый час
	agenda.every('0 * * * *', 'Update Rss feed');
}
