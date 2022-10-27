import React from 'react';
import ZoomMtgEmbedded, {EmbeddedClient} from '@zoomus/websdk/embedded';
import {ISlideElement} from 'shared/collections/SlideElements';
import {methodNames} from 'shared/constants/methodNames';

import './ZoomWidget.css';

export interface IZoomWidget {
	element: ISlideElement;
	isPreview?: boolean;
	editorMode?: boolean;
}

class ZoomWidget extends React.Component<IZoomWidget, unknown> {
	meetingSDKElementRef: React.RefObject<HTMLDivElement>;
	client: typeof EmbeddedClient;

	constructor(props: IZoomWidget) {
		super(props);

		this.meetingSDKElementRef = React.createRef<HTMLDivElement>();
		this.client = ZoomMtgEmbedded.createClient();
	}

	componentDidMount() {
		if (this.props.isPreview || this.props.editorMode) return;
		this.getSignature().then(this.startMeeting.bind(this));
	}

	async getSignature() {
		const {_id: elementId} = this.props.element;

		return new Promise<string>((resolve) =>
			Meteor.call(methodNames.zoom.getSignature, elementId, (err: unknown, res: string) =>
				resolve(res),
			),
		);
	}

	startMeeting(signature: string) {
		const rootRect = this.meetingSDKElementRef?.current?.getBoundingClientRect();

		console.log(this.meetingSDKElementRef?.current);
		console.log(rootRect);

		this.client.init({
			debug: true,
			zoomAppRoot: this.meetingSDKElementRef?.current,
			language: 'ru-RU',
			customize: {
				video: {
					popper: {
						disableDraggable: true,
					},
					viewSizes: {
						default: {
							width: rootRect?.width,
							height: rootRect?.height,
						},
					},
				},
			},
		});

		this.client
			.join({
				sdkKey: this.props.element.zoom_sdkKey,
				signature: signature,
				meetingNumber: this.props.element.zoom_meetingNumber || '',
				password: this.props.element.zoom_password,
				userName: this.props.element.zoom_userName || 'prtv',
				userEmail: this.props.element.zoom_userEmail,
				tk: '',
			})
			.catch((err: unknown) => console.error(err));
	}

	render() {
		return (
			<div
				className={this.props.isPreview || this.props.editorMode ? '' : 'zoom-view-port'}
				ref={this.meetingSDKElementRef}
			/>
		);
	}
}

export default ZoomWidget;
