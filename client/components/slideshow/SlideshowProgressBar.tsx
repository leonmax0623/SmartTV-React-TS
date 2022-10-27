import * as React from 'react';
import LinearProgress from '@material-ui/core/LinearProgress';
import {makeStyles} from '@material-ui/core';
import css from './SlideshowProgressBar.pcss';

interface IProgressBarProps {
	duration: number;
	colorPrimary?: string;
	barColorPrimary?: string;
}

interface ICustomLinearProgressProps {
	completed: number;
	colorPrimary?: string;
	barColorPrimary?: string;
}

interface IProgressBarState {
	currentTime: number;
}

const useStyles = makeStyles({
	colorPrimary: {
		background: (props: IProgressBarProps) => props.colorPrimary,
	},
	barColorPrimary: {
		background: (props: IProgressBarProps) => props.barColorPrimary,
	},
});

function CustomLinearProgress(props: ICustomLinearProgressProps) {
	const {completed} = props;
	const {colorPrimary, barColorPrimary} = useStyles(props);
	return (
		<LinearProgress
			variant="determinate"
			classes={{
				colorPrimary,
				barColorPrimary,
				root: css.progressBar,
			}}
			value={completed}
		/>
	);
}

export default class SlideshowProgressBar extends React.PureComponent<
	IProgressBarProps,
	IProgressBarState
> {
	state = {currentTime: 0};
	timerId: NodeJS.Timeout;
	step: number = 0.5;

	componentDidMount() {
		this.timerId = setInterval(this.progress, 500);
		this.progress();
	}

	componentWillUnmount() {
		clearInterval(this.timerId);
	}

	progress = () => {
		this.setState((state) => ({
			currentTime: state.currentTime + this.step,
		}));
	};

	render() {
		const {currentTime} = this.state;
		const {duration, colorPrimary, barColorPrimary} = this.props;
		const completed = Math.min((currentTime / duration) * 100, 100);

		return (
			<div className={css.container}>
				<CustomLinearProgress
					completed={completed}
					colorPrimary={colorPrimary}
					barColorPrimary={barColorPrimary}
				/>
			</div>
		);
	}
}
