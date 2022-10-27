import {Meteor} from 'meteor/meteor';
import * as Agenda from 'agenda';
import {methodNames} from 'shared/constants/methodNames';

export default function(agenda: Agenda): void {
	agenda.define(
		'updateVimeoVideos',
		Meteor.bindEnvironment(() => {
			Meteor.call(methodNames.videoHosting.checkVimeoVideos);
		}),
	);

	agenda.every('one minute', 'updateVimeoVideos');
}
