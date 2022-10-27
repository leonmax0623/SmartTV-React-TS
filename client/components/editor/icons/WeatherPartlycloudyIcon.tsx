import * as React from 'react';
import SvgIcon from '@material-ui/core/SvgIcon';
import {mdiWeatherCloudy} from '@mdi/js';

export default React.memo((props) => (
	<SvgIcon {...props}>
		<path d={mdiWeatherCloudy} />
	</SvgIcon>
));
