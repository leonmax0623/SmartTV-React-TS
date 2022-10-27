import React, {useEffect, useRef} from 'react';
// @ts-ignore
import Parser from 'react-html-parser';

import {ISlideElement} from 'shared/collections/SlideElements';
import {getBackgroundImageSize, getBackgroundImageUrl} from 'client/utils/slides';
import {SlideshowBackgroundImageDisplayEnum} from 'shared/collections/Slideshows';

interface IHtmlWidgetProps {
	element: ISlideElement;
}

let updateInterval: NodeJS.Timer;

const HtmlWidget: React.FC<IHtmlWidgetProps> = ({element}) => {
	const htmlRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		clearInterval(updateInterval);

		if (element.htmlUpdate) {
			updateInterval = setInterval(() => {
				const elem = htmlRef.current;
				const parentElem = htmlRef.current?.parentElement;

				if (elem) {
					parentElem?.removeChild(elem);
					parentElem?.appendChild(elem);
				}
			}, element.htmlUpdate * 1000 * 60 * 60);
		}

		return () => {
			clearInterval(updateInterval);
		};
	}, [element.htmlUpdate]);

	return (
		<div
			ref={htmlRef}
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
			}}
		>
			{Parser(element.html)}
		</div>
	);
};

export default HtmlWidget;
