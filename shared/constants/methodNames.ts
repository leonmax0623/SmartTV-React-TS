import {YouTube} from 'react-youtube';
interface IMethodNames {
	slideshow: {
		create: string;
		updateSettings: string;
		updateStyles: string;
		delete: string;
		createNewSlide: string;
		createSlideFromMockup: string;
		dublicateSlide: string;
		updateSlideStyles: string;
		deleteSlide: string;
		reorderSlides: string;
		addElement: string;
		updateElement: string;
		duplicateElement: string;
		deleteElement: string;
		updateElementStyles: string;
		copySlideShow: string;
		sendSlideShow: string;
		changeNumber: string;
	};
	instagram: {
		updateFeed: string;
	};
	ok: {
		updateFeed: string;
	};
	vk: {
		updateFeed: string;
		getVideo: string;
	};
	telegram: {
		updateFeed: string;
	};
	rss: {
		updateFeed: string;
	};
	twitter: {
		updateFeed: string;
		getAuthToken: string;
		getLists: string;
		getCollections: string;
	};
	fb: {
		updateFeed: string;
	};
	statistics: {
		mounted: string;
		unmounted: string;
		getSlideShows: string;
		getSlideShowsForElement: string;
		getSlideShowsForStatId: string;
	};
	user: {
		setAdminRole: string;
		setTemplateEditorRole: string;
		setStatus: string;
		setPassword: string;
		update: string;
		delete: string;
		prepareForFakeLogin: string;
		sendVerificationEmail: string;
		toggleService: string;
		refreshGoogleToken: string;
		addSlideShowGroup: string;
		editSlideShowGroup: string;
		deleteSlideShowGroup: string;
	};
	slideMockups: {
		create: string;
		delete: string;
		toggleDefault: string;
	};
	appsets: {
		create: string;
		update: string;
		delete: string;
	};
	currency: {
		update: string;
		updateTodayValue: string;
	};
	ya: {
		getYaSchedule: string;
		getYaStations: string;
	};
	owm: {
		update: string;
	};
	cities: {
		getInfo: string;
		update: string;
	};
	sendpulse: {
		uploadUsers: string;
		uploadUser: string;
		removeUser: string;
	};
	airQuality: {
		getData: string;
	};
	paidServices: {
		addService: string;
		editService: string;
		addOffer: string;
		deleteOffer: string;
		updateOffer: string;
		editPackage: string;
		addPackageToOffer: string;
		removePackageFromOffer: string;
		createOrder: string;
		verifyPayment: string;
		checkInvoiceStatus: string;
		isInvoicePayed: string;
		getLastEndingOrderExpireDateByUserId: string;
		getUserPermissions: string;
		isGranted: string;
		resetDefaultSelectedOffer: string;
	};
	slideStream: {
		create: string;
		update: string;
		remove: string;
		createSchedule: string;
		updateSchedule: string;
		removeSchedule: string;
	};
	cart: {
		data: string;
		updateItem: string;
		clear: string;
	};
	faq: {
		getListByKey: string;
		edit: string;
		addItem: string;
		updateItem: string;
		removeItem: string;
	};
	videoHosting: {
		createVideo: string;
		saveVideo: string;
		checkVimeoVideos: string;
		removeVideo: string;
		getChanelId: string;
		getVideoId: string;
	};
	zoom: {
		getSignature: string;
	};
	service: {
		readVectorCollectionFolder: string;
	};
}

