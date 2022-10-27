import * as React from 'react';
import {connect} from 'react-redux';
import CircularProgress from '@material-ui/core/CircularProgress';
import cn from 'classnames';

import {updateSlideElement} from 'client/actions/slideShowEditor';
import {
	ISlideElement,
	SlideElementTrafficServiceEnum,
	SlideElementTrafficServiceEnumDisplay,
} from 'shared/collections/SlideElements';
import EditorTextInput from '../formFields/EditorTextInput';
import EditorActionButtonsCommon from '../formFields/EditorActionButtonsCommon';
import OpacityField from 'client/components/editor/settingsFields/OpacityField';
import PermanentElementField from '../settingsFields/PermanentElementField';
import ElementSettingsWrapper from 'client/components/common/ElementSettingsWrapper';
import EditorSelect from 'client/components/editor/formFields/EditorSelect';
import {appConfig} from 'client/constants/config';
import EditorAutocomplete, {
	IEditorAutocompleteOption,
} from 'client/components/editor/formFields/EditorAutocomplete';
import css from './TrafficElementSettings.pcss';
import RotateAngleField from 'client/components/editor/settingsFields/RotateAngleField';

interface ITextElementSettingsProps {
	element: ISlideElement;
	updateSlideElement: typeof updateSlideElement;
}

interface ITextElementSettingsState {
	address?: string;
	foundObjects: IEditorAutocompleteOption[] | [];
	addressLoading?: boolean;
}

interface ICityOption extends IEditorAutocompleteOption {
	location: {lan: string; lon: string};
}

class TrafficElementSettings extends React.PureComponent<
	ITextElementSettingsProps,
	ITextElementSettingsState
