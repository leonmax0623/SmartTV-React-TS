import React, {useState, useEffect} from 'react';
import {withTracker} from 'react-meteor-data-with-tracker';
import {RouteComponentProps, Link, useRouteMatch, useHistory} from 'react-router-dom';
import {Meteor} from 'meteor/meteor';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import CircularProgress from '@material-ui/core/CircularProgress';
import IconButton from '@material-ui/core/IconButton';
import Card from '@material-ui/core/Card';
import EditIcon from '@material-ui/icons/Edit';
import LockIcon from 'client/components/common/icons/LockIcon';
import RemoveRedEyeIcon from '@material-ui/icons/RemoveRedEye';
import Typography from '@material-ui/core/Typography';
import {push} from 'connected-react-router';
import Button from '@material-ui/core/Button';
import CloneIcon from '@material-ui/icons/Layers';
import SendIcon from '@material-ui/icons/Send';
import RepeatIcon from '@material-ui/icons/Repeat';
import EqualizerIcon from '@material-ui/icons/Equalizer';
import {connect} from 'react-redux';
import {Switch, Grid, AppBar, Toolbar} from '@material-ui/core';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import MenuIcon from '@material-ui/icons/Menu';
import AddIcon from '@material-ui/icons/Add';
import SettingsIcon from '@material-ui/icons/Settings';

import {format} from 'shared/utils/dates';
import {publishNames} from 'shared/constants/publishNames';
import routerUrls from 'client/constants/routerUrls';
import DeleteAppDialog from './DeleteAppDialog';
import ChangeAppNumberDialog from './ChangeAppNumberDialog';
import {ISlideshow, Slideshow, SlideshowLocationText} from 'shared/collections/Slideshows';
import {
	createSlideshow,
	toggleEditorSettingsPanel,
	updateSlideshowParams,
} from 'client/actions/slideShowEditor';
import PageTitle from 'client/components/common/PageTitle';
import {methodNames} from 'shared/constants/methodNames';
import {checkAdmin, checkRole} from 'shared/utils/user';
// @ts-ignore
import css from './SlideshowListPage.pcss';
import SendSlideShowDialog from 'client/components/user/screens/SendSlideShowDialog';
import AddSlideShowGroupDialog from 'client/components/user/screens/AddSlideShowGroupDialog';
import EditSlideShowGroupDialog from 'client/components/user/screens/EditSlideShowGroupDialog';
import {Group, IGroup} from 'shared/collections/Groups';
import appConsts from 'client/constants/appConsts';
import {PaidServicePackagesEnum} from 'shared/collections/PaidServices';

interface IScreensPageData {
	groups: IGroup[];
	loading: boolean;
	slideshowList: ISlideshow[];
}

interface IScreensPageProps extends RouteComponentProps {
	createSlideshow: (groupId: string) => Promise<any>;
	push: typeof push;
	toggleEditorSettingsPanel: typeof toggleEditorSettingsPanel;
	updateSlideshowParams: typeof updateSlideshowParams;
}

