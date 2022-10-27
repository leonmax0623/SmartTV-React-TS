import * as React from 'react';
import {Meteor} from 'meteor/meteor';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import CircularProgress from '@material-ui/core/CircularProgress';
import IconButton from '@material-ui/core/IconButton';
import Card from '@material-ui/core/Card';
import RemoveRedEyeIcon from '@material-ui/icons/RemoveRedEye';
import Typography from '@material-ui/core/Typography';
import EditIcon from '@material-ui/icons/Edit';
import {withTracker} from 'react-meteor-data-with-tracker';
import {RouteComponentProps} from 'react-router';
import {connect} from 'react-redux';
import {push} from 'connected-react-router';

import {AppSets, IAppsetsFeed} from 'shared/collections/AppSets';
import routerUrls from '../../../constants/routerUrls';
import DeleteAppsetDialog from './DeleteAppsetDialog';
import {publishNames} from 'shared/constants/publishNames';
import css from './AppSetsPage.pcss';
import PageTitle from 'client/components/common/PageTitle';

interface IAppSetsPageProps {
	loading: boolean;
	appsets: IAppsetsFeed[];
	push: typeof push;
}

class AppSetsPage extends React.PureComponent<IAppSetsPageProps & RouteComponentProps> {
	handlePreviewApp = (id: string) => (event) => {
		event.preventDefault();

		const url = routerUrls.userAppSetPreview.replace(':id', id);
		window.open(url, 'prtvPreview', `width=1280,height=720,toolbar=0,location=0,menubar=0`);
	};

	handleAddButton = () => {
		this.props.push(routerUrls.userAppsSetsCreate);
	};

	getBody = () => {
		const {appsets, loading} = this.props;

		if (loading) {
			return <CircularProgress />;
		}

		if (appsets && !appsets.length) {
			return <Typography variant="h6">У вас еще нет подборок</Typography>;
		}

		return (
			<Table size="small">
				<TableHead>
					<TableRow>
						<TableCell>#</TableCell>
						<TableCell>Подборка</TableCell>
						<TableCell>Код(просмотр)</TableCell>
						<TableCell>Действие</TableCell>
					</TableRow>
				</TableHead>

				<TableBody>
					{appsets.map((appset, index) => (
						<TableRow key={appset._id}>
							<TableCell>{index + 1}</TableCell>
							<TableCell>
								<a href={routerUrls.userAppsSetsEdit.replace(':id', appset._id)}>
									{appset.title}
								</a>
							</TableCell>
							<TableCell>
								<IconButton onClick={this.handlePreviewApp(appset.numId)}>
									<RemoveRedEyeIcon />
									{appset.numId}
								</IconButton>
							</TableCell>
							<TableCell>
								<IconButton
									href={routerUrls.userAppsSetsEdit.replace(':id', appset._id)}
								>
									<EditIcon />
								</IconButton>

								<DeleteAppsetDialog appId={appset._id} />
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		);
	};

	render() {
		return (
			<div>
				<PageTitle
					title="Подборки"
					buttonTitle="Добавить подборку"
					onButtonClick={this.handleAddButton}
					description="Подборка включает в себя одно или несколько слайдшоу, между которыми
						удобно переключаться."
				/>

				<Card className={css.tableCard}>{this.getBody()}</Card>
			</div>
		);
	}
}

export default withTracker<{}, RouteComponentProps>(() => {
	const sub = Meteor.subscribe(publishNames.appsets.myAppsets);
	const loading = !sub.ready();

	return {
		loading,
		appsets: AppSets.find({}).fetch(),
	};
})(
	connect(null, {
		push,
	})(AppSetsPage),
);
