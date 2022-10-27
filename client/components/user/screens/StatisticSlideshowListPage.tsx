import React, {useState, useEffect} from 'react';
import {withTracker} from 'react-meteor-data-with-tracker';
import {RouteComponentProps, useRouteMatch, useHistory, Link, Redirect} from 'react-router-dom';
import {Meteor} from 'meteor/meteor';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import CircularProgress from '@material-ui/core/CircularProgress';
import Card from '@material-ui/core/Card';
import Typography from '@material-ui/core/Typography';
import {CsvBuilder} from 'filefy';
import EqualizerIcon from '@material-ui/icons/Equalizer';
import {Grid, AppBar, Toolbar, Avatar} from '@material-ui/core';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import {publishNames} from 'shared/constants/publishNames';
import routerUrls from 'client/constants/routerUrls';
import {ISlideshow, Slideshow} from 'shared/collections/Slideshows';
import PageTitle from 'client/components/common/PageTitle';
import {methodNames} from 'shared/constants/methodNames';
import {checkAdmin} from 'shared/utils/user';
import css from './SlideshowListPage.pcss';
import {Group, IGroup} from 'shared/collections/Groups';
import {deepOrange} from '@material-ui/core/colors';
import {pluralize} from 'shared/utils/tools';
import {makeStyles} from '@material-ui/core/styles';
import {IStatisticsGroupTotalItem, IStatisticsResultItem} from 'shared/collections/Statistics';
import {renderElementIcon, renderElementName} from 'client/utils/elements';
import {PaidServiceOrder, PaidServicePackagesEnum} from 'shared/collections/PaidServices';

interface IScreensPageData {
	groups: IGroup[];
	loading: boolean;
	slideshowList: ISlideshow[];
	permissions: PaidServicePackagesEnum[];
}

const getTotalStat = (
	row: IStatisticsResultItem[],
	interval: string,
	groupTotal: IStatisticsGroupTotalItem,
) => {
	const days = row?.map((a) => a[interval][0]).reduce((a, b) => a + b, 0);
	const time = row?.map((a) => a[interval][1]).reduce((a, b) => a + b, 0);
	groupTotal[interval] = {days, time};
};

const DEEP_INDEX = 500;
const SMALL_SPACING = 2;

export const useStyles = makeStyles((theme) => ({
	rootList: {
		display: 'flex',
		'& > *': {
			margin: theme.spacing(1),
		},
	},
	small: {
		width: theme.spacing(SMALL_SPACING),
		height: theme.spacing(SMALL_SPACING),
		color: theme.palette.getContrastText(deepOrange[DEEP_INDEX]),
		backgroundColor: deepOrange[DEEP_INDEX],
		fontSize: 11,
	},
}));

