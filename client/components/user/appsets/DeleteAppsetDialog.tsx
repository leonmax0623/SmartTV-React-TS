import * as React from 'react';
import {Meteor} from 'meteor/meteor';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';

import {methodNames} from 'shared/constants/methodNames';

interface DeleteAppDialogProps {
	appId: string;
}

class DeleteAppDialog extends React.PureComponent<DeleteAppDialogProps> {
	state = {open: false};

	handleClickOpen = () => {
		this.setState({open: true});
	};

	handleCancel = () => {
		this.setState({open: false});
	};

	handleDelete = () => {
		Meteor.call(methodNames.appsets.delete, this.props.appId, function(error) {
			if (error) {
				console.log('Ошибка');
			} else {
				console.log('Экран удален', true);
			}
		});
	};

	render() {
		return (
			<>
				<IconButton onClick={this.handleClickOpen}>
					<DeleteIcon />
				</IconButton>
				<Dialog
					open={this.state.open}
					keepMounted
					onClose={this.handleCancel}
					aria-labelledby="alert-dialog-slide-title"
					aria-describedby="alert-dialog-slide-description"
				>
					<DialogTitle id="alert-dialog-slide-title">Удалить подборку?</DialogTitle>
					<DialogActions>
						<Button onClick={this.handleDelete} color="primary">
							Удалить
						</Button>
						<Button onClick={this.handleCancel} color="primary">
							Отмена
						</Button>
					</DialogActions>
				</Dialog>
			</>
		);
	}
}

export default DeleteAppDialog;
