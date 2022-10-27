import {check} from 'meteor/check';

import {methodNames} from 'shared/constants/methodNames';
import {IMethodReturn} from 'shared/models/Methods';
import {Group} from 'shared/collections/Groups';
import {Slideshow} from 'shared/collections/Slideshows';

Meteor.methods({
	[methodNames.user.addSlideShowGroup](name: string): IMethodReturn {
		check(name, String);
		if (!this.userId) {
			return {status: false, message: 'Недостаточно прав'};
		}

		if (!name.trim()) {
			return {status: false, message: 'Название не может быть пустым'};
		}

		const groups = Group.find({userId: this.userId});

		if (
			groups.map(({name: n}) => n.toLowerCase()).find((n) => n === name.trim().toLowerCase())
		) {
			return {status: false, message: 'Такая группа уже есть'};
		}

		const group = new Group({name, userId: this.userId});

		group.save();

		return {status: true, message: ''};
	},

	[methodNames.user.editSlideShowGroup](groupId: string, newName: string): IMethodReturn {
		check(groupId, String);
		check(newName, String);
		if (!this.userId) {
			return {status: false, message: 'Недостаточно прав'};
		}

		const group = Group.findOne({_id: groupId, userId: this.userId});

		if (!group) {
			return {status: false, message: 'Недостаточно прав'};
		}

		if (!newName.trim()) {
			return {status: false, message: 'Название не может быть пустым'};
		}

		if (group.name === newName.trim()) {
			return {status: false, message: 'Нет изменений'};
		}

		const groups = Group.find({userId: this.userId});

		if (
			groups
				.map(({name: n}) => n.toLowerCase())
				.find((n) => n === newName.trim().toLowerCase())
		) {
			return {status: false, message: 'Такая группа уже есть'};
		}

		group.name = newName;
		group.save();

		return {status: true, message: ''};
	},

	[methodNames.user.deleteSlideShowGroup](groupId: string): IMethodReturn {
		check(groupId, String);
		if (!this.userId) {
			return {status: false, message: 'Недостаточно прав'};
		}

		const group = Group.findOne({_id: groupId, userId: this.userId});

		if (!group) {
			return {status: false, message: 'Недостаточно прав'};
		}

		if (Group.find({userId: this.userId}).count() <= 1) {
			return {status: false, message: 'Нельзя удалить единственную группу'};
		}

		const slideShow = Slideshow.findOne({groupId: group._id});

		if (slideShow) {
			return {status: false, message: 'В данной группе содержатся слайдшоу'};
		}

		group.remove();

		return {status: true, message: ''};
	},
});
