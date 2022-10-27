import * as React from 'react';
import * as moment from 'moment';
import {Meteor} from 'meteor/meteor';
// @ts-ignore
import {withTracker} from 'react-meteor-data-with-tracker';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import CircularProgress from '@material-ui/core/CircularProgress';

// @ts-ignore
import css from './RssWidget.pcss';
import {ISlideElement} from 'shared/collections/SlideElements';
import {getBackgroundImageSize, getBackgroundImageUrl} from 'client/utils/slides';
import {SlideshowBackgroundImageDisplayEnum} from 'shared/collections/Slideshows';
import {RssFeed, IRssFeedItem} from 'shared/collections/RssFeed';
import {methodNames} from 'shared/constants/methodNames';
import {publishNames} from 'shared/constants/publishNames';
import {SocialWrapper} from 'client/components/widgets/social/SocialWrapper';

interface IRssProps {
	element: ISlideElement;
	inCurrentSlide: boolean;
	error?: boolean;
	feeds?: IRssFeedItem[];
	rssItemsCount: number;
	imageUrl?: string;
	title?: string;
	description?: string;
}

class RssWidget extends React.PureComponent<IRssProps> {
	element: HTMLElement;
	wrapperRef: SocialWrapper;

	state = {
		activePost: 0,
	};

	componentDidMount() {
		if (this.props.inCurrentSlide) {
			this.wrapperRef.setAutoscroll();
		}
	}

	componentDidUpdate(prevProps: Readonly<IRssProps>) {
		const {element, inCurrentSlide} = this.props;

		if (element.rssUrl && element.rssUrl !== prevProps.element.rssUrl) {
			Meteor.call(methodNames.rss.updateFeed, element.rssUrl);

			if (this.wrapperRef) {
				this.wrapperRef.resetAutoscroll();
			}
		}

		if (inCurrentSlide && !prevProps.inCurrentSlide) {
			this.wrapperRef.setAutoscroll();
		}
	}

	timeFormated = (dateTime: string) => {
		let m = moment(new Date(dateTime));

		return m
			.locale('ru')
			.local()
			.format('D MMMM YYYY - H:mm');
	};

	setActivePost = (activePost: number, callback: () => void) => {
		this.setState({activePost});

		callback();
	};

	render() {
		const {
			rssUrl,
			opacity,
			backgroundColor,
			backgroundImage,
			backgroundImageDisplay,
			textColor,
			fontSize,
			fontFamily,
		} = this.props.element;

		const {feeds, rssItemsCount, title, description, imageUrl, error} = this.props;

		if (error) return <p>Неверный URL ленты.</p>;

		return (
			<SocialWrapper
				element={this.props.element}
				postsCount={(feeds && feeds.length) || 0}
				maxPostsCount={rssItemsCount}
				counter={this.setActivePost}
				activePost={this.state.activePost}
				ref={(el) => {
					if (!el) {
						return;
					}

					this.wrapperRef = el;
				}}
			>
				<div
					className={css.rssElement}
					style={{
						opacity,
						backgroundColor,
						fontSize,
						height: '100%',
						backgroundImage: getBackgroundImageUrl(backgroundImage),
						backgroundRepeat:
							backgroundImageDisplay !== SlideshowBackgroundImageDisplayEnum.TILE
								? 'no-repeat'
								: 'repeat',
						backgroundSize: getBackgroundImageSize(backgroundImageDisplay),
						color: `${textColor}`,
					}}
				>
					{!rssUrl ? (
						<p>Укажите URL ленты.</p>
					) : (
						<div className={css.items}>
							<Grid container spacing={2} alignItems={'center'}>
								{imageUrl && <Grid item>{<img alt="" src={imageUrl} />}</Grid>}

								<Grid item>
									{title && (
										<Typography
											variant="h5"
											style={{
												fontFamily,
												fontSize: fontSize ? fontSize + 8 : undefined,
												color: textColor,
											}}
										>
											{title}
										</Typography>
									)}
								</Grid>
							</Grid>

							{description && (
								<Typography
									className={css.description}
									style={{
										fontFamily,
										fontSize: fontSize ? fontSize : undefined,
										color: textColor,
									}}
								>
									{description}
								</Typography>
							)}

							{feeds &&
								!!feeds.length &&
								feeds.map((feed: IRssFeedItem, index: number) => (
									<div key={index} className="el-rss-item">
										<Grid item>
											{!!feed.title && (
												<Typography
													variant="h4"
													className={css.itemTitle}
													gutterBottom
													style={{
														fontFamily,
														fontSize: fontSize
															? fontSize + 8
															: undefined,
														color: textColor,
													}}
												>
													{feed.title}
												</Typography>
											)}

											{(feed.author || feed.pubDate) && (
												<Grid container alignItems="center" spacing={2}>
													{feed.author && (
														<Grid item>
															<Typography
																style={{
																	fontFamily,
																	fontSize: fontSize
																		? fontSize - 4
																		: undefined,
																	color: textColor,
																}}
																gutterBottom
															>
																<b>{feed.author}</b>
															</Typography>
														</Grid>
													)}

													{feed.pubDate && (
														<Grid item>
															<Typography
																style={{
																	fontFamily,
																	fontSize: fontSize
																		? fontSize - 4
																		: undefined,
																	color: textColor,
																}}
																gutterBottom
															>
																{this.timeFormated(feed.pubDate)}
															</Typography>
														</Grid>
													)}

													{feed.enclosure && (
														<img
															className={css.itemImg}
															src={feed.enclosure.url}
															alt=""
														/>
													)}
												</Grid>
											)}

											{feed.content && (
												<Typography
													variant="h6"
													gutterBottom
													style={{
														fontFamily,
														fontSize,
														color: textColor,
													}}
												>
													<div
														dangerouslySetInnerHTML={{
															__html: `${feed.content}`,
														}}
													/>
												</Typography>
											)}

											<Typography
												variant="caption"
												align="right"
												style={{
													fontFamily,
													fontSize: fontSize ? fontSize - 4 : undefined,
													color: '#3366BB',
												}}
											>
												{feed.link}
											</Typography>
										</Grid>
									</div>
								))}
							{feeds && !feeds.length && <CircularProgress />}
						</div>
					)}
				</div>
			</SocialWrapper>
		);
	}
}

export default withTracker<{element: ISlideElement}, IRssProps>((props) => {
	const {rssUrl, rssItemsCount} = props.element;
	let error, feeds;

	const loading = Meteor.subscribe(publishNames.rss.feed, rssUrl);
	const rssDB = RssFeed.findOne({rssUrl});

	if (!loading.ready() && !rssDB) Meteor.call(methodNames.rss.updateFeed, rssUrl);

	if (rssDB && rssDB.feed) {
		feeds = rssDB.feed.slice(0, rssItemsCount);
	} else if (rssDB && rssDB.error) {
		error = true;
	}

	return {
		...props,
		error,
		feeds,
		rssItemsCount,
		title: rssDB?.rssTitle,
		description: rssDB?.rssDescription,
		imageUrl: rssDB?.rssImageUrl,
	} as IRssProps;
})(RssWidget);
