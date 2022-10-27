import {Class} from 'meteor/jagi:astronomy';
import {Mongo} from 'meteor/mongo';

export interface IFaqItem {
	id: string;
	title: string;
	content: string;
}
export const FaqItem = Class.create<IFaqItem>({
	name: 'faqItem',
	fields: {
		id: String,
		title: String,
		content: String,
	},
});
export interface IFaq {
	_id: true;
	key: string;
	title: string;
	items: IFaqItem[] | [];
}
export const Faq = Class.create<IFaq>({
	name: 'faq',
	collection: new Mongo.Collection<IFaq>('faq'),
	fields: {
		key: String,
		title: String,
		items: [FaqItem] || [],
	},
});
export enum FaqKeysEnum {
	PAID_SERVICES = 'PAID_SERVICES',
}
export const faqInitialData = {
	[FaqKeysEnum.PAID_SERVICES]: {
		key: FaqKeysEnum.PAID_SERVICES,
		title: 'Частые вопросы',
		items: [],
	},
};
