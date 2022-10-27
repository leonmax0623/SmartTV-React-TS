interface IPublishNames {
	slideshow: {
		oneFull: string;
		oneFullShow: string;
		myList: string;
		systemList: string;
		listForAdmin: string;
		byElement: string;
		myListForStat: string;
		byStatId: string;
		vectors: string;
	};
	instagram: {
		feed: string;
	};
	ok: {
		feed: string;
	};
	vk: {
		feed: string;
	};
	telegram: {
		feed: string;
	};
	rss: {
		feed: string;
	};
	twitter: {
		feed: string;
	};
	fb: {
		feed: string;
	};
	user: {
		users: string;
		oneUserProfile: string;
		userProfile: string;
		userServices: string;
	};
	mockups: {
		userMockups: string;
		allMockups: string;
	};
	appsets: {
		appsets: string;
		myAppsets: string;
		mySlideshows: string;
	};
	currency: {
		feed: string;
	};
	owm: {
		feed: string;
	};
	ya: {
		feed: string;
	};
	cities: {
		oneCity: string;
	};
	group: {
		groups: string;
	};
	system_group: {
		groups: string;
	};
	paidServices: {
		services: string;
		serviceOffers: string;
		packages: string;
		offerPackages: string;
		orders: string;
	};
	slideStream: {
		streams: string;
		streamById: string;
	};
	cart: {
		list: string;
	};
	faq: {
		list: string;
	};
	videoHosting: {
		videos: string;
	};
}

export const publishNames: IPublishNames = {
	slideshow: {
		oneFull: 'slideshow.oneFull',
		oneFullShow: 'slideshow.oneFullShow',
		myList: 'slideshow.myList',
		systemList: 'slideshow.systemList',
		listForAdmin: 'slideshow.listForAdmin',
		byElement: 'slideshow.byElement',
		myListForStat: 'slideshow.myListForStat',
		byStatId: 'slideshow.byStatId',
		vectors: 'myVectors',
	},
	instagram: {
		feed: 'instagram_feed',
	},
	ok: {
		feed: 'ok_feed',
	},
	vk: {
		feed: 'vk_feed',
	},
	telegram: {
		feed: 'telegram_feed',
	},
	rss: {
		feed: 'rssFeed',
	},
	twitter: {
		feed: 'twitter',
	},
	fb: {
		feed: 'fb_feed',
	},
	user: {
		users: 'users',
		oneUserProfile: 'oneUserProfile',
		userProfile: 'user.profile',
		userServices: 'user.services',
	},
	mockups: {
		userMockups: 'userMockups',
		allMockups: 'allMockups',
	},
	appsets: {
		appsets: 'appsets',
		myAppsets: 'myAppsets',
		mySlideshows: 'mySlideshows',
	},
	currency: {
		feed: 'currency_feed',
	},
	owm: {
		feed: 'owm_feed',
	},
	ya: {
		feed: 'schedule_feed',
	},
	cities: {
		oneCity: 'oneCity',
	},
	group: {
		groups: 'groups',
	},
	system_group: {
		groups: 'systemGroups.groups',
	},
	paidServices: {
		services: 'paidServices',
		serviceOffers: 'serviceOffers',
		packages: 'paidServices.packages',
		offerPackages: 'paidServices.offerPackages',
		orders: 'paidServices.orders',
	},
	slideStream: {
		streams: 'slideStream.streams',
		streamById: 'slideStream.streamById',
	},
	cart: {
		list: 'cart.list',
	},
	faq: {
		list: 'faq.list',
	},
	videoHosting: {
		videos: 'videoHosting.videos',
	},
};
