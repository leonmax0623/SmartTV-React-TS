import * as React from 'react';
import {Radio} from 'final-form-material-ui';
import RadioGroup from '@material-ui/core/RadioGroup';
import {Field} from 'react-final-form';
import FormControlLabel from '@material-ui/core/FormControlLabel';

import css from './Radioboxes.pcss';

interface IRadioboxesProps {
	options: IOption[];
}

interface IOption {
	key: string;
	name: string;
	label: string;
	value: string;
}

export default class Radioboxes extends React.PureComponent<IRadioboxesProps> {
	render() {
		const {options} = this.props;

		return (
			<RadioGroup>
				<div className={css.boxes}>
					{options.map((option: IOption) => (
						<FormControlLabel
							className={css.box}
							key={option.key}
							name={option.name}
							value={option.value}
							control={<Field type="radio" name={option.name} component={Radio} />}
							label={option.label}
						/>
					))}
				</div>
			</RadioGroup>
		);
	}
}
