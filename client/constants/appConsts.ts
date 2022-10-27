import {appConfig} from 'client/constants/config';

interface IAppConsts {
	uploadUrl: string;
	maxImgSize: number;
	imgUrl: string;
	svgUrl: string;
	transitionDuration: number;

	ya: {
		apiKey: {apikey: string; ns: string};
	};
}

// @ts-ignore
const backendUrl = window.__meteor_runtime_config__.DDP_DEFAULT_CONNECTION_URL;

const appConsts: IAppConsts = {
	uploadUrl: `${backendUrl}/upload`,
	//7 mb работает, 8 уже нет
	maxImgSize: 1000 * 1000 * 7, // 7mb
	imgUrl: `${backendUrl}/img`,
	svgUrl: `${backendUrl}/svg`,
	transitionDuration: 1000,

	ya: {
		apiKey: {apikey: appConfig.YANDEX_GEOCODER_API_KEY, ns: 'YMaps'},
	},
};

export default appConsts;
