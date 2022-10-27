import {Mongo} from 'meteor/mongo';
import {Class, Enum} from 'meteor/jagi:astronomy';

import {getDefaultTimestamp} from 'shared/utils/collections';

export interface ICustomFont {
	name: string;
	src?: string;
	type: string;
}
export interface ISlideshow {
	_id: string;
	userId: string;
	name: string;
	orientation: SlideshowOrientationEnum;
	location: SlideshowLocationTypeEnum;
	previewImage: string;
	password?: string;
	numId: string;
	showSlidePreview?: SlideshowPreviewEnum;
	address?: string;
	styles: ISlideshowStyles;
	// шрифты google fonts
	activeFonts?: string[];
	additionalFonts?: ICustomFont[];
	radiostation?: SlideshowRadiostationTypeEnum;
	radioVolume?: number;
	isSystem?: boolean;
	groupId: string;
	systemGroupId?: string;
	createdAt: Date;
	updatedAt: Date;
	isGridBlockEnabled: boolean;
}

export enum SlideshowBackgroundImageDisplayEnum {
	STRETCH = 'STRETCH',
	TILE = 'TILE',
	FILL = 'FILL',
}

interface ISlideshowBackgroundImageDisplay {
	STRETCH: string;
	TILE: string;
	FILL: string;
}

export const SlideshowBackgroundImageDisplay = Enum.create<ISlideshowBackgroundImageDisplay>({
	name: 'slideBackgroundImageDisplay',
	identifiers: {
		STRETCH: SlideshowBackgroundImageDisplayEnum.STRETCH,
		TILE: SlideshowBackgroundImageDisplayEnum.TILE,
		FILL: SlideshowBackgroundImageDisplayEnum.FILL,
	},
});

export const SlideshowBackgroundImageDisplayText: {
	[key in SlideshowBackgroundImageDisplayEnum]: string;
} = {
	[SlideshowBackgroundImageDisplayEnum.STRETCH]: 'Растянуть',
	[SlideshowBackgroundImageDisplayEnum.TILE]: 'Замостить',
	[SlideshowBackgroundImageDisplayEnum.FILL]: 'Заполнить',
};

// Slideshow animations
export enum SlideshowTransitionEnum {
	NONE = 'NONE',
	FADE = 'FADE',
	SLIDE = 'SLIDE',
	SLIDE_TOP = 'SLIDE_TOP',
	SLIDE_RIGHT = 'SLIDE_RIGHT',
	SLIDE_DOWN = 'SLIDE_DOWN',
	ZOOM = 'ZOOM',
	ZOOM_OUT = 'ZOOM_OUT',
	CONVEX = 'CONVEX',
	CONVEX_RIGHT = 'CONVEX_RIGHT',
	CONCAVE = 'CONCAVE',
	CONCAVE_RIGHT = 'CONCAVE_RIGHT',
	CONVEYOR = 'CONVEYOR',
	WHEEL = 'WHEEL',
	APPEARANCE = 'APPEARANCE',
}

interface ISlideshowTransition {
	NONE: string;
	FADE: string;
	SLIDE: string;
	SLIDE_RIGHT: string;
	SLIDE_TOP: string;
	SLIDE_DOWN: string;
	ZOOM: string;
	ZOOM_OUT: string;
	CONVEX: string;
	CONVEX_RIGHT: string;
	CONCAVE: string;
	CONCAVE_RIGHT: string;
	CONVEYOR: string;
	WHEEL: string;
	APPEARANCE: string;
}

