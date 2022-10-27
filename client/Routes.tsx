import * as React from 'react';
import {Switch} from 'react-router-dom';
import history from './store/history';
import {ConnectedRouter} from 'connected-react-router';

import AuthLayoutRoute from './layouts/AuthLayoutRoute';
import OAuthLayoutRoute from './layouts/OAuthLayoutRoute';
import AppLayoutRoute from './layouts/AppLayoutRoute';
import EditorLayoutRoute from './layouts/EditorLayoutRoute';
import LoginPage from './components/auth/LoginPage';
import RegistrationPage from './components/auth/RegistrationPage';
import ForgotPasswordPage from './components/auth/ForgotPasswordPage';
import ResetPasswordPage from './components/auth/ResetPasswordPage';
import SystemSlideshowListPage from './components/user/screens/SystemSlideshowListPage';
import SlideshowListPage from './components/user/screens/SlideshowListPage';
import StatisticElementPage from './components/user/screens/StatisticElementPage';
import StatisticStatIdPage from './components/user/screens/StatisticStatIdPage';
import StatisticSlideshowSinglePage from './components/user/screens/StatisticSlideshowSinglePage';
import StatisticSlideshowListPage from './components/user/screens/StatisticSlideshowListPage';
import ProfilePage from './components/user/ProfilePage';
import MockupsPage from './components/user/mockups/MockupsPage';
import routerUrls from './constants/routerUrls';
import AppSetsPage from './components/user/appsets/AppSetsPage';
import AppSetsForm from './components/user/appsets/AppSetsForm';
import StreamsPage from 'client/components/user/stream/StreamsPage';
import StreamAddPage from 'client/components/user/stream/StreamAddPage';
import SlideStreamEditPage from 'client/components/user/stream/SlideStreamEditPage';
import VideosPage from 'client/components/user/videohosting/VideosPage';
import VideoAdd from 'client/components/user/videohosting/VideoAdd';
import UsersPage from './components/admin/users/UsersPage';
import UserPlan from './components/user/plan/PlanPage';
import Checkout from 'client/components/user/checkout/Checkout';
import AppSetPreview from './components/user/appsets/AppSetPreview';
import SlideShowEditorPage from './components/editor/SlideShowEditorPage';
import AdminSlideshowPage from './components/admin/screens/AdminSlideshowPage';
import AdminServices from 'client/components/admin/services/AdminServices';
import StaticLayoutRoute from 'client/layouts/StaticLayoutRoute';
import TermOfUsePage from './components/pages/TermOfUsePage';
import PrivacyPolicy from 'client/components/pages/PrivacyPolicy';
import Restricted from 'client/components/pages/Restricted';
import EditUserContainer from 'client/components/admin/users/EditUserContainer';
import PricesPage from 'client/components/pages/Prices';
import ContactsPage from 'client/components/pages/Contacts';

import CheckoutHeader from 'client/components/common/CheckoutHeader';
import PaymentSuccess from 'client/components/user/checkout/PaymentSuccess';
import PaymentFail from 'client/components/user/checkout/PaymentFail';

