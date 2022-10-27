import {withContentRect, MeasuredComponentProps} from 'react-measure';
// @ts-ignore
import {withTracker} from 'react-meteor-data-with-tracker';
import AudioPlayer from 'react-h5-audio-player';
import GoogleFontLoader from 'react-google-font-loader';
import React, {useState, useEffect, useCallback, useMemo} from 'react';
import {useTransition, animated} from 'react-spring';
import * as easings from 'd3-ease';
import {Button, Grid, TextField, Typography} from '@material-ui/core';
// @ts-ignore
import Parser from 'react-html-parser';

import DisplayElementWrapper from './DisplayElementWrapper';
import {publishNames} from 'shared/constants/publishNames';
import {ISlideElement, SlideElement} from 'shared/collections/SlideElements';
import {
	getBackgroundImageUrl,
	getSlideResolution,
	getBackgroundImageSize,
} from 'client/utils/slides';
import {ISlide, Slide} from 'shared/collections/Slides';
import {
	ISlideshow,
	Slideshow,
	SlideshowBackgroundImageDisplayEnum,
	SlideshowTransitionEnum,
} from 'shared/collections/Slideshows';
import SlideshowProgressBar from './SlideshowProgressBar';
import BackgroundVideo from 'client/components/common/BackgroundVideo';
import {sharedConsts} from 'shared/constants/sharedConsts';
// @ts-ignore
import css from './SlideshowPage.pcss';
import appConsts from 'client/constants/appConsts';

const DEBUG_SLIDESHOW = false;
const MOVE_FORWARD_ONCLICK = false;

interface ISlideshowPageProps extends MeasuredComponentProps {}

interface ISlideshowAccessWrapperData {
	loading: boolean;
	slideNumber: string | null;
	slideshow?: ISlideshow;
	slides: ISlide[];
	elements: ISlideElement[];
}

interface ISlideshowPageData {
	loading: boolean;
	slideNumber: string | null;
	slideshow: ISlideshow;
	slides: ISlide[];
	elements: ISlideElement[];
}

export enum MessageType {
	NEXT_SLIDE = 'next_slide',
	PREV_SLIDE = 'prev_slide',
	SCROLL_FAST_FORWARD = 'scroll_fastForward',
	SCROLL_REWIND = 'scroll_rewind',
}

let timerId: NodeJS.Timeout;

const AccessWrapper: React.FC<ISlideshowPageProps & ISlideshowAccessWrapperData> = (props) => {
	const {slideshow, slides, loading, contentRect} = props;

	const query = useMemo(() => new URLSearchParams(location.search), []);

	if (loading || !contentRect.bounds) {
		return <div>Загрузка...</div>;
	}

	if (!slideshow) {
		return <>Слайдшоу не найдено</>;
	}

	if (slides.length === 0) {
		return <div>В слайдшоу нет слайдов. Добавьте хотя бы 1 слайд в редакторе.</div>;
	}

	if (slideshow.password && slideshow.password !== query.get('password')) {
		return (
			<form>
				<Grid
					container
					className={css.accessWrapper}
					alignItems="center"
					justify="center"
					alignContent="center"
					spacing={4}
				>
					<Grid item component={Typography} variant="h5">
						Доступ ограничен паролем
					</Grid>

					<Grid item container spacing={4} justify="center">
						<Grid item>
							<TextField
								name="password"
								placeholder="Введите пароль"
								label="Пароль"
								variant="outlined"
								size={'small'}
							/>
						</Grid>

						<Grid item>
							<Button variant="outlined" color="primary" size="large" type="submit">
								Открыть
							</Button>
						</Grid>
					</Grid>
				</Grid>
			</form>
		);
	}

	return <SlideshowPage {...props} slideshow={slideshow} />;
};

