import * as React from 'react';
import cn from 'classnames';
// @ts-ignore
import Marquee from 'react-smooth-marquee';

import {ISlideElement, SlideElementDirectionTypeEnum} from 'shared/collections/SlideElements';
import {getBackgroundImageSize, getBackgroundImageUrl} from 'client/utils/slides';
import {SlideshowBackgroundImageDisplayEnum} from 'shared/collections/Slideshows';
import css from './TickerWidget.pcss';

interface ITickerWidgetProps {
	element: ISlideElement;
}

export default class TickerWidget extends React.PureComponent<ITickerWidgetProps> {
	render() {
		const {element} = this.props;
		const defaultSpeed = 20;
		const moderator = 100;

		// класс css.tickerScale для смены направления
		// смена direction пакета оставляет текст на месте при направлении 'направо'
		return (
			<div
				className={cn(css.container, {
					[css.tickerScale]:
						element.tickerDirection === SlideElementDirectionTypeEnum.TORIGHT,
				})}
				style={{
					height: '100%',
					backgroundColor: element.backgroundColor,
					backgroundImage: getBackgroundImageUrl(element.backgroundImage),
					backgroundRepeat:
						element.backgroundImageDisplay !== SlideshowBackgroundImageDisplayEnum.TILE
							? 'no-repeat'
							: 'repeat',
					backgroundSize: getBackgroundImageSize(element.backgroundImageDisplay),
					opacity: element.opacity,
					fontSize: element.fontSize,
					color: element.textColor,
					lineHeight: element.lineHeight,
					fontFamily: element.fontFamily,
				}}
				key={element.width.toString() + element.tickerDirection}
			>
				<Marquee velocity={(element.tickerSpeed || defaultSpeed) / moderator}>
					<div
						className={cn(css.ticker, {
							[css.tickerScale]:
								element.tickerDirection === SlideElementDirectionTypeEnum.TORIGHT,
						})}
					>
						{element.text}
					</div>
				</Marquee>
			</div>
		);
	}
}
