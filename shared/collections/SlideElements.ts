import {Mongo} from 'meteor/mongo';
import {Class, Enum} from 'meteor/jagi:astronomy';

import {getDefaultTimestamp} from 'shared/utils/collections';
import {
	SlideshowBackgroundImageDisplayEnum,
	SlideshowBackgroundImageDisplay,
} from 'shared/collections/Slideshows';
import {TwitterGetType, TwitterGetTypeEnum} from 'shared/collections/Twitter';
import {Meteor} from 'meteor/meteor';

export interface ISlideElementAdditionalFonts {
	additionalFonts?: string[];
}

export interface ISlideElement {
	_id: string;
	slideshowId: string;
	slideId: string;
	isForMockup: boolean;
	type: SlideElementTypeEnum;
	createdAt: Date;
	updatedAt: Date;

	// Общие настройки элемента
	href?: string | null;
	width: number;
	height: number;
	top: number;
	left: number;
	opacity: number;
	rotateAngle?: number;
	rotateStep?: number;
	warpMatrix?: number[];
	scale?: number[];

	// стили элемента
	backgroundColor?: string;
	backgroundImage?: string;
	backgroundImageDisplay?: SlideshowBackgroundImageDisplayEnum;
	fontFamily?: string;
	fontSize?: number;
	textColor?: string;
	borderColor: string;
	borderWidth?: number;
	borderStyle?: SlideElementBorderStyleDisplayEnum;
	borderImage: string;
	// конец стили элемента

	//анимация
	transitionType?: SlideElementTransitionEnum;
	transitionDelay?: number;
	transitionDuration?: number;
	transitionCount?: number;
	//конец анимации

	zoom?: number;
	zIndex: number;
	retainAspectRatio?: boolean;
	permanent?: boolean;
	permanentPosition: PermanentPositionEnum;
	permanentAtAll: boolean;
	permanentOnSlides: string[];
	hideTitle?: boolean;

	// статистика - реклама
	collectStat?: boolean;
	statisticId?: string;

	// Элемент Text
	text?: string;
	textAlign?: SlideElementTextAlignEnum;
	lineHeight?: number;
	letterSpacing?: number;
	padding?: number;

	// Элемент Ticker
	tickerSpeed?: number;
	tickerDirection?: string;

	// Элемент Html
	html?: string;
	htmlUpdate?: number;

	// Элелемент Clock
	city?: string;
	clockView?: SlideElementClockViewEnum;

	// Элемент Schedule
	transportType?: SlideElementTransportTypeEnum;
	fromCity?: string;
	toCity?: string;

	// Элемент Weather
	location?: string;
	displayDays?: number;

	// Элемент Currency rate
	currencyList?: SlideElementCurrenciesEnum[];

	// Элемент Traffic
	lat?: string;
	lon?: string;
	trafficService?: SlideElementTrafficServiceEnum;

	// Элемент Twitter
	twitterGetType?: TwitterGetTypeEnum;
	twitterHashtag?: string;
	twitterProfileName?: string;
	twitterProfileNameForList?: string;
	twitterLists?: {
		listId: string;
		label: string;
	}[];
	twitterListId?: string;
	twitterProfileNameForCollection?: string;
	twitterUsersForCollections?: ITwitterUserForCollections[];
	twitterCollections?: {
		collectionId: string;
		label: string;
	}[];
	twitterHashtagFilter?: SlideElementTwitterHashtagFilterEnum;
	twitterCollectionId?: string;
	twitsCount?: number;
	twitsHideText?: boolean;

	// Элемент Одноклассники
	okGroupLink?: string;
	okPostCount?: number;
	okHideText?: boolean;

	// Элемент FB
	fbGroupId?: string;
	fbPostCount?: number;
	fbHideText?: boolean;

	// Элемент ВК
	vkGroupId?: string;
	vkPostCount?: number;
	vkHideText?: boolean;
	vkMethodShow?: SlideElementVkMethodShowEnum;

	// Элемент Телеграм
	telegramChannelId?: string;
	telegramPostCount?: number;
	telegramMethodShow?: SlideElementTelegramMethodShowEnum;
	telegramHideText?: boolean;
	telegramHideImage?: boolean;

	// Элемент RSS
	rssUrl?: string;
	rssItemsCount?: number;
	rssTitle?: string;
	rssDescription?: string;
	rssImageUrl?: string;

	// Элемент Instagram
	instagramName?: string;
	instagramPhotoCount?: number;
	instagramInterval?: number;
	instagramHideText?: boolean;

	// Элемент video
	videoLink: string;
	videoType: SlideElementVideoTypeEnum;
	videoLogo: string;
	logoPosition: string;
	blockTransition: boolean;
	videoDisplay: SlideElementVideoDisplayEnum;
	videoItemCount?: number;
	videoProvider?: SlideElementVideoProviderEnum;
	vkVideoAlbumId?: number;
	vkVideo?: Object[];

	// Элемент AirQualityWidget
	airQualityCoordinates?: number[];
	substanceType?: SlideElementSubstanceTypeEnum;

	// Элемент ZoomWidget
	zoom_meetingNumber?: string;
	zoom_role?: ZoomElementRoleEnum;
	zoom_userName?: string;
	zoom_userEmail?: string;
	zoom_password?: string;
	zoom_sdkKey?: string;
	zoom_sdkSecret?: string;

	// Настройки соц сетей
	postShowByOne?: boolean;
	postShowTime?: number;
	socialHeaderFontSize?: number;
	socialHeaderColor?: string;
	socialHeaderBackgroundColor?: string;
	socialHeaderFont?: string;
	socialTextFontSize?: number;
	socialTextColor?: string;
	socialTextBackgroundColor?: string;
	socialTextFont?: string;
	socialDateFontSize?: number;
	socialDateColor?: string;
	socialDateBackgroundColor?: string;
	socialDateFont?: string;
	socialDisplay?: SlideElementSocialDisplayEnum;
}

export enum SlideElementTransitionEnum {
	NONE = 'NONE',

	FADE_IN_LEFT = 'fade in left',
	FADE_IN_RIGHT = 'fade in right',
	FADE_IN_UP = 'fade in up',
	FADE_IN_DOWN = 'fade in down',
	FADE_OUT_LEFT = 'fade out left',
	FADE_OUT_RIGHT = 'fade out right',
	FADE_OUT_UP = 'fade out up',
	FADE_OUT_DOWN = 'fade out down',

	SLIDE_IN_LEFT = 'slide in left',
	SLIDE_IN_RIGHT = 'slide in right',
	SLIDE_IN_UP = 'slide in up',
	SLIDE_IN_DOWN = 'slide in down',
	SLIDE_OUT_LEFT = 'slide out left',
	SLIDE_OUT_RIGHT = 'slide out right',
	SLIDE_OUT_UP = 'slide out up',
	SLIDE_OUT_DOWN = 'slide out down',

