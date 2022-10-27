import * as React from 'react';
import ImageIcon from '@material-ui/icons/Image';

import {ISlideElement} from 'shared/collections/SlideElements';
import {SlideshowBackgroundImageDisplayEnum} from 'shared/collections/Slideshows';
import css from './ImageWidget.pcss';
import {getBackgroundImageUrl, getBackgroundImageSize} from 'client/utils/slides';

interface ITextWidgetProps {
	element: ISlideElement;
}

export default class ImageWidget extends React.PureComponent<ITextWidgetProps> {
	render() {
		const {element} = this.props;

		if (!element.backgroundImage) {
			return (
				<div className={css.emptyImage}>
					<ImageIcon style={{fontSize: 400}} />
				</div>
			);
		}

		return (
			<div
				style={{
					height: '100%',
					backgroundImage: getBackgroundImageUrl(element.backgroundImage),
					backgroundRepeat:
						element.backgroundImageDisplay !== SlideshowBackgroundImageDisplayEnum.TILE
							? 'no-repeat'
							: 'repeat',
					backgroundSize: getBackgroundImageSize(element.backgroundImageDisplay),
					opacity: element.opacity,
				}}
			/>
		);
	}
}