export const SlideshowTransitionText: {[key in SlideshowTransitionEnum]: string} = {
	[SlideshowTransitionEnum.NONE]: 'Без эффекта',
	[SlideshowTransitionEnum.FADE]: 'Затухание',

	[SlideshowTransitionEnum.SLIDE_TOP]: 'Сдвиг вверх',
	[SlideshowTransitionEnum.SLIDE_DOWN]: 'Сдвиг вниз',
	[SlideshowTransitionEnum.SLIDE]: 'Сдвиг влево',
	[SlideshowTransitionEnum.SLIDE_RIGHT]: 'Сдвиг вправо',

	[SlideshowTransitionEnum.ZOOM]: 'Приближение',
	[SlideshowTransitionEnum.ZOOM_OUT]: 'Отдаление',

	[SlideshowTransitionEnum.CONVEX]: 'Выгнутный влево',
	[SlideshowTransitionEnum.CONVEX_RIGHT]: 'Выгнутный вправо',

	[SlideshowTransitionEnum.CONCAVE]: 'Вогнутый влево',
	[SlideshowTransitionEnum.CONCAVE_RIGHT]: 'Вогнутый вправо',
	[SlideshowTransitionEnum.CONVEYOR]: 'Конвейер',
	[SlideshowTransitionEnum.WHEEL]: 'Колесо',
	[SlideshowTransitionEnum.APPEARANCE]: 'Появление',
};

export const SlideshowTransition = Enum.create<ISlideshowTransition>({
	name: 'SlideshowTransition',
	identifiers: {
		NONE: SlideshowTransitionEnum.NONE,
		FADE: SlideshowTransitionEnum.FADE,
		SLIDE: SlideshowTransitionEnum.SLIDE,
		SLIDE_RIGHT: SlideshowTransitionEnum.SLIDE_RIGHT,
		SLIDE_TOP: SlideshowTransitionEnum.SLIDE_TOP,
		SLIDE_DOWN: SlideshowTransitionEnum.SLIDE_DOWN,
		ZOOM: SlideshowTransitionEnum.ZOOM,
		ZOOM_OUT: SlideshowTransitionEnum.ZOOM_OUT,
		CONVEX: SlideshowTransitionEnum.CONVEX,
		CONVEX_RIGHT: SlideshowTransitionEnum.CONVEX_RIGHT,

		CONCAVE: SlideshowTransitionEnum.CONCAVE,
		CONCAVE_RIGHT: SlideshowTransitionEnum.CONCAVE_RIGHT,
		CONVEYOR: SlideshowTransitionEnum.CONVEYOR,
		WHEEL: SlideshowTransitionEnum.WHEEL,
		APPEARANCE: SlideshowTransitionEnum.APPEARANCE,
	},
});

// Slideshow font family
export enum SlideshowFontFamilyEnum {
	ARIAL = 'ARIAL',
}

interface ISlideshowFontFamily {
	ARIAL: string;
}

export const SlideshowFontFamily = Enum.create<ISlideshowFontFamily>({
	name: 'SlideshowFontFamily',
	identifiers: {
		ARIAL: SlideshowFontFamilyEnum.ARIAL,
	},
});

export const SlideshowFontFamilyText: {[key in SlideshowFontFamilyEnum]: string} = {
	[SlideshowFontFamilyEnum.ARIAL]: 'Arial',
};

// Slideshow styles
export interface ISlideshowStyles {
	// Настройки слайдов
	slideDuration: number;
	colorPrimary?: string; // Цвет фона полосы загрузки
	barColorPrimary?: string; // Цвет полосы загрузки
	hideProgressbar?: boolean;

	slideBackgroundColor: string;
	slideBackgroundImage?: string;
	slideBackgroundVideo?: string;
	slideBackgroundImageDisplay?: SlideshowBackgroundImageDisplayEnum;
	slideTransition: SlideshowTransitionEnum;
	slideTransitionLength?: number;
	slideTransitionEasing?: string;
	//кастомная анимация пример объекта
	/*
{
	"slideTransitionCustomCode": {
		"initial": {
			"opacity": 0,
			"transform": "translateX(0%) scale(1) rotateY(0deg)",
			"WebkitTransform": "translateX(0%) scale(1) rotateY(0deg)"
		},
		"enter": {
			"opacity": 0,
			"transform": "translateX(0%) scale(1) rotateY(0deg)",
			"WebkitTransform": "translateX(0%) scale(1) rotateY(0deg)"
		},
		"from": {
			"opacity": 0,
			"transform": "translateX(0%) scale(1) rotateY(0deg)",
			"WebkitTransform": "translateX(0%) scale(1) rotateY(0deg)"
		},
		"leave": {
			"opacity": 0,
			"transform": "translateX(0%) scale(1) rotateY(0deg)",
			"WebkitTransform": "translateX(0%) scale(1) rotateY(0deg)"
		}
	}
}
*/
	slideTransitionCustomCode?: object;
	additionalFonts?: ICustomFont[];

