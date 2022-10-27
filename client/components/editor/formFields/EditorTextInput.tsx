import React from 'react';
import TextField from '@material-ui/core/TextField';
import {InputBaseComponentProps} from '@material-ui/core/InputBase';

// @ts-ignore
import css from './EditorTextInput.pcss';
import EditorFieldLabel from 'client/components/editor/formFields/EditorFieldLabel';

interface IEditorTextInputProps {
	label?: string;
	value?: string | number;
	error?: boolean;
	helperText?: string;
	tooltip?: React.ReactNode;
	onChange: (value?: string | number) => void;
	inputProps?: InputBaseComponentProps;
	type?: InputBaseComponentProps['type'];
}

interface IEditorTextInputState {
	localValue?: string | number;
}

class EditorTextInput extends React.PureComponent<IEditorTextInputProps, IEditorTextInputState> {
	state = {localValue: ''};
	inDataTimer: NodeJS.Timeout;
	inDataTimerTimeout = 600;

	componentDidMount() {
		const {value: localValue} = this.props;

		this.setState({localValue});
	}

	componentDidUpdate(prevProps: Readonly<IEditorTextInputProps>) {
		const {value: localValue} = this.props;

		if (localValue !== prevProps.value) {
			this.setState({localValue});
		}
	}

	handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const {type} = this.props;
		const {value: localValue} = e.target;

		this.setState({localValue});

		clearTimeout(this.inDataTimer);

		this.inDataTimer = setTimeout(
			() => this.props.onChange(type && type === 'number' ? Number(localValue) : localValue),
			this.inDataTimerTimeout,
		);
	};

	render() {
		const {label, tooltip, value, ...props} = this.props;
		const {localValue} = this.state;

		return (
			<div className={css.inputOuter}>
				<EditorFieldLabel tooltip={tooltip}>{label}</EditorFieldLabel>

				<TextField
					{...props}
					label={undefined}
					value={localValue}
					onChange={this.handleChange}
					className={css.container}
					classes={{root: css.controlRoot}}
					InputProps={{
						classes: {root: css.root, input: css.input},
						disableUnderline: true,
					}}
					margin="none"
					variant="filled"
					fullWidth
				/>
			</div>
		);
	}
}

export default EditorTextInput;
