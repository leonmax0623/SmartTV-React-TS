import * as React from 'react';
import Button from '@material-ui/core/Button/Button';
import Modal from 'client/components/common/ui/Modal';
import {DialogActions, DialogContent, TextField} from '@material-ui/core';

interface ISlideSaveModalProps {
	isOpen: boolean;
	onClose: () => void;
	onSubmit: (statId: string) => void;
}

class SlideSaveModal extends React.Component<ISlideSaveModalProps> {
	private myRef: any;
	constructor(props: ISlideSaveModalProps) {
		super(props);
		this.myRef = React.createRef();
	}

	handleSubmit = () => {
		const {onSubmit, onClose} = this.props;
		if (this.myRef.current.value) {
			onSubmit(this.myRef.current.value);
		}
		onClose();
	};

	render() {
		const {isOpen, onClose} = this.props;

		return (
			<Modal title={'Задать ссылку при клике на элемент'} isOpen={isOpen} onClose={onClose}>
				<DialogContent>
					<TextField
						id="standard-basic"
						fullWidth
						placeholder={'ссылка'}
						inputRef={this.myRef}
					/>
				</DialogContent>

				<DialogActions>
					<Button variant="contained" onClick={onClose}>
						Отменить
					</Button>

					<Button
						color="primary"
						variant="contained"
						type="submit"
						onClick={this.handleSubmit}
					>
						Сохранить
					</Button>
				</DialogActions>
			</Modal>
		);
	}
}

export default SlideSaveModal;
