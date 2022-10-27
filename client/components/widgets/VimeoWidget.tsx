import * as React from 'react';
import Vimeo from '@u-wave/react-vimeo';
import {Player} from '@u-wave/react-vimeo';
import {IVideoWidgetProps} from 'client/components/widgets/VideoWidget';
import cn from 'classnames';
import css from 'client/components/widgets/VideoWidget.pcss';
import {CircularProgress} from '@material-ui/core';
import {MessageType} from 'client/components/slideshow/SlideshowPage';
import {SlideElementVideoDisplayEnum} from 'shared/collections/SlideElements';

interface IVimeoWidgetState {
	videoId?: number;
	startSlideTime: number;
}

interface IVimeoStateEvent {
	duration: number;
}

class VimeoWidget extends React.PureComponent<IVideoWidgetProps, IVimeoWidgetState> {
	state: IVimeoWidgetState = {
		startSlideTime: +new Date(),
	};
	iFrameRef: React.Ref<HTMLIFrameElement>;
	player?: Player;
	constructor(props: any) {
		super(props);
		this.iFrameRef = React.createRef();
	}
	componentDidMount() {
		document.addEventListener('message', this.handleMessages);
		window.addEventListener('message', this.handleMessages);
	}
	componentDidUpdate(
		prevProps: Readonly<IVideoWidgetProps>,
		prevState: Readonly<IVimeoWidgetState>,
	) {
		const {videoDisplay, videoLink} = this.props.element;

		if (videoLink !== prevProps.element.videoLink) {
			this.loadVideo();
		}

		if (videoDisplay !== prevProps.element.videoDisplay) {
			this.changeDisplay();
		}
	}

	loadVideo = () => {
		const {videoLink} = this.props.element;
		const player = this.player;
		if (!player || !videoLink) return;
		if (!this.isValidVimeoLink(videoLink)) return;

		player.loadVideo(videoLink);
	};

	isValidVimeoLink(link: string) {
		return /vimeo.com/.test(link);
	}

	componentWillUnmount() {
		document.removeEventListener('message', this.handleMessages);
		window.removeEventListener('message', this.handleMessages);
	}

	changeDisplay = () => {
		const {videoDisplay} = this.props.element;

		if (!this.player) {
			return;
		}

		if (videoDisplay === SlideElementVideoDisplayEnum.SILENT) {
			this.player.setMuted(true);
		} else {
			this.player.setMuted(false);
		}
	};

	handleMessages = async (event: MessageEvent) => {
		const {
			element: {videoLink},
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
				const newTime = Math.min(currentTime + seekStep, allTime);
				this.player.setCurrentTime(newTime);

				break;
			}

			case MessageType.SCROLL_REWIND: {
				const newTime = Math.max(0, currentTime - seekStep);
				this.player.setCurrentTime(newTime);

				break;
			}
		}
	};

	handleStateChange = (event: IVimeoStateEvent) => {
		const {startSlideTime} = this.state;

		if (this.props.videoBlockTransition && event.duration) {
			const waitingMovieSeconds = (+new Date() - startSlideTime) / 1000;
			const maxWaitingSeconds = 30;

			this.props.videoBlockTransition({
				duration:
					waitingMovieSeconds <= maxWaitingSeconds
						? event.duration + waitingMovieSeconds
						: 0, // after 30 seconds of waiting load movie this value is 0
			});
		}
	};

	handleEndedEvent = () => {
		if (this.props.videoBlockTransition) {
			this.props.videoBlockTransition({ended: true});
		}
	};

	handleOnLoaded = (event: {id: number}) => {
		this.setState({
			videoId: event.id,
		});
	};

	handleOnReady = (player: Player) => {
		this.player = player;
		if (!player) return;
		const {editor} = this.props;
		const {videoLink} = this.props.element;
		if (editor || !videoLink) return;

		player.element.setAttribute(
			'allow',
			'accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture',
		);
		player.play();
	};

	render() {
		const {videoId} = this.state;
		const {width, height, opacity, videoLink} = this.props.element;
		const {editor} = this.props;
		const {videoBlockTransition} = this.props;
		if (!videoLink) return 'Выберите видео для показа плеера.';
		if (!this.isValidVimeoLink(videoLink)) {
			return 'Некорректная ссылка';
		}

		return (
			<div style={{opacity}} className={css.vimeoWrapper}>
				<Vimeo
					video={videoLink}
					width={`${width}px`}
					height={`${height}px`}
					onLoaded={this.handleOnLoaded}
					onEnd={this.handleEndedEvent}
					onPause={this.handleStateChange}
					onPlay={this.handleStateChange}
					onReady={this.handleOnReady}
					controls={false}
					autoplay={!editor}
					loop={!videoBlockTransition}
				/>
				{/*<div style={{width, height}} ref={this.iFrameRef} className={css.vimeoWrapper} />*/}

				<div
					className={cn(css.loader, {
						[css.hidden]: videoId,
					})}
				>
					<CircularProgress />
				</div>
			</div>
		);
	}
}

export default VimeoWidget;
