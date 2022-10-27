import * as React from 'react';
import {Meteor} from 'meteor/meteor';
import {withTracker} from 'react-meteor-data-with-tracker';
import {createStyles, withStyles} from '@material-ui/core/styles';
import {Form, Formik, FormikActions, FieldArray} from 'formik';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Card from '@material-ui/core/Card';
import Typography from '@material-ui/core/Typography/Typography';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import Divider from '@material-ui/core/Divider';
import AddIcon from '@material-ui/icons/Add';
import Grid from '@material-ui/core/Grid';
import {RouteComponentProps} from 'react-router-dom';
import {push} from 'connected-react-router';
import {connect} from 'react-redux';

import Picker from '../../common/ui/Picker';
import UploadButton from '../../common/ui/UploadButton';
import Input from '../../common/ui/Input';
import Select from '../../editor/sidebarPanelUI/Select';
import routerUrls from '../../../constants/routerUrls';
import {AppSets, IAppsetsFeed, AppSetSchema, scaleValues} from 'shared/collections/AppSets';
import {Slideshow, ISlideshow} from 'shared/collections/Slideshows';
import {methodNames} from 'shared/constants/methodNames';
import {publishNames} from 'shared/constants/publishNames';
import {requiredInput} from 'client/components/common/ui/requiredValidator';

const styles = createStyles({
	container: {
		display: 'flex',
		flexWrap: 'wrap',
		flexDirection: 'column',
		margin: '0 16px',
	},
	textFields: {
		margin: '10px 0 !important',
	},
	buttons: {
		display: 'flex',
		flexWrap: 'wrap',
		flexDirection: 'row-reverse',
	},
	subContainer: {
		display: 'flex',
		flexDirection: 'column',
	},
	appsContainer: {
		display: 'flex',
		flexWrap: 'wrap',
	},
	appsItem: {
		display: 'flex',
		flexDirection: 'column',
		marginRight: '16px',
		marginBottom: '16px',
	},
	media: {
		height: 140,
	},
});

interface IAppSetsStyleProps {
	classes: {
		container: string;
		textFields: string;
		buttons: string;
		subContainer: string;
		appsContainer: string;
		appsItem: string;
		media: string;
	};
}

interface IAppSetsProps {
	loading: boolean;
	appset: IAppsetsFeed;
	screens: ISlideshow[];
	_id: string;
	push: typeof push;
}

class AppSetsForm extends React.PureComponent<
	IAppSetsProps & IAppSetsStyleProps & RouteComponentProps
