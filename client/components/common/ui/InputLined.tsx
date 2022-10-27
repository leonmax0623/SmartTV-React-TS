import {InputBase} from '@material-ui/core';
import {withStyles, createStyles} from '@material-ui/core/styles';

const InputLined = withStyles(() =>
	createStyles({
		root: {
			marginTop: 0,
			marginBottom: 0,
		},
		input: {
			position: 'relative',
			borderBottom: 'none',
			borderRadius: 0,
			fontSize: 14,
			lineHeight: 1.42,
			padding: '3px',
			margin: 0,
			height: 'auto',
		},
	}),
)(InputBase);

export default InputLined;
