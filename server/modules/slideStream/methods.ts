import {Meteor} from 'meteor/meteor';
import {Random} from 'meteor/random';
import {methodNames} from 'shared/constants/methodNames';
import {
	ISlideStream,
	ISlideStreamSchedule,
	SlideStream,
	SlideStreamSchedule,
} from 'shared/collections/SlideStream';
import {IResponseSuccess, IResponseError} from 'shared/models/Response';
import {getUniqNumId} from 'shared/utils/methods';
import {check} from 'meteor/check';
import {SlideshowNumber} from 'shared/collections/SlideshowNumbers';

Meteor.methods({
	[methodNames.slideStream.create]({title, password}: ISlideStream): IResponseError | string {
		const userId = this.userId;
		if (!userId) {
			throw new Error('Недостаточно прав');
		}
		if (!title) {
			return {
				error: {
					fields: {
						title: 'Заголовок не может быть пустым',
					},
				},
			};
		}

		const code = getUniqNumId('slideStream');

		const newSlideshowStream = new SlideStream({userId, title, password, code});
		newSlideshowStream.save();

		return newSlideshowStream.get('_id');
	},
	[methodNames.slideStream.remove]({_id}: ISlideStream): IResponseSuccess | IResponseError {
		check(_id, String);
		if (!_id) {
			return {
				error: {
					message: 'ID потока отсутствует',
				},
			};
		}
		const foundSlideStream = SlideStream.findOne({_id});
		if (!foundSlideStream) {
			return {
				error: {
					message: 'Поток не найден',
				},
			};
		}

		const slideStreamNumber = SlideshowNumber.findOne({number: foundSlideStream.code});
		slideStreamNumber.isAvailableForSlideStream = true;

		foundSlideStream.remove();
		slideStreamNumber.save();

		return {message: 'Поток успешно удален'};
	},
	[methodNames.slideStream.update]({
		_id,
		title,
		password,
	}: ISlideStream): IResponseSuccess | IResponseError {
		check(_id, String);

		if (!_id) {
			return {
				error: {
					message: 'ID потока отсутствует',
				},
			};
		}

		if (!title) {
			return {
				error: {
					message: 'Заголовок не может быть пустым',
				},
			};
		}
		const foundSlideStream = SlideStream.findOne({_id});

		if (!foundSlideStream) {
			return {
				error: {
					message: 'Поток не найден',
				},
			};
		}

		foundSlideStream.title = title;
		foundSlideStream.password = password;
		foundSlideStream.save();

		return {message: 'Поток успешно изменен'};
	},

	[methodNames.slideStream.createSchedule]({
		slideStreamId,
		slideshowNumId,
		startDate,
		endDate,
		rRule,
	}: ISlideStreamSchedule & {slideStreamId: string}): IResponseError | IResponseSuccess {
		check(startDate, Date);
		check(endDate, Date);
		if (!slideStreamId) {
			return {
				error: {
					message: 'ID потока отсутствует',
					fields: {
						slideStreamId: 'ID не может быть пустым',
					},
				},
			};
		}
		if (!slideshowNumId) {
			return {
				error: {
					message: 'Слайдшоу отсутствует',
				},
			};
		}
		if (!startDate) {
			return {
				error: {
					message: 'Дата начала не может быть пустым',
					fields: {
						startDate: 'Дата начала не может быть пустым',
					},
				},
			};
		}
		if (!endDate) {
			return {
				error: {
					message: 'Дата конца не может быть пустым',
					fields: {
						title: 'Дата конца не может быть пустым',
					},
				},
			};
		}

		const foundSlideStream = SlideStream.findOne({_id: slideStreamId});
		if (!foundSlideStream) {
			return {
				error: {
					message: 'Поток не найден',
				},
			};
		}

		const newSchedule = new SlideStreamSchedule({
			slideshowNumId,
			startDate,
			endDate,
			rRule,
			id: Random.id(),
		});
		if (!Array.isArray(foundSlideStream.schedules)) {
			foundSlideStream.schedules = [];
		}
		foundSlideStream.schedules.push(newSchedule);
		foundSlideStream.save();

		return {message: 'Расписание успешно добавлено'};
	},
	[methodNames.slideStream.removeSchedule]({
		slideStreamId,
		id,
	}: {
		slideStreamId: string;
		id: string;
	}): IResponseSuccess | IResponseError {
		if (!slideStreamId) {
			return {
				message: 'ID потока может быть пустым',
			};
		}
		if (!id) {
			return {
				message: 'ID не может быть пустым',
			};
		}
		const foundSlideStream = SlideStream.findOne({_id: slideStreamId});
		if (!foundSlideStream) {
			return {
				error: {
					message: 'Поток не найден',
				},
			};
		}
		if (foundSlideStream.userId !== this.userId) {
			return {
				error: {
					message: 'Недостаточно прав',
				},
			};
		}

		SlideStream.update({_id: slideStreamId}, {$pull: {schedules: {id}}});

		return {message: 'Запись успешно удален'};
	},
	[methodNames.slideStream.updateSchedule](
		data: ISlideStreamSchedule & {slideStreamId: string},
	): IResponseSuccess | IResponseError {
		const {slideStreamId, id} = data;

		if (!slideStreamId) {
			return {
				error: {
					message: 'ID потока отсутствует',
				},
			};
		}
		if (!id) {
			return {
				error: {
					message: 'ID расписания отсутствует',
				},
			};
		}
		if (data.hasOwnProperty('slideshowNumId') && !data.slideshowNumId) {
			return {
				error: {
					message: 'Заголовок расписания не может быть пустым',
					fields: {
						title: 'Заголовок не может быть пустым',
					},
				},
			};
		}
		if (data.hasOwnProperty('startDate') && !data.startDate) {
			return {
				error: {
					message: 'Дата начала не может быть пустым',
					fields: {
						title: 'Дата начала не может быть пустым',
					},
				},
			};
		}
		if (data.hasOwnProperty('endDate') && !data.endDate) {
			return {
				error: {
					message: 'Дата конца не может быть пустым',
					fields: {
						title: 'Дата конца не может быть пустым',
					},
				},
			};
		}

		const updateData = {
			$set: {},
		};
		if (data.slideshowNumId) {
			updateData.$set[`schedules.$.slideshowNumId`] = data.slideshowNumId;
		}
		if (data.startDate) {
			updateData.$set[`schedules.$.startDate`] = data.startDate;
		}
		if (data.endDate) {
			updateData.$set[`schedules.$.endDate`] = data.endDate;
		}
		if (data.hasOwnProperty('rRule')) {
			updateData.$set[`schedules.$.rRule`] = data.rRule;
		}
		if (data.hasOwnProperty('exDate')) {
			updateData.$set[`schedules.$.exDate`] = data.exDate;
		}

		SlideStream.update({_id: slideStreamId, 'schedules.id': id}, updateData);

		return {message: 'Запись успешно обновлена'};
	},
});