	FLIP_IN_LEFT = 'flip in left',
	FLIP_IN_RIGHT = 'flip in right',
	FLIP_IN_UP = 'flip in up',
	FLIP_IN_DOWN = 'flip in down',
	FLIP_OUT_LEFT = 'flip out left',
	FLIP_OUT_RIGHT = 'flip out right',
	FLIP_OUT_UP = 'flip out up',
	FLIP_OUT_DOWN = 'flip out down',

	SWING_IN_LEFT = 'swing in left',
	SWING_IN_RIGHT = 'swing in right',
	SWING_IN_UP = 'swing in up',
	SWING_IN_DOWN = 'swing in down',
	SWING_OUT_LEFT = 'swing out left',
	SWING_OUT_RIGHT = 'swing out right',
	SWING_OUT_UP = 'swing out up',
	SWING_OUT_DOWN = 'swing out down',

	FLY_IN_LEFT = 'fly in left',
	FLY_IN_RIGHT = 'fly in right',
	FLY_IN_UP = 'fly in up',
	FLY_IN_DOWN = 'fly in down',
	FLY_OUT_LEFT = 'fly out left',
	FLY_OUT_RIGHT = 'fly out right',
	FLY_OUT_UP = 'fly out up',
	FLY_OUT_DOWN = 'fly out down',

	BROWSE_IN_LEFT = 'browse in left',
	BROWSE_IN_RIGHT = 'browse in right',
	BROWSE_OUT_LEFT = 'browse out left',
	BROWSE_OUT_RIGHT = 'browse out right',

	DROP_IN = 'drop in',
	DROP_OUT = 'drop out',

	SCALE_IN = 'scale in',
	SCALE_OUT = 'scale out',

	ZOOM = 'zoom in',
	ZOOM_OUT = 'zoom out',

	FLASH = 'lash',
	SHAKE = 'shake',
	BOUNCE = 'bounce',
	TADA = 'tada',
	PULSE = 'pulse',
	JIGGLE = 'jiggle',
	GLOW = 'glow',
}

interface ISlideElementTransition {
	FADE_IN_LEFT: string;
	FADE_IN_RIGHT: string;
	FADE_IN_UP: string;
	FADE_IN_DOWN: string;
	FADE_OUT_LEFT: string;
	FADE_OUT_RIGHT: string;
	FADE_OUT_UP: string;
	FADE_OUT_DOWN: string;

	SLIDE_IN_LEFT: string;
	SLIDE_IN_RIGHT: string;
	SLIDE_IN_UP: string;
	SLIDE_IN_DOWN: string;
	SLIDE_OUT_LEFT: string;
	SLIDE_OUT_RIGHT: string;
	SLIDE_OUT_UP: string;
	SLIDE_OUT_DOWN: string;

	FLIP_IN_LEFT: string;
	FLIP_IN_RIGHT: string;
	FLIP_IN_UP: string;
	FLIP_IN_DOWN: string;
	FLIP_OUT_LEFT: string;
	FLIP_OUT_RIGHT: string;
	FLIP_OUT_UP: string;
	FLIP_OUT_DOWN: string;

	SWING_IN_LEFT: string;
	SWING_IN_RIGHT: string;
	SWING_IN_UP: string;
	SWING_IN_DOWN: string;
	SWING_OUT_LEFT: string;
	SWING_OUT_RIGHT: string;
	SWING_OUT_UP: string;
	SWING_OUT_DOWN: string;

	FLY_IN_LEFT: string;
	FLY_IN_RIGHT: string;
	FLY_IN_UP: string;
	FLY_IN_DOWN: string;
	FLY_OUT_LEFT: string;
	FLY_OUT_RIGHT: string;
	FLY_OUT_UP: string;
	FLY_OUT_DOWN: string;

	BROWSE_IN_LEFT: string;
	BROWSE_IN_RIGHT: string;
	BROWSE_OUT_LEFT: string;
	BROWSE_OUT_RIGHT: string;

	DROP_IN: string;
	DROP_OUT: string;

	SCALE_IN: string;
	SCALE_OUT: string;

	ZOOM: string;
	ZOOM_OUT: string;

	FLASH: string;
	SHAKE: string;
	BOUNCE: string;
	TADA: string;
	PULSE: string;
	JIGGLE: string;
	GLOW: string;
}

