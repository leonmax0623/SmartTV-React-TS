import {Meteor} from 'meteor/meteor';
import findIndex from 'lodash/findIndex';
import {check} from 'meteor/check';

import {methodNames} from 'shared/constants/methodNames';
import {
	ISlideshowStyles,
	Slideshow,
	SlideshowBackgroundImageDisplayEnum,
	SlideshowFontFamilyText,
	SlideshowLocationTypeEnum,
	SlideshowOrientationEnum,
	SlideshowPreviewEnum,
	SlideshowRadiostationTypeEnum,
	SlideshowTransitionEnum,
} from 'shared/collections/Slideshows';
import {SlideVectorElement, SlideVectorElementTag} from 'shared/collections/SlideVectorElements';
import {ISlide, Slide} from 'shared/collections/Slides';
import {ISlideElement, SlideElement} from 'shared/collections/SlideElements';
import {removeUndefinedFields, getUniqNumId} from 'shared/utils/methods';
import {setActiveFonts} from 'shared/methods/slideshow';
import {SlideMockup} from 'shared/collections/SlideMockups';
import {ISlideshowParams} from 'shared/models/SlideshowMethodParams';
import {IMethodReturn} from 'shared/models/Methods';
import {Group} from 'shared/collections/Groups';
import {copySlideshow} from 'server/modules/slideshow/utils';
import {SlideshowNumber} from 'shared/collections/SlideshowNumbers';
import fs from 'fs';
import Future from 'fibers/future';

