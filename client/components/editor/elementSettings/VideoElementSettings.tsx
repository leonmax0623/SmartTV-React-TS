import {Meteor} from 'meteor/meteor';
import * as React from 'react';
import {connect} from 'react-redux';
import {withTracker} from 'react-meteor-data-with-tracker';

import * as axios from 'axios';

import {updateSlideElement} from 'client/actions/slideShowEditor';
import {
	ISlideElement,
	SlideElementLogoPositionEnum,
	SlideElementVideoDisplayEnum,
	SlideElementVideoDisplayEnumDisplay,
	SlideElementVideoProviderDisplayEnum,
	SlideElementVideoProviderEnum,
	SlideElementVideoTypeEnum,
} from 'shared/collections/SlideElements';
import EditorTextInput from '../formFields/EditorTextInput';
import EditorImage from '../formFields/EditorImage';
import EditorSelect from '../formFields/EditorSelect';
import EditorActionButtonsCommon from '../formFields/EditorActionButtonsCommon';
import OpacityField from '../settingsFields/OpacityField';
import EditorCheckbox from '../formFields/EditorCheckbox';
import PermanentElementField from '../settingsFields/PermanentElementField';
import ElementSettingsWrapper from 'client/components/common/ElementSettingsWrapper';
import EditorFieldLabel from 'client/components/editor/formFields/EditorFieldLabel';
import {Link} from 'react-router-dom';
import routerUrls from 'client/constants/routerUrls';
import ToggleBoxGroup from 'client/components/common/ToggleBox/ToggleBoxGroup';
import {Box, CircularProgress} from '@material-ui/core';
import LockIcon from 'client/components/common/icons/LockIcon';
import {publishNames} from 'shared/constants/publishNames';
import {IVideoHosting, VideoHosting} from 'shared/collections/VideoHosting';
import {methodNames} from 'shared/constants/methodNames';
import {PaidServicePackagesEnum} from 'shared/collections/PaidServices';
import RotateAngleField from 'client/components/editor/settingsFields/RotateAngleField';

interface IVideoElementSettingsProps {
	element: ISlideElement;
	updateSlideElement: typeof updateSlideElement;
}
interface IVideoElementSettingsData {
	loading: boolean;
	vimeoVideos: IVideoHosting[];
}
interface IVideoElementSettingsState {
	isVideoHostingGranted: boolean;
	isErrorMessage: string;
}

class VideoElementSettings extends React.PureComponent<
	IVideoElementSettingsProps & IVideoElementSettingsData & IVideoElementSettingsState
