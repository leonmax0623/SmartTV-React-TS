import * as React from 'react';
import cn from 'classnames';
import YouTube from 'react-youtube';
import * as Axios from 'axios';
import {CircularProgress} from '@material-ui/core';

import {
	SlideElementVideoDisplayEnum,
	SlideElementVideoTypeEnum,
} from 'shared/collections/SlideElements';
import {MessageType} from 'client/components/slideshow/SlideshowPage';
import {appConfig} from 'client/constants/config';
import css from './VideoWidget.pcss';
import {IVideoWidgetProps} from 'client/components/widgets/VideoWidget';
import {createLogger} from 'redux-logger';
import {methodNames} from 'shared/constants/methodNames';
import {IResponseSuccess, IResponseError} from 'shared/models/Response';

const axios = Axios.default;

interface IYoutubeResponse {
	items: {id: {videoId: string}}[];
}

interface IYoutubeWidgetState {
	videoIds: string[];
	playlistId?: string;
	startSlideTime: number;
}

class YoutubeWidget extends React.PureComponent<IVideoWidgetProps, IYoutubeWidgetState> {
	state: IYoutubeWidgetState = {videoIds: [], startSlideTime: +new Date()};
	player?: YT.Player;

	componentDidMount() {
		this.updateView();

		document.addEventListener('message', this.handleMessages);
		window.addEventListener('message', this.handleMessages);
	}

	componentDidUpdate(
		prevProps: Readonly<IVideoWidgetProps>,
		prevState: Readonly<IYoutubeWidgetState>,
	) {
		const {videoDisplay, videoLink} = this.props.element;

		if (videoLink !== prevProps.element.videoLink) {
			this.updateView();
		}

		if (videoDisplay !== prevProps.element.videoDisplay) {
			this.changeDisplay();
		}
	}

	componentWillUnmount() {
		document.removeEventListener('message', this.handleMessages);
		window.removeEventListener('message', this.handleMessages);
	}

	updateView = () => {
		const {videoLink, videoType} = this.props.element;

		if (!videoLink) {
			return;
		}

		switch (videoType) {
			case SlideElementVideoTypeEnum.CHANNEL:
				this.getChannelData();
				break;

			case SlideElementVideoTypeEnum.MOVIE:
			default:
				const videoId = this.urlToId(videoLink);
				const playlistId = this.urlToListId(videoLink);

				if (playlistId) {
					this.setState({playlistId, videoIds: []});
				} else if (videoId) {
					this.setState({
						startSlideTime: +new Date(),
						playlistId: undefined,
						videoIds: [videoId],
					});
				}
		}
	};

	getChannelData = () => {
		const {videoLink, videoItemCount} = this.props.element;
		Meteor.call(
			methodNames.videoHosting.getChanelId,
			videoLink,
			(errorData: Error | Meteor.Error, response: IResponseError | IResponseSuccess) => {
				const channelId = response;
				console.log({channelId});
				axios
					.get<IYoutubeResponse>(`https://www.googleapis.com/youtube/v3/search`, {
						params: {
							channelId: channelId,
							key: appConfig.GOOGLE_API_KEY,
							part: 'snippet',
							maxResults: videoItemCount,
							order: 'date',
							type: 'video',
						},
					})
					.then((res) => {
						const items = res.data.items;

						if (items) {
							this.setState({
								videoIds: items
									.slice(0, videoItemCount)
									.map(({id: {videoId}}) => videoId),
							});
						}
					})
					.catch((e) => {
						if (e.response) {
							console.log(e.response.data.error.message);
						} else {
							console.log('Error', e.message);
						}
					});
				if (errorData) {
					console.log(errorData.message);
					return;
				}
			},
		);
	};

