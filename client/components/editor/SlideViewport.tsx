import * as React from 'react';
import {connect} from 'react-redux';
import {MeasuredComponentProps, withContentRect} from 'react-measure';
import {withTracker} from 'react-meteor-data-with-tracker';

import css from './SlideViewport.pcss';
import ElementWrapper from './ElementWrapper';
import {RootState} from 'client/store/root-reducer';
import {
	getBackgroundImageSize,
	getBackgroundImageUrl,
	getSlideResolution,
} from 'client/utils/slides';
import {ISlideElement, SlideElement} from 'shared/collections/SlideElements';
import {
	ISlideshow,
	Slideshow,
	SlideshowBackgroundImageDisplayEnum,
} from 'shared/collections/Slideshows';
import {ISlide, Slide} from 'shared/collections/Slides';
import GridBlock from './GridBlock';
import BackgroundVideo from 'client/components/common/BackgroundVideo';

interface ISlideViewportData {
	slideshow: ISlideshow;
	slide: ISlide;
	elements: ISlideElement[];
}

interface ISlideViewportProps extends MeasuredComponentProps {
	slideshowId: string;
	selectedSlideId: string;
	selectedElement?: ISlideElement;
	isStatisticsGranted?: boolean;
}

class SlideViewport extends React.PureComponent<ISlideViewportProps & ISlideViewportData> {
	render() {
		const {
			elements,
			selectedElement,
			measureRef,
			slideshow,
			slide,
			contentRect,
			isStatisticsGranted,
		} = this.props;

		if (!contentRect.bounds || !slideshow || !slide) {
			return <div>Загрузка...</div>;
		}

		const {styles} = slide;
		const resolution = getSlideResolution(slideshow.orientation);
		const heightScaleRate = contentRect.bounds.height / resolution.height;
		const widthScaleRate = contentRect.bounds.width / resolution.width;
		const scaleRate = Math.min(heightScaleRate, widthScaleRate, 1);

		return (
			<div className={css.spacing}>
				<div ref={measureRef} className={css.container}>
					<div
						className={css.background}
						style={{
							backgroundColor: styles.slideBackgroundColor,
							backgroundImage: getBackgroundImageUrl(styles.slideBackgroundImage),
							backgroundRepeat:
								styles.slideBackgroundImageDisplay !==
								SlideshowBackgroundImageDisplayEnum.TILE
									? 'no-repeat'
									: 'repeat',
							backgroundSize: getBackgroundImageSize(
								styles.slideBackgroundImageDisplay,
							),
							width: resolution.width,
							height: resolution.height,
							transform: `translate(-50%, -50%) scale(${scaleRate})`,
						}}
					/>

					{styles.slideBackgroundVideo && (
						<BackgroundVideo
							width={resolution.width}
							height={resolution.height}
							transform={`translate(-50%, -50%) scale(${scaleRate})`}
							youtubeIdOrUrl={styles.slideBackgroundVideo}
							editor
						/>
					)}

					{slideshow.isGridBlockEnabled && (
						<GridBlock
							scale={scaleRate}
							width={resolution.width}
							height={resolution.height}
						/>
					)}

					<div
						className={css.viewport}
						style={{
							width: resolution.width,
							height: resolution.height,
							transform: `translate(-50%, -50%) scale(${scaleRate})`,
						}}
					>
						{elements.map((element) => (
							<ElementWrapper
								scale={scaleRate}
								isSelected={
									!!(selectedElement && element._id === selectedElement._id)
								}
								element={element}
								elements={elements}
								slideshow={slideshow}
								key={element._id}
								isStatisticsGranted={isStatisticsGranted}
							/>
						))}
					</div>
				</div>
			</div>
		);
	}
}

export default connect((state: RootState) => ({
	slideshowId: state.slideShowEditor.slideshowId,
	selectedSlideId: state.slideShowEditor.selectedSlideId,
	selectedElement: state.slideShowEditor.selectedElement,
}))(
	// @ts-ignore
	withTracker<ISlideViewportData, {}>(({slideshowId, selectedSlideId}: ISlideViewportProps) => {
		return {
			slideshow: Slideshow.findOne({_id: slideshowId}),
			slide: Slide.findOne({_id: selectedSlideId}),
			elements: SlideElement.find({
				slideshowId,
				$or: [
					{slideId: selectedSlideId},
					{permanent: true, permanentAtAll: true},
					{permanent: true, permanentAtAll: false, permanentOnSlides: selectedSlideId},
				],
			}).fetch(),
		};
	})(withContentRect('bounds')(SlideViewport)),
);