export const SlideElementTransitionText: {[key in SlideElementTransitionEnum]: string} = {
	[SlideElementTransitionEnum.NONE]: 'Без эффекта',

	[SlideElementTransitionEnum.FADE_IN_LEFT]: 'Появление слева',
	[SlideElementTransitionEnum.FADE_IN_RIGHT]: 'Появление справа',
	[SlideElementTransitionEnum.FADE_IN_UP]: 'Появление сверху',
	[SlideElementTransitionEnum.FADE_IN_DOWN]: 'Появление снизу',
	[SlideElementTransitionEnum.FADE_OUT_LEFT]: 'Затухание влево',
	[SlideElementTransitionEnum.FADE_OUT_RIGHT]: 'Затухание вправо',
	[SlideElementTransitionEnum.FADE_OUT_UP]: 'Затухание вверх',
	[SlideElementTransitionEnum.FADE_OUT_DOWN]: 'Затухание вниз',

	[SlideElementTransitionEnum.SLIDE_IN_LEFT]: 'Выезд слева',
	[SlideElementTransitionEnum.SLIDE_IN_RIGHT]: 'Выезд справа',
	[SlideElementTransitionEnum.SLIDE_IN_UP]: 'Выезд сверху',
	[SlideElementTransitionEnum.SLIDE_IN_DOWN]: 'Выезд снизу',
	[SlideElementTransitionEnum.SLIDE_OUT_LEFT]: 'Сдвиг влево',
	[SlideElementTransitionEnum.SLIDE_OUT_RIGHT]: 'Сдвиг вправо',
	[SlideElementTransitionEnum.SLIDE_OUT_UP]: 'Сдвиг вверх',
	[SlideElementTransitionEnum.SLIDE_OUT_DOWN]: 'Сдвиг вниз',

	[SlideElementTransitionEnum.FLIP_IN_LEFT]: 'Разворот слева',
	[SlideElementTransitionEnum.FLIP_IN_RIGHT]: 'Разворот справа',
	[SlideElementTransitionEnum.FLIP_IN_UP]: 'Разворот сверху',
	[SlideElementTransitionEnum.FLIP_IN_DOWN]: 'Разворот снизу',
	[SlideElementTransitionEnum.FLIP_OUT_LEFT]: 'Разворот влево',
	[SlideElementTransitionEnum.FLIP_OUT_RIGHT]: 'Разворот вправо',
	[SlideElementTransitionEnum.FLIP_OUT_UP]: 'Разворот вверх',
	[SlideElementTransitionEnum.FLIP_OUT_DOWN]: 'Разворот вниз',

	[SlideElementTransitionEnum.SWING_IN_LEFT]: 'Качели слева',
	[SlideElementTransitionEnum.SWING_IN_RIGHT]: 'Качели справа',
	[SlideElementTransitionEnum.SWING_IN_UP]: 'Качели сверху',
	[SlideElementTransitionEnum.SWING_IN_DOWN]: 'Качели снизу',
	[SlideElementTransitionEnum.SWING_OUT_LEFT]: 'Качели влево',
	[SlideElementTransitionEnum.SWING_OUT_RIGHT]: 'Качели вправо',
	[SlideElementTransitionEnum.SWING_OUT_UP]: 'Качели вверх',
	[SlideElementTransitionEnum.SWING_OUT_DOWN]: 'Качели вниз',

	[SlideElementTransitionEnum.FLY_IN_LEFT]: 'Вылет слева',
	[SlideElementTransitionEnum.FLY_IN_RIGHT]: 'Вылет справа',
	[SlideElementTransitionEnum.FLY_IN_UP]: 'Вылет сверху',
	[SlideElementTransitionEnum.FLY_IN_DOWN]: 'Вылет снизу',
	[SlideElementTransitionEnum.FLY_OUT_LEFT]: 'Улет влево',
	[SlideElementTransitionEnum.FLY_OUT_RIGHT]: 'Улет вправо',
	[SlideElementTransitionEnum.FLY_OUT_UP]: 'Улет вверх',
	[SlideElementTransitionEnum.FLY_OUT_DOWN]: 'Улет вниз',

	[SlideElementTransitionEnum.BROWSE_IN_LEFT]: 'Пояление-2 слева',
	[SlideElementTransitionEnum.BROWSE_IN_RIGHT]: 'Пояление-2 справа',
	[SlideElementTransitionEnum.BROWSE_OUT_LEFT]: 'Исчезновение влево',
	[SlideElementTransitionEnum.BROWSE_OUT_RIGHT]: 'Исчезновение вправо',

	[SlideElementTransitionEnum.DROP_IN]: 'Выпадание',
	[SlideElementTransitionEnum.DROP_OUT]: 'Падение',

	[SlideElementTransitionEnum.SCALE_IN]: 'Увеличение',
	[SlideElementTransitionEnum.SCALE_OUT]: 'Уменьшение',

	[SlideElementTransitionEnum.ZOOM]: 'Приближение',
	[SlideElementTransitionEnum.ZOOM_OUT]: 'Отдаление',

	[SlideElementTransitionEnum.FLASH]: 'Вспышка',
	[SlideElementTransitionEnum.SHAKE]: 'Тряска горизонтальная',
	[SlideElementTransitionEnum.BOUNCE]: 'Тряска вертикальная',
	[SlideElementTransitionEnum.TADA]: 'Встряска',
	[SlideElementTransitionEnum.PULSE]: 'Пульс',
	[SlideElementTransitionEnum.JIGGLE]: 'Сплющивание',
	[SlideElementTransitionEnum.GLOW]: 'Подсветка',
};

export const SlideElementTransition = Enum.create<ISlideElementTransition>({
	name: 'SlideElementTransition',
	identifiers: {
		NONE: SlideElementTransitionEnum.NONE,

		FADE_IN_LEFT: SlideElementTransitionEnum.FADE_IN_LEFT,
		FADE_IN_RIGHT: SlideElementTransitionEnum.FADE_IN_RIGHT,
		FADE_IN_UP: SlideElementTransitionEnum.FADE_IN_UP,
		FADE_IN_DOWN: SlideElementTransitionEnum.FADE_IN_DOWN,
		FADE_OUT_LEFT: SlideElementTransitionEnum.FADE_OUT_LEFT,
		FADE_OUT_RIGHT: SlideElementTransitionEnum.FADE_OUT_RIGHT,
		FADE_OUT_UP: SlideElementTransitionEnum.FADE_OUT_UP,
		FADE_OUT_DOWN: SlideElementTransitionEnum.FADE_OUT_DOWN,

		SLIDE_IN_LEFT: SlideElementTransitionEnum.SLIDE_IN_LEFT,
		SLIDE_IN_RIGHT: SlideElementTransitionEnum.SLIDE_IN_RIGHT,
		SLIDE_IN_UP: SlideElementTransitionEnum.SLIDE_IN_UP,
		SLIDE_IN_DOWN: SlideElementTransitionEnum.SLIDE_IN_DOWN,
		SLIDE_OUT_LEFT: SlideElementTransitionEnum.SLIDE_OUT_LEFT,
		SLIDE_OUT_RIGHT: SlideElementTransitionEnum.SLIDE_OUT_RIGHT,
		SLIDE_OUT_UP: SlideElementTransitionEnum.SLIDE_OUT_UP,
		SLIDE_OUT_DOWN: SlideElementTransitionEnum.SLIDE_OUT_DOWN,

		FLIP_IN_LEFT: SlideElementTransitionEnum.FLIP_IN_LEFT,
		FLIP_IN_RIGHT: SlideElementTransitionEnum.FLIP_IN_RIGHT,
		FLIP_IN_UP: SlideElementTransitionEnum.FLIP_IN_UP,
		FLIP_IN_DOWN: SlideElementTransitionEnum.FLIP_IN_DOWN,
		FLIP_OUT_LEFT: SlideElementTransitionEnum.FLIP_OUT_LEFT,
		FLIP_OUT_RIGHT: SlideElementTransitionEnum.FLIP_OUT_RIGHT,
		FLIP_OUT_UP: SlideElementTransitionEnum.FLIP_OUT_UP,
		FLIP_OUT_DOWN: SlideElementTransitionEnum.FLIP_OUT_DOWN,

		SWING_IN_LEFT: SlideElementTransitionEnum.SWING_IN_LEFT,
		SWING_IN_RIGHT: SlideElementTransitionEnum.SWING_IN_RIGHT,
		SWING_IN_UP: SlideElementTransitionEnum.SWING_IN_UP,
		SWING_IN_DOWN: SlideElementTransitionEnum.SWING_IN_DOWN,
		SWING_OUT_LEFT: SlideElementTransitionEnum.SWING_OUT_LEFT,
		SWING_OUT_RIGHT: SlideElementTransitionEnum.SWING_OUT_RIGHT,
		SWING_OUT_UP: SlideElementTransitionEnum.SWING_OUT_UP,
		SWING_OUT_DOWN: SlideElementTransitionEnum.SWING_OUT_DOWN,

		FLY_IN_LEFT: SlideElementTransitionEnum.FLY_IN_LEFT,
		FLY_IN_RIGHT: SlideElementTransitionEnum.FLY_IN_RIGHT,
		FLY_IN_UP: SlideElementTransitionEnum.FLY_IN_UP,
		FLY_IN_DOWN: SlideElementTransitionEnum.FLY_IN_DOWN,
		FLY_OUT_LEFT: SlideElementTransitionEnum.FLY_OUT_LEFT,
		FLY_OUT_RIGHT: SlideElementTransitionEnum.FLY_OUT_RIGHT,
		FLY_OUT_UP: SlideElementTransitionEnum.FLY_OUT_UP,
		FLY_OUT_DOWN: SlideElementTransitionEnum.FLY_OUT_DOWN,

		BROWSE_IN_LEFT: SlideElementTransitionEnum.BROWSE_IN_LEFT,
		BROWSE_IN_RIGHT: SlideElementTransitionEnum.BROWSE_IN_RIGHT,
		BROWSE_OUT_LEFT: SlideElementTransitionEnum.BROWSE_OUT_LEFT,
		BROWSE_OUT_RIGHT: SlideElementTransitionEnum.BROWSE_OUT_RIGHT,

		DROP_IN: SlideElementTransitionEnum.DROP_IN,
		DROP_OUT: SlideElementTransitionEnum.DROP_OUT,

		SCALE_IN: SlideElementTransitionEnum.SCALE_IN,
		SCALE_OUT: SlideElementTransitionEnum.SCALE_OUT,

		ZOOM: SlideElementTransitionEnum.ZOOM,
		ZOOM_OUT: SlideElementTransitionEnum.ZOOM_OUT,

		FLASH: SlideElementTransitionEnum.FLASH,
		SHAKE: SlideElementTransitionEnum.SHAKE,
		BOUNCE: SlideElementTransitionEnum.BOUNCE,
		TADA: SlideElementTransitionEnum.TADA,
		PULSE: SlideElementTransitionEnum.PULSE,
		JIGGLE: SlideElementTransitionEnum.JIGGLE,
		GLOW: SlideElementTransitionEnum.GLOW,
	},
});

