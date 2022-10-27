import React from 'react';
import {withStyles} from '@material-ui/core/styles';
import {Button} from '@material-ui/core';
import {ButtonProps} from '@material-ui/core/Button';

const ButtonCustom = withStyles({
	root: {
		minHeight: 36,
		paddingTop: 8,
		paddingBottom: 8,
		fontSize: 14,
		lineHeight: 1.45,
		paddingLeft: 21,
		paddingRight: 21,
		background: '#3F51B5',
		color: '#fff',
		'&:hover': {
			color: '#fff',
			backgroundColor: '#3F51B5',
		},

		'&:active': {
			color: '#fff',
			backgroundColor: '#3F51B5',
			boxShadow: 'none',
		},
	},
	label: {
		textTransform: 'initial',
	},
})(Button);

const ButtonCustomWrapper: React.FC<ButtonProps> = (props) => {
	return <ButtonCustom {...props} />;
};

export default ButtonCustomWrapper;
