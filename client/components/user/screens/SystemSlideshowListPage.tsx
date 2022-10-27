import React, {useState, useEffect} from 'react';
import {withTracker} from 'react-meteor-data-with-tracker';
import {RouteComponentProps, useRouteMatch, useHistory} from 'react-router-dom';
import {Meteor} from 'meteor/meteor';
import CircularProgress from '@material-ui/core/CircularProgress';
import Card from '@material-ui/core/Card';
import Typography from '@material-ui/core/Typography';
import {push} from 'connected-react-router';
import Button from '@material-ui/core/Button';
import {connect} from 'react-redux';
import {
	Grid,
	AppBar,
	List,
	ListItem,
	ListItemText,
	CardActionArea,
	CardMedia,
	CardContent,
} from '@material-ui/core';
import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';

import {publishNames} from 'shared/constants/publishNames';
import routerUrls from 'client/constants/routerUrls';
import {ISlideshow, Slideshow} from 'shared/collections/Slideshows';
import {
	createSlideshow,
	toggleEditorSettingsPanel,
	updateSlideshowParams,
} from 'client/actions/slideShowEditor';
import PageTitle from 'client/components/common/PageTitle';
import {methodNames} from 'shared/constants/methodNames';
import css from './SlideshowListPage.pcss';
import {SystemGroup, ISystemGroup} from 'shared/collections/SystemGroups';
import appConsts from 'client/constants/appConsts';
import CardActions from '@material-ui/core/CardActions';
import RemoveRedEyeIcon from '@material-ui/icons/RemoveRedEye';

interface IScreensPageData {
	groups: ISystemGroup[];
	loading: boolean;
	slideshowList: ISlideshow[];
}

interface IScreensPageProps extends RouteComponentProps {
	createSlideshow: (groupId: string) => Promise<any>;
	push: typeof push;
	toggleEditorSettingsPanel: typeof toggleEditorSettingsPanel;
	updateSlideshowParams: typeof updateSlideshowParams;
}

const drawerWidth = 240;

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		appBar: {
			zIndex: theme.zIndex.drawer + 1,
		},
		drawer: {
			width: drawerWidth,
			flexShrink: 0,
		},
		drawerPaper: {
			width: drawerWidth,
		},
		drawerContainer: {
			overflow: 'auto',
		},
		root: {
			maxWidth: 345,
		},
		media: {
			height: 140,
		},
		gridRoot: {
			flexGrow: 1,
		},
	}),
);

const MAX_LENGTH_LINE_BREAK = 19;

function addSpace(title: string) {
	// 19 длина для перехода на другую строку
	if (title.length >= MAX_LENGTH_LINE_BREAK) {
		return title;
	}
	const indexOfSpace = title.search(' ');
	if (indexOfSpace === -1) {
		return `${title}\n\uFEFF`;
	}
	const firstPart = title.slice(0, indexOfSpace);
	const secondPart = title.slice(indexOfSpace + 1);
	return `${firstPart}\n${secondPart}`;
}

