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
import {
	ISlideElement,
	ISlideElementStylesNames,
	SlideElementTransition,
	SlideElementTransitionText,
	ISlideElementAnimationNames,
} from 'shared/collections/SlideElements';
import MenuItem from '@material-ui/core/MenuItem';
import Select from 'client/components/editor/sidebarPanelUI/Select';
import Input from 'client/components/common/ui/Input';

interface ISlideSettingsModalProps {
	isOpen: boolean;
	element: ISlideElement;
	onClose: () => void;
	onSubmit: (elementStyles: IUpdateElementStyles) => void;
}

class ElementAnimationModal extends React.Component<ISlideSettingsModalProps> {
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
		const initialValues = pick(element, ISlideElementAnimationNames);
		return (
			<Modal title={'Настройка анимации элемента'} isOpen={isOpen} onClose={onClose}>
				<Formik initialValues={{...initialValues}} onSubmit={this.handleSaveSettings}>
					{({values, setFieldValue}) => (
						<Form>
							<DialogContent>
								<Select label="Стиль анимации" name="transitionType">
									{SlideElementTransition.getValues().map((value, index) => (
										<MenuItem value={value} key={index}>
											{SlideElementTransitionText[value]}
										</MenuItem>
									))}
								</Select>
								<Input
									label="Задержка до начала анимации (мс)"
									name="transitionDelay"
									value={values.transitionDelay}
									type="number"
								/>
								<Input
									label="Длительность анимации (мс)"
									name="transitionDuration"
									value={values.transitionDuration}
									type="number"
								/>
								<Input
									label="Повторов анимации (0 - бесконечно)"
									name="transitionCount"
									value={values.transitionCount}
									type="number"
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

export default connect(null, {updateSlideStyles})(ElementAnimationModal);
