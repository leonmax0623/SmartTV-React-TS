import * as React from 'react';
import {Meteor} from 'meteor/meteor';
import {withTracker} from 'react-meteor-data-with-tracker';
import {withStyles, createStyles} from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';

import ProfileForm from './ProfileForm';
import PasswordForm from './PasswordForm';
import AdminPermissions from './AdminPermissions';
import routerUrls from '../../../constants/routerUrls';
import {publishNames} from 'shared/constants/publishNames';

const styles = createStyles({
	buttons: {
		marginTop: '15px',
		display: 'flex',
		flexWrap: 'wrap',
		flexDirection: 'row-reverse',
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
	emails: [IEmail];
	phone: string;
	status: string;
	company: string;
}

interface IEditDataProps {
	user: IUser;
	loading: boolean;
	classes: {
		buttons: string;
	};
}

class EditUserContainer extends React.Component<IEditDataProps> {
	render() {
		const {loading, user, classes} = this.props;

		if (loading) return <CircularProgress />;

		return (
			<>
				<ProfileForm user={user} />
				<PasswordForm userId={user._id} />
				<AdminPermissions user={user} />
				<div className={classes.buttons}>
					<Button
						variant="outlined"
						color="primary"
						type="button"
						href={routerUrls.adminUsers}
					>
						Назад
					</Button>
				</div>
			</>
		);
	}
}

export default withTracker((props) => {
	const {id: _id} = props.match.params as {id: string};
	const sub = Meteor.subscribe(publishNames.user.oneUserProfile, _id);
	const loading = !sub.ready();

	return {
		loading,
		user: Meteor.users.findOne({_id}),
	};
})(withStyles(styles)(EditUserContainer));
