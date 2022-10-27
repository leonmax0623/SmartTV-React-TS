import * as React from 'react';
import {Meteor} from 'meteor/meteor';
import {withTracker} from 'react-meteor-data-with-tracker';
import {
	LinkProps as LinkMuiProps,
	Tabs,
	Tab,
	TabProps,
	AppBar,
	Toolbar,
	Typography,
	Menu,
	MenuItem,
	ListItemText,
	ListItemIcon,
	IconButton,
	Button,
	Box,
} from '@material-ui/core';
import {
	AccountCircle,
	ExitToApp as ExitToAppIcon,
	AccountBox as AccountBoxIcon,
} from '@material-ui/icons';
import {NavLink, RouteComponentProps, withRouter, Link, LinkProps} from 'react-router-dom';
import Icon from '@mdi/react';
import {mdiFacebook, mdiVk} from '@mdi/js';

import routerUrls from '../../constants/routerUrls';
import css from './UserHeader.pcss';
import {publishNames} from 'shared/constants/publishNames';
import {Group} from 'shared/collections/Groups';
import {sharedConsts} from 'shared/constants/sharedConsts';
import {supportEmail} from 'shared/constants/contacts';
import {methodNames} from 'shared/constants/methodNames';
import {PaidServicePackagesEnum} from 'shared/collections/PaidServices';
import LockIcon from 'client/components/common/icons/LockIcon';

interface IUserHeaderProps {
	userLogged: boolean;
	defaultGroupId?: string;
}

interface IUserHeaderState {
	anchorEl: HTMLElement | null;
	isVideoHostingGranted: boolean;
	isSlideStreamsGranted: boolean;
}

interface ILinkTabProps extends TabProps {
	to?: string;
	component?: React.ReactNode;
}

export const LinkTab: React.FC<ILinkTabProps & (LinkProps | LinkMuiProps)> = (props) => (
	<Tab {...props} />
);

const LinkLabelWrapper: React.FC<{title: string; isGranted: boolean}> = ({title, isGranted}) => {
	if (isGranted) {
		return <span>{title}</span>;
	}

	return (
		<Box display="flex" alignItems="center">
			<span>{title}</span>
			<Box component="span" ml={0.5} mt={0.5}>
				<LockIcon
					viewBox="0 0 11 14"
					style={{width: '11px', height: '14px'}}
					fill="none"
					pathProps={{
						fill: 'white',
						fillOpacity: '0.54',
					}}
				/>
			</Box>
		</Box>
	);
};

class UserHeader extends React.PureComponent<
	IUserHeaderProps & RouteComponentProps,
	IUserHeaderState
