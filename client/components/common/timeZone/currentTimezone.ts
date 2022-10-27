import moment from 'moment-timezone';
const storageTimeZoneKey = 'selectedTimeZone';

export const getCurrentTimezone = () => {
	const selectedTimeZone = window.localStorage.getItem(storageTimeZoneKey);
	const zones = moment.tz.zonesForCountry('RU');

	if (selectedTimeZone && zones.includes(selectedTimeZone)) {
		return selectedTimeZone;
	}

	return moment.tz.guess();
};

export const setCurrentTimezone = (timeZone: string): void => {
	window.localStorage.setItem(storageTimeZoneKey, timeZone);
};
