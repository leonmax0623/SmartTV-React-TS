const {
	YANDEX_GEOCODER_API_KEY,
	CITYGUIDE_ACCESS_KEY,
	VK_APP_ID,
	GOOGLE_CLIENT_ID,
	GOOGLE_API_KEY,
	FACEBOOK_APP_ID,
	TWITTER_CONSUMER_KEY,
	VIMEO_USER_ID,
	VIMEO_ACCESS_TOKEN,
} = process.env;

if (!YANDEX_GEOCODER_API_KEY) {
	throw Error(`Config param "YANDEX_GEOCODER_API_KEY" is required`);
}

if (!CITYGUIDE_ACCESS_KEY) {
	throw Error(`Config param "CITYGUIDE_ACCESS_KEY" is required`);
}

if (!VK_APP_ID) {
	throw Error(`Config param "VK_APP_ID" is required`);
}

if (!GOOGLE_CLIENT_ID) {
	throw Error(`Config param "GOOGLE_CLIENT_ID" is required`);
}

if (!FACEBOOK_APP_ID) {
	throw Error(`Config param "FACEBOOK_APP_ID" is required`);
}

if (!TWITTER_CONSUMER_KEY) {
	throw Error(`Config param "TWITTER_CONSUMER_KEY" is required`);
}

if (!VIMEO_USER_ID) {
	throw Error('Config param "VIMEO_USER_ID" is required');
}

if (!VIMEO_ACCESS_TOKEN) {
	throw Error('Config param "VIMEO_ACCESS_TOKEN" is required');
}

class AppConfig {
	readonly YANDEX_GEOCODER_API_KEY: string = YANDEX_GEOCODER_API_KEY!;
	readonly CITYGUIDE_ACCESS_KEY: string = CITYGUIDE_ACCESS_KEY!;
	readonly VK_APP_ID: string = VK_APP_ID!;
	readonly GOOGLE_CLIENT_ID: string = GOOGLE_CLIENT_ID!;
	readonly GOOGLE_API_KEY: string = GOOGLE_API_KEY!;
	readonly FACEBOOK_APP_ID: string = FACEBOOK_APP_ID!;
	readonly TWITTER_CONSUMER_KEY: string = TWITTER_CONSUMER_KEY!;
	readonly VIMEO_USER_ID: string = VIMEO_USER_ID!;
	readonly VIMEO_ACCESS_TOKEN: string = VIMEO_ACCESS_TOKEN!;
}

export const appConfig = new AppConfig();
