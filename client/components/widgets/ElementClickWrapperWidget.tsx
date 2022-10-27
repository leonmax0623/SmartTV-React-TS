import * as React from 'react';

interface IStatisticsWrapperWidgetProps {
	useHref: boolean;
	href?: string | null;
}

const WINDOW_TARGET = '_self';
// const WINDOW_TARGET = '_blank';
export class ElementClickWrapperWidget extends React.PureComponent<IStatisticsWrapperWidgetProps> {
	onClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
		if (this.props.useHref && this.props.href) {
			e.stopPropagation();
			const win = window.open(this.props.href, WINDOW_TARGET);
			win!.focus();
		}
	};
	render() {
		return <span onClick={this.onClick}>{this.props.children} </span>;
	}
}
