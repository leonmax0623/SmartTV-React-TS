import * as React from 'react';
import moment from 'moment';
import {Meteor} from 'meteor/meteor';
import Typography from '@material-ui/core/Typography';
import {withTracker} from 'react-meteor-data-with-tracker';
import Avatar from '@material-ui/core/Avatar';
import Grid from '@material-ui/core/Grid';

import {
	ISlideElement,
	SlideElementSocialDisplayEnum,
	SlideElementVkMethodShowEnum,
} from 'shared/collections/SlideElements';
import {
	IVkFeed,
	VKFeed,
	IVKFeedItem,
	IVKFeedItemAlbum,
	IVKFeedItemAlbumSize,
	VKFeedItemAlbumSizeTypeEnum,
} from 'shared/collections/VKFeed';
import {getBackgroundImageSize, getBackgroundImageUrl} from 'client/utils/slides';
import {SlideshowBackgroundImageDisplayEnum, Slideshow} from 'shared/collections/Slideshows';
import {SocialWrapper} from 'client/components/widgets/social/SocialWrapper';
import {methodNames} from 'shared/constants/methodNames';
import {publishNames} from 'shared/constants/publishNames';
import routerUrls from 'client/constants/routerUrls';
import {IUser} from 'client/components/user/ProfilePage';
import {IFeedStyles} from 'client/types/elements';
import css from './VkWidget.pcss';

interface IVKProps {
	element: ISlideElement;
	error?: boolean;
	vkDB?: IVkFeed;
	feeds?: IVkFeed['feed'];
	pageId: string;
	accessToken?: string;
	styles: IFeedStyles;
	inCurrentSlide: boolean;
}

interface IVKState {
	activePost: number;
}

class VkWidget extends React.PureComponent<IVKProps, IVKState> {
	wrapperRef: SocialWrapper;

	state = {
		activePost: 0,
	};

	componentDidMount() {
		if (this.props.inCurrentSlide) {
			this.wrapperRef.setAutoscroll();
		}
	}

	componentDidUpdate(prevProps: Readonly<IVKProps>): void {
		const {element, pageId, inCurrentSlide} = this.props;
		const checkToggleMethodShow = element.vkMethodShow !== prevProps.element.vkMethodShow;

		if (
			(element.vkGroupId && element.vkGroupId !== prevProps.element.vkGroupId) ||
			checkToggleMethodShow
		) {
			Meteor.call(methodNames.vk.updateFeed, pageId, element, checkToggleMethodShow);

			if (this.wrapperRef) {
				this.wrapperRef.resetAutoscroll();
			}
		}

		if (inCurrentSlide && !prevProps.inCurrentSlide) {
			this.wrapperRef.setAutoscroll();
		}
	}

	formattedDate = (date: number) => {
		return moment(date * 1000).format('DD MMM в HH:mm');
	};

	formattedText = (text: string) => {
		const formated: string[] = text.split('\n');
		let result: string = '';

		if (formated && formated.length) {
			formated.forEach((text) => {
				result += text ? `<p>${text}</p>` : '</br>';
			});
		} else {
			result = text;
		}

		return result;
	};

	setActivePost = (activePost: number, callback: () => void) => {
		this.setState({activePost});

		callback();
	};

