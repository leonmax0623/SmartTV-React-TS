import {Meteor} from 'meteor/meteor';
import {Random} from 'meteor/random';
import {methodNames} from 'shared/constants/methodNames';
import {Roles} from 'meteor/alanning:roles';
import {Faq, FaqItem, IFaq, IFaqItem} from 'shared/collections/Faq';
import {IResponseError, IResponseSuccess} from 'shared/models/Response';

const isAdmin = (userId: string | null) => {
	if (!userId) {
		throw new Meteor.Error('Недостаточно прав');
	}

	if (!Roles.userIsInRole(userId, 'admin')) {
		throw new Meteor.Error('Недостаточно прав');
	}
};

Meteor.methods({
	[methodNames.faq.getListByKey]({key}: {key: string}) {
		if (!key) {
			return {
				error: {
					message: 'Ключ отсутствует',
				},
			};
		}

		return Faq.findOne({key});
	},
	[methodNames.faq.edit]({key, title}: IFaq): IResponseSuccess | IResponseError {
		isAdmin(this.userId);

		if (!title) {
			return {
				error: {
					fields: {
						title: 'Заголовок не может быть пустым',
					},
				},
			};
		}

		const foundFaq = Faq.findOne({key});
		foundFaq.set('title', title);
		foundFaq.save();

		return {message: 'Запись успешно обновлен'};
	},
	[methodNames.faq.addItem]({
		key,
		item,
		update = false,
	}: {
		key: string;
		item: IFaqItem;
		update: boolean;
	}) {
		isAdmin(this.userId);

		if (!key) {
			throw new Meteor.Error('Не указан родительский элемент');
		}
		if (!item?.title) {
			return {
				error: {
					fields: {
						title: 'Заголовок не может быть пустым',
					},
				},
			};
		}
		if (!item.content) {
			return {
				error: {
					fields: {
						content: 'Контент не может быть пустым',
					},
				},
			};
		}

		const foundFaq = Faq.findOne({key});

		if (!foundFaq) {
			throw new Meteor.Error('Родительский элемент не найден');
		}

		if (update) {
			Faq.update({key, 'items.id': item.id}, {$set: {'items.$': item}});
		} else {
			const newFaqItem = new FaqItem(item);
			newFaqItem.id = Random.id();
			Faq.update({key}, {$push: {items: newFaqItem}});
		}

		return {message: 'Элемент успешно добавлен'};
	},
	[methodNames.faq.removeItem]({key, itemId}: {key: string; itemId: string}) {
		isAdmin(this.userId);

		if (!key) {
			throw new Meteor.Error('ID родительской категория не может быть пустым');
		}
		if (!itemId) {
			throw new Meteor.Error('ID элемента не может быть пустым');
		}

		Faq.update({key}, {$pull: {items: {id: itemId}}});
	},
});