> {
	state: IVideoElementSettingsState = {
		isVideoHostingGranted: false,
		isErrorMessage: '',
	};
	componentDidMount() {
		this.setState({
			isVideoHostingGranted: false,
		});
		Meteor.call(
			methodNames.paidServices.isGranted,
			[PaidServicePackagesEnum.VIDEO_HOSTING],
			(error: Error | Meteor.Error, response: boolean) => {
				this.setState({
					isVideoHostingGranted: !!response[PaidServicePackagesEnum.VIDEO_HOSTING],
				});
			},
		);
	}

	isChannel = (link: string) => {
		// To get the channel name or channel id from a youtube URL use: (NOT TESTED PROPERLY)
		// (?:https|http)\:\/\/(?:[\w]+\.)?youtube\.com\/(?:c\/|channel\/|user\/)?([a-zA-Z0-9\-]{1,})

		const regex = /^https?:\/\/(www\.)?youtube\.com\/(channel\/UC[\w-]{21}[AQgw]|(c\/|user\/)?[\w-]+)(\/)?$/;
		return regex.test(link);
	};

	handleYTVideoLinkChange = (value?: string) => {
		if (!value) {
			this.setState({
				isErrorMessage: 'Введите ссылку',
			});
			return;
		}

		const {element} = this.props;
		const isCorrectLink =
			/channel/.test(value) ||
			/v=([\w_-]+)/.test(value) ||
			/c/.test(value) ||
			/user/.test(value) ||
			/https:\/\/youtu.be\/([\w_-]+)/.test(value) ||
			/list=([\w_-]+)/.test(value);

		if (isCorrectLink) {
			this.setState({
				isErrorMessage: '',
			});
			this.props.updateSlideElement(element, {
				videoLink: value,
				videoType:
					value && this.isChannel(value)
						? SlideElementVideoTypeEnum.CHANNEL
						: SlideElementVideoTypeEnum.MOVIE,
			});
		} else {
			this.setState({
				isErrorMessage: 'Неверный формат ссылки на видео',
			});
		}
	};

	handleVideoDisplayChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
		const {element} = this.props;

		this.props.updateSlideElement(element, {
			videoDisplay: event.target.value as SlideElementVideoDisplayEnum,
		});
	};

	handleLogoPositionChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
		const {element} = this.props;

		this.props.updateSlideElement(element, {
			logoPosition: event.target.value,
		});
	};

	handleLogoImageChange = (image: string) => {
		const {element} = this.props;
		this.props.updateSlideElement(element, {videoLogo: image});
	};

	changeUpdateAspectRatio = (e: {target: {value: string; checked: boolean}}) => {
		const {checked} = e.target;
		this.props.updateSlideElement(this.props.element, {retainAspectRatio: checked});
	};

	changeBlockTransition = (e: {target: {value: string; checked: boolean}}) => {
		const {checked} = e.target;
		this.props.updateSlideElement(this.props.element, {blockTransition: checked});
	};

	handleVideoItemCountChange = (value?: string) => {
		const {element} = this.props;

		this.props.updateSlideElement(element, {
			videoItemCount: Number(value),
		});
	};

	isCorrectLink = () => {
		// TODO. Build a proper check
		const {element} = this.props;
		return !(
			element.videoLink &&
			(/channel/.test(element.videoLink) ||
				/v=([\w_-]+)/.test(element.videoLink) ||
				/c/.test(element.videoLink) ||
				/user/.test(element.videoLink) ||
				/https:\/\/youtu.be\/([\w_-]+)/.test(element.videoLink) ||
				/list=([\w_-]+)/.test(element.videoLink))
		);
	};

	handleVideoItemProviderChange = (videoProvider?: SlideElementVideoProviderEnum) => {
		if (!videoProvider) return;
		const {element} = this.props;
		this.props.updateSlideElement(element, {
			videoLink: '',
			videoProvider: videoProvider as SlideElementVideoProviderEnum,
		});
		if (videoProvider === SlideElementVideoProviderEnum.VK) {
			this.props.updateSlideElement(element, {
				width: 853,
				height: 480,
			});
		} else {
			this.props.updateSlideElement(element, {
				width: 800,
				height: 450,
			});
		}
	};

	handleVimeoVideoChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
		const {element} = this.props;
		this.props.updateSlideElement(element, {
			videoLink: '',
		});
	};

	handleVkVideoLinkChange = (value?: string) => {
		// Remove youtube Logo
		if (!value) {
			this.setState({
				isErrorMessage: 'Введите ссылку',
			});
			return;
		}

		if (value === this.props.element.videoLink) {
			this.setState({
				isErrorMessage: '',
			});
			return;
		}

		const {element} = this.props;
		const regex = /(video|clip)?(.([\d]+)_(\d+))/i;
		const isCorrectLink = regex.test(value);
		if (isCorrectLink) {
			this.setState({
				isErrorMessage: '',
			});
			Meteor.call(methodNames.vk.getVideo, value, (err: any, video: any) => {
				if (!err && video) {
					this.props.updateSlideElement(element, {
						videoLink: value,
						videoType: SlideElementVideoTypeEnum.MOVIE,
						vkVideoAlbumId: video[0].id,
						vkVideo: video,
					});
				} else {
					console.log(err);
					if (err.reason) {
						this.setState({isErrorMessage: err.reason});
					} else {
						this.setState({isErrorMessage: err.error});
					}
				}
			});
		} else {
			this.setState({
				isErrorMessage: 'Неверный формат ссылки на видео',
			});
		}
	};

	render() {
		const {element, vimeoVideos, loading} = this.props;
		const helperText = this.state.isErrorMessage !== '' ? this.state.isErrorMessage : '';
		const error = !!helperText;
		const vimeoVideoSelect = vimeoVideos.map((vimeoVideo) => ({
			label: vimeoVideo.name,
			value: vimeoVideo.link,
		}));
		const {isVideoHostingGranted} = this.state;
		const lockIcon = (
			<LockIcon
				viewBox="0 0 11 14"
				style={{width: '11px', height: '14px'}}
				fill="none"
				pathProps={{
					fill: 'black',
					fillOpacity: '0.54',
				}}
			/>
		);

		return (
			<ElementSettingsWrapper elementId={element._id}>
				<EditorFieldLabel
					tooltip={
						<div>
							Загрузка видео через vimeo - платный функционал. Ознакомьтесь с тарифами
							на странице{' '}
							<Link to={routerUrls.userPlan} target="_blank" style={{color: '#ffff'}}>
								“Мой тариф”
							</Link>
						</div>
					}
					tooltipProps={{interactive: true}}
				>
					Видео-хостинг
				</EditorFieldLabel>
				<Box display="flex" justifyContent="center" mb={3}>
					<ToggleBoxGroup
						name="provider"
						value={element.videoProvider || SlideElementVideoProviderEnum.YOUTUBE}
						data={[
							{
								value: SlideElementVideoProviderEnum.YOUTUBE,
								label: SlideElementVideoProviderDisplayEnum.YOUTUBE,
							},
							{
								value: SlideElementVideoProviderEnum.VK,
								label: SlideElementVideoProviderDisplayEnum.VK,
							},
							{
								value: isVideoHostingGranted
									? SlideElementVideoProviderEnum.VIMEO
									: '#',
								label: SlideElementVideoProviderDisplayEnum.VIMEO,
								disabled: !isVideoHostingGranted,
								icon: !isVideoHostingGranted ? lockIcon : <></>,
							},
						]}
						onChange={this.handleVideoItemProviderChange}
					/>
				</Box>

				{element.videoProvider === SlideElementVideoProviderEnum.VIMEO && (
					<div>
						{loading ? (
							<CircularProgress />
						) : (
							<EditorSelect
								label="Видео"
								options={vimeoVideoSelect}
								onChange={this.handleVimeoVideoChange}
								value={element.videoLink}
							/>
						)}
					</div>
				)}
				{element.videoProvider === SlideElementVideoProviderEnum.YOUTUBE && (
					<EditorTextInput
						label="Ссылка на видео, плэйлист или канал"
						value={element.videoLink}
						onChange={this.handleYTVideoLinkChange}
						tooltip={
							<div>
								Поддерживаемые форматы:
								<br />
								Ссылка на канал
								https://www.youtube.com/channel/UCSyg9cb3Iq-NtlbxqNB9wGw
								<br />
								Ид канала watch?v=Sw3B6MQMjSU
								<br />
								Короткая ссылка https://youtu.be/9F8Oh4SX_xw
								<br />
								Обычная ссылка https://www.youtube.com/watch?v=YqeW9_5kURI
								<br />
								Плейлист
								https://www.youtube.com/playlist?list=PLyFnbgoS1oYc_D7rRQWKYzAaTt7wbkoZL
								<br />
								Встроенная ссылка
								https://www.youtube.com/embed/videoseries?list=PLh_0hw-7CaS9Q0QZQ0IFsAawORIxeRzli
							</div>
						}
						error={error}
						helperText={helperText}
					/>
				)}
				{element.videoProvider === SlideElementVideoProviderEnum.VK && (
					<EditorTextInput
						label="Ссылка на видео"
						value={element.videoLink}
						onChange={this.handleVkVideoLinkChange}
						tooltip={
							<div>
								<p>Поддерживаемые форматы:</p>
								<br />
								<p>https://vk.com/video-00000000_000000000</p>
								<br />
								<p>
									https://vk.com/group_name?z=video-00000000_000000000%2Fvideos-00000000%2Fpl_-00000000_-2
								</p>
								<br />
								<p>https://vk.com/clips-00000000?z=clip-00000000_000000000</p>
							</div>
						}
						error={error}
						helperText={helperText}
					/>
				)}

				{element.videoType === SlideElementVideoTypeEnum.CHANNEL && (
					<EditorTextInput
						label="Количество роликов"
						type="number"
						inputProps={{min: 1, max: 50}}
						value={element.videoItemCount || 1}
						onChange={this.handleVideoItemCountChange}
					/>
				)}

				{(element.videoProvider === SlideElementVideoProviderEnum.YOUTUBE ||
					element.videoProvider === SlideElementVideoProviderEnum.VIMEO) && (
					<EditorSelect
						label="Отображение"
						options={[
							{
								label: SlideElementVideoDisplayEnumDisplay.NONE,
								value: SlideElementVideoDisplayEnum.NONE,
							},
							{
								label: SlideElementVideoDisplayEnumDisplay.SILENT,
								value: SlideElementVideoDisplayEnum.SILENT,
							},
							{
								label: SlideElementVideoDisplayEnumDisplay.ONLY_SOUND,
								value: SlideElementVideoDisplayEnum.ONLY_SOUND,
							},
						]}
						onChange={this.handleVideoDisplayChange}
						value={element.videoDisplay || SlideElementVideoDisplayEnum.NONE}
					/>
				)}

				<EditorImage
					label="Логотип в углу"
					value={element.videoLogo}
					onChange={this.handleLogoImageChange}
				/>

				{element.videoLogo && (
					<EditorSelect
						label="Расположение логотипа"
						options={[
							{
								label: 'Верхний-левый угол',
								value: SlideElementLogoPositionEnum.TOPLEFT,
							},
							{
								label: 'Верхний-правый угол',
								value: SlideElementLogoPositionEnum.TOPRIGHT,
							},
							{
								label: 'Нижний-левый угол',
								value: SlideElementLogoPositionEnum.BOTTOMLEFT,
							},
							{
								label: 'Нижний-правый угол',
								value: SlideElementLogoPositionEnum.BOTTOMRIGHT,
							},
						]}
						onChange={this.handleLogoPositionChange}
						value={element.logoPosition}
					/>
				)}

				<EditorCheckbox
					label="Сохранить пропорции"
					tooltip="Если данная опция включена, при изменении размера элемента пропорции будут сохранены"
					value=""
					checked={element.retainAspectRatio}
					onChange={this.changeUpdateAspectRatio}
				/>

				<RotateAngleField element={element} />
				<OpacityField element={element} />

				<EditorActionButtonsCommon element={element} />
			</ElementSettingsWrapper>
		);
	}
}

export default withTracker((props: IVideoElementSettingsProps) => {
	const isVimeo = props.element.videoProvider === SlideElementVideoProviderEnum.VIMEO;
	let loading: boolean = false;
	let vimeoVideos: IVideoHosting[] = [];

	if (isVimeo) {
		const vimeoVideosTrackerSubscriber = Meteor.subscribe(publishNames.videoHosting.videos);
		loading = !vimeoVideosTrackerSubscriber;
		vimeoVideos = VideoHosting.find({vimeoVideoProcessed: true}).fetch();
	}

	return {
		vimeoVideos,
		loading,
		...props,
	};
})(connect(null, {updateSlideElement})(VideoElementSettings));
