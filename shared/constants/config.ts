import {Meteor} from 'meteor/meteor';

const {settings} = Meteor;

const Config = {
	emailTemplates: {
		siteName: settings.siteName,
		from: settings.siteName + ` <${settings.fromEmail}>`,
		resetPassword: {
			subject(user) {
				return 'Восстановление пароля';
			},
			html(user, url) {
				// url looks like http://localhost:3000/#/reset-password/RlZirInmImrX6zv7v3sK-92pLF8GUpfYrp5LV0QCd8b
				const token = url.split('/reset-password/')[1];
				const url2 = Meteor.absoluteUrl('reset-password/' + token);
				return (
					'<h1>' +
					settings.siteName +
					'</h1>' +
					'Вы запросили восстановление доступа к сайту ' +
					settings.siteName +
					', перейдите по ссылке, чтобы сбросить пароль и указать новый:<br/>' +
					'<br/>' +
					'<a href="' +
					url2 +
					'">' +
					url2 +
					'</a><br/>' +
					'<br/>' +
					'Если вы не запрашивали восстановление доступа, просто удалите это письмо.' +
					'<br/>' +
					settings.siteName
				);
			},
		},
		verifyEmail: {
			subject(user) {
				return 'Подтвердите свой e-mail';
			},
			html(user, url) {
				return (
					'<h1>' +
					settings.siteName +
					'</h1>' +
					'Поздравляем! Вы зарегистрировались на сайте ' +
					settings.siteName +
					'! Перейдите по ссылке, чтобы подтвердить свой e-mail и иметь ' +
					'возможность восстанавливать пароль в будущем:' +
					'<br/>' +
					'<a href="' +
					url +
					'">' +
					url +
					'</a><br/>' +
					'<br/>' +
					'Если вы не регистрировались на сайте, просто удалите это письмо.' +
					'<br/>' +
					settings.siteName
				);
			},
		},
	},
};

export {Config};
