import * as React from 'react';
import {connect} from 'react-redux';
import pick from 'lodash/pick';

import {updateSlideStyles} from 'client/actions/slideShowEditor';
import {Form, Formik, FormikActions} from 'formik';
import DialogContent from '@material-ui/core/DialogContent/DialogContent';
import DialogActions from '@material-ui/core/DialogActions/DialogActions';
import Button from '@material-ui/core/Button/Button';
import Modal from 'client/components/common/ui/Modal';
import {IUpdateElementStyles} from 'shared/models/SlideshowMethodParams';
import ElementStylesForm from 'client/components/user/screens/ElementRealStylesForm';
import {ISlideElement, ISlideElementStylesNames} from 'shared/collections/SlideElements';

interface ISlideSettingsModalProps {
	isOpen: boolean;
	element: ISlideElement;
	onClose: () => void;
	onSubmit: (elementStyles: IUpdateElementStyles) => void;
}

class ElementSettingsModal extends React.Component<ISlideSettingsModalProps> {
	handleSaveSettings: (
		values: IUpdateElementStyles,
		{setSubmitting}: FormikActions<IUpdateElementStyles>,
	) => void = (values) => {
		const {onSubmit, onClose} = this.props;
		if (values) {
			onSubmit(values);
		}
		onClose();
	};

	render() {
		const {isOpen, onClose, element} = this.props;
		const initialValues = pick(element, ISlideElementStylesNames);
		return (
			<Modal title={'Настройка стиля элемента'} isOpen={isOpen} onClose={onClose}>
				<Formik initialValues={{...initialValues}} onSubmit={this.handleSaveSettings}>
					{({values, setFieldValue}) => (
						<Form>
							<DialogContent>
								<ElementStylesForm
									values={values}
									setFieldValue={setFieldValue}
									isModal
									NoTitle
								/>
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
					)}
				</Formik>
			</Modal>
		);
	}
}

export default connect(null, {updateSlideStyles})(ElementSettingsModal);
