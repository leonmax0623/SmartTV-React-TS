import React from 'react';
import MuiAlert from '@material-ui/lab/Alert';
import {Box, IconButton, Snackbar} from '@material-ui/core';
import {Close} from '@material-ui/icons';

interface ISnackProps {
	isOpened: boolean;
	message: string;
	severity?: 'error' | 'success' | 'info' | 'warning' | undefined;
	onClose: () => void;
}

const Snack: React.FC<ISnackProps> = ({isOpened, onClose, message, severity = 'success'}) => {
	function closeSnackMessage(event, reason: string): void {
		if (reason === 'clickaway') {
			return;
		}
		if (onClose) onClose();
	}
	return (
		<Snackbar
			anchorOrigin={{
				vertical: 'top',
				horizontal: 'right',
			}}
			open={isOpened}
			autoHideDuration={4000}
			onClose={closeSnackMessage}
		>
			<MuiAlert elevation={6} variant="filled" severity={severity}>
				<Box display="flex" alignItems="center">
					<Box>{message}</Box>
					<Box color="white" display="flex" ml={1}>
						<IconButton onClick={closeSnackMessage} color="inherit" size="small">
							<Close color="inherit" fontSize="small" />
						</IconButton>
					</Box>
				</Box>
			</MuiAlert>
		</Snackbar>
	);
};
export default Snack;