	// Настройки элементов
	elementBackgroundColor: string;
	elementBackgroundImage?: string;
	elementBackgroundImageDisplay?: SlideshowBackgroundImageDisplayEnum;
	elementFontFamily: string;
	elementFontSize: number;
	elementTextColor: string;
}

export const SlideshowStyles = Class.create<ISlideshowStyles>({
	name: 'SlideshowStyles',

	fields: {
		// Настройки слайдов
		slideDuration: Number,
		colorPrimary: {
			type: String,
			optional: true,
		},
		barColorPrimary: {
			type: String,
			optional: true,
		},
		hideProgressbar: {
			type: Boolean,
			optional: true,
		},
		slideBackgroundColor: String,
		slideBackgroundImage: {
			type: String,
			optional: true,
		},
		slideBackgroundVideo: {
			type: String,
			optional: true,
		},
		slideBackgroundImageDisplay: {
			type: SlideshowBackgroundImageDisplay,
			optional: true,
		},
		slideTransition: SlideshowTransition,
		slideTransitionLength: {
			type: Number,
			optional: true,
		},
		slideTransitionEasing: {
			type: String,
			optional: true,
		},
		slideTransitionCustomCode: {
			type: Object,
			optional: true,
			blackbox: true,
		},

		// Настройки элементов
		elementBackgroundColor: String,
		elementBackgroundImage: {
			type: String,
			optional: true,
		},
		elementBackgroundImageDisplay: {
			type: SlideshowBackgroundImageDisplay,
			optional: true,
		},
		elementFontFamily: String,
		elementFontSize: Number,
		elementTextColor: String,
	},
});

// slideshow Preview
export enum SlideshowPreviewEnum {
	SHOW = 'SHOW',
	CLOSE = 'CLOSE',
}

export interface ISlideshowPreview {
	SHOW: SlideshowPreviewEnum;
	CLOSE: SlideshowPreviewEnum;
}

export const SlideshowPreview = Enum.create<ISlideshowPreview>({
	name: 'SlideshowPreview',
	identifiers: {
		SHOW: SlideshowPreviewEnum.SHOW,
		CLOSE: SlideshowPreviewEnum.CLOSE,
	},
});

export const SlideshowPreviewText: {[key in SlideshowPreviewEnum]: string} = {
	[SlideshowPreviewEnum.SHOW]: 'Включить',
	[SlideshowPreviewEnum.CLOSE]: 'Выключить',
};

// Slideshow Orientation
export enum SlideshowOrientationEnum {
	VERTICAL = 'VERTICAL',
	HORIZONTAL = 'HORIZONTAL',
}

export interface ISlideshowOrientation {
	VERTICAL: SlideshowOrientationEnum;
	HORIZONTAL: SlideshowOrientationEnum;
}

export const SlideshowOrientation = Enum.create<ISlideshowOrientation>({
	name: 'SlideshowOrientation',
	identifiers: {
		VERTICAL: SlideshowOrientationEnum.VERTICAL,
		HORIZONTAL: SlideshowOrientationEnum.HORIZONTAL,
	},
});

export const SlideshowOrientationText: {[key in SlideshowOrientationEnum]: string} = {
	[SlideshowOrientationEnum.VERTICAL]: 'Вертикальная',
	[SlideshowOrientationEnum.HORIZONTAL]: 'Горизонтальная',
};

