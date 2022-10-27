import * as React from 'react';
import {Form, Formik, FormikActions} from 'formik';
import {connect} from 'react-redux';
import Typography from '@material-ui/core/Typography';
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button/Button';

import {
	ISlideshow,
	SlideshowFontFamily,
	SlideshowFontFamilyText,
} from 'shared/collections/Slideshows';
import Picker from '../common/ui/Picker';
import Input from '../common/ui/Input';
import Select from './sidebarPanelUI/Select';
import SlideShowBasePanel from './SlideShowBasePanel';
import {updateElementStyles} from 'client/actions/slideShowEditor';
import {
	ISlideElement,
	ISlideElementAdditionalFonts,
	SlideElement,
	SlideElementTypeEnum,
	SocialElementsEnum,
} from 'shared/collections/SlideElements';
import {RootState} from 'client/store/root-reducer';
import VkTemplate from './socialTemplates/VkTemplate';
import TelegramTemplate from './socialTemplates/TelegramTemplate';
import OkTemplate from './socialTemplates/OkTemplate';
import FbTemplate from './socialTemplates/FbTemplate';
import InstagrammTemplate from './socialTemplates/InstagrammTemplate';
import css from './SlideShowEditorSocialPanel.pcss';
import TwitPreview from 'client/components/widgets/social/TwitPreview';
import isNil from 'lodash/isNil';
import {googleFonts} from 'shared/models/GoogleFonts';

interface ISlideShowEditorSocialPanelProps {
	slideshow: ISlideshow;
	selectedElement?: ISlideElement & ISlideElementAdditionalFonts;
	isOpen: boolean;
	onClose?: () => void;
	updateElementStyles: (
		element: ISlideElement,
		elementParams: ISlideElement,
		applyForAllSlides: boolean,
	) => Promise<any>;
}

interface ISlideShowEditorSocialPanelState {
	selectedElementState: string;
	isSaveForAllButtonPressed: boolean;
}

class SlideShowEditorSocialPanel extends React.PureComponent<
	ISlideShowEditorSocialPanelProps,
	ISlideShowEditorSocialPanelState
