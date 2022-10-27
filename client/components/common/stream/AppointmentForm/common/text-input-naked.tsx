import {makeStyles} from '@material-ui/core/styles';
import {TextField} from '@material-ui/core';
import * as React from 'react';

const simpleInput = makeStyles({
	root: {
		padding: 0,
	},
	input: {
		padding: 0,
		width: '72px',
		height: '32px',
		textAlign: 'center',
		border: '1px solid rgba(0, 0, 0, 0.12)',
		borderRadius: '4px',
		fontSize: '16px',
		lineHeight: 1.5,
	},
});
export const TextInputNaked = (props) => {
	const classes = simpleInput();
	return <TextField {...props} InputProps={{classes: classes}} />;
};
