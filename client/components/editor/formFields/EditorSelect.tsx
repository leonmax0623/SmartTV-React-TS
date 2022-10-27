import React from 'react';
import Select, {SelectProps} from '@material-ui/core/Select';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Input from '@material-ui/core/Input';

import css from './EditorSelect.pcss';
import EditorFieldLabel from 'client/components/editor/formFields/EditorFieldLabel';

interface IEditorSelectOption {
	value: string | number | boolean;
	label: React.ReactNode;
}

interface IEditorSelect {
	label?: React.ReactNode;
	tooltip?: React.ReactNode;
	options?: IEditorSelectOption[];
}

const EditorSelect: React.FunctionComponent<IEditorSelect & SelectProps> = ({
	label,
	options,
	tooltip,
	children,
	...props
}) => (
	<FormControl classes={{root: css.controlRoot}}>
		<FormControlLabel
			label={<EditorFieldLabel tooltip={tooltip}>{label}</EditorFieldLabel>}
			classes={{root: css.root, label: css.label}}
			control={
				<Select
					classes={{select: css.select, icon: css.icon}}
					input={
						<Input
							classes={{
								underline: css.input,
							}}
						/>
					}
					{...props}
				>
					{options &&
						options.map((option) => (
							<MenuItem key={option.value.toString()} value={option.value}>
								{option.label}
							</MenuItem>
						))}

					{children}
				</Select>
			}
			labelPlacement="top"
		/>
	</FormControl>
);

export default EditorSelect;
