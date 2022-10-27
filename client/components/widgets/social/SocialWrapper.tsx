import React from 'react';

import {ISlideElement, SlideElementSocialDisplayEnum} from 'shared/collections/SlideElements';
import {Autoscroll} from 'client/utils/slides/autoscroll';

interface ISocialWrapper {
	element: ISlideElement;
	postsCount: number;
	maxPostsCount?: number;
	counter: (activePost: number, callback: () => void) => void;
	activePost: number;
}

export class SocialWrapper extends React.PureComponent<ISocialWrapper> {
	autoscroll?: Autoscroll;
	timerId: NodeJS.Timeout;
	ref?: HTMLDivElement;

	componentDidUpdate(prevProps: Readonly<ISocialWrapper>) {
		const {element, maxPostsCount, postsCount} = this.props;

		if (
			element.postShowByOne !== prevProps.element.postShowByOne ||
			(element.postShowTime && element.postShowTime !== prevProps.element.postShowTime) ||
			maxPostsCount !== prevProps.maxPostsCount ||
			postsCount !== prevProps.postsCount
		) {
			clearInterval(this.timerId);
			this.setMessageTimeout();
		}

		if (!element.postShowByOne && this.timerId) {
			clearInterval(this.timerId);
		}

		if (element.socialDisplay !== prevProps.element.socialDisplay) {
			this.setAutoscroll();
		}
	}

	componentWillUnmount() {
		if (this.autoscroll) {
			this.autoscroll.remove();
		}

		clearInterval(this.timerId);
	}

	setAutoscroll = () => {
		const {socialDisplay} = this.props.element;

		this.setMessageTimeout();

		if (this.autoscroll) {
			this.autoscroll.remove();
		}

		if (
			this.ref &&
			(!socialDisplay || socialDisplay === SlideElementSocialDisplayEnum.MEDIA_TOP)
		) {
			this.autoscroll = new Autoscroll(this.ref);
			this.autoscroll.start();
		} else if (this.autoscroll) {
			this.autoscroll.remove();
			this.autoscroll = undefined;
		}
	};

	resetAutoscroll = () => {
		if (!this.autoscroll) {
			return;
		}

		this.props.counter(0, this.setMessageTimeout);

		this.autoscroll.remove();
		this.autoscroll.start();
	};

	setMessageTimeout = () => {
		const {element, activePost, maxPostsCount = 1, postsCount} = this.props;
		const {postShowTime = 1, postShowByOne} = element;
		const intervalMs = 1000;

		clearInterval(this.timerId);

		if (!postShowByOne || postsCount < 2) {
			return;
		}

		this.timerId = setTimeout(() => {
			this.resetAutoscroll();

			this.props.counter(
				(activePost + 1) % (maxPostsCount > postsCount ? postsCount : maxPostsCount),
				this.setMessageTimeout,
			);
		}, postShowTime * intervalMs);
	};

	render() {
		const childElement = React.Children.only(this.props.children) as React.ReactElement;

		return React.cloneElement(childElement, {
			ref: (el: HTMLDivElement) => {
				this.ref = el;
			},
		});
	}
}
