import React from 'react';
import {SlideElementTypeEnum} from 'shared/collections/SlideElements';
import TextFieldsIcon from '@material-ui/icons/TextFields';
import TextRotationNoneIcon from '@material-ui/icons/TextRotationNone';
import Html5Icon from 'client/components/editor/icons/Html5Icon';
import InsertPhotoIcon from '@material-ui/icons/InsertPhoto';
import VideocamIcon from '@material-ui/icons/Videocam';
import AccessTimeIcon from '@material-ui/icons/AccessTime';
import Icon from '@mdi/react';
import {mdiMoleculeCo2, mdiWeatherPartlyCloudy} from '@mdi/js';
import AttachMoneyIcon from '@material-ui/icons/AttachMoney';
import LocalAirportIcon from '@material-ui/icons/LocalAirport';
import TrafficIcon from '@material-ui/icons/Traffic';
import VkIcon from 'client/components/editor/icons/VkIcon';
import TelegramIcon from 'client/components/editor/icons/TelegramIcon';
import FacebookIcon from 'client/components/editor/icons/FacebookIcon';
import InstagramIcon from 'client/components/editor/icons/InstagramIcon';
import TwitterIcon from 'client/components/editor/icons/TwitterIcon';
import OdnoklassnikiIcon from 'client/components/editor/icons/OdnoklassnikiIcon';
import RssFeedIcon from '@material-ui/icons/RssFeed';

export const renderElementName = (elementType: SlideElementTypeEnum) => {
	switch (elementType) {
		case SlideElementTypeEnum.TEXT:
			return 'Текст';
		case SlideElementTypeEnum.TICKER:
			return 'Бегущая строка';
		case SlideElementTypeEnum.HTML:
			return 'HTML';
		case SlideElementTypeEnum.IMAGE:
			return 'Фото';
		case SlideElementTypeEnum.ZOOM:
			return 'Zoom';
		case SlideElementTypeEnum.YOUTUBE:
			return 'Видео';
		case SlideElementTypeEnum.CLOCK:
			return 'Часы';
		case SlideElementTypeEnum.WEATHER:
			return 'Погода';
		case SlideElementTypeEnum.AIR_QUALITY:
			return 'Качество воздуха';
		case SlideElementTypeEnum.CURRENCY_RATE:
			return 'Курс';
		case SlideElementTypeEnum.TRANSPORT_SCHEDULE:
			return 'Расписание';
		case SlideElementTypeEnum.TRAFFIC_JAM:
			return 'Пробки';
		case SlideElementTypeEnum.VKONTAKTE:
			return 'ВКонтакте';
		case SlideElementTypeEnum.TELEGRAM:
			return 'Телеграм';
		case SlideElementTypeEnum.FACEBOOK:
			return 'Фейсбук';
		case SlideElementTypeEnum.INSTAGRAM:
			return 'Инстаграм';
		case SlideElementTypeEnum.TWITTER:
			return 'Твиттер';
		case SlideElementTypeEnum.ODNOKLASSNIKI:
			return 'Одноклассники';
		case SlideElementTypeEnum.RSS:
			return 'RSS';
		default:
			return 'Элемент не найден';
	}
};
export const renderElementIcon = (elementType: SlideElementTypeEnum, color: string) => {
	switch (elementType) {
		case SlideElementTypeEnum.TEXT:
			return <TextFieldsIcon htmlColor={color} />;
		case SlideElementTypeEnum.TICKER:
			return <TextRotationNoneIcon htmlColor={color} />;
		case SlideElementTypeEnum.HTML:
			return <Html5Icon {...{htmlColor: color}} />;
		case SlideElementTypeEnum.IMAGE:
			return <InsertPhotoIcon htmlColor={color} />;
		case SlideElementTypeEnum.ZOOM:
			return <VideocamIcon htmlColor={color} />;
		case SlideElementTypeEnum.YOUTUBE:
			return <VideocamIcon htmlColor={color} />;
		case SlideElementTypeEnum.CLOCK:
			return <AccessTimeIcon htmlColor={color} />;
		case SlideElementTypeEnum.WEATHER:
			return <Icon path={mdiWeatherPartlyCloudy} size={1.3} color={color} />;
		case SlideElementTypeEnum.AIR_QUALITY:
			return <Icon path={mdiMoleculeCo2} size={1.3} color={color} />;
		case SlideElementTypeEnum.CURRENCY_RATE:
			return <AttachMoneyIcon htmlColor={color} />;
		case SlideElementTypeEnum.TRANSPORT_SCHEDULE:
			return <LocalAirportIcon htmlColor={color} />;
		case SlideElementTypeEnum.TRAFFIC_JAM:
			return <TrafficIcon htmlColor={color} />;
		case SlideElementTypeEnum.VKONTAKTE:
			return <VkIcon {...{htmlColor: color}} />;
		case SlideElementTypeEnum.TELEGRAM:
			return <TelegramIcon {...{htmlColor: color}} />;
		case SlideElementTypeEnum.FACEBOOK:
			return <FacebookIcon {...{htmlColor: color}} />;
		case SlideElementTypeEnum.INSTAGRAM:
			return <InstagramIcon {...{htmlColor: color}} />;
		case SlideElementTypeEnum.TWITTER:
			return <TwitterIcon {...{htmlColor: color}} />;
		case SlideElementTypeEnum.ODNOKLASSNIKI:
			return <OdnoklassnikiIcon {...{htmlColor: color}} />;
		case SlideElementTypeEnum.RSS:
			return <RssFeedIcon htmlColor={color} />;
		default:
			return <div>Элемент не найден</div>;
	}
};