const SlideshowListPage: React.FC<IScreensPageProps & IScreensPageData> = (props) => {
	const {loading, groups} = props;
	const {slideshowList} = props;
	const [sendSlideShowDialog, setSendSlideShowDialog] = useState<null | string>(null);
	const [changeSlideNumberShowDialog, setChangeSlideNumberShowDialog] = useState<null | string>(
		null,
	);
	const [addSlideShowGroupDialog, setAddSlideShowGroupDialog] = useState(false);
	const [editSlideShowGroupDialog, setEditSlideShowGroupDialog] = useState(false);
	const [selectedGroup, setSelectedGroup] = useState('');
	const [isStatisticsVisible, setStatisticsVisible] = useState(false);
	const [isStatisticsGranted, setStatisticsGranted] = useState(false);

	const {
		params: {groupId},
	} = useRouteMatch();
	const history = useHistory();

	useEffect(() => {
		setStatisticsVisible(true);
		Meteor.call(
			methodNames.paidServices.isGranted,
			[PaidServicePackagesEnum.STATISTICS],
			(error: Error | Meteor.Error, response: boolean) => {
				setStatisticsGranted(!!response[PaidServicePackagesEnum.STATISTICS]);
			},
		);
	}, []);

	useEffect(() => {
		if (!groups.length) {
			return;
		}

		setSelectedGroup(groupId);
	}, [loading]);

	const slideshowListByGroup = slideshowList.filter(({groupId: gId}) => gId === selectedGroup);

	const handleCloseAddSlideShowDialog = () => setAddSlideShowGroupDialog(false);
	const handleCloseEditSlideShowDialog = () => setEditSlideShowGroupDialog(false);
	const handleSuccessEditSlideShowDialog = () => {
		setEditSlideShowGroupDialog(false);
	};
	const handleDeleteEditSlideShowDialog = () => {
		setEditSlideShowGroupDialog(false);
		setSelectedGroup(groups[0]._id);
	};

	const handleCloseSendSlideShowDialog = () => setSendSlideShowDialog(null);
	const handleSuccessSendSlideShowDialog = () => setSendSlideShowDialog(null);

	const handleCloseChangeSlideNumberShowDialog = () => setChangeSlideNumberShowDialog(null);
	const handleSuccessChangeSlideNumberShowDialog = () => setChangeSlideNumberShowDialog(null);

	const handlePreviewApp = (orientation: string, appId: string) => (event: React.MouseEvent) => {
		// preview the app in a separate window to imitate TV
		event.preventDefault();
		let height = 720;
		let verticalWidth;

		if (orientation === 'vertical') {
			height = 850;
			verticalWidth = (height / 16) * 9;
		}

		const url = routerUrls.userViewSlideshow.replace(':id', appId);
		window.open(
			url,
			'prtvPreview',
			`width=${verticalWidth || 1280},height=${height},toolbar=0,location=0,menubar=0`,
		);
	};

	const handleCopyApp = (slideshowId: string) => () => {
		Meteor.call(
			methodNames.slideshow.copySlideShow,
			slideshowId,
			(error: Error | Meteor.Error) => {
				if (error) {
					console.log('Ошибка');
				}
			},
		);
	};

	const handleSendApp = (slideshowId: string) => () => setSendSlideShowDialog(slideshowId);
	const handleChangeNumber = (slideshowId: string) => () =>
		setChangeSlideNumberShowDialog(slideshowId);

	const handleToggleSystem = (slideshow: ISlideshow) => () => {
		props.updateSlideshowParams(slideshow, {isSystem: !slideshow.isSystem});
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
						У вас еще нет слайдшоу
					</Typography>

					<Button
						className={css.createFirstSlideshowButton}
						variant="outlined"
						color="primary"
						size="large"
						onClick={handleCreateSlideshow}
					>
						Создать первое слайдшоу
					</Button>
				</div>
			);
		}
		const isAdmin = checkAdmin();
		const canViewSystem = checkRole(undefined, 'template_editor') || isAdmin;

		return (
			<Card className={css.tableCard}>
				<AppBar position="static" color="default" className={css.groupsAppBar}>
					<Toolbar disableGutters variant={'dense'}>
						<Tabs
							value={
								groups.find(({_id}) => _id === selectedGroup)
									? selectedGroup
									: groups[0]._id
							}
							indicatorColor="primary"
							textColor="primary"
							variant={'scrollable'}
							scrollButtons="desktop"
							TabIndicatorProps={{children: <div />}}
						>
							{groups.map(({_id, name}) => {
								const handleSelectGroup = () => {
									setSelectedGroup(_id);
									history.push(
										routerUrls.userSlideshowGroup.replace(':groupId', _id),
									);
								};

								const handleEditSlideShowGroup = (e: React.ChangeEvent<{}>) => {
									e.preventDefault();

									setEditSlideShowGroupDialog(true);
								};

								return (
									<Tab
										key={_id}
										classes={{
											root: css.groupTab,
											textColorPrimary: css.groupName,
											selected: css.selected,
										}}
										label={
											<Grid container alignItems={'center'}>
												<Grid item sm>
													{name}
												</Grid>

												{_id === selectedGroup && (
													<Grid item>
														<IconButton
															onClick={handleEditSlideShowGroup}
															className={css.groupIcon}
														>
															<SettingsIcon fontSize={'small'} />
														</IconButton>
													</Grid>
												)}
											</Grid>
										}
										value={_id}
										onClick={handleSelectGroup}
									/>
								);
							})}
						</Tabs>

						<IconButton
							onClick={() => setAddSlideShowGroupDialog(true)}
							className={css.addGroupButton}
						>
							<AddIcon />
						</IconButton>
					</Toolbar>
				</AppBar>

				{!slideshowListByGroup.length && (
					<>
						<Typography align="center" gutterBottom>
							В выбранной группе нет слайдшоу
						</Typography>

						<Button
							className={css.createFirstSlideshowButton}
							variant="outlined"
							color="primary"
							size="large"
							onClick={handleCreateSlideshow}
						>
							Создать слайдшоу
						</Button>
					</>
				)}

				{!!slideshowListByGroup.length && (
					<Table size="small" className={css.table}>
						<TableHead>
							<TableRow>
								<TableCell>Фото</TableCell>
								<TableCell>Название</TableCell>
								<TableCell>Адрес</TableCell>
								<TableCell>Вид помещения</TableCell>
								<TableCell>Дата создания</TableCell>
								<TableCell>Номер для ТВ</TableCell>
								<TableCell style={{width: 280}}>Действия</TableCell>
								{canViewSystem && <TableCell>Системный</TableCell>}
							</TableRow>
						</TableHead>

						<TableBody>
							{slideshowListByGroup
								.filter(({isSystem}) => !isSystem || canViewSystem)
								.map((slideshow) => (
									<TableRow key={slideshow._id}>
										<TableCell>
											<div className="small-photo">
												<img
													src={
														slideshow.previewImage
															? `${appConsts.uploadUrl}/${slideshow.previewImage}`
															: `${appConsts.imgUrl}/not_slideshow_img.png`
													}
													alt=""
												/>
											</div>
										</TableCell>

										<TableCell>{slideshow.name}</TableCell>
										<TableCell>{slideshow.address}</TableCell>
										<TableCell>
											{SlideshowLocationText[slideshow.location]}
										</TableCell>
										<TableCell>
											{format(slideshow.createdAt, 'd MMM yyyy')}
										</TableCell>

										<TableCell>prtv.su/{slideshow.numId}</TableCell>

										<TableCell>
											<IconButton
												onClick={handlePreviewApp(
													slideshow.orientation,
													slideshow.numId,
												)}
											>
												<RemoveRedEyeIcon />
											</IconButton>

											<Link
												to={routerUrls.userEditSlideshow.replace(
													':id',
													slideshow._id,
												)}
											>
												<IconButton>
													<EditIcon />
												</IconButton>
											</Link>

											<IconButton onClick={handleCopyApp(slideshow._id)}>
												<CloneIcon />
											</IconButton>

											{!slideshow.isSystem && (
												<IconButton onClick={handleSendApp(slideshow._id)}>
													<SendIcon />
												</IconButton>
											)}

											<DeleteAppDialog slideshowId={slideshow._id} />
											{isAdmin && (
												<IconButton
													onClick={handleChangeNumber(slideshow._id)}
												>
													<RepeatIcon />
												</IconButton>
											)}
										</TableCell>

										{canViewSystem && (
											<TableCell>
												{isAdmin && (
													<Switch
														size="small"
														checked={slideshow.isSystem}
														onChange={handleToggleSystem(slideshow)}
													/>
												)}
												{!isAdmin && (slideshow.isSystem ? 'Да' : 'Нет')}
											</TableCell>
										)}
									</TableRow>
								))}
						</TableBody>
					</Table>
				)}
			</Card>
		);
	};

	const handleCreateSlideshow = () => {
		props.createSlideshow(groupId).then((slideshowId: string) => {
			props.toggleEditorSettingsPanel(true);

			props.push(routerUrls.userEditSlideshow.replace(':id', slideshowId));
		});
	};

	return (
		<div className={css.container}>
			<PageTitle
				title="Слайдшоу"
				buttonTitle="Создать слайдшоу"
				onButtonClick={handleCreateSlideshow}
				extButtons={
					<>
						<Link to={routerUrls.userSelectTemplate} className={css.makeSystem}>
							<Button variant="outlined" color="primary" className={css.button}>
								<MenuIcon className={css.buttonIcon} />
								Создать из системных
							</Button>
						</Link>
						{isStatisticsVisible && (
							<Button
								variant="outlined"
								color="primary"
								className={css.button}
								style={isStatisticsGranted ? {} : {cursor: 'not-allowed'}}
								href={
									isStatisticsGranted
										? routerUrls.statisticsGroup.replace(':groupId', groupId)
										: ''
								}
							>
								Статистика
								<EqualizerIcon />
								{!isStatisticsGranted && (
									<LockIcon
										viewBox="0 0 11 14"
										style={{width: '11px', height: '14px'}}
										fill="none"
										pathProps={{
											fill: '#3f51b5',
											fillOpacity: '0.54',
										}}
									/>
								)}
							</Button>
						)}
					</>
				}
			/>

			<ChangeAppNumberDialog
				slideshowId={changeSlideNumberShowDialog}
				isOpen={!!changeSlideNumberShowDialog}
				onClose={handleCloseChangeSlideNumberShowDialog}
				onSuccess={handleSuccessChangeSlideNumberShowDialog}
			/>

			<SendSlideShowDialog
				slideshowId={sendSlideShowDialog}
				isOpen={!!sendSlideShowDialog}
				onClose={handleCloseSendSlideShowDialog}
				onSuccess={handleSuccessSendSlideShowDialog}
			/>

			<AddSlideShowGroupDialog
				isOpen={addSlideShowGroupDialog}
				onClose={handleCloseAddSlideShowDialog}
				onSuccess={handleCloseAddSlideShowDialog}
			/>

			<EditSlideShowGroupDialog
				isOpen={editSlideShowGroupDialog}
				group={groups.find(({_id}) => _id === selectedGroup)}
				onClose={handleCloseEditSlideShowDialog}
				onSuccess={handleSuccessEditSlideShowDialog}
				onDelete={handleDeleteEditSlideShowDialog}
			/>

			{getPageContent()}
		</div>
	);
};

export default withTracker(
	(): IScreensPageData => {
		const subMyList = Meteor.subscribe(publishNames.slideshow.myList).ready();
		const subGroups = Meteor.subscribe(publishNames.group.groups).ready();
		const groups = Group.find().fetch();
		const loading = !subMyList || !subGroups;

		return {
			loading,
			groups,
			slideshowList: Slideshow.find({}, {sort: {createdAt: -1}}).fetch(),
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
