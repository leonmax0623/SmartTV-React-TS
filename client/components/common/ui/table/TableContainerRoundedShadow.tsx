import {createStyles, Theme, withStyles} from '@material-ui/core/styles';
import {TableContainer} from '@material-ui/core';

const TableContainerRoundedShadow = withStyles((theme: Theme) =>
	createStyles({
		root: {
			borderRadius: '12px',
			border: '1px solid rgba(0, 0, 0, 0.12)',
			boxShadow: '0px 0.1px 0.3px rgba(0, 0, 0, 0.1), 0px 1px 2px rgba(0, 0, 0, 0.2)',
		},
	}),
)(TableContainer);

export default TableContainerRoundedShadow;
