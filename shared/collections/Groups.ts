import {Mongo} from 'meteor/mongo';
import {Class} from 'meteor/jagi:astronomy';

export interface IGroup {
	_id: string;
	name: string;
	userId: string;
}

const Groups = new Mongo.Collection<IGroup>('groups');

export const Group = Class.create<IGroup>({
	name: 'Group',
	collection: Groups,

	fields: {
		name: String,
		userId: String,
	},

	secured: true,
});
