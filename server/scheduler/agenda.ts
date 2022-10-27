import * as Agenda from 'agenda';

import okJob from './jobs/ok-schedule';
import {updateCurrency, updateTodayCurrencyValue} from './jobs/currency-schedule';
import OWMJob from './jobs/owm-schedule';
import YaScheduleJob from './jobs/ya-schedule';
import RssJob from './jobs/rss-schedule';
import VkJob from './jobs/vk-schedule';
import VimeoJob from './jobs/vimeo';

export default () => {
	const agenda = new Agenda({
		processEvery: '30 seconds',
		db: {
			address: process.env.MONGO_URL,
			options: {
				useNewUrlParser: true,
			},
		},
	});

	agenda.on(
		'ready',
		Meteor.bindEnvironment(() => {
			// Валюта
			updateCurrency(agenda);
			updateTodayCurrencyValue(agenda);

			// OK
			okJob(agenda);

			// OWAM
			OWMJob(agenda);

			// яндекс расписание
			YaScheduleJob(agenda);

			// яндекс расписание
			RssJob(agenda);

			// vk расписание
			VkJob(agenda);

			// Обновление статуса видео
			VimeoJob(agenda);

			agenda.start().then(() => {
				console.log('Agenda started');
			});
		}),
	);
};
