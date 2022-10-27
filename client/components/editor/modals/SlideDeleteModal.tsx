import * as React from 'react';
import {connect} from 'react-redux';

import DialogContent from '@material-ui/core/DialogContent/DialogContent';
import DialogActions from '@material-ui/core/DialogActions/DialogActions';
import Button from '@material-ui/core/Button/Button';
import Modal from 'client/components/common/ui/Modal';
import {ISlide} from 'shared/collections/Slides';
import {deleteSlide} from 'client/actions/slideShowEditor';

interface ISlideDeleteModalProps {
	isOpen: boolean;
	slide: ISlide;
	onClose: () => void;
	deleteSlide: typeof deleteSlide;
}

class SlideDeleteModal extends React.Component<ISlideDeleteModalProps> {
	handleDeleteSlide = () => {
		this.props.deleteSlide(this.props.slide);
		this.props.onClose();
	};

	render() {
		const {isOpen, onClose, slide} = this.props;
		return (
			<Modal title={`Удаление слайда #${slide.position}`} isOpen={isOpen} onClose={onClose}>
				<DialogContent>Подтвердите удаление слайда {`#${slide.position}`}</DialogContent>

				<DialogActions>
					<Button variant="contained" onClick={onClose}>
						Отменить
					</Button>

					<Button color="primary" variant="contained" onClick={this.handleDeleteSlide}>
						Удалить
					</Button>
				</DialogActions>
			</Modal>
		);
	}
}

export default connect(null, {deleteSlide})(SlideDeleteModal);
