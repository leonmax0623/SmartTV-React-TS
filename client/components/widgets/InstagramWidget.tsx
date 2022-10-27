import * as React from 'react';
import {Meteor} from 'meteor/meteor';
import cn from 'classnames';
import Typography from '@material-ui/core/Typography';
import {Grid} from '@material-ui/core';
import {withTracker} from 'react-meteor-data-with-tracker';

import {ISlideElement, SlideElementSocialDisplayEnum} from 'shared/collections/SlideElements';
import {InstagramFeed, IInstagramFeed} from 'shared/collections/InstagramFeed';
import {methodNames} from 'shared/constants/methodNames';
import {publishNames} from 'shared/constants/publishNames';
import {getBackgroundImageSize, getBackgroundImageUrl} from 'client/utils/slides';
import {SlideshowBackgroundImageDisplayEnum} from 'shared/collections/Slideshows';
import {SocialWrapper} from 'client/components/widgets/social/SocialWrapper';
import {IFeedStyles} from 'client/types/elements';
import InstagramIcon from './icons/InstagramIcons';
import css from './InstagramWidget.pcss';

interface IInstagramWidgetProps {
	element: ISlideElement;
	inCurrentSlide: boolean;
	instagramDB: IInstagramFeed;
	feeds?: IInstagramFeed['feed'];
	styles: IFeedStyles;
}

interface IInstagramWidgetState {
	activePost: number;
}

class InstagramWidget extends React.PureComponent<IInstagramWidgetProps, IInstagramWidgetState> {
	wrapperRef: SocialWrapper;

	state = {activePost: 0};

	componentDidMount() {
		if (this.props.inCurrentSlide) {
			this.wrapperRef.setAutoscroll();
		}
	}

	componentDidUpdate(prevProps: Readonly<IInstagramWidgetProps>): void {
		const {element, inCurrentSlide} = this.props;

		if (element.instagramName && element.instagramName !== prevProps.element.instagramName) {
			const {instagramName} = element;

			Meteor.call(methodNames.instagram.updateFeed, instagramName);

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

	render() {
		const {
			element,
			instagramDB,
			feeds,
			styles: {headerStyle, textStyle},
		} = this.props;
		const {socialDisplay, instagramPhotoCount} = element;
		const {activePost} = this.state;
		let filteredFeeds = feeds;

		if (element.postShowByOne && feeds && feeds.length) {
			filteredFeeds = Array.of(feeds[activePost]).filter((f) => f);
		}

		return (
			<SocialWrapper
				element={this.props.element}
				postsCount={(feeds && feeds.length) || 0}
				maxPostsCount={instagramPhotoCount}
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
					className={css.instaElement}
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
					{!element.instagramName ? (
						<div>Чтобы отобразить фото укажите имя аккаунта Instagram.</div>
					) : (
						<>
							{instagramDB && (
								<Typography variant="h6" key={instagramDB._id} style={headerStyle}>
									<InstagramIcon /> {instagramDB.name}
								</Typography>
							)}

							<div>
								{filteredFeeds &&
									filteredFeeds.map((feed, index) => {
										const gridFullXs = 12;
										let gridXs = 6;
										const gridSpacing = 6;

										if (
											!socialDisplay ||
											socialDisplay ===
												SlideElementSocialDisplayEnum.MEDIA_TOP ||
											!feed.display_src ||
											!feed.caption ||
											element.instagramHideText
										) {
											gridXs = gridFullXs;
										}

										return (
											<Grid
												container
												key={feed.id}
												spacing={gridSpacing}
												className={cn(css.instaItem, 'el-instagram-item')}
											>
												{feed.display_src && (
													<Grid
														item
														xs={gridXs}
														data-id={`instagram-${index}`}
													>
														<img
															src={feed.display_src}
															className={css.image}
															alt=""
														/>
													</Grid>
												)}

												{!element.instagramHideText && (
													<Grid item xs={gridXs} style={textStyle}>
														{feed.caption}
													</Grid>
												)}
											</Grid>
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

export default withTracker<{element: ISlideElement}, IInstagramWidgetProps>((props) => {
	const {instagramName, instagramPhotoCount} = props.element;
	let feeds;
	const instagramDB: IInstagramFeed = InstagramFeed.findOne({pageId: instagramName});
	// const limitFeed = 10000;

	const subFeed = Meteor.subscribe(publishNames.instagram.feed, instagramName);
	const loading = !subFeed.ready();

	if (loading && !instagramDB) {
		Meteor.call(methodNames.instagram.updateFeed, instagramName);
	}

	if (instagramDB && instagramDB.feed) {
		feeds = instagramDB.feed.slice(0, instagramPhotoCount);
	}

	return {...props, instagramDB, feeds};
})(InstagramWidget);
