const filter = 'FILL_1';
const newUserId = 'FILL_2';
const groupId = db.groups.findOne({userId: newUserId})._id;
if (groupId){
	db.slideshows.update({ ...filter }, {$set: { userId: newUserId, groupId: groupId }}, {multi: true});
}
