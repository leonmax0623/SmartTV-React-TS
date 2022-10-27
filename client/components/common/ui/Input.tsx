import * as React from 'react';
import {TextField, TextFieldProps} from 'formik-material-ui';
import {Field} from 'formik';

import css from './Input.pcss';

interface IInput {
	label: string | React.ReactNode;
	name?: string;
	value?: string | number;
	placeholder?: string;
	validate?: (value: any) => string | Promise<void> | undefined;
	className?: string;
	type?: string;
	helperText?: string;
	inputProps?: TextFieldProps['inputProps'];
	onKeyPress?: TextFieldProps['onKeyPress'];
}

const Input: React.FunctionComponent<IInput> = (props) => (
	<div className={css.input}>
		<label className={css.label}>{props.label}</label>

		<Field {...props} fullWidth component={TextField} label={null} />
	</div>
);

export default Input;
