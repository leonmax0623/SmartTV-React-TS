import {Mongo} from 'meteor/mongo';
import {Class} from 'meteor/jagi:astronomy';

export interface ISystemGroup {
	_id: string;
	name: string;
	order: number;
}

const Groups = new Mongo.Collection<ISystemGroup>('systemGroups');

export const SystemGroup = Class.create<ISystemGroup>({
	name: 'SystemGroup',
	collection: Groups,

	fields: {
		name: String,
		order: Number,
	},

	secured: true,
});
