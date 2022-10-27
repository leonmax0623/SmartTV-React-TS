import React from 'react';
import InputBase from '@material-ui/core/InputBase';
import startsWith from 'lodash/startsWith';
import pickBy from 'lodash/pickBy';

import css from './EditorTextarea.pcss';

interface IEditorTextareaProps {
	label?: string;
	value?: string;
	onChange: (value: string) => void;
	helpText?: React.ReactNode;
}

interface IEditorTextareaState {
	localValue?: string | number | unknown;
}

export default class EditorTextarea extends React.PureComponent<
	IEditorTextareaProps,
	IEditorTextareaState
> {
	state = {localValue: ''};
	inDataTimer: NodeJS.Timeout;
	inDataTimerTimeout = 1000;

	componentDidMount() {
		const {value: localValue} = this.props;

		this.setState({localValue});
	}

	componentDidUpdate(prevProps: Readonly<IEditorTextareaProps>) {
		const {value: localValue} = this.props;

		if (localValue !== prevProps.value) {
			this.setState({localValue});
		}
	}

	handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const {value: localValue} = e.target;

		this.setState({localValue});

		clearTimeout(this.inDataTimer);

		this.inDataTimer = setTimeout(
			() => this.props.onChange(localValue),
			this.inDataTimerTimeout,
		);
	};

	render() {
		const {label, helpText} = this.props;
		const {localValue} = this.state;
		const rows = 5;

		return (
			<div className={css.inputOuter}>
				<label className={css.label}>{label}</label>

				<InputBase
					{...pickBy(this.props, (_, key) => !startsWith(key, 'value'))}
					value={localValue}
					onChange={this.handleChange}
					classes={{
						root: css.root,
						inputMultiline: css.input,
					}}
					margin="none"
					rows={rows}
					multiline
				/>

				{!!helpText && <div className={css.helpText}>{helpText}</div>}
			</div>
		);
	}
}
