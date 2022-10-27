import * as React from 'react';
import cn from 'classnames';

import {
	ISlideElement,
	SlideElementLogoPositionEnum,
	SlideElementVideoDisplayEnum,
	SlideElementVideoProviderEnum,
} from 'shared/collections/SlideElements';
import css from './VideoWidget.pcss';
import appConsts from 'client/constants/appConsts';
import YoutubeWidget from 'client/components/widgets/YoutubeWidget';
import VimeoWidget from 'client/components/widgets/VimeoWidget';
import VkVideoWidget from 'client/components/widgets/VkVideoWidget.js';

export interface IVideoWidgetProps {
	element: ISlideElement;
	editor: boolean;
	videoBlockTransition?: (arg0: {duration?: number; ended?: boolean}) => void;
}

class VideoWidget extends React.PureComponent<IVideoWidgetProps> {
	render() {
		const {editor, element, videoBlockTransition} = this.props;
		const {videoProvider} = element;
		const {opacity, videoLogo, logoPosition, videoDisplay} = element;

		let logoPositionCss = {};
		switch (logoPosition) {
			case SlideElementLogoPositionEnum.TOPLEFT:
				logoPositionCss = {top: 0, left: 0};
				break;

			case SlideElementLogoPositionEnum.TOPRIGHT:
				logoPositionCss = {top: 0, right: 0};
				break;

			case SlideElementLogoPositionEnum.BOTTOMLEFT:
				logoPositionCss = {bottom: 0, left: 0};
				break;

			case SlideElementLogoPositionEnum.BOTTOMRIGHT:
				logoPositionCss = {bottom: 0, right: 0};
				break;
		}

		return (
			<div
				style={{opacity}}
				className={cn(css.video, {
					[css.isHiddenVideo]:
						editor && videoProvider === SlideElementVideoProviderEnum.YOUTUBE,
					[css.isHiddenVideoVK]:
						editor && videoProvider === SlideElementVideoProviderEnum.VK,
				})}
			>
				<div
					style={{height: '100%'}}
					className={cn({
						[css.isHidden]: videoDisplay === SlideElementVideoDisplayEnum.ONLY_SOUND,
					})}
				>
					{videoProvider === SlideElementVideoProviderEnum.VIMEO && (
						<VimeoWidget
							element={element}
							editor={editor}
							videoBlockTransition={videoBlockTransition}
						/>
					)}
					{videoProvider === SlideElementVideoProviderEnum.YOUTUBE && (
						<YoutubeWidget
							element={element}
							editor={editor}
							videoBlockTransition={videoBlockTransition}
						/>
					)}
					{videoProvider === SlideElementVideoProviderEnum.VK && (
						<VkVideoWidget
							element={element}
							editor={editor}
							videoBlockTransition={videoBlockTransition}
						/>
					)}
				</div>

				{videoLogo && (
					<img
						src={`${appConsts.uploadUrl}/${videoLogo}`}
						className={cn(css.logo, {
							[css.isHidden]:
								videoDisplay === SlideElementVideoDisplayEnum.ONLY_SOUND,
						})}
						style={logoPositionCss}
						alt=""
					/>
				)}
			</div>
		);
	}
}

export default VideoWidget;
