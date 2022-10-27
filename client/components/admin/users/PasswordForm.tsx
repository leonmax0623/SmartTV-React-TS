import * as React from 'react';
import {Meteor} from 'meteor/meteor';
import {TextField} from 'final-form-material-ui';
import {withStyles, createStyles} from '@material-ui/core/styles';
import {Form, Field} from 'react-final-form';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import Typography from '@material-ui/core/Typography/Typography';

import {methodNames} from 'shared/constants/methodNames';
import {requiredInput} from 'client/components/common/ui/requiredValidator';

const styles = createStyles({
	title: {
		paddingTop: '15px',
	},
	container: {
		display: 'flex',
		flexWrap: 'wrap',
		flexDirection: 'column',
	},
	textFields: {
		margin: '10px 0',
	},
	buttons: {
		display: 'flex',
		flexWrap: 'wrap',
		flexDirection: 'row-reverse',
	},
});

interface INewPasswordFormData {
	password: string;
	passwordRe: string;
}

interface IPasswordFormProps {
	classes: {
		container: string;
		title: string;
		textFields: string;
		buttons: string;
	};
	userId: string;
}

class PasswordForm extends React.PureComponent<IPasswordFormProps> {
	onSubmitHandler = (values) => {
		const {userId} = this.props;

		Meteor.call(methodNames.user.setPassword, userId, values.password, function(error, result) {
			if (error) {
				console.log(error.reason);
			} else {
				console.log('Новый пароль установлен!');
			}
		});
	};

	render() {
		const {classes} = this.props;

		return (
			<>
				<Typography variant="h5" className={classes.title} gutterBottom>
					Смена пароля
				</Typography>

				<Card style={{padding: 16}}>
					<Form
						onSubmit={this.onSubmitHandler}
						validate={(values) => {
							const errors: INewPasswordFormData = {
								password: undefined,
								passwordRe: undefined,
							};
							const valuesData = values as INewPasswordFormData;

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
						render={({handleSubmit, pristine, reset, submitting}) => (
							<form className={classes.container} onSubmit={handleSubmit}>
								<Field
									name="password"
									component={TextField}
									type="password"
									label="Новый пароль"
									className={classes.textFields}
									validate={requiredInput()}
									variant="outlined"
								/>

								<Field
									name="passwordRe"
									component={TextField}
									type="password"
									label="Повторите пароль"
									className={classes.textFields}
									validate={requiredInput()}
									variant="outlined"
								/>

								<div className={classes.buttons}>
									<Button
										variant="outlined"
										color="primary"
										type="submit"
										disabled={submitting || pristine}
									>
										Сменить пароль
									</Button>
								</div>
							</form>
						)}
					/>
				</Card>
			</>
		);
	}
}

export default withStyles(styles)(PasswordForm);
