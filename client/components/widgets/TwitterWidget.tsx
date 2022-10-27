import * as React from 'react';
import {Meteor} from 'meteor/meteor';
import {withTracker} from 'react-meteor-data-with-tracker';
import isEqual from 'lodash/isEqual';

import {ISlideElement} from 'shared/collections/SlideElements';
import {methodNames} from 'shared/constants/methodNames';
import {makeQueryTwitter} from 'shared/utils/twitter';
import {ITwitterFeedItem, Twitter, TwitterGetTypeEnum} from 'shared/collections/Twitter';

import TwitPreview from 'client/components/widgets/social/TwitPreview';
import {SocialWrapper} from 'client/components/widgets/social/SocialWrapper';
import {IFeedStyles} from 'client/types/elements';
import css from './TwitterWidget.pcss';
import {twitterMakeValue} from 'client/utils/slides/element';

interface ITwitterWidgetProps {
	element: ISlideElement;
	styles?: IFeedStyles;
	inCurrentSlide: boolean;
}

interface ITwitterWidgetData {
	feeds?: ITwitterFeedItem[];
	loading: boolean;
}

interface ITwitterState {
	activePost: number;
}

class TwitterWidget extends React.PureComponent<
	ITwitterWidgetProps & ITwitterWidgetData,
	ITwitterState
> {
	wrapperRef: SocialWrapper;

	state = {
		activePost: 0,
	};

	componentDidMount() {
		if (this.props.inCurrentSlide) {
			this.wrapperRef.setAutoscroll();
		}
	}

	componentDidUpdate(prevProps: Readonly<ITwitterWidgetProps>) {
		const {element, inCurrentSlide} = this.props;
		const {
			twitterGetType,
			twitterProfileNameForList,
			twitterProfileNameForCollection,
		} = element;

		if (twitterProfileNameForList !== prevProps.element.twitterProfileNameForList) {
			Meteor.call(methodNames.twitter.getLists, element._id);
		}

		if (twitterProfileNameForCollection !== prevProps.element.twitterProfileNameForCollection) {
			Meteor.call(methodNames.twitter.getCollections, element._id);
		}

		if (
			!isEqual(
				{
					...element,
					twitterProfileNameForList: undefined,
					twitterProfileNameForCollection: undefined,
				},
				{
					...prevProps.element,
					twitterProfileNameForList: undefined,
					twitterProfileNameForCollection: undefined,
				},
			)
		) {
			Meteor.call(
				methodNames.twitter.updateFeed,
				twitterMakeValue({element, type: twitterGetType}),
				twitterGetType,
				element._id,
			);

			this.wrapperRef.resetAutoscroll();
		}

		if (inCurrentSlide && !prevProps.inCurrentSlide) {
			this.wrapperRef.setAutoscroll();
		}
	}

	setActivePost = (activePost: number, callback: () => void) => {
		this.setState({activePost});

		callback();
	};

	render() {
		const {
			twitterHashtag,
			twitterProfileName,
			twitterGetType,
			twitterProfileNameForList,
			twitterProfileNameForCollection,
			twitterListId,
			twitterCollectionId,
			opacity,
			fontSize,
			textColor,
			postShowByOne,
			twitsCount,
		} = this.props.element;
		const {feeds, styles} = this.props;

		const {activePost} = this.state;
		let filteredFeeds = feeds;

		if (postShowByOne && feeds && feeds.length) {
			filteredFeeds = Array.of(feeds[activePost]).filter((f) => f);
		}

		let errorMessage;

		if (feeds?.length === 0) {
			errorMessage = 'Нет твитов для отображения';
		}

		switch (twitterGetType) {
			case TwitterGetTypeEnum.HASHTAG:
				if (!twitterHashtag) {
					errorMessage = 'Укажите тег!';
				}

				break;

			case TwitterGetTypeEnum.PROFILE_NAME:
				if (!twitterProfileName) {
					errorMessage = 'Укажите имя пользователя';
				}

				break;

			case TwitterGetTypeEnum.LIST:
				if (!twitterProfileNameForList) {
					errorMessage = 'Укажите имя пользователя';
				} else if (!twitterListId) {
					errorMessage = 'Выберите список';
				}

				break;

			case TwitterGetTypeEnum.COLLECTION:
				if (!twitterProfileNameForCollection) {
					errorMessage = 'Укажите имя пользователя';
				} else if (!twitterCollectionId) {
					errorMessage = 'Выберите коллекцию';
				}

				break;
		}

		return (
			<SocialWrapper
				element={this.props.element}
				postsCount={(feeds && feeds.length) || 0}
				maxPostsCount={twitsCount}
				counter={this.setActivePost}
				activePost={activePost}
				ref={(el) => {
					if (!el) {
						return;
					}

					this.wrapperRef = el;
				}}
			>
				<div
					className={css.twitterElement}
					style={{
						fontSize,
						opacity,
						color: textColor,
					}}
				>
					{errorMessage || (
						<>
							{this.props.loading
								? 'Загрузка...'
								: filteredFeeds?.map((item) => (
										<TwitPreview
											styles={styles!}
											key={item.twitterId}
											item={item}
											element={this.props.element}
										/>
								  ))}
						</>
					)}
				</div>
			</SocialWrapper>
		);
	}
}

// @ts-ignore
export default withTracker<ITwitterWidgetData, ITwitterWidgetProps>(({element}) => {
	const {
		twitterGetType,
		twitterHashtag,
		twitterProfileName,
		twitterProfileNameForList,
		twitterListId,
		twitterProfileNameForCollection,
		twitterCollectionId,
		twitsCount,
		twitterHashtagFilter,
	} = element;

	const twitterValue = twitterMakeValue({element, type: twitterGetType});
	if (twitterValue) {
		const query = {
			query: makeQueryTwitter(twitterGetType, twitterValue, element),
		};
		const twit = Twitter.findOne(query);
		const loading = !Meteor.subscribe('twitter', {
			twitterGetType,
			twitterHashtag,
			twitterProfileName,
			twitterProfileNameForList,
			twitterListId,
			twitterProfileNameForCollection,
			twitterCollectionId,
			twitterHashtagFilter,
		}).ready();

		if (loading && !twit) {
			Meteor.call(methodNames.twitter.updateFeed, twitterValue, twitterGetType, element._id);
		}

		return {loading, feeds: twit && twit.feed.slice(0, twitsCount)};
	}
})(TwitterWidget);