export const methodNames: IMethodNames = {
	slideshow: {
		create: 'slideshow.create',
		updateSettings: 'slideshow.updateSettings',
		updateStyles: 'slideshow.updateStyles',
		delete: 'slideshow.delete',
		createNewSlide: 'slideshow.createNewSlide',
		createSlideFromMockup: 'slideshow.createSlideFromMockup',
		dublicateSlide: 'slideshow.dublicateSlide',
		updateSlideStyles: 'slideshow.updateSlideStyles',
		deleteSlide: 'slideshow.deleteSlide',
		reorderSlides: 'slideshow.reorderSlides',
		addElement: 'slideshow.addElement',
		updateElement: 'slideshow.updateElement',
		duplicateElement: 'slideshow.duplicateElement',
		deleteElement: 'slideshow.deleteElement',
		updateElementStyles: 'slideshow.updateElementStyles',
		copySlideShow: 'slideshow.copySlideShow',
		sendSlideShow: 'slideshow.sendSlideShow',
		changeNumber: 'slideshow.changeNumber',
	},
	instagram: {
		updateFeed: 'InstagramFeed.update',
	},
	ok: {
		updateFeed: 'OKFeed.update',
	},
	vk: {
		updateFeed: 'VKFeed.update',
		getVideo: 'vk.getVideo',
	},
	telegram: {
		updateFeed: 'TelegramFeed.update',
	},
	rss: {
		updateFeed: 'RssFeed.update',
	},
	twitter: {
		updateFeed: 'twitter.updateData',
		getAuthToken: 'twitter.getAuthToken',
		getLists: 'twitter.getLists',
		getCollections: 'twitter.getCollections',
	},
	fb: {
		updateFeed: 'FBFeed.update',
	},
	statistics: {
		mounted: 'Statistics.mounted',
		unmounted: 'Statistics.unmounted',
		getSlideShows: 'Statistics.getSlideShows',
		getSlideShowsForElement: 'Statistics.getSlideShowsForElement',
		getSlideShowsForStatId: 'Statistics.getSlideShowsForStatId',
	},
	user: {
		setAdminRole: 'users.setAdminRole',
		setTemplateEditorRole: 'users.setTemplateEditorRole',
		setStatus: 'users.setStatus',
		setPassword: 'users.setPassword',
		update: 'users.update',
		delete: 'users.delete',
		prepareForFakeLogin: 'users.prepareForFakeLogin',
		sendVerificationEmail: 'users.sendVerificationEmail',
		toggleService: 'users.toggleService',
		refreshGoogleToken: 'users.refreshGoogleToken',
		addSlideShowGroup: 'users.addSlideShowGroup',
		editSlideShowGroup: 'users.editSlideShowGroup',
		deleteSlideShowGroup: 'users.deleteSlideShowGroup',
	},
	slideMockups: {
		create: 'slideMockups.create',
		delete: 'slideMockups.delete',
		toggleDefault: 'slideMockups.toggleDefault',
	},
	appsets: {
		create: 'appsets.create',
		update: 'appsets.update',
		delete: 'appsets.delete',
	},
	currency: {
		update: 'currency.update',
		updateTodayValue: 'currency.updateTodayValue',
	},
	ya: {
		getYaSchedule: 'getYaSchedule',
		getYaStations: 'getYaStations',
	},
	owm: {
		update: 'OWMFeed.update',
	},
	cities: {
		getInfo: 'cities.getYandexCityInfo',
		update: 'cities.updateData',
	},
	sendpulse: {
		uploadUsers: 'sendpulse.uploadUsers',
		uploadUser: 'sendpulse.uploadUser',
		removeUser: 'sendpulse.removeUser',
	},
	airQuality: {
		getData: 'airQuality.getData',
	},
	paidServices: {
		addService: 'paidServices.addService',
		editService: 'paidServices.editService',
		addOffer: 'paidServices.addOffer',
		deleteOffer: 'paidServices.deleteOffer',
		updateOffer: 'paidServices.updateOffer',
		editPackage: 'paidServices.editPackage',
		addPackageToOffer: 'paidServices.addPackageToOffer',
		removePackageFromOffer: 'paidServices.removePackageFromOffer',
		createOrder: 'paidServices.createOrder',
		verifyPayment: 'paidServices.verifyPayment',
		checkInvoiceStatus: 'paidServices.checkInvoiceStatus',
		isInvoicePayed: 'paidServices.isInvoicePayed',

		getLastEndingOrderExpireDateByUserId: 'paidServices.getLastEndingOrderExpireDateByUserId',
		getUserPermissions: 'paidServices.getUserPermissions',
		isGranted: 'paidServices.isGranted',
		resetDefaultSelectedOffer: 'paidServices.resetDefaultSelectedOffer',
	},
	slideStream: {
		create: 'slideStream.create',
		update: 'slideStream.update',
		remove: 'slideStream.remove',
		createSchedule: 'slideStream.createSchedule',
		updateSchedule: 'slideStream.updateSchedule',
		removeSchedule: 'slideStream.removeSchedule',
	},
	cart: {
		data: 'cart.cart',
		updateItem: 'cart.updateItem',
		clear: 'cart.clear',
	},
	faq: {
		getListByKey: 'faq.getListByKey',
		edit: 'faq.edit',
		addItem: 'faq.addItem',
		updateItem: 'faq.updateItem',
		removeItem: 'faq.removeItem',
	},
	videoHosting: {
		createVideo: 'videoHosting.createVideo',
		saveVideo: 'videoHosting.saveVideo',
		checkVimeoVideos: 'videoHosting.checkVimeoVideos',
		removeVideo: 'videoHosting.removeVideo',
		getChanelId: 'videoHosting.getChanelId',
		getVideoId: 'videoHosting.getVideoId',
	},
	zoom: {
		getSignature: 'zoom.getSignature',
	},
	service: {
		readVectorCollectionFolder: 'service.readVectorCollectionFolder',
	},
};
