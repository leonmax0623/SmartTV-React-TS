import * as React from 'react';
import CloneIcon from '@material-ui/icons/Layers';
import DeleteIcon from '@material-ui/icons/Delete';
import CloseIcon from '@material-ui/icons/Close';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import Button from '@material-ui/core/Button';
import {connect} from 'react-redux';

import {
	deleteSlideElement,
	duplicateSlideElement,
	deselectSlideElement,
	updateSlideElement,
} from 'client/actions/slideShowEditor';
import {ISlideElement} from 'shared/collections/SlideElements';
import Tooltip from 'client/components/common/ui/Tooltip';
import EditorActionButtons from './EditorActionButtons';
import css from './EditorActionButtonsCommon.pcss';

interface IEditorActionButtonsCommonProps {
	element: ISlideElement;
	duplicateSlideElement: (slideElement: ISlideElement) => void;
	deleteSlideElement: typeof deleteSlideElement;
	deselectSlideElement: typeof deselectSlideElement;
	updateSlideElement: typeof updateSlideElement;
}

class EditorActionButtonsCommon extends React.PureComponent<IEditorActionButtonsCommonProps> {
	handleDeselectButton = () => {
		this.props.deselectSlideElement();
	};

	handleDuplicateButton = () => {
		this.props.duplicateSlideElement(this.props.element);
	};

	handleDeleteButton = () => {
		this.props.deleteSlideElement(this.props.element);
	};

	handleUpdateElementButton = (inc: number) => () => {
		this.props.updateSlideElement(this.props.element, {
			zIndex: this.props.element.zIndex + inc,
		});
	};

	render() {
		return (
			<>
				<EditorActionButtons
					label="Глубина"
					tooltip="Глубина определяет какие элементы перекрывают другие при наложении.
					Для перемещения элемента над остальными нажмите несколько раз на стрелку вверх,
					а для перемещения под другие элементы - вниз"
				>
					<Tooltip title="Переместить элемент ниже">
						<Button onClick={this.handleUpdateElementButton(-1)}>
							<ArrowDownwardIcon />
						</Button>
					</Tooltip>

					<>
						{!this.props.element.permanent && (
							<Tooltip title="Номер элемена">
								<div className={css.zIndex}>{this.props.element.zIndex}</div>
							</Tooltip>
						)}
					</>

					<Tooltip title="Переместить элемент выше">
						<Button onClick={this.handleUpdateElementButton(1)}>
							<ArrowUpwardIcon />
						</Button>
					</Tooltip>
				</EditorActionButtons>

				<EditorActionButtons label="Действия">
					<Tooltip placement="top" title="Снять выделение [Esc]">
						<Button onClick={this.handleDeselectButton}>
							<CloseIcon />
						</Button>
					</Tooltip>

					<Tooltip placement="top" title="Дублировать элемент">
						<Button onClick={this.handleDuplicateButton}>
							<CloneIcon />
						</Button>
					</Tooltip>

					<Tooltip placement="top" title="Удалить элемент [Delete]">
						<Button onClick={this.handleDeleteButton}>
							<DeleteIcon />
						</Button>
					</Tooltip>
				</EditorActionButtons>
			</>
		);
	}
}

export default connect(null, {
	deleteSlideElement,
	duplicateSlideElement,
	deselectSlideElement,
	updateSlideElement,
})(EditorActionButtonsCommon);