// Slideshow Location
export enum SlideshowLocationTypeEnum {
	APARTMENT = 'APARTMENT',
	STORE = 'STORE',
	HOUSE = 'HOUSE',
	HOTEL = 'HOTEL',
	CATERING = 'CATERING',
	OFFICE = 'OFFICE',
	MEDICAL = 'MEDICAL',
	EDUCATIONAL = 'EDUCATIONAL',
	STATE = 'STATE',
	OTHER = 'OTHER',
}

export interface ISlideshowLocation {
	APARTMENT: string;
	STORE: string;
	HOUSE: string;
	HOTEL: string;
	CATERING: string;
	OFFICE: string;
	MEDICAL: string;
	EDUCATIONAL: string;
	STATE: string;
	OTHER: string;
}

export const SlideshowLocation = Enum.create<ISlideshowLocation>({
	name: 'SlideshowLocation',
	identifiers: {
		APARTMENT: SlideshowLocationTypeEnum.APARTMENT,
		STORE: SlideshowLocationTypeEnum.STORE,
		HOUSE: SlideshowLocationTypeEnum.HOUSE,
		HOTEL: SlideshowLocationTypeEnum.HOTEL,
		CATERING: SlideshowLocationTypeEnum.CATERING,
		OFFICE: SlideshowLocationTypeEnum.OFFICE,
		MEDICAL: SlideshowLocationTypeEnum.MEDICAL,
		EDUCATIONAL: SlideshowLocationTypeEnum.EDUCATIONAL,
		STATE: SlideshowLocationTypeEnum.STATE,
		OTHER: SlideshowLocationTypeEnum.OTHER,
	},
});

export const SlideshowLocationText: {[key in SlideshowLocationTypeEnum]: string} = {
	[SlideshowLocationTypeEnum.APARTMENT]: 'Квартира',
	[SlideshowLocationTypeEnum.STORE]: 'Торговая точка, магазин',
	[SlideshowLocationTypeEnum.HOUSE]: 'Подъезд дома',
	[SlideshowLocationTypeEnum.HOTEL]: 'Гостиница',
	[SlideshowLocationTypeEnum.CATERING]: 'Общепит',
	[SlideshowLocationTypeEnum.OFFICE]: 'Бизнес-центр, офис',
	[SlideshowLocationTypeEnum.MEDICAL]: 'Медицинское учреждение',
	[SlideshowLocationTypeEnum.EDUCATIONAL]: 'Образовательное учреждение',
	[SlideshowLocationTypeEnum.STATE]: 'Государственное учреждение',
	[SlideshowLocationTypeEnum.OTHER]: 'Другое',
};

// Slideshow Radiostations
export enum SlideshowRadiostationTypeEnum {
	NONE = '',
	DACHA = 'https://pub0202.101.ru:8443/stream/personal/aacp/64/864228',
	AUTORADIO = 'https://pub0101.101.ru:8000/stream/pro/aac/64/2',
	DEEP_HOUSE = 'https://pub0101.101.ru:8000/stream/trust/mp3/128/173',
	VESNUSHKA_FM = 'https://air.radiorecord.ru:8102/deti_320',
	RUSHIANHITS = 'https://air.radiorecord.ru:8102/russianhits_320',
	MEDLJAK_FM = 'https://air.radiorecord.ru:8102/mdl_320',
	SIMPHONIJA_FM = 'https://air.radiorecord.ru:8102/symph_320',
	NAFTALIN_FM = 'https://air.radiorecord.ru:8102/naft_320',
	ENERGY = 'https://pub0101.101.ru:8000/stream/air/aac/64/99',
	EURO_HITS = 'https://pub0101.101.ru:8000/stream/trust/mp3/128/82',
	RELAX_FM = 'https://pub0101.101.ru:8000/stream/air/aac/64/200',
	RELAX_NATURE = 'https://pub0101.101.ru:8000/stream/trust/mp3/128/263',
	DISCO_80 = 'https://pub0101.101.ru:8000/stream/pro/aac/64/1',
	DISCO_90 = 'https://pub0101.101.ru:8000/stream/pro/aac/64/74',
	REGGAE_141 = 'https://pub0101.101.ru:8000/stream/pro/aac/64/88',
	BLUESMEN_CHANNEL = 'https://pub0202.101.ru:8443/stream/personal/aacp/64/955339',
	RADIO_SYMPHONY = 'https://streaming.radiostreamlive.com/radiosymphony_devices',
	SMOOTH_JAZZ = 'https://pub0101.101.ru:8000/stream/trust/mp3/128/31',
	TOP_40_100HITZ = 'https://pureplay.cdnstream1.com/6025_128.mp3',
	THE_CLASSIC_ROCK_CHANNEL_ACERADIO = 'https://bigrradio.cdnstream1.com/5118_128',
	ALTERNATIVE = 'https://pub0101.101.ru:8000/stream/pro/aac/64/176',
}

