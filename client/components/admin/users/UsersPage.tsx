import * as React from 'react';
import {withTracker} from 'react-meteor-data-with-tracker';
import {Meteor} from 'meteor/meteor';
import {Accounts} from 'meteor/accounts-base';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import CircularProgress from '@material-ui/core/CircularProgress';
import Card from '@material-ui/core/Card';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import {RouteComponentProps} from 'react-router-dom';

import {format} from 'shared/utils/dates';
import routerUrls from '../../../constants/routerUrls';
import UserDialog from './UserDialog';
import {methodNames} from 'shared/constants/methodNames';
import {publishNames} from 'shared/constants/publishNames';
import './UsersPage.scss';
import {checkAdmin} from 'shared/utils/user';
import {TextField} from '@material-ui/core';

interface IEmail {
	address: string;
	verified: boolean;
}

interface IUser extends Meteor.User {
	_id: string;
	name: string;
	surname: string;
	emails: IEmail[];
	phone: string;
	status: string;
}

interface IUsersPageProps {
	loading: boolean;
	users: [IUser];
}

class UsersPage extends React.PureComponent<IUsersPageProps & RouteComponentProps> {
	authByUser = (_id: string) => {
		Meteor.call(methodNames.user.prepareForFakeLogin, {_id}, function(error, result) {
			// 1. take token
			if (error) {
				// TODO: show error message
			} else {
				Accounts.logout(() => {
					// 2. if ok, logout
					Accounts.callLoginMethod({
						// 3. ..and login by token
						methodArguments: [{fakeLoginToken: result}],
						userCallback: () => {
							location.href = '/';
						},
					});
				});
			}
		});
	};

	approveUser = (_id: string) => {
		Meteor.call(methodNames.user.setStatus, {_id, status: 'approved'});
	};

	blockUser = (_id: string) => {
		Meteor.call(methodNames.user.setStatus, {_id, status: 'blocked'});
	};

	deleteUser = (id: string) => {
		Meteor.call(methodNames.user.delete, id, function(error) {
			if (error) {
				console.log('Ошибка');
			} else {
				console.log('Пользователь удален');
			}
		});
	};

	getUserAppsCount = (userId: string) => {
		return 'временно не работает';
		// return Slideshow.find({userId}).count();
	};

	getBody = () => {
		const {users, loading} = this.props;

		if (loading) return <CircularProgress />;
		if (users && !users.length) {
			return (
				<Typography variant="h6" className="alert alert-warning">
					Нет пользователей для отображения или ошибка сервера.
				</Typography>
			);
		}

		return (
			<Table>
				<TableHead>
					<TableRow>
						<TableCell>#</TableCell>
						<TableCell>ФИО</TableCell>
						<TableCell>Email</TableCell>
						<TableCell>Телефон</TableCell>
						<TableCell>Дата регистрации</TableCell>
						<TableCell>Экраны</TableCell>
						<TableCell style={{width: 195}}>Действия</TableCell>
					</TableRow>
				</TableHead>

				<TableBody>
					{users.map((user, index) => (
						<TableRow key={user._id}>
							<TableCell>{index + 1}</TableCell>
							<TableCell>
								<a href={routerUrls.adminUsersEdit.replace(':id', user._id)}>
									{user.name} {user.surname}{' '}
									{user.name || user.surname ? '' : '-'}
								</a>
								<br />
								{checkAdmin(user) && <small>администратор</small>}
							</TableCell>
							<TableCell>
								{user.emails && user.emails.map((email) => email.address)}
							</TableCell>
							<TableCell>{user.phone}</TableCell>
							<TableCell>
								{user.createdAt ? format(user.createdAt!, 'd MMM yyyy') : ''}
							</TableCell>
							<TableCell>{this.getUserAppsCount(user._id)}</TableCell>
							<TableCell>
								<UserDialog
									userId={user._id}
									title="Войти в личный кабинет"
									onSuccess={this.authByUser}
								/>
								{user.status === 'new' && (
									<UserDialog
										userId={user._id}
										title="Одобрить"
										onSuccess={this.approveUser}
									/>
								)}
								<UserDialog
									userId={user._id}
									title="Заблокировать"
									onSuccess={this.blockUser}
								/>
								<UserDialog
									userId={user._id}
									title="Удалить"
									onSuccess={this.deleteUser}
								/>
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		);
	};

	handleFontSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		this.props.history.replace({
			pathname: this.props.match.path,
			search: `?search=${e.target.value}`,
		});
	};

	render() {
		return (
			<div>
				<Grid container justify="space-between">
					<Grid item>
						<Typography className="pageTitle" variant="h5">
							Пользователи
						</Typography>
						<TextField
							label="Поиск"
							variant="outlined"
							onChange={this.handleFontSizeChange}
							defaultValue={this.props.search}
						/>
					</Grid>
				</Grid>

				<Card className="tableCard">{this.getBody()}</Card>
			</div>
		);
	}
}

export default withTracker<{}, RouteComponentProps>((props) => {
	const query = new URLSearchParams(props.location.search);

	// When the URL is /the-path?some-key=a-value ...
	const search = query.get('search');

	const usersSub = Meteor.subscribe(publishNames.user.users, {search});
	const loading = !usersSub.ready();

	return {
		search,
		loading,
		users: Meteor.users.find({}, {sort: {_id: 1}}).fetch(),
	};
})(UsersPage);