	handleMessages = async (event: MessageEvent) => {
		const {
			element: {videoLink, videoType},
		} = this.props;
		const {data: messageCommand} = event;
		const seekStep = 10;

		if (!videoLink || !Object.values(MessageType).includes(messageCommand) || !this.player) {
			return;
		}

		const currentTime = await this.player.getCurrentTime();
		const allTime = await this.player.getDuration();

		switch (messageCommand) {
			case MessageType.SCROLL_FAST_FORWARD: {
				if (videoType === SlideElementVideoTypeEnum.CHANNEL || /list=/.test(videoLink)) {
					this.player.nextVideo();
				} else {
					const newTime = Math.min(currentTime + seekStep, allTime);

					this.player.seekTo(newTime, true);
				}

				break;
			}

			case MessageType.SCROLL_REWIND: {
				if (videoType === SlideElementVideoTypeEnum.CHANNEL || /list=/.test(videoLink)) {
					this.player.previousVideo();
				} else {
					const newTime = Math.max(0, currentTime - seekStep);

					this.player.seekTo(newTime, true);
				}

				break;
			}
		}
	};

	changeDisplay = () => {
		const {videoDisplay} = this.props.element;

		if (!this.player) {
			return;
		}

		if (videoDisplay === SlideElementVideoDisplayEnum.SILENT) {
			this.player.mute();
		} else {
			this.player.unMute();
		}
	};

	urlToId = (url: string) => {
		const videoIdMatch = url.match(/v=([\w_-]+)/);

		if (videoIdMatch && videoIdMatch.length === 2) {
			return videoIdMatch[1];
		} else {
			const videoIdMatch1 = url.match(/https:\/\/youtu.be\/([\w_-]+)/);
			if (videoIdMatch1 && videoIdMatch1.length === 2) {
				return videoIdMatch1[1];
			}
		}

		return undefined;
	};

	urlToListId = (url: string) => {
		const listIdMatch = url.match(/list=([\w_-]+)/);

		if (listIdMatch && listIdMatch.length === 2) {
			return listIdMatch[1];
		}

		return undefined;
	};

	handleOnReady = (event: {target: YT.Player}) => {
		const url = this.props.element.videoLink;
		const editor = this.props.editor;

		if (!url || editor) {
			return;
		}

		const listId = url.match(/list=([\w_-]+)/);

		if (listId && listId.length === 2) {
			event.target.loadPlaylist({list: listId[1]});
		} else {
			event.target.playVideo();
		}

		this.changeDisplay();
	};

	handleStateChange = (event: {target: YT.Player; data: YT.PlayerState}) => {
		const {startSlideTime} = this.state;
		const player = event.target;

		if (this.props.videoBlockTransition && player.getDuration) {
			const waitingMovieSeconds = (+new Date() - startSlideTime) / 1000;
			const maxWaitingSeconds = 30;

			this.props.videoBlockTransition({
				duration:
					waitingMovieSeconds <= maxWaitingSeconds
						? player.getDuration() + waitingMovieSeconds
						: 0, // after 30 seconds of waiting load movie this value is 0
			});
		}

		if (event.data === YT.PlayerState.ENDED) {
			if (this.props.videoBlockTransition) {
				this.props.videoBlockTransition({ended: true});
			}
		}
	};

	render() {
		const {editor, element} = this.props;
		const {width, height, videoLink} = element;
		const {videoIds, playlistId} = this.state;

		if (!videoLink) {
			return 'Выберите видео для показа плеера.';
		}

		return (
			<div>
				{(videoIds.length > 0 || playlistId) && (
					<YouTube
						videoId={videoIds[0]}
						onReady={this.handleOnReady}
						onStateChange={this.handleStateChange}
						ref={(el) => {
							this.player = ((el as unknown) as {
								internalPlayer: YT.Player;
							})?.internalPlayer;
						}}
						opts={{
							height: height.toString(),
							width: width.toString(),
							playerVars: {
								// https://developers.google.com/youtube/player_parameters
								autoplay: editor ? 0 : 1,
								controls: 0,
								list: playlistId,
								listType: 'playlist',
								playlist:
									videoIds.length === 1
										? videoIds[0]
										: videoIds.slice(0).join(','),
								iv_load_policy: 3,
								modestbranding: 1,
								rel: 0,
								showinfo: 0,
								fs: 0,
								loop: 1,
								origin: window.location.origin,
							},
						}}
					/>
				)}
				<div
					className={cn(css.loader, {
						[css.hidden]: videoIds.length > 0 || playlistId,
					})}
				>
					<CircularProgress />
				</div>
			</div>
		);
	}
}

export default YoutubeWidget;
