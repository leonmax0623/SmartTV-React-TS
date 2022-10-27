import {Meteor} from 'meteor/meteor';
import {check} from 'meteor/check';
import moment from 'moment';
import {methodNames} from 'shared/constants/methodNames';
import {Slide} from 'shared/collections/Slides';
import {SlideElement} from 'shared/collections/SlideElements';
import {IStatisticsResultItem, StatisticsSlideshows} from 'shared/collections/Statistics';
import {PaidServiceOrder, PaidServicePackagesEnum} from 'shared/collections/PaidServices';

const MIN_RENDER_TIME_SECS = 10;
const SECONDS_IN_MINUTE = 60;

const getSlideShowStat = (
	slideshowId: string,
	todayYear: number,
	todayDay: number,
	slideIds?: string[],
	slideElementIds?: string[],
): IStatisticsResultItem[] => {
	// Сегодня (кол./мин.)	Неделя (кол./мин.)	Месяц (кол./мин.)
	const weekAgo = moment().add(-1, 'week');
	const monthAgo = moment().add(-1, 'month');

	const monthAgoDay = monthAgo.dayOfYear();
	const monthAgoYear = monthAgo.toDate().getFullYear();

	const weekAgoDay = weekAgo.dayOfYear();
	const weekAgoYear = weekAgo.toDate().getFullYear();

	const totalSlides = Slide.find({
		slideshowId,
		...(slideIds && {_id: {$in: slideIds}}),
	}).count();

	return SlideElement.find({
		slideshowId,
		...(slideElementIds && {_id: {$in: slideElementIds}}),
	}).map((el) => {
		let count = 1;
		if (el.permanent && el.permanentAtAll) {
			count = totalSlides;
		}
		if (el.permanent && !el.permanentAtAll) {
			count = el.permanentOnSlides?.length;
		}

		// todo rewrite on aggregate
		const todayRenderCount = StatisticsSlideshows.find({
			elementId: el._id,
			year: todayYear,
			yearDay: todayDay,
		})
			.map((el) => el.renderCount || 0)
			.reduce((a, b) => a + b, 0);
		const todayRenderTime = StatisticsSlideshows.find({
			elementId: el._id,
			year: todayYear,
			yearDay: todayDay,
		})
			.map((el) => {
				if (el.renderTime) {
					return el.renderTime;
				} else if (el.year === todayYear) {
					const a = moment(el.lastRenderDate);
					if (el.yearDay === todayDay) {
						const b = moment(new Date());
						return b.diff(a, 'seconds');
					} else {
						const b = a.endOf('day');
						return b.diff(a, 'seconds');
					}
				} else {
					const a = moment(el.lastRenderDate);
					const b = a.endOf('day');
					return b.diff(a, 'seconds');
				}
			})
			.reduce((a, b) => a + b, 0);

		let query = {};
		if (weekAgoYear < todayYear) {
			query = {
				$or: [
					{year: {$gte: weekAgoYear, $lt: todayYear}, yearDay: {$gte: weekAgoDay}},
					{year: todayYear, yearDay: {$lte: todayDay}},
				],
			};
		} else {
			query = {year: todayYear, yearDay: {$gte: weekAgoDay, $lte: todayDay}};
		}
		const weekRenderCount = StatisticsSlideshows.find({elementId: el._id, ...query})
			.map((el) => el.renderCount || 0)
			.reduce((a, b) => a + b, 0);
		const weekRenderTime = StatisticsSlideshows.find({elementId: el._id, ...query})
			.map((el) => {
				if (el.renderTime) {
					return el.renderTime;
				} else if (el.year === todayYear) {
					const a = moment(el.lastRenderDate);
					if (el.yearDay === todayDay) {
						const b = moment(new Date());
						return b.diff(a, 'seconds');
					} else {
						const b = a.endOf('day');
						return b.diff(a, 'seconds');
					}
				} else {
					const a = moment(el.lastRenderDate);
					const b = a.endOf('day');
					return b.diff(a, 'seconds');
				}
			})
			.reduce((a, b) => a + b, 0);

		if (monthAgoYear < todayYear) {
			query = {
				$or: [
					{year: {$gte: monthAgoYear, $lt: todayYear}, yearDay: {$gte: monthAgoDay}},
					{year: todayYear, yearDay: {$lte: todayDay}},
				],
			};
		} else {
			query = {year: todayYear, yearDay: {$gte: monthAgoDay, $lte: todayDay}};
		}
		const monthRenderCount = StatisticsSlideshows.find({elementId: el._id, ...query})
			.map((el) => el.renderCount || 0)
			.reduce((a, b) => a + b, 0);
		const monthRenderTime = StatisticsSlideshows.find({elementId: el._id, ...query})
			.map((el) => {
				if (el.renderTime) {
					return el.renderTime;
				} else if (el.year === todayYear) {
					const a = moment(el.lastRenderDate);
					if (el.yearDay === todayDay) {
						const b = moment(new Date());
						return b.diff(a, 'seconds');
					} else {
						const b = a.endOf('day');
						return b.diff(a, 'seconds');
					}
				} else {
					const a = moment(el.lastRenderDate);
					const b = a.endOf('day');
					return b.diff(a, 'seconds');
				}
			})
			.reduce((a, b) => a + b, 0);
		const firstTimeShow = StatisticsSlideshows.findOne(
			{elementId: el._id},
			{sort: {year: 1, yearDay: 1}},
		);
		let daysPassed = 0;
		if (firstTimeShow) {
			const b = moment(new Date());
			const firstTimeShowDays = moment()
				.year(firstTimeShow.year)
				.dayOfYear(firstTimeShow.yearDay);
			daysPassed = b.diff(firstTimeShowDays, 'days');
		}

		return {
			daysPassed,
			type: el.type,
			slidesCount: count,
			id: el._id,
			statisticId: el.statisticId,
			today: [
				todayRenderCount,
				todayRenderTime ? Math.ceil(todayRenderTime / SECONDS_IN_MINUTE) : 0,
			],
			week: [
				weekRenderCount,
				weekRenderTime ? Math.ceil(weekRenderTime / SECONDS_IN_MINUTE) : 0,
			],
			month: [
				monthRenderCount,
				monthRenderTime ? Math.ceil(monthRenderTime / SECONDS_IN_MINUTE) : 0,
			],
		};
	});
};

