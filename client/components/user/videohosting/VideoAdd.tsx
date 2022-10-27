import React, {ChangeEvent, useState} from 'react';
import {withTracker} from 'react-meteor-data-with-tracker';
import {Meteor} from 'meteor/meteor';
import {Box, Container, TextField} from '@material-ui/core';
import UploadVideo from 'client/components/common/ui/video/UploadVideo';
import ButtonCustom from 'client/components/common/ui/ButtonCustom';
import {methodNames} from 'shared/constants/methodNames';
import {useHistory} from 'react-router-dom';
import {Redirect} from 'react-router-dom';
import routerUrls from 'client/constants/routerUrls';
import {publishNames} from 'shared/constants/publishNames';
import {PaidServiceOrder, PaidServicePackagesEnum} from 'shared/collections/PaidServices';
import ContentLoader from 'react-content-loader';
const errorMessages = {
	name: 'Введите название',
	video: 'Выберите файл',
};

interface VideoAddProps {
	loading: boolean;
	permissions: PaidServicePackagesEnum[];
}

const VideoAdd: React.FC<VideoAddProps> = ({loading: rootLoading, permissions}) => {
	if (rootLoading) {
		return (
			<Container style={{maxWidth: '1440px'}}>
				<Box mt={1.5}>
					<ContentLoader viewBox="0 0 720 650" height={700} width="100%">
						<rect x="0" y="0" rx="5" ry="5" width="100%" height="36" />
						<rect x="0" y="46" rx="5" ry="5" width="48%" height="80" />
						<rect x="52%" y="46" rx="5" ry="5" width="48%" height="80" />
					</ContentLoader>
				</Box>
			</Container>
		);
	}

	if (
		!(Array.isArray(permissions) ? permissions : []).includes(
			PaidServicePackagesEnum.VIDEO_HOSTING,
		)
	) {
		return <Redirect to={routerUrls.userPlan} />;
	}

	const history = useHistory();
	const [errors, setErrors] = useState({
		name: '',
		video: '',
		message: '',
	});
	const [loading, setLoading] = useState();
	const [loadingPercent, setLoadingPercent] = useState(0);
	const [video, setVideo] = useState();
	const [name, setName] = useState('');

	const handleSelectVideo = (file: File) => {
		setVideo(file);
		setErrors({...errors, video: file ? '' : errorMessages.video});
	};
	const onNameChange = (e: ChangeEvent<HTMLInputElement>) => {
		setName(e.target.value);
	};

	const isValid = () => {
		setErrors({
			...errors,
			name: !name ? errorMessages.name : '',
			video: !video ? errorMessages.video : '',
		});

		return name && video;
	};

	const saveUserVideo = (uri: string, link: string) => {
		const uriSplit = String(uri).split('/');
		const videoId = Number(uriSplit[uriSplit.length - 1]);
		if (!videoId) {
			alert('Ошибка сохранения видео');
			setLoading(false);
			return;
		}
		Meteor.call(
			methodNames.videoHosting.saveVideo,
			{videoId, name, link, size: video.size},
			(error: Error | Meteor.Error) => {
				setLoading(false);
				if (error) {
					setErrors({
						...errors,
						message: error.message,
					});
				}
				history.push(routerUrls.userVideoHosting);
			},
		);
	};

	const uploadVideoToVimeo = (uploadLink: string, uri: string, link: string, file: File) => {
		const request = new XMLHttpRequest();

		request.upload.onprogress = (e) => {
			setLoadingPercent((e.loaded / e.total) * 100);
		};

		request.onload = () => {
			saveUserVideo(uri, link);
		};

		request.onerror = () => {
			alert('При загрузке видео произошла ошибка');
		};

		request.open('PATCH', uploadLink);
		request.setRequestHeader('Content-Type', 'application/offset+octet-stream');
		request.setRequestHeader('Tus-Resumable', '1.0.0');
		request.setRequestHeader('Upload-Offset', '0');

		request.withCredentials = false;

		request.send(file);
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (!isValid()) return;
		const size = video?.size;
		if (!size) return;
		setLoading(true);
		Meteor.call(
			methodNames.videoHosting.createVideo,
			{size, name},
			(error: Error | Meteor.Error, response: {uploadLink: string; uri: string}) => {
				if (error) {
					setLoading(false);

					setErrors({
						...errors,
						message: error.message,
					});

					return;
				}
				const err = response.error;
				if (err) {
					if (err.name) {
						setErrors({
							...errors,
							name: err.name,
						});
					}
					if (err.video) {
						setErrors({
							...errors,
							video: err.video,
						});
					}

					return;
				}
				const uploadLink = response?.uploadLink;
				const uri = response?.uri;
				const link = response?.link;

				if (!uploadLink || !uri || !link) {
					setErrors({
						...errors,
						message: 'Ошибка создания видео. Попробуйте позднее',
					});

					return;
				}

				uploadVideoToVimeo(uploadLink, uri, link, video);
			},
		);
	};

	return (
		<Container style={{maxWidth: '780px'}}>
			<form onSubmit={handleSubmit}>
				<Box display="flex" mt={1.5} mb={2.5}>
					<Box
						fontSize={20}
						lineHeight={1.4}
						flexGrow={1}
						fontWeight={600}
						textAlign="center"
					>
						Добавление видео
					</Box>
				</Box>
				<Box mb={3}>
					<TextField
						onChange={onNameChange}
						value={name}
						fullWidth
						name="name"
						placeholder="Название"
						error={!!errors.name}
						helperText={errors.name}
						disabled={loading}
						autoComplete="off"
					/>
				</Box>
				<Box mb={3}>
					<UploadVideo
						loading={loading}
						loadingPercent={loadingPercent}
						onSelect={handleSelectVideo}
						error={errors.video}
					/>
				</Box>
				<Box mb={3} textAlign="center">
					<ButtonCustom type="submit" disabled={loading}>
						Загрузить
					</ButtonCustom>
				</Box>
			</form>
		</Container>
	);
};

export default withTracker(() => {
	const psoSubscriber = Meteor.subscribe(publishNames.paidServices.orders).ready();
	const loading = !psoSubscriber;
	const pso = PaidServiceOrder.findOne();
	const permissions: string[] = pso?.permissions || [];

	return {
		loading,
		permissions,
	};
})(VideoAdd);