> {
	onSubmitHandler = (values: IAppsetsFeed, {setSubmitting}: FormikActions<IAppsetsFeed>) => {
		const {_id, appset} = this.props;
		const shema = _id ? AppSetSchema.Editor : AppSetSchema.Creator;
		const method = _id ? methodNames.appsets.update : methodNames.appsets.create;
		const updatedAppset = {
			...appset,
			...values,
		};

		const context = shema.newContext();
		context.validate(updatedAppset);

		if (context.isValid()) {
			Meteor.call(method, updatedAppset, (error, result: string) => {
				if (error) {
					console.log('Ошибка');
				} else {
					setSubmitting(false);
					console.log('Подборка сохранена', true);
					if (!_id) {
						this.props.push(routerUrls.userAppsSetsEdit.replace(':id', result));
					}
				}
			});
		}
	};

	handlePreviewApp = (event) => {
		event.preventDefault();
		const {numId} = this.props.appset;

		if (!numId) {
			return;
		}

		const url = routerUrls.userAppSetPreview.replace(':id', numId);

		window.open(url, 'prtvPreview', `width=1280,height=720,toolbar=0,location=0,menubar=0`);
	};

	hadleAddScreen = () => {
		document.getElementById('addElementButton').click();
	};

	render() {
		const {appset, loading, screens, classes, _id} = this.props;

		if (loading || !appset) {
			return <CircularProgress />;
		}

		const {title, welcome, style, apps} = appset;

		return (
			<Formik
				onSubmit={this.onSubmitHandler}
				initialValues={{title, welcome, style, apps}}
				render={({values, setFieldValue}) => (
					<>
						<Form className={classes.container}>
							<Grid
								container
								justify="space-between"
								className="pageHeaderWrap"
								style={{paddingBottom: '16px'}}
							>
								<Grid item>
									<Typography className="pageTitle" variant="h5">
										{_id ? 'Редактирование' : 'Добавление'} подборки
									</Typography>
								</Grid>

								<Grid item>
									<Button variant="outlined" href={routerUrls.userAppsSets}>
										Отменить
									</Button>
									&nbsp;
									<Button color="primary" type="submit" variant="outlined">
										Сохранить
									</Button>
									{_id && (
										<>
											&nbsp;
											<Button
												color="primary"
												type="submit"
												variant="outlined"
												onClick={this.handlePreviewApp}
											>
												Просмотреть
											</Button>
										</>
									)}
									&nbsp;
									<Button
										variant="outlined"
										color="primary"
										onClick={this.hadleAddScreen}
									>
										<AddIcon />
										Добавить слайдшоу
									</Button>
								</Grid>
							</Grid>

							<Grid container direction="row" wrap="nowrap">
								<Grid item xs={9}>
									<FormControl className={classes.subContainer}>
										<FieldArray
											name="apps"
											render={(arrayHelpers) => (
												<Grid container>
													{values.apps &&
														!!values.apps.length &&
														values.apps.map((app, index) => (
															<Grid
																item
																xs={4}
																key={index.toString()}
															>
																<Card className={classes.appsItem}>
																	<UploadButton
																		title="Превью экрана"
																		name={`apps.${index}.previewImage`}
																		tooltip={
																			<>
																				Рекомендуемое
																				разрешение
																				<br />
																				<br />
																				Минимальное
																				(fullHD): 300x300
																				<br />
																				Максимальное (4k):
																				600x600
																			</>
																		}
																		value={app.previewImage}
																		onChange={setFieldValue}
																		fullWidth
																		height={160}
																	/>

																	<div
																		style={{
																			padding: '8px',
																			display: 'flex',
																			flexWrap: 'wrap',
																			flexDirection: 'column',
																		}}
																	>
																		<Input
																			label="Название"
																			name={`apps.${index}.title`}
																			value={app.title}
																			type="text"
																			validate={requiredInput()}
																		/>

																		<Select
																			label="Экран"
																			name={`apps.${index}.appId`}
																			validate={requiredInput()}
																		>
																			{screens.map(
																				(screen, index) => (
																					<MenuItem
																						value={
																							screen.numId
																						}
																						key={index}
																					>
																						{`${screen.name} (${screen.numId})`}
																					</MenuItem>
																				),
																			)}
																		</Select>
																	</div>

																	<Button
																		color="primary"
																		type="button"
																		onClick={() =>
																			arrayHelpers.remove(
																				index,
																			)
																		}
																	>
																		Удалить
																	</Button>
																</Card>
															</Grid>
														))}

													<button
														id="addElementButton"
														type="button"
														hidden={true}
														onClick={() =>
															arrayHelpers.push({
																title: '',
																appId: undefined,
																previewImage: undefined,
															})
														}
													>
														Добавить слайдшоу
													</button>
												</Grid>
											)}
										/>
									</FormControl>
								</Grid>

								<Grid item xs={3}>
									<Card style={{padding: '16px'}}>
										<FormControl className={classes.subContainer}>
											<Input
												name="title"
												type="text"
												label="Название подборки"
												className={classes.textFields}
												validate={requiredInput()}
											/>

											<Input
												name="welcome"
												type="text"
												label="Приветственная фраза"
												className={classes.textFields}
												validate={requiredInput()}
											/>
										</FormControl>

										<FormLabel>Настройки оформления</FormLabel>
										<Divider />

										<FormControl className={classes.subContainer}>
											<Picker
												label="Цвет текста"
												getHexColor={setFieldValue}
												name="style.color"
												color={values.style && values.style.color}
											/>
											<Picker
												label="Цвет фона подборки"
												getHexColor={setFieldValue}
												name="style.backgroundColor"
												color={values.style && values.style.backgroundColor}
											/>
											<Picker
												label="Цвет активного элемента"
												getHexColor={setFieldValue}
												name="style.focusColor"
												color={values.style && values.style.focusColor}
											/>

											<UploadButton
												label="Изображение"
												name="style.image"
												value={values.style && values.style.image}
												onChange={setFieldValue}
												fullWidth
												height={160}
											/>

											<FormControl>
												<Select
													name="style.repeat"
													label="Отображение изображения"
												>
													{[
														{
															label: 'Полный экран',
															value: 'no-repeat',
														},
														{
															label: 'Мозаика',
															value: 'repeat',
														},
													].map((val, index) => (
														<MenuItem value={val.value} key={index}>
															{val.label}
														</MenuItem>
													))}
												</Select>
											</FormControl>

											<Select name="style.scale" label="Масштаб изображения">
												{scaleValues.map((val, index) => (
													<MenuItem value={val} key={index}>
														{val}
													</MenuItem>
												))}
											</Select>
										</FormControl>
									</Card>
								</Grid>
							</Grid>
						</Form>
					</>
				)}
			/>
		);
	}
}

export default withTracker<{}, RouteComponentProps>((props) => {
	const {id: _id} = props.match.params as {id: string};
	const appsSub = Meteor.subscribe(publishNames.appsets.mySlideshows);
	const appsetsSub = Meteor.subscribe(publishNames.appsets.myAppsets);
	const loading = !appsSub.ready() && !appsetsSub.ready();

	const appset = _id
		? AppSets.findOne({_id})
		: {
				title: '',
				welcome: '',
				style: {
					backgroundColor: '',
					focusColor: '',
					image: '',
					repeat: 'repeat',
					scale: 80,
				},
				apps: [],
		  };

	return {
		_id,
		loading,
		appset,
		screens: Slideshow.find().fetch(),
	};
})(
	withStyles(styles)(
		connect(null, {
			push,
		})(AppSetsForm),
	),
);
