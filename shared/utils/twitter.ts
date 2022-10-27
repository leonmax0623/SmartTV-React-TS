import {TwitterGetTypeEnum} from 'shared/collections/Twitter';
import {ISlideElement} from 'shared/collections/SlideElements';

export const makeQueryTwitter = (
	type: TwitterGetTypeEnum,
	value: string,
	element: ISlideElement,
) => {
	switch (type) {
		case TwitterGetTypeEnum.HASHTAG:
			return `#${value}`;

		case TwitterGetTypeEnum.PROFILE_NAME:
		default:
			return `@${value}`;

		case TwitterGetTypeEnum.LIST:
			return `${value}${element?.twitterListId ? `::${element?.twitterListId}` : ''}`;

		case TwitterGetTypeEnum.COLLECTION:
			return `${value}${
				element?.twitterCollectionId ? `::${element?.twitterCollectionId}` : ''
			}`;
	}
};
