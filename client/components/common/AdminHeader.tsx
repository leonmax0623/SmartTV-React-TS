import * as React from 'react';
import {Meteor} from 'meteor/meteor';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Tabs from '@material-ui/core/Tabs';
import Tab, {TabProps} from '@material-ui/core/Tab';
import {NavLink} from 'react-router-dom';

import routerUrls from 'client/constants/routerUrls';
import './AdminHeader.scss';

interface IAdminHeaderState {
	selectedMenu: string;
}

interface ILinkTabProps extends TabProps {
	to: string;
}

const LinkTab = (props: ILinkTabProps) => {
	return <Tab component={NavLink} {...props} />;
};

class AdminHeader extends React.PureComponent<{}, IAdminHeaderState> {
	state = {
		selectedMenu: 'users',
	};

	handleLogout = () => {
		Meteor.logout();
	};

	onTabChange = (e: object, selectedMenu: string) => {
		if (!selectedMenu) return;
		this.setState({selectedMenu});
	};

	render() {
		const {selectedMenu} = this.state;

		return (
			<AppBar className="adminHeader" position="fixed">
				<div className="container">
					<Toolbar className="toolbar" variant="dense">
						<div className="menuAndHeader">
							<Typography variant="h6" color="inherit" className="logo">
								<a href={routerUrls.adminHome}>Панель управления</a>
							</Typography>

							<Tabs
								variant="fullWidth"
								value={selectedMenu}
								onChange={this.onTabChange}
							>
								<LinkTab
									value="users"
									key="users"
									to={routerUrls.adminUsers}
									label="Пользователи"
								/>
								<LinkTab
									value="apps"
									key="apps"
									to={routerUrls.adminApps}
									label="Экраны"
								/>
								<LinkTab
									value="paidServices"
									key="paidServices"
									to={routerUrls.adminServices}
									label="Услуги"
								/>
								<Tab
									value="logout"
									key="logout"
									onClick={this.handleLogout}
									label="Выйти"
								/>
							</Tabs>
						</div>
					</Toolbar>
				</div>
			</AppBar>
		);
	}
}

export default AdminHeader;