const SlideshowListPage: React.FC<IScreensPageProps & IScreensPageData> = (props) => {
	const classes = useStyles();

	const {loading, groups} = props;
	const {slideshowList} = props;
	const [selectedGroup, setSelectedGroup] = useState('');
	const {
		params: {groupId},
	} = useRouteMatch();
	const history = useHistory();

	useEffect(() => {
		if (!groups.length) {
			return;
		}
		if (groupId) {
			setSelectedGroup(groupId);
		} else {
			setSelectedGroup(groups[0]?._id || '');
		}
	}, [loading]);

	const slideshowListByGroup = slideshowList.filter(
		({systemGroupId: gId}) => gId === selectedGroup,
	);

	const handleViewSlideshowButton = (numId: string) => () => {
		const win = window.open(routerUrls.userViewSlideshow.replace(':id', numId), '_blank');

		win!.focus();
	};

	const handleAddFromSystem = (slideshowId: string) => () => {
		Meteor.call(
			methodNames.slideshow.copySlideShow,
			slideshowId,
			(error: Error | Meteor.Error, newSlideshowId: string) => {
				if (error) {
					console.log('Ошибка');
				} else {
					props.toggleEditorSettingsPanel(true);
					props.push(routerUrls.userEditSlideshow.replace(':id', newSlideshowId));
				}
			},
		);
	};

	const getPageContent = () => {
		if (loading) {
			return (
				<div className={css.centre}>
					<Typography variant="h6" gutterBottom>
						Загружаем ваши слайдшоу...
					</Typography>

					<CircularProgress />
				</div>
			);
		}

		if (slideshowList && !slideshowList.length) {
			return (
				<div className={css.centre}>
					<Typography variant="h6" gutterBottom>
						Не найдено
					</Typography>
				</div>
			);
		}

		return (
			<Card className={css.tableCard}>
				<AppBar
					position="static"
					color="default"
					className={`${css.groupsAppBar} ${classes.appBar}`}
				/>
				<div
					style={{
						float: 'left',
						position: 'fixed',
						left: 16,
						top: 130,
						backgroundColor: 'white',
					}}
				>
					<div className={classes.drawerContainer}>
						<List>
							{groups.map(({_id, name}) => {
								const handleSelectGroup = () => {
									setSelectedGroup(_id);
									history.push(
										routerUrls.userSelectTemplateGroup.replace(':groupId', _id),
									);
								};

								return (
									<ListItem
										button
										key={_id}
										onClick={handleSelectGroup}
										selected={selectedGroup === _id}
									>
										<ListItemText primary={name} />
									</ListItem>
								);
							})}
						</List>
					</div>
				</div>
				{!slideshowListByGroup.length && (
					<>
						<Typography align="center" gutterBottom>
							В выбранной группе нет слайдшоу
						</Typography>
					</>
				)}
				<div style={{marginLeft: 300, minHeight: 474}}>
					<Grid item xs={12}>
						{!!slideshowListByGroup.length && (
							<Grid container spacing={4}>
								{slideshowListByGroup.map((slideshow) => (
									<Grid key={slideshow?._id} item style={{width: 304}}>
										<Card className={classes.root}>
											<CardActionArea
												onClick={handleViewSlideshowButton(slideshow.numId)}
											>
												<CardMedia
													className={classes.media}
													image={
														slideshow.previewImage
															? `${appConsts.uploadUrl}/${slideshow.previewImage}`
															: `${appConsts.imgUrl}/not_slideshow_img.png`
													}
													title="Contemplative Reptile"
												/>
												<CardContent style={{whiteSpace: 'pre-wrap'}}>
													<Typography
														gutterBottom
														variant="h5"
														component="h2"
														display="inline"
													>
														{addSpace(slideshow.name)}
													</Typography>
												</CardContent>
											</CardActionArea>
											<CardActions>
												<Button
													size="small"
													color="primary"
													onClick={handleViewSlideshowButton(
														slideshow.numId,
													)}
													endIcon={<RemoveRedEyeIcon />}
												>
													{slideshow.numId}
												</Button>
												<Button
													size="small"
													color="primary"
													onClick={handleAddFromSystem(slideshow._id)}
												>
													Забрать
												</Button>
											</CardActions>
										</Card>
									</Grid>
								))}
							</Grid>
						)}
					</Grid>
				</div>
			</Card>
		);
	};

	return (
		<div className={css.container}>
			<PageTitle title="Системные слайдшоу" buttonTitle="Создать слайдшоу" />
			{getPageContent()}
		</div>
	);
};

export default withTracker(
	(): IScreensPageData => {
		const subMyList = Meteor.subscribe(publishNames.slideshow.systemList).ready();
		const subGroups = Meteor.subscribe(publishNames.system_group.groups).ready();
		const groups = SystemGroup.find({}, {sort: {order: 1}}).fetch();
		const loading = !subMyList || !subGroups;

		return {
			loading,
			groups,
			slideshowList: Slideshow.find({isSystem: true}, {sort: {createdAt: -1}}).fetch(),
		};
	},
)(
	connect<RouteComponentProps>(null, {
		createSlideshow,
		push,
		toggleEditorSettingsPanel,
		updateSlideshowParams,
	})(SlideshowListPage),
);
