import * as React from 'react';
import {Meteor} from 'meteor/meteor';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import moment from 'moment';
import cn from 'classnames';
// @ts-ignore
import {withTracker} from 'react-meteor-data-with-tracker';

import {ISlideElement, SlideElementSocialDisplayEnum} from 'shared/collections/SlideElements';
import {FBFeed, IFb, IFbFeed} from 'shared/collections/FBFeed';
import {getBackgroundImageSize, getBackgroundImageUrl} from 'client/utils/slides';
import {SlideshowBackgroundImageDisplayEnum, Slideshow} from 'shared/collections/Slideshows';
import {SocialWrapper} from 'client/components/widgets/social/SocialWrapper';
import {methodNames} from 'shared/constants/methodNames';
// @ts-ignore
import css from './FbWidget.pcss';
import {IUser} from 'client/components/user/ProfilePage';
import routerUrls from 'client/constants/routerUrls';
import {publishNames} from 'shared/constants/publishNames';
import {IFeedStyles} from 'client/types/elements';

interface IFbWidgetData {
	fbDB?: IFb;
	feeds?: IFb['feed'];
	user?: IUser;
	isServiced: boolean;
}

interface IFbWidgetProps {
	element: ISlideElement;
	styles: IFeedStyles;
	inCurrentSlide: boolean;
}

interface IFbState {
	activePost: number;
}

class FbWidget extends React.PureComponent<IFbWidgetProps & IFbWidgetData, IFbState> {
	wrapperRef: SocialWrapper;

	state = {activePost: 0};

	componentDidMount() {
		if (this.props.inCurrentSlide) {
			this.wrapperRef.setAutoscroll();
		}
	}

	componentDidUpdate(prevProps: Readonly<IFbWidgetProps>) {
		const {element, inCurrentSlide, isServiced, user} = this.props;

		if (
			isServiced &&
			element.fbGroupId &&
			element.fbGroupId !== prevProps.element.fbGroupId &&
			user
		) {
			Meteor.call(methodNames.fb.updateFeed, user._id, element.fbGroupId);

			this.wrapperRef.resetAutoscroll();
		}

		if (inCurrentSlide && !prevProps.inCurrentSlide) {
			this.wrapperRef.setAutoscroll();
		}
	}

	setActivePost = (activePost: number, callback: () => void) => {
		this.setState({activePost});

		callback();
	};

	errorMessage = () => {
		const {
			element: {fbGroupId},
			isServiced,
			user,
		} = this.props;
		const pages = user && user.fbPages;

		if (!isServiced) {
			return (
				<Typography>
					Чтобы включить сервис, перейдите в{' '}
					<a
						className={css.link}
						style={{position: 'relative', zIndex: 999}}
						href={routerUrls.userProfile}
					>
						Ваш профиль
					</a>{' '}
					и подключите сервис Facebook.
				</Typography>
			);
		}

		// if (!fbGroupId) {
		// 	return (
		// 		<Typography>
		// 			Чтобы отобразить ленту сообщений сообщества Facebook укажите его ID.
		// 		</Typography>
		// 	);
		// }

		if (pages && !pages.find(({id}) => id === fbGroupId)) {
			return (
				<Typography>
					Чтобы отобразить ленту сообщений Вашей страницы Facebook выберете её.
				</Typography>
			);
		}

		return false;
	};

