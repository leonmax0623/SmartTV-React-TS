import * as React from 'react';
import {withTracker} from 'react-meteor-data-with-tracker';
import {connect} from 'react-redux';
import {DragDropContext, Droppable, Draggable, DropResult} from 'react-beautiful-dnd';
import {Button} from '@material-ui/core';
import PerfectScrollbar from 'react-perfect-scrollbar';

import {RootState} from 'client/store/root-reducer';
import {addSlide, reorderSlide} from 'client/actions/slideShowEditor';
import {ISlide, Slide} from 'shared/collections/Slides';
import SlideListItem, {IExtendedSlide} from 'client/components/editor/SlideListItem';
import AddSlideFromSavedModal from 'client/components/editor/modals/AddSlideFromSavedModal';
import css from './SlideList.pcss';
import {SlideElement} from 'shared/collections/SlideElements';
import {
	Slideshow,
	SlideshowOrientationEnum,
	SlideshowPreviewEnum,
} from 'shared/collections/Slideshows';
import {getSlideResolution} from 'client/utils/slides';

interface ISlideListData {
	slideList: ISlide[];
	showSlidePreview: string;
}

interface ISSlideListProps {
	slideshowId: string;
	addSlide: (slideMockup?: string) => void;
	reorderSlide: (slide: ISlide, newIndex: number) => void;
}

interface ISlideListState {
	isOpenSettings: boolean;
	isOpenDeleteConfirm: boolean;
	isAddSlideFromSavedModalOpen: boolean;
}

class SlideList extends React.PureComponent<ISSlideListProps & ISlideListData, ISlideListState> {
	state = {
		isOpenSettings: false,
		isOpenDeleteConfirm: false,
		isAddSlideFromSavedModalOpen: false,
	};

	onSortEnd = ({source, destination}: DropResult) => {
		if (!destination) {
			return;
		}

		const {index: oldIndex} = source;
		const {index: newIndex} = destination;

		const {slideList} = this.props;
		const slide = slideList.find((s) => s.position === oldIndex + 1);

		if (slide) {
			this.props.reorderSlide(slide, newIndex + 1);
		}
	};

	handleAddSlide = () => {
		this.props.addSlide();
	};

	handleAddSlideFromSavedModel = () => {
		this.setState({isAddSlideFromSavedModalOpen: true});
	};

	handleAddSlideFromSavedModalClose = () => {
		this.setState({isAddSlideFromSavedModalOpen: false});
	};

	render() {
		const {slideList, showSlidePreview} = this.props;
		const {isAddSlideFromSavedModalOpen} = this.state;

		return (
			<DragDropContext onDragEnd={this.onSortEnd}>
				<Droppable droppableId="slides" direction="horizontal">
					{(provided) => (
						<div className={css.container}>
							<PerfectScrollbar
								className={css.slides}
								containerRef={provided.innerRef}
								options={{
									useBothWheelAxes: true,
									suppressScrollY: true,
								}}
								{...provided.droppableProps}
							>
								{slideList.map((slide: IExtendedSlide, index) => (
									<Draggable
										key={slide._id}
										draggableId={slide._id}
										index={index}
									>
										{(providedI) => (
											<SlideListItem
												provided={providedI}
												slide={slide}
												showSlidePreview={showSlidePreview}
											/>
										)}
									</Draggable>
								))}
							</PerfectScrollbar>
						</div>
					)}
				</Droppable>

				<div className={css.addSlideWrap}>
					<Button
						classes={{root: css.button}}
						color="primary"
						variant="outlined"
						size="medium"
						onClick={this.handleAddSlide}
					>
						Добавить слайд
					</Button>

					<Button
						classes={{root: css.button}}
						variant="outlined"
						size="medium"
						onClick={this.handleAddSlideFromSavedModel}
					>
						Слайд из макета
					</Button>

					<AddSlideFromSavedModal
						isOpen={isAddSlideFromSavedModalOpen}
						onClose={this.handleAddSlideFromSavedModalClose}
					/>
				</div>
			</DragDropContext>
		);
	}
}

export default connect(
	(state: RootState) => ({
		slideshowId: state.slideShowEditor.slideshowId,
	}),
	{
		addSlide,
		reorderSlide,
	},
)(
	withTracker(({slideshowId}) => {
		const slideshow = Slideshow.findOne({_id: slideshowId});
		const slideResolution = getSlideResolution(
			slideshow?.orientation || SlideshowOrientationEnum.HORIZONTAL,
		);

		return {
			slideList: Slide.find({slideshowId}, {sort: {position: 1}}).map((slide) => ({
				...slide,
				elements: SlideElement.find({
					$or: [
						{slideId: slide._id},
						{permanent: true, permanentAtAll: true},
						{permanent: true, permanentAtAll: false, permanentOnSlides: slide._id},
					],
				}).fetch(),
				resolution: slideResolution,
				showSlidePreview: slideshow?.showSlidePreview || SlideshowPreviewEnum.SHOW,
			})),
		};
	})(SlideList),
);
