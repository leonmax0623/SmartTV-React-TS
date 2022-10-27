import * as React from 'react';
import {Meteor} from 'meteor/meteor';
import Button from '@material-ui/core/Button/Button';
import Modal from 'client/components/common/ui/Modal';
import {ISlide} from 'shared/collections/Slides';
import {DialogActions, DialogContent} from '@material-ui/core';
import Input from 'client/components/common/ui/Input';
import {Formik, Form, FormikActions} from 'formik';
import {methodNames} from 'shared/constants/methodNames';

interface ISlideSaveModalProps {
	isOpen: boolean;
	slide: ISlide;
	onClose: () => void;
}

interface ISlideSaveFormValues {
	name: string;
}

class SlideSaveModal extends React.Component<ISlideSaveModalProps> {
	handleSubmit = (values: ISlideSaveFormValues, actions: FormikActions<ISlideSaveFormValues>) => {
		const {slide, onClose} = this.props;

		Meteor.callAsync(methodNames.slideMockups.create, slide._id, values.name).then(() => {
			actions.setSubmitting(false);
			onClose();
		});
	};

	render() {
		const {isOpen, onClose, slide} = this.props;

		return (
			<Formik onSubmit={this.handleSubmit} initialValues={{name: ''}}>
				<Modal
					title={`Сохранение слайда #${slide.position}`}
					isOpen={isOpen}
					onClose={onClose}
				>
					<Form>
						<DialogContent>
							<Input label="Название слайда" name="name" />
						</DialogContent>

						<DialogActions>
							<Button variant="contained" onClick={onClose}>
								Отменить
							</Button>

							<Button color="primary" variant="contained" type="submit">
								Сохранить
							</Button>
						</DialogActions>
					</Form>
				</Modal>
			</Formik>
		);
	}
}

export default SlideSaveModal;
