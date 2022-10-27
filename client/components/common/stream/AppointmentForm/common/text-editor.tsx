import * as React from 'react';
import * as PropTypes from 'prop-types';
import TextField from '@material-ui/core/TextField';
import {withStyles} from '@material-ui/core/styles';
import classNames from 'clsx';
import {
	TITLE_TEXT_EDITOR,
	MULTILINE_TEXT_EDITOR,
	ORDINARY_TEXT_EDITOR,
	NUMBER_EDITOR,
} from '@devexpress/dx-scheduler-core';
import {TextInputNaked} from 'client/components/common/stream/AppointmentForm/common/text-input-naked';

const styles = (theme) => ({
	title: {
		...theme.typography.h6,
	},
});

const TextEditorBase = React.memo(
	({classes, value, placeholder, className, readOnly, onValueChange, type, ...restProps}) => {
		const textFieldType = type === NUMBER_EDITOR ? 'number' : 'text';
		const notesTextEditor = type === MULTILINE_TEXT_EDITOR;
		return (
			<TextInputNaked
				className={className}
				value={value}
				disabled={readOnly}
				onChange={({target}) => onValueChange(target.value)}
				multiline={notesTextEditor}
				type={textFieldType}
				placeholder={placeholder}
				{...restProps}
			/>
		);
	},
);

TextEditorBase.propTypes = {
	classes: PropTypes.object.isRequired,
	value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
	placeholder: PropTypes.string,
	className: PropTypes.string,
	readOnly: PropTypes.bool,
	onValueChange: PropTypes.func,
	type: PropTypes.string,
};

TextEditorBase.defaultProps = {
	value: '',
	placeholder: undefined,
	className: undefined,
	readOnly: false,
	onValueChange: () => undefined,
	type: ORDINARY_TEXT_EDITOR,
};

export const TextEditor = withStyles(styles)(TextEditorBase, {name: 'TextEditor'});