Meteor.methods({
	// Создает новое слайдшоу
	[methodNames.slideshow.create]: function(groupId: string) {
		check(groupId, String);

		if (!this.userId) {
			throw new Error('Недостаточно прав');
		}

		const slideshow = new Slideshow({
			groupId,
			userId: this.userId,
			orientation: SlideshowOrientationEnum.HORIZONTAL,
			location: SlideshowLocationTypeEnum.OTHER,
			radiostation: SlideshowRadiostationTypeEnum.NONE,
			showSlidePreview: SlideshowPreviewEnum.SHOW,
			radioVolume: 0.6,
			previewImage: '',
			password: '',
			address: '',
			styles: {
				slideDuration: 30,
				slideBackgroundColor: '#ffffff',
				slideBackgroundImage: undefined,
				slideBackgroundVideo: undefined,
				slideBackgroundImageDisplay: SlideshowBackgroundImageDisplayEnum.STRETCH,
				slideTransition: SlideshowTransitionEnum.NONE,
				elementBackgroundColor: '#ffffff',
				elementBackgroundImage: undefined,
				elementBackgroundImageDisplay: SlideshowBackgroundImageDisplayEnum.STRETCH,
				elementFontFamily: SlideshowFontFamilyText.ARIAL,
				elementFontSize: 24,
				elementTextColor: '#000000',
			},
		});

		const slideshowNumber = getUniqNumId('slideshow');

		slideshow.numId = slideshowNumber;
		slideshow.name = `Слайдшоу №${slideshowNumber}`;
		slideshow.save();

		Meteor.call(methodNames.slideshow.createNewSlide, slideshow._id);

		return slideshow._id;
	},

	// Обновление настроек слайдшоу
	[methodNames.slideshow.updateSettings](slideshowId: string, slideShowData: ISlideshowParams) {
		check(slideshowId, String);
		check(slideShowData, Object);

		if (!this.userId) {
			throw new Error('Недостаточно прав');
		}

		const slideshow = Slideshow.findOne({_id: slideshowId, userId: this.userId});

		if (slideshow === undefined) {
			throw new Error('Слайдшоу не найдено');
		}

		const group = Group.findOne({_id: slideshow.groupId, userId: this.userId});

		if (!group) {
			throw new Error('Группа не найдена');
		}

		slideshow.set(
			removeUndefinedFields({
				systemGroupId: slideShowData.systemGroupId,
				additionalFonts: slideShowData.additionalFonts,
				orientation: slideShowData.orientation,
				name: slideShowData.name,
				location: slideShowData.location,
				showSlidePreview: slideShowData.showSlidePreview,
				radiostation: slideShowData.radiostation,
				radioVolume: slideShowData.radioVolume,
				previewImage: slideShowData.previewImage,
				password: slideShowData.password,
				address: slideShowData.address,
				isSystem: slideShowData.isSystem,
				groupId: slideShowData.groupId,
				isGridBlockEnabled: slideShowData.isGridBlockEnabled,
			}),
		);

		slideshow.save();

		setActiveFonts(slideshowId);
	},

	// Обновление стилей слайдшоу
	[methodNames.slideshow.updateStyles](
		slideshowId: string,
		slideShowData: ISlideshowStyles,
		applyForAllSlides: boolean = false,
	) {
		check(slideshowId, String);
		check(slideShowData, Object);
		check(applyForAllSlides, Boolean);

		if (!this.userId) {
			throw new Error('Недостаточно прав');
		}

		const slideshow = Slideshow.findOne({_id: slideshowId, userId: this.userId});

		if (slideshow === undefined) {
			throw new Error('Слайдшоу не найдено');
		}

		slideshow.styles = {
			...slideshow.styles,
			...removeUndefinedFields({
				hideProgressbar: slideShowData.hideProgressbar,
				colorPrimary: slideShowData.colorPrimary,
				barColorPrimary: slideShowData.barColorPrimary,
				slideDuration: slideShowData.slideDuration,
				slideTransitionLength: slideShowData.slideTransitionLength,
				slideTransitionEasing: slideShowData.slideTransitionEasing,
				slideBackgroundColor: slideShowData.slideBackgroundColor,
				slideBackgroundImage: slideShowData.slideBackgroundImage,
				slideBackgroundVideo: slideShowData.slideBackgroundVideo,
				slideBackgroundImageDisplay: slideShowData.slideBackgroundImageDisplay,
				slideTransition: slideShowData.slideTransition,
				elementBackgroundColor: slideShowData.elementBackgroundColor,
				elementBackgroundImage: slideShowData.elementBackgroundImage,
				elementBackgroundImageDisplay: slideShowData.elementBackgroundImageDisplay,
				elementFontFamily: slideShowData.elementFontFamily,
				elementFontSize: slideShowData.elementFontSize,
				elementTextColor: slideShowData.elementTextColor,
			}),
		};

		slideshow.save();

		if (applyForAllSlides) {
			Slide.update({slideshowId}, {$set: {styles: slideshow.styles}}, {multi: true});
		}

		setActiveFonts(slideshowId);
	},

	// Удаляет слайдшоу со всеми слайдами и элементами
	[methodNames.slideshow.delete](id: string) {
		check(id, String);

		const slideshow = Slideshow.findOne({_id: id});

		if (slideshow === undefined) {
			throw new Error('Слайдшоу не найдено');
		}
		const userId = Meteor.userId();
		if (!userId || (!Roles.userIsInRole(userId, 'admin') && userId !== slideshow.userId)) {
			throw new Error('Ошибка проверки владельца');
		}

		const slideshowNumber = SlideshowNumber.findOne({number: slideshow.numId});
		slideshowNumber.isAvailableForSlideshow = true;

		Slideshow.remove({_id: id});
		Slide.remove({slideshowId: id});
		SlideElement.remove({slideshowId: id});
		slideshowNumber.save();
	},

	// Добавляет новый слайд в слайдшоу
	[methodNames.slideshow.createNewSlide](slideshowId: string, slideMockupId: string): ISlide {
		check(slideshowId, String);

		if (slideMockupId) {
			check(slideMockupId, String);
		}

		if (!this.userId) {
			throw new Error('Недостаточно прав');
		}

		const slideshow = Slideshow.findOne({_id: slideshowId, userId: this.userId});

		if (slideshow === undefined) {
			throw new Error('Слайдшоу не найдено');
		}

		const slidesCount = Slide.find({slideshowId}).count();

		const slide = new Slide({
			slideshowId,
			position: slidesCount + 1,
			styles: slideshow.styles,
		});

		if (slideMockupId) {
			let slideMockup = SlideMockup.findOne({_id: slideMockupId, userId: this.userId});

			if (!slideMockup) {
				slideMockup = SlideMockup.findOne({_id: slideMockupId, isDefault: true});
			}

			if (!slideMockup) {
				throw new Error('Макет не найден');
			}

			if (slideMockup.styles) {
				slide.styles = slideMockup.styles;
			}
			if (slideMockup.teaser) {
				slide.teaser = slideMockup.teaser;
			}

			slide.save();

			const elements = SlideElement.find({
				slideId: slideMockup._id,
			});

			elements.forEach((element: any) => {
				const elementCopy = element.copy();

				elementCopy.isForMockup = false;
				elementCopy.slideshowId = slideshow._id;
				elementCopy.slideId = slide._id;
				elementCopy.save();
			});
		} else {
			slide.save();
		}

		return slide;
	},

	// Дублирует слайд в слайдшоу
	[methodNames.slideshow.dublicateSlide](slideshowId: string, slideId: string): string {
		check(slideshowId, String);
		check(slideId, String);

		if (!this.userId) {
			throw new Error('Недостаточно прав');
		}

		const slideshow = Slideshow.findOne({_id: slideshowId, userId: this.userId});

		if (slideshow === undefined) {
			throw new Error('Слайдшоу не найдено');
		}

		const slideFrom = Slide.findOne({slideshowId, _id: slideId});

		if (slideFrom === undefined) {
			throw new Error('Слайд не найден');
		}

		const slidesCount = Slide.find({slideshowId}).count();

		const slideTo = slideFrom.copy();

		slideTo.position = slidesCount + 1;

		slideTo.save();

		const elementsFrom = SlideElement.find({slideId: slideFrom._id});

		elementsFrom.forEach(({_id}: ISlideElement) => {
			const elementTo = SlideElement.findOne({
				$or: [
					{_id, permanent: {$exists: false}},
					{_id, permanent: {$ne: true}},
				],
			});

			if (!elementTo) {
				return;
			}

			const newElem = elementTo.copy();
			newElem.slideId = slideTo._id;

			newElem.save();
		});

		return slideTo._id;
	},

	// Удаляет слайд из слайдшоу
	[methodNames.slideshow.deleteSlide](slideshowId: string, slideId: string): string | undefined {
		check(slideshowId, String);
		check(slideId, String);

		if (!this.userId) {
			throw new Error('Недостаточно прав');
		}

		const slideshow = Slideshow.findOne({_id: slideshowId, userId: this.userId});
		const slide = Slide.findOne({_id: slideId, slideshowId});

		if (slideshow === undefined || slide === undefined) {
			throw new Error('Слайдшоу не найдено');
		}

		Slide.update(
			{slideshowId, position: {$gt: slide.position}},
			{$inc: {position: -1}},
			{multi: true},
		);

		SlideElement.remove({slideshowId, slideId});

		const permanentSlideElements = SlideElement.find({
			slideshowId,
			permanentOnSlides: {$exists: true},
		});

		permanentSlideElements.forEach((element) => {
			if (!element.permanentOnSlides.includes(slide._id)) {
				return;
			}

			element.permanentOnSlides = element.permanentOnSlides.filter((id) => id !== slide._id);

			element.save();
		});

		const slides = Slide.find({slideshowId}).fetch();
		const indexOfSlide = findIndex(slides, {_id: slideId});

		slide.remove();

		// Вернуть id рядом стоящего слайда или undefined если последний
		if (slides[indexOfSlide + 1]) {
			return slides[indexOfSlide + 1]._id;
		} else if (slides[indexOfSlide - 1]) {
			return slides[indexOfSlide - 1]._id;
		}

		setActiveFonts(slideshowId);

		return undefined;
	},

	// Обновляет настройки стилей слайда
	[methodNames.slideshow.updateSlideStyles](slideId: string, slideData: ISlideshowStyles) {
		check(slideId, String);
		check(slideData, Object);

		if (!this.userId) {
			throw new Error('Недостаточно прав');
		}

		const slide = Slide.findOne({_id: slideId});

		if (slide === undefined) {
			throw new Error('Слайд не найден');
		}

		slide.styles = {
			...slide.styles,
			...removeUndefinedFields({
				colorPrimary: slideData.colorPrimary,
				barColorPrimary: slideData.barColorPrimary,
				slideDuration: slideData.slideDuration,
				hideProgressbar: slideData.hideProgressbar,
				slideTransitionLength: slideData.slideTransitionLength,
				slideTransitionEasing: slideData.slideTransitionEasing,
				slideBackgroundColor: slideData.slideBackgroundColor,
				slideBackgroundImage: slideData.slideBackgroundImage,
				slideBackgroundVideo: slideData.slideBackgroundVideo,
				slideBackgroundImageDisplay: slideData.slideBackgroundImageDisplay,
				slideTransition: slideData.slideTransition,
				elementBackgroundColor: slideData.elementBackgroundColor,
				elementBackgroundImage: slideData.elementBackgroundImage,
				elementBackgroundImageDisplay: slideData.elementBackgroundImageDisplay,
				elementFontFamily: slideData.elementFontFamily,
				elementFontSize: slideData.elementFontSize,
				elementTextColor: slideData.elementTextColor,
			}),
		};

		slide.save();

		setActiveFonts(slide.slideshowId);
	},

	// Удаляет элемент слайда
	[methodNames.slideshow.deleteElement](slideshowId: string, slideElementId: string) {
		check(slideshowId, String);
		check(slideElementId, String);

		if (!this.userId) {
			throw new Error('Недостаточно прав');
		}

		const slideshow = Slideshow.findOne({_id: slideshowId, userId: this.userId});
		const slideElement = SlideElement.findOne({_id: slideElementId, slideshowId});

		if (slideshow === undefined || slideElement === undefined) {
			throw new Error('Слайдшоу не найдено');
		}

		const {zIndex, slideId} = slideElement;

		SlideElement.update(
			{slideshowId, slideId, zIndex: {$gt: zIndex}},
			{$inc: {zIndex: -1}},
			{multi: true},
		);

		slideElement.remove();

		setActiveFonts(slideshowId);
	},

	// Обновление стилей элемента слайда
	[methodNames.slideshow.updateElementStyles](
		slideElementId: string,
		slideShowData: ISlideElement,
		forAll?: boolean,
	) {
		check(slideElementId, String);
		check(slideShowData, Object);

		if (!this.userId) {
			throw new Error('Недостаточно прав');
		}

		const slideElement = SlideElement.findOne({_id: slideElementId});

		if (slideElement === undefined) {
			throw new Error('Слайд не найден');
		}

		if (forAll) {
			SlideElement.update(
				{
					slideshowId: slideElement.slideshowId,
					type: slideElement.type,
				},
				{
					$set: removeUndefinedFields({
						socialHeaderFontSize: slideShowData.socialHeaderFontSize,
						socialHeaderColor: slideShowData.socialHeaderColor,
						socialHeaderBackgroundColor: slideShowData.socialHeaderBackgroundColor,
						socialHeaderFont: slideShowData.socialHeaderFont,
						socialTextFontSize: slideShowData.socialTextFontSize,
						socialTextColor: slideShowData.socialTextColor,
						socialTextBackgroundColor: slideShowData.socialTextBackgroundColor,
						socialTextFont: slideShowData.socialTextFont,
						socialDateFontSize: slideShowData.socialDateFontSize,
						socialDateColor: slideShowData.socialDateColor,
						socialDateBackgroundColor: slideShowData.socialDateBackgroundColor,
						socialDateFont: slideShowData.socialDateFont,
					}),
				},
				{multi: true},
			);
		} else {
			slideElement.set(
				removeUndefinedFields({
					socialHeaderFontSize: slideShowData.socialHeaderFontSize,
					socialHeaderColor: slideShowData.socialHeaderColor,
					socialHeaderBackgroundColor: slideShowData.socialHeaderBackgroundColor,
					socialHeaderFont: slideShowData.socialHeaderFont,
					socialTextFontSize: slideShowData.socialTextFontSize,
					socialTextColor: slideShowData.socialTextColor,
					socialTextBackgroundColor: slideShowData.socialTextBackgroundColor,
					socialTextFont: slideShowData.socialTextFont,
					socialDateFontSize: slideShowData.socialDateFontSize,
					socialDateColor: slideShowData.socialDateColor,
					socialDateBackgroundColor: slideShowData.socialDateBackgroundColor,
					socialDateFont: slideShowData.socialDateFont,
				}),
			);

			slideElement.save();
		}

		setActiveFonts(slideElement.slideshowId);
	},

	// Копирование слайдшоу
	[methodNames.slideshow.copySlideShow](slideshowId: string, groupIdOrig?: string) {
		check(slideshowId, String);

		let groupId = groupIdOrig;
		if (!this.userId) {
			throw new Error('Недостаточно прав');
		}

		const slideshow = Slideshow.findOne({
			$or: [
				{_id: slideshowId, userId: this.userId},
				{_id: slideshowId, isSystem: true},
			],
		});

		if (!groupId) {
			const group = Group.findOne({userId: this.userId});

			if (!group) {
				return {status: false, message: 'У пользователя нет ни одной группы'};
			}
			groupId = group._id;
		}
		const newSlideshow = copySlideshow(slideshow, this.userId);

		if (newSlideshow) {
			if (groupId) {
				newSlideshow.groupId = groupId;

				newSlideshow.save();
			}

			setActiveFonts(newSlideshow._id);
		}

		return newSlideshow?._id;
	},

	[methodNames.slideshow.sendSlideShow](slideshowId: string, email: string): IMethodReturn {
		check(slideshowId, String);
		check(email, String);

		if (!this.userId) {
			throw new Error('Недостаточно прав');
		}

		const slideshow = Slideshow.findOne({_id: slideshowId, userId: this.userId});

		if (!slideshow) {
			return {status: false, message: 'Слайдшоу не найдено'};
		}

		const user = Meteor.users.findOne({'emails.address': email});

		if (!user) {
			return {status: false, message: 'Пользователь не найден'};
		}

		if (user._id === this.userId) {
			return {status: false, message: 'Себе же нельзя передавать'};
		}

		const group = Group.find({userId: user._id}).fetch()[0];

		if (!group) {
			return {status: false, message: 'У пользователя нет ни одной группы'};
		}

		const newSlideshow = copySlideshow(slideshow, user._id);

		if (!newSlideshow) {
			return {status: false, message: 'Произошла ошибка. Повторите попытку позже'};
		}

		setActiveFonts(newSlideshow._id);

		newSlideshow.name = slideshow.name;
		newSlideshow.groupId = group._id;
		newSlideshow.save();

		return {status: true, message: 'Слайдшоу успешно передано'};
	},

	[methodNames.slideshow.changeNumber](slideshowId: string, numId: string): IMethodReturn {
		check(slideshowId, String);
		check(numId, String);

		if (!this.userId || !Roles.userIsInRole(this.userId, 'admin')) {
			throw new Error('Недостаточно прав');
		}

		const slideshow = Slideshow.findOne({_id: slideshowId});

		if (!slideshow) {
			return {status: false, message: 'Слайдшоу не найдено'};
		}

		if (slideshow.numId === numId) {
			return {status: false, message: 'Номер не поменялся'};
		}
		if (Slideshow.findOne({_id: {$ne: slideshowId}, numId})) {
			return {status: false, message: 'Слайдшоу с таким номером уже существует'};
		}

		Slideshow.update(slideshowId, {$set: {numId}});

		return {status: true, message: 'Номер слайдшоу успешно обновлен'};
	},
	[methodNames.service.readVectorCollectionFolder](): void {
		// if (!this.userId || !Roles.userIsInRole(this.userId, 'admin')) {
		// 	throw new Error('Недостаточно прав');
		// }
		let fut = new Future();
		let arr = [];
		const tagsObj = {
			element: ['element'],
			element1: ['element'],
			clock: ['clock'],
			weather: ['weather'],
			ribbon: ['ribbon', 'element'],
			food: ['food'],
		};
		const namesObj = {
			element: 'Элемент',
			element1: 'Элемент',
			clock: 'Часы',
			weather: 'Погода',
			ribbon: 'Лента',
			food: 'Еда',
		};
		fs.readdir(process.env.PWD + '/programs/web.browser/app/svg', (err, files) => {
			if (err) {
				console.log(err);
				fut.return(err);
			} else {
				files.forEach(async (file, i) => {
					if (file === '.DS_Store') {
					} else {
						let matches = file.match(/^([a-zA-Z]*)(\d*)_(\d*)\.svg/i);
						if (matches && parseInt(matches[1]) > 0) {
							if (matches[1] === 'elements') {
								matches[1] = 'element';
							}
							if (matches[1] === '') {
								matches[1] = 'element1';
							}
							// console.log(matches);
							let path = file;
							let name = `${namesObj[matches[1]]} ${matches[2]} ${matches[3]}`;
							let tags = tagsObj[matches[1]];

							// await fs.rename(
							// 	`${process.env.PWD}/programs/web.browser/app/svg/${file}`,
							// 	`${process.env.PWD}/programs/web.browser/app/svg/${path}`,
							// 	(err) => {
							// 		if (err) throw err;
							// 	},
							// );
							const vElement = new SlideVectorElement({
								name,
								tags,
								path,
							});
							vElement.save();
							arr.push(path);
						} else {
							arr.push(file);
						}
						if (i + 1 === files.length) fut.return(arr);
					}
				});
			}
		});
		// return arr;
		return fut.wait();
	},
});
