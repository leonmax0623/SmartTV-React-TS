import {
	SlideshowBackgroundImageDisplayEnum,
	SlideshowOrientationEnum,
} from 'shared/collections/Slideshows';
import {
	ISlideElement,
	ISlideElementStyles,
	PermanentPositionEnum,
} from 'shared/collections/SlideElements';
import appConsts from 'client/constants/appConsts';

export const getSlideResolution = (
	slideshowOrientation: SlideshowOrientationEnum,
): {width: number; height: number} => {
	switch (slideshowOrientation) {
		case SlideshowOrientationEnum.VERTICAL:
			return {width: 1080, height: 1920};

		case SlideshowOrientationEnum.HORIZONTAL:
			return {width: 1920, height: 1080};

		default:
			throw Error('Unknown orientation');
	}
};

export const getBackgroundImageUrl = (imageUrl?: string): string => {
	if (!imageUrl) {
		return 'none';
	}

	if (/^http/i.test(imageUrl) || /^\/svg/i.test(imageUrl)) {
		return `url(${imageUrl})`;
	}

	return `url(${appConsts.uploadUrl}/${imageUrl})`;
};

export const getOriginImageUrl = (imageUrl: string): string => {
	return /^http/i.test(imageUrl) || /^\/svg/i.test(imageUrl)
		? imageUrl
		: `${appConsts.uploadUrl}/${imageUrl}`;
};

export const getBackgroundImageSize = (display?: SlideshowBackgroundImageDisplayEnum): string => {
	switch (display) {
		case SlideshowBackgroundImageDisplayEnum.FILL:
			return 'cover';

		case SlideshowBackgroundImageDisplayEnum.TILE:
			return 'unset';

		default:
			return '100% 100%';
	}
};

export const getPermanentZIndex = (permanentPosition: PermanentPositionEnum) => {
	switch (permanentPosition) {
		case PermanentPositionEnum.BOTTOM:
			return -1;

		case PermanentPositionEnum.TOP:
			return 1000;

		default:
			return 1;
	}
};

interface ISlideElementDomStyles extends ISlideElementStyles {
	zIndex?: number;
}
export const getInitialStyles = (element: ISlideElement): ISlideElementDomStyles => {
	const initialStyles: ISlideElementDomStyles = {
		position: 'absolute',
		width: `${element.width}px`,
		height: `${element.height}px`,
		left: `${element.left}px`,
		top: `${element.top}px`,
		zIndex: element.permanent ? getPermanentZIndex(element.permanentPosition) : element.zIndex,
	};

	if (element.rotateAngle) initialStyles.transform = `rotate(${element.rotateAngle}deg)`;
	if (Array.isArray(element.warpMatrix)) {
		initialStyles.transform = initialStyles.transform || '';
		initialStyles.transform += ` matrix3d(${element.warpMatrix.join(',')})`;
	}
	if (Array.isArray(element.scale)) {
		initialStyles.transform = initialStyles.transform || '';
		initialStyles.transform += ` matrix(${element.scale[0]}, 0, 0, ${element.scale[1]}, 0, 0)`;
	}
	if (initialStyles.transform) initialStyles.transform = initialStyles.transform.trim();

	if (element.borderStyle) initialStyles['border-style'] = element.borderStyle;
	if (element.borderColor) initialStyles['border-color'] = element.borderColor;
	if (element.borderWidth) initialStyles['border-width'] = `${element.borderWidth}px`;
	if (element.borderImage) {
		initialStyles['border-image'] = `${getBackgroundImageUrl(element.borderImage)} ${
			element.borderWidth
		} round`;
	}

	return initialStyles;
};
