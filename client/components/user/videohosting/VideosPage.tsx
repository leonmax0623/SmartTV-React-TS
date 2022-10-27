import React, {useState} from 'react';
import {withTracker} from 'react-meteor-data-with-tracker';
import {Box, Container, Grid} from '@material-ui/core';
import ContentLoader from 'react-content-loader';
import ButtonCustom from 'client/components/common/ui/ButtonCustom';
import PlusIcon from 'client/components/common/icons/PlusIcon';
import routerUrls from 'client/constants/routerUrls';
import {Redirect, useHistory} from 'react-router-dom';
import {publishNames} from 'shared/constants/publishNames';
import {IVideoHosting, VideoHosting} from 'shared/collections/VideoHosting';
import VideoCard from 'client/components/user/videohosting/VideoCard';
import {methodNames} from 'shared/constants/methodNames';
import ConfirmDialog from 'client/components/common/ui/ConfirmDialog';
import VideoRenameDialog from 'client/components/user/videohosting/VideoRenameDialog';
import Snack from 'client/components/common/ui/Snack';
import {PaidServiceOrder, PaidServicePackagesEnum} from 'shared/collections/PaidServices';
import VimeoVideoDialog from 'client/components/user/videohosting/VimeoVideoDialog';

interface IVideosPageData {
	loading: boolean;
	userVideos: IVideoHosting[];
	permissions: PaidServicePackagesEnum[];
}

const VideosPage: React.FC<IVideosPageData> = ({loading, userVideos, permissions}) => {
	if (loading) {
		return (
			<Container style={{maxWidth: '1440px'}}>
				<Box mt={1.5}>
					<ContentLoader viewBox="0 0 720 650" height={700} width="100%">
						<rect x="0" y="0" rx="5" ry="5" width="74%" height="36" />
						<rect x="78%" y="0" rx="5" ry="5" width="22%" height="36" />
						<rect x="0" y="56" rx="5" ry="5" width="24%" height="357" />
						<rect x="25%" y="56" rx="5" ry="5" width="24%" height="357" />
						<rect x="50%" y="56" rx="5" ry="5" width="24%" height="357" />
						<rect x="75%" y="56" rx="5" ry="5" width="24%" height="357" />
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
	const [error, setError] = useState('');
	const [deleteData, setDeleteData] = useState({
		isOpened: false,
		id: '',
	});
	const [renameData, setRenameData] = useState<{isOpened: boolean; video: IVideoHosting | null}>({
		isOpened: false,
		video: null,
	});

	const onSnackErrorClose = () => {
		setError('');
	};

	const handleRemoveClick = (id: string) => {
		setDeleteData({
			id,
			isOpened: true,
		});
	};

	const handleCancelRemove = () => {
		setDeleteData({
			isOpened: false,
			id: '',
		});
	};

	const handleRemoveItem = () => {
		removeItem(deleteData.id);
		handleCancelRemove();
	};

	const handleAddClick = () => {
		history.push(routerUrls.userVideoHostingAdd);
	};
	const removeItem = (id: string) => {
		if (!id) return;
		Meteor.call(
			methodNames.videoHosting.removeVideo,
			{videoId: id},
			(errorResponse: Meteor.Error) => {
				if (errorResponse) {
					setError(errorResponse.reason || errorResponse.message);
				}
			},
		);
	};
	const handleRenameClick = (video: IVideoHosting) => {
		if (!video) return;
		setRenameData({
			video,
			isOpened: true,
		});
	};
	const handleCloseRename = () => {
		setRenameData({
			isOpened: false,
			video: null,
		});
	};

	const [selectedVideo, setSelectedVideo] = useState({
		video: '',
		title: '',
	});
	const handleCloseVideoDialog = (): void => {
		setSelectedVideo({
			video: '',
			title: '',
		});
	};
	const handleOpenVideoDialog = (video: string, title: string): void => {
		setSelectedVideo({
			video,
			title,
		});
	};

	return (
		<Container style={{maxWidth: '1440px'}}>
			{userVideos && userVideos.length ? (
				<Box>
					<Box display="flex" mt={1.5} mb={2.5}>
						<Box fontSize={20} lineHeight={1.4} flexGrow={1} fontWeight={600}>
							Видеохостинг
						</Box>
						<Box flexGrow={0}>
							<ButtonCustom onClick={handleAddClick}>
								<Box mr={1.5}>
									<PlusIcon
										style={{width: '11px', height: '11px'}}
										viewBox="0 0 10 10"
										fill="none"
										pathProps={{fill: 'white'}}
									/>
								</Box>
								<Box style={{textTransform: 'uppercase'}}>Добавить видео</Box>
							</ButtonCustom>
						</Box>
					</Box>
					<Grid container spacing={3}>
						{userVideos.map((userVideo) => {
							return (
								<Grid key={userVideo._id} item lg={3} md={4} sm={6} xs={12}>
									<VideoCard
										title={userVideo.name}
										onOpen={() =>
											handleOpenVideoDialog(userVideo.link, userVideo.name)
										}
										previewUrl={userVideo.thumbnail}
										active={userVideo.vimeoVideoProcessed}
										duration={userVideo.duration}
										onRemove={() => handleRemoveClick(userVideo._id)}
										onRename={() => handleRenameClick(userVideo)}
									/>
								</Grid>
							);
						})}
					</Grid>
				</Box>
			) : (
				<Box
					display="flex"
					flexDirection="column"
					justifyContent="center"
					alignItems="center"
					pt={16}
					pb={16}
				>
					<Box
						mb={3}
						color="rgba(0, 0, 0, 0.6)"
						fontSize={20}
						lineHeight={1.4}
						fontWeight={600}
					>
						Добавьте свое первое видео
					</Box>
					<ButtonCustom onClick={handleAddClick}>
						<Box mr={1.5}>
							<PlusIcon
								style={{width: '11px', height: '11px'}}
								viewBox="0 0 10 10"
								fill="none"
								pathProps={{fill: 'white'}}
							/>
						</Box>
						<Box style={{textTransform: 'uppercase'}}>Добавить видео</Box>
					</ButtonCustom>
				</Box>
			)}
			<ConfirmDialog
				isOpen={deleteData.isOpened}
				title="Действительно хотите удалить видео?"
				onConfirm={handleRemoveItem}
				onCancel={handleCancelRemove}
			/>
			<VideoRenameDialog
				isOpened={renameData.isOpened}
				onClose={handleCloseRename}
				video={renameData.video}
			/>
			<Snack
				isOpened={!!error}
				message={error}
				onClose={onSnackErrorClose}
				severity="error"
			/>
			<VimeoVideoDialog
				video={selectedVideo.video}
				title={selectedVideo.title}
				onClose={handleCloseVideoDialog}
				isOpened={!!selectedVideo.video}
			/>
		</Container>
	);
};

export default withTracker(() => {
	const videoHostingSubscriber = Meteor.subscribe(publishNames.videoHosting.videos).ready();
	const psoSubscriber = Meteor.subscribe(publishNames.paidServices.orders).ready();
	const loading = !videoHostingSubscriber || !psoSubscriber;
	const userVideos = VideoHosting.find().fetch();
	const pso = PaidServiceOrder.findOne();
	const permissions: string[] = pso?.permissions || [];

	return {
		loading,
		userVideos,
		permissions,
	};
})(VideosPage);
