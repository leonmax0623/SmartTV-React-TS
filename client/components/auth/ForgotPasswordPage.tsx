import * as React from 'react';
import {RouteComponentProps} from 'react-router-dom';
import {Accounts} from 'meteor/accounts-base';
import Grid from '@material-ui/core/Grid/Grid';
import Paper from '@material-ui/core/Paper/Paper';
import Button from '@material-ui/core/Button/Button';
import Typography from '@material-ui/core/Typography/Typography';
import FormHelperText from '@material-ui/core/FormHelperText/FormHelperText';
import {Formik, FormikActions} from 'formik';

import Input from '../common/ui/Input';
import routerUrls from 'client/constants/routerUrls';
import {requiredInput} from 'client/components/common/ui/requiredValidator';

interface IForgotFormData {
	email: string;
}

class ForgotPasswordPage extends React.PureComponent<RouteComponentProps> {
	state = {submitSuccess: false};

	onSubmitHandler = (values: IForgotFormData, actions: FormikActions<IForgotFormData>) => {
		Accounts.forgotPassword(values, (err: any) => {
			if (err) {
				const errorMessage =
					err.reason === 'User not found'
						? 'E-mail не найден'
						: 'Ошибка восстановления пароля';

				actions.setStatus(errorMessage);
			} else {
				this.setState({
					submitSuccess: true,
				});
			}

			actions.setSubmitting(false);
		});
	};

	render() {
		const {submitSuccess} = this.state;
		const initData: IForgotFormData = {email: ''};

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
							Восстановление доступа
						</Typography>

						{!submitSuccess && (
							<>
								<Typography className="title" variant="subtitle2">
									Чтобы восстановить доступ, укажите E-mail, который вы
									использовали при регистрации. Мы отправим на него инструкции по
									восстановлению пароля.
								</Typography>

								<Formik
									onSubmit={this.onSubmitHandler}
									initialValues={initData}
									render={({handleSubmit, status, isSubmitting}) => (
										<form onSubmit={handleSubmit}>
											<Input
												name="email"
												type="email"
												label="Email"
												validate={requiredInput()}
											/>

											{!isSubmitting && status && (
												<FormHelperText error>{status}</FormHelperText>
											)}

											<Button
												disabled={isSubmitting}
												className="button"
												type="submit"
												color="primary"
												variant="contained"
												size="large"
												fullWidth
											>
												Отправить
											</Button>
										</form>
									)}
								/>
							</>
						)}

						{submitSuccess && (
							<Typography className="title" variant="subtitle2">
								На вашу почту было отправленно письмо с инструкциями.
							</Typography>
						)}
					</Paper>

					<div className="links">
						<a className="link" href={routerUrls.authLogin}>
							Вход
						</a>
						&nbsp; &middot; &nbsp;
						<a className="link" href={routerUrls.authRegistration}>
							Регистрация
						</a>
					</div>
				</Grid>
			</Grid>
		);
	}
}

export default ForgotPasswordPage;
