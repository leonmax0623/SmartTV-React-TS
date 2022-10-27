import * as React from 'react';
import TooltipMUI, {TooltipProps} from '@material-ui/core/Tooltip';

const tooltipEnterDelay = 400;
const tooltipLeaveDelay = 200;

const Tooltip: React.FunctionComponent<TooltipProps> = (props) => (
	<TooltipMUI enterDelay={tooltipEnterDelay} leaveDelay={tooltipLeaveDelay} {...props} />
);

export default Tooltip;
