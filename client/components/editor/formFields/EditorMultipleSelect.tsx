import React from 'react';
import Select, {SelectProps} from '@material-ui/core/Select';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Input from '@material-ui/core/Input';
import Checkbox from '@material-ui/core/Checkbox';

import css from './EditorSelect.pcss';
import EditorFieldLabel from 'client/components/editor/formFields/EditorFieldLabel';

interface IEditorSelectOption {
	value: string | number;
	label: React.ReactNode;
}

interface IEditorSelect {
	label?: string;
	tooltip?: React.ReactNode;
	options: IEditorSelectOption[];
	value: (string | number)[];
}

const EditorMultipleSelect: React.FunctionComponent<IEditorSelect & SelectProps> = ({
	label,
	tooltip,
	options,
	multiple,
	value,
	...props
}) => (
	<FormControl classes={{root: css.controlRoot}}>
		<FormControlLabel
			label={<EditorFieldLabel tooltip={tooltip}>{label}</EditorFieldLabel>}
			classes={{root: css.root, label: css.label}}
			control={
				<Select
					multiple
					value={value}
					classes={{select: css.select, icon: css.icon}}
					renderValue={(selected: (string | number)[]) =>
						options
							.filter((i) => selected.includes(i.value))
							.map((i) => i.label)
							.join(', ')
					}
					input={
						<Input
							classes={{
								underline: css.input,
							}}
						/>
					}
					{...props}
				>
					{options.map((option) => (
						<MenuItem key={option.value.toString()} value={option.value}>
							<Checkbox checked={value.includes(option.value)} />
							{option.label}
						</MenuItem>
					))}
				</Select>
			}
			labelPlacement="top"
		/>
	</FormControl>
);

export default EditorMultipleSelect;
