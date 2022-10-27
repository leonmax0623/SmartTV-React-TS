import * as React from 'react';
import {Meteor} from 'meteor/meteor';
import {withTracker} from 'react-meteor-data-with-tracker';
import {TextField} from 'final-form-material-ui';
import {createStyles, withStyles} from '@material-ui/core/styles';
import {Field, Form} from 'react-final-form';
import {RouteComponentProps} from 'react-router-dom';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Card from '@material-ui/core/Card';
import Typography from '@material-ui/core/Typography';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContentText from '@material-ui/core/DialogContentText';
import Icon from '@mdi/react';
import {mdiGoogle, mdiVk, mdiFacebook, mdiTwitter} from '@mdi/js';

import {IServices, ServiceEnum, ServiceEnumDisplay, UserSchema} from 'shared/collections/Users';
import routerUrls from '../../constants/routerUrls';
import {methodNames} from 'shared/constants/methodNames';
import {Grid} from '@material-ui/core';
import {publishNames} from 'shared/constants/publishNames';
import {appConfig} from 'client/constants/config';
import {IFbPage} from 'shared/collections/FBFeed';
import {requiredInput} from 'client/components/common/ui/requiredValidator';

export interface IUser extends Meteor.User {
	name: string;
	surname: string;
	company: string;
	phone: string;
	projectServices: IServices;
	roles?: any;
	status?: 'new';
	fbPages?: IFbPage[];
	fbPagesUpdate?: Date;
	slideShowGroups: ISlideShowGroup[];
}

interface ISlideShowGroup {
	name: string;
}

interface IProfileFormProps extends RouteComponentProps {
	classes?: {
		container?: string;
		textFields?: string;
		buttons?: string;
		dialogTextFields?: string;
		dialogButtonsContainer?: string;
	};
}

interface IProfileFormData {
	user: IUser;
	loading: boolean;
}

interface IProfileFormState {
	resetPasswordDialogOpened: boolean;
	resetPasswordResultOpened: boolean;
	changeResult: String;
}

interface IResetPasswordData {
	oldPassword: string;
	password: string;
}

const styles = createStyles({
	container: {
		display: 'flex',
		flexWrap: 'wrap',
		flexDirection: 'column',
	},
	textFields: {
		margin: '10px 0 !important',
	},
	dialogTextFields: {
		margin: '10px 0 !important',
		width: '100%',
	},
	buttons: {
		display: 'flex',
		flexWrap: 'wrap',
		flexDirection: 'row-reverse',
	},
	dialogButtonsContainer: {
		display: 'flex',
		justifyContent: 'flex-end',
	},
});

class ProfilePage extends React.Component<IProfileFormData & IProfileFormProps, IProfileFormState> {
	constructor(props: IProfileFormData & IProfileFormProps) {
		super(props);

		this.state = {
			resetPasswordDialogOpened: false,
			resetPasswordResultOpened: false,
			changeResult: '',
		};
	}

	onSubmitHandler = (values: IUser) => {
		const context = UserSchema.Profile.newContext();
		context.validate(values);

		if (context.isValid()) {
			Meteor.call(methodNames.user.update, Meteor.userId(), values, (error: any) => {
				if (error) {
					console.log(error);
				} else {
					console.log('Профиль сохранен');
				}
			});
		}
	};

	resetPassword = (values: IResetPasswordData) => {
		Accounts.changePassword(values.oldPassword, values.password, (err) => {
			let text;
			if (err) {
				this.setState({changeResult: 'Старый пароль не верный, попробуйте еще раз.'});
				console.error(err);
			} else {
				this.setState({
					resetPasswordDialogOpened: false,
					changeResult: 'Пароль изменен!',
				});
			}
		});
	};

