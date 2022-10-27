import React from 'react';
import ContentLoader from 'react-content-loader';

const SlideStreamLoading: React.FC = () => {
	return (
		<ContentLoader viewBox="0 0 720 650" height={1000} width="100%">
			<rect x="0" y="0" rx="15" ry="15" width="8%" height="48" />
			<rect x="10%" y="0" rx="12" ry="12" width="90%" height="48" />
			<rect x="0" y="72" rx="12" ry="12" width="100%" height="368" />
			<rect x="0" y="464" rx="12" ry="12" width="100%" height="536" />
		</ContentLoader>
	);
};

export default SlideStreamLoading;
