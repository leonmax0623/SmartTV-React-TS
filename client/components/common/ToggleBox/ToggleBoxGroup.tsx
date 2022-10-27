import React from 'react';
import css from './ToggleBoxGroup.pcss';
import ToggleBox, {IToggleBox} from 'client/components/common/ToggleBox/ToggleBox';

interface IToggleBoxGroupProps {
	data: IToggleBox[];
	value: any;
	name: string;
	onChange: (e: any) => void;
}

const ToggleBoxGroup: React.FC<IToggleBoxGroupProps> = ({data, value, name, onChange}) => {
	const handleChange = (e) => {
		if (onChange) {
			onChange(e.currentTarget.value);
		}
	};

	return (
		<div className={css.toggleBoxGroup}>
			{data.map((toggleBox) => {
				const isChecked = value === toggleBox.value;
				return (
					<ToggleBox
						key={toggleBox.value}
						name={name}
						value={toggleBox.value}
						label={toggleBox.label}
						icon={toggleBox.icon}
						onChange={handleChange}
						checked={isChecked}
						disabled={toggleBox.disabled}
					/>
				);
			})}
		</div>
	);
};

export default ToggleBoxGroup;
