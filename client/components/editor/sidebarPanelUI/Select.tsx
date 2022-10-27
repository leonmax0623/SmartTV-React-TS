import * as React from 'react';
import {Select as FMUISelect} from 'formik-material-ui';
import {Select as MUISelect, SelectProps} from '@material-ui/core';
import {Field} from 'formik';

import css from './Select.pcss';

interface ISelect extends SelectProps {
	label: string;
	name?: string;
	placeholder?: string;
	validate?: (value: any) => string | Promise<void> | undefined;
	className?: string;
	style?: any;
	formik?: boolean;
}

const Select: React.FunctionComponent<ISelect> = ({formik = true, label, ...props}) => (
	<div className={css.select}>
		<label className={css.label}>{label}</label>

		{formik ? (
			<Field {...props} fullWidth component={FMUISelect} />
		) : (
			<MUISelect
				fullWidth
				children={props.children}
				value={props.value}
				onChange={props.onChange}
			/>
		)}
	</div>
);

export default Select;
