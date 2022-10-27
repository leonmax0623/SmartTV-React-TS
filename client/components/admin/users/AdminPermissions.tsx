import * as React from 'react';
import {Roles} from 'meteor/alanning:roles';
import {Meteor} from 'meteor/meteor';
import {withStyles, createStyles} from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import Typography from '@material-ui/core/Typography/Typography';

import {methodNames} from 'shared/constants/methodNames';
import {IServices} from 'shared/collections/Users';
import {checkAdmin, checkRole} from 'shared/utils/user';

const styles = createStyles({
	title: {
		paddingTop: '15px',
	},
	container: {
		display: 'flex',
		justifyContent: 'space-between',
		alignItems: 'center',
		padding: '16px',
	},
});

interface IEmail {
	address: string;
	verified: boolean;
}

interface IUser extends Meteor.User {
	_id: string;
	name: string;
	surname: string;
	roles?: [string];
	emails: [IEmail];
	phone: string;
	status: string;
	projectServices: IServices;
}

interface IAdminPermissionsProps {
	classes: {
		container: string;
		title: string;
	};
	user: IUser;
}

class AdminPermissions extends React.PureComponent<IAdminPermissionsProps> {
	handleSetAdmin = (isAdmin: boolean) => () => {
		const {user} = this.props;

		Meteor.call(
			methodNames.user.setAdminRole,
			user._id,
			isAdmin,
			(error: Error | Meteor.Error) => {
				if (error) console.log(error.reason);
			},
		);
	};
	handleSetTemplateEditor = (isAdmin: boolean) => () => {
		const {user} = this.props;

		Meteor.call(
			methodNames.user.setTemplateEditorRole,
			user._id,
			isAdmin,
			(error: Error | Meteor.Error) => {
				if (error) console.log(error.reason);
			},
		);
	};

	render() {
		const {user, classes} = this.props;
		const isAdmin = checkAdmin(user);
		const isTemplateEditor = checkRole(user, 'template_editor');
		return (
			<>
				<Typography variant="h5" className={classes.title} gutterBottom>
					Права пользователя
				</Typography>

				<Card className={classes.container}>
					<Typography variant="subtitle1" gutterBottom>
						{isAdmin ? 'Администратор' : 'Не является администратором'}
					</Typography>

					<Button
						variant="outlined"
						color="primary"
						type="button"
						onClick={this.handleSetAdmin(!isAdmin)}
					>
						{isAdmin ? 'Убрать права' : 'Дать права'} администратора
					</Button>
				</Card>
				<Card className={classes.container}>
					<Typography variant="subtitle1" gutterBottom>
						{isTemplateEditor ? 'Редактор шаблонов' : 'Не является редактором шаблонов'}
					</Typography>

					<Button
						variant="outlined"
						color="primary"
						type="button"
						onClick={this.handleSetTemplateEditor(!isTemplateEditor)}
					>
						{isTemplateEditor ? 'Убрать права' : 'Дать права'}
					</Button>
				</Card>
			</>
		);
	}
}

export default withStyles(styles)(AdminPermissions);