const SlideshowPage: React.FC<ISlideshowPageProps & ISlideshowPageData> = (props) => {
	const {slides, slideshow, elements, contentRect, measureRef} = props;
	const [currentSlideIndex, setCurrentSlideIndex] = useState(
		Number(props.slideNumber) ? Number(props.slideNumber) - 1 : 0,
	);
	const [prevSlideIndex, setPrevSlideIndex] = useState(0);
	const [currentSlideDuration, setCurrentSlideDuration] = useState(0);
	const [reverseTransition, setReverseTransition] = useState(false);
	const [player, setPlayer] = useState<AudioPlayer | undefined>();
	const [started, setStarted] = useState(false);
	const currentSlide = slides[currentSlideIndex];

	useEffect(() => {
		if (currentSlideIndex || prevSlideIndex || !slides.length) {
			return;
		}

		setPrevSlideIndex(slides.length - 1);
	}, [slides]);

	const nextSlide = useCallback(() => {
		setReverseTransition(false);
		setPrevSlideIndex(currentSlideIndex);
		setCurrentSlideIndex((currentSlideIndex + 1) % slides.length);
	}, [slides, currentSlideIndex, prevSlideIndex]);

	const prevSlide = useCallback(() => {
		setReverseTransition(true);
		setPrevSlideIndex(currentSlideIndex);
		setCurrentSlideIndex(((currentSlideIndex || slides.length) - 1) % slides.length);
	}, [slides, currentSlideIndex, prevSlideIndex]);

	const selectSlide = useCallback(
		(selectSlideIndex: number) => {
			let slideIndex = selectSlideIndex - 1;
			slideIndex = slideIndex > slides.length - 1 ? slides.length - 1 : slideIndex;

			if (slideIndex === currentSlideIndex) {
				return;
			}

			const newCurrentSlideIndex = slideIndex < 0 ? 0 : slideIndex;

			if (newCurrentSlideIndex < currentSlideIndex) {
				setReverseTransition(true);
			} else {
				setReverseTransition(false);
			}

			setPrevSlideIndex(currentSlideIndex);
			setCurrentSlideIndex(newCurrentSlideIndex);
		},
		[slides, currentSlideIndex, prevSlideIndex],
	);

	const handleMessages = useCallback(
		(event: MessageEvent) => {
			const {data: messageCommand} = event;

			if (!slides || slides.length < 1) {
				return;
			}

			if (Object.values(MessageType).includes(messageCommand)) {
				switch (messageCommand) {
					case MessageType.PREV_SLIDE:
						prevSlide();

						break;

					case MessageType.NEXT_SLIDE:
						nextSlide();

						break;
				}
			} else if (/^button_\d+?$/.test(messageCommand)) {
				selectSlide(Number(messageCommand.replace(/^button_(\d+?$)/, '$1')));
			}
		},
		[slides, nextSlide, prevSlide, selectSlide],
	);

	const handleKeys = useCallback(
		(e: KeyboardEvent) => {
			if (!slides.length) {
				return;
			}

			if (/^\d/.test(e.key)) {
				selectSlide(Number(e.key));
			}
		},
		[slides, selectSlide],
	);

	useEffect(() => {
		if (window.parent) {
			window.parent.postMessage('app_loaded', '*');
		}

		document.addEventListener('message', handleMessages);
		window.addEventListener('message', handleMessages);

		return () => {
			document.removeEventListener('message', handleMessages);
			window.removeEventListener('message', handleMessages);
		};
	}, [handleMessages]);

	useEffect(() => {
		return () => {
			clearInterval(timerId);
		};
	}, []);

	useEffect(() => {
		document.addEventListener('keydown', handleKeys);

		return () => {
			document.removeEventListener('keydown', handleKeys);
		};
	}, [slides, selectSlide]);

	useEffect(() => {
		if (slides.length < 2 || timerId) {
			return;
		}

		setSlideTimeout();
	}, [slides, timerId]);

	useEffect(() => {
		setSlideTimeout();

		if (currentSlideIndex && !started) {
			setStarted(true);
		}
	}, [currentSlideIndex, prevSlideIndex]);

	useEffect(() => {
		if (!player) {
			return;
		}

		player.audio.volume = slideshow?.radioVolume || sharedConsts.slideshow.radioValueDefault;
	}, [slideshow?.radioVolume, player]);

	const setSlideTimeout = useCallback(() => {
		if (!currentSlide) {
			return;
		}

		const blockTransition = elements.filter(
			(element) => element.slideId === currentSlide._id && element.blockTransition,
		);

		clearInterval(timerId);

		if (!blockTransition.length) {
			const slideDuration = currentSlide.styles.slideDuration;

			setCurrentSlideDuration(slideDuration);
			timerId = setTimeout(nextSlide, slideDuration * 1000);
		}
	}, [currentSlide, elements, nextSlide]);

	const videoBlockTransition = useCallback(
		({duration, ended}) => {
			const blockTransition = elements.filter(
				(element) => element.slideId === currentSlide._id && element.blockTransition,
			);

			if (!blockTransition.length) {
				return;
			}

			if (ended) {
				nextSlide();

				return;
			}

			if (!duration) {
				return;
			}

			clearTimeout(timerId);
			setCurrentSlideDuration(duration);
		},
		[elements, nextSlide],
	);

	const renderSlide = useCallback(
		(slide: ISlide) => {
			if (!contentRect.bounds) {
				return null;
			}
			return (
				<div className={css.viewport}>
					{elements
						?.filter((element) => element.slideId === slide._id && !element.permanent)
						.map((element) => (
							<DisplayElementWrapper
								element={element}
								inCurrentSlide={true}
								key={element._id}
								videoBlockTransition={videoBlockTransition}
							/>
						))}
				</div>
			);
		},
		[elements, contentRect, nextSlide],
	);

	const getPrevSlidePosition = (slideId: string) => {
		const slidePosition = slides.find(({_id}) => _id === slideId)?.position || 1;

		return (slidePosition - 1 || slides.length) % (slides.length + 1);
	};

	const getPrevSlide = (slideId: string) =>
		slides.find(({position}) => position === getPrevSlidePosition(slideId));

	const getEnterBySlidePosition = (slidePosition: number, customKey?: string) => {
		const slide = slides.find(({position}) => position === slidePosition);
		if (customKey && slide?.styles.slideTransitionCustomCode?.[customKey]) {
			return slide?.styles.slideTransitionCustomCode?.[customKey];
		}
		switch (slide?.styles.slideTransition) {
			case SlideshowTransitionEnum.SLIDE_DOWN:
				return {
					opacity: 1,
					transform: 'translateY(0%) scale(1) rotateY(0deg)',
					WebkitTransform: 'translateY(0%) scale(1) rotateY(0deg)',
				};

			case SlideshowTransitionEnum.SLIDE_TOP:
				return {
					opacity: 1,
					transform: 'translateY(0%) scale(1) rotateY(0deg)',
					WebkitTransform: 'translateY(0%) scale(1) rotateY(0deg)',
				};

			default:
				return {
					opacity: 1,
					transform: 'translateX(0%) scale(1) rotateY(0deg)',
					WebkitTransform: 'translateX(0%) scale(1) rotateY(0deg)',
				};
		}
	};

	const getFromBySlidePosition = (slidePosition: number, customKey?: string) => {
		const slide = slides.find(({position}) => position === slidePosition);
		if (customKey && slide?.styles.slideTransitionCustomCode?.[customKey]) {
			return slide?.styles.slideTransitionCustomCode?.[customKey];
		}
		switch (slide?.styles.slideTransition) {
			case SlideshowTransitionEnum.FADE:
				return {
					opacity: 0,
					transform: 'translateX(0%) scale(1) rotateY(0deg)',
					WebkitTransform: 'translateX(0%) scale(1) rotateY(0deg)',
				};

			case SlideshowTransitionEnum.SLIDE:
				return {
					transform: 'translateX(100%) scale(1) rotateY(0deg)',
					WebkitTransform: 'translateX(100%) scale(1) rotateY(0deg)',
					opacity: 0,
				};

			case SlideshowTransitionEnum.SLIDE_RIGHT:
				return {
					transform: 'translateX(-100%) scale(1) rotateY(0deg)',
					WebkitTransform: 'translateX(-100%) scale(1) rotateY(0deg)',
					opacity: 0,
				};

			case SlideshowTransitionEnum.SLIDE_DOWN:
				return {
					transform: 'translateY(-100%) scale(1) rotateY(0deg)',
					WebkitTransform: 'translateY(-100%) scale(1) rotateY(0deg)',
					opacity: 0,
				};

			case SlideshowTransitionEnum.SLIDE_TOP:
				return {
					transform: 'translateY(100%) scale(1) rotateY(0deg)',
					WebkitTransform: 'translateY(100%) scale(1) rotateY(0deg)',
					opacity: 0,
				};

			case SlideshowTransitionEnum.ZOOM:
				return {
					transform: 'translateX(-50%) scale(0) rotateY(0deg)',
					WebkitTransform: 'translateX(-50%) scale(0) rotateY(0deg)',
					opacity: 0,
				};

			case SlideshowTransitionEnum.ZOOM_OUT:
				return {
					transform: 'translateX(50%) scale(2) rotateY(0deg)',
					WebkitTransform: 'translateX(50%) scale(2) rotateY(0deg)',
					opacity: 0,
				};

			case SlideshowTransitionEnum.CONVEX:
				return {
					transform: 'translateX(100%) scale(1) rotateY(90deg)',
					WebkitTransform: 'translateX(100%) scale(1) rotateY(90deg)',
					opacity: 0,
				};
			case SlideshowTransitionEnum.CONVEX_RIGHT:
				return {
					transform: 'translateX(-100%) scale(1) rotateY(-90deg)',
					WebkitTransform: 'translateX(-100%) scale(1) rotateY(-90deg)',
					opacity: 0,
				};

			case SlideshowTransitionEnum.CONCAVE:
				return {
					transform: 'translateX(100%) scale(1) rotateY(-90deg)',
					WebkitTransform: 'translateX(100%) scale(1) rotateY(-90deg)',
					opacity: 0,
				};
			case SlideshowTransitionEnum.CONCAVE_RIGHT:
				return {
					transform: 'translateX(-100%) scale(1) rotateY(-90deg)',
					WebkitTransform: 'translateX(-100%) scale(1) rotateY(-90deg)',
					opacity: 0,
				};
			case SlideshowTransitionEnum.CONVEYOR:
				return {
					transform: 'translateX(0%) scale(0.7) rotateY(-90deg)',
					WebkitTransform: 'translateX(0%) scale(0.7) rotateY(-90deg)',
					opacity: 0,
				};
			case SlideshowTransitionEnum.WHEEL:
				return {
					transform: 'translateY(-20%) scale(0.15) rotateZ(45deg)  ',
					WebkitTransform: 'translateY(-20%) scale(0.15) rotateZ(45deg) ',
					opacity: 0,
				};
			case SlideshowTransitionEnum.APPEARANCE:
				return {
					transform: 'translateX(0%) scale(1) rotateY(0deg)',
					WebkitTransform: 'translateX(0%) scale(1) rotateY(0deg)',
					opacity: 0,
				};

			default:
				return {
					opacity: 0,
					transform: 'translateX(0%) scale(1) rotateY(0deg)',
					WebkitTransform: 'translateX(0%) scale(1) rotateY(0deg)',
					transitionDuration: '0s',
				};
		}
	};

	const getLeaveBySlidePosition = (slidePosition: number, customKey?: string) => {
		const slide = slides.find(({position}) => position === slidePosition);
		if (customKey && slide?.styles.slideTransitionCustomCode?.[customKey]) {
			return slide?.styles.slideTransitionCustomCode?.[customKey];
		}
		switch (slide?.styles.slideTransition) {
			case SlideshowTransitionEnum.FADE:
				return {
					opacity: 0,
					transform: 'translateX(0%) scale(1) rotateX(0deg)',
					WebkitTransform: 'translateX(0%) scale(1) rotateX(0deg)',
				};

			case SlideshowTransitionEnum.SLIDE:
				return {
					transform: 'translateX(-100%) scale(1) rotateY(0deg)',
					WebkitTransform: 'translateX(-100%) scale(1) rotateY(0deg)',
					opacity: 0,
				};

			case SlideshowTransitionEnum.SLIDE_RIGHT:
				return {
					transform: 'translateX(100%) scale(1) rotateY(0deg)',
					WebkitTransform: 'translateX(100%) scale(1) rotateY(0deg)',
					opacity: 0,
				};

			case SlideshowTransitionEnum.SLIDE_DOWN:
				return {
					transform: 'translateY(100%) scale(1) rotateY(0deg)',
					WebkitTransform: 'translateY(100%) scale(1) rotateY(0deg)',
					opacity: 0,
				};

			case SlideshowTransitionEnum.SLIDE_TOP:
				return {
					transform: 'translateY(-100%) scale(1) rotateY(0deg)',
					WebkitTransform: 'translateY(-100%) scale(1) rotateY(0deg)',
					opacity: 0,
				};

			case SlideshowTransitionEnum.ZOOM:
				return {
					transform: 'translateX(50%) scale(2) rotateY(0deg)',
					WebkitTransform: 'translateX(50%) scale(2) rotateY(0deg)',
					opacity: 0,
				};

			case SlideshowTransitionEnum.ZOOM_OUT:
				return {
					transform: 'translateX(-50%) scale(0) rotateY(0deg)',
					WebkitTransform: 'translateX(-50%) scale(0) rotateY(0deg)',
					opacity: 0,
				};

			case SlideshowTransitionEnum.CONVEX:
				return {
					transform: 'translateX(-100%) scale(1) rotateY(-90deg)',
					WebkitTransform: 'translateX(-100%) scale(1) rotateY(-90deg)',
					opacity: 0,
				};

			case SlideshowTransitionEnum.CONVEX_RIGHT:
				return {
					transform: 'translateX(100%) scale(1) rotateY(90deg)',
					WebkitTransform: 'translateX(100%) scale(1) rotateY(90deg)',
					opacity: 0,
				};

			case SlideshowTransitionEnum.CONCAVE:
				return {
					transform: 'translateX(-100%) scale(1) rotateY(90deg)',
					WebkitTransform: 'translateX(-100%) scale(1) rotateY(90deg)',
					opacity: 0,
				};
			case SlideshowTransitionEnum.CONCAVE_RIGHT:
				return {
					transform: 'translateX(100%) scale(1) rotateY(-90deg)',
					WebkitTransform: 'translateX(100%) scale(1) rotateY(-90deg)',
					opacity: 0,
				};
			case SlideshowTransitionEnum.CONVEYOR:
				return {
					transform: 'translateX(0%) scale(0.7) rotateY(90deg)',
					WebkitTransform: 'translateX(0%) scale(0.7) rotateY(90deg)',
					opacity: 0,
				};
			case SlideshowTransitionEnum.WHEEL:
				return {
					transform: 'translateY(-20%) scale(0.15) rotateZ(45deg)',
					WebkitTransform: 'translateY(-20%) scale(0.15) rotateZ(45deg)',
					opacity: 0,
				};
			case SlideshowTransitionEnum.APPEARANCE:
				return {
					transform: 'translateX(-100%) scale(1) rotateY(0deg)',
					WebkitTransform: 'translateX(-100%) scale(1) rotateY(0deg)',
					opacity: 0.5,
				};

			default:
				return {
					opacity: 0,
					transform: 'translateX(0%) scale(1) rotateY(0deg)',
					WebkitTransform: 'translateX(0%) scale(1) rotateY(0deg)',
					transitionDuration: '0s',
				};
		}
	};

	const transitionSlides = slides.filter((_, index) => currentSlideIndex === index);
	const transitions = useTransition(transitionSlides, {
		config: () => {
			const curSlide = !reverseTransition
				? getPrevSlide(transitionSlides[0]?._id)
				: transitionSlides[0];
			const easing = curSlide?.styles.slideTransitionEasing || 'easeCubic';
			const slideTransitionLength = curSlide?.styles.slideTransitionLength
				? curSlide?.styles.slideTransitionLength * 1000
				: 1000;
			return {
				easing: easings[easing],
				duration:
					curSlide?.styles.slideTransition === SlideshowTransitionEnum.NONE
						? 0
						: slideTransitionLength,
			};
		},
		initial: ({_id, position}) => {
			return getEnterBySlidePosition(slides[prevSlideIndex].position, 'initial');
		},
		enter: ({_id, position}) => {
			return getEnterBySlidePosition(slides[prevSlideIndex].position, 'enter');
		},
		from: ({_id, position}) => {
			if (reverseTransition) {
				return getLeaveBySlidePosition(position, 'leave');
			}

			return getFromBySlidePosition(slides[prevSlideIndex].position, 'from');
		},
		leave: ({_id, position}) => {
			if (reverseTransition) {
				return getFromBySlidePosition(slides[currentSlideIndex].position, 'from');
			}

			return getLeaveBySlidePosition(slides[prevSlideIndex].position, 'leave');
		},
	});

	if (!currentSlide) {
		return <div>Слайд не найден. Пожалуйста, обновите страницу.</div>;
	}

	const resolution = getSlideResolution(slideshow.orientation);
	const heightScaleRate = (contentRect.bounds?.height || 0) / resolution.height;
	const widthScaleRate = (contentRect.bounds?.width || 0) / resolution.width;
	const scaleRate = Math.min(heightScaleRate, widthScaleRate);
	const permanentElements = elements.filter(
		(element) =>
			element.permanent &&
			(element.permanentAtAll ||
				(element.permanentOnSlides || []).includes(currentSlide._id)),
	);

	const activeGoogleFonts = (
		slideshow.additionalFonts?.filter((a) => a.type === 'google-font')?.map((f) => f.name) || []
	)
		.concat(slideshow.activeFonts || [])
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
		<div className={css.container} ref={measureRef}>
			{slideshow.radiostation && (
				<AudioPlayer
					autoPlay
					style={{display: 'none'}}
					src={slideshow.radiostation}
					ref={(c: AudioPlayer) => setPlayer(c)}
				/>
			)}
			{/*active google fonts*/}
			{activeGoogleFonts?.length > 0 && (
				<GoogleFontLoader
					fonts={activeGoogleFonts}
					subsets={['cyrillic-ext', 'cyrillic']}
				/>
			)}
			{/*active custom fonts*/}
			{customFontHtml?.length ? Parser('<style>' + customFontHtml + '</style>') : null}
			<div
				style={{
					// backgroundSize: getBackgroundImageSize(styles.slideBackgroundImageDisplay),
					transform: `scale(${scaleRate})`,
					WebkitTransform: `scale(${scaleRate})`,
					position: 'absolute',
					height: '100%',
					width: '100%',
					perspective: resolution.width * 4,
				}}
			>
				<div
					className={css.permanent}
					style={{
						width: resolution.width,
						height: resolution.height,
						marginLeft: -resolution.width / 2,
						marginTop: -resolution.height / 2,
					}}
				>
					{transitions((style, slide) => {
						return (
							<animated.div
								key={slide._id}
								className={css.effect}
								onClick={MOVE_FORWARD_ONCLICK ? nextSlide : prevSlide}
								style={{
									width: resolution.width,
									height: resolution.height,
									marginLeft: -resolution.width / 2,
									marginTop: -resolution.height / 2,
									backgroundColor: slide.styles.slideBackgroundVideo
										? 'transparent'
										: slide.styles.slideBackgroundColor,
									backgroundImage: getBackgroundImageUrl(
										slide.styles.slideBackgroundImage,
									),
									backgroundSize: getBackgroundImageSize(
										slide.styles.slideBackgroundImageDisplay,
									),
									backgroundRepeat:
										slide.styles.slideBackgroundImageDisplay !==
										SlideshowBackgroundImageDisplayEnum.TILE
											? 'no-repeat'
											: 'repeat',
									...style,
									zIndex: -1,
								}}
							>
								{slide.styles.slideBackgroundVideo && (
									<BackgroundVideo
										width={resolution.width}
										height={resolution.height}
										youtubeIdOrUrl={slide.styles.slideBackgroundVideo}
									/>
								)}
							</animated.div>
						);
					})}

					{permanentElements.map((element) => (
						<DisplayElementWrapper
							element={element}
							key={element._id}
							inCurrentSlide={true}
						/>
					))}

					{transitions((style, slide) => {
						return (
							<animated.div
								key={slide._id}
								className={css.effect}
								onClick={MOVE_FORWARD_ONCLICK ? nextSlide : prevSlide}
								style={{
									width: resolution.width,
									height: resolution.height,
									marginLeft: -resolution.width / 2,
									marginTop: -resolution.height / 2,
									...style,
								}}
							>
								{renderSlide(slide)}
							</animated.div>
						);
					})}
				</div>
			</div>

			{slides.length > 1 && !currentSlide.styles.hideProgressbar ? (
				<SlideshowProgressBar
					colorPrimary={currentSlide.styles?.colorPrimary}
					barColorPrimary={currentSlide.styles?.barColorPrimary}
					duration={currentSlideDuration || 999}
					key={currentSlideIndex}
				/>
			) : null}
			{DEBUG_SLIDESHOW && slides.length > 1 && currentSlide?._id}
		</div>
	);
};

export default withTracker(
	({slideNumId}: {slideNumId: string}): ISlideshowAccessWrapperData => {
		const numId = slideNumId;
		const query = new URLSearchParams(window.location.search);
		const slideNumber = query.get('slide');
		const sub = Meteor.subscribe(publishNames.slideshow.oneFullShow, numId);
		const slideshow = Slideshow.findOne({numId});
		const slideshowId = slideshow ? slideshow._id : undefined;
		return {
			slideshow,
			slideNumber,
			loading: !sub.ready(),
			slides: Slide.find({slideshowId}, {sort: {position: 1}}).fetch(),
			elements: SlideElement.find({slideshowId}).fetch(),
		};
	},
)(withContentRect('bounds')(AccessWrapper));