> {
	state: ITextElementSettingsState = {foundObjects: []};

	componentDidMount(): void {
		const {element} = this.props;

		if (element.location) {
			this.setState({address: element.location});

			if (!element.lat || !element.lon) {
				this.handleUpdateCoords(element.location);
			}
		}
	}

	componentDidUpdate(prevProps: Readonly<ITextElementSettingsProps>) {
		const {element} = this.props;

		if (element.location !== prevProps.element.location) {
			this.setState({address: element.location});
		}

		if (element.trafficService !== prevProps.element.trafficService) {
			if (!element.location) return;

			this.handleUpdateCoords(element.location);
		}
	}

	handleCityChange = (value: string) => {
		const {element} = this.props;

		this.setState({address: value, addressLoading: true});

		this.props.updateSlideElement(element, {
			location: value,
		});

		if (!value) return;

		this.handleUpdateCoords(value);
	};

	handleCityClear = () => {
		this.clearFoundObjects();
	};

	handleCitySelect = (option: ICityOption) => {
		const {element} = this.props;

		this.props.updateSlideElement(element, option.location);
	};

	handleAddressLoaderClick = () => this.setState({addressLoading: false});

	clearFoundObjects = () => this.setState({foundObjects: []});

	handleUpdateCoords = (location: string) => {
		const {element} = this.props;
		const {CITYGUIDE_ACCESS_KEY} = appConfig;
		const successStatus = 200;

		if (
			!element.trafficService ||
			element.trafficService === SlideElementTrafficServiceEnum.YANDEX
		) {
			HTTP.get(
				`https://geocode-maps.yandex.ru/1.x/?format=json&geocode=${location}&apikey=${appConfig.YANDEX_GEOCODER_API_KEY}`,
				// @ts-ignore
				(err, result) => {
					if (!err && result.data && result.statusCode === successStatus) {
						if (
							result.data.response &&
							result.data.response.GeoObjectCollection &&
							result.data.response.GeoObjectCollection.featureMember &&
							result.data.response.GeoObjectCollection.featureMember[0]
						) {
							const member =
								result.data.response.GeoObjectCollection.featureMember[0].GeoObject
									.Point.pos;
							const parts = member.split(' ');

							if (parts) {
								this.props.updateSlideElement(element, {
									lon: parts[0],
									lat: parts[1],
								});
							}
						} else {
							this.handleClearCords();
						}
					} else {
						this.handleClearCords();
					}

					this.setState({addressLoading: false});
				},
			);
		} else if (CITYGUIDE_ACCESS_KEY) {
			HTTP.post(
				'https://api.probki.net/search/settlementautocomplete',
				{
					data: {
						accessKey: CITYGUIDE_ACCESS_KEY,
						settlementFirstLetters: location,
						center: {
							lat: 55.755814,
							lon: 37.617635,
						},
						distanceInKm: 0,
					},
					timeout: 5000,
				},
				// @ts-ignore
				(err, result) => {
					if (!err && result.data && result.statusCode === successStatus) {
						const {settlements} = result.data;
						const city =
							settlements &&
							!!settlements.length &&
							(settlements.find(
								(s: {city: string; province: string}) =>
									~s.city.toLowerCase().indexOf(location.toLowerCase()) &&
									~s.province.toLowerCase().indexOf(location.toLowerCase()),
							) ||
								settlements.find(
									(s: {city: string}) =>
										~s.city.toLowerCase().indexOf(location.toLowerCase()),
								));

						if (city && !!city.location) {
							this.props.updateSlideElement(element, {
								lon: String(city.location.lon),
								lat: String(city.location.lat),
							});

							if (settlements.length > 1) {
								this.setState({
									foundObjects: settlements.map((s: any) => ({
										label: `${s.city}${s.province ? `, ${s.province}` : ''}${
											s.region ? `, ${s.region}` : ''
										}`,
										value: `${s.city}${s.province ? `, ${s.province}` : ''}${
											s.region ? `, ${s.region}` : ''
										}`,
										location: {
											lat: String(s.location.lat),
											lon: String(s.location.lon),
										},
									})),
								});
							} else {
								this.clearFoundObjects();
							}

							this.setState({addressLoading: false});
						} else {
							HTTP.post(
								'https://api.probki.net/search/geocode',
								{
									data: {
										accessKey: CITYGUIDE_ACCESS_KEY,
										address: location,
									},
								},
								// @ts-ignore
								(error, res) => {
									if (!error && res.data && res.statusCode === successStatus) {
										const {addresses} = res.data;

										if (addresses && addresses[0] && addresses[0].location) {
											this.props.updateSlideElement(element, {
												lon: String(addresses[0].location.lon),
												lat: String(addresses[0].location.lat),
											});

											if (addresses.length > 1) {
												this.setState({
													foundObjects: addresses.map((s: any) => ({
														label: `${s.city}
														${s.street ? `, ${s.street}` : ''}${s.house ? ` ${s.house}` : ''}
														${s.province ? `, ${s.province}` : ''}
														${s.region ? `, ${s.region}` : ''}`,
														value: `${s.city}${
															s.province ? `, ${s.province}` : ''
														}${s.region ? `, ${s.region}` : ''}`,
														location: s.location,
													})),
												});
											} else {
												this.clearFoundObjects();
											}
										} else {
											this.handleClearCords();
											this.clearFoundObjects();
										}

										this.setState({addressLoading: false});
									}
								},
							);
						}
					} else {
						this.handleClearCords();

						this.setState({addressLoading: false});
					}
				},
			);
		}
	};

	handleClearCords = () => {
		const {element} = this.props;

		this.props.updateSlideElement(element, {
			lon: '',
			lat: '',
		});
	};

	handleZoomChange = (value?: number) => {
		this.props.updateSlideElement(this.props.element, {
			zoom: value,
		});
	};

	handleTraficServiceChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
		const {element} = this.props;
		const {value: trafficService} = event.target as {
			value: SlideElementTrafficServiceEnum;
		};

		this.props.updateSlideElement(element, {trafficService});
	};

	render() {
		const {element} = this.props;
		const {address, foundObjects, addressLoading} = this.state;

		return (
			<ElementSettingsWrapper elementId={element._id}>
				<EditorSelect
					label="Сервис"
					options={[
						{
							label: SlideElementTrafficServiceEnumDisplay.YANDEX,
							value: SlideElementTrafficServiceEnum.YANDEX,
						},
						{
							label: SlideElementTrafficServiceEnumDisplay.CG,
							value: SlideElementTrafficServiceEnum.CG,
						},
					]}
					onChange={this.handleTraficServiceChange}
					value={element.trafficService || SlideElementTrafficServiceEnum.YANDEX}
				/>

				<div className={css.address}>
					<EditorAutocomplete
						options={foundObjects}
						label="Адрес"
						value={String(address)}
						onSuggChange={this.handleCityChange}
						onSuggClear={this.handleCityClear}
						onSuggSelect={this.handleCitySelect}
					/>

					<CircularProgress
						size={24}
						className={cn(css.addressLoader, {[css.isVisible]: addressLoading})}
						onClick={this.handleAddressLoaderClick}
					/>
				</div>

				<EditorTextInput
					label="Масштаб"
					value={element.zoom}
					onChange={this.handleZoomChange}
					type="number"
					inputProps={{max: 17, min: 1, step: 1}}
				/>
				<RotateAngleField element={element} />

				<OpacityField element={element} />
				<PermanentElementField element={element} />

				<EditorActionButtonsCommon element={element} />
			</ElementSettingsWrapper>
		);
	}
}

export default connect(null, {updateSlideElement})(TrafficElementSettings);
