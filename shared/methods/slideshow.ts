import {check} from 'meteor/check';
import {Meteor} from 'meteor/meteor';
import uniq from 'lodash/uniq';
import isNumber from 'lodash/isNumber';
import isArray from 'lodash/isArray';
import has from 'lodash/has';

import {methodNames} from '../constants/methodNames';
import {IUpdateSlideElementParams} from '../models/SlideshowMethodParams';
import {Slideshow} from '../collections/Slideshows';
import {
	ISlideElement,
	SlideElement,
	SlideElementClockViewEnum,
	SlideElementCurrenciesEnum,
	SlideElementDirectionTypeEnum,
	SlideElementLogoPositionType,
	SlideElementSocialDisplayEnum,
	SlideElementTextAlignEnum,
	SlideElementTransportTypeEnum,
	SlideElementTypeEnum,
	SlideElementVideoDisplayEnum,
	SlideElementVkMethodShowEnum,
	SlideElementTelegramMethodShowEnum,
	SlideElementSubstanceTypeEnum,
	SlideElementVideoProviderEnum,
	ZoomElementRoleEnum,
} from '../collections/SlideElements';
import {removeUndefinedFields} from '../utils/methods';
import {ISlide, Slide} from 'shared/collections/Slides';
import {googleFonts} from 'shared/models/GoogleFonts';
import {TwitterGetTypeEnum} from 'shared/collections/Twitter';
import {sharedConsts} from 'shared/constants/sharedConsts';