export default () => (
	<ConnectedRouter history={history}>
		<Switch>
			<AppLayoutRoute path={routerUrls.home} exact component={() => null} />

			{/* Auth */}
			<AuthLayoutRoute path={routerUrls.authLogin} component={LoginPage} />
			<AuthLayoutRoute path={routerUrls.authRegistration} component={RegistrationPage} />
			<AuthLayoutRoute path={routerUrls.authForgotPassword} component={ForgotPasswordPage} />
			<AuthLayoutRoute path={routerUrls.authResetPassword} component={ResetPasswordPage} />

			{/* OAuth */}
			<OAuthLayoutRoute path={routerUrls.oAuthVk} oauth />
			<OAuthLayoutRoute path={routerUrls.oAuthGoogle} oauth />
			<OAuthLayoutRoute path={routerUrls.oAuthFacebook} oauth />
			<OAuthLayoutRoute path={routerUrls.oAuthTwitter} oauth />

			{/* Slideshow */}
			<AppLayoutRoute
				path={routerUrls.userSelectTemplate}
				component={SystemSlideshowListPage}
			/>
			<AppLayoutRoute
				path={routerUrls.userSelectTemplateGroup}
				component={SystemSlideshowListPage}
			/>
			<AppLayoutRoute path={routerUrls.userSlideshowGroup} component={SlideshowListPage} />
			<AppLayoutRoute path={routerUrls.userMockups} component={MockupsPage} />
			<EditorLayoutRoute
				path={routerUrls.userEditSlideshow}
				component={SlideShowEditorPage}
			/>

			{/* Statistics */}
			<AppLayoutRoute
				path={routerUrls.statisticsGroup}
				component={StatisticSlideshowListPage}
			/>
			<AppLayoutRoute
				path={routerUrls.statisticsViewElement}
				component={StatisticElementPage}
			/>
			<AppLayoutRoute
				path={routerUrls.statisticsViewStatId}
				component={StatisticStatIdPage}
			/>
			<AppLayoutRoute
				path={routerUrls.statisticsViewSlideshow}
				component={StatisticSlideshowSinglePage}
			/>

			{/* Profile */}
			<AppLayoutRoute path={routerUrls.userProfile} component={ProfilePage} />

			{/* AppsSets */}
			<AppLayoutRoute path={routerUrls.userAppsSets} exact component={AppSetsPage} />
			<AppLayoutRoute path={routerUrls.userAppsSetsCreate} component={AppSetsForm} />
			<AppLayoutRoute path={routerUrls.userAppsSetsEdit} component={AppSetsForm} />
			<AppLayoutRoute
				path={routerUrls.userStreamsAdd}
				component={StreamAddPage}
				contentWrapperMod="white"
				exact
			/>
			<AppLayoutRoute
				path={routerUrls.userStreamsEdit}
				component={SlideStreamEditPage}
				contentWrapperMod="white"
				exact
			/>
			<AppLayoutRoute
				path={routerUrls.userStreams}
				component={StreamsPage}
				contentWrapperMod="white"
				exact
			/>
			<AppLayoutRoute
				path={routerUrls.userVideoHosting}
				component={VideosPage}
				contentWrapperMod="white"
				exact
			/>
			<AppLayoutRoute
				path={routerUrls.userVideoHostingAdd}
				component={VideoAdd}
				contentWrapperMod="white"
				exact
			/>
			<AppLayoutRoute
				path={routerUrls.userPlan}
				component={UserPlan}
				contentWrapperMod="white"
			/>
			<AppLayoutRoute
				path={routerUrls.checkout}
				component={Checkout}
				contentWrapperMod="white"
				header={<CheckoutHeader />}
			/>
			<AppLayoutRoute
				path={routerUrls.paymentSuccess}
				component={PaymentSuccess}
				contentWrapperMod="white"
			/>
			<AppLayoutRoute
				path={routerUrls.paymentFail}
				component={PaymentFail}
				contentWrapperMod="white"
			/>
			<EditorLayoutRoute path={routerUrls.userAppSetPreview} component={AppSetPreview} />

			{/* Admin */}
			<AppLayoutRoute path={routerUrls.adminHome} exact component={UsersPage} isAdmin />
			<AppLayoutRoute path={routerUrls.adminUsers} exact component={UsersPage} isAdmin />
			<AppLayoutRoute
				path={routerUrls.adminUsersEdit}
				component={EditUserContainer}
				isAdmin
			/>
			<AppLayoutRoute
				path={routerUrls.adminApps}
				exact
				component={AdminSlideshowPage}
				isAdmin
			/>
			<AppLayoutRoute path={routerUrls.adminServices} component={AdminServices} isAdmin />

			{/* Static pages */}
			<StaticLayoutRoute path={routerUrls.termsOfUse} component={TermOfUsePage} />
			<StaticLayoutRoute path={routerUrls.privacyPolicy} component={PrivacyPolicy} />
			<StaticLayoutRoute path={routerUrls.prices} component={PricesPage} />
			<StaticLayoutRoute path={routerUrls.contacts} component={ContactsPage} />
			<StaticLayoutRoute path={routerUrls.restricted} component={Restricted} />

			{/* Errors */}
			{/*<AppLayoutRoute path="*" component={Error404Page} />*/}
		</Switch>
	</ConnectedRouter>
);
