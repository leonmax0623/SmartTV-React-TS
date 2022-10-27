import * as React from 'react';
import * as PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';
import {Button, Box} from '@material-ui/core';
import classNames from 'clsx';
import {ensureColor} from '../../utils';

const styles = ({spacing, palette}) => ({
	button: {
		padding: spacing(0.5, 3.5),
		marginLeft: spacing(3),
		height: spacing(4.5),
		'&:first-child': {
			marginLeft: 0,
		},
		textTransform: 'uppercase',
		backgroundColor: ensureColor(900, '#3F51B5'),
		color: palette.primary.contrastText,
		borderRadius: '4px',
		'&:hover, &:focus': {
			backgroundColor: ensureColor(800, '#3F51B5'),
		},
	},
});

const SaveButtonBase = React.memo(({classes, className, getMessage, onExecute, ...restProps}) => (
	<Button
		className={classNames(classes.button, className)}
		variant="contained"
		onClick={onExecute}
		{...restProps}
	>
		{getMessage('commitCommand')}
	</Button>
));

SaveButtonBase.propTypes = {
	classes: PropTypes.object.isRequired,
	className: PropTypes.string,
	getMessage: PropTypes.func.isRequired,
	onExecute: PropTypes.func.isRequired,
};

SaveButtonBase.defaultProps = {
	className: undefined,
};

export const SaveButton = withStyles(styles)(SaveButtonBase, {name: 'SaveButton'});
