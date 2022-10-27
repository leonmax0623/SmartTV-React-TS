import {Mongo} from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';
import range from 'lodash/range';

export interface IAppsetsItem {
	title: string;
	appId: string;
	previewImage: string;
}

export interface IColorItem {
	color?: string;
	image?: string;
	focusColor?: string;
	backgroundColor?: string;
	repeat?: 'repeat' | 'no-repeat';
	scale?: number;
	transparency?: number;
}

export interface IAppsetsFeed {
	_id?: string;
	title: string;
	welcome: string;
	apps?: IAppsetsItem[];
	numId: string;
	userId: string;
	style?: IColorItem;
	createdAt: Date;
}

export const AppSets = new Mongo.Collection<IAppsetsFeed>('appsets');

export const transparencyValues = range(0, 110, 10);
export const scaleValues = range(50, 160, 10);
export const repeatValues = ['repeat', 'no-repeat'];

const AppSetSchema = {
	Creator: SimpleSchema,
	Item: SimpleSchema,
	Style: SimpleSchema,
	Base: SimpleSchema,
	Editor: SimpleSchema,
};

AppSetSchema.Item = new SimpleSchema({
	appId: {
		type: String,
		label: 'экран',
		optional: true,
	},
	title: {
		type: String,
		label: 'название',
		optional: true,
	},
	previewImage: {
		type: String,
		label: 'превью',
		regEx: /[^\/]*?/,
		optional: true,
	},
});

AppSetSchema.Style = new SimpleSchema({
	color: {
		type: String,
		label: 'цвет текста',
		optional: true,
	},
	focusColor: {
		type: String,
		label: 'цвет активного элемента',
		optional: true,
	},
	backgroundColor: {
		type: String,
		label: 'цвет фона',
		optional: true,
	},
	image: {
		type: String,
		label: 'изображение',
		regEx: /[^\/]*?/,
		optional: true,
	},
	repeat: {
		type: String,
		allowedValues: repeatValues,
		label: 'отображение изображения',
		optional: true,
	},
	scale: {
		type: Number,
		allowedValues: scaleValues,
		label: 'масштаб изображения',
		optional: true,
	},
	transparency: {
		type: Number,
		allowedValues: transparencyValues,
		label: 'прозрачность изображения',
		optional: true,
	},
});

AppSetSchema.Base = new SimpleSchema({
	title: {
		type: String,
		label: 'название подборки',
	},
	welcome: {
		type: String,
		label: 'приветственная фраза',
		optional: true,
	},
	style: {
		type: AppSetSchema.Style,
		label: 'стиль оформления',
		optional: true,
	},
	apps: {
		type: Array,
		label: 'экраны',
		optional: true,
	},
	'apps.$': {type: AppSetSchema.Item},
	numId: {
		type: String,
		label: 'номер',
		optional: true,
	},
	userId: {
		type: String,
		label: 'юзер',
		optional: true,
	},
	createdAt: {
		type: Date,
		label: 'Дата создания',
		optional: true,
	},
	updatedAt: {
		type: Date,
		label: 'Дата изменения',
		optional: true,
	},
	lastUpdate: {
		type: Date,
		label: 'Дата изменения',
		optional: true,
	},
});

AppSetSchema.Creator = new SimpleSchema({});
AppSetSchema.Creator.extend(AppSetSchema.Base);

AppSetSchema.Editor = new SimpleSchema({
	_id: {
		type: String,
		label: '_id',
	},
});
AppSetSchema.Editor.extend(AppSetSchema.Base);

export {AppSetSchema};
