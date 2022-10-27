import React from 'react';
import Checkbox, {CheckboxProps} from '@material-ui/core/Checkbox';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';

import css from './EditorCheckbox.pcss';
import EditorFieldLabel from 'client/components/editor/formFields/EditorFieldLabel';

interface IEditorCheckbox {
	label: string;
	checked?: boolean;
	value: string;
	tooltip?: React.ReactNode;
}

const EditorTextInput: React.FunctionComponent<IEditorCheckbox & CheckboxProps> = ({
	label,
	checked,
	value,
	tooltip,
	...props
}) => (
	<FormControl className={css.outer}>
		<FormControlLabel
			label={<EditorFieldLabel tooltip={tooltip}>{label}</EditorFieldLabel>}
			classes={{root: css.root, label: tooltip && css.label}}
			control={
				<Checkbox
					checked={checked}
					classes={{
						root: css.checkbox,
						checked: css.checked,
					}}
					value={value}
					{...props}
				/>
			}
			labelPlacement="start"
		/>
	</FormControl>
);

export default EditorTextInput;
