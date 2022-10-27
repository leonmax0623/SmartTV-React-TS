import * as React from 'react';
import {Checkbox} from 'final-form-material-ui';
import {Field} from 'react-final-form';
import FormControlLabel from '@material-ui/core/FormControlLabel';

import css from './Checkboxes.pcss';

interface ICheckboxesProps {
	options: IOption[];
}

interface IOption {
	key: string;
	name: string;
	label: string;
}

export default class Checkboxes extends React.PureComponent<ICheckboxesProps> {
	render() {
		const {options} = this.props;

		return (
			<div className={css.boxes}>
				{options.map((option: IOption) => (
					<FormControlLabel
						key={option.key}
						className={css.label}
						control={
							<Field
								name={option.name}
								component={Checkbox}
								type="checkbox"
								classes={{checked: css.checked}}
							/>
						}
						label={option.label}
					/>
				))}
			</div>
		);
	}
}
