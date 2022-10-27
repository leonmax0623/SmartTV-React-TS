import * as React from 'react';
import {RouteComponentProps} from 'react-router-dom';
import Grid from '@material-ui/core/Grid/Grid';
import {Meteor} from 'meteor/meteor';
import {Accounts} from 'meteor/accounts-base';
import Paper from '@material-ui/core/Paper/Paper';
import {TextField} from 'final-form-material-ui';
import {Field, Form} from 'react-final-form';
import Button from '@material-ui/core/Button/Button';
import Typography from '@material-ui/core/Typography/Typography';
import {FORM_ERROR} from 'final-form';
import FormHelperText from '@material-ui/core/FormHelperText/FormHelperText';

import routerUrls from 'client/constants/routerUrls';
import LoginWithFacebookButton from 'client/components/oauth/LoginWithFacebookButton';
import {requiredInput} from 'client/components/common/ui/requiredValidator';

interface IRegistrationFormData {
	email: string;
	password: string;
	name: string;
	company?: string;
}

class RegistrationPage extends React.PureComponent<RouteComponentProps> {
	onSubmitHandler = (values: IRegistrationFormData) => {
		return new Promise((resolve, reject) => {
			const user = {
				email: values.email,
				password: values.password,
				profile: {
					company: values.company,
					name: values.name,
				},
			};

			Accounts.createUser(user, (err: any) => {
				if (err) {
					console.log(err);
					reject({[FORM_ERROR]: err.reason});
				} else {
					// Send verification email
					// TODO: переместить на сервер
					Meteor.call('users.sendVerificationEmail', () => {});
					resolve();
				}
			});
		});
	};

	render() {
		return (
			<Grid
				container
				direction="row"
				justify="center"
				alignItems="center"
				className="loginPage"
			>
				<Grid item>
					<Paper className="paperWrap">
						<Typography className="title" variant="h5">
							Регистрация
						</Typography>

						<Form
							onSubmit={this.onSubmitHandler}
							render={({handleSubmit, submitError, submitting}) => (
								<form onSubmit={handleSubmit} name="registration">
									<Field
										name="name"
										component={TextField}
										type="text"
										label="Имя *"
										validate={requiredInput()}
										variant="outlined"
										className="field"
										margin="dense"
										fullWidth
									/>

									<Field
										name="company"
										component={TextField}
										type="text"
										label="Компания"
										variant="outlined"
										className="field"
										margin="dense"
										fullWidth
									/>

									<Field
										name="email"
										component={TextField}
										type="email"
										label="Email *"
										validate={requiredInput()}
										variant="outlined"
										className="field"
										margin="dense"
										fullWidth
									/>

									<Field
										name="password"
										component={TextField}
										type="password"
										label="Пароль *"
										validate={requiredInput()}
										variant="outlined"
										className="field"
										margin="dense"
										fullWidth
									/>

									{!submitting && submitError && (
										<FormHelperText error>{submitError}</FormHelperText>
									)}

									<Button
										disabled={submitting}
										className="button"
										type="submit"
										color="primary"
										variant="outlined"
										size="large"
										fullWidth
									>
										Зарегистрироваться
									</Button>

									<LoginWithFacebookButton />
								</form>
							)}
						/>
					</Paper>

					<div className="links">
						<a className="link" href={routerUrls.authLogin}>
							Вход
						</a>
						&nbsp; &middot; &nbsp;
						<a className="link" href={routerUrls.authForgotPassword}>
							Забыл пароль
						</a>
					</div>

					<div className="links">
						<a className="link" href={routerUrls.termsOfUse}>
							Пользовательское соглашение
						</a>
						<br />
						<a className="link" href={routerUrls.privacyPolicy}>
							Политика конфиденциальности
						</a>
						<br />
						<a className="link" href={routerUrls.prices}>
							Цены на услуги
						</a>
					</div>
				</Grid>
			</Grid>
		);
	}
}

export default RegistrationPage;
