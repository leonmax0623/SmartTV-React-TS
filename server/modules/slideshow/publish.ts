import {Meteor} from 'meteor/meteor';
import {check} from 'meteor/check';

import {publishNames} from 'shared/constants/publishNames';
import {Slideshow} from 'shared/collections/Slideshows';
import {SlideVectorElement} from 'shared/collections/SlideVectorElements';

import {Slide} from 'shared/collections/Slides';
import {SlideElement} from 'shared/collections/SlideElements';

Meteor.publish(publishNames.slideshow.myList, function() {
	if (this.userId) {
		// TODO вообще то isSystem тут нужно только админу или редактору шаблонов
		// + фильтровать по userId
		let filter = {userId: this.userId, isSystem: {$ne: true}};
		if (Roles.userIsInRole(this.userId, ['admin', 'template_editor'])) {
			filter = {userId: this.userId};
		}
		return Slideshow.find({...filter});
	}

	return this.ready();
});

Meteor.publish(publishNames.slideshow.systemList, function() {
	if (this.userId) {
		return Slideshow.find({isSystem: true});
	}
	return this.ready();
});

Meteor.publish(publishNames.slideshow.oneFull, function(slideshowId) {
	check(slideshowId, String);
	const filter = {_id: slideshowId};
	if (!Roles.userIsInRole(this.userId, 'admin')) {
		filter.userId = this.userId;
	}
	const slideshows = Slideshow.find({...filter});

	if (!slideshows.count()) {
		return [];
	}

	return [slideshows, Slide.find({slideshowId}), SlideElement.find({slideshowId})];
});

Meteor.publish(publishNames.slideshow.oneFullShow, function(numId) {
	check(numId, String);
	const slideShow = Slideshow.findOne({numId});

	if (slideShow) {
		const slideshowId = slideShow._id;

		return [
			Slideshow.find({_id: slideshowId}),
			Slide.find({slideshowId}),
			SlideElement.find({slideshowId}),
		];
	}

	return this.ready();
});

function userSearchSelector(searchText?: string) {
	if (!searchText || searchText === undefined) {
		return {};
	}
	const query = {
		$or: [
			{_id: searchText},
			{
				name: {
					$regex: searchText,
					$options: 'i',
				},
			},
			{
				numId: {
					$regex: searchText,
					$options: 'i',
				},
			},
			{
				userId: {
					$regex: searchText,
					$options: 'i',
				},
			},
		],
	};
	return query;
}

Meteor.publish(publishNames.slideshow.listForAdmin, function({search}) {
	if (Roles.userIsInRole(this.userId, 'admin')) {
		let query = {};
		if (search?.length > 0) {
			check(search, String);
			query = {
				$and: [{...userSearchSelector(search)}],
			};
		}
		return Slideshow.find(query, {limit: 10});
	}

	return this.ready();
});

Meteor.publish(publishNames.slideshow.byElement, function(id) {
	check(id, String);
	const slideElement = SlideElement.findOne({_id: id});
	if (slideElement) {
		const slideshowId = slideElement.slideshowId;

		return [
			Slideshow.find({_id: slideshowId, userId: this.userId}),
			Slide.find({slideshowId}),
			SlideElement.find({_id: id}),
		];
	}

	return this.ready();
});

Meteor.publish(publishNames.slideshow.myListForStat, function() {
	if (this.userId) {
		const ids = Slideshow.find(
			{$or: [{userId: this.userId}, {isSystem: true}]},
			{fields: {_id: 1}},
		).map((el) => el._id);
		const slideshowWithStatIds = SlideElement.find(
			{collectStat: true, slideshowId: {$in: ids}},
			{fields: {slideshowId: 1}},
		).map((el) => el.slideshowId);
		return Slideshow.find({
			_id: {$in: slideshowWithStatIds},
			$or: [{userId: this.userId}, {isSystem: true}],
		});
	}

	return this.ready();
});

Meteor.publish(publishNames.slideshow.byStatId, function(statisticId) {
	check(statisticId, String);
	const slideElements = SlideElement.find({statisticId}, {fields: {slideshowId: 1}}).fetch();
	if (slideElements?.length) {
		const slideshowIds = slideElements?.map((se) => se.slideshowId);

		return [
			Slideshow.find({_id: {$in: slideshowIds}, userId: this.userId}),
			Slide.find({slideshowId: {$in: slideshowIds}}),
			SlideElement.find({statisticId}),
		];
	}

	return this.ready();
});
Meteor.publish(publishNames.slideshow.vectors, function() {
	if (this.userId) {
		return SlideVectorElement.find({});
	}
	return this.ready();
});
