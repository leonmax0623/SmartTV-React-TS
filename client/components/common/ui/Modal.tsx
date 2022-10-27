import React from 'react';
import {withStyles} from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';

interface IModalProps {
	onClose: () => void;
	isOpen: boolean;
	title?: React.ReactNode;
	fullWidth: boolean;
}

interface IDialogTitle {
	classes: {closeButton: string};
	onClose: () => void;
	children: React.ReactNode;
}

const DialogTitle = withStyles((theme) => ({
	closeButton: {
		position: 'absolute',
		right: theme.spacing(1),
		top: theme.spacing(1),
	},
}))((props: IDialogTitle) => {
	const {children, classes, onClose} = props;

	return (
		<MuiDialogTitle>
			{children}

			{onClose ? (
				<IconButton aria-label="Close" className={classes.closeButton} onClick={onClose}>
					<CloseIcon />
				</IconButton>
			) : null}
		</MuiDialogTitle>
	);
});

export default class Modal extends React.PureComponent<IModalProps> {
	render() {
		let {onClose, isOpen, title, children, fullWidth} = this.props;
		fullWidth = fullWidth === true;
		return (
			<Dialog
				onClose={onClose}
				open={isOpen}
				scroll="body"
				fullWidth={fullWidth}
				maxWidth={fullWidth ? false : 'sm'}
			>
				{title && <DialogTitle onClose={onClose}>{title}</DialogTitle>}

				{children}
			</Dialog>
		);
	}
}
