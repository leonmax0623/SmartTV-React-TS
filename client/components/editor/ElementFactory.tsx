import * as React from 'react';
import isNil from 'lodash/isNil';

import {ISlideElement, SlideElementTypeEnum} from 'shared/collections/SlideElements';

import {ElementClickWrapperWidget} from 'client/components/widgets/ElementClickWrapperWidget';
import {StatisticsWrapperWidget} from 'client/components/widgets/StatisticsWrapperWidget';

const TextWidgetEditor = React.lazy(() =>
	import(/* webpackChunkName: "text-editor" */ 'client/components/widgets/TextWidgetEditor'),
);
const TextWidget = React.lazy(() => import('client/components/widgets/TextWidget'));
const HtmlWidget = React.lazy(() => import('client/components/widgets/HtmlWidget'));
const ClockWidget = React.lazy(() => import('client/components/widgets/ClockWidget'));
const ImageWidget = React.lazy(() => import('client/components/widgets/ImageWidget'));
const CurrencyWidget = React.lazy(() => import('client/components/widgets/CurrencyWidget'));
const ScheduleWidget = React.lazy(() => import('client/components/widgets/ScheduleWidget'));
const WeatherWidget = React.lazy(() => import('client/components/widgets/WeatherWidget'));
const TwitterWidget = React.lazy(() => import('client/components/widgets/TwitterWidget'));
const OkWidget = React.lazy(() => import('client/components/widgets/OkWidget'));
const TrafficWidget = React.lazy(() => import('client/components/widgets/TrafficWidget'));
const VkWidget = React.lazy(() => import('client/components/widgets/VkWidget'));
const TelegramWidget = React.lazy(() => import('client/components/widgets/TelegramWidget'));
const RssWidget = React.lazy(() => import('client/components/widgets/RssWidget'));
const FbWidget = React.lazy(() => import('client/components/widgets/FbWidget'));
const InstagramWidget = React.lazy(() => import('client/components/widgets/InstagramWidget'));
const VideoWidget = React.lazy(() => import('client/components/widgets/VideoWidget'));
const TickerWidget = React.lazy(() => import('client/components/widgets/TickerWidget'));
const AirQualityWidget = React.lazy(() => import('client/components/widgets/AirQualityWidget'));
const AirQualityWidgetEditor = React.lazy(() =>
	import('client/components/widgets/AirQualityWidgetEditor'),
);
const ZoomWidget = React.lazy(() => import('client/components/widgets/ZoomWidget'));

interface IElementFactoryProps {
	element: ISlideElement;
	isSelected?: boolean;
	editorMode?: boolean;
	isPreview?: boolean;
	scale?: number;
	videoBlockTransition?: (arg0: {duration?: number; ended?: boolean}) => void;
	inCurrentSlide?: boolean;
	disableCustomContextMenu?: () => void;
	enableCustomContextMenu?: () => void;
}

