import {Meteor} from 'meteor/meteor';
import {check} from 'meteor/check';
import forEach from 'lodash/forEach';

import {AppSets, AppSetSchema} from 'shared/collections/AppSets';
import {methodNames} from 'shared/constants/methodNames';
import {getUniqNumId} from 'shared/utils/methods';
import {SlideshowNumber} from 'shared/collections/SlideshowNumbers';

Meteor.methods({
	// Add App set
	[methodNames.appsets.create](obj) {
		if (!Meteor.userId()) return; // only for logged users

		const context = AppSetSchema.Creator.newContext();
		context.validate(obj);

		if (!context.isValid()) {
			throw new Error('Ошибка проверки формы');
		}

		// safe fields only
		const fields = {
			title: true,
			welcome: true,
			style: true,
			apps: true,
		};

		// remove other fields
		forEach(obj, function(value, key) {
			if (!fields[key]) delete obj[key];
		});

		const numId = getUniqNumId('appSet');

		obj.numId = numId.toString();
		obj.userId = this.userId;
		obj.createdAt = new Date();

		return AppSets.insert(obj);
	},
	// Update app set
	[methodNames.appsets.update](obj) {
		const context = AppSetSchema.Editor.newContext();
		context.validate(obj);

		if (!context.isValid()) {
			throw new Error('Ошибка проверки формы');
		}

		const objId = obj._id;
		const app = AppSets.findOne({_id: objId});

		if (typeof app === 'undefined') {
			throw new Error('Подборка не найдена');
		}

		if (Meteor.userId() !== app.userId) {
			throw new Error('Ошибка проверки владельца');
		}

		// safe fields only
		const fields = {
			title: true,
			welcome: true,
			style: true,
			apps: true,
		};

		// remove other fields
		forEach(obj, function(value, key) {
			if (!fields[key]) delete obj[key];
		});

		obj.lastUpdate = new Date();
		// Update now
		AppSets.update(objId, {$set: obj});
		// clean up empty apps
		AppSets.update(objId, {$pull: {apps: null}});
		// Delete apps if removed
		if (!obj.apps) AppSets.update(objId, {$set: {apps: []}});
	},
	// Delete apps set
	[methodNames.appsets.delete](id) {
		check(id, String);

		const app = AppSets.findOne({_id: id});

		if (typeof app === 'undefined') {
			throw new Error('Подборка не найдена');
		}

		if (
			!Meteor.userId() ||
			(!Roles.userIsInRole(Meteor.userId(), 'admin') && Meteor.userId() !== app.userId)
		) {
			throw new Error('Ошибка проверки владельца');
		}

		const appSetNumber = SlideshowNumber.findOne({number: app.numId});
		appSetNumber.isAvailableForSlideshow = true;

		AppSets.remove({_id: id});
		appSetNumber.save();
	},
});
