import cn from 'classnames';
import {RouteComponentProps} from 'react-router-dom';
import {connect} from 'react-redux';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import RemoveRedEyeIcon from '@material-ui/icons/RemoveRedEye';
import UndoIcon from '@material-ui/icons/Undo';
import BrushIcon from '@material-ui/icons/Brush';
import SettingsIcon from '@material-ui/icons/Settings';
import GridOnIcon from '@material-ui/icons/GridOn';
import {withTracker} from 'react-meteor-data-with-tracker';
import {push} from 'connected-react-router';
import React, {useEffect, useState} from 'react';
import {useTransition, animated, useSpring} from 'react-spring';
import {YMaps} from 'react-yandex-maps';
// @ts-ignore
import Parser from 'react-html-parser';

import {RootState} from 'client/store/root-reducer';
import {publishNames} from 'shared/constants/publishNames';
import {ISlideshow, Slideshow} from 'shared/collections/Slideshows';
import {Slide, ISlide} from 'shared/collections/Slides';
import {
	ISlideElement,
	ISlideElementAdditionalFonts,
	SlideElement,
	SlideElementTypeEnum,
} from 'shared/collections/SlideElements';
import SlideShowEditorSettingsPanel from './SlideShowEditorSettingsPanel';
import SlideShowEditorSocialPanel from './SlideShowEditorSocialPanel';
import {
	deselectSlideElement,
	setSlideshowId,
	selectSlide,
	toggleEditorStylesPanel,
	toggleEditorSettingsPanel,
	toggleEditorSocialPanel,
	toggleEditorGridPanel,
} from '../../actions/slideShowEditor';
import SlideList from './SlideList';
import ActionButton from './sidebarUI/ActionButton';
import MenuDelimiter from './sidebarUI/MenuDelimiter';
import SlideViewport from './SlideViewport';
import ElementsMenu from './ElementsMenu';
import TextElementSettings from './elementSettings/TextElementSettings';
import TickerElementSettings from './elementSettings/TickerElementSettings';
import SlideShowEditorStylesPanel from './SlideShowEditorStylesPanel';
import HtmlElementSettings from './elementSettings/HtmlElementSettings';
import ImageElementSettings from './elementSettings/ImageElementSettings';
import CurrencyElementSettings from 'client/components/editor/elementSettings/CurrencyElementSettings';
import ClockElementSettings from './elementSettings/ClockElementSettings';
import ScheduleElementSettings from './elementSettings/ScheduleElementSettings';
import WeatherElementSettings from './elementSettings/WeatherElementSettings';
import TrafficElementSettings from './elementSettings/TrafficElementSettings';
import TwitterElementSettings from './elementSettings/TwitterElementSettings';
import OkElementSettings from './elementSettings/OkElementSettings';
import VkElementSettings from './elementSettings/VkElementSettings';
import TelegramElementSettings from './elementSettings/TelegramElementSettings';
import RssElementSettings from './elementSettings/RssElementSettings';
import FbElementSettings from './elementSettings/FbElementSettings';
import InstagramElementSettings from './elementSettings/InstagramElementSettings';
import VideoElementSettings from './elementSettings/VideoElementSettings';
import routerUrls from 'client/constants/routerUrls';
import {undoLastAction} from 'client/actions/slideshowActionHistory';
import {ISlideshowAction} from 'client/reducers/slideshowActionHistory';
import css from './SlideShowEditorPage.pcss';
import SlideshowEditorKeyEventHandler from 'client/components/editor/SlideshowEditorKeyEventHandler';
import AirQualityElementSettings from 'client/components/editor/elementSettings/AirQualityElementSettings';
import appConsts from 'client/constants/appConsts';
import SlideShowEditorGridPanel from 'client/components/editor/SlideShowEditorGridPanel';
import GoogleFontLoader from 'react-google-font-loader';
import {Meteor} from 'meteor/meteor';
import {methodNames} from 'shared/constants/methodNames';
import {PaidServicePackagesEnum} from 'shared/collections/PaidServices';
import {Box} from '@material-ui/core';
import ZoomElementSettings from 'client/components/editor/elementSettings/ZoomElementSettings';

interface ISlideShowEditorPageExternalProps extends RouteComponentProps<{id: string}> {}

