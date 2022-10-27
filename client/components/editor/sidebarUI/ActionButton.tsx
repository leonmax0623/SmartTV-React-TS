import * as React from 'react';
import * as cn from 'classnames';
import {SvgIconProps} from '@material-ui/core/SvgIcon';
import CloseIcon from '@material-ui/icons/Close';
import {TooltipProps} from '@material-ui/core/Tooltip';
import MdiIcon from '@mdi/react';

import Tooltip from 'client/components/common/ui/Tooltip';
import css from './ActionButton.pcss';

interface IActionButtonButtonProps {
	Icon?: React.ComponentType<SvgIconProps>;
	mdiIcon?: string;
	primary?: boolean;
	highlighted?: boolean;
	onClick?: () => void;
	isSelected?: boolean;
	tooltipPlacement?: TooltipProps['placement'];
	tooltipTitle?: TooltipProps['title'];
	disabled?: boolean;
}

const ActionButton: React.FunctionComponent<IActionButtonButtonProps> = ({
	Icon,
	mdiIcon,
	primary,
	highlighted,
	onClick,
	isSelected,
	tooltipPlacement,
	tooltipTitle,
	disabled,
}) => (
	<Tooltip
		title={tooltipTitle}
		placement={tooltipPlacement}
		open={tooltipTitle ? undefined : false}
	>
		<button
			className={cn(css.button, {
				[css.primary]: primary,
				[css.highlighted]: highlighted,
				[css.isSelected]: isSelected,
				[css.isDisabled]: disabled,
			})}
			onClick={onClick}
		>
			{Icon && <Icon htmlColor="#fff" className={css.icon} />}
			{mdiIcon && <MdiIcon path={mdiIcon} size={1} color="#fff" />}

			<CloseIcon className={css.closeIcon} />

			<div className={css.arrow} />
		</button>
	</Tooltip>
);

ActionButton.defaultProps = {
	primary: false,
	highlighted: false,
	isSelected: false,
	tooltipTitle: false,
};

export default ActionButton;
