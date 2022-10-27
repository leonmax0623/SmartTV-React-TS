import {GlobalHotKeys} from 'react-hotkeys';
import * as React from 'react';
import {connect} from 'react-redux';

import {RootState} from 'client/store/root-reducer';
import {
	deleteSlideElement,
	deselectSlideElement,
	duplicateSlideElement,
	setElementCopiedSlideElement,
	updateSlideElement,
} from 'client/actions/slideShowEditor';
import {undoLastAction} from 'client/actions/slideshowActionHistory';
import {ISlideElement} from 'shared/collections/SlideElements';
import {getSlideResolution} from 'client/utils/slides';
import {ISlideshow} from 'shared/collections/Slideshows';

interface ISlideshowEditorKeyEventHandlerProps {
	slideshow: ISlideshow;
	elements: ISlideElement[];
}

interface ISlideshowEditorKeyEventHandlerData {
	selectedSlideId?: string;
	selectedElement?: ISlideElement;
	deselectSlideElement: typeof deselectSlideElement;
	isRichTextEditorEnabled?: boolean;
	deleteSlideElement: typeof deleteSlideElement;
	updateSlideElement: typeof updateSlideElement;
	undoLastAction: () => void;
	setElementCopiedSlideElement: typeof setElementCopiedSlideElement;
	copiedSlideElement?: ISlideElement;
	duplicateSlideElement: typeof duplicateSlideElement;
}

class SlideshowEditorKeyEventHandler extends React.PureComponent<
	ISlideshowEditorKeyEventHandlerProps & ISlideshowEditorKeyEventHandlerData
> {
	keyMap = {
		MOVE_UP: 'up',
		MOVE_DOWN: 'down',
		MOVE_LEFT: 'left',
		MOVE_RIGHT: 'right',

		FAST_MOVE_UP: 'shift+up',
		FAST_MOVE_DOWN: 'shift+down',
		FAST_MOVE_LEFT: 'shift+left',
		FAST_MOVE_RIGHT: 'shift+right',

		DELETE: 'del',
		DESELECT: 'escape',

		UNDO: ['ctrl+z', 'command+z', 'ctrl+я', 'command+я'],
		COPY: ['ctrl+c', 'command+c', 'ctrl+с', 'command+с'],
		PASTE: ['ctrl+v', 'command+v', 'ctrl+м', 'command+м'],
	};

	keyHandlers = {
		MOVE_UP: () => this.handleMoveSelectedElement('up'),
		MOVE_DOWN: () => this.handleMoveSelectedElement('down'),
		MOVE_LEFT: () => this.handleMoveSelectedElement('left'),
		MOVE_RIGHT: () => this.handleMoveSelectedElement('right'),

		FAST_MOVE_UP: () => this.handleMoveSelectedElement('up', true),
		FAST_MOVE_DOWN: () => this.handleMoveSelectedElement('down', true),
		FAST_MOVE_LEFT: () => this.handleMoveSelectedElement('left', true),
		FAST_MOVE_RIGHT: () => this.handleMoveSelectedElement('right', true),

		DELETE: () => this.handleDeleteSelectedElement(),
		DESELECT: () => this.handleMouseDown(),

		UNDO: () => this.props.undoLastAction(),
		COPY: () => this.handleCopySelectedElement(),
		PASTE: () => this.handlePasteCopiedElement(),
	};

	handleMouseDown = () => {
		if (this.props.selectedElement) {
			this.props.deselectSlideElement();
		}
	};

	handleDeleteSelectedElement = () => {
		const {selectedElement, elements, isRichTextEditorEnabled} = this.props;

		if (!selectedElement || isRichTextEditorEnabled) {
			return;
		}

		const foundElement = elements.find((element) => element._id === selectedElement._id);

		if (!foundElement) {
			return;
		}

		this.props.deleteSlideElement(foundElement);
	};

	handleCopySelectedElement = () => {
		const {selectedElement} = this.props;

		if (!selectedElement) {
			return;
		}

		this.props.setElementCopiedSlideElement(selectedElement);
	};

	handlePasteCopiedElement = () => {
		const {copiedSlideElement, selectedSlideId} = this.props;

		if (!copiedSlideElement) {
			return;
		}

		this.props.duplicateSlideElement(copiedSlideElement, selectedSlideId);
	};

	handleMoveSelectedElement = (direction: 'up' | 'down' | 'left' | 'right', fast?: boolean) => {
		const {selectedElement, elements, slideshow, isRichTextEditorEnabled} = this.props;

		if (!selectedElement || !slideshow || isRichTextEditorEnabled) {
			return;
		}

		const selectElement = elements.find((element) => element._id === selectedElement._id);

		if (!selectElement) {
			return;
		}

		const distance = 1;
		const fastDistance = 10;
		const selectedDistance = fast ? fastDistance : distance;

		const resolution = getSlideResolution(slideshow.orientation);

		switch (direction) {
			case 'up':
				this.props.updateSlideElement(selectElement, {
					top:
						selectElement.top >= selectedDistance
							? selectElement.top - selectedDistance
							: 0,
				});

				break;

			case 'down':
				this.props.updateSlideElement(selectElement, {
					top:
						selectElement.top + selectElement.height + selectedDistance <
						resolution.height
							? selectElement.top + selectedDistance
							: resolution.height - selectElement.height,
				});

				break;

			case 'left':
				this.props.updateSlideElement(selectElement, {
					left:
						selectElement.left >= selectedDistance
							? selectElement.left - selectedDistance
							: 0,
				});

				break;

			case 'right':
				this.props.updateSlideElement(selectElement, {
					left:
						selectElement.left + selectElement.width + selectedDistance <
						resolution.width
							? selectElement.left + selectedDistance
							: resolution.width - selectElement.width,
				});

				break;
		}
	};

	render() {
		return <GlobalHotKeys keyMap={this.keyMap} handlers={this.keyHandlers} />;
	}
}

export default connect(
	(state: RootState) => ({
		selectedSlideId: state.slideShowEditor.selectedSlideId,
		selectedElement: state.slideShowEditor.selectedElement,
		isRichTextEditorEnabled: state.slideShowEditor.isRichTextEditorEnabled,
		copiedSlideElement: state.slideShowEditor.copiedSlideElement,
	}),
	{
		deselectSlideElement,
		deleteSlideElement,
		updateSlideElement,
		undoLastAction,
		setElementCopiedSlideElement,
		duplicateSlideElement,
	},
)(SlideshowEditorKeyEventHandler);
