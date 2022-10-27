import * as React from 'react';
import moment from 'moment';
import {Meteor} from 'meteor/meteor';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import {withTracker} from 'react-meteor-data-with-tracker';

import {ISlideElement, SlideElementSocialDisplayEnum} from 'shared/collections/SlideElements';
import {IOk, OKFeed} from 'shared/collections/OkFeed';
import {getBackgroundImageSize, getBackgroundImageUrl} from 'client/utils/slides';
import {SlideshowBackgroundImageDisplayEnum} from 'shared/collections/Slideshows';
import {SocialWrapper} from 'client/components/widgets/social/SocialWrapper';
import OdnoklassnikiIcon from '../editor/icons/OdnoklassnikiIcon';
import {IFeedStyles} from 'client/types/elements';
import css from './OkWidget.pcss';

interface IOkWidgetData {
	okDB: IOk;
	feeds: IOk['messages'];
}

interface IOkWidgetProps {
	element: ISlideElement;
	styles: IFeedStyles;
	inCurrentSlide: boolean;
}

interface IOkWidgetState {
	error?: boolean;
	activePost: number;
}

class OkWidget extends React.PureComponent<IOkWidgetProps & IOkWidgetData, IOkWidgetState> {
	wrapperRef: SocialWrapper;

	state = {error: false, activePost: 0};

	componentDidMount() {
		if (this.props.inCurrentSlide) {
			this.wrapperRef.setAutoscroll();
		}
	}

	componentDidUpdate(prevProps: Readonly<IOkWidgetProps & IOkWidgetData>) {
		const {element, inCurrentSlide} = this.props;

		if (element.okGroupLink && element.okGroupLink !== prevProps.element.okGroupLink) {
			Meteor.call(
				'OKFeed.update',
				element.okGroupLink,
				element.okPostCount,
				(error: any, result: any) => {
					if (error) {
						this.setState({error: true});
					} else if (result) {
						this.setState({error: false});
					}
				},
			);

			if (this.wrapperRef) {
				this.wrapperRef.resetAutoscroll();
			}
		}

		if (inCurrentSlide && !prevProps.inCurrentSlide) {
			this.wrapperRef.setAutoscroll();
		}
	}

	forrmattedText = (text: string) => {
		const formated: string[] = text.split('\n');
		let result: string = '';

		if (formated && formated.length) {
			formated.forEach((t) => {
				result += t ? `<p>${t}</p>` : '</br>';
			});
		} else {
			result = text;
		}

		return result;
	};

	forrmattedDate = (date?: number) => (date ? moment().format('DD MMM в HH:mm') : date);

	setActivePost = (activePost: number, callback: () => void) => {
		this.setState({activePost});

		callback();
	};

