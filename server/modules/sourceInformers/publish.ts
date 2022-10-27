import {Meteor} from 'meteor/meteor';

import {CurrencyFeed} from 'shared/collections/CurrencyFeed';
import {OWMFeed} from 'shared/collections/OWMFeed';
import {YaScheduleFeed} from 'shared/collections/YaScheduleFeed';
import {RssFeed} from 'shared/collections/RssFeed';
import {publishNames} from 'shared/constants/publishNames';

Meteor.publish(publishNames.currency.feed, function() {
	return CurrencyFeed.find();
});

Meteor.publish(publishNames.owm.feed, function(location) {
	return OWMFeed.find({location});
});

Meteor.publish(publishNames.ya.feed, function({transport, from, to}) {
	return YaScheduleFeed.find({transport, from, to});
});

Meteor.publish(publishNames.rss.feed, function(rssUrl) {
	return RssFeed.find({rssUrl});
});