interface ISlideShowEditorPageStoreProps {
	selectedElement?: ISlideElement & ISlideElementAdditionalFonts;
	selectedSlideId: string;
	setSlideshowId: typeof setSlideshowId;
	selectSlide: typeof selectSlide;
	push: typeof push;
	deselectSlideElement: typeof deselectSlideElement;
	toggleEditorStylesPanel: typeof toggleEditorStylesPanel;
	toggleEditorSettingsPanel: typeof toggleEditorSettingsPanel;
	toggleEditorSocialPanel: typeof toggleEditorSocialPanel;
	toggleEditorGridPanel: typeof toggleEditorGridPanel;
	undoLastAction: () => void;
	isStylesPanelOpen: boolean;
	isSettingsPanelOpen: boolean;
	isGridPanelOpen: boolean;
	isSocialPanelOpen: boolean;
	actions: ISlideshowAction[];
}

interface ISlideShowEditorPageData {
	loading: boolean;
	slideshow: ISlideshow;
	slides: ISlide[];
	slideElements: (ISlideElement & ISlideElementAdditionalFonts)[];
}

const SlideShowEditorPage: React.FC<ISlideShowEditorPageExternalProps &
	ISlideShowEditorPageStoreProps &
	ISlideShowEditorPageData> = (props) => {
	const {
		slides,
		match,
		selectedSlideId,
		selectedElement,
		slideshow,
		slideElements,
		isSettingsPanelOpen,
		isStylesPanelOpen,
		isSocialPanelOpen,
		isGridPanelOpen,
		actions,
	} = props;
	const [isStatisticsGranted, setStatisticsGranted] = useState(false);

	const menuOffset = 180;
	const elementMenuTransitions = useTransition(selectedElement ? [selectedElement] : [], {
		from: {opacity: 0, position: 'absolute', top: 0, bottom: 0, left: menuOffset},
		enter: {opacity: 1},
		leave: {opacity: 0},
	});
	const {transform: menuTransform} = useSpring({
		transform: `translateX(${!!selectedElement ? -menuOffset : 0}px)`,
	});

	useEffect(() => {
		props.setSlideshowId(match.params.id);

		return () => {
			props.selectSlide();
		};
	}, []);

	useEffect(() => {
		Meteor.call(
			methodNames.paidServices.isGranted,
			[PaidServicePackagesEnum.STATISTICS],
			(error: Error | Meteor.Error, response: boolean) => {
				setStatisticsGranted(!!response[PaidServicePackagesEnum.STATISTICS]);
			},
		);
	}, []);

	useEffect(() => {
		if (!selectedSlideId && slides.length) {
			props.selectSlide(slides[0]._id);
		}
	}, [selectedSlideId, slides]);

	const handleMouseDown = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
		const target = e.target as HTMLDivElement;

		if (
			selectedElement &&
			target.className.indexOf('moveable') === -1 &&
			// Игнорируем клик если это клик по элементу меню
			target.className.indexOf('MuiButtonBase-root') === -1 &&
			// Игнорируем клик если это меню
			target.parentElement?.className.indexOf('MuiPopover-root') === -1
		) {
			props.deselectSlideElement();
		}
	};

	const handleBackButton = () => {
		const {groupId} = slideshow;

		props.push(`${routerUrls.userSlideshowGroup.replace(':groupId', groupId)}`);
	};

	const handleViewSlideshowButton = () => {
		const win = window.open(
			routerUrls.userViewSlideshow.replace(':id', slideshow.numId),
			'_blank',
		);

		win!.focus();
	};

	const elementMenu = () => (
		<>
			{elementMenuTransitions((styles, _) => {
				const menu = () => {
					// _ это элемент из массива, который формируется в useTransition
					// текущий элемент берем из массива slideElements потому что только в нем значения свойств
					// обновляются при ререндерах. Но при закрытии элемента selectedElement очищается, поэтому в
					// этом случае берем элемент из параметра _, чтобы корректно выполнилась анимация закрытия
					const element =
						slideElements.filter(({_id}) => _id === selectedElement?._id)[0] || _;
					element.additionalFonts = slideshow.additionalFonts?.map((f) => f.name);

					switch (element.type) {
						case SlideElementTypeEnum.TEXT:
							return <TextElementSettings element={element} />;

						case SlideElementTypeEnum.TICKER:
							return <TickerElementSettings element={element} />;

						case SlideElementTypeEnum.HTML:
							return <HtmlElementSettings element={element} />;

						case SlideElementTypeEnum.IMAGE:
							return <ImageElementSettings element={element} />;

						case SlideElementTypeEnum.ZOOM:
							return <ZoomElementSettings element={element} />;

						case SlideElementTypeEnum.CURRENCY_RATE:
							return <CurrencyElementSettings element={element} />;

						case SlideElementTypeEnum.CLOCK:
							return <ClockElementSettings element={element} />;

						case SlideElementTypeEnum.TRANSPORT_SCHEDULE:
							return <ScheduleElementSettings element={element} />;

						case SlideElementTypeEnum.WEATHER:
							return <WeatherElementSettings element={element} />;

						case SlideElementTypeEnum.TRAFFIC_JAM:
							return <TrafficElementSettings element={element} />;

						case SlideElementTypeEnum.TWITTER:
							return <TwitterElementSettings element={element} />;

						case SlideElementTypeEnum.ODNOKLASSNIKI:
							return <OkElementSettings element={element} />;

						case SlideElementTypeEnum.VKONTAKTE:
							return <VkElementSettings element={element} />;

						case SlideElementTypeEnum.TELEGRAM:
							return <TelegramElementSettings element={element} />;

						case SlideElementTypeEnum.RSS:
							return <RssElementSettings element={element} />;

						case SlideElementTypeEnum.FACEBOOK:
							return <FbElementSettings element={element} />;

						case SlideElementTypeEnum.INSTAGRAM:
							return <InstagramElementSettings element={element} />;

						case SlideElementTypeEnum.YOUTUBE:
							return <VideoElementSettings element={element} />;

						case SlideElementTypeEnum.AIR_QUALITY:
							return <AirQualityElementSettings element={element} />;

						default:
							return <div>Неизвестный элемент</div>;
					}
				};

				return (
					<animated.div key={selectedElement?._id} style={styles}>
						{menu()}
					</animated.div>
				);
			})}
		</>
	);

	const handleOpenStylesPanel = () => props.toggleEditorStylesPanel(!isStylesPanelOpen);

	const handleOpenSocialPanel = () => props.toggleEditorSocialPanel(!isSocialPanelOpen);

	const handleOpenSettingsPanel = () => props.toggleEditorSettingsPanel(!isSettingsPanelOpen);

	const handleOpenGridPanel = () => props.toggleEditorGridPanel(!isGridPanelOpen);

	const activeGoogleFonts = slideshow?.additionalFonts
		?.filter((a) => a.type === 'google-font')
		?.map((f) => f.name)
		.map((font) => ({
			font,
			weights: [400, 700],
		}));

	const activeCustomFonts = slideshow?.additionalFonts?.filter((a) => a.type === 'custom-font');
	const customFontHtml = activeCustomFonts
		?.map((font) => {
			return `
@font-face {
  font-family: '${font.name}';
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: url(${appConsts.uploadUrl}/${font.src})  ;
}
@font-face {
  font-family: '${font.name}';
  font-style: normal;
  font-weight: 700;
  font-display: swap;
  src: url(${appConsts.uploadUrl}/${font.src})  ;
}
`;
		})
		.join();

	return (
		<>
			{/*google fonts from googleFonts const are loaded in EditorApp.tsx */}
			{/*here we add only slideshow.additionalFonts*/}
			{activeGoogleFonts?.length ? (
				<GoogleFontLoader
					fonts={activeGoogleFonts}
					subsets={['cyrillic-ext', 'cyrillic']}
				/>
			) : null}

			{customFontHtml?.length ? Parser('<style>' + customFontHtml + '</style>') : null}

			<SlideshowEditorKeyEventHandler slideshow={slideshow} elements={slideElements} />

			<div
				className={cn(css.container, {
					[css.isMenuOpen]: isStylesPanelOpen || isSettingsPanelOpen,
				})}
			>
				<YMaps
					enterprise
					query={{
						...appConsts.ya.apiKey,
						load: 'Map,Placemark,layout.ImageWithContent,control.ZoomControl',
					}}
					preload
				>
					<section className={css.toolbar}>
						<menu className={css.mainMenu}>
							<ActionButton
								Icon={ArrowBackIcon}
								primary
								onClick={handleBackButton}
								tooltipPlacement="right"
								tooltipTitle="Вернуться к списку слайдшоу"
							/>
							<ActionButton
								Icon={RemoveRedEyeIcon}
								primary
								highlighted
								onClick={handleViewSlideshowButton}
								tooltipPlacement="right"
								tooltipTitle="Просмотреть слайдшоу"
							/>

							<ActionButton
								Icon={UndoIcon}
								primary
								onClick={props.undoLastAction}
								tooltipPlacement="right"
								tooltipTitle="Отменить последнее действие [Ctrl + Z]"
								disabled={!actions.length}
							/>

							<MenuDelimiter />

							<ActionButton
								Icon={BrushIcon}
								onClick={handleOpenStylesPanel}
								isSelected={isStylesPanelOpen}
							/>

							<MenuDelimiter />

							<ActionButton
								Icon={SettingsIcon}
								onClick={handleOpenSettingsPanel}
								isSelected={isSettingsPanelOpen}
							/>

							<MenuDelimiter />

							<ActionButton
								Icon={GridOnIcon}
								onClick={handleOpenGridPanel}
								isSelected={isGridPanelOpen}
							/>
							<Box mt="auto">
								<Box maxWidth={'60px'} p="5px">
									<img
										src="/img/payment/logos-vertical.png"
										alt="PayKeeper"
										style={{maxWidth: '100%'}}
									/>
								</Box>
							</Box>
						</menu>

						<menu className={css.actionsMenu}>
							<animated.div
								style={{
									transform: menuTransform,
									position: 'relative',
									height: '100%',
								}}
							>
								<ElementsMenu />
								{elementMenu()}
							</animated.div>
						</menu>

						{slideshow && (
							<SlideShowEditorStylesPanel
								slideshow={slideshow}
								isOpen={isStylesPanelOpen}
								onClose={handleOpenStylesPanel}
							/>
						)}

						{slideshow && (
							<SlideShowEditorSocialPanel
								slideshow={slideshow}
								selectedElement={selectedElement}
								isOpen={isSocialPanelOpen}
								onClose={handleOpenSocialPanel}
							/>
						)}

						{slideshow && (
							<SlideShowEditorSettingsPanel
								slideshow={slideshow}
								isOpen={isSettingsPanelOpen}
								onClose={handleOpenSettingsPanel}
							/>
						)}

						{slideshow && (
							<SlideShowEditorGridPanel
								isOpen={isGridPanelOpen}
								onClose={handleOpenGridPanel}
								slideshow={slideshow}
							/>
						)}
					</section>

					<section className={css.slideShowAndSlides}>
						<div className={css.slideContainer} onMouseDown={handleMouseDown}>
							<SlideViewport isStatisticsGranted={isStatisticsGranted} />
						</div>

						<footer className={css.slideList}>
							<SlideList />
						</footer>
					</section>
				</YMaps>
			</div>
		</>
	);
};
// @ts-ignore
export default withTracker<ISlideShowEditorPageData, ISlideShowEditorPageExternalProps>(
	// @ts-ignore
	({match}) => {
		const {id} = match.params;
		const sub = Meteor.subscribe(publishNames.slideshow.oneFull, id);

		return {
			loading: !sub.ready(),
			slideshow: Slideshow.findOne({_id: id}),
			slides: Slide.find({slideshowId: id}, {sort: {position: 1}}).fetch(),
			slideElements: SlideElement.find({slideshowId: id}).fetch(),
		};
	},
)(
	connect(
		(state: RootState) => ({
			selectedElement: state.slideShowEditor.selectedElement,
			selectedSlideId: state.slideShowEditor.selectedSlideId,
			isStylesPanelOpen: state.slideShowEditor.isStylesPanelOpen,
			isSettingsPanelOpen: state.slideShowEditor.isSettingsPanelOpen,
			isSocialPanelOpen: state.slideShowEditor.isSocialPanelOpen,
			isGridPanelOpen: state.slideShowEditor.isGridPanelOpen,
			actions: state.slideshowActionHistory.actions,
		}),
		{
			deselectSlideElement,
			setSlideshowId,
			selectSlide,
			push,
			toggleEditorSocialPanel,
			toggleEditorStylesPanel,
			toggleEditorSettingsPanel,
			toggleEditorGridPanel,
			undoLastAction,
		},
	)(SlideShowEditorPage),
);