	render() {
		const {
			okDB,
			feeds,
			styles: {headerStyle, textStyle, timerStyle},
		} = this.props;
		const {
			okGroupLink,
			opacity,
			backgroundColor,
			backgroundImage,
			backgroundImageDisplay,
			textColor,
			fontSize,
			postShowByOne,
			socialDisplay,
			okPostCount,
			okHideText,
		} = this.props.element;
		const {error, activePost} = this.state;

		let filteredFeeds: IOk['messages'] = feeds;

		if (postShowByOne && feeds && feeds.length) {
			filteredFeeds = Array.of(feeds[activePost]).filter((f) => f);
		}

		return (
			<SocialWrapper
				element={this.props.element}
				postsCount={(feeds && feeds.length) || 0}
				maxPostsCount={okPostCount}
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
					className={css.okElement}
					style={{
						fontSize,
						opacity,
						backgroundColor,
						backgroundImage: getBackgroundImageUrl(backgroundImage),
						backgroundRepeat:
							backgroundImageDisplay !== SlideshowBackgroundImageDisplayEnum.TILE
								? 'no-repeat'
								: 'repeat',
						backgroundSize: getBackgroundImageSize(backgroundImageDisplay),
						color: `${textColor}`,
					}}
				>
					{!okGroupLink ? (
						<Typography variant="h5">
							Чтобы отобразить ленту сообщений сообщества OK укажите ссылку на
							сообщество.
						</Typography>
					) : (
						<>
							{error ? (
								<Typography variant="h5">
									Произошла ошибка. Проверьте введенные данные.
								</Typography>
							) : (
								<>
									{okDB && okDB.lock && (
										<Typography variant="h5">
											Загрузка сообщений группы&hellip;
										</Typography>
									)}

									{okDB &&
										!okDB.lock &&
										filteredFeeds &&
										filteredFeeds.map((feedOuter, index) => {
											const gridFullXs = 12;
											let gridXs = 6;
											const gridSpacing = 6;

											const itemsWithImages = feedOuter.messages
												? feedOuter.messages.filter((f) => f.img)
												: [];
											const itemsWithText = feedOuter.messages
												? feedOuter.messages.filter(
														(f) => f.text || f.description,
												  )
												: [];

											if (
												!socialDisplay ||
												socialDisplay ===
													SlideElementSocialDisplayEnum.MEDIA_TOP ||
												!itemsWithImages.length ||
												!itemsWithText.length ||
												okHideText
											) {
												gridXs = gridFullXs;
											}

											return (
												<Grid
													key={index}
													container
													spacing={gridSpacing}
													className={css.feedItem}
												>
													<Grid item xs={gridFullXs}>
														<Typography variant="h4" gutterBottom>
															<OdnoklassnikiIcon />{' '}
															<span style={headerStyle}>
																{okDB.name}
															</span>
														</Typography>
														<span style={timerStyle}>
															{this.forrmattedDate(feedOuter.date)}
														</span>
													</Grid>

													{!!itemsWithImages.length && (
														<Grid item xs={gridXs}>
															{itemsWithImages.map(
																(feed, feedIndex) => (
																	<React.Fragment key={feedIndex}>
																		<img
																			src={feed.img}
																			alt=""
																		/>
																	</React.Fragment>
																),
															)}
														</Grid>
													)}

													{!okHideText && !!itemsWithText.length && (
														<Grid item xs={gridXs}>
															{itemsWithText.map(
																(feed, feedIndex) => (
																	<React.Fragment key={feedIndex}>
																		{feed.type === 'text' && (
																			<div
																				style={textStyle}
																				className={
																					css.description
																				}
																				dangerouslySetInnerHTML={{
																					__html: `${this.forrmattedText(
																						feed.text ||
																							'',
																					)}`,
																				}}
																			/>
																		)}

																		{feed.type === 'link' && (
																			<>
																				<Typography variant="h6">
																					{feed.title}
																				</Typography>

																				<small>
																					{
																						feed.description
																					}
																				</small>

																				<p>
																					<small>
																						<a
																							href={
																								feed.url
																							}
																						>
																							{
																								feed.domain
																							}
																						</a>
																					</small>
																				</p>
																			</>
																		)}
																	</React.Fragment>
																),
															)}
														</Grid>
													)}
												</Grid>
											);
										})}
								</>
							)}
						</>
					)}
				</div>
			</SocialWrapper>
		);
	}
}

// @ts-ignore
export default withTracker<IOkWidgetData, IOkWidgetProps>(({element}) => {
	const {okGroupLink, okPostCount} = element;
	const loading = !Meteor.subscribe('ok_feed', okGroupLink).ready();
	let feeds: IOk['messages'] = [];
	const okDB = OKFeed.findOne({groupLink: okGroupLink});

	if (loading && !okDB) {
		Meteor.call('OKFeed.update', okGroupLink, okPostCount);
	}

	if (okDB && okDB.messages) {
		feeds = okDB.messages.slice(0, okPostCount);
	}

	return {okDB, feeds};
})(OkWidget);
