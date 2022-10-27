import React from 'react';
import {withTracker} from 'react-meteor-data-with-tracker';
import Stream from 'client/components/user/stream/Stream';
import {Redirect, useHistory} from 'react-router-dom';
import routerUrls from 'client/constants/routerUrls';
import {PaidServiceOrder, PaidServicePackagesEnum} from 'shared/collections/PaidServices';
import {Container} from '@material-ui/core';
import SlideStreamLoading from 'client/components/user/stream/SlideStreamLoading';
import {Meteor} from 'meteor/meteor';
import {publishNames} from 'shared/constants/publishNames';

interface ISlideStreamEditPageProps {
	loading: boolean;
	permissions: PaidServicePackagesEnum[];
}
const SlideStreamEditPage: React.FC<ISlideStreamEditPageProps> = ({loading, permissions}) => {
	if (loading) {
		return (
			<Container style={{maxWidth: '896px'}}>
				<SlideStreamLoading />
			</Container>
		);
	}
	if (
		!(Array.isArray(permissions) ? permissions : []).includes(
			PaidServicePackagesEnum.SLIDESHOW_STREAM,
		)
	) {
		return <Redirect to={routerUrls.userPlan} />;
	}
	const history = useHistory();
	const currentSlideStreamId = history.location.state?.id;

	const onBack = (): void => {
		history.push(routerUrls.userStreams);
	};
	if (!currentSlideStreamId) {
		return <Redirect to={routerUrls.userStreams} />;
	}

	return <Stream onBack={onBack} slideStreamId={currentSlideStreamId} />;
};

export default withTracker(() => {
	const psoSubscriber = Meteor.subscribe(publishNames.paidServices.orders).ready();
	const loading = !psoSubscriber;
	const pso = PaidServiceOrder.findOne();
	const permissions: string[] = pso?.permissions || [];

	return {
		loading,
		permissions,
	};
})(SlideStreamEditPage);
