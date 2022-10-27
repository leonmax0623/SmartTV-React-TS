import * as React from 'react';
import {Button} from '@material-ui/core';
import Icon from '@mdi/react';
// import {mdiFacebookBox} from '@mdi/js';

import css from './LoginWithFacebookButton.pcss';

const LoginWithFacebookButton = () => {
	const handleClick = () => {
		Meteor.loginWithFacebook(
			{
				requestPermissions: ['public_profile', 'email'],
			},
			(err) => {
				if (err) {
					console.log('Handle errors here: ', err);
				}
			},
		);
	};

	return (
		<Button
			classes={{contained: css.spinner}}
			color="primary"
			variant="contained"
			size="large"
			fullWidth
			onClick={handleClick}
		>
			Продолжить с Facebook
		</Button>
	);
};

export default LoginWithFacebookButton;
