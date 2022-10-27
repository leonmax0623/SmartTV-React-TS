import moment from 'moment-timezone';
const titles = {
	'Asia/Anadyr': 'GMT+12 (Анадырь)',
	'Asia/Barnaul': 'GMT+7 (Барнаул)',
	'Asia/Chita': 'GMT+9 (Чита)',
	'Asia/Irkutsk': 'GMT+8 (Иркутск)',
	'Asia/Kamchatka': 'GMT+3 (Камчатка)',
	'Asia/Khandyga': 'GMT+9 (Хандыга)',
	'Asia/Krasnoyarsk': 'GMT+7 (Красноярск)',
	'Asia/Magadan': 'GMT+11 (Магадан)',
	'Asia/Novokuznetsk': 'GMT+7 (Новокузнецк)',
	'Asia/Novosibirsk': 'GMT+7 (Новосибирск)',
	'Asia/Omsk': 'GMT+6 (Омск)',
	'Asia/Sakhalin': 'GMT+11 (Сахалин)',
	'Asia/Srednekolymsk': 'GMT+11 (Среднеколымск)',
	'Asia/Tomsk': 'GMT+7 (Томск)',
	'Asia/Ust-Nera': 'GMT+10 (Усть-Нера)',
	'Asia/Vladivostok': 'GMT+10 (Владивосток)',
	'Asia/Yakutsk': 'GMT+9 (Якутск)',
	'Asia/Yekaterinburg': 'GMT+5 (Екатеринбург)',
	'Europe/Astrakhan': 'GMT+4 (Астрахань)',
	'Europe/Kaliningrad': 'GMT+2 (Калининград)',
	'Europe/Kirov': 'GMT+3 (Киров)',
	'Europe/Moscow': 'GMT+3 (Москва)',
	'Europe/Samara': 'GMT+4 (Самара)',
	'Europe/Saratov': 'GMT+4 (Саратов)',
	'Europe/Simferopol': 'GMT+3 (Симферополь)',
	'Europe/Ulyanovsk': 'GMT+4 (Ульяновск)',
	'Europe/Volgograd': 'GMT+3 (Волгоград)',
};

export default function timeZoneSelectData(countryCode = 'RU') {
	if (!countryCode) return [];

	const zonesList = moment.tz.zonesForCountry(countryCode);

	return (Array.isArray(zonesList) ? zonesList : []).map((id) => ({id, title: titles[id]}));
}
