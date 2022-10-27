class routerUrls {
	home = '/';
	authRegistration = '/signup';
	authLogin = '/login';
	restricted = '/restricted';
	authForgotPassword = '/forgot';
	authResetPassword = '/reset-password/:token';
	oAuthVk = '/oauth/vk';
	oAuthGoogle = '/oauth/google';
	oAuthFacebook = '/oauth/facebook';
	oAuthTwitter = '/oauth/twitter';
	userProfile = '/profile';
	adminHome = '/admin';
	adminUsersEdit = '/admin/users/:id';
	adminUsers = '/admin/users';
	adminServices = '/admin/services';
	statisticsGroup = '/statistics/groups/:groupId';
	statisticsViewSlideshow = '/statistics/:id';
	statisticsViewElement = '/statistics/element/:id';
	statisticsViewStatId = '/statistics/statId/:statId';
	userSlideshowGroup = '/user/groups/:groupId';
	userSelectTemplate = '/user/templates/';
	userSelectTemplateGroup = '/user/templates/:groupId';
	userEditSlideshow = '/user/edit/:id';
	userViewSlideshow = '/:id';
	userMockups = '/user/mockups';
	userAppsSets = '/user/sets';
	userStreams = '/user/streams';
	userStreamsAdd = '/user/streams/add';
	userStreamsEdit = '/user/streams/:id';
	userVideoHosting = '/user/video-hosting';
	userVideoHostingAdd = '/user/video-hosting/add';
	userAppsSetsCreate = '/user/sets/create';
	userAppsSetsEdit = '/user/sets/:id';
	userPlan = '/user/plan';
	checkout = '/user/checkout';
	paymentSuccess = '/payment/success';
	paymentFail = '/payment/fail';
	userAppSetPreview = '/set/:id';
	adminApps = '/admin/apps';
	termsOfUse = '/terms-of-use';
	privacyPolicy = '/privacy-policy';
	prices = '/prices';
	contacts = '/contacts';

	// Внешние
	extInformers = 'https://s.prtv.su/informery';
	extInstructions = 'https://s.prtv.su/instrukczii';
	extFacebook = 'https://www.facebook.com/4prtv.ru/';
	extVk = 'https://vk.com/4prtvru';
}

export default new routerUrls();