export const ISlideElementStylesNames = [
	'backgroundColor',
	'backgroundImage',
	'backgroundImageDisplay',
	'fontFamily',
	'fontSize',
	'textColor',
	'borderColor',
	'borderWidth',
	'borderStyle',
	'borderImage',
];

export const ISlideElementAnimationNames = [
	'transitionType',
	'transitionDelay',
	'transitionDuration',
	'transitionCount',
];

export enum SlideElementBorderStyleDisplayEnum {
	none = 'none',
	dotted = 'dotted',
	dashed = 'dashed',
	solid = 'solid',
	double = 'double',
	groove = 'groove',
	ridge = 'ridge',
	inset = 'inset',
	outset = 'outset',
}

interface ISlideElementBorderStyleDisplay {
	none: string;
	dotted: string;
	dashed: string;
	solid: string;
	double: string;
	groove: string;
	ridge: string;
	inset: string;
	outset: string;
}

export const SlideElementBorderStyleDisplay = Enum.create<ISlideElementBorderStyleDisplay>({
	name: 'slideElementBorderStyleDisplay',
	identifiers: {
		none: SlideElementBorderStyleDisplayEnum.none,
		dotted: SlideElementBorderStyleDisplayEnum.dotted,
		dashed: SlideElementBorderStyleDisplayEnum.dashed,
		solid: SlideElementBorderStyleDisplayEnum.solid,
		double: SlideElementBorderStyleDisplayEnum.double,
		groove: SlideElementBorderStyleDisplayEnum.groove,
		ridge: SlideElementBorderStyleDisplayEnum.ridge,
		inset: SlideElementBorderStyleDisplayEnum.inset,
		outset: SlideElementBorderStyleDisplayEnum.outset,
	},
});

export const SlideElementBorderStyleDisplayText: {
	[key in SlideElementBorderStyleDisplayEnum]: string;
} = {
	[SlideElementBorderStyleDisplayEnum.none]: 'Не показывать границу',
	[SlideElementBorderStyleDisplayEnum.dotted]: 'Точечная граница',
	[SlideElementBorderStyleDisplayEnum.dashed]: 'Пунктирная граница',
	[SlideElementBorderStyleDisplayEnum.solid]: 'Граница состоит из сплошной линии',
	[SlideElementBorderStyleDisplayEnum.double]: 'Граница из двойной сплошной линии',
	[SlideElementBorderStyleDisplayEnum.groove]: 'Вдавленная граница, с имитацией объема',
	[SlideElementBorderStyleDisplayEnum.ridge]: 'Выпуклая граница с имитацией объема',
	[SlideElementBorderStyleDisplayEnum.inset]: 'Вдавленная граница',
	[SlideElementBorderStyleDisplayEnum.outset]: 'Выпуклая граница',
};

export interface ISlideElementStyles {
	position: 'absolute';
	width: string;
	height: string;
	top: string;
	left: string;
	backgroundColor?: string;
	backgroundImage?: string;
	backgroundImageDisplay?: SlideshowBackgroundImageDisplayEnum;
	fontFamily?: string;
	fontSize?: number;
	textColor?: string;
	borderColor?: string;
	borderWidth?: number;
	borderStyle?: SlideElementBorderStyleDisplayEnum;
	borderImage?: string;
	rotateAngle?: string;
	transform?: string;
	zIndex?: number;
}

export interface ISlideElementAnimation {
	transitionType?: string;
	transitionDelay?: number;
	transitionDuration?: number;
	transitionCount?: number;
}

export interface ITwitterUserForCollections {
	id: string;
	name: string;
	profile_image_url_https: string;
	screen_name: string;
}

// Element type
export enum SlideElementTypeEnum {
	TEXT = 'TEXT',
	HTML = 'HTML',
	IMAGE = 'IMAGE',
	YOUTUBE = 'YOUTUBE',
	CLOCK = 'CLOCK',
	WEATHER = 'WEATHER',
	CURRENCY_RATE = 'CURRENCY_RATE',
	TRAFFIC_JAM = 'TRAFFIC_JAM',
	TRANSPORT_SCHEDULE = 'TRANSPORT_SCHEDULE',
	VKONTAKTE = 'VKONTAKTE',
	TELEGRAM = 'TELEGRAM',
	FACEBOOK = 'FACEBOOK',
	INSTAGRAM = 'INSTAGRAM',
	ODNOKLASSNIKI = 'ODNOKLASSNIKI',
	TWITTER = 'TWITTER',
	RSS = 'RSS',
	TICKER = 'TICKER',
	AIR_QUALITY = 'AIR_QUALITY',
	ZOOM = 'ZOOM',
}

export enum SocialElementsEnum {
	HEADER = 'Header',
	DATE = 'Date',
	TEXT = 'Text',
}

