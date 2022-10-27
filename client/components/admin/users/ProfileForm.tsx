import * as React from 'react';
import {Meteor} from 'meteor/meteor';
import {TextField} from 'final-form-material-ui';
import {withStyles, createStyles} from '@material-ui/core/styles';
import {Form, Field} from 'react-final-form';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import Typography from '@material-ui/core/Typography/Typography';
import {RouteComponentProps} from 'react-router-dom';

import {UserSchema} from 'shared/collections/Users';
import {methodNames} from 'shared/constants/methodNames';
import {requiredInput} from 'client/components/common/ui/requiredValidator';
import FormHelperText from '@material-ui/core/FormHelperText/FormHelperText';
import {FORM_ERROR} from 'final-form';

const styles = createStyles({
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

interface IEmail {
	address: string;
	verified: boolean;
}

interface IUser extends Meteor.User {
	_id: string;
	name: string;
	surname: string;
	emails: [IEmail];
	phone: string;
	company: string;
	status: string;
}

interface IProfileFormProps {
	classes: {
		container: string;
		textFields: string;
		buttons: string;
	};
}

interface IProfileFormData {
	user: IUser;
	loading: boolean;
}

class ProfileForm extends React.PureComponent<
	IProfileFormData & IProfileFormProps & RouteComponentProps
> {
	onSubmitHandler = (values) => {
		const {user} = this.props;
		const context = UserSchema.Profile.newContext();
		context.validate(values);
		if (context.isValid()) {
			Meteor.call(methodNames.user.update, user._id, values, function(error) {
				if (error) {
					console.log(error);
				} else {
					console.log('Профиль сохранен');
				}
			});
		} else {
			const errors = context.validationErrors();
			return {[FORM_ERROR]: errors.map((e) => context.keyErrorMessage(e.name)).join()};
		}
	};

	render() {
		const {user, classes} = this.props;
		const {name, surname, company, phone} = user || {
			name: '',
			surname: '',
			company: '',
			phone: '',
		};

		return (
			<>
				<Typography variant="h5" gutterBottom>
					Редактирование профиля
				</Typography>

				<Card style={{padding: 16}}>
					<Form
						onSubmit={this.onSubmitHandler}
						initialValues={{name, surname, company, phone}}
						render={({handleSubmit, pristine, reset, submitting, submitError}) => (
							<form className={classes.container} onSubmit={handleSubmit}>
								<Field
									name="name"
									component={TextField}
									type="text"
									label="Имя"
									className={classes.textFields}
									validate={requiredInput()}
									variant="outlined"
								/>

								<Field
									name="surname"
									component={TextField}
									type="text"
									label="Фамилия"
									className={classes.textFields}
									validate={requiredInput()}
									variant="outlined"
								/>

								<Field
									name="company"
									component={TextField}
									type="text"
									label="Компания"
									className={classes.textFields}
									variant="outlined"
								/>

								<Field
									name="phone"
									component={TextField}
									type="text"
									label="Телефон"
									className={classes.textFields}
									validate={requiredInput()}
									variant="outlined"
								/>

								{!submitting && submitError && (
									<FormHelperText error>{submitError}</FormHelperText>
								)}

								<div className={classes.buttons}>
									<Button
										variant="outlined"
										color="primary"
										type="submit"
										disabled={submitting || pristine}
									>
										Сохранить
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

export default withStyles(styles)(ProfileForm);
