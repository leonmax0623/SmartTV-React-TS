import * as React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';

interface IUsergProps {
	userId: string;
	title: string;
	onSuccess: (string) => void;
}

class UserDialog extends React.PureComponent<IUsergProps> {
	state = {open: false};

	handleClickOpen = () => {
		this.setState({open: true});
	};

	handleCancel = () => {
		this.setState({open: false});
	};

	handleSuccess = () => {
		this.props.onSuccess(this.props.userId);
		this.handleCancel();
	};

	render() {
		const {title} = this.props;

		return (
			<>
				<a href="#" onClick={this.handleClickOpen}>
					{title}
				</a>
				<Dialog
					open={this.state.open}
					keepMounted
					onClose={this.handleCancel}
					aria-labelledby="alert-dialog-slide-title"
					aria-describedby="alert-dialog-slide-description"
				>
					<DialogTitle id="alert-dialog-slide-title">{title}?</DialogTitle>
					<DialogActions>
						<Button onClick={this.handleSuccess} color="primary">
							Применить
						</Button>
						<Button onClick={this.handleCancel} color="primary">
							Отмена
						</Button>
					</DialogActions>
				</Dialog>
				<br />
			</>
		);
	}
}

export default UserDialog;
