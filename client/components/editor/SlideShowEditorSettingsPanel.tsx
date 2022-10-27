import * as React from 'react';
import {Form, Formik, FormikActions} from 'formik';
import {connect} from 'react-redux';
import Typography from '@material-ui/core/Typography';
import MenuItem from '@material-ui/core/MenuItem';
import {YMapsProps, Map, Placemark} from 'react-yandex-maps';
import Button from '@material-ui/core/Button/Button';
import {withTracker} from 'react-meteor-data-with-tracker';

import {
	ICustomFont,
	ISlideshow,
	SlideshowLocation,
	SlideshowLocationText,
	SlideshowOrientation,
	SlideshowOrientationText,
	SlideshowPreview,
	SlideshowPreviewEnum,
	SlideshowPreviewText,
	SlideshowRadiostation,
	SlideshowRadiostationText,
} from 'shared/collections/Slideshows';
import UploadButton from '../common/ui/UploadButton';
import Input from '../common/ui/Input';
import Select from './sidebarPanelUI/Select';
import {ISlideshowParams} from 'shared/models/SlideshowMethodParams';
import SlideShowBasePanel from './SlideShowBasePanel';
import {updateSlideshowParams} from 'client/actions/slideShowEditor';
import Slider from 'client/components/editor/sidebarPanelUI/Slider';
import {Meteor} from 'meteor/meteor';
import {publishNames} from 'shared/constants/publishNames';
import {Group, IGroup} from 'shared/collections/Groups';
import {sharedConsts} from 'shared/constants/sharedConsts';
import AddIcon from '@material-ui/icons/Add';
import Menu from '@material-ui/core/Menu';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Icon from '@mdi/react';
import {mdiGoogleDrive, mdiUpload} from '@mdi/js';
import {List, ListItem, ListItemSecondaryAction, ListItemText, Theme} from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import {withStyles, createStyles} from '@material-ui/core/styles';
import axios from 'axios';
import appConsts from 'client/constants/appConsts';
import {googleFonts} from 'shared/models/GoogleFonts';
import {SystemGroup, ISystemGroup} from 'shared/collections/SystemGroups';
import {checkAdmin} from 'shared/utils/user';
import {requiredInput} from 'client/components/common/ui/requiredValidator';

interface ISlideShowEditorSettingsPanelProps {
	slideshow: ISlideshow;
	isOpen: boolean;
	onClose?: () => void;
	classes: {
		input: string;
		fontsList: string;
	};
	updateSlideshowParams: (
		slideshow: ISlideshow,
		slideshowParams: ISlideshowParams,
	) => Promise<any>;
	groups: IGroup[];
	loading: boolean;
	systemGroups: ISystemGroup[];
}

interface ISlideShowEditorSettingsPanelState {
	showPreview: boolean;
	coordinates: number[];
	isValidAddress: boolean;
	anchorEl?: HTMLElement;
}

const styles = (theme: Theme) =>
	createStyles({
		fontsList: {
			backgroundColor: theme.palette.background.paper,
		},
		input: {
			display: 'none',
		},
	});

class SlideShowEditorSettingsPanel extends React.PureComponent<
	ISlideShowEditorSettingsPanelProps,
	ISlideShowEditorSettingsPanelState
