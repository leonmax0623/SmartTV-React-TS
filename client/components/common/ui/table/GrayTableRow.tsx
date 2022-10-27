import {createStyles, Theme, withStyles} from '@material-ui/core/styles';
import {TableRow} from '@material-ui/core';

const GrayTableRow = withStyles((theme: Theme) =>
	createStyles({
		head: {
			backgroundColor: theme.palette.grey['300'],
			color: theme.palette.common.black,
		},
	}),
)(TableRow);

export default GrayTableRow;
