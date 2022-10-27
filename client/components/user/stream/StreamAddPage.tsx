import React from 'react';
import {withTracker} from 'react-meteor-data-with-tracker';
import {useHistory} from 'react-router-dom';
import {Redirect} from 'react-router-dom';
import Stream from 'client/components/user/stream/Stream';
import routerUrls from 'client/constants/routerUrls';
import {PaidServiceOrder, PaidServicePackagesEnum} from 'shared/collections/PaidServices';
import {Meteor} from 'meteor/meteor';
import {publishNames} from 'shared/constants/publishNames';
import SlideStreamLoading from 'client/components/user/stream/SlideStreamLoading';
import {Container} from '@material-ui/core';

interface IStreamAddPageProps {
	loading: boolean;
	permissions: PaidServicePackagesEnum[];
}

const StreamAddPage: React.FC<IStreamAddPageProps> = ({loading, permissions}) => {
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
	const onBack = (): void => {
		history.push(routerUrls.userStreams);
	};
	const onCreate = (addedSlideshowStreamId: string): void => {
		if (!addedSlideshowStreamId) return;
		history.push({
			pathname: routerUrls.userStreamsEdit.replace(':id', addedSlideshowStreamId),
			state: {
				id: addedSlideshowStreamId,
			},
		});
	};

	return <Stream onBack={onBack} onCreate={onCreate} />;
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
})(StreamAddPage);
