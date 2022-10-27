import * as React from 'react';
import YouTube from 'react-youtube';
import * as Axios from 'axios';

import {SlideElementVideoTypeEnum} from 'shared/collections/SlideElements';
import {methodNames} from 'shared/constants/methodNames';
import {appConfig} from 'client/constants/config';
import css from './BackgroundVideo.pcss';
import {IResponseSuccess, IResponseError} from 'shared/models/Response';

interface IBackgroundVideoProps {
	youtubeIdOrUrl: string;
	width: number;
	height: number;
	editor?: boolean;
	transform?: string;
}

interface IYoutubeResponse {
	items: {id: {videoId: string}}[];
}

interface IBackgroundVideoState {
	videoIds: string[];
	playlistId?: string;
}

const axios = Axios.default;

export default class BackgroundVideo extends React.PureComponent<
	IBackgroundVideoProps,
	IBackgroundVideoState
> {
	state: IBackgroundVideoState = {videoIds: []};
	player?: YT.Player;

	componentDidMount() {
		this.updateView();
	}

	componentDidUpdate(
		prevProps: Readonly<IBackgroundVideoProps>,
		prevState: Readonly<IBackgroundVideoState>,
	) {
		const {youtubeIdOrUrl} = this.props;

		if (youtubeIdOrUrl !== prevProps.youtubeIdOrUrl) {
			this.updateView();
		}
	}

	getVideoType = (url: string) =>
		/channel/.test(url) ? SlideElementVideoTypeEnum.CHANNEL : SlideElementVideoTypeEnum.MOVIE;

	updateView = () => {
		const {youtubeIdOrUrl} = this.props;

		if (!youtubeIdOrUrl) {
			return;
		}

		switch (this.getVideoType(youtubeIdOrUrl)) {
			case SlideElementVideoTypeEnum.CHANNEL:
				this.getChannelData();
				break;

			case SlideElementVideoTypeEnum.MOVIE:
			default:
				const videoId = this.urlToId(youtubeIdOrUrl);
				const playlistId = this.urlToListId(youtubeIdOrUrl);

				if (playlistId) {
					this.setState({playlistId, videoIds: []});
				} else if (videoId) {
					this.setState({
						playlistId: undefined,
						videoIds: [videoId],
					});
				}
		}
	};

	getChannelData = () => {
		const {youtubeIdOrUrl} = this.props;
		const videoItemCount = 50;
		Meteor.call(
			methodNames.videoHosting.getChanelId,
			youtubeIdOrUrl,
			(errorData: Error | Meteor.Error, response: IResponseError | IResponseSuccess) => {
				const channelId = response;
				axios
					.get<IYoutubeResponse>(`https://www.googleapis.com/youtube/v3/search`, {
						params: {
							channelId: channelId,
							key: appConfig.GOOGLE_API_KEY,
							part: 'snippet',
							maxResults: '50',
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
					});
				if (errorData) {
					console.log(errorData.message);
					return;
				}
			},
		);
	};

	urlToId = (url: string) => {
		const videoIdMatch = url.match(/v=([\w_-]+)/);

		if (videoIdMatch && videoIdMatch.length === 2) {
			return videoIdMatch[1];
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
		const url = this.props.youtubeIdOrUrl;
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
	};

	render() {
		const {width, height, editor, transform, youtubeIdOrUrl} = this.props;
		const {videoIds, playlistId} = this.state;

		if (!youtubeIdOrUrl) {
			return 'Выберите видео для показа плеера.';
		}

		return (
			<div
				style={
					editor
						? {width, height, transform, position: 'absolute', left: '50%', top: '50%'}
						: {}
				}
			>
				{(videoIds.length > 0 || playlistId) && (
					<YouTube
						videoId={videoIds[0]}
						onReady={this.handleOnReady}
						ref={(el: YouTube) => {
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
								iv_load_policy: 3,
								modestbranding: 1,
								rel: 0,
								showinfo: 0,
								list: playlistId,
								listType: 'playlist',
								// Для зацикливание одиночного видео нужно указать ID видео
								// в плейлисте. Для остальных улучаев убираем 1 видео
								// чтобы не было дублирования.
								playlist:
									videoIds.length === 1
										? videoIds[0]
										: videoIds.slice(1).join(','),
								fs: 0,
								loop: 1,
								origin: window.location.origin,
							},
						}}
						className={css.youtube}
					/>
				)}
			</div>
		);
	}
}