interface ISlideElementType {
	TEXT: string;
	HTML: string;
	IMAGE: string;
	YOUTUBE: string;
	CLOCK: string;
	WEATHER: string;
	CURRENCY_RATE: string;
	TRAFFIC_JAM: string;
	SCHEDULE: string;
	VKONTAKTE: string;
	TELEGRAM: string;
	FACEBOOK: string;
	INSTAGRAM: string;
	ODNOKLASSNIKI: string;
	TWITTER: string;
	RSS: string;
	TICKER: string;
	AIR_QUALITY: string;
	ZOOM: string;
}

export const SlideElementType = Enum.create<ISlideElementType>({
	name: 'SlideElementType',
	identifiers: {
		TEXT: SlideElementTypeEnum.TEXT,
		HTML: SlideElementTypeEnum.HTML,
		IMAGE: SlideElementTypeEnum.IMAGE,
		YOUTUBE: SlideElementTypeEnum.YOUTUBE,
		CLOCK: SlideElementTypeEnum.CLOCK,
		WEATHER: SlideElementTypeEnum.WEATHER,
		CURRENCY_RATE: SlideElementTypeEnum.CURRENCY_RATE,
		TRAFFIC_JAM: SlideElementTypeEnum.TRAFFIC_JAM,
		SCHEDULE: SlideElementTypeEnum.TRANSPORT_SCHEDULE,
		VKONTAKTE: SlideElementTypeEnum.VKONTAKTE,
		TELEGRAM: SlideElementTypeEnum.TELEGRAM,
		FACEBOOK: SlideElementTypeEnum.FACEBOOK,
		INSTAGRAM: SlideElementTypeEnum.INSTAGRAM,
		ODNOKLASSNIKI: SlideElementTypeEnum.ODNOKLASSNIKI,
		TWITTER: SlideElementTypeEnum.TWITTER,
		RSS: SlideElementTypeEnum.RSS,
		TICKER: SlideElementTypeEnum.TICKER,
		AIR_QUALITY: SlideElementTypeEnum.AIR_QUALITY,
		ZOOM: SlideElementTypeEnum.ZOOM,
	},
});

// Text align
export enum SlideElementTextAlignEnum {
	LEFT = 'left',
	RIGHT = 'right',
	CENTER = 'center',
	JUSTIFY = 'justify',
}

interface ISlideElementTextAlign {
	LEFT: string;
	RIGHT: string;
	CENTER: string;
	JUSTIFY: string;
}

export const SlideElementTextAlign = Enum.create<ISlideElementTextAlign>({
	name: 'SlideElementTextAlign',
	identifiers: {
		LEFT: SlideElementTextAlignEnum.LEFT,
		RIGHT: SlideElementTextAlignEnum.RIGHT,
		CENTER: SlideElementTextAlignEnum.CENTER,
		JUSTIFY: SlideElementTextAlignEnum.JUSTIFY,
	},
});

export enum SlideElementClockViewEnum {
	CLOCK = 'CLOCK',
	DATE = 'DATE',
}

interface ISlideElementClockView {
	CLOCK: string;
	DATE: string;
}

export enum SlideElementTransportTypeEnum {
	PLANE = 'plane',
	TRAIN = 'train',
	SUBURBAN = 'suburban',
	BUS = 'bus',
}

interface ISlideElementTransportType {
	PLANE: string;
	TRAIN: string;
	SUBURBAN: string;
	BUS: string;
}

export const SlideElementTransportType = Enum.create<ISlideElementTransportType>({
	name: 'SlideElementTransportType',
	identifiers: {
		PLANE: SlideElementTransportTypeEnum.PLANE,
		TRAIN: SlideElementTransportTypeEnum.TRAIN,
		SUBURBAN: SlideElementTransportTypeEnum.SUBURBAN,
		BUS: SlideElementTransportTypeEnum.BUS,
	},
});

export enum SlideElementTransportTypeEnumDisplay {
	plane = 'самолет',
	train = 'поезд',
	suburban = 'электричка',
	bus = 'автобус',
}

export const SlideClockElementView = Enum.create<ISlideElementClockView>({
	name: 'SlideClockElementView',
	identifiers: {
		CLOCK: SlideElementClockViewEnum.CLOCK,
		DATE: SlideElementClockViewEnum.DATE,
	},
});

// Currencies
export enum SlideElementCurrenciesEnum {
	USD = 'USD',
	EUR = 'EUR',
	BYN = 'BYN',
	GBP = 'GBP',
	PLN = 'PLN',
	TRY = 'TRY',
	CHF = 'CHF',
	DKK = 'DKK',
}

interface ISlideElementCurrencies {
	USD: string;
	EUR: string;
	BYN: string;
	GBP: string;
	PLN: string;
	TRY: string;
	CHF: string;
	DKK: string;
}

export const SlideElementCurrencies = Enum.create<ISlideElementCurrencies>({
	name: 'SlideElementCurrencies',
	identifiers: {
		USD: SlideElementCurrenciesEnum.USD,
		EUR: SlideElementCurrenciesEnum.EUR,
		BYN: SlideElementCurrenciesEnum.BYN,
		GBP: SlideElementCurrenciesEnum.GBP,
		PLN: SlideElementCurrenciesEnum.PLN,
		TRY: SlideElementCurrenciesEnum.TRY,
		CHF: SlideElementCurrenciesEnum.CHF,
		DKK: SlideElementCurrenciesEnum.DKK,
	},
});

export enum SlideElementTrafficServiceEnum {
	YANDEX = 'YANDEX',
	CG = 'CG',
}

export enum SlideElementTrafficServiceEnumDisplay {
	YANDEX = 'Yandex',
	CG = 'СитиГИД',
}

interface ISlideElementTrafficService {
	YANDEX: string;
	CG: string;
}

export const SlideElementTrafficService = Enum.create<ISlideElementTrafficService>({
	name: 'SlideElementTrafficService',
	identifiers: {
		YANDEX: SlideElementTrafficServiceEnum.YANDEX,
		CG: SlideElementTrafficServiceEnum.CG,
	},
});

export enum SlideElementVideoDisplayEnum {
	NONE = 'NONE',
	SILENT = 'SILENT',
	ONLY_SOUND = 'ONLY_SOUND',
}

export enum SlideElementVideoDisplayEnumDisplay {
	NONE = 'Видео и звук',
	SILENT = 'Без звука',
	ONLY_SOUND = 'Только звук',
}

interface ISlideElementVideoDisplay {
	NONE: string;
	SILENT: string;
	ONLY_SOUND: string;
}

export const SlideElementVideoDisplay = Enum.create<ISlideElementVideoDisplay>({
	name: 'SlideElementVideoDisplay',
	identifiers: {
		NONE: SlideElementVideoDisplayEnum.NONE,
		SILENT: SlideElementVideoDisplayEnum.SILENT,
		ONLY_SOUND: SlideElementVideoDisplayEnum.ONLY_SOUND,
	},
});

export enum SlideElementVideoTypeEnum {
	MOVIE = 'MOVIE',
	CHANNEL = 'CHANNEL',
}