const ElementFactory: React.FunctionComponent<IElementFactoryProps> = ({
	element,
	inCurrentSlide,
	isSelected,
	editorMode = false,
	isPreview = false,
	scale,
	videoBlockTransition,
	disableCustomContextMenu,
	enableCustomContextMenu,
}) => {
	const {
		fontSize,
		fontFamily,
		textColor,
		socialHeaderFontSize,
		socialHeaderColor,
		socialHeaderBackgroundColor,
		socialHeaderFont,
		socialTextFontSize,
		socialTextColor,
		socialTextBackgroundColor,
		socialTextFont,
		socialDateFontSize,
		socialDateColor,
		socialDateBackgroundColor,
		socialDateFont,
	} = element;

	const headerStyle = {
		fontSize: !isNil(socialHeaderFontSize) ? socialHeaderFontSize : fontSize,
		color: socialHeaderColor || textColor,
		backgroundColor: socialHeaderBackgroundColor,
		fontFamily: socialHeaderFont || fontFamily,
	};

	const textStyle = {
		fontSize: !isNil(socialTextFontSize) ? socialTextFontSize : fontSize,
		color: socialTextColor,
		backgroundColor: socialTextBackgroundColor,
		fontFamily: socialTextFont,
	};

	const timerStyle = {
		fontSize: !isNil(socialDateFontSize) ? socialDateFontSize : fontSize,
		color: socialDateColor || textColor,
		backgroundColor: socialDateBackgroundColor,
		fontFamily: socialDateFont || fontFamily,
	};

	const [text, setText] = React.useState(element.text);

	const renderElement = () => {
		switch (element.type) {
			case SlideElementTypeEnum.TEXT:
				// load only if selected
				return editorMode && isSelected ? (
					<React.Suspense fallback={<div>Загрузка...</div>}>
						<TextWidgetEditor
							element={element}
							scale={scale}
							onEditorFocus={disableCustomContextMenu}
							onEditorBlur={enableCustomContextMenu}
							setText={setText}
							text={text}
						/>
					</React.Suspense>
				) : (
					<React.Suspense fallback={<div>Загрузка...</div>}>
						<TextWidget element={element} text={text} setText={setText} />
					</React.Suspense>
				);

			case SlideElementTypeEnum.HTML:
				return (
					<React.Suspense fallback={<div>Загрузка...</div>}>
						<HtmlWidget element={element} />
					</React.Suspense>
				);

			case SlideElementTypeEnum.TICKER:
				return (
					<React.Suspense fallback={<div>Загрузка...</div>}>
						<TickerWidget element={element} />
					</React.Suspense>
				);

			case SlideElementTypeEnum.CLOCK:
				return (
					<React.Suspense fallback={<div>Загрузка...</div>}>
						<ClockWidget element={element} />
					</React.Suspense>
				);

			case SlideElementTypeEnum.IMAGE:
				return (
					<React.Suspense fallback={<div>Загрузка...</div>}>
						<ImageWidget element={element} />
					</React.Suspense>
				);

			case SlideElementTypeEnum.CURRENCY_RATE:
				return (
					<React.Suspense fallback={<div>Загрузка...</div>}>
						<CurrencyWidget element={element} />
					</React.Suspense>
				);

			case SlideElementTypeEnum.TRANSPORT_SCHEDULE:
				return (
					<React.Suspense fallback={<div>Загрузка...</div>}>
						<ScheduleWidget
							element={element}
							inCurrentSlide={editorMode || inCurrentSlide}
						/>
					</React.Suspense>
				);

			case SlideElementTypeEnum.WEATHER:
				return (
					<React.Suspense fallback={<div>Загрузка...</div>}>
						<WeatherWidget element={element} />
					</React.Suspense>
				);

			case SlideElementTypeEnum.TWITTER:
				return (
					<React.Suspense fallback={<div>Загрузка...</div>}>
						<TwitterWidget
							element={element}
							inCurrentSlide={editorMode || inCurrentSlide}
							styles={{headerStyle, timerStyle, textStyle}}
						/>
					</React.Suspense>
				);

			case SlideElementTypeEnum.ODNOKLASSNIKI:
				return (
					<React.Suspense fallback={<div>Загрузка...</div>}>
						<OkWidget
							inCurrentSlide={editorMode || inCurrentSlide}
							element={element}
							styles={{headerStyle, timerStyle, textStyle}}
						/>
					</React.Suspense>
				);

			case SlideElementTypeEnum.TRAFFIC_JAM:
				return (
					<React.Suspense fallback={<div>Загрузка...</div>}>
						<TrafficWidget element={element} />
					</React.Suspense>
				);

			case SlideElementTypeEnum.VKONTAKTE:
				return (
					<React.Suspense fallback={<div>Загрузка...</div>}>
						<VkWidget
							element={element}
							inCurrentSlide={editorMode || inCurrentSlide}
							styles={{headerStyle, timerStyle, textStyle}}
						/>
					</React.Suspense>
				);

			case SlideElementTypeEnum.TELEGRAM:
				return (
					<React.Suspense fallback={<div>Загрузка...</div>}>
						<TelegramWidget
							element={element}
							inCurrentSlide={editorMode || inCurrentSlide}
							styles={{headerStyle, timerStyle, textStyle}}
						/>
					</React.Suspense>
				);

			case SlideElementTypeEnum.RSS:
				return (
					<React.Suspense fallback={<div>Загрузка...</div>}>
						<RssWidget
							element={element}
							inCurrentSlide={editorMode || inCurrentSlide}
						/>
					</React.Suspense>
				);

			case SlideElementTypeEnum.FACEBOOK:
				return (
					<React.Suspense fallback={<div>Загрузка...</div>}>
						<FbWidget
							element={element}
							styles={{headerStyle, timerStyle, textStyle}}
							inCurrentSlide={editorMode || inCurrentSlide}
						/>
					</React.Suspense>
				);

			case SlideElementTypeEnum.INSTAGRAM:
				return (
					<React.Suspense fallback={<div>Загрузка...</div>}>
						<InstagramWidget
							element={element}
							inCurrentSlide={editorMode || inCurrentSlide}
							styles={{headerStyle, timerStyle, textStyle}}
						/>
					</React.Suspense>
				);

			case SlideElementTypeEnum.YOUTUBE: {
				if (inCurrentSlide || editorMode) {
					return (
						<React.Suspense fallback={<div>Loading...</div>}>
							<VideoWidget
								element={element}
								editor={editorMode}
								videoBlockTransition={videoBlockTransition}
							/>
						</React.Suspense>
					);
				}

				return <div />;
			}

			case SlideElementTypeEnum.AIR_QUALITY: {
				return editorMode ? (
					<React.Suspense fallback={<div>Loading...</div>}>
						<AirQualityWidgetEditor element={element} />
					</React.Suspense>
				) : (
					<React.Suspense fallback={<div>Загрузка...</div>}>
						<AirQualityWidget element={element} />
					</React.Suspense>
				);
			}

			case SlideElementTypeEnum.ZOOM: {
				return (
					<React.Suspense fallback={<div>Загрузка...</div>}>
						<ZoomWidget
							element={element}
							editorMode={editorMode}
							isPreview={isPreview}
						/>
					</React.Suspense>
				);
			}

			default:
				return <div>Элемент не найден</div>;
		}
	};

	return (
		<StatisticsWrapperWidget
			calculate={(!editorMode && inCurrentSlide && element.collectStat) || false}
			elementId={element?._id}
		>
			<ElementClickWrapperWidget
				useHref={(!editorMode && inCurrentSlide && !!element?.href) || false}
				href={element?.href}
			>
				{renderElement()}
			</ElementClickWrapperWidget>
		</StatisticsWrapperWidget>
	);
};

ElementFactory.defaultProps = {
	editorMode: false,
	isPreview: false,
};

export default React.memo(ElementFactory);
