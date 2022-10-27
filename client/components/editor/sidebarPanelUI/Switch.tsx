import React from 'react';
import {
	FormControl,
	FormGroup,
	Switch as SwitchMUI,
	FormControlLabel,
	SwitchProps,
} from '@material-ui/core';

import css from './Switch.pcss';

interface ISwitch extends SwitchProps {
	label: string;
}

const Switch: React.FC<ISwitch> = ({label, ...props}) => (
	<FormControl component="fieldset" className={css.switchContainer}>
		<FormGroup row>
			<FormControlLabel
				classes={{root: css.labelRoot, label: css.label}}
				control={<SwitchMUI color="primary" {...props} />}
				label={label}
				labelPlacement="start"
			/>
		</FormGroup>
	</FormControl>
);

export default Switch;
