import * as React from 'react';
import {Meteor} from 'meteor/meteor';
import {methodNames} from 'shared/constants/methodNames';

interface IStatisticsWrapperWidgetProps {
	calculate: boolean;
	elementId: string;
}

export class StatisticsWrapperWidget extends React.PureComponent<IStatisticsWrapperWidgetProps> {
	componentDidMount() {
		// на случай если окно резко закроется
		window.addEventListener('beforeunload', this.reportUnmount, false);
		const {elementId, calculate} = this.props;
		if (calculate) {
			Meteor.call(
				methodNames.statistics.mounted,
				elementId,
				Meteor.connection._lastSessionId,
			);
		}
	}

	componentWillUnmount() {
		this.reportUnmount();
	}

	reportUnmount = () => {
		const {elementId, calculate} = this.props;
		if (calculate) {
			Meteor.call(
				methodNames.statistics.unmounted,
				elementId,
				Meteor.connection._lastSessionId,
			);
		}
	};

	render() {
		return this.props.children;
	}
}
