import * as React from 'react';
import {
	ISlideElement,
	SlideElementSocialDisplayEnum,
	SocialElementsEnum,
} from 'shared/collections/SlideElements';
import {
	Avatar,
	Card,
	CardActions,
	CardContent,
	CardHeader,
	CardMedia,
	Grid,
	GridSize,
	Typography,
} from '@material-ui/core';
import GifIcon from '@material-ui/icons/Gif';
import SvgIcon from '@material-ui/core/SvgIcon';
import {mdiCheckDecagram, mdiHeartOutline, mdiMessageOutline} from '@mdi/js';
import moment from 'moment';

import {ITwitterFeedItem} from 'shared/collections/Twitter';
import {getBackgroundImageSize, getBackgroundImageUrl} from 'client/utils/slides';
import {SlideshowBackgroundImageDisplayEnum} from 'shared/collections/Slideshows';
import {IFeedStyles} from 'client/types/elements';
// @ts-ignore
import css from './TwitPreview.pcss';

interface ITwitPreviewProps {
	element: ISlideElement;
	item?: ITwitterFeedItem;
	selectedElement?: string;
	getElement?: (el: string) => (e: React.MouseEvent) => void;
	isTemplate?: boolean;
	styles: IFeedStyles;
}

const timeFormatted = (dateTime: string) => {
	const m = moment(new Date(dateTime));

	return m
		.locale('ru')
		.local()
		.format('H:mm - D MMMM YYYY');
};

const TwitPreview = (props: ITwitPreviewProps) => {
	const {
		backgroundColor,
		backgroundImage,
		backgroundImageDisplay,
		twitsHideText,
		socialDisplay,
	} = props.element;
	const {
		getElement,
		isTemplate,
		styles: {headerStyle, textStyle, timerStyle},
	} = props;
	let {item} = props;

	if (isTemplate) {
		item = {
			id: 123,
			twitterId: '123',
			text:
				'RT @BradWollack: @realDonaldTrump @KennedyNation The reason we have the\n' +
				'\t\t\t\t\t\tSpecial Counsel investigation is because you’re a criminal. At this…',
			photo: 'https://pbs.twimg.com/media/Bm54nBCCYAACwBi',
			createdAt: 'Sun Jul 14 18:44:13 +0000 2019',
			favoriteCount: 5606,
			retweetCount: 4573,
			user: {
				twitterId: 123,
				name: 'US Department of the Interior',
				profileName: 'MTV',
				url: '',
				imageUrl:
					'https://pbs.twimg.com/profile_images/1145694534703169543/f-Jts9lD_bigger.png',
			},
		};
	}

	const gridFullXs = 12;
	let gridXs: GridSize = 6;

	if (
		!socialDisplay ||
		socialDisplay === SlideElementSocialDisplayEnum.MEDIA_TOP ||
		!item ||
		!item.photo ||
		twitsHideText
	) {
		gridXs = gridFullXs;
	}

	return (
		<Card
			className={css.itemFeed}
			style={{
				backgroundColor,
				backgroundImage: getBackgroundImageUrl(backgroundImage),
				backgroundRepeat:
					backgroundImageDisplay !== SlideshowBackgroundImageDisplayEnum.TILE
						? 'no-repeat'
						: 'repeat',
				backgroundSize: getBackgroundImageSize(backgroundImageDisplay),
			}}
		>
			<Grid container>
				<Grid item container xs={gridFullXs}>
					<CardHeader
						avatar={
							<Avatar>
								<img src={item && item.user.imageUrl} alt="" />
							</Avatar>
						}
						title={
							<>
								{item && item.user.name}&nbsp;
								<SvgIcon className={css.icon}>
									<path d={mdiCheckDecagram} fill="#1DA1F2" />
								</SvgIcon>
							</>
						}
						subheader={item && `@${item.user.profileName}`}
						titleTypographyProps={{
							style: {
								...headerStyle,
								fontWeight: 'bold',
								display: 'flex',
								alignItems: 'center',
							},
							onClick: getElement && getElement(SocialElementsEnum.HEADER),
						}}
						className={css.feedHeader}
					/>
				</Grid>

				{item && !!item.photo && !item.video && (
					<Grid item xs={gridXs}>
						<CardMedia
							image={`${item.photo.replace(
								/^http:/,
								'https:',
							)}?format=jpg&name=small`}
							title=""
							style={{height: 0, paddingTop: '55%'}}
						/>
					</Grid>
				)}

				{item && !!item.video && item.isGif && (
					<Grid item xs={gridXs}>
						<CardMedia
							component="video"
							src={`${item.video.replace(/^http:/, 'https:')}`}
							title=""
							autoPlay
							loop
							style={{
								marginBottom: -36,
							}}
						/>
						<GifIcon
							fontSize="large"
							style={{
								position: 'relative',
								bottom: '19px',
								color: 'white',
							}}
						/>
					</Grid>
				)}

				{item && !!item.video && !item.isGif && (
					<Grid item xs={gridXs}>
						<CardMedia
							component="video"
							src={`${item.video.replace(/^http:/, 'https:')}`}
							title=""
							autoPlay
							loop
							muted
						/>
					</Grid>
				)}

				{!twitsHideText && (
					<>
						<Grid item xs={gridXs}>
							<CardContent className={css.feedContent}>
								<Typography
									variant="body2"
									component="div"
									style={textStyle}
									onClick={getElement && getElement(SocialElementsEnum.TEXT)}
								>
									{item && (
										<div style={{whiteSpace: 'pre-wrap'}}>{item.text}</div>
									)}
								</Typography>
							</CardContent>

							<CardContent className={css.feedFaveDate}>
								<Typography
									variant="body2"
									className={css.likeAndDate}
									onClick={getElement && getElement(SocialElementsEnum.DATE)}
									style={timerStyle}
								>
									<SvgIcon className={css.icon}>
										<path d={mdiHeartOutline} />
									</SvgIcon>
									&nbsp;
									{item && item.favoriteCount}
									&nbsp;&nbsp;
									{item && timeFormatted(item.createdAt)}
								</Typography>
							</CardContent>
						</Grid>

						{item && !!item.retweetCount && (
							<Grid item xs={gridFullXs}>
								<CardActions className={css.reply}>
									<SvgIcon className={css.icon}>
										<path d={mdiMessageOutline} />
									</SvgIcon>

									<Typography variant="body2">
										{item.retweetCount} человек(а) говорят об этом
									</Typography>
								</CardActions>
							</Grid>
						)}
					</>
				)}
			</Grid>
		</Card>
	);
};

export default TwitPreview;