> {
	state = {
		selectedElementState: '',
		isSaveForAllButtonPressed: false,
	};

	handleFormSubmit: (
		values: ISlideElement,
		{setSubmitting}: FormikActions<ISlideElement>,
	) => void = (values, {setSubmitting}) => {
		const {isSaveForAllButtonPressed} = this.state;
		const {selectedElement} = this.props;
		if (selectedElement) {
			if (this.state.isSaveForAllButtonPressed) {
				this.setState({isSaveForAllButtonPressed: false});
			}

			this.props
				.updateElementStyles(selectedElement, values, isSaveForAllButtonPressed)
				.then(() => {
					setSubmitting(false);

					if (this.props.onClose) {
						this.props.onClose();
					}
				});

			this.setState({selectedElementState: ''});
		}
	};

	handleSetElement = (selectedElementState: string) => () => {
		this.setState({selectedElementState});
	};

	getStyles = () => {
		const {isOpen, selectedElement} = this.props;

		if (selectedElement && isOpen) {
			const selectElement = SlideElement.findOne({_id: selectedElement._id});
			const socialTypes = [
				SlideElementTypeEnum.VKONTAKTE,
				SlideElementTypeEnum.TELEGRAM,
				SlideElementTypeEnum.TWITTER,
				SlideElementTypeEnum.ODNOKLASSNIKI,
				SlideElementTypeEnum.FACEBOOK,
				SlideElementTypeEnum.INSTAGRAM,
			];

			if (socialTypes.includes(selectElement.type)) {
				return {
					socialHeaderFontSize: selectElement.socialHeaderFontSize,
					socialHeaderColor: selectElement.socialHeaderColor,
					socialHeaderBackgroundColor: selectElement.socialHeaderBackgroundColor,
					socialHeaderFont: selectElement.socialHeaderFont,
					socialTextFontSize: selectElement.socialTextFontSize,
					socialTextColor: selectElement.socialTextColor,
					socialTextBackgroundColor: selectElement.socialTextBackgroundColor,
					socialTextFont: selectElement.socialTextFont,
					socialDateFontSize: selectElement.socialDateFontSize,
					socialDateColor: selectElement.socialDateColor,
					socialDateBackgroundColor: selectElement.socialDateBackgroundColor,
					socialDateFont: selectElement.socialDateFont,
					socialDisplay: selectedElement.socialDisplay,
				};
			}
		}

		return {};
	};

	getTemplate = (values: ISlideElement) => {
		const {isOpen, selectedElement} = this.props;
		const {selectedElementState} = this.state;
		const {
			fontSize,
			fontFamily,
			textColor,
			socialHeaderFontSize,
			socialHeaderColor,
			socialHeaderBackgroundColor,
			socialHeaderFont,
			socialTextFontSize,
			socialTextColor,
			socialTextBackgroundColor,
			socialTextFont,
			socialDateFontSize,
			socialDateColor,
			socialDateBackgroundColor,
			socialDateFont,
		} = values;

		const headerStyle = {
			fontSize: !isNil(socialHeaderFontSize) ? socialHeaderFontSize : fontSize,
			color: socialHeaderColor || textColor,
			backgroundColor: socialHeaderBackgroundColor,
			fontFamily: socialHeaderFont || fontFamily,
			outline: selectedElementState === SocialElementsEnum.HEADER ? '2px dotted #75f9a8' : '',
			minHeight: 20,
			minWidth: 50,
		};

		const textStyle = {
			fontSize: !isNil(socialTextFontSize) ? socialTextFontSize : fontSize,
			color: socialTextColor,
			backgroundColor: socialTextBackgroundColor,
			fontFamily: socialTextFont,
			outline: selectedElementState === SocialElementsEnum.TEXT ? '2px dotted #75f9a8' : '',
			minHeight: 20,
		};

		const timerStyle = {
			fontSize: !isNil(socialDateFontSize) ? socialDateFontSize : fontSize,
			color: socialDateColor || textColor,
			backgroundColor: socialDateBackgroundColor,
			fontFamily: socialDateFont || fontFamily,
			outline: selectedElementState === SocialElementsEnum.DATE ? '2px dotted #75f9a8' : '',
			minHeight: 20,
			minWidth: 50,
		};

		if (selectedElement && isOpen) {
			const currentElement = SlideElement.findOne({_id: selectedElement._id});

			switch (currentElement.type) {
				case SlideElementTypeEnum.TWITTER:
					return (
						<TwitPreview
							getElement={this.handleSetElement}
							element={values}
							styles={{headerStyle, textStyle, timerStyle}}
							isTemplate
						/>
					);

				case SlideElementTypeEnum.ODNOKLASSNIKI:
					return (
						<OkTemplate
							getElement={this.handleSetElement}
							values={values}
							styles={{headerStyle, textStyle, timerStyle}}
						/>
					);

				case SlideElementTypeEnum.FACEBOOK:
					return (
						<FbTemplate
							getElement={this.handleSetElement}
							styles={{headerStyle, textStyle, timerStyle}}
						/>
					);

				case SlideElementTypeEnum.INSTAGRAM:
					return (
						<InstagrammTemplate
							getElement={this.handleSetElement}
							values={values}
							styles={{headerStyle, textStyle, timerStyle}}
						/>
					);

				case SlideElementTypeEnum.TELEGRAM:
					return (
						<TelegramTemplate
							getElement={this.handleSetElement}
							styles={{headerStyle, textStyle, timerStyle}}
						/>
					);

				default:
					return (
						<VkTemplate
							getElement={this.handleSetElement}
							styles={{headerStyle, textStyle, timerStyle}}
						/>
					);
			}
		}

		return (
			<VkTemplate
				getElement={this.handleSetElement}
				styles={{headerStyle, textStyle, timerStyle}}
			/>
		);
	};

	render() {
		const {isOpen, onClose} = this.props;
		const {selectedElementState} = this.state;
		const styles = this.getStyles();
		const {additionalFonts = []} = this.props?.selectedElement || {};

		const initialValues = {
			socialHeaderFontSize: styles.socialHeaderFontSize,
			socialHeaderColor: styles.socialHeaderColor,
			socialHeaderBackgroundColor: styles.socialHeaderBackgroundColor,
			socialHeaderFont: styles.socialHeaderFont,
			socialTextFontSize: styles.socialTextFontSize,
			socialTextColor: styles.socialTextColor,
			socialTextBackgroundColor: styles.socialTextBackgroundColor,
			socialTextFont: styles.socialTextFont,
			socialDateFontSize: styles.socialDateFontSize,
			socialDateColor: styles.socialDateColor,
			socialDateBackgroundColor: styles.socialDateBackgroundColor,
			socialDateFont: styles.socialDateFont,
			socialDisplay: styles.socialDisplay,
		};

		return (
			<Formik
				initialValues={initialValues}
				enableReinitialize={true}
				onSubmit={this.handleFormSubmit}
				render={({values, setFieldValue, submitForm}) => {
					// TODO what is social${selectedElementState}Font` ?
					const googleSelectedFont = googleFonts.find(
						(family) => family === values[`social${selectedElementState}Font`],
					);

					return (
						<Form>
							<SlideShowBasePanel
								width={1000}
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
										this.setState({selectedElementState: ''});
									}
								}}
							>
								<div className={css.container}>
									<div className={css.preview}>
										<Typography variant="h5" gutterBottom>
											Настройки социальных сетей
										</Typography>

										{this.getTemplate(values)}
									</div>

									<div className={css.form}>
										{!selectedElementState && (
											<Typography variant="subtitle1" gutterBottom>
												Выберите элемент для настройки
											</Typography>
										)}

										{selectedElementState && (
											<div key={selectedElementState}>
												<Select
													label="Шрифт"
													name={`social${selectedElementState}Font`}
													style={{
														fontFamily:
															googleSelectedFont ||
															SlideshowFontFamilyText[
																values[
																	`social${selectedElementState}Font`
																]
															],
													}}
												>
													{additionalFonts.map((family) => (
														<MenuItem
															value={family}
															key={family}
															style={{fontFamily: family}}
														>
															{family}
														</MenuItem>
													))}

													{SlideshowFontFamily.getValues().map(
														(value, index) => (
															<MenuItem
																value={
																	SlideshowFontFamilyText[value]
																}
																key={index}
																style={{
																	fontFamily:
																		SlideshowFontFamilyText[
																			value
																		],
																}}
																selected={
																	values[
																		`social${selectedElementState}Font`
																	] === value
																}
															>
																{SlideshowFontFamilyText[value]}
															</MenuItem>
														),
													)}

													{googleFonts.map((family) => (
														<MenuItem
															value={family}
															key={family}
															selected={
																values[
																	`social${selectedElementState}Font`
																] === family
															}
															style={{fontFamily: family}}
														>
															{family}
														</MenuItem>
													))}
												</Select>

												<Input
													label="Размер текста"
													name={`social${selectedElementState}FontSize`}
													value={
														values[
															`social${selectedElementState}FontSize`
														]
													}
													type="number"
													inputProps={{min: 0, max: 50}}
												/>

												<Picker
													label="Цвет текста"
													name={`social${selectedElementState}Color`}
													getHexColor={setFieldValue}
													color={
														values[`social${selectedElementState}Color`]
													}
												/>

												<Picker
													label="Цвет фона"
													name={`social${selectedElementState}BackgroundColor`}
													getHexColor={setFieldValue}
													color={
														values[
															`social${selectedElementState}BackgroundColor`
														]
													}
												/>
											</div>
										)}
									</div>
								</div>
							</SlideShowBasePanel>
						</Form>
					);
				}}
			/>
		);
	}
}

export default connect(
	(state: RootState) => ({
		selectedElement: state.slideShowEditor.selectedElement,
	}),
	{updateElementStyles},
)(SlideShowEditorSocialPanel);
