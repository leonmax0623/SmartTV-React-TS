import React, {useState} from 'react';
import css from './CircleTabs.pcss';

interface ICircleTabItem {
	id: string;
	title: string;
	content: React.ReactChild;
}

interface ICircleTabsProps {
	value: string;
	tabs: ICircleTabItem[];
}

const CircleTabs: React.FC<ICircleTabsProps> = ({tabs, value}) => {
	const [activeTabId, setActiveTabId] = useState(value);
	function onTabChange(tabId: string) {
		setActiveTabId(tabId);
	}

	const activeTabContent = () => {
		const tab = tabs.find(({id}) => id === activeTabId);
		if (!tab) return '';

		return <div key={tab.id}>{tab.content}</div>;
	};

	return (
		<div>
			<div className={css.circleTabsWrapper}>
				<div className={css.circleTabs}>
					{tabs.map((tab) => {
						let tabClassName = css.circleTab;
						tabClassName += activeTabId === tab.id ? ` ${css.active}` : '';

						return (
							<a
								href="#"
								key={tab.id}
								onClick={(e) => {
									e.preventDefault();
									onTabChange(tab.id);
								}}
								className={tabClassName}
							>
								{tab.title}
							</a>
						);
					})}
				</div>
			</div>
			{activeTabContent()}
		</div>
	);
};

export default CircleTabs;
