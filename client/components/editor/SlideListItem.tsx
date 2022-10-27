import * as React from 'react';
import cn from 'classnames';
import {connect} from 'react-redux';
import DeleteIcon from '@material-ui/icons/Close';
import SaveIcon from '@material-ui/icons/Save';
import SettingsIcon from '@material-ui/icons/Settings';
import IconButton from '@material-ui/core/IconButton';
import DublicateIcon from '@material-ui/icons/Layers';
import {DraggableProvided} from 'react-beautiful-dnd';

import {RootState} from 'client/store/root-reducer';
import {selectSlide, dublicateSlide} from 'client/actions/slideShowEditor';
import {ISlide} from 'shared/collections/Slides';
import SlideSettingsModal from 'client/components/editor/modals/SlideSettingsModal';
import SlideDeleteModal from 'client/components/editor/modals/SlideDeleteModal';
import css from './SlideList.pcss';
import SlideSaveModal from 'client/components/editor/modals/SlideSaveModal';
import DisplayElementWrapper from 'client/components/slideshow/DisplayElementWrapper';
import {ISlideElement} from 'shared/collections/SlideElements';
import {getBackgroundImageSize, getBackgroundImageUrl} from 'client/utils/slides';
import {SlideshowBackgroundImageDisplayEnum} from 'shared/collections/Slideshows';

export interface IExtendedSlide extends ISlide {
	elements: ISlideElement[];
	resolution: {
		width: number;
		height: number;
	};
	showSlidePreview: string;
}

interface ISlideListItemProps {
	slide: IExtendedSlide;
	showSlidePreview: string;
	selectedSlideId: string;
	selectSlide: typeof selectSlide;
	dublicateSlide: (slideId: string) => Promise<string>;
	provided: DraggableProvided;
}

interface ISlideListState {
	isSettingsOpen: boolean;
	isSaveModalOpen: boolean;
	isDeleteConfirmOpen: boolean;
}

class SlideListItem extends React.PureComponent<ISlideListItemProps, ISlideListState> {
	state = {isSettingsOpen: false, isSaveModalOpen: false, isDeleteConfirmOpen: false};

	handleSelectSlide = () => {
		if (this.props.slide._id === this.props.selectedSlideId) {
			return;
		}

		this.props.selectSlide(this.props.slide._id, this.props.selectedSlideId, true);
	};

	handleOpenSettings = () => {
		this.setState({isSettingsOpen: true});
	};

	handleOpenSaveModal = () => {
		this.setState({isSaveModalOpen: true});
	};

	handleCloseSettings = () => {
		this.setState({isSettingsOpen: false});
	};

	handleCloseSaveModal = () => {
		this.setState({isSaveModalOpen: false});
	};

	handleOpenDeleteConfirm = () => {
		this.setState({isDeleteConfirmOpen: true});
	};

	handleCloseDeleteConfirm = () => {
		this.setState({isDeleteConfirmOpen: false});
	};

	handleDublicateSlide = () => {
		this.props.dublicateSlide(this.props.slide._id).then((slideId) => {
			this.props.selectSlide(slideId, this.props.slide._id);
		});
	};

	render() {
		const {slide, selectedSlideId, provided} = this.props;
		const {isSettingsOpen, isSaveModalOpen, isDeleteConfirmOpen} = this.state;

		const minimizeKof = 0.085;
		const previewWidth = slide.resolution.width * minimizeKof;
		const previewHeight = slide.resolution.height * minimizeKof;

		const previewStyles = {
			width: `${previewWidth}px`,
			height: `${previewHeight}px`,

			backgroundImage: getBackgroundImageUrl(slide.styles.slideBackgroundImage),
			backgroundSize: getBackgroundImageSize(slide.styles.slideBackgroundImageDisplay),
			backgroundRepeat:
				slide.styles.slideBackgroundImageDisplay !==
				SlideshowBackgroundImageDisplayEnum.TILE
					? 'no-repeat'
					: 'repeat',
		};
		if (slide.styles.slideBackgroundColor && slide.showSlidePreview == 'SHOW') {
			previewStyles.backgroundColor = slide.styles.slideBackgroundColor;
		} else {
			previewStyles.backgroundColor = '';
		}
		return (
			<>
				<div
					ref={provided.innerRef}
					{...provided.draggableProps}
					{...provided.dragHandleProps}
					className={cn(css.slide, {
						[css.selectedSlide]: slide._id === selectedSlideId,
					})}
					onClick={this.handleSelectSlide}
				>
					<div className={css.number}>{slide.position}</div>
					{slide.showSlidePreview == 'SHOW' ? (
						<div className={css.slidePreview} style={previewStyles}>
							<div
								className={css.slidePreviewViewport}
								style={{
									transform: `matrix(${minimizeKof}, 0, 0, ${minimizeKof}, 0, 0)`,
								}}
							>
								{slide.elements.map((element) => (
									<DisplayElementWrapper
										key={element._id}
										element={element}
										inCurrentSlide={slide._id === selectedSlideId}
										forceEditorMode
										isPreview
									/>
								))}
							</div>
						</div>
					) : (
						<div className={css.slidePreview} style={previewStyles}>
							Слайд #{slide.position}
						</div>
					)}

					<div className={css.buttons}>
						<IconButton
							className={cn(css.button, css.settings)}
							onClick={this.handleOpenSettings}
						>
							<SettingsIcon fontSize="small" />
						</IconButton>

						<IconButton
							className={cn(css.button, css.save)}
							onClick={this.handleOpenSaveModal}
						>
							<SaveIcon fontSize="small" />
						</IconButton>

						<IconButton
							className={cn(css.button, css.dublicate)}
							onClick={this.handleDublicateSlide}
						>
							<DublicateIcon fontSize="small" />
						</IconButton>

						<IconButton
							className={cn(css.button, css.delete)}
							onClick={this.handleOpenDeleteConfirm}
						>
							<DeleteIcon fontSize="small" />
						</IconButton>
					</div>
				</div>

				<SlideSettingsModal
					isOpen={isSettingsOpen}
					slide={slide}
					onClose={this.handleCloseSettings}
				/>

				<SlideSaveModal
					isOpen={isSaveModalOpen}
					slide={slide}
					onClose={this.handleCloseSaveModal}
				/>

				<SlideDeleteModal
					isOpen={isDeleteConfirmOpen}
					slide={slide}
					onClose={this.handleCloseDeleteConfirm}
				/>
			</>
		);
	}
}

export default connect(
	(state: RootState) => ({
		slideshowId: state.slideShowEditor.slideshowId,
		selectedSlideId: state.slideShowEditor.selectedSlideId,
	}),
	{
		selectSlide,
		dublicateSlide,
	},
)(SlideListItem);