const setActiveFontsFromEditor = (slideshowId: string, text: string) => {
	const slideshow = Slideshow.findOne({_id: slideshowId});
	let activeFonts = slideshow.activeFonts || [];

	(text.match(/font-family:.*?;/g) || []).forEach((match: string) => {
		const font = match
			.replace(/font-family:(.*?);/g, '$1')
			.replace(/["']/g, '')
			.trim();

		activeFonts = [...activeFonts, font];
	});

	slideshow.activeFonts = uniq(activeFonts).filter((fontFamily: string) =>
		googleFonts.includes(fontFamily),
	);
	slideshow.save();
};

export const setActiveFonts = (slideshowId: string) => {
	const slideshow = Slideshow.findOne({_id: slideshowId});
	const slideElements = SlideElement.find({slideshowId});
	const slides = Slide.find({slideshowId});
	let activeFonts: string[] = [slideshow.styles.elementFontFamily];

	slides.forEach((slide: ISlide) => {
		if (!slide.styles) {
			return;
		}
		activeFonts = [...activeFonts, slide.styles.elementFontFamily];
	});

	slideElements.forEach((element: ISlideElement) => {
		if (element.type === SlideElementTypeEnum.TEXT && element.text) {
			(element.text.match(/font-family:.*?;/g) || []).forEach((match: string) => {
				const font = match
					.replace(/font-family:(.*?);/g, '$1')
					.replace(/["']/g, '')
					.trim();

				activeFonts = [...activeFonts, font];
			});
		}

		if (element.fontFamily) {
			activeFonts.push(element.fontFamily);
		}

		if (element.socialTextFont) {
			activeFonts.push(element.socialTextFont);
		}

		if (element.socialDateFont) {
			activeFonts.push(element.socialDateFont);
		}

		if (element.socialHeaderFont) {
			activeFonts.push(element.socialHeaderFont);
		}
	});
	// TOOD maybe add google fonts here

	slideshow.activeFonts = uniq(activeFonts).filter((fontFamily: string) =>
		googleFonts.includes(fontFamily),
	);
	slideshow.save();
};

Meteor.methods({
	// Добавляет элемент на слайд
	[methodNames.slideshow.addElement](
		slideId: string,
		elementType: SlideElementTypeEnum,
	): ISlideElement {
		check(slideId, String);
		check(elementType, String);

		if (!this.userId) {
			throw new Error('Недостаточно прав');
		}

		const slide = Slide.findOne({_id: slideId});
		const slideshow = Slideshow.findOne({_id: slide.slideshowId});

		if (slide === undefined) {
			throw new Error('Слайд не найден');
		}

		let elementFields: Partial<ISlideElement>;

		const {styles} = slide;

		switch (elementType) {
			case SlideElementTypeEnum.TEXT:
				elementFields = {
					top: 100,
					width: 500,
					height: 120,
					text: `
						<p>
							<span style="font-size: 30px; font-family: Arial;">
								Кликните 2 раза здесь, чтобы отредактировать текст
							</span>
						</p>
					`,
					textAlign: SlideElementTextAlignEnum.LEFT,
					lineHeight: 1,
					letterSpacing: 0,
					padding: 0,
					fontFamily: styles.elementFontFamily,
					backgroundColor: styles.elementBackgroundColor,
					backgroundImage: styles.elementBackgroundImage,
					backgroundImageDisplay: styles.elementBackgroundImageDisplay,
				};

				break;

			case SlideElementTypeEnum.TICKER:
				elementFields = {
					top: 100,
					width: 500,
					height: 50,
					text: 'Введите текст',
					tickerDirection: SlideElementDirectionTypeEnum.TOLEFT,
					tickerSpeed: 20,
					textAlign: SlideElementTextAlignEnum.LEFT,
					fontSize: 40,
					fontFamily: styles.elementFontFamily,
					backgroundColor: styles.elementBackgroundColor,
					backgroundImage: styles.elementBackgroundImage,
					backgroundImageDisplay: styles.elementBackgroundImageDisplay,
				};

				break;

			case SlideElementTypeEnum.HTML:
				elementFields = {
					width: 400,
					height: 200,
					html: 'Введите HTML',
					backgroundColor: styles.elementBackgroundColor,
					backgroundImage: styles.elementBackgroundImage,
					backgroundImageDisplay: styles.elementBackgroundImageDisplay,
					htmlUpdate: 0,
				};

				break;

			case SlideElementTypeEnum.IMAGE:
				elementFields = {
					width: 500,
					height: 500,
					retainAspectRatio: true,
					backgroundImageDisplay: styles.elementBackgroundImageDisplay,
				};

				break;

			case SlideElementTypeEnum.CLOCK:
				elementFields = {
					width: 300,
					height: 150,
					fontSize: 34,
					city: 'Москва',
					clockView: SlideElementClockViewEnum.CLOCK,
					backgroundColor: styles.elementBackgroundColor,
					backgroundImage: styles.elementBackgroundImage,
					backgroundImageDisplay: styles.elementBackgroundImageDisplay,
				};

				break;

			case SlideElementTypeEnum.TRANSPORT_SCHEDULE:
				elementFields = {
					transportType: SlideElementTransportTypeEnum.BUS,
					toCity: 'Казань',
					fromCity: 'Москва',
					fontSize: 24,
					width: 650,
					height: 600,
					backgroundColor: styles.elementBackgroundColor,
					backgroundImage: styles.elementBackgroundImage,
					backgroundImageDisplay: styles.elementBackgroundImageDisplay,
				};

				break;

			case SlideElementTypeEnum.WEATHER:
				elementFields = {
					location: 'Москва',
					displayDays: 2,
					fontSize: 30,
					width: 1500,
					height: 670,
					backgroundColor: styles.elementBackgroundColor,
					backgroundImage: styles.elementBackgroundImage,
					backgroundImageDisplay: styles.elementBackgroundImageDisplay,
				};

				break;

			case SlideElementTypeEnum.TWITTER:
				elementFields = {
					width: 500,
					height: 800,
					twitterGetType: TwitterGetTypeEnum.HASHTAG,
					twitterHashtag: 'mtv',
					twitterProfileName: 'mtv',
					twitterProfileNameForList: 'NYTNow',
					twitterProfileNameForCollection: 'NYTNow',
					twitsCount: 5,
					backgroundColor: styles.elementBackgroundColor,
					backgroundImage: styles.elementBackgroundImage,
					backgroundImageDisplay: styles.elementBackgroundImageDisplay,
					socialDisplay: SlideElementSocialDisplayEnum.MEDIA_TOP,
					twitterCollectionId: 'custom-524462665612005376',
					twitterCollections: [
						{
							label: 'Oscar de la Renta',
							collectionId: 'custom-524462665612005376',
						},
						{
							label: 'Dyeing the Chicago River',
							collectionId: 'custom-576828964162965504',
						},
						{
							label: 'Times Square - Aug 5',
							collectionId: 'custom-496745540563263488',
						},
					],
					twitterLists: [
						{
							label: 'Vote Early Day',
							listId: '1235598485459791872',
						},
						{
							label: 'SnowGlobe 2020',
							listId: '1182041503197224960',
						},
					],
					twitterListId: '1235598485459791872',
				};

				break;

			case SlideElementTypeEnum.CURRENCY_RATE:
				elementFields = {
					width: 400,
					height: 150,
					fontSize: 24,
					currencyList: [SlideElementCurrenciesEnum.USD, SlideElementCurrenciesEnum.EUR],
					backgroundColor: styles.elementBackgroundColor,
					backgroundImage: styles.elementBackgroundImage,
					backgroundImageDisplay: styles.elementBackgroundImageDisplay,
				};

				break;

			case SlideElementTypeEnum.ODNOKLASSNIKI:
				elementFields = {
					width: 500,
					height: 800,
					okGroupLink: 'https://ok.ru/group/55155137118463',
					okPostCount: 5,
					backgroundColor: styles.elementBackgroundColor,
					backgroundImage: styles.elementBackgroundImage,
					backgroundImageDisplay: styles.elementBackgroundImageDisplay,
					socialDisplay: SlideElementSocialDisplayEnum.MEDIA_TOP,
				};

				break;

			case SlideElementTypeEnum.TRAFFIC_JAM:
				let defaultLocation = 'Москва, ул. Тверская, 13';

				if (slideshow.address) {
					defaultLocation = slideshow.address;
				}

				elementFields = {
					width: 500,
					height: 500,
					location: defaultLocation,
					zoom: 10,
				};

				break;

			case SlideElementTypeEnum.VKONTAKTE:
				elementFields = {
					width: 600,
					height: 800,
					vkGroupId: 'leprazo',
					vkPostCount: 5,
					backgroundColor: styles.elementBackgroundColor,
					backgroundImage: styles.elementBackgroundImage,
					backgroundImageDisplay: styles.elementBackgroundImageDisplay,
					socialDisplay: SlideElementSocialDisplayEnum.MEDIA_TOP,
					vkMethodShow: SlideElementVkMethodShowEnum.GROUP,
				};

				break;

			case SlideElementTypeEnum.TELEGRAM:
				elementFields = {
					width: 450,
					height: 800,
					telegramChannelId: 'meduzalive',
					telegramPostCount: 5,
					backgroundColor: styles.elementBackgroundColor,
					backgroundImage: styles.elementBackgroundImage,
					backgroundImageDisplay: styles.elementBackgroundImageDisplay,
					socialDisplay: SlideElementSocialDisplayEnum.MEDIA_TOP,
					telegramMethodShow: SlideElementTelegramMethodShowEnum.CHANNEL,
				};

				break;

			case SlideElementTypeEnum.RSS:
				elementFields = {
					width: 500,
					height: 800,
					rssUrl: 'https://lenta.ru/rss/news',
					rssItemsCount: 5,
					fontSize: 24,
					backgroundColor: styles.elementBackgroundColor,
					backgroundImage: styles.elementBackgroundImage,
					backgroundImageDisplay: styles.elementBackgroundImageDisplay,
				};

				break;

			case SlideElementTypeEnum.FACEBOOK:
				elementFields = {
					width: 500,
					height: 800,
					fbGroupId: 'DonaldTrump',
					fbPostCount: 5,
					backgroundColor: styles.elementBackgroundColor,
					backgroundImage: styles.elementBackgroundImage,
					backgroundImageDisplay: styles.elementBackgroundImageDisplay,
					socialDisplay: SlideElementSocialDisplayEnum.MEDIA_TOP,
				};

				break;

			case SlideElementTypeEnum.INSTAGRAM:
				elementFields = {
					width: 600,
					height: 750,
					instagramName: 'instagram',
					instagramPhotoCount: 10,
					instagramInterval: 5,
					postShowByOne: true,
					backgroundColor: styles.elementBackgroundColor,
					backgroundImage: styles.elementBackgroundImage,
					backgroundImageDisplay: styles.elementBackgroundImageDisplay,
					socialDisplay: SlideElementSocialDisplayEnum.MEDIA_TOP,
				};

				break;

			case SlideElementTypeEnum.YOUTUBE:
				elementFields = {
					retainAspectRatio: true,
					width: 800,
					height: 450,
					videoLink: 'https://www.youtube.com/watch?v=YqeW9_5kURI',
					videoLogo: '',
					logoPosition: SlideElementLogoPositionType.TOPLEFT,
					blockTransition: false,
					videoDisplay: SlideElementVideoDisplayEnum.NONE,
					socialDisplay: SlideElementSocialDisplayEnum.MEDIA_TOP,
					videoProvider: SlideElementVideoProviderEnum.YOUTUBE,
					videoItemCount: 10,
				};

				break;

			case SlideElementTypeEnum.AIR_QUALITY:
				elementFields = {
					width: 650,
					height: 600,
					zoom: 10,
					airQualityCoordinates: [
						sharedConsts.ya.default.lat,
						sharedConsts.ya.default.len,
					],
					substanceType: SlideElementSubstanceTypeEnum.DEFALUT,
				};

				break;

			case SlideElementTypeEnum.ZOOM:
				elementFields = {
					width: 800,
					height: 600,
					zoom_role: ZoomElementRoleEnum.PARTICIPANT,
				};

				break;

			default:
				throw new Error('Неизвестный элемент');
		}

		const socialNetworks = [
			SlideElementTypeEnum.VKONTAKTE,
			SlideElementTypeEnum.TELEGRAM,
			SlideElementTypeEnum.TWITTER,
			SlideElementTypeEnum.ODNOKLASSNIKI,
			SlideElementTypeEnum.INSTAGRAM,
			SlideElementTypeEnum.FACEBOOK,
		];

		if (socialNetworks.includes(elementType)) {
			elementFields = {
				postShowByOne: false,
				postShowTime: 5,
				...elementFields,
				socialHeaderFontSize: 30,
				socialHeaderColor: styles.elementTextColor,
				socialHeaderBackgroundColor: '',
				socialHeaderFont: styles.elementFontFamily,
				socialTextFontSize: 22,
				socialTextColor: styles.elementTextColor,
				socialTextBackgroundColor: '',
				socialTextFont: styles.elementFontFamily,
				socialDateFontSize: 16,
				socialDateColor: styles.elementTextColor,
				socialDateBackgroundColor: '',
				socialDateFont: styles.elementFontFamily,
				backgroundColor: styles.elementBackgroundColor,
			};
		}

		if (socialNetworks.includes(SlideElementTypeEnum.TELEGRAM)) {
			elementFields = {
				...elementFields,
				socialHeaderFontSize: 22,
			};
		}

		const slideElement = new SlideElement({
			slideshowId: slide.slideshowId,
			slideId,
			type: elementType,
			top: 10,
			zIndex: SlideElement.find({slideshowId: slide.slideshowId, slideId}).count() + 1,
			left: 10,
			...elementFields,
			textColor: styles.elementTextColor,
			fontFamily: styles.elementFontFamily,
			opacity: 1,
			permanent: false,
			permanentAtAll: true,
		});

		slideElement.save();

		setActiveFonts(slide.slideshowId);

		return slideElement;
	},

	// Обновляет настройки элемента на слайде
	[methodNames.slideshow.updateElement](
		slideElementId: string,
		elementData: IUpdateSlideElementParams,
	) {
		check(slideElementId, String);
		check(elementData, Object);
		if (!this.userId) {
			throw new Error('Недостаточно прав');
		}

		const slideElement = SlideElement.findOne({_id: slideElementId});

		if (slideElement === undefined) {
			throw new Error('Элемент слайда не найден');
		}

		let elementFields: Partial<ISlideElement>;

		switch (slideElement.type) {
			case SlideElementTypeEnum.TEXT:
				elementFields = {
					text: elementData.text,
					textAlign: elementData.textAlign,
					lineHeight: elementData.lineHeight,
					letterSpacing: elementData.letterSpacing,
					padding: elementData.padding,
				};

				if (elementData.text !== slideElement.text) {
					setActiveFontsFromEditor(slideElement.slideshowId, elementData.text || '');
				}

				break;

			case SlideElementTypeEnum.HTML:
				elementFields = {
					html: elementData.html,
					htmlUpdate: elementData.htmlUpdate,
				};

				break;

			case SlideElementTypeEnum.TICKER:
				elementFields = {
					text: elementData.text,
					tickerDirection: elementData.tickerDirection,
					tickerSpeed: elementData.tickerSpeed,
				};

				break;

			case SlideElementTypeEnum.IMAGE:
				elementFields = {
					retainAspectRatio: elementData.retainAspectRatio,
				};

				break;

			case SlideElementTypeEnum.CURRENCY_RATE:
				elementFields = {
					currencyList: elementData.currencyList,
				};

				break;

			case SlideElementTypeEnum.CLOCK:
				elementFields = {
					city: elementData.city,
					clockView: elementData.clockView,
				};

				break;

			case SlideElementTypeEnum.TRANSPORT_SCHEDULE:
				elementFields = {
					transportType: elementData.transportType,
					fromCity: elementData.fromCity,
					toCity: elementData.toCity,
				};

				break;

			case SlideElementTypeEnum.TRAFFIC_JAM:
				elementFields = {
					location: elementData.location,
					lat: elementData.lat,
					lon: elementData.lon,
					zoom: elementData.zoom,
					trafficService: elementData.trafficService,
				};

				break;

			case SlideElementTypeEnum.TWITTER:
				elementFields = {
					twitterGetType: elementData.twitterGetType,
					twitterHashtag: elementData.twitterHashtag,
					twitterProfileName: elementData.twitterProfileName,
					twitterProfileNameForList: elementData.twitterProfileNameForList,
					twitterLists: elementData.twitterLists,
					twitterListId: elementData.twitterListId,
					twitterProfileNameForCollection: elementData.twitterProfileNameForCollection,
					twitterCollections: elementData.twitterCollections,
					twitterCollectionId: elementData.twitterCollectionId,
					twitterHashtagFilter: elementData.twitterHashtagFilter,
					twitsCount: elementData.twitsCount,
					twitsHideText: elementData.twitsHideText,
					postShowByOne: elementData.postShowByOne,
					postShowTime: elementData.postShowTime,
					videoDisplay: elementData.videoDisplay,
					videoType: elementData.videoType,
				};

				break;

			case SlideElementTypeEnum.ODNOKLASSNIKI:
				elementFields = {
					okGroupLink: elementData.okGroupLink,
					okPostCount: elementData.okPostCount,
					okHideText: elementData.okHideText,
					postShowByOne: elementData.postShowByOne,
					postShowTime: elementData.postShowTime,
					videoDisplay: elementData.videoDisplay,
					videoType: elementData.videoType,
				};

				break;

			case SlideElementTypeEnum.WEATHER:
				elementFields = {
					location: elementData.location,
					displayDays: elementData.displayDays,
				};

				break;

			case SlideElementTypeEnum.VKONTAKTE:
				elementFields = {
					vkGroupId: elementData.vkGroupId,
					vkPostCount: elementData.vkPostCount,
					vkHideText: elementData.vkHideText,
					vkMethodShow: elementData.vkMethodShow,
					postShowByOne: elementData.postShowByOne,
					postShowTime: elementData.postShowTime,
					videoDisplay: elementData.videoDisplay,
					videoType: elementData.videoType,
				};

				break;

			case SlideElementTypeEnum.TELEGRAM:
				elementFields = {
					telegramChannelId: elementData.telegramChannelId,
					telegramPostCount: elementData.telegramPostCount,
					telegramHideText: elementData.telegramHideText,
					telegramHideImage: elementData.telegramHideImage,
					telegramMethodShow: elementData.telegramMethodShow,
					postShowByOne: elementData.postShowByOne,
					postShowTime: elementData.postShowTime,
				};

				break;

			case SlideElementTypeEnum.RSS:
				elementFields = {
					rssUrl: elementData.rssUrl,
					rssItemsCount: elementData.rssItemsCount,
				};

				break;

			case SlideElementTypeEnum.FACEBOOK:
				elementFields = {
					fbGroupId: elementData.fbGroupId,
					fbPostCount: elementData.fbPostCount,
					fbHideText: elementData.fbHideText,
					postShowByOne: elementData.postShowByOne,
					postShowTime: elementData.postShowTime,
					videoDisplay: elementData.videoDisplay,
					videoType: elementData.videoType,
				};

				break;

			case SlideElementTypeEnum.INSTAGRAM:
				elementFields = {
					instagramName: elementData.instagramName,
					instagramPhotoCount: elementData.instagramPhotoCount,
					instagramInterval: elementData.instagramInterval,
					instagramHideText: elementData.instagramHideText,
					postShowByOne: elementData.postShowByOne,
					postShowTime: elementData.postShowTime,
					videoDisplay: elementData.videoDisplay,
					videoType: elementData.videoType,
				};

				break;

			case SlideElementTypeEnum.YOUTUBE: {
				elementFields = {
					videoLink: elementData.videoLink,
					videoLogo: elementData.videoLogo,
					logoPosition: elementData.logoPosition,
					retainAspectRatio: elementData.retainAspectRatio,
					blockTransition: elementData.blockTransition,
					videoDisplay: elementData.videoDisplay,
					videoType: elementData.videoType,
					videoItemCount: elementData.videoItemCount,
					videoProvider: elementData.videoProvider,
					vkVideo: elementData.vkVideo,
					vkVideoAlbumId: elementData.vkVideoAlbumId,
				};

				if (elementData.retainAspectRatio) {
					const {width} = slideElement;
					elementData.height = (width / 16) * 9;
				}

				break;
			}

			case SlideElementTypeEnum.AIR_QUALITY: {
				elementFields = {
					airQualityCoordinates: elementData.airQualityCoordinates,
					substanceType: elementData.substanceType,
					zoom: elementData.zoom,
				};

				break;
			}

			case SlideElementTypeEnum.ZOOM: {
				elementFields = {
					zoom_meetingNumber: elementData.zoom_meetingNumber,
					zoom_role: elementData.zoom_role,
					zoom_userName: elementData.zoom_userName,
					zoom_userEmail: elementData.zoom_userEmail,
					zoom_password: elementData.zoom_password,
					zoom_sdkKey: elementData.zoom_sdkKey,
					zoom_sdkSecret: elementData.zoom_sdkSecret,
				};

				break;
			}

			default:
				throw new Error('Неизвестный элемент');
		}

		if (isNumber(elementData.zIndex)) {
			const maxZIndex = SlideElement.find({
				slideshowId: slideElement.slideshowId,
				slideId: slideElement.slideId,
			}).count();

			const nextElement = SlideElement.findOne({
				slideshowId: slideElement.slideshowId,
				_id: {$ne: slideElement._id},
				slideId: slideElement.slideId,
				zIndex: elementData.zIndex,
			});

			if (elementData.zIndex > maxZIndex) {
				elementData.zIndex = maxZIndex;
			}

			if (!elementData.zIndex || elementData.zIndex < 1) {
				elementData.zIndex = 1;
			}

			if (nextElement) {
				const newIndex = nextElement.zIndex + (slideElement.zIndex - elementData.zIndex);

				nextElement.set({zIndex: newIndex});
				nextElement.save();
			}
		}

		slideElement.set(
			removeUndefinedFields({
				href: elementData.href,
				collectStat: elementData.collectStat,
				statisticId: elementData.statisticId,
				width: elementData.width,
				height: elementData.height,
				top: elementData.top,
				left: elementData.left,

				//стили
				backgroundColor: elementData.backgroundColor,
				backgroundImage: elementData.backgroundImage,
				backgroundImageDisplay: elementData.backgroundImageDisplay,
				fontFamily: elementData.fontFamily,
				fontSize: elementData.fontSize,
				textColor: elementData.textColor,
				borderColor: elementData.borderColor,
				borderWidth: elementData.borderWidth,
				borderStyle: elementData.borderStyle,
				borderImage: elementData.borderImage,
				//конец стилей

				transitionType: elementData.transitionType,
				transitionDelay: elementData.transitionDelay,
				transitionDuration: elementData.transitionDuration,
				transitionCount: elementData.transitionCount,

				socialDisplay: elementData.socialDisplay,
				opacity: elementData.opacity,
				permanent: elementData.permanent,
				permanentPosition: elementData.permanentPosition,
				permanentAtAll: elementData.permanentAtAll,
				permanentOnSlides: elementData.permanentOnSlides,
				zIndex: elementData.zIndex,
				hideTitle: elementData.hideTitle,
				rotateStep: elementData.rotateStep,
				...elementFields,
			}),
		);

		if (has(elementData, 'rotateAngle')) {
			if (elementData.rotateAngle) slideElement.rotateAngle = elementData.rotateAngle;
			else delete slideElement.rotateAngle;
		}
		if (has(elementData, 'warpMatrix')) {
			if (isArray(elementData.warpMatrix)) slideElement.warpMatrix = elementData.warpMatrix;
			else delete slideElement.warpMatrix;
		}
		if (has(elementData, 'scale')) {
			if (isArray(elementData.scale)) slideElement.scale = elementData.scale;
			else delete slideElement.scale;
		}

		slideElement.save();

		setActiveFonts(slideElement.slideshowId);
	},

	// Дублирует элемент слайда
	[methodNames.slideshow.duplicateElement](
		slideshowId: string,
		slideElementId: string,
		slideId: string,
	): string {
		check(slideshowId, String);
		check(slideElementId, String);

		if (slideId) {
			check(slideId, String);
		}

		if (!this.userId) {
			throw new Error('Недостаточно прав');
		}

		const slideshow = Slideshow.findOne({_id: slideshowId, userId: this.userId});
		const slideElement = SlideElement.findOne({slideshowId, _id: slideElementId});

		if (slideshow === undefined || slideElement === undefined) {
			throw new Error('Слайдшоу не найдено');
		}

		const slideElementCopy = slideElement.copy();
		slideElementCopy.top = 10;
		slideElementCopy.left = 10;
		slideElementCopy.zIndex = SlideElement.find({slideshowId, slideId}).count() + 1;

		if (slideId) {
			slideElementCopy.slideId = slideId;
		}

		slideElementCopy.save();

		setActiveFonts(slideshowId);

		return slideElementCopy._id;
	},

	// Меняет порядок слайдов (нумерация сдайдов начинаяется с 1)
	[methodNames.slideshow.reorderSlides](
		slideshowId: string,
		slideId: string,
		newPosition: number,
	): void {
		check(slideshowId, String);
		check(slideId, String);
		check(newPosition, Number);

		if (!this.userId) {
			throw new Error('Недостаточно прав');
		}

		const slideshow = Slideshow.findOne({_id: slideshowId, userId: this.userId});
		const slide = Slide.findOne({_id: slideId, slideshowId});

		if (slideshow === undefined || slide === undefined) {
			throw new Error('Слайдшоу не найдено');
		}

		const slidesCount = Slide.find({slideshowId}).count();

		if (newPosition <= 0 || newPosition > slidesCount) {
			throw new Error('Неверный номер слайда');
		}

		const oldPosition = slide.position;

		if (oldPosition === newPosition) {
			return;
		}

		// Перетаскивание слайда ближе к началу
		if (oldPosition > newPosition) {
			Slide.update(
				{slideshowId, position: {$gte: newPosition, $lt: oldPosition}},
				{$inc: {position: 1}},
				{multi: true},
			);
		}
		// Перетаскивание слайда ближе к концу
		else {
			Slide.update(
				{slideshowId, position: {$gt: oldPosition, $lte: newPosition}},
				{$inc: {position: -1}},
				{multi: true},
			);
		}

		slide.position = newPosition;
		slide.save();
	},
});
