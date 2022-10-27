import {Meteor} from 'meteor/meteor';

import {InstagramFeed} from 'shared/collections/InstagramFeed';
import {OKFeed} from 'shared/collections/OkFeed';
import {VKFeed} from 'shared/collections/VKFeed';
import {TelegramFeed} from 'shared/collections/TelegramFeed';
import {FBFeed} from 'shared/collections/FBFeed';
import {Twitter, TwitterGetTypeEnum} from 'shared/collections/Twitter';
import {publishNames} from 'shared/constants/publishNames';
import {makeTwitterHashtagFilter} from 'server/modules/dataSources/utils';

Meteor.publish(publishNames.instagram.feed, (pageId) => {
	return InstagramFeed.find({pageId});
});

Meteor.publish(publishNames.ok.feed, (groupLink) => {
	return OKFeed.find({groupLink});
});

Meteor.publish(publishNames.vk.feed, (pageId) => {
	return VKFeed.find({pageId});
});

Meteor.publish(publishNames.telegram.feed, (pageId) => {
	return TelegramFeed.find({pageId});
});

Meteor.publish(
	publishNames.twitter.feed,
	({
		twitterGetType,
		twitterHashtag,
		twitterProfileName,
		twitterProfileNameForList,
		twitterListId,
		twitterProfileNameForCollection,
		twitterCollectionId,
		twitterHashtagFilter,
	}) => {
		const tag = !!twitterHashtag && `#${twitterHashtag}`;
		const name = !!twitterProfileName && `@${twitterProfileName}`;
		const nameForList =
			!!twitterProfileNameForList &&
			`${twitterProfileNameForList}${twitterListId ? `::${twitterListId}` : ''}`;
		const nameForCollection =
			!!twitterProfileNameForCollection &&
			`${twitterProfileNameForCollection}${
				twitterCollectionId ? `::${twitterCollectionId}` : ''
			}`;
		const whereIn = [];

		if (twitterGetType === TwitterGetTypeEnum.HASHTAG && tag) {
			whereIn.push(`${tag}${makeTwitterHashtagFilter(twitterHashtagFilter)}`);
		}

		if (twitterGetType === TwitterGetTypeEnum.PROFILE_NAME && name) {
			whereIn.push(name);
		}

		if (twitterGetType === TwitterGetTypeEnum.LIST && nameForList) {
			whereIn.push(nameForList);
		}

		if (twitterGetType === TwitterGetTypeEnum.COLLECTION && nameForCollection) {
			whereIn.push(nameForCollection);
		}

		// @ts-ignore - $slice worked on server side
		return Twitter.find({query: {$in: whereIn}}, {fields: {feed: {$slice: 100}}});
	},
);

Meteor.publish(publishNames.fb.feed, (pageId) => {
	return FBFeed.find({pageId});
});
