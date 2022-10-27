import omit from 'lodash/omit';
import extend from 'lodash/extend';
import {diff} from 'deep-diff';
import {Mongo} from 'meteor/mongo';

import SystemLogs from 'shared/collections/SystemLogs';

function extendWithSystemLogs() {
	const proto = Mongo.Collection.prototype;
	extend(proto, {
		logEvents(props) {
			const {disabled = {}} = props;
			const type = this._name;
			if (!disabled.insert) {
				this.after.insert((userId, doc) => {
					insertSystemLog({
						doc,
						type,
						props,
						userId,
						action: 'insert',
						previous: this.previous,
					});
				});
			}

			if (!disabled.update) {
				this.after.update(function afterUpdate(userId, doc) {
					insertSystemLog({
						doc,
						type,
						props,
						userId,
						action: 'update',
						previous: this.previous,
					});
				});
			}

			if (!disabled.remove) {
				this.after.remove(function afterRemove(userId, doc) {
					insertSystemLog({
						doc,
						type,
						props,
						userId,
						action: 'remove',
						previous: this.previous,
					});
				});
			}
		},
	});
}

function insertSystemLog({doc, type, userId, props, action, previous}) {
	const {title, description, elementType} = props;
	if (elementType && elementType !== doc.type) {
		return undefined;
	}
	SystemLogs.insert({
		type,
		action,
		userId: userId,
		objectId: doc._id,
		rawDifference: previous && getRawDocument(diff(previous, doc)),
		createdAt: new Date(),
	});
}

function getRawDocument(doc, excludeFields) {
	try {
		return omit(doc, excludeFields || []);
	} catch (error) {
		//
	}
}

extendWithSystemLogs();
