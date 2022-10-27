import React from 'react';
import css from './ToggleBox.pcss';

export interface IToggleBox {
	name?: string;
	value: any;
	label: string;
	disabled?: boolean;
	checked?: boolean;
	icon?: React.ReactElement;
	onChange?: (value: any) => void;
}

const ToggleBox: React.FC<IToggleBox> = ({
	name,
	value,
	label,
	disabled,
	checked,
	icon,
	onChange,
}) => {
	const fieldId = `${name}-${value}`;

	return (
		<div className={css.toggleBox}>
			<input
				type="radio"
				name={name}
				id={fieldId}
				value={value}
				className={css.toggleBoxInput}
				disabled={disabled}
				checked={checked}
				onChange={(e) => onChange && onChange(e)}
			/>
			<label htmlFor={fieldId} className={css.toggleBoxLabel}>
				<span>{label}</span>
				{icon ? <span className={css.toggleBoxIcon}>{icon}</span> : ''}
			</label>
		</div>
	);
};
export default ToggleBox;
