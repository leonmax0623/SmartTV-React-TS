import React, {useState} from 'react';
import {
	AppBar,
	Box,
	IconButton,
	ListItemIcon,
	ListItemText,
	Menu,
	MenuItem,
} from '@material-ui/core';
import {
	AccountCircle,
	ExitToApp as ExitToAppIcon,
	AccountBox as AccountBoxIcon,
} from '@material-ui/icons';
import {NavLink} from 'react-router-dom';
import routerUrls from 'client/constants/routerUrls';
import css from './CheckoutHeader.pcss';
const CheckoutHeader: React.FC = () => {
	const [anchorEl, setAnchorEl] = useState();

	function handleMenu(event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) {
		setAnchorEl(event.currentTarget);
	}
	function handleClose() {
		setAnchorEl(null);
	}
	function handleLogout() {
		Meteor.logout();

		handleClose();
	}

	return (
		<AppBar
			position="fixed"
			style={{backgroundColor: '#fff', color: 'rgba(0, 0, 0, 0.87)'}}
			classes={{root: css.checkoutHeader}}
		>
			<Box className={css.wrapper}>
				<Box className={css.brand}>PRTV</Box>
				<Box className={css.main}>
					<NavLink to={routerUrls.userPlan} className={css.backLink}>
						<Box mr={3}>
							<svg
								width="16"
								height="16"
								viewBox="0 0 16 16"
								fill="none"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path
									d="M14.7912 7.00508H3.62124L8.50124 2.12508C8.89124 1.73508 8.89124 1.09508 8.50124 0.705083C8.31441 0.517831 8.06076 0.412598 7.79624 0.412598C7.53172 0.412598 7.27807 0.517831 7.09124 0.705083L0.50124 7.29508C0.11124 7.68508 0.11124 8.31508 0.50124 8.70508L7.09124 15.2951C7.48124 15.6851 8.11124 15.6851 8.50124 15.2951C8.89124 14.9051 8.89124 14.2751 8.50124 13.8851L3.62124 9.00508H14.7912C15.3412 9.00508 15.7912 8.55508 15.7912 8.00508C15.7912 7.45508 15.3412 7.00508 14.7912 7.00508Z"
									fill="black"
									fillOpacity="0.54"
								/>
							</svg>
						</Box>
						<Box>Оплата тарифа</Box>
					</NavLink>
				</Box>
				<Box className={css.account} color="#FFFFFF">
					<IconButton onClick={handleMenu} style={{backgroundColor: '#3F51B5'}}>
						<AccountCircle color="inherit" style={{color: '#FFFFFF'}} />
					</IconButton>

					<Menu
						className={css.headerMenu}
						id="menu-appbar"
						anchorEl={anchorEl}
						anchorOrigin={{vertical: 'top', horizontal: 'right'}}
						transformOrigin={{vertical: 'top', horizontal: 'right'}}
						open={Boolean(anchorEl)}
						onClose={handleClose}
					>
						<MenuItem
							component={NavLink}
							to={routerUrls.userProfile}
							onClick={handleClose}
						>
							<ListItemIcon>
								<AccountBoxIcon />
							</ListItemIcon>

							<ListItemText primary="Профиль" />
						</MenuItem>

						<MenuItem onClick={handleLogout}>
							<ListItemIcon className="">
								<ExitToAppIcon />
							</ListItemIcon>

							<ListItemText primary="Выйти" />
						</MenuItem>
					</Menu>
				</Box>
			</Box>
		</AppBar>
	);
};

import {Meteor} from 'meteor/meteor';

export default CheckoutHeader;
