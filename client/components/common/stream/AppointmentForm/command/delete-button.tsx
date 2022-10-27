import * as React from 'react';
import * as PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';
import {Button, Box} from '@material-ui/core';

const DeleteButtonBase = React.memo(({onExecute, className, getMessage, ...restProps}) => (
	<Box color="#B00020" mr="auto" className={className}>
		<Button variant="outlined" color="inherit" onClick={onExecute} {...restProps}>
			{getMessage('removeCommand')}
		</Button>
	</Box>
));

DeleteButtonBase.propTypes = {
	classes: PropTypes.object,
	className: PropTypes.string,
	getMessage: PropTypes.func.isRequired,
	onExecute: PropTypes.func.isRequired,
};

DeleteButtonBase.defaultProps = {
	className: undefined,
};

export const DeleteButton = DeleteButtonBase;
