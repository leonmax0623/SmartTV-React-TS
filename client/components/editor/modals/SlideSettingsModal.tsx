import * as React from 'react';
import {connect} from 'react-redux';

import {updateSlideStyles} from 'client/actions/slideShowEditor';
import {Form, Formik, FormikActions} from 'formik';
import DialogContent from '@material-ui/core/DialogContent/DialogContent';
import SlideshowStylesForm from 'client/components/user/screens/SlideshowStylesForm';
import DialogActions from '@material-ui/core/DialogActions/DialogActions';
import Button from '@material-ui/core/Button/Button';
import Modal from 'client/components/common/ui/Modal';
import {IUpdateSlideshowStyles} from 'shared/models/SlideshowMethodParams';
import {ISlide} from 'shared/collections/Slides';

interface ISlideSettingsModalProps {
	isOpen: boolean;
	slide: ISlide;
	onClose: () => void;
	updateSlideStyles: (slide: ISlide, slideData: IUpdateSlideshowStyles) => Promise<any>;
}

class SlideSettingsModal extends React.Component<ISlideSettingsModalProps> {
	handleSaveSettings: (
		values: IUpdateSlideshowStyles,
		{setSubmitting}: FormikActions<IUpdateSlideshowStyles>,
	) => void = (values, {setSubmitting}) => {
		this.props.updateSlideStyles(this.props.slide, values).then(() => {
			this.setState({isOpenSettings: false});
			setSubmitting(false);
			this.props.onClose();
		});
	};

	render() {
		const {isOpen, onClose, slide} = this.props;

		return (
			<Modal title={`Настройки слайда #${slide.position}`} isOpen={isOpen} onClose={onClose}>
				<Formik
					initialValues={{...slide.styles, hideProgressbar: slide.styles.hideProgressbar}}
					onSubmit={this.handleSaveSettings}
				>
					{({values, setFieldValue}) => (
						<Form>
							<DialogContent>
								<SlideshowStylesForm
									values={values}
									setFieldValue={setFieldValue}
									isModal
									showElementStyleSettings={false}
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

export default connect(null, {updateSlideStyles})(SlideSettingsModal);
