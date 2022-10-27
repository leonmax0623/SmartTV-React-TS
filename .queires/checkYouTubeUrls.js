db.slideElements.aggregate(
	[
		{$match: {type: 'YOUTUBE'}},
		{
			$project:
				{
					item: 1,
					youtbeUrl: { $substr: [ "$videoLink", 0, 29 ] },
				}
		},
		{
			$group: { _id: "$youtbeUrl"}
		}
	]
)
