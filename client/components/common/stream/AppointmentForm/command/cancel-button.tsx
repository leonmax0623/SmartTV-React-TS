import * as React from 'react';
import * as PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';
import {Button, Box} from '@material-ui/core';
import classNames from 'clsx';

const styles = ({spacing}) => ({
	button: {
		marginRight: spacing(0.5),
	},
});

const CancelButtonBase = React.memo(({onExecute, className, getMessage, classes, ...restProps}) => (
	<Box
		display="inline-flex"
		color="rgba(0, 0, 0, 0.6)"
		fontWeight={500}
		className={classNames(classes.button, className)}
	>
		<Button color="inherit" onClick={onExecute} {...restProps}>
			{getMessage('cancelCommand')}
		</Button>
	</Box>
));

CancelButtonBase.propTypes = {
	classes: PropTypes.object,
	className: PropTypes.string,
	getMessage: PropTypes.func.isRequired,
	onExecute: PropTypes.func.isRequired,
};

CancelButtonBase.defaultProps = {
	className: undefined,
};

export const CancelButton = withStyles(styles)(CancelButtonBase, {name: 'CancelButton'});
