import * as React from 'react';
import SvgIcon from '@material-ui/core/SvgIcon';
import {mdiVk} from '@mdi/js';

export default React.memo((props) => (
	<SvgIcon {...props}>
		<path d={mdiVk} />
	</SvgIcon>
));
