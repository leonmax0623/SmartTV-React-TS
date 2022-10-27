import * as React from 'react';
import {RouteComponentProps} from 'react-router-dom';
import {Accounts} from 'meteor/accounts-base';
import Grid from '@material-ui/core/Grid/Grid';
import Paper from '@material-ui/core/Paper/Paper';
import {Field, Form} from 'react-final-form';
import {TextField} from 'final-form-material-ui';
import Button from '@material-ui/core/Button/Button';
import Typography from '@material-ui/core/Typography/Typography';
import {FORM_ERROR} from 'final-form';
import FormHelperText from '@material-ui/core/FormHelperText/FormHelperText';
import {requiredInput} from 'client/components/common/ui/requiredValidator';

interface IResetFormData {
	password: string;
	passwordRe: string;
}

class ResetPasswordPage extends React.PureComponent<RouteComponentProps<{token: string}>> {
	onSubmitHandler = (values: IResetFormData) => {
		return new Promise((resolve, reject) => {
			Accounts.resetPassword(this.props.match.params.token, values.password, (err: any) => {
				if (err) {
					reject({[FORM_ERROR]: 'Ошибка сброса пароля'});
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
							Ввод нового пароля
						</Typography>

						<Form
							onSubmit={this.onSubmitHandler}
							validate={(values) => {
								const errors: Partial<IResetFormData> = {};
								const valuesData = values as IResetFormData;

								if (valuesData.password !== valuesData.passwordRe) {
									errors.passwordRe = 'Пароли не совпадают';
								}

								if (valuesData.password && valuesData.password.length < 6) {
									errors.password = 'Не менее 6 символов';
								}

								if (valuesData.password && valuesData.password.length > 20) {
									errors.password = 'Не более 20 символов';
								}

								return errors;
							}}
							render={({handleSubmit, submitError, submitting}) => (
								<form onSubmit={handleSubmit}>
									<Field
										name="password"
										component={TextField}
										type="password"
										label="Новый пароль"
										validate={requiredInput()}
										variant="outlined"
										className="field"
										margin="dense"
										fullWidth
									/>

									<Field
										name="passwordRe"
										component={TextField}
										type="password"
										label="Повторите пароль"
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
										variant="contained"
										size="large"
										fullWidth
									>
										Изменить пароль
									</Button>
								</form>
							)}
						/>
					</Paper>
				</Grid>
			</Grid>
		);
	}
}

export default ResetPasswordPage;