export interface ISlideshowRadiostation {
	NONE: string;
	DACHA: string;
	AUTORADIO: string;
	DEEP_HOUSE: string;
	VESNUSHKA_FM: string;
	RUSHIANHITS: string;
	MEDLJAK_FM: string;
	SIMPHONIJA_FM: string;
	NAFTALIN_FM: string;
	ENERGY: string;
	EURO_HITS: string;
	RELAX_FM: string;
	RELAX_NATURE: string;
	DISCO_80: string;
	DISCO_90: string;
	REGGAE_141: string;
	BLUESMEN_CHANNEL: string;
	RADIO_SYMPHONY: string;
	SMOOTH_JAZZ: string;
	TOP_40_100HITZ: string;
	THE_CLASSIC_ROCK_CHANNEL_ACERADIO: string;
	ALTERNATIVE: string;
}

export const SlideshowRadiostation = Enum.create<ISlideshowRadiostation>({
	name: 'SlideshowRadiostation',
	identifiers: {
		NONE: SlideshowRadiostationTypeEnum.NONE,
		DACHA: SlideshowRadiostationTypeEnum.DACHA,
		AUTORADIO: SlideshowRadiostationTypeEnum.AUTORADIO,
		DEEP_HOUSE: SlideshowRadiostationTypeEnum.DEEP_HOUSE,
		VESNUSHKA_FM: SlideshowRadiostationTypeEnum.VESNUSHKA_FM,
		RUSHIANHITS: SlideshowRadiostationTypeEnum.RUSHIANHITS,
		MEDLJAK_FM: SlideshowRadiostationTypeEnum.MEDLJAK_FM,
		SIMPHONIJA_FM: SlideshowRadiostationTypeEnum.SIMPHONIJA_FM,
		NAFTALIN_FM: SlideshowRadiostationTypeEnum.NAFTALIN_FM,
		ENERGY: SlideshowRadiostationTypeEnum.ENERGY,
		EURO_HITS: SlideshowRadiostationTypeEnum.EURO_HITS,
		RELAX_FM: SlideshowRadiostationTypeEnum.RELAX_FM,
		RELAX_NATURE: SlideshowRadiostationTypeEnum.RELAX_NATURE,
		DISCO_80: SlideshowRadiostationTypeEnum.DISCO_80,
		DISCO_90: SlideshowRadiostationTypeEnum.DISCO_90,
		REGGAE_141: SlideshowRadiostationTypeEnum.REGGAE_141,
		BLUESMEN_CHANNEL: SlideshowRadiostationTypeEnum.BLUESMEN_CHANNEL,
		RADIO_SYMPHONY: SlideshowRadiostationTypeEnum.RADIO_SYMPHONY,
		SMOOTH_JAZZ: SlideshowRadiostationTypeEnum.SMOOTH_JAZZ,
		TOP_40_100HITZ: SlideshowRadiostationTypeEnum.TOP_40_100HITZ,
		THE_CLASSIC_ROCK_CHANNEL_ACERADIO:
			SlideshowRadiostationTypeEnum.THE_CLASSIC_ROCK_CHANNEL_ACERADIO,
		ALTERNATIVE: SlideshowRadiostationTypeEnum.ALTERNATIVE,
	},
});

