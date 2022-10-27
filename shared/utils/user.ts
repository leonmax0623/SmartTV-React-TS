import {IUser} from 'client/components/user/ProfilePage';

export const checkAdmin = (user?: IUser) => checkRole(user, 'admin');

export const checkRole = (user?: IUser, role?: string) =>
	user ? checkRoleByUser(user, role) : checkRoleByUser(Meteor.user() as IUser, role);

const checkRoleByUser = (user?: IUser, role?: string) =>
	!!user &&
	!!user.roles &&
	!!user.roles.__global_roles__ &&
	!!user.roles.__global_roles__.find((v: string) => v === role);