	renderPost = (feed: IVKFeedItem) => {
		const {
			element,
			vkDB,
			styles: {headerStyle, textStyle, timerStyle},
		} = this.props;
		const {socialDisplay} = element;

		if (!vkDB) {
			return null;
		}

		const gridFullXs = 12;
		let gridXs = 6;
		const gridSpacing = 6;

		const itemsWithImages = feed.attachments
			? feed.attachments.filter((a) => ['link', 'photo', 'video'].includes(a.type as string))
			: [];
		const isTextOrRepost = !!feed.text || !!feed.copy_history;

		if (
			!socialDisplay ||
			socialDisplay === SlideElementSocialDisplayEnum.MEDIA_TOP ||
			!itemsWithImages.length ||
			!isTextOrRepost ||
			element.vkHideText
		) {
			gridXs = gridFullXs;
		}

		return (
			<Grid key={feed.id} spacing={gridSpacing} container className={css.feedItem}>
				{(feed.photoMiddle || vkDB.photoMiddle) && (
					<Grid item container xs={gridFullXs}>
						<Grid item>
							<Avatar
								className={css.avatar}
								src={feed.photoMiddle || vkDB.photoMiddle}
								component="div"
							/>
						</Grid>

						<Grid item>
							<Typography variant="h4" style={headerStyle}>
								{feed.name || vkDB.name}
							</Typography>
							<span style={timerStyle}>{this.formattedDate(feed.date)}</span>
						</Grid>
					</Grid>
				)}

				{!!itemsWithImages.length && (
					<Grid item xs={gridXs}>
						{[itemsWithImages[0]].map((attachment, index) => {
							let previewImage;

							switch (attachment.type) {
								case 'video':
									const photo_130 = attachment.video?.image?.find(
										(a: any) => a.width === 130,
									)?.url;
									const photo_260 = attachment.video?.image?.find(
										(a: any) => a.width === 260,
									)?.url;
									const photo_640 = attachment.video?.image?.find(
										(a: any) => a.width === 640,
									)?.url;
									const photo_800 = attachment.video?.image?.find(
										(a: any) => a.width === 800,
									)?.url;

									previewImage = photo_800 || photo_640 || photo_260 || photo_130;

									break;

								case 'photo':
									//m https://vk.com/dev/photo_sizes
									const iPhoto130 = attachment.photo?.sizes?.find(
										(a: any) => a.type === 'm',
									)?.url;
									//x https://vk.com/dev/photo_sizes
									const photo_604 = attachment.photo?.sizes?.find(
										(a: any) => a.type === 'x',
									)?.url;
									previewImage = photo_604 || iPhoto130;

									break;
							}

							return (
								<React.Fragment key={index}>
									{attachment.type === 'link' && !element.vkHideText && (
										<small>{attachment.link.description}</small>
									)}

									{attachment.type === 'photo' && previewImage && (
										<img src={previewImage} alt="" />
									)}

									{attachment.type === 'video' && previewImage && (
										<img src={previewImage} alt="" />
									)}
								</React.Fragment>
							);
						})}
					</Grid>
				)}

				{isTextOrRepost && (
					<Grid item container xs={gridXs}>
						<Grid item xs={gridFullXs}>
							{feed.text && !element.vkHideText && (
								<div
									style={textStyle}
									className={css.description}
									dangerouslySetInnerHTML={{
										__html: `${this.formattedText(feed.text)}`,
									}}
								/>
							)}

							{!!feed.copy_history &&
								feed.copy_history.map((f) =>
									this.renderPost(f, {headerStyle, timerStyle, textStyle}),
								)}
						</Grid>
					</Grid>
				)}
			</Grid>
		);
	};

	getPhotoMiddleFromSizes = (sizes?: IVKFeedItemAlbumSize[]) => {
		if (!sizes) {
			return;
		}

		const size = sizes.filter(({type}) => type !== VKFeedItemAlbumSizeTypeEnum.W).reverse()[0];

		return size && size.url;
	};

	renderAlbum = (feed: IVKFeedItemAlbum) => {
		const {
			element,
			vkDB,
			styles: {headerStyle, timerStyle, textStyle},
		} = this.props;
		const {socialDisplay} = element;

		if (!vkDB) {
			return null;
		}

		const gridFullXs = 12;
		let gridXs = 6;
		const gridSpacing = 6;

		const isImage = feed.sizes;
		const isText = !!feed.text;

		if (
			!socialDisplay ||
			socialDisplay === SlideElementSocialDisplayEnum.MEDIA_TOP ||
			!isText ||
			!isImage ||
			element.vkHideText
		) {
			gridXs = gridFullXs;
		}

		const photoMiddle = this.getPhotoMiddleFromSizes(feed.sizes);

		return (
			<Grid key={feed.id} spacing={gridSpacing} container className={css.feedItem}>
				{(photoMiddle || vkDB.photoMiddle) && (
					<Grid item container xs={gridFullXs}>
						<Grid item>
							<Avatar className={css.avatar} src={vkDB.photoMiddle} component="div" />
						</Grid>

						<Grid item>
							<Typography variant="h4" style={headerStyle}>
								{vkDB.name}
							</Typography>

							{feed.date && (
								<span style={timerStyle}>{this.formattedDate(feed.date)}</span>
							)}
						</Grid>
					</Grid>
				)}

				{isImage && (
					<Grid item xs={gridXs}>
						<img src={photoMiddle} alt="" />
					</Grid>
				)}

				{isText && (
					<Grid item container xs={gridXs}>
						<Grid item xs={gridFullXs}>
							{feed.text && !element.vkHideText && (
								<div
									style={textStyle}
									className={css.description}
									dangerouslySetInnerHTML={{
										__html: `${this.formattedText(feed.text)}`,
									}}
								/>
							)}
						</Grid>
					</Grid>
				)}
			</Grid>
		);
	};

