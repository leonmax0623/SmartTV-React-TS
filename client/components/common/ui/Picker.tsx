import * as React from 'react';
import {withStyles, createStyles} from '@material-ui/core/styles';
import {SketchPicker} from 'react-color';
import TextField from '@material-ui/core/TextField';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Grow from '@material-ui/core/Grow';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';

import css from './Picker.pcss';

const styles = createStyles({
	picker: {
		zIndex: 1000,
		position: 'absolute',
	},
	colorBlock: {
		width: '40px',
		minHeight: '20px',
		marginRight: '10px',
		borderRadius: '5px',
	},
});

interface IPickerProps {
	classes: {
		picker: string;
		textFields: string;
		colorBlock: string;
	};
}

interface IPickerData {
	label: string;
	color?: string;
	name: string;
	getHexColor: (name: string, color: string) => void;
}

interface IPickerState {
	displayColorPicker: boolean;
	color?: string;
}

class Picker extends React.PureComponent<IPickerProps & IPickerData, IPickerState> {
	anchorRef: React.RefObject<HTMLDivElement> = React.createRef();

	state = {
		displayColorPicker: false,
		color: '',
	};

	componentDidMount() {
		const {color} = this.props;

		this.setState({color});
	}

	handleClick = () => {
		this.setState({displayColorPicker: !this.state.displayColorPicker});
	};

	handleClose = (event: React.MouseEvent<EventTarget>) => {
		if (
			this.anchorRef.current &&
			this.anchorRef.current.contains(event.target as HTMLElement)
		) {
			return;
		}

		this.setState({displayColorPicker: false});
	};

	handleChange = ({rgb: {r, g, b, a}}: {rgb: {r: string; g: string; b: string; a: string}}) => {
		const color = `rgba(${r}, ${g}, ${b}, ${a})`;
		this.props.getHexColor(this.props.name, color);
		this.setState({color});
	};

	render() {
		const {color, displayColorPicker} = this.state;
		const {label, classes} = this.props;

		return (
			<div className={css.outer}>
				<label>{label}</label>

				<TextField
					variant="outlined"
					value={color || '#ffffff'}
					ref={this.anchorRef}
					aria-controls="menu-list-grow"
					aria-haspopup="true"
					onClick={this.handleClick}
					fullWidth
					InputProps={{
						startAdornment: (
							<div style={{backgroundColor: color}} className={classes.colorBlock} />
						),
					}}
				/>

				<Popper
					open={displayColorPicker}
					anchorEl={this.anchorRef.current}
					disablePortal
					transition
					className={classes.picker}
				>
					{({TransitionProps, placement}) => (
						<Grow
							{...TransitionProps}
							style={{
								transformOrigin:
									placement === 'bottom' ? 'center top' : 'center bottom',
							}}
						>
							<Paper id="menu-list-grow">
								<ClickAwayListener onClickAway={this.handleClose}>
									<SketchPicker color={color} onChange={this.handleChange} />
								</ClickAwayListener>
							</Paper>
						</Grow>
					)}
				</Popper>
			</div>
		);
	}
}

export default withStyles(styles)(Picker);
