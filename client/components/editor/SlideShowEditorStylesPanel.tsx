import * as React from 'react';
import {Form, Formik, FormikActions} from 'formik';
import {connect} from 'react-redux';
import Button from '@material-ui/core/Button/Button';

import SlideShowBasePanel from './SlideShowBasePanel';
import {updateSlideshowStyles} from 'client/actions/slideShowEditor';
import {ISlideshow, ISlideshowStyles} from 'shared/collections/Slideshows';
import SlideshowStylesForm from '../user/screens/SlideshowStylesForm';

interface ISlideShowEditorStylesPanelProps {
	slideshow: ISlideshow;
	isOpen: boolean;
	onClose?: () => void;
	updateSlideshowStyles: (
		slideshow: ISlideshow,
		slideshowParams: ISlideshowStyles,
		applyForAllSlides: boolean,
	) => Promise<any>;
}

interface ISlideShowEditorStylesPanelState {
	isSaveForAllButtonPressed: boolean;
}

class SlideShowEditorStylesPanel extends React.PureComponent<
	ISlideShowEditorStylesPanelProps,
	ISlideShowEditorStylesPanelState
> {
	state = {isSaveForAllButtonPressed: false};

	handleFormSubmit: (
		values: ISlideshowStyles,
		{setSubmitting}: FormikActions<ISlideshowStyles>,
	) => void = (values, {setSubmitting}) => {
		const {isSaveForAllButtonPressed} = this.state;

		if (this.state.isSaveForAllButtonPressed) {
			this.setState({isSaveForAllButtonPressed: false});
		}

		this.props
			.updateSlideshowStyles(this.props.slideshow, values, isSaveForAllButtonPressed)
			.then(() => {
				setSubmitting(false);

				if (this.props.onClose) {
					this.props.onClose();
				}
			});
	};

	render() {
		const {slideshow, isOpen, onClose} = this.props;

		return (
			<Formik initialValues={{...slideshow.styles}} onSubmit={this.handleFormSubmit}>
				{({values, setFieldValue, submitForm}) => (
					<Form>
						<SlideShowBasePanel
							isOpen={isOpen}
							buttons={[
								<Button
									key="apply"
									size="large"
									name="saveButton"
									variant="contained"
									onClick={() => {
										this.setState(
											{isSaveForAllButtonPressed: true},
											submitForm,
										);
									}}
								>
									Для всех слайдов
								</Button>,

								<Button
									key="save"
									type="submit"
									size="large"
									color="primary"
									variant="contained"
								>
									Сохранить
								</Button>,
							]}
							onClose={() => {
								if (onClose) {
									onClose();
								}
							}}
						>
							<SlideshowStylesForm
								values={values}
								setFieldValue={setFieldValue}
								additionalFonts={
									slideshow.additionalFonts?.map((f) => f.name) || []
								}
								showElementStyleSettings={false}
							/>
						</SlideShowBasePanel>
					</Form>
				)}
			</Formik>
		);
	}
}

export default connect(null, {updateSlideshowStyles})(SlideShowEditorStylesPanel);
