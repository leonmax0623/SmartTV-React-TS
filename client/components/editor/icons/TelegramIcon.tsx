import * as React from 'react';
import SvgIcon from '@material-ui/core/SvgIcon';
import {mdiTelegram} from '@mdi/js';

export default React.memo((props) => (
	<SvgIcon {...props}>
		<path d={mdiTelegram} />
	</SvgIcon>
));