Meteor.methods({
	[methodNames.statistics.mounted](elementId: string, sessionId: string) {
		// Можно и каждый рендер вставлять отдельной строчкой, но так как такие требования не предъявляются пишем все в одну строчку
		const date = new Date();
		const yearDay = moment().dayOfYear();
		const year = new Date().getFullYear();
		check(elementId, String);
		check(sessionId, String);
		this.unblock();
		//Можно собирать ещё месяц, но доступ закрыть. Чтобы, если человек забыл или не успел оплатить, статистика всё же была
		const monthAgo = moment().add(-1, 'month');
		const pso = PaidServiceOrder.findOne(
			{
				userId: this.userId,
				expiredAt: {$gte: monthAgo.toDate()},
			},
			{sort: {expiredAt: 1}},
		);
		const permissions: string[] = pso?.permissions || [];
		console.log('permissions', permissions);
		if (
			!(Array.isArray(permissions) ? permissions : []).includes(
				PaidServicePackagesEnum.STATISTICS,
			)
		) {
			return;
		}

		const element = SlideElement.findOne({_id: elementId});
		if (element && element.collectStat) {
			const existingStatisticsSlideshow = StatisticsSlideshows.findOne({
				elementId,
				sessionId,
				yearDay,
				year,
			});
			if (existingStatisticsSlideshow) {
				if (
					existingStatisticsSlideshow.lastRenderDate &&
					!existingStatisticsSlideshow.renderTime
				) {
					console.warn(
						'StatisticsSlideshows element have lastRenderDate and no renderTime but called mount operation',
					);
				}
				StatisticsSlideshows.update(
					{_id: existingStatisticsSlideshow._id},
					{
						$inc: {renderCount: 1},
						$set: {
							userId: this.userId || undefined,
							lastRenderDate: date,
						},
					},
				);
			} else {
				StatisticsSlideshows.insert({
					elementId,
					sessionId,
					yearDay,
					year,
					renderCount: 1,
					lastRenderDate: date,
					userId: this.userId || undefined,
				});
			}
		}
	},

	[methodNames.statistics.unmounted](elementId: string, sessionId: string): void {
		const date = new Date();
		const yearDay = moment().dayOfYear();
		const year = new Date().getFullYear();
		check(elementId, String);
		check(sessionId, String);
		this.unblock();
		//Можно собирать ещё месяц, но доступ закрыть. Чтобы, если человек забыл или не успел оплатить, статистика всё же была
		const monthAgo = moment().add(-1, 'month');
		const pso = PaidServiceOrder.findOne(
			{
				userId: this.userId,
				expiredAt: {$gte: monthAgo.toDate()},
			},
			{sort: {expiredAt: 1}},
		);
		const permissions: string[] = pso?.permissions || [];
		console.log('permissions', permissions);
		if (
			!(Array.isArray(permissions) ? permissions : []).includes(
				PaidServicePackagesEnum.STATISTICS,
			)
		) {
			return;
		}

		const element = SlideElement.findOne({_id: elementId});
		if (element && element.collectStat) {
			const existingStatisticsSlideshow = StatisticsSlideshows.findOne({
				elementId,
				sessionId,
				yearDay,
				year,
			});
			if (existingStatisticsSlideshow) {
				const a = moment(existingStatisticsSlideshow.lastRenderDate);
				const b = moment(date);
				const diffSeconds = b.diff(a, 'seconds');
				StatisticsSlideshows.update(
					{_id: existingStatisticsSlideshow._id},
					{
						$inc: {renderTime: diffSeconds},
						$set: {
							userId: this.userId || undefined,
						},
					},
				);
			} else {
				console.warn(
					'StatisticsSlideshows element called unmount operation but mount was not registered',
				);
				StatisticsSlideshows.insert({
					elementId,
					sessionId,
					yearDay,
					year,
					renderCount: 1,
					renderTime: MIN_RENDER_TIME_SECS,
					lastRenderDate: date,
					userId: this.userId || undefined,
				});
			}
		}
	},

	[methodNames.statistics.getSlideShows](sideShowIds: string[]): IStatisticsResultItem[][] {
		check(sideShowIds, [String]);
		this.unblock();
		const yearDay = moment().dayOfYear();
		const year = new Date().getFullYear();

		if (!this.userId) {
			throw new Error('Недостаточно прав');
		}
		return sideShowIds.map((sl) => getSlideShowStat(sl, year, yearDay));
	},

	[methodNames.statistics.getSlideShowsForElement](elementId: string): IStatisticsResultItem[][] {
		check(elementId, String);
		this.unblock();
		const yearDay = moment().dayOfYear();
		const year = new Date().getFullYear();

		if (!this.userId) {
			throw new Error('Недостаточно прав');
		}
		const slideElement = SlideElement.findOne({_id: elementId});
		if (slideElement) {
			const slideshowId = slideElement.slideshowId;
			const slideId = slideElement.slideId;
			// TODO ignore not needed elements and slides
			return [slideshowId].map((sl) =>
				getSlideShowStat(sl, year, yearDay, [slideId], [elementId]),
			);
		} else {
			return [];
		}
	},

	[methodNames.statistics.getSlideShowsForStatId](
		slideshowListByGroupIds: string[],
		statisticId: string,
	): IStatisticsResultItem[][] {
		check(statisticId, String);
		this.unblock();
		const yearDay = moment().dayOfYear();
		const year = new Date().getFullYear();

		if (!this.userId) {
			throw new Error('Недостаточно прав');
		}
		const slideElements = SlideElement.find({statisticId}, {fields: {slideshowId: 1}}).fetch();
		if (slideElements?.length) {
			const slideshowIds = slideElements?.map((se) => se.slideshowId);
			return slideshowIds.map((sl) => {
				const slideIds = Slide.find(
					{slideshowId: {$in: slideshowIds}},
					{fields: {_id: 1}},
				).map((s) => s._id);
				const elementIds = SlideElement.find({statisticId}, {fields: {_id: 1}}).map(
					(s) => s._id,
				);
				return getSlideShowStat(sl, year, yearDay, slideIds, elementIds);
			});
		} else {
			return [];
		}
	},
});
