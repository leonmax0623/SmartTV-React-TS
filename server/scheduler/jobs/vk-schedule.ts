import * as Agenda from 'agenda';
import {IUser} from 'client/components/user/ProfilePage';

export default function(agenda: Agenda): void {
	agenda.define(
		'Update VK',
		Meteor.bindEnvironment(() => {
			const users = Meteor.users.find({'projectServices.vk': {$ne: null}}).fetch();
			const interval = 10000;

			if (users.length) {
				users.forEach((user: IUser, index) => {
					Meteor.setTimeout(() => {
						HTTP.post(
							'https://api.vk.com/method/wall.get',
							{
								params: {
									access_token: String(
										user.projectServices.vk &&
											user.projectServices.vk.access_token,
									),
									v: '5.131',
								},
							},
							(err: any, res: any) => {
								if (err) {
									return;
								}

								if (res.data.error) {
									Meteor.users.update(
										{_id: user._id},
										{$set: {'projectServices.vk': null}},
									);
								}
							},
						);
					}, index * interval);
				});
			}
		}),
	);

	// В 2:00 каждый день
	agenda.every('*/1 * * * *', 'Update VK');
}