	renderFeed = () => {
		const {vkDB, element, feeds} = this.props;
		const {vkMethodShow} = element;
		const {activePost} = this.state;

		let filteredFeeds = feeds;

		if (element.postShowByOne && feeds && feeds.length) {
			filteredFeeds = Array.of(feeds[activePost]).filter((f) => f);
		}

		if (!vkDB || !filteredFeeds) {
			return;
		}

		switch (vkMethodShow) {
			case SlideElementVkMethodShowEnum.GROUP_PHOTO_ALBUM:
				return filteredFeeds.map(this.renderAlbum);

			case SlideElementVkMethodShowEnum.USER_WALL:
			case SlideElementVkMethodShowEnum.GROUP:
			default:
				return filteredFeeds.map(this.renderPost);
		}
	};

	render() {
		const {pageId, element, error, vkDB, feeds, accessToken} = this.props;
		const {vkPostCount, vkMethodShow} = element;
		const {activePost} = this.state;

		let failId;
		let failUserWallTitle;
		let failUserWallDesc;

		if (!accessToken) {
			switch (vkMethodShow) {
				case SlideElementVkMethodShowEnum.USER_WALL:
				case SlideElementVkMethodShowEnum.GROUP_PHOTO_ALBUM:
					failUserWallTitle = (
						<Typography variant="h4" gutterBottom>
							Сервис отключен
						</Typography>
					);
					failUserWallDesc = (
						<Typography variant="h6">
							Чтобы включить сервис, перейдите в{' '}
							<a
								className={css.link}
								style={{position: 'relative', zIndex: 999}}
								href={routerUrls.userProfile}
							>
								Ваш профиль
							</a>{' '}
							и подключите сервис ВК
						</Typography>
					);
			}
		}

		switch (vkMethodShow) {
			case SlideElementVkMethodShowEnum.GROUP:
				failId = 'Чтобы отобразить ленту сообщений сообщества VK укажите его ID';
				break;

			case SlideElementVkMethodShowEnum.GROUP_PHOTO_ALBUM:
				failId = 'Чтобы отобразить фотографии сообщества VK укажите его ID';
		}

		return (
			<SocialWrapper
				element={this.props.element}
				postsCount={(feeds && feeds.length) || 0}
				maxPostsCount={vkPostCount}
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
					className={css.vkElement}
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
					{failUserWallTitle || !pageId ? (
						<>
							{failUserWallTitle || <Typography variant="h5">{failId}</Typography>}

							{failUserWallDesc}
						</>
					) : (
						<>
							{error ? (
								<>
									<Typography variant="h6" gutterBottom>
										Проверьте правильность введенных данных
									</Typography>

									<Typography gutterBottom>
										Пример: <span style={{color: '#999'}}>http://vk.com/</span>
										<b>leprazo</b>
									</Typography>

									<Typography gutterBottom>Только название группы</Typography>

									<Typography gutterBottom>
										Возможно такой группы не существует
									</Typography>
								</>
							) : (
								<>
									{vkDB && (
										<React.Fragment key={vkDB._id}>
											{vkDB.lock && 'Загрузка данных группы&hellip;'}
										</React.Fragment>
									)}

									{this.renderFeed()}
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
export default withTracker<{}, {}>((props: {element: ISlideElement}) => {
	const {vkGroupId, vkPostCount, vkMethodShow} = props.element;
	const userWall = vkMethodShow === SlideElementVkMethodShowEnum.USER_WALL;
	const isNeedUserKey =
		vkMethodShow &&
		[
			SlideElementVkMethodShowEnum.USER_WALL,
			SlideElementVkMethodShowEnum.GROUP_PHOTO_ALBUM,
		].includes(vkMethodShow);
	const slideshow = Slideshow.findOne({_id: props.element.slideshowId});
	const user = Meteor.users.findOne({_id: slideshow.userId}) as IUser;
	const subUserServices = Meteor.subscribe(publishNames.user.userServices, slideshow.userId);
	const accessToken = subUserServices.ready() && user && user.projectServices.vk;
	const pageId = userWall && accessToken ? String(accessToken.user_id) : vkGroupId;

	let error;
	let feeds;

	const loading = !subUserServices.ready() || !Meteor.subscribe('vk_feed', pageId).ready();
	const vkDB = VKFeed.findOne({pageId});

	if (loading && !vkDB && (!isNeedUserKey || accessToken)) {
		Meteor.call(methodNames.vk.updateFeed, pageId, props.element);
	}

	if (vkDB && vkDB.feed) {
		feeds = vkDB.feed.slice(0, vkPostCount);
	} else if (vkDB && vkDB.error) {
		error = true;
	} else if (/vk.{1,3}/.test(String(pageId))) {
		error = true;
	}

	return {...props, error, vkDB, feeds, pageId, accessToken};
})(VkWidget);
