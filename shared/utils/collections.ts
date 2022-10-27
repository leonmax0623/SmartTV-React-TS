export const getDefaultSoftRemove = () => ({
	removedFieldName: 'removed',
	hasRemovedAtField: true,
	removedAtFieldName: 'removedAt',
});

export const getDefaultTimestamp = () => ({
	hasCreatedField: true,
	createdFieldName: 'createdAt',
	hasUpdatedField: true,
	updatedFieldName: 'updatedAt',
});
