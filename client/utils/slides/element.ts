import {TwitterGetTypeEnum} from 'shared/collections/Twitter';
import {
	ISlideElement,
	SlideElementTwitterHashtagFilterEnum,
} from 'shared/collections/SlideElements';

export const twitterMakeValue = ({
	element,
	type,
}: {
	type?: TwitterGetTypeEnum;
	element: ISlideElement;
}) => {
	switch (type) {
		case TwitterGetTypeEnum.HASHTAG:
		default:
			const filter = () => {
				switch (element.twitterHashtagFilter) {
					case SlideElementTwitterHashtagFilterEnum.IMAGES:
						return ' filter:images';

					case SlideElementTwitterHashtagFilterEnum.NATIVE_VIDEO:
						return ' filter:native_video';

					case SlideElementTwitterHashtagFilterEnum.POPULAR:
						return ' sort:popular';
				}

				return '';
			};

			return `${element.twitterHashtag}${filter()}`;

		case TwitterGetTypeEnum.PROFILE_NAME:
			return element.twitterProfileName;

		case TwitterGetTypeEnum.LIST:
			return element.twitterProfileNameForList;

		case TwitterGetTypeEnum.COLLECTION:
			return element.twitterProfileNameForCollection;
	}
};
