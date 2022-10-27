import * as Agenda from 'agenda';

export const updateCurrency = (agenda: Agenda) => {
	agenda.define(
		'Update currency',
		Meteor.bindEnvironment(() => {
			Meteor.call('currency.update');
		}),
	);

	// каждый день в 15:00
	agenda.every('0 15 * * *', 'Update currency');
};

export const updateTodayCurrencyValue = (agenda: Agenda) => {
	agenda.define(
		'Update today currency value',
		Meteor.bindEnvironment(() => {
			Meteor.call('currency.updateTodayValue');
		}),
	);

	// Ночью в 00:01 каждый день
	agenda.every('1 0 * * *', 'Update today currency value');
};
