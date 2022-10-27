import React from 'react';
import {
	Box,
	Button,
	Card,
	CardActionArea,
	CardActions,
	CardContent,
	CardMedia,
	Chip,
	CircularProgress,
	makeStyles,
	Typography,
} from '@material-ui/core';
import secondsPretty from 'client/utils/secondsPretty';

interface IVideoCard {
	active: boolean;
	title: string;
	previewUrl?: string;
	link?: string;
	onRemove: () => void;
	onRename: () => void;
	onOpen: () => void;
	loading?: boolean;
	duration?: number;
}

const useStyles = makeStyles({
	root: {
		position: 'relative',
	},
	media: {
		position: 'relative',
		height: 240,
	},
	chips: {
		display: 'flex',
		position: 'absolute',
		top: 10,
		left: 10,
		right: 10,
	},
	actionArea: {
		position: 'relative',
	},
	loadingWrap: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		position: 'absolute',
		zIndex: 10,
		top: 0,
		right: 0,
		bottom: 0,
		left: 0,
		backgroundColor: 'rgba(255, 255, 255, 0.4)',
		color: '#3F51B5',
	},
	durationChip: {
		position: 'absolute',
		right: 10,
		bottom: 10,
	},
});

const VideoCard: React.FC<IVideoCard> = ({
	active,
	title,
	previewUrl,
	link,
	duration,
	loading,
	onRemove,
	onRename,
	onOpen,
}) => {
	const classes = useStyles();
	const CardActionAreaComponent = active ? CardActionArea : Box;
	const durationPretty = duration ? secondsPretty(duration) : 0;

	return (
		<Card className={classes.root}>
			<CardActionAreaComponent
				href={active && link ? link : ''}
				target={active ? '_blank' : ''}
				className={classes.actionArea}
				onClick={onOpen}
			>
				<CardMedia
					className={classes.media}
					image={previewUrl ? previewUrl : '/public/img/default-video-thumbnail.jpeg'}
					title="Contemplative Reptile"
				>
					{!active ? (
						<Box className={classes.chips}>
							<Chip label="Обрабатывается" />
						</Box>
					) : (
						''
					)}
					{durationPretty ? (
						<Chip className={classes.durationChip} label={durationPretty} />
					) : (
						''
					)}
				</CardMedia>
				<CardContent>
					<Typography gutterBottom variant="h5" component="h2">
						{title}
					</Typography>
				</CardContent>
			</CardActionAreaComponent>
			{active ? (
				<CardActions>
					<Button size="small" color="primary" onClick={onRename}>
						Переименовать
					</Button>
					<Box color="red">
						<Button size="small" color="inherit" onClick={onRemove}>
							Удалить
						</Button>
					</Box>
				</CardActions>
			) : (
				''
			)}
			{loading ? (
				<Box className={classes.loadingWrap}>
					<CircularProgress color="inherit" />
				</Box>
			) : (
				''
			)}
		</Card>
	);
};

export default VideoCard;