> {
	ymaps: YMapsProps;
	setFieldValue: (name: string, value: string | number | ICustomFont[]) => void;
	values: ISlideshowParams;

	state = {
		coordinates: [sharedConsts.ya.default.lat, sharedConsts.ya.default.len],
		isValidAddress: false,
		// <HTMLElement>
		anchorEl: undefined,
	};

	handleFormSubmit: (
		values: ISlideshowParams,
		{setSubmitting}: FormikActions<ISlideshowParams>,
	) => void = (values: ISlideshowParams, {setSubmitting}) => {
		this.props.updateSlideshowParams(this.props.slideshow, values).then(() => {
			if (this.props.onClose) {
				this.props.onClose();
			}

			setSubmitting(false);
		});
	};

	handleAddressInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const {value} = e.target;

		this.setFieldValue('address', value);

		this.setState({isValidAddress: false});
	};

	handleAddressInputKeyPress = (
		e: React.KeyboardEvent<HTMLInputElement> & React.ChangeEvent<HTMLInputElement>,
	) => {
		const {value} = e.target;

		if (e.key === 'Enter') {
			e.preventDefault();

			this.setFieldValue('address', value);
		}
	};

	handleAddressSelectChange = (e: any) => {
		const {value} = e.get('item');

		this.setCoordinates(value).then(() => {
			this.setFieldValue('address', value);
		});
	};

	setCoordinates = (address?: string) => {
		const {slideshow} = this.props;

		if (!address && !slideshow.address) {
			return;
		}

		return this.ymaps
			.geocode(address || slideshow.address)
			.then((result: any) => {
				this.setState({
					coordinates: result.geoObjects.get(0).geometry.getCoordinates(),
					isValidAddress: true,
				});
			})
			.fail((err: any) => {
				console.log(err);
				throw err;
			});
	};

	setAddress = () => {
		const {coordinates} = this.state;

		this.ymaps
			.geocode(coordinates, {results: 1})
			.then((res: any) => {
				const object = res.geoObjects.get(0);

				this.setFieldValue('address', object.properties.get('text'));
			})
			.fail((err: any) => {
				console.log(err);
			});
	};

	handleAddressMapClick = (e: any) => {
		this.setState({coordinates: e.get('coords'), isValidAddress: true}, this.setAddress);
	};

	handleAddressPlacemarkDragEnd = (e: any) => {
		this.setState(
			{coordinates: e.get('target').geometry.getCoordinates(), isValidAddress: true},
			this.setAddress,
		);
	};

	handleRadioVolumeChange = (e: React.ChangeEvent<HTMLElement>, val: number) => {
		this.setFieldValue('radioVolume', val);
	};
	handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
		this.setState({anchorEl: event.currentTarget});
	};
	handleClose = () => {
		this.setState({anchorEl: undefined});
	};
	handleSelectGoogleFont = () => {
		this.setState({anchorEl: undefined});
		const fontName = prompt('Укажите название шрифта');
		if (fontName) {
			let additionalFonts: ICustomFont[] = [];
			if (this.values.additionalFonts?.length) {
				if (this.values.additionalFonts.find((f) => f.name === fontName)) {
					return alert('Шрифт с таким названием уже добавлен');
				}
				if (googleFonts.includes(fontName)) {
					return alert('Шрифт с таким названием входит в список стандартных шрифтов');
				}
				additionalFonts = [...this.values.additionalFonts];
			}
			additionalFonts.push({name: fontName, type: 'google-font'});
			this.setFieldValue('additionalFonts', additionalFonts);
		}
	};

	handleRemoveFont = (fontName: string) => () => {
		let additionalFonts: ICustomFont[] = [];
		if (this.values.additionalFonts?.length) {
			additionalFonts = [...this.values.additionalFonts];
		}
		additionalFonts = additionalFonts.filter((a) => a.name !== fontName);
		this.setFieldValue('additionalFonts', additionalFonts);
	};

	handleSetCustomFile = (fontName: string, src: string) => {
		this.setState({anchorEl: undefined});
		if (fontName) {
			let additionalFonts: ICustomFont[] = [];
			if (this.values.additionalFonts?.length) {
				additionalFonts = [...this.values.additionalFonts];
			}
			additionalFonts.push({name: fontName, src, type: 'custom-font'});
			this.setFieldValue('additionalFonts', additionalFonts);
		}
	};

	handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (!e.target.files) {
			return;
		}
		const fontName = prompt('Укажите название шрифта');
		if (fontName) {
			if (this.values.additionalFonts?.find((f) => f.name === fontName)) {
				return alert('Шрифт с таким названием уже добавлен');
			}
			if (googleFonts.includes(fontName)) {
				return alert('Шрифт с таким названием входит в список стандартных шрифтов');
			}
			const files = Array.from(e.target.files);
			const formData = new FormData();

			files.forEach((file, i) => {
				formData.append(String(i), file);
			});

			// this.setState({uploading: true, uploadProgress: 0});

			axios
				.post(appConsts.uploadUrl, formData, {
					// onUploadProgress: (obj: IFileUploadProgress) => {
					// 	this.setState({uploadProgress: (obj.loaded / obj.total) * 100});
					// },
				})
				.then((images) => {
					// this.setState({uploading: false});
					this.handleSetCustomFile(fontName, images.data.files[0].name);
				});
		}
	};

	render() {
		const {slideshow, isOpen, onClose, groups, loading, systemGroups} = this.props;
		const {coordinates, isValidAddress} = this.state;

		const initialValues: ISlideshowParams = {
			address: slideshow.address,
			name: slideshow.name,
			previewImage: slideshow.previewImage,
			password: slideshow.password,
			showSlidePreview: slideshow.showSlidePreview || SlideshowPreviewEnum.SHOW,
			orientation: slideshow.orientation,
			location: slideshow.location,
			radiostation: slideshow.radiostation,
			radioVolume: slideshow.radioVolume || 0.6,
			groupId: slideshow.groupId,
			systemGroupId: slideshow.systemGroupId,
			additionalFonts: slideshow.additionalFonts,
		};

		const checkIsValidAddress = (value: string) => {
			if (!isValidAddress) {
				return value && value.trim() ? 'Неправильно выбранный адрес' : undefined;
			}

			return undefined;
		};

		const volumeStep = 0.1;

		const classes = this.props.classes;

		return (
			<Formik
				initialValues={initialValues}
				onSubmit={this.handleFormSubmit}
				render={({values, setFieldValue}) => {
					this.setFieldValue = setFieldValue;
					this.values = values;

					return (
						<Form>
							<SlideShowBasePanel
								isOpen={isOpen}
								buttons={[
									<Button
										key="cancel"
										size="large"
										onClick={onClose}
										variant="contained"
									>
										Отменить
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
								<Typography variant="h5" gutterBottom>
									Настройки слайдшоу
								</Typography>
								<br />
								<Input
									label="Название слайдшоу"
									name="name"
									placeholder="название"
									validate={requiredInput()}
								/>
								<Select label="Группа" name="groupId">
									{!loading &&
										groups.map(({_id, name}) => (
											<MenuItem value={_id} key={_id}>
												{name}
											</MenuItem>
										))}
								</Select>
								{checkAdmin() && slideshow.isSystem && (
									<Select label="Системная категория" name="systemGroupId">
										{!loading &&
											systemGroups.map(({_id, name}) => (
												<MenuItem value={_id} key={_id}>
													{name}
												</MenuItem>
											))}
									</Select>
								)}
								<Select
									label="Ориентация экрана"
									name="orientation"
									validate={requiredInput()}
								>
									{SlideshowOrientation.getValues().map((value, index) => (
										<MenuItem value={value} key={index}>
											{SlideshowOrientationText[value]}
										</MenuItem>
									))}
								</Select>
								<Select
									label="Вид помещения"
									name="location"
									validate={requiredInput()}
								>
									{SlideshowLocation.getValues().map((value, index) => (
										<MenuItem value={value} key={index}>
											{SlideshowLocationText[value]}
										</MenuItem>
									))}
								</Select>
								<Select
									label="Превью слайдшоу"
									name="showSlidePreview"
									validate={requiredInput()}
								>
									{SlideshowPreview.getValues().map((value, index) => (
										<MenuItem value={value} key={index}>
											{SlideshowPreviewText[value]}
										</MenuItem>
									))}
								</Select>
								<UploadButton
									name="previewImage"
									label="Фото помещения с экраном"
									onChange={(name: string, value: string) => {
										setFieldValue(name, value);
									}}
									value={values.previewImage}
								/>
								<Input label="Пароль" name="password" placeholder="Пароль" />
								<Select label="Радиостанция" name="radiostation">
									{SlideshowRadiostation.getValues().map((value, index) => (
										<MenuItem value={value} key={index}>
											{SlideshowRadiostationText[value]}
										</MenuItem>
									))}
								</Select>
								<Slider
									label="Громкость радиостанции"
									value={values.radioVolume}
									onChange={this.handleRadioVolumeChange}
									step={volumeStep}
									max={1}
								/>
								<Input
									label="Адрес размещения"
									name="address"
									placeholder="Адрес"
									validate={checkIsValidAddress}
									inputProps={{
										id: 'suggestAddress',
										onChange: this.handleAddressInputChange,
									}}
									onKeyPress={this.handleAddressInputKeyPress}
								/>
								<Map
									onLoad={(ymaps) => {
										this.ymaps = ymaps;

										const suggestView = new ymaps.SuggestView('suggestAddress');

										this.setCoordinates();

										suggestView.events.add(
											'select',
											this.handleAddressSelectChange,
										);
									}}
									defaultState={{center: coordinates, zoom: 9}}
									state={{center: coordinates, zoom: 15}}
									modules={['geocode', 'SuggestView']}
									width="100%"
									onClick={this.handleAddressMapClick}
								>
									<Placemark
										geometry={coordinates}
										defaultOptions={{draggable: true}}
										onDragEnd={this.handleAddressPlacemarkDragEnd}
									/>
								</Map>
								<Typography variant="h6">Дополнительные шрифты</Typography>{' '}
								<Button onClick={this.handleClick}>
									<AddIcon />
								</Button>
								<Menu
									id="font-menu"
									anchorEl={this.state.anchorEl}
									keepMounted
									open={Boolean(this.state.anchorEl)}
									onClose={this.handleClose}
								>
									<label>
										<MenuItem onClick={this.handleClose}>
											<ListItemIcon>
												<Icon size={1} path={mdiUpload} />
											</ListItemIcon>
											<ListItemText primary="На компьютере" />
										</MenuItem>

										<input
											className={classes.input}
											onChange={this.handleFileChange}
											type="file"
										/>
									</label>

									<MenuItem onClick={this.handleSelectGoogleFont}>
										<ListItemIcon>
											<Icon size={1} path={mdiGoogleDrive} />
										</ListItemIcon>
										<ListItemText primary="Шрифт Google" />
									</MenuItem>
								</Menu>
								<div className={classes.fontsList}>
									<List dense={true}>
										{values.additionalFonts?.map?.((item) => (
											<ListItem>
												<ListItemText
													primary={item.name}
													secondary={item.type}
													primaryTypographyProps={{
														style: {fontFamily: item.name},
													}}
												/>
												<ListItemSecondaryAction>
													<IconButton
														edge="end"
														aria-label="delete"
														onClick={this.handleRemoveFont(item.name)}
													>
														<DeleteIcon />
													</IconButton>
												</ListItemSecondaryAction>
											</ListItem>
										))}
									</List>
								</div>
							</SlideShowBasePanel>
						</Form>
					);
				}}
			/>
		);
	}
}

export default withTracker(() => {
	const subGroups = Meteor.subscribe(publishNames.group.groups).ready();
	const groups = Group.find().fetch();
	let loading = !subGroups;
	let systemGroups: ISystemGroup[] = [];
	if (checkAdmin()) {
		const subGroupsSystem = Meteor.subscribe(publishNames.system_group.groups).ready();
		systemGroups = SystemGroup.find({}, {sort: {order: 1}}).fetch();
		loading = !subGroupsSystem || !subGroups;
	}

	return {groups, systemGroups, loading};
})(
	withStyles(styles)(
		connect(null, {
			updateSlideshowParams,
		})(SlideShowEditorSettingsPanel),
	),
);
