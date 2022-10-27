import * as React from 'react';
import SvgIcon from '@material-ui/core/SvgIcon';

export default React.memo(({pathProps, ...restProps}) => (
	<SvgIcon {...restProps} xmlns="http://www.w3.org/2000/svg">
		<path
			{...pathProps}
			d="M8.99169 0.666748C4.39169 0.666748 0.666687 4.40008 0.666687 9.00008C0.666687 13.6001 4.39169 17.3334 8.99169 17.3334C13.6 17.3334 17.3334 13.6001 17.3334 9.00008C17.3334 4.40008 13.6 0.666748 8.99169 0.666748ZM9.00002 15.6667C5.31669 15.6667 2.33335 12.6834 2.33335 9.00008C2.33335 5.31675 5.31669 2.33341 9.00002 2.33341C12.6834 2.33341 15.6667 5.31675 15.6667 9.00008C15.6667 12.6834 12.6834 15.6667 9.00002 15.6667ZM8.76669 4.83341H8.81669C9.15002 4.83341 9.41669 5.10008 9.41669 5.43341V9.21675L12.6417 11.1334C12.9334 11.3001 13.025 11.6751 12.85 11.9584C12.6834 12.2417 12.3167 12.3251 12.0334 12.1584L8.57502 10.0834C8.31669 9.93341 8.16669 9.65841 8.16669 9.36675V5.43341C8.16669 5.10008 8.43335 4.83341 8.76669 4.83341Z"
		/>
	</SvgIcon>
));