interface ISlideElementVideoType {
	MOVIE: string;
	CHANNEL: string;
}

export const SlideElementVideoType = Enum.create<ISlideElementVideoType>({
	name: 'SlideElementVideoType',
	identifiers: {
		MOVIE: SlideElementVideoTypeEnum.MOVIE,
		CHANNEL: SlideElementVideoTypeEnum.CHANNEL,
	},
});

export enum SlideElementVideoProviderEnum {
	YOUTUBE = 'YOUTUBE',
	VIMEO = 'VIMEO',
	VK = 'VK',
}

export enum SlideElementVideoProviderDisplayEnum {
	YOUTUBE = 'YOUTUBE',
	VIMEO = 'VIMEO',
	VK = 'VK',
}

interface ISlideElementVideoProvider {
	YOUTUBE: string;
	VIMEO: string;
	VK: string;
}

export const SlideElementVideoProvider = Enum.create<ISlideElementVideoProvider>({
	name: 'SlideElementVideoProvider',
	identifiers: {
		YOUTUBE: SlideElementVideoProviderEnum.YOUTUBE,
		VIMEO: SlideElementVideoProviderEnum.VIMEO,
		VK: SlideElementVideoProviderEnum.VK,
	},
});

export enum SlideElementLogoPositionEnum {
	TOPLEFT = 'top-left',
	TOPRIGHT = 'top-right',
	BOTTOMLEFT = 'bottom-left',
	BOTTOMRIGHT = 'bottom-right',
}

interface ISlideElementLogoPositionType {
	TOPLEFT: string;
	TOPRIGHT: string;
	BOTTOMLEFT: string;
	BOTTOMRIGHT: string;
}

export const SlideElementLogoPositionType = Enum.create<ISlideElementLogoPositionType>({
	name: 'SlideElementLogoPositionType',
	identifiers: {
		TOPLEFT: SlideElementLogoPositionEnum.TOPLEFT,
		TOPRIGHT: SlideElementLogoPositionEnum.TOPRIGHT,
		BOTTOMLEFT: SlideElementLogoPositionEnum.BOTTOMLEFT,
		BOTTOMRIGHT: SlideElementLogoPositionEnum.BOTTOMRIGHT,
	},
});

export enum SlideElementDirectionTypeEnum {
	TORIGHT = 'toRight',
	TOLEFT = 'toLeft',
}

interface ISlideElementDirectionType {
	TORIGHT: string;
	TOLEFT: string;
}

export const SlideElementDirectionType = Enum.create<ISlideElementDirectionType>({
	name: 'SlideElementDirectionType',
	identifiers: {
		TORIGHT: SlideElementDirectionTypeEnum.TORIGHT,
		TOLEFT: SlideElementDirectionTypeEnum.TOLEFT,
	},
});

export enum SlideElementDirectionEnumDisplay {
	TORIGHT = 'Направо',
	TOLEFT = 'Налево',
}

export enum PermanentPositionEnum {
	TOP = 'TOP',
	BOTTOM = 'BOTTOM',
}

interface IPermanentPositionType {
	TOP: string;
	BOTTOM: string;
}

export const PermanentPositionType = Enum.create<IPermanentPositionType>({
	name: 'PermanentPositionType',
	identifiers: {
		TOP: PermanentPositionEnum.TOP,
		BOTTOM: PermanentPositionEnum.BOTTOM,
	},
});

export enum PermanentPositionEnumDisplay {
	TOP = 'Поверх всех',
	BOTTOM = 'Под всеми',
}

export enum SlideElementSocialDisplayEnum {
	MEDIA_TOP = 'MEDIA_TOP',
	MEDIA_LEFT = 'MEDIA_LEFT',
}

export enum SlideElementSocialDisplayEnumDisplay {
	MEDIA_TOP = 'Картинка сверху',
	MEDIA_LEFT = 'Картинка слева',
}

interface ISlideElementSocialDisplay {
	MEDIA_TOP: string;
	MEDIA_LEFT: string;
}

export const SlideElementSocialDisplay = Enum.create<ISlideElementSocialDisplay>({
	name: 'slideSocialDisplay',
	identifiers: {
		MEDIA_TOP: SlideElementSocialDisplayEnum.MEDIA_TOP,
		MEDIA_LEFT: SlideElementSocialDisplayEnum.MEDIA_LEFT,
	},
});

export enum SlideElementVkMethodShowEnum {
	GROUP = 'GROUP',
	GROUP_PHOTO_ALBUM = 'GROUP_PHOTO_ALBUMS',
	USER_WALL = 'USER_WALL',
}

export enum SlideElementVkMethodShowEnumDisplay {
	GROUP = 'Группа',
	GROUP_PHOTO_ALBUM = 'Фотоальбом группы',
	USER_WALL = 'Стена пользователя',
}

interface ISlideElementVkMethodShow {
	GROUP: string;
	GROUP_PHOTO_ALBUM: string;
	USER_WALL: string;
}

export const SlideElementVkMethodShow = Enum.create<ISlideElementVkMethodShow>({
	name: 'slideElementVkMethodShow',
	identifiers: {
		GROUP: SlideElementVkMethodShowEnum.GROUP,
		GROUP_PHOTO_ALBUM: SlideElementVkMethodShowEnum.GROUP_PHOTO_ALBUM,
		USER_WALL: SlideElementVkMethodShowEnum.USER_WALL,
	},
});

export enum SlideElementTelegramMethodShowEnum {
	CHANNEL = 'CHANNEL',
}

export enum SlideElementTelegramMethodShowEnumDisplay {
	CHANNEL = 'Канал',
}

interface ISlideElementTelegramMethodShow {
	CHANNEL: string;
}

export const SlideElementTelegramMethodShow = Enum.create<ISlideElementTelegramMethodShow>({
	name: 'slideElementTelegramMethodShow',
	identifiers: {
		CHANNEL: SlideElementTelegramMethodShowEnum.CHANNEL,
	},
});

export enum SlideElementSubstanceTypeEnum {
	DEFALUT = '999',
	H2S = '7',
	CH4 = '8',
	CH = '9',
	CHX = '10',
	NH3 = '11',
	FORMALDEGID = '12',
	BENZOL = '13',
	TOLUOL = '14',
	FENOL = '15',
	NAFTALIN = '16',
	STIROL = '17',
	XYLENE = '18',
}

export enum SlideElementSubstanceTypeEnumDisplay {
	DEFALUT = 'Самое грязное',
	H2S = 'Сероводород',
	CH4 = 'Метан',
	CH = 'Неметановые углеводороды',
	CHX = 'Углеводороды суммарные',
	NH3 = 'Аммиак',
	FORMALDEGID = 'Формальдегид  hcho',
	BENZOL = 'Бензол CHB',
	TOLUOL = 'Толуол CHT',
	FENOL = 'Фенол',
	NAFTALIN = 'Нафталин',
	STIROL = 'Стирол',
	XYLENE = 'Ксилол',
}

