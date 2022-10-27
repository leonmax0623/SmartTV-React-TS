import {Meteor} from 'meteor/meteor';
import {check} from 'meteor/check';

import {SlideMockup} from 'shared/collections/SlideMockups';
import {Slide} from 'shared/collections/Slides';
import {methodNames} from 'shared/constants/methodNames';
import {SlideElement} from 'shared/collections/SlideElements';
import {Slideshow} from 'shared/collections/Slideshows';
import {Roles} from 'meteor/alanning:roles';

Meteor.methods({
	// Add a mockup
	[methodNames.slideMockups.create](slideId: string, name: string): string {
		check(slideId, String);
		check(name, String);

		if (!this.userId) {
			throw new Error('Ошибка проверки владельца');
		}

		const slide = Slide.findOne({_id: slideId});

		if (!slide) {
			throw new Error('Слайд не найден');
		}

		const slideshow = Slideshow.findOne({_id: slide.slideshowId, userId: this.userId});

		if (!slideshow) {
			throw new Error('Слайдшоу не найдено');
		}

		const slideMockup = new SlideMockup({name, userId: this.userId});
		slideMockup.styles = slide.styles;
		slideMockup.teaser = slide.teaser;
		slideMockup.save();

		const elements = SlideElement.find({slideId: slide._id});

		elements.forEach((element: any) => {
			const elementCopy = element.copy();

			elementCopy.isForMockup = true;
			elementCopy.slideId = slideMockup._id;
			elementCopy.save();
		});

		return slideMockup._id;
	},

	// Delete a mockup
	[methodNames.slideMockups.delete](slideMockupId: string): void {
		check(slideMockupId, String);

		if (!this.userId) {
			throw new Error('Ошибка проверки владельца');
		}

		const slideMockup = SlideMockup.findOne({_id: slideMockupId});

		if (!slideMockup) {
			throw new Error('Макет не найден');
		}

		if (slideMockup.isDefault && !Roles.userIsInRole(this.userId, 'admin')) {
			throw new Error('Невозможно удалить шаблон по умолчанию');
		}

		if (!slideMockup.isDefault && this.userId !== slideMockup.userId) {
			throw new Error('Невозможно удалить шаблон');
		}

		SlideElement.remove({slideId: slideMockupId});
		SlideMockup.remove({_id: slideMockupId});
	},

	[methodNames.slideMockups.toggleDefault](slideMockupId: string): void {
		check(slideMockupId, String);

		if (!this.userId || !Roles.userIsInRole(this.userId, 'admin')) {
			throw new Error('Ошибка проверки владельца');
		}

		const slideMockup = SlideMockup.findOne({_id: slideMockupId});

		if (!slideMockup) {
			throw new Error('Макет не найден');
		}

		SlideMockup.update({_id: slideMockupId}, {$set: {isDefault: !slideMockup.isDefault}});
	},
});
