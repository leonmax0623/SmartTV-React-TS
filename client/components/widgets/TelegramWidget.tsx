import * as React from 'react';
import {Meteor} from 'meteor/meteor';
import Typography from '@material-ui/core/Typography';
import {withTracker} from 'react-meteor-data-with-tracker';
import Grid from '@material-ui/core/Grid';

import {ISlideElement} from 'shared/collections/SlideElements';
import {SlideshowBackgroundImageDisplayEnum} from 'shared/collections/Slideshows';
import {ITelegramFeed, TelegramFeed, ITelegramFeedItem} from 'shared/collections/TelegramFeed';
import {SocialWrapper} from 'client/components/widgets/social/SocialWrapper';
import {methodNames} from 'shared/constants/methodNames';
import {IFeedStyles} from 'client/types/elements';
import css from './TelegramWidget.pcss';
import './TelegramWidget.scss';
import {getBackgroundImageSize, getBackgroundImageUrl} from 'client/utils/slides';

interface ITelegramProps {
	element: ISlideElement;
	telegramDB?: ITelegramFeed;
	feeds?: ITelegramFeed['feed'];
	pageId: string;
	styles: IFeedStyles;
	inCurrentSlide: boolean;
	loading: boolean;
}

interface ITelegramState {
	activePost: number;
}

class TelegramWidget extends React.PureComponent<ITelegramProps, ITelegramState> {
	wrapperRef: SocialWrapper;

	state = {
		activePost: 0,
	};

	componentDidMount() {
		if (this.props.inCurrentSlide) {
			this.wrapperRef.setAutoscroll();
		}
	}

	componentDidUpdate(prevProps: Readonly<ITelegramProps>): void {
		const {element, pageId, inCurrentSlide} = this.props;
		const checkToggleMethodShow =
			element.telegramMethodShow !== prevProps.element.telegramMethodShow;
		if (
			(element.telegramChannelId &&
				element.telegramChannelId !== prevProps.element.telegramChannelId) ||
			checkToggleMethodShow
		) {
			Meteor.call(methodNames.telegram.updateFeed, pageId, element, checkToggleMethodShow);

			if (this.wrapperRef) {
				this.wrapperRef.resetAutoscroll();
			}
		}

		if (inCurrentSlide && !prevProps.inCurrentSlide) {
			this.wrapperRef.setAutoscroll();
		}
	}

	setActivePost = (activePost: number, callback: () => void) => {
		this.setState({activePost});

		callback();
	};

	renderPost = (feed: ITelegramFeedItem) => {
		const {
			element,
			telegramDB,
			styles: {headerStyle, textStyle, timerStyle},
		} = this.props;

		if (!telegramDB) {
			return null;
		}
		const extendedTextStyle = {
			...textStyle,
			'--text-color': textStyle.color,
			'--text-bg-color': textStyle.backgroundColor,
		} as React.CSSProperties;
		const extendedHeaderStyle = {
			...headerStyle,
			'--header-text-color': headerStyle.color,
			'--header-bg-color': headerStyle.backgroundColor,
		} as React.CSSProperties;
		const extendedfooterStyle = {
			...timerStyle,
			'--footer-text-color': timerStyle.color,
			'--footer-bg-color': timerStyle.backgroundColor,
		} as React.CSSProperties;
		return (
			<Grid key={feed._id} spacing={6} container className={css.feedItem}>
				<Grid item xs={12}>
					<div className="TelegramFeedItem">
						<div className="tgme_widget_message js-widget_message">
							<div className="tgme_widget_message_user">
								<i className="tgme_widget_message_user_photo bgcolor6">
									<img src={feed.messageUserImgSrc} />
								</i>
							</div>
							<div className="tgme_widget_message_bubble">
								<i className="tgme_widget_message_bubble_tail">
									<svg
										className="bubble_icon"
										width="9px"
										height="20px"
										viewBox="0 0 9 20"
									>
										<g fill="none">
											<path
												className="background"
												fill="#ffffff"
												d="M8,1 L9,1 L9,20 L8,20 L8,18 C7.807,15.161 7.124,12.233 5.950,9.218 C5.046,6.893 3.504,4.733 1.325,2.738 L1.325,2.738 C0.917,2.365 0.89,1.732 1.263,1.325 C1.452,1.118 1.72,1 2,1 L8,1 Z"
											></path>
											<path
												className="border_1x"
												fill="#d7e3ec"
												d="M9,1 L2,1 C1.72,1 1.452,1.118 1.263,1.325 C0.89,1.732 0.917,2.365 1.325,2.738 C3.504,4.733 5.046,6.893 5.95,9.218 C7.124,12.233 7.807,15.161 8,18 L8,20 L9,20 L9,1 Z M2,0 L9,0 L9,20 L7,20 L7,20 L7.002,18.068 C6.816,15.333 6.156,12.504 5.018,9.58 C4.172,7.406 2.72,5.371 0.649,3.475 C-0.165,2.729 -0.221,1.464 0.525,0.649 C0.904,0.236 1.439,0 2,0 Z"
											></path>
											<path
												className="border_2x"
												d="M9,1 L2,1 C1.72,1 1.452,1.118 1.263,1.325 C0.89,1.732 0.917,2.365 1.325,2.738 C3.504,4.733 5.046,6.893 5.95,9.218 C7.124,12.233 7.807,15.161 8,18 L8,20 L9,20 L9,1 Z M2,0.5 L9,0.5 L9,20 L7.5,20 L7.5,20 L7.501,18.034 C7.312,15.247 6.64,12.369 5.484,9.399 C4.609,7.15 3.112,5.052 0.987,3.106 C0.376,2.547 0.334,1.598 0.894,0.987 C1.178,0.677 1.579,0.5 2,0.5 Z"
											></path>
											<path
												className="border_3x"
												d="M9,1 L2,1 C1.72,1 1.452,1.118 1.263,1.325 C0.89,1.732 0.917,2.365 1.325,2.738 C3.504,4.733 5.046,6.893 5.95,9.218 C7.124,12.233 7.807,15.161 8,18 L8,20 L9,20 L9,1 Z M2,0.667 L9,0.667 L9,20 L7.667,20 L7.667,20 L7.668,18.023 C7.477,15.218 6.802,12.324 5.64,9.338 C4.755,7.064 3.243,4.946 1.1,2.983 C0.557,2.486 0.52,1.643 1.017,1.1 C1.269,0.824 1.626,0.667 2,0.667 Z"
											></path>
										</g>
									</svg>
								</i>
								<div
									style={extendedHeaderStyle}
									className="TelegramFeedItem__ownerName"
									dangerouslySetInnerHTML={{
										__html: feed.messageOwnerName || '',
									}}
								/>
								{feed.photosRaw && !element.telegramHideImage && (
									<div
										className="TelegramFeedItem__photos"
										dangerouslySetInnerHTML={{
											__html: feed.photosRaw,
										}}
									/>
								)}
								{feed.textRaw && !element.telegramHideText && (
									<div
										style={extendedTextStyle}
										className="TelegramFeedItem__text"
										dangerouslySetInnerHTML={{
											__html: feed.textRaw,
										}}
									/>
								)}
								<div
									style={extendedfooterStyle}
									className="TelegramFeedItem__footer"
									dangerouslySetInnerHTML={{
										__html: feed.footerRaw || '',
									}}
								/>
							</div>
						</div>
					</div>
				</Grid>
			</Grid>
		);
	};