	toggleService = (serviceName: ServiceEnum, isEnable: boolean) => {
		if (!this.serviceAppId(serviceName)) {
			return;
		}

		if (isEnable) {
			switch (serviceName) {
				case ServiceEnum.GOOGLE:
					window.open(
						`https://accounts.google.com/o/oauth2/v2/auth?
						client_id=${this.serviceAppId(serviceName)}&
						redirect_uri=${window.location.origin + encodeURI(routerUrls.oAuthGoogle)}&
						access_type=offline&
						include_granted_scopes=true&
						response_type=code&
						scope=openid%20email%20https://www.googleapis.com/auth/drive.file%20https://www.googleapis.com/auth/youtube.readonly&
						state=${serviceName}::${window.location.origin + encodeURI(routerUrls.oAuthGoogle)}`,
						'_blank',
					);

					break;

				case ServiceEnum.VK:
					window.open(
						`https://oauth.vk.com/authorize?client_id=${this.serviceAppId(
							serviceName,
						)}&redirect_uri=${window.location.origin +
							encodeURI(
								routerUrls.oAuthVk,
							)}&response_type=code&scope=wall,offline,friends,photos,video&state=${
							ServiceEnum.VK
						}::${window.location.origin + encodeURI(routerUrls.oAuthVk)}`,
						'_blank',
					);

					break;

				case ServiceEnum.FACEBOOK:
					window.open(
						`https://www.facebook.com/v5.0/dialog/oauth?client_id=${this.serviceAppId(
							serviceName,
						)}&redirect_uri=${window.location.origin +
							encodeURI(
								routerUrls.oAuthFacebook,
							)}&response_type=code&scope=manage_pages&state=${
							ServiceEnum.FACEBOOK
						}::${window.location.origin + encodeURI(routerUrls.oAuthFacebook)}`,
						'_blank',
					);

					break;

				case ServiceEnum.TWITTER:
					const callbackUrl = window.location.origin + encodeURI(routerUrls.oAuthTwitter);

					Meteor.callAsync(methodNames.twitter.getAuthToken, {
						oauthCallback: callbackUrl,
					}).then((data: {authToken?: string; error?: string}) => {
						const {authToken, error} = data;

						if (error) {
							console.log(error);
							return;
						}

						window.open(
							`https://api.twitter.com/oauth/authorize?oauth_token=${authToken}`,
							'_blank',
						);
					});

					break;
			}
		} else {
			Meteor.call(
				methodNames.user.toggleService,
				{state: serviceName},
				this.serviceAppId(serviceName),
				false,
			);
		}
	};

	serviceAppId = (serviceName: ServiceEnum) => {
		switch (serviceName) {
			case ServiceEnum.GOOGLE:
				return appConfig.GOOGLE_CLIENT_ID;

			case ServiceEnum.VK:
				return appConfig.VK_APP_ID;

			case ServiceEnum.FACEBOOK:
				return appConfig.FACEBOOK_APP_ID;

			case ServiceEnum.TWITTER:
				return appConfig.FACEBOOK_APP_ID;
		}

		return null;
	};

	serviceIcon = (serviceName: ServiceEnum) => {
		switch (serviceName) {
			case ServiceEnum.GOOGLE:
				return <Icon path={mdiGoogle} size={4} color="#3B7DED" />;

			case ServiceEnum.VK:
				return <Icon path={mdiVk} size={4} color="#4A76A8" />;

			case ServiceEnum.FACEBOOK:
				return <Icon path={mdiFacebook} size={4} color="#3A559F" />;

			case ServiceEnum.TWITTER:
				return <Icon path={mdiTwitter} size={4} color="#1D9BF0" />;
		}

		return null;
	};

	serviceDescriptions = (sericeName: ServiceEnum) => {
		switch (sericeName) {
			case ServiceEnum.VK:
				return 'Позволяет отображать стену пользователя в слайдшоу';

			case ServiceEnum.GOOGLE:
				return 'Позволяет использовать файлы из Вашего аккаунта в Google Диск в слайдшоу';
		}

		return null;
	};

