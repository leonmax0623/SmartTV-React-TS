import {
	ICustomFont,
	ISlideshow,
	ISlideshowStyles,
	SlideshowLocationTypeEnum,
	SlideshowOrientationEnum,
	SlideshowPreviewEnum,
	SlideshowRadiostationTypeEnum,
} from '../collections/Slideshows';
import {ISlideElement, ISlideElementStyles, ISlideElementAnimation} from 'shared/collections/SlideElements';
import {ISlide} from 'shared/collections/Slides';

export interface ISlideshowParams {
	orientation?: SlideshowOrientationEnum;
	showSlidePreview?: SlideshowPreviewEnum;
	name?: string;
	location?: SlideshowLocationTypeEnum;
	previewImage?: string;
	password?: string;
	address?: string;
	radiostation?: SlideshowRadiostationTypeEnum;
	radioVolume?: number;
	isSystem?: boolean;
	groupId?: string;
	additionalFonts?: ICustomFont[];
	systemGroupId?: string;
	isGridBlockEnabled: boolean;
}

export type IUpdateSlideParams = Partial<ISlide>;

export type IUpdateSlideElementParams = Partial<ISlideElement>;

export type IUpdateSlideshowParams = Partial<ISlideshow>;

export type IUpdateSlideshowStyles = Partial<ISlideshowStyles>;

export type IUpdateElementStyles = Partial<ISlideElementStyles>;

export type IUpdateElementAnimation = Partial<ISlideElementAnimation>;
