import SimpleSchema from 'simpl-schema';

export interface IServices {
	vk: IVkService | null;
	google?: IGoogleService | null;
	facebook?: IFacebookService | null;
	twitter?: ITwitterService | null;
}

export interface ITwitterService {
	user_id?: string;
	screen_name?: string;
	oauth_token?: string;
	oauth_token_secret?: string;
}

export interface IVkService {
	access_token?: string;
	expires_in?: number;
	user_id?: number;
}

export interface IGoogleService {
	access_token: string;
	id_token: string;
	expires_in: number;
	token_type: string;
	refresh_token: string;
}

export interface IFacebookService {
	access_token?: string;
	expires_in?: number;
	token_type?: string;
}

export enum ServiceEnum {
	VK = 'vk',
	GOOGLE = 'google',
	FACEBOOK = 'facebook',
	TWITTER = 'twitter',
}

export enum ServiceEnumDisplay {
	VK = 'VKontakte',
	GOOGLE = 'Google',
	FACEBOOK = 'Facebook',
	TWITTER = 'Twitter',
}

SimpleSchema.setDefaultMessages({
	messages: {
		en: {
			minString: 'Поле "{{{label}}}" должно быть не менее {{min}} символов',
			required: 'Введите {{{label}}}',
			passwordMismatch: 'Пароли не совпадают',
			wrongPassword: 'Неверный пароль',
			nonUniquePhone: 'Номер телефона уже используется',
			nonUniqueEmail: 'Этот e-mail уже используется',
			'regEx phone': [{msg: 'Номер телефона должен использовать только цифры'}],
			'regEx email': [{msg: 'Введите корректный e-mail адрес'}],
			emailNotFound: 'E-mail не найден',
			termsRequired: 'Необходимо согласиться с правилами',
		},
	},
});
const UserSchema = {
	Base: SimpleSchema,
	SignUp: SimpleSchema,
	Profile: SimpleSchema,
	LostPassword: SimpleSchema,
	ResetPassword: SimpleSchema,
	setPassword: SimpleSchema,
};

UserSchema.Base = new SimpleSchema({
	name: {
		type: String,
		label: 'имя',
	},
	surname: {
		type: String,
		label: 'фамилию',
		optional: true,
	},
	phone: {
		type: String,
		min: 6,
		label: 'телефон',
		optional: true,
	},
	company: {
		type: String,
		optional: true,
	},
});

// registration validation schema
UserSchema.SignUp = new SimpleSchema({
	email: {
		type: String,
		regEx: SimpleSchema.RegEx.Email,
		custom: function(): any {
			// won't work on client side, but will on the server
			const res = Meteor.users.findOne({'emails.address': this.value});
			if (res) {
				return 'nonUniqueEmail';
			}
		},
	},
	password: {
		type: String,
		min: 6,
		label: 'пароль',
	},
});

UserSchema.SignUp.extend(UserSchema.Base);

// Edit profile schema
UserSchema.Profile = new SimpleSchema({});
UserSchema.Profile.extend(UserSchema.Base);

// Lost password schema
UserSchema.LostPassword = new SimpleSchema({
	email: {
		type: String,
		regEx: SimpleSchema.RegEx.Email,
		custom: function(): any {
			// won't work on client side, but will on the server
			if (Meteor.isServer) {
				var res = Meteor.users.findOne({'emails.address': this.value});
				if (!res) return 'emailNotFound';
			}
		},
	},
});

// Reset password schema
UserSchema.ResetPassword = new SimpleSchema({
	token: {
		type: String,
	},
	password: {
		type: String,
		min: 6,
		label: 'пароль',
	},
	confirmPassword: {
		type: String,
		min: 6,
		custom: function(): any {
			if (this.value !== this.field('password').value) {
				return 'passwordMismatch';
			}
		},
		label: 'подтверждение пароля',
	},
});

// Set password (admin menu)
UserSchema.setPassword = new SimpleSchema({
	password: {
		type: String,
		min: 6,
		label: 'Пароль',
	},
});

// base validation schema for users
export {UserSchema};
