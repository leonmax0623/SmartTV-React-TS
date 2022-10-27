import * as React from 'react';
import Grid from '@material-ui/core/Grid/Grid';
import {Meteor} from 'meteor/meteor';
import Paper from '@material-ui/core/Paper/Paper';
import {Field, Form} from 'react-final-form';
import {TextField} from 'final-form-material-ui';
import Button from '@material-ui/core/Button/Button';
import Typography from '@material-ui/core/Typography/Typography';
import {FORM_ERROR} from 'final-form';
import FormHelperText from '@material-ui/core/FormHelperText/FormHelperText';
import {RouteComponentProps} from 'react-router-dom';

import routerUrls from 'client/constants/routerUrls';
import LoginWithFacebookButton from 'client/components/oauth/LoginWithFacebookButton';
import './LoginPage.scss';
import {requiredInput} from 'client/components/common/ui/requiredValidator';

interface ILoginFormData {
	email: string;
	password: string;
}

interface IUser extends Meteor.User {
	status?: string;
}

class LoginPage extends React.PureComponent<RouteComponentProps> {
	onSubmitHandler = (values: ILoginFormData) => {
		return new Promise((resolve, reject) => {
			//https://final-form.org/docs/react-final-form/types/FormProps
			Meteor.loginWithPassword(values.email, values.password, (err: any) => {
				if (err) {
					this.setState({open: true});
					resolve({[FORM_ERROR]: 'Введен неверный e-mail или пароль'});
				} else {
					// login was successful, now test user status
					const user: IUser = Meteor.user();

					if (user.status === 'blocked') {
						resolve({[FORM_ERROR]: 'Доступ заблокирован'});
					}
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
							Вход
						</Typography>

						<Form
							onSubmit={this.onSubmitHandler}
							render={({handleSubmit, submitError, submitting}) => (
								<form onSubmit={handleSubmit}>
									<Field
										name="email"
										component={TextField}
										type="email"
										label="Email"
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
										label="Пароль"
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
										Войти
									</Button>

									<LoginWithFacebookButton />
								</form>
							)}
						/>
					</Paper>

					<div className="links">
						<a className="link" href={routerUrls.authRegistration}>
							Регистрация
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

export default LoginPage;