const SlideshowListPage: React.FC<IScreensPageData> = (props) => {
	const {loading, groups, slideshowList, permissions} = props;
	const [selectedGroup, setSelectedGroup] = useState('');
	const [groupsStatistics, setGroupsStatistics] = useState([] as IStatisticsResultItem[][]);
	const [groupsStatisticsTotal, setGroupsStatisticsTotal] = useState(
		[] as IStatisticsGroupTotalItem[],
	);
	const {
		params: {groupId},
	} = useRouteMatch();
	const history = useHistory();

	const classes = useStyles();

	useEffect(() => {
		if (!groups.length) {
			return;
		}

		setSelectedGroup(groupId);
	}, [loading]);

	const slideshowListByGroup = slideshowList.filter(({groupId: gId}) => gId === selectedGroup);
	const slideshowListByGroupIds = slideshowListByGroup.map((g) => g._id);

	useEffect(() => {
		if (!slideshowListByGroup.length) {
			return;
		}
		Meteor.call(
			methodNames.statistics.getSlideShows,
			slideshowListByGroupIds,
			(error: object, results: IStatisticsResultItem[][]) => {
				if (error) {
					console.log('Ошибка');
				} else {
					setGroupsStatistics(results);
					const groupTotal: IStatisticsGroupTotalItem[] = [];
					results.forEach((res, index) => {
						const groupTotalRow = {} as IStatisticsGroupTotalItem;
						getTotalStat(results[index], 'today', groupTotalRow);
						getTotalStat(results[index], 'week', groupTotalRow);
						getTotalStat(results[index], 'month', groupTotalRow);
						groupTotal.push(groupTotalRow);
					});
					setGroupsStatisticsTotal(groupTotal);
				}
			},
		);
		// https://stackoverflow.com/a/59468261/1105534
	}, [JSON.stringify(slideshowListByGroupIds)]);

	const onButtonClick = () => {
		const csvBuilder = new CsvBuilder('слайд-шоу.csv')
			.setDelimeter(';')
			.setColumns([
				'',
				'Сегодня кол.',
				'Сегодня мин.',
				'Неделя кол.',
				'Неделя мин.',
				'Месяц кол.',
				'Месяц мин.',
				'Всего',
			]);

		slideshowListByGroup
			.filter(({isSystem}) => !isSystem || checkAdmin())
			.forEach((slideshow, index) => {
				csvBuilder.addRow([
					slideshow.name,
					String(groupsStatisticsTotal[index]?.today?.days),
					String(groupsStatisticsTotal[index]?.today?.time),
					String(groupsStatisticsTotal[index]?.week?.days),
					String(groupsStatisticsTotal[index]?.week?.time),
					String(groupsStatisticsTotal[index]?.month?.days),
					String(groupsStatisticsTotal[index]?.month?.time),
				]);
				groupsStatistics[index]?.forEach((el) =>
					csvBuilder.addRow([
						`${renderElementName(el.type)} (${el.slidesCount})`,
						String(el.today?.[0]),
						String(el.today?.[1]),
						String(el.week?.[0]),
						String(el.week?.[1]),
						String(el.month?.[0]),
						String(el.month?.[1]),
						String(el.daysPassed),
					]),
				);
			});
		csvBuilder.exportFile();
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
						Нет слайдшоу с рекламными элементами
					</Typography>
				</div>
			);
		}

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
										routerUrls.statisticsGroup.replace(':groupId', _id),
									);
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
											</Grid>
										}
										value={_id}
										onClick={handleSelectGroup}
									/>
								);
							})}
						</Tabs>
					</Toolbar>
				</AppBar>

				{!slideshowListByGroup.length && (
					<>
						<Typography align="center" gutterBottom>
							В выбранной группе нет слайдшоу с рекламными элементами
						</Typography>
					</>
				)}

				{!!slideshowListByGroup.length && (
					<Table size="medium" className={css.table}>
						<TableHead>
							<TableRow>
								<TableCell></TableCell>
								<TableCell>Сегодня (кол./мин.)</TableCell>
								<TableCell>Неделя (кол./мин.)</TableCell>
								<TableCell>Месяц (кол./мин.)</TableCell>
								<TableCell style={{width: 80}}>Всего</TableCell>
								{/*<TableCell style={{width: 80}}></TableCell>*/}
							</TableRow>
						</TableHead>

						<TableBody>
							{slideshowListByGroup
								.filter(({isSystem}) => !isSystem || checkAdmin())
								.map((slideshow, index) => (
									<React.Fragment key={slideshow._id}>
										<TableRow key={slideshow._id}>
											<TableCell>
												<Link
													to={routerUrls.statisticsViewSlideshow.replace(
														':id',
														slideshow._id,
													)}
												>
													{slideshow.name}
												</Link>
											</TableCell>
											<TableCell>
												{groupsStatisticsTotal[
													index
												]?.today?.days?.toLocaleString()}
												/
												{groupsStatisticsTotal[
													index
												]?.today?.time?.toLocaleString()}
											</TableCell>
											<TableCell>
												{groupsStatisticsTotal[
													index
												]?.week?.days?.toLocaleString()}
												/
												{groupsStatisticsTotal[
													index
												]?.week?.time?.toLocaleString()}
											</TableCell>
											<TableCell>
												{groupsStatisticsTotal[
													index
												]?.month?.days?.toLocaleString()}
												/
												{groupsStatisticsTotal[
													index
												]?.month?.time?.toLocaleString()}
											</TableCell>
											<TableCell></TableCell>
											{/*<TableCell>*/}
											{/*	<IconButton onClick={showGraphs(slideshow._id)}>*/}
											{/*		<EqualizerIcon />*/}
											{/*	</IconButton>*/}
											{/*</TableCell>*/}
										</TableRow>
										{groupsStatistics[index]?.map((el, elemIndex) => (
											<TableRow key={`slide_${slideshow._id}_${elemIndex}`}>
												<TableCell>
													<div className={classes.rootList}>
														{renderElementIcon(el.type, '#757581')}
														<Link
															to={routerUrls.statisticsViewElement.replace(
																':id',
																el.id,
															)}
														>
															<span>
																{renderElementName(el.type)}
															</span>
														</Link>
														{el.statisticId && (
															<Link
																to={routerUrls.statisticsViewStatId.replace(
																	':statId',
																	el.statisticId,
																)}
															>
																<span
																	title={`Идентификатор элемента для рекламной компании: ${el.statisticId}`}
																>
																	{el.statisticId}
																</span>
															</Link>
														)}
														{el.slidesCount && el.slidesCount > 1 && (
															<Avatar className={classes.small}>
																{el.slidesCount}
															</Avatar>
														)}
													</div>
												</TableCell>
												<TableCell>
													{el.today?.[0]?.toLocaleString()}/
													{el.today?.[1]?.toLocaleString()}
												</TableCell>
												<TableCell>
													{el.week?.[0]?.toLocaleString()}/
													{el.week?.[1]?.toLocaleString()}
												</TableCell>
												<TableCell>
													{el.month?.[0]?.toLocaleString()}/
													{el.month?.[1]?.toLocaleString()}
												</TableCell>
												<TableCell>
													{el.daysPassed
														? `${el.daysPassed} ${pluralize(
																el.daysPassed,
																'',
																'день',
																'дня',
																'дней',
														  )}`
														: el.daysPassed === 0
														? 'Сегодня'
														: ''}
												</TableCell>
												{/*<TableCell>*/}
												{/*	<IconButton onClick={showGraphs(slideshow._id)}>*/}
												{/*		<EqualizerIcon />*/}
												{/*	</IconButton>*/}
												{/*</TableCell>*/}
											</TableRow>
										))}
									</React.Fragment>
								))}
						</TableBody>
					</Table>
				)}
			</Card>
		);
	};

	if (!loading) {
		if (
			!(Array.isArray(permissions) ? permissions : []).includes(
				PaidServicePackagesEnum.STATISTICS,
			)
		) {
			return <Redirect to={routerUrls.userPlan} />;
		}
	}

	return (
		<div className={css.container}>
			<PageTitle
				title="Статистика показов"
				buttonTitle="Скачать в формате CSV"
				onButtonClick={onButtonClick}
				CustomIcon={EqualizerIcon}
			/>
			{getPageContent()}
		</div>
	);
};

export default withTracker<IScreensPageData, RouteComponentProps>(() => {
	const subMyList = Meteor.subscribe(publishNames.slideshow.myListForStat).ready();
	const subGroups = Meteor.subscribe(publishNames.group.groups).ready();
	const psoSubscriber = Meteor.subscribe(publishNames.paidServices.orders).ready();
	const loading = !subMyList || !subGroups || !psoSubscriber;

	const groups = Group.find().fetch();
	const slideShows = Slideshow.find({}, {sort: {createdAt: -1}}).fetch();
	const pso = PaidServiceOrder.findOne();
	const permissions: string[] = pso?.permissions || [];

	return {
		loading,
		groups,
		slideshowList: slideShows,
		permissions,
	};
})(SlideshowListPage);
