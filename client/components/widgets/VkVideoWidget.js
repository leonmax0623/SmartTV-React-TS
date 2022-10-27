import * as React from 'react';
import cn from 'classnames';
import {CircularProgress} from '@material-ui/core';

import {
	SlideElementVideoDisplayEnum,
	SlideElementVideoTypeEnum,
} from 'shared/collections/SlideElements';
import {withTracker} from 'react-meteor-data-with-tracker';
import {MessageType} from 'client/components/slideshow/SlideshowPage';
import {appConfig} from 'client/constants/config';
import css from './VideoWidget.pcss';
import {IVideoWidgetProps} from 'client/components/widgets/VideoWidget';
import {createLogger} from 'redux-logger';
import {methodNames} from 'shared/constants/methodNames';
import {IResponseSuccess, IResponseError} from 'shared/models/Response';
import {publishNames} from 'shared/constants/publishNames';
import {Slideshow} from 'shared/collections/Slideshows';

class VkVideoWidget extends React.PureComponent {
	render() {
		const {element} = this.props;
		const {vkVideo} = element;
		if (!vkVideo || vkVideo.length < 1) {
			return (
				<div className={css.WidgetPlaceholder}>
					<h1>Выберите видео для показа плеера.</h1>
				</div>
			);
		}

		return (
			<div>
				<div
					className={cn(css.loader, {
						[css.hidden]: vkVideo && vkVideo.length > 0,
					})}
				>
					<CircularProgress />
				</div>
				{vkVideo && vkVideo.length > 0 && (
					<iframe
						src={vkVideo[0].player}
						width="853"
						height="480"
						allow="autoplay; encrypted-media; fullscreen; picture-in-picture;"
						frameBorder="0"
						allowFullScreen
					></iframe>
				)}
			</div>
		);
	}
}

export default VkVideoWidget;