interface ISlideElementSubstanceType {
	DEFALUT: string;
	H2S: string;
	CH4: string;
	CH: string;
	CHX: string;
	NH3: string;
	FORMALDEGID: string;
	BENZOL: string;
	TOLUOL: string;
	FENOL: string;
	NAFTALIN: string;
	STIROL: string;
	XYLENE: string;
}

export const SlideElementSubstanceType = Enum.create<ISlideElementSubstanceType>({
	name: 'SlideElementSubstanceType',
	identifiers: {
		DEFALUT: SlideElementSubstanceTypeEnum.DEFALUT,
		H2S: SlideElementSubstanceTypeEnum.H2S,
		CH4: SlideElementSubstanceTypeEnum.CH4,
		CH: SlideElementSubstanceTypeEnum.CH,
		CHX: SlideElementSubstanceTypeEnum.CHX,
		NH3: SlideElementSubstanceTypeEnum.NH3,
		FORMALDEGID: SlideElementSubstanceTypeEnum.FORMALDEGID,
		BENZOL: SlideElementSubstanceTypeEnum.BENZOL,
		TOLUOL: SlideElementSubstanceTypeEnum.TOLUOL,
		FENOL: SlideElementSubstanceTypeEnum.FENOL,
		NAFTALIN: SlideElementSubstanceTypeEnum.NAFTALIN,
		STIROL: SlideElementSubstanceTypeEnum.STIROL,
		XYLENE: SlideElementSubstanceTypeEnum.XYLENE,
	},
});

export enum SlideElementTwitterHashtagFilterEnum {
	POPULAR = 'POPULAR',
	RECENT = 'RECENT',
	IMAGES = 'IMAGES',
	NATIVE_VIDEO = 'NATIVE_VIDEO',
}

export enum SlideElementTwitterHashtagFilterEnumDisplay {
	POPULAR = 'Популярное',
	RECENT = 'Последнее',
	IMAGES = 'Фотографии',
	NATIVE_VIDEO = 'Видео',
}

export interface ISlideElementTwitterHashtagFilter {
	POPULAR: string;
	RECENT: string;
	IMAGES: string;
	NATIVE_VIDEO: string;
}

export enum ZoomElementRoleEnum {
	PARTICIPANT = 0,
	HOST = 1,
}

export interface IZoomElementRole {
	PARTICIPANT: number;
	HOST: number;
}

export const ZoomElementRole = Enum.create<IZoomElementRole>({
	name: 'SlideElementZoomRole',
	identifiers: {
		PARTICIPANT: ZoomElementRoleEnum.PARTICIPANT,
		HOST: ZoomElementRoleEnum.HOST,
	},
});

export const SlideElementTwitterHashtagFilter = Enum.create<ISlideElementTwitterHashtagFilter>({
	name: 'SlideElementTwitterHashtagFilter',
	identifiers: {
		POPULAR: SlideElementTwitterHashtagFilterEnum.POPULAR,
		RECENT: SlideElementTwitterHashtagFilterEnum.RECENT,
		IMAGES: SlideElementTwitterHashtagFilterEnum.IMAGES,
		NATIVE_VIDEO: SlideElementTwitterHashtagFilterEnum.NATIVE_VIDEO,
	},
});

const SlideElements = new Mongo.Collection<ISlideElement>('slideElements');

if (Meteor.isServer) {
	SlideElements.logEvents({
		elementType: 'TEXT',
		excludeFields: [],
		disabled: Meteor.settings.debug?.textLogEvents,
	});
}

