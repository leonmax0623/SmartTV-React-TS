import * as React from 'react';
import SliderMUI from '@material-ui/core/Slider';

import css from './Slider.pcss';

interface ISlider {
	label: string;
	name?: string;
	style?: any;
	onChange: (e: React.ChangeEvent<HTMLElement>, val: number) => void;
	value?: number;
	step?: number;
	max?: number;
}

const Slider: React.FunctionComponent<ISlider> = (props) => (
	<div className={css.slider}>
		<label className={css.label}>{props.label}</label>

		<SliderMUI
			value={props.value}
			onChange={props.onChange}
			step={props.step}
			max={props.max}
		/>
	</div>
);

export default Slider;
