import React from 'react';
import {SketchPicker, ColorChangeHandler} from 'react-color';
import ColorResetIcon from '@material-ui/icons/Replay';

import css from './EditorColor.pcss';
import EditorFieldLabel from 'client/components/editor/formFields/EditorFieldLabel';

interface IEditorColorProps {
	label?: string;
	value?: string;
	resetValue?: string;
	tooltip?: React.ReactNode;
	onChange?: (arg0: string) => void;
	onClear?: () => void;
}

interface IEditorColorState {
	isOpenPicker: boolean;
}

class EditorTextInput extends React.PureComponent<IEditorColorProps, IEditorColorState> {
	state = {isOpenPicker: false};

	handleClick = () => {
		this.setState({isOpenPicker: !this.state.isOpenPicker});
	};

	handleClose = () => {
		this.setState({isOpenPicker: false});
	};

	handleChange: ColorChangeHandler = (color) => {
		const {onChange} = this.props;
		const {r, g, b, a} = color.rgb;

		// this.props.getHexColor(this.props.name, color.hex);

		if (onChange) {
			onChange(`rgba(${r}, ${g}, ${b}, ${a})`);
		}
		this.handleClose();
	};

	handleReset = () => {
		const {onChange, resetValue} = this.props;

		if (onChange) {
			onChange(resetValue || '');
		}
		this.handleClose();
	};

	render() {
		const {label, value, tooltip, resetValue} = this.props;
		const {isOpenPicker} = this.state;

		return (
			<div className={css.inputOuter}>
				<div>
					<EditorFieldLabel tooltip={tooltip}>{label}</EditorFieldLabel>

					<input type="hidden" value={value} className={css.input} />

					<button className={css.button} onClick={this.handleClick}>
						<div className={css.colorIndicator} style={{backgroundColor: value}} />
					</button>

					{value && value !== resetValue && (
						<div className={css.reset} onClick={this.handleReset}>
							<ColorResetIcon />
						</div>
					)}

					{isOpenPicker ? (
						<div className={css.picker}>
							<div className={css.cover} onClick={this.handleClose} />

							<SketchPicker
								width="145px"
								color={value}
								onChange={this.handleChange}
							/>
						</div>
					) : null}
				</div>
			</div>
		);
	}
}

export default EditorTextInput;