export const SlideElement = Class.create<ISlideElement>({
	name: 'SlideElement',
	collection: SlideElements,

	fields: {
		slideshowId: {
			type: String,
			immutable: true,
		},
		slideId: {
			type: String,
			immutable: true,
		},
		isForMockup: {
			type: Boolean,
			immutable: true,
			optional: true,
			default: false,
		},
		type: {
			type: SlideElementType,
			immutable: true,
		},
		createdAt: {
			type: Date,
			immutable: true,
			optional: true,
		},
		updatedAt: {
			type: Date,
			optional: true,
		},

		// Общие настройки элемента
		href: {
			type: String,
			optional: true,
		},
		width: Number,
		height: Number,
		top: Number,
		left: Number,
		opacity: Number,
		zIndex: Number,
		rotateAngle: {
			type: Number,
			optional: true,
		},
		rotateStep: {
			type: Number,
			optional: true,
		},
		warpMatrix: {
			type: [Number],
			optional: true,
		},
		scale: {
			type: [Number],
			optional: true,
		},

		// styles
		backgroundColor: {
			type: String,
			optional: true,
		},
		backgroundImage: {
			type: String,
			optional: true,
		},
		backgroundImageDisplay: {
			type: SlideshowBackgroundImageDisplay,
			optional: true,
		},

		fontFamily: {
			type: String,
			optional: true,
		},
		fontSize: {
			type: Number,
			optional: true,
		},
		textColor: {
			type: String,
			optional: true,
		},
		borderColor: {
			type: String,
			optional: true,
		},
		borderWidth: {
			type: Number,
			optional: true,
		},
		borderStyle: {
			type: SlideElementBorderStyleDisplay,
			optional: true,
		},
		borderImage: {
			type: String,
			optional: true,
		},

		// end of styles

		transitionType: {
			type: SlideElementTransition,
			default: SlideElementTransition.NONE,
			optional: true,
		},
		transitionDelay: {
			type: Number,
			default: 0,
			optional: true,
		},
		transitionDuration: {
			type: Number,
			default: 500,
			optional: true,
		},

		transitionCount: {
			type: Number,
			default: 0,
			optional: true,
		},

		retainAspectRatio: {
			type: Boolean,
			optional: true,
		},
		permanent: {
			type: Boolean,
			optional: true,
		},
		permanentPosition: {
			type: PermanentPositionType,
			default: PermanentPositionEnum.TOP,
			optional: true,
		},
		permanentAtAll: {
			type: Boolean,
			optional: true,
			default: true,
		},
		permanentOnSlides: {
			type: [String],
			optional: true,
		},
		zoom: {
			// Для элементов пробок и качества воздуха
			type: Number,
			optional: true,
		},
		hideTitle: {
			type: Boolean,
			optional: true,
		},
		// статистика - реклама
		collectStat: {
			type: Boolean,
			optional: true,
		},
		statisticId: {
			type: String,
			optional: true,
		},

		// Элемент Text
		text: {
			type: String,
			optional: true,
		},
		textAlign: {
			type: SlideElementTextAlign,
			optional: true,
		},
		lineHeight: {
			type: Number,
			optional: true,
		},
		letterSpacing: {
			type: Number,
			optional: true,
		},
		padding: {
			type: Number,
			optional: true,
		},

		// Ticker
		tickerSpeed: {
			type: Number,
			optional: true,
		},

		tickerDirection: {
			type: SlideElementDirectionType,
			optional: true,
		},

		// Элемент Html
		html: {
			type: String,
			optional: true,
		},

		htmlUpdate: {
			type: Number,
			optional: true,
		},

		// Элемент Clock
		city: {
			type: String,
			optional: true,
		},
		clockView: {
			type: SlideClockElementView,
			optional: true,
		},

		// Элемент Schedule
		transportType: {
			type: SlideElementTransportType,
			optional: true,
		},
		fromCity: {
			type: String,
			optional: true,
		},
		toCity: {
			type: String,
			optional: true,
		},

		// Элемент Weather
		displayDays: {
			type: Number,
			optional: true,
		},

		// Элемент Currency rate
		currencyList: {
			type: [SlideElementCurrencies],
			optional: true,
		},

		// Элемент Пробки
		location: {
			type: String,
			optional: true,
		},
		lat: {
			type: String,
			optional: true,
		},
		lon: {
			type: String,
			optional: true,
		},
		trafficService: {
			type: SlideElementTrafficService,
			optional: true,
		},

		// Элемент Twitter
		twitterGetType: {
			type: TwitterGetType,
			optional: true,
		},
		twitterHashtag: {
			type: String,
			optional: true,
		},
		twitterProfileName: {
			type: String,
			optional: true,
		},
		twitterProfileNameForList: {
			type: String,
			optional: true,
		},
		twitterLists: {
			type: [Object],
			optional: true,
		},
		twitterListId: {
			type: String,
			optional: true,
		},
		twitterProfileNameForCollection: {
			type: String,
			optional: true,
		},
		twitterUsersForCollections: {
			type: [Object],
			optional: true,
		},
		twitterCollections: {
			type: [Object],
			optional: true,
		},
		twitterCollectionId: {
			type: String,
			optional: true,
		},
		twitterHashtagFilter: {
			type: SlideElementTwitterHashtagFilter,
			optional: true,
		},
		twitsCount: {
			type: Number,
			optional: true,
		},
		twitsHideText: {
			type: Boolean,
			optional: true,
		},

		// Элемент RSS
		rssUrl: {
			type: String,
			optional: true,
		},
		rssItemsCount: {
			type: Number,
			optional: true,
		},
		rssTitle: {
			type: String,
			optional: true,
		},
		rssDescription: {
			type: String,
			optional: true,
		},
		rssImageUrl: {
			type: String,
			optional: true,
		},

		// Элемент Однокласснники
		okGroupLink: {
			type: String,
			optional: true,
		},
		okPostCount: {
			type: Number,
			optional: true,
		},
		okHideText: {
			type: Boolean,
			optional: true,
		},

		// Элемент ВК
		vkGroupId: {
			type: String,
			optional: true,
		},
		vkPostCount: {
			type: Number,
			optional: true,
		},
		vkHideText: {
			type: Boolean,
			optional: true,
		},

		// Элемент Telegram
		telegramChannelId: {
			type: String,
			optional: true,
		},
		telegramPostCount: {
			type: Number,
			optional: true,
		},
		telegramMethodShow: {
			type: SlideElementTelegramMethodShow,
			optional: true,
		},
		telegramHideText: {
			type: Boolean,
			optional: true,
		},
		telegramHideImage: {
			type: Boolean,
			optional: true,
		},

		// Элемент Instagram
		instagramName: {
			type: String,
			optional: true,
		},
		instagramPhotoCount: {
			type: Number,
			optional: true,
		},
		instagramInterval: {
			type: Number,
			optional: true,
		},
		instagramHideText: {
			type: Boolean,
			optional: true,
		},

		// Элемент FB
		fbGroupId: {
			type: String,
			optional: true,
		},
		fbPostCount: {
			type: Number,
			optional: true,
		},
		fbHideText: {
			type: Boolean,
			optional: true,
		},

		// Элемент video
		videoLink: {
			type: String,
			optional: true,
		},
		videoLogo: {
			type: String,
			optional: true,
		},
		logoPosition: {
			type: SlideElementLogoPositionType,
			optional: true,
		},
		blockTransition: {
			type: Boolean,
			optional: true,
		},
		videoDisplay: {
			type: SlideElementVideoDisplay,
			optional: true,
		},
		videoType: {
			type: SlideElementVideoType,
			optional: true,
		},
		videoItemCount: {
			type: Number,
			optional: true,
		},
		videoProvider: {
			type: SlideElementVideoProvider,
			optional: true,
		},
		vkVideoAlbumId: {
			type: Number,
			optional: true,
		},
		vkVideo: {
			type: [Object],
			optional: true,
		},

		// Элемент AirQualityWidget
		airQualityCoordinates: {
			type: [Number],
			optional: true,
		},
		substanceType: {
			type: SlideElementSubstanceType,
			optional: true,
		},

		// Настройки соц сетей
		postShowByOne: {
			type: Boolean,
			optional: true,
		},
		postShowTime: {
			type: Number,
			optional: true,
		},
		socialHeaderFontSize: {
			type: Number,
			optional: true,
		},
		socialHeaderColor: {
			type: String,
			optional: true,
		},
		socialHeaderBackgroundColor: {
			type: String,
			optional: true,
		},
		socialHeaderFont: {
			type: String,
			optional: true,
		},
		socialTextFontSize: {
			type: Number,
			optional: true,
		},
		socialTextColor: {
			type: String,
			optional: true,
		},
		socialTextBackgroundColor: {
			type: String,
			optional: true,
		},
		socialTextFont: {
			type: String,
			optional: true,
		},
		socialDateFontSize: {
			type: Number,
			optional: true,
		},
		socialDateColor: {
			type: String,
			optional: true,
		},
		socialDateBackgroundColor: {
			type: String,
			optional: true,
		},
		socialDateFont: {
			type: String,
			optional: true,
		},
		socialDisplay: {
			type: SlideElementSocialDisplay,
			optional: true,
		},
		vkMethodShow: {
			type: SlideElementVkMethodShow,
			optional: true,
		},

		// Element Zoom
		zoom_meetingNumber: {type: String, optional: true},
		zoom_role: {type: ZoomElementRole, optional: true},
		zoom_userName: {type: String, optional: true},
		zoom_userEmail: {type: String, optional: true},
		zoom_password: {type: String, optional: true},
		zoom_sdkKey: {type: String, optional: true},
		zoom_sdkSecret: {type: String, optional: true},
	},

	secured: true,

	behaviors: {timestamp: getDefaultTimestamp()},
});

if (Meteor.isServer) {
	SlideElements._ensureIndex({slideshowId: 1});
	SlideElements._ensureIndex({slideId: 1});
}