	render() {
		const {
			element,
			styles: {headerStyle, timerStyle, textStyle},
		} = this.props;
		const {
			opacity,
			backgroundColor,
			backgroundImage,
			backgroundImageDisplay,
			postShowByOne,
			socialDisplay,
			fbPostCount,
			fbHideText,
		} = element;

		const {fbDB, feeds} = this.props;
		const {activePost} = this.state;
		let filteredFeeds: IFb['feed'] = feeds;

		if (postShowByOne && feeds && feeds.length) {
			filteredFeeds = Array.of(feeds[activePost]).filter((f) => f);
		}

		return (
			<SocialWrapper
				element={this.props.element}
				postsCount={(feeds && feeds.length) || 0}
				maxPostsCount={fbPostCount}
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
					className={css.container}
					style={{
						opacity,
						backgroundColor,
						backgroundImage: getBackgroundImageUrl(backgroundImage),
						backgroundRepeat:
							backgroundImageDisplay !== SlideshowBackgroundImageDisplayEnum.TILE
								? 'no-repeat'
								: 'repeat',
						backgroundSize: getBackgroundImageSize(backgroundImageDisplay),
					}}
				>
					{this.errorMessage() || (
						<>
							{fbDB && (
								<Grid
									key={fbDB._id}
									className={css.topPanel}
									container
									direction="row"
									alignItems="center"
								>
									{/*<Grid item>*/}
									{/*	<Avatar />*/}
									{/*</Grid>*/}

									<Grid item>
										<Typography
											variant="h6"
											className={css.name}
											style={headerStyle}
										>
											{fbDB.name}
										</Typography>
									</Grid>
								</Grid>
							)}

							<div>
								{filteredFeeds &&
									filteredFeeds.map((feed: IFbFeed, ind: number) => {
										const gridFullXs = 12;
										let gridXs = 6;
										const gridSpacing = 6;

										const attachmentsWithImage =
											feed.attachments && feed.attachments.data
												? feed.attachments.data.filter(
														(a) =>
															a.media &&
															a.media.image &&
															a.media.image.src,
												  )
												: [];
										const attachmentsWidthText =
											feed.attachments && feed.attachments.data
												? feed.attachments.data.filter(
														({description}) => description,
												  )
												: [];
										const textExists =
											feed.message || !!attachmentsWidthText.length;

										if (
											!socialDisplay ||
											socialDisplay ===
												SlideElementSocialDisplayEnum.MEDIA_TOP ||
											!attachmentsWithImage.length ||
											!textExists ||
											fbHideText
										) {
											gridXs = gridFullXs;
										}

										return (
											<div className={css.item} key={ind}>
												<Grid container spacing={gridSpacing}>
													{attachmentsWithImage.map(
														(
															{
																media: {
																	// @ts-ignore
																	image: {src},
																},
															},
															index: number,
														) => (
															<Grid
																item
																xs={gridXs}
																key={index.toString()}
															>
																<img
																	src={src}
																	className={cn(css.image, {
																		[css.isMediaLeft]:
																			socialDisplay &&
																			socialDisplay ===
																				SlideElementSocialDisplayEnum.MEDIA_LEFT,
																	})}
																	alt=""
																/>
															</Grid>
														),
													)}

													{!fbHideText && (
														<>
															{textExists && (
																<Grid item xs={gridXs}>
																	<Typography
																		variant="body1"
																		gutterBottom
																		style={textStyle}
																	>
																		{feed.message}

																		{!feed.message &&
																			attachmentsWidthText.map(
																				(
																					{description},
																					index: number,
																				) => (
																					<Typography
																						className={
																							css.description
																						}
																						key={index.toString()}
																					>
																						{
																							description
																						}
																					</Typography>
																				),
																			)}
																	</Typography>
																</Grid>
															)}

															{feed.createdTime && (
																<Grid
																	item
																	style={timerStyle}
																	className={css.date}
																	xs={gridFullXs}
																>
																	{moment(
																		feed.createdTime,
																	).format('DD MMM в HH:mm')}
																</Grid>
															)}
														</>
													)}
												</Grid>
											</div>
										);
									})}
							</div>
						</>
					)}
				</div>
			</SocialWrapper>
		);
	}
}
// @ts-ignore
export default withTracker<IFbWidgetData, IFbWidgetProps>(({element}) => {
	const {fbGroupId, fbPostCount, slideshowId} = element;
	const slideshow = Slideshow.findOne({_id: slideshowId});
	const subUserServices = Meteor.subscribe(publishNames.user.userServices, slideshow.userId);
	const subFeed = Meteor.subscribe('fb_feed', fbGroupId);
	const loading = subUserServices.ready() && subFeed.ready();
	const user = Meteor.users.findOne({_id: slideshow.userId}) as IUser;
	const isServiced = !!(user && user.projectServices && user.projectServices.facebook);

	let feeds: IFb['feed'] = [];
	const fbDB = FBFeed.findOne({pageId: fbGroupId});

	if (isServiced && user) {
		Meteor.call(methodNames.fb.updateFeed, user._id);
	}

	if (!loading && !fbDB && isServiced && user) {
		Meteor.call(methodNames.fb.updateFeed, user._id, fbGroupId);
	}

	if (fbDB && fbDB.feed) {
		feeds = fbDB.feed.slice(0, fbPostCount);
	}

	return {fbDB, feeds, user, isServiced};
})(FbWidget);