	render() {
		const {user, loading, classes} = this.props;

		if (loading) {
			return <CircularProgress />;
		}

		const {name, surname, company, phone, projectServices} = user;

		const halfXs = 6;
		const gridSpacing = 2;

		return (
			<div style={{padding: 16}}>
				<Form
					onSubmit={this.onSubmitHandler}
					initialValues={{name, surname, company, phone}}
					render={({handleSubmit, pristine, submitting}) => (
						<form onSubmit={handleSubmit}>
							<Grid container spacing={gridSpacing}>
								<Grid item xs={halfXs}>
									<Card>
										<CardContent className={classes.container}>
											<Typography variant="h5" gutterBottom>
												Редактирование профиля
											</Typography>

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
										</CardContent>

										<CardActions>
											<Button
												variant="outlined"
												color="primary"
												style={{marginLeft: 'auto'}}
												onClick={() =>
													this.setState({resetPasswordDialogOpened: true})
												}
											>
												Изменить пароль
											</Button>
											<Button
												variant="outlined"
												color="primary"
												type="submit"
												disabled={submitting || pristine}
											>
												Сохранить
											</Button>
										</CardActions>
									</Card>
								</Grid>

								<Grid item xs={halfXs}>
									<Card>
										<CardContent className={classes.container}>
											<Typography variant="h5" gutterBottom>
												Подключение сервисов
											</Typography>

											<Typography variant="subtitle2">
												Сервисы можно отключить в любое время
											</Typography>

											{Object.values(ServiceEnum)
												.filter((value) => value !== ServiceEnum.TWITTER) // TODO: Убрать если понадобится
												.map((serviceName: ServiceEnum, index) => (
													<Grid
														container
														alignItems="center"
														justify="space-between"
														spacing={5}
														key={index}
													>
														<Grid item>
															{this.serviceIcon(serviceName)}
														</Grid>

														<Grid item style={{flex: 1}}>
															<Typography variant="h6">
																{
																	Object.values(
																		ServiceEnumDisplay,
																	)[index]
																}
															</Typography>

															<Typography variant="subtitle2">
																{this.serviceDescriptions(
																	serviceName,
																)}
															</Typography>
														</Grid>

														<Grid item>
															<Button
																variant="outlined"
																color="primary"
																type="submit"
																onClick={() =>
																	this.toggleService(
																		serviceName,
																		!projectServices[
																			serviceName
																		],
																	)
																}
															>
																{!!projectServices[serviceName]
																	? 'Отключить'
																	: 'Подключить'}
															</Button>
														</Grid>
													</Grid>
												))}
										</CardContent>
									</Card>
								</Grid>
							</Grid>
						</form>
					)}
				/>

				<Dialog open={this.state.resetPasswordDialogOpened}>
					<DialogTitle>Изменение пароля</DialogTitle>
					<DialogContent>
						<Form
							onSubmit={this.resetPassword}
							render={({handleSubmit, pristine, submitting}) => (
								<form onSubmit={handleSubmit}>
									<Field
										name="oldPassword"
										component={TextField}
										type="password"
										label="Старый пароль"
										className={classes.dialogTextFields}
										validate={requiredInput()}
										variant="outlined"
									/>

									<Field
										name="password"
										component={TextField}
										type="password"
										label="Новый пароль"
										className={classes.dialogTextFields}
										validate={requiredInput()}
										variant="outlined"
									/>

									<div className={classes.dialogButtonsContainer}>
										<Button
											variant="outlined"
											color="primary"
											disabled={submitting}
											onClick={() => {
												this.setState({resetPasswordDialogOpened: false});
											}}
										>
											Отменить
										</Button>
										<Button
											variant="outlined"
											color="primary"
											type="submit"
											style={{marginLeft: '10px'}}
											disabled={submitting || pristine}
											onClick={() =>
												this.setState({resetPasswordResultOpened: true})
											}
										>
											Изменить
										</Button>
									</div>
								</form>
							)}
						/>
					</DialogContent>
				</Dialog>
				<Dialog open={this.state.resetPasswordResultOpened}>
					<DialogTitle>Результат:</DialogTitle>
					<DialogContent>
						<DialogContentText>{this.state.changeResult}</DialogContentText>
					</DialogContent>
					<DialogActions>
						<Button
							variant="outlined"
							color="primary"
							type="submit"
							style={{marginLeft: '10px'}}
							onClick={() => this.setState({resetPasswordResultOpened: false})}
						>
							OK
						</Button>
					</DialogActions>
				</Dialog>
			</div>
		);
	}
}

export default withTracker<{}, IProfileFormProps>(() => {
	const subProfile = Meteor.subscribe(publishNames.user.userProfile);
	const loading = !subProfile.ready();

	return {
		loading,
		user: Meteor.user() as IUser,
	};
})(withStyles(styles)(ProfilePage));
