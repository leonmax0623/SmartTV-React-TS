import * as React from 'react';

import {ISlideElement} from 'shared/collections/SlideElements';
import {SlideshowBackgroundImageDisplayEnum} from 'shared/collections/Slideshows';
import {getBackgroundImageSize, getBackgroundImageUrl} from 'client/utils/slides';
import css from './TextWidget.pcss';

interface ITextWidgetProps {
	element: ISlideElement;
	setText: (text: string) => void;
	text: string;
}

class TextWidget extends React.Component<ITextWidgetProps> {
	componentDidUpdate(prevProps) {
		// В случае, если документ изменен на уровне базы данных.
		if (prevProps.element.text !== this.props.element.text) {
			this.props.setText(this.props.element.text);
		}
	}

	render() {
		const {element, text} = this.props;
		return (
			<div
				className={css.textWidget}
				style={{
					height: '100%',
					fontSize: element.fontSize,
					lineHeight: element.lineHeight,
					textAlign: element.textAlign,
					letterSpacing: `${element.letterSpacing}em`,
					opacity: element.opacity,
					color: element.textColor,
					backgroundColor: element.backgroundColor,
					backgroundImage: getBackgroundImageUrl(element.backgroundImage),
					backgroundRepeat:
						element.backgroundImageDisplay !== SlideshowBackgroundImageDisplayEnum.TILE
							? 'no-repeat'
							: 'repeat',
					backgroundSize: getBackgroundImageSize(element.backgroundImageDisplay),
					padding: element.padding,
				}}
				/* 
          Здесь text либо передан напрямую из компонента TextWidgetEditor
          либо равен element.text в случаях когда компонент 
          проинициализирован в первый раз, либо документ element изменен в базе.
        */
				dangerouslySetInnerHTML={{__html: text || ''}}
			/>
		);
	}
}

export default TextWidget;
