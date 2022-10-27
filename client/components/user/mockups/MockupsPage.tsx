import * as React from 'react';
import {withTracker} from 'react-meteor-data-with-tracker';
import {RouteComponentProps} from 'react-router-dom';
import {Meteor} from 'meteor/meteor';
import Card from '@material-ui/core/Card';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';
import {DragDropContext, Droppable, Draggable, DropResult} from 'react-beautiful-dnd';
import {CardContent} from '@material-ui/core';

import {SlideMockup, ISlideMockup} from 'shared/collections/SlideMockups';
import PageTitle from 'client/components/common/PageTitle';
import DeleteMockupDialog from './DeleteMockupDialog';
import {publishNames} from 'shared/constants/publishNames';
import css from './MockupsPage.pcss';
import {methodNames} from 'shared/constants/methodNames';
import {checkAdmin} from 'shared/utils/user';

interface IScreensPage {
	loading: boolean;
	mockups: ISlideMockup[];
}

class MockupsPage extends React.PureComponent<IScreensPage & RouteComponentProps> {
	handleDragEnd = (result: DropResult) => {
		const {draggableId, destination, source} = result;

		if (!destination || destination.droppableId === source.droppableId) {
			return;
		}

		Meteor.call(methodNames.slideMockups.toggleDefault, draggableId);
	};

	getDroppable = (
		droppableId: string,
		mockups: ISlideMockup[],
		forceView: boolean,
		title: string,
		placeholder: string,
	) => {
		const isAdmin = checkAdmin();

		return (
			<Droppable droppableId={droppableId}>
				{(provided) => (
					<Card style={{marginBottom: 20}}>
						<CardContent>
							<Typography variant="h6">{title}</Typography>
						</CardContent>

						<Table>
							<TableHead>
								<TableRow>
									<TableCell>Макет</TableCell>
									<TableCell>Действие</TableCell>
								</TableRow>
							</TableHead>

							<TableBody ref={provided.innerRef} {...provided.droppableProps}>
								{mockups.length ? (
									mockups.map((mockup, index) => (
										<Draggable
											key={mockup._id}
											draggableId={mockup._id}
											index={index}
											isDragDisabled={!isAdmin}
										>
											{(providedI, snapshotI) => (
												<TableRow
													ref={providedI.innerRef}
													{...providedI.draggableProps}
													{...providedI.dragHandleProps}
												>
													<TableCell>{mockup.name}</TableCell>
													<TableCell>
														{(isAdmin || forceView) && (
															<DeleteMockupDialog
																mockupId={mockup._id}
															/>
														)}
													</TableCell>
												</TableRow>
											)}
										</Draggable>
									))
								) : (
									<TableRow>
										<TableCell colSpan={2}>
											<Typography variant="subtitle2">
												{placeholder}
											</Typography>
										</TableCell>
									</TableRow>
								)}
							</TableBody>
						</Table>

						{provided.placeholder}
					</Card>
				)}
			</Droppable>
		);
	};

	getBody = () => {
		const {mockups, loading} = this.props;

		const mockupUsers = mockups.filter(({isDefault}) => !isDefault);
		const mockupSystem = mockups.filter(({isDefault}) => isDefault);

		if (loading) {
			return <CircularProgress />;
		}

		if (mockups && !mockups.length) {
			return <Typography variant="h6">У вас еще нет макетов</Typography>;
		}

		return (
			<DragDropContext onDragEnd={this.handleDragEnd}>
				{this.getDroppable(
					'system',
					mockupSystem,
					false,
					'Системные',
					'Системных макетов нет',
				)}

				{this.getDroppable('user', mockupUsers, true, 'Личные', 'Личных макетов нет')}
			</DragDropContext>
		);
	};

	render() {
		return (
			<div>
				<PageTitle
					title="Макеты"
					description="Используйте макеты, чтобы экономить время при создании однотипных слайдшоу и
						отдельных слайдов. Чтобы добавить выбранный слайд в макеты нажмите в
						редакторе &laquo;Добавить в макеты&raquo;."
				/>

				<div className={css.tableCard}>{this.getBody()}</div>
			</div>
		);
	}
}

export default withTracker<{}, RouteComponentProps>(() => {
	const sub = Meteor.subscribe(publishNames.mockups.userMockups);
	const loading = !sub.ready();

	return {
		loading,
		mockups: SlideMockup.find({}).fetch(),
	};
})(MockupsPage);