	renderFeed = () => {
		const {telegramDB, element, feeds} = this.props;
		const {activePost} = this.state;

		let filteredFeeds = feeds;

		if (element.postShowByOne && feeds && feeds.length) {
			filteredFeeds = Array.of(feeds[activePost]).filter((f) => f);
		}

		if (!telegramDB || !filteredFeeds) {
			return;
		}
		return filteredFeeds.map(this.renderPost);
	};

	render() {
		const {pageId, element, telegramDB, feeds, loading} = this.props;
		const {telegramPostCount} = element;
		const {activePost} = this.state;

		return (
			<SocialWrapper
				element={this.props.element}
				postsCount={(feeds && feeds.length) || 0}
				maxPostsCount={telegramPostCount}
				counter={this.setActivePost}
				activePost={activePost}
				ref={(el) => {
					if (!el) {
						return;
					}

					this.wrapperRef = el;
				}}
			>
				<div
					className={css.telegramElement}
					style={{
						height: '100%',
						opacity: element.opacity,
						backgroundColor: element.backgroundColor,
						backgroundImage: getBackgroundImageUrl(element.backgroundImage),
						backgroundRepeat:
							element.backgroundImageDisplay !==
							SlideshowBackgroundImageDisplayEnum.TILE
								? 'no-repeat'
								: 'repeat',
						backgroundSize: getBackgroundImageSize(element.backgroundImageDisplay),
						fontSize: element.fontSize,
						color: element.textColor,
					}}
				>
					<div>
						{!pageId ? (
							<>
								{
									<Typography variant="h5">
										Чтобы отобразить канал укажите его ID
									</Typography>
								}
							</>
						) : (
							<>
								{loading && !telegramDB ? (
									'Загрузка данных группы&hellip;'
								) : (
									<>
										{!feeds ? (
											<>
												<Typography variant="h6" gutterBottom>
													Проверьте правильность введенных данных
												</Typography>

												<Typography gutterBottom>
													Пример:{' '}
													<span style={{color: '#999'}}>
														https://t.me/s/
													</span>
													<b>meduzalive</b>
												</Typography>

												<Typography gutterBottom>
													Только название канала
												</Typography>

												<Typography gutterBottom>
													Возможно такого канала не существует
												</Typography>
											</>
										) : (
											<>{this.renderFeed()}</>
										)}
									</>
								)}
							</>
						)}
					</div>
				</div>
			</SocialWrapper>
		);
	}
}
// @ts-ignore
export default withTracker<{}, {}>((props: {element: ISlideElement}) => {
	const {telegramChannelId, telegramPostCount} = props.element;
	const pageId = telegramChannelId;

	let feeds;

	const loading = !Meteor.subscribe('telegram_feed', pageId).ready();
	const telegramDB = TelegramFeed.findOne({pageId});
	if (loading && !telegramDB) {
		Meteor.call(methodNames.telegram.updateFeed, pageId, props.element);
	}

	if (telegramDB && telegramDB.feed) {
		feeds = telegramDB.feed.reverse().slice(0, telegramPostCount);
	}

	return {...props, telegramDB, feeds, pageId, loading};
})(TelegramWidget);