> {
	state: IUserHeaderState = {
		anchorEl: null,
		isVideoHostingGranted: false,
		isSlideStreamsGranted: false,
	};

	componentDidMount() {
		Meteor.call(
			methodNames.paidServices.isGranted,
			[PaidServicePackagesEnum.VIDEO_HOSTING, PaidServicePackagesEnum.SLIDESHOW_STREAM],
			(error: Error | Meteor.Error, response: boolean) => {
				this.setState({
					isVideoHostingGranted: response[PaidServicePackagesEnum.VIDEO_HOSTING],
					isSlideStreamsGranted: response[PaidServicePackagesEnum.SLIDESHOW_STREAM],
				});
			},
		);
	}

	handleMenu = (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
		this.setState({anchorEl: event.currentTarget});
	};

	handleClose = () => {
		this.setState({anchorEl: null});
	};

	handleLogout = () => {
		Meteor.logout();

		this.handleClose();
	};

	render() {
		const {userLogged, match, defaultGroupId} = this.props;
		const {anchorEl} = this.state;
		const open = Boolean(anchorEl);
		let activeMenu: string | null = null;

		if (match.path === routerUrls.userSlideshowGroup) {
			activeMenu = routerUrls.userSlideshowGroup;
		} else if (match.path.startsWith(routerUrls.userMockups)) {
			activeMenu = routerUrls.userMockups;
		} else if (match.path.startsWith(routerUrls.userAppsSets)) {
			activeMenu = routerUrls.userAppsSets;
		}

		const {isVideoHostingGranted, isSlideStreamsGranted} = this.state;

		return (
			<AppBar classes={{root: css.appHeader}} position="fixed">
				<div className="container">
					<Toolbar className={css.toolbar} variant="dense">
						<div className={css.menuAndHeader}>
							<Typography variant="h6" color="inherit" className={css.logo}>
								<NavLink to={routerUrls.home}>PRTV</NavLink>
							</Typography>

							<Tabs className={css.tabs} variant="fullWidth" value={activeMenu}>
								{userLogged ? (
									<>
										<LinkTab
											classes={{root: css.linkTab}}
											value={routerUrls.userSlideshowGroup}
											key={routerUrls.userSlideshowGroup}
											to={routerUrls.userSlideshowGroup.replace(
												':groupId',
												defaultGroupId || '',
											)}
											component={Link}
											label="Слайдшоу"
										/>
										<LinkTab
											classes={{root: css.linkTab}}
											value={routerUrls.userMockups}
											key={routerUrls.userMockups}
											to={routerUrls.userMockups}
											component={Link}
											label="Макеты"
										/>
										<LinkTab
											classes={{root: css.linkTab}}
											value={routerUrls.userAppsSets}
											key={routerUrls.userAppsSets}
											to={routerUrls.userAppsSets}
											component={Link}
											label="Подборки"
										/>
										<LinkTab
											classes={{root: css.linkTab}}
											value={routerUrls.userStreams}
											key={routerUrls.userStreams}
											to={
												isSlideStreamsGranted
													? routerUrls.userStreams
													: routerUrls.userPlan
											}
											component={Link}
											label={
												<LinkLabelWrapper
													title="Потоки"
													isGranted={isSlideStreamsGranted}
												/>
											}
										/>
										<LinkTab
											classes={{root: css.linkTab}}
											value={routerUrls.userVideoHosting}
											key={routerUrls.userVideoHosting}
											to={
												isVideoHostingGranted
													? routerUrls.userVideoHosting
													: routerUrls.userPlan
											}
											component={Link}
											label={
												<LinkLabelWrapper
													title="Видеохостинг"
													isGranted={isVideoHostingGranted}
												/>
											}
										/>
										<LinkTab
											classes={{root: css.linkTab}}
											value={routerUrls.extInformers}
											key={routerUrls.extInformers}
											href={routerUrls.extInformers}
											target="_blank"
											component="a"
											label="Информеры"
										/>
										<LinkTab
											classes={{root: css.linkTab}}
											value={routerUrls.extInstructions}
											key={routerUrls.extInstructions}
											href={routerUrls.extInstructions}
											target="_blank"
											component="a"
											label="Инструкции"
										/>
										<LinkTab
											classes={{root: css.linkTab}}
											key="techSupport"
											href={`mailto:${supportEmail}`}
											target="_blank"
											component="a"
											label="Тех.поддержка"
										/>
										<LinkTab
											classes={{root: css.linkTab}}
											value={routerUrls.contacts}
											key={routerUrls.contacts}
											to={routerUrls.contacts}
											component={Link}
											label="Контакты"
										/>
									</>
								) : (
									<>
										<LinkTab
											classes={{root: css.linkTab}}
											key={routerUrls.extInstructions}
											to={routerUrls.extInstructions}
											href={routerUrls.extInstructions}
											target="_blank"
											component="a"
											label="Инструкции"
										/>

										<LinkTab
											classes={{root: css.linkTab}}
											value={routerUrls.contacts}
											key={routerUrls.contacts}
											to={routerUrls.contacts}
											component={Link}
											label="Контакты"
										/>

										<div style={{flex: 1}} />

										<LinkTab
											classes={{root: css.linkSocTab}}
											to={routerUrls.extFacebook}
											href={routerUrls.extFacebook}
											target="_blank"
											component="a"
											label={
												<Icon path={mdiFacebook} size={1} color="inherit" />
											}
										/>

										<LinkTab
											classes={{root: css.linkSocTab}}
											to={routerUrls.extVk}
											href={routerUrls.extVk}
											target="_blank"
											component="a"
											label={<Icon path={mdiVk} size={1} color="inherit" />}
										/>
									</>
								)}
							</Tabs>
						</div>

						{userLogged && (
							<div>
								<Tabs className={css.tabs} value={activeMenu}>
									<Box pt={1} pb={1}>
										<NavLink to={routerUrls.userPlan}>
											<Button
												variant="outlined"
												color="inherit"
												size="small"
												type="submit"
											>
												Мой тариф
											</Button>
										</NavLink>
									</Box>
									<IconButton color="inherit" onClick={this.handleMenu}>
										<AccountCircle />
									</IconButton>

									<Menu
										className={css.headerMenu}
										id="menu-appbar"
										anchorEl={anchorEl}
										anchorOrigin={{vertical: 'top', horizontal: 'right'}}
										transformOrigin={{vertical: 'top', horizontal: 'right'}}
										open={open}
										onClose={this.handleClose}
									>
										<MenuItem
											component={NavLink}
											to={routerUrls.userProfile}
											onClick={this.handleClose}
										>
											<ListItemIcon>
												<AccountBoxIcon />
											</ListItemIcon>

											<ListItemText primary="Профиль" />
										</MenuItem>

										<MenuItem onClick={this.handleLogout}>
											<ListItemIcon className="">
												<ExitToAppIcon />
											</ListItemIcon>

											<ListItemText primary="Выйти" />
										</MenuItem>
									</Menu>
								</Tabs>
							</div>
						)}
					</Toolbar>
				</div>
			</AppBar>
		);
	}
}

// @ts-ignore
export default withTracker<IUserHeaderProps, {}>(() => {
	Meteor.subscribe(publishNames.group.groups);
	const group = Group.findOne({name: sharedConsts.user.slideShowGroupDefault});

	return {
		defaultGroupId: group?._id,
		userLogged: Boolean(Meteor.userId()),
	};
})(withRouter(UserHeader));
