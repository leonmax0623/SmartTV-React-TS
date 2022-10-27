import {Tooltip} from '@material-ui/core';
import HelpIcon from '@material-ui/icons/Help';
import React from 'react';

import css from './EditorFieldLabel.pcss';

const EditorFieldLabel: React.FC<{tooltip?: React.ReactNode; tooltipProps?: object}> = ({
	children,
	tooltip,
	tooltipProps,
}) => (
	<label className={css.labelContainer}>
		<div className={css.label}>{children}</div>

		{tooltip && (
			<Tooltip title={tooltip} arrow placement="right" {...(tooltipProps || {})}>
				<HelpIcon className={css.icon} />
			</Tooltip>
		)}
	</label>
);

export default EditorFieldLabel;