export const SlideshowRadiostationText: {[key in SlideshowRadiostationTypeEnum]: string} = {
	[SlideshowRadiostationTypeEnum.NONE]: 'Без радио',
	[SlideshowRadiostationTypeEnum.DACHA]: 'Дача',
	[SlideshowRadiostationTypeEnum.AUTORADIO]: 'Музыка Авторадио',
	[SlideshowRadiostationTypeEnum.DEEP_HOUSE]: 'Deep House',
	[SlideshowRadiostationTypeEnum.VESNUSHKA_FM]: 'Веснушка FM',
	[SlideshowRadiostationTypeEnum.RUSHIANHITS]: 'Русские хиты',
	[SlideshowRadiostationTypeEnum.MEDLJAK_FM]: 'Медляк FM',
	[SlideshowRadiostationTypeEnum.SIMPHONIJA_FM]: 'Симфония FM',
	[SlideshowRadiostationTypeEnum.NAFTALIN_FM]: 'Нафталин FM',
	[SlideshowRadiostationTypeEnum.ENERGY]: 'Energy',
	[SlideshowRadiostationTypeEnum.EURO_HITS]: 'Euro Hits',
	[SlideshowRadiostationTypeEnum.RELAX_FM]: 'Relax FM',
	[SlideshowRadiostationTypeEnum.RELAX_NATURE]: 'Relax Nature',
	[SlideshowRadiostationTypeEnum.DISCO_80]: 'Дискотека 80-х',
	[SlideshowRadiostationTypeEnum.DISCO_90]: 'Дискотека 90-х',
	[SlideshowRadiostationTypeEnum.REGGAE_141]: 'Reggae 141',
	[SlideshowRadiostationTypeEnum.BLUESMEN_CHANNEL]: 'BluesMen Channel',
	[SlideshowRadiostationTypeEnum.RADIO_SYMPHONY]: 'Radio Symphony',
	[SlideshowRadiostationTypeEnum.SMOOTH_JAZZ]: 'Smooth Jazz',
	[SlideshowRadiostationTypeEnum.TOP_40_100HITZ]: 'Top 40 - 100HITZ',
	[SlideshowRadiostationTypeEnum.THE_CLASSIC_ROCK_CHANNEL_ACERADIO]:
		'The Classic Rock Channel - Aceradio',
	[SlideshowRadiostationTypeEnum.ALTERNATIVE]: 'Alternative',
};

const Slideshows = new Mongo.Collection<ISlideshow>('slideshows');

export const Slideshow = Class.create<ISlideshow>({
	name: 'Slideshow',
	collection: Slideshows,

	fields: {
		userId: String,
		name: String,
		location: SlideshowLocation,
		orientation: SlideshowOrientation,
		showSlidePreview: {
			type: SlideshowPreview,
			default: SlideshowPreviewEnum.SHOW,
		},
		numId: String,
		previewImage: {
			type: String,
			optional: true,
		},
		password: {
			type: String,
			optional: true,
		},
		address: {
			type: String,
			optional: true,
		},
		styles: {
			type: SlideshowStyles,
			optional: true,
		},
		// шрифты google fonts
		activeFonts: {
			type: Array(String),
			optional: true,
		},
		additionalFonts: {
			type: Array(Object),
			optional: true,
		},
		radiostation: {
			type: String,
			optional: true,
		},
		radioVolume: {
			type: Number,
			optional: true,
		},
		isSystem: {
			type: Boolean,
			optional: true,
		},
		systemGroupId: {
			type: String,
			optional: true,
		},
		groupId: String,
		createdAt: {
			type: Date,
			immutable: true,
			optional: true,
		},
		updatedAt: {
			type: Date,
			optional: true,
		},
		isGridBlockEnabled: {
			type: Boolean,
			default: false,
		},
	},

	secured: true,

	behaviors: {timestamp: getDefaultTimestamp()},
});

if (Meteor.isServer) {
	Slideshows._ensureIndex({numId: 1}, {unique: true});
}
