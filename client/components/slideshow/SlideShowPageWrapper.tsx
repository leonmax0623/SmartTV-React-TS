import React, {useEffect, useMemo, useState} from 'react';
import {withTracker} from 'react-meteor-data-with-tracker';
import {ISlideStream, SlideStream} from 'shared/collections/SlideStream';
import {buildVirtualDates} from 'client/components/common/stream/helpers/buildVirtualDates';
import {currentTasks} from 'client/components/common/stream/helpers/todayTasks';
import {sortTasksByDurationAsc} from 'client/components/common/stream/helpers/sortTasksByDurationAsc';
import {publishNames} from 'shared/constants/publishNames';
import SlideshowPage from 'client/components/slideshow/SlideshowPage';
import {Button, Grid, TextField, Typography} from '@material-ui/core';
import css from 'client/components/slideshow/SlideshowPage.pcss';
import {MeasuredComponentProps, withContentRect} from 'react-measure';

interface ISlideShowPageWrapperProps {
	isStream: boolean;
	numId: string;
	loading: boolean;
	currentStream?: ISlideStream;
}

const AccessWrapper: React.FC<ISlideShowPageWrapperProps & MeasuredComponentProps> = (props) => {
	const {currentStream, loading, contentRect, isStream} = props;
	if (!isStream) {
		return <SlideShowPageWrapper {...props} />;
	}

	const query = useMemo(() => new URLSearchParams(location.search), []);

	if (loading || !contentRect.bounds) {
		return <div>Загрузка...</div>;
	}

	if (!currentStream) {
		return <>Поток не найден</>;
	}

	if (!currentStream.schedules?.length) {
		return <div>В потоке нет слайдов. Добавьте хотя бы 1 слайд в поток.</div>;
	}

	if (currentStream.password && currentStream.password !== query.get('password')) {
		return (
			<form>
				<Grid
					container
					className={css.accessWrapper}
					alignItems="center"
					justify="center"
					alignContent="center"
					spacing={4}
				>
					<Grid item component={Typography} variant="h5">
						Доступ ограничен паролем
					</Grid>

					<Grid item container spacing={4} justify="center">
						<Grid item>
							<TextField
								name="password"
								placeholder="Введите пароль"
								label="Пароль"
								variant="outlined"
								size={'small'}
							/>
						</Grid>

						<Grid item>
							<Button variant="outlined" color="primary" size="large" type="submit">
								Открыть
							</Button>
						</Grid>
					</Grid>
				</Grid>
			</form>
		);
	}

	return <SlideShowPageWrapper {...props} />;
};

const SlideShowPageWrapper: React.FC<ISlideShowPageWrapperProps> = ({
	isStream,
	numId,
	currentStream,
	loading,
}) => {
	if (!isStream) {
		return <SlideshowPage slideNumId={numId} />;
	}

	if (loading) {
		return <div>Загрузка...</div>;
	}

	let updateTimer: any = 0;

	const getCurrentTaskId = (stream: ISlideStream | undefined) => {
		if (!stream) return '';
		const allDate = buildVirtualDates(stream?.schedules || []);
		const currentTasksList = sortTasksByDurationAsc(currentTasks(allDate));
		const currentTask = currentTasksList?.[0];
		if (!currentTask) return;
		return currentTask.slideshowNumId || '';
	};
	const [currentSlideId, setCurrentSlideId] = useState(getCurrentTaskId(currentStream));

	useEffect(() => {
		updateTimer = setInterval(() => {
			const newId = getCurrentTaskId(currentStream);
			if (newId !== currentSlideId) {
				setCurrentSlideId(newId);
			}
		}, 30000);

		return () => {
			clearInterval(updateTimer);
		};
	}, []);

	if (!currentSlideId) {
		return <div>В потоке нет слайдов на данный момент.</div>;
	}

	return <SlideshowPage slideNumId={currentSlideId} />;
};

export default withTracker(() => {
	const isStream = window.location.pathname.startsWith('/stream');
	let numId = '';
	if (isStream) {
		numId = window.location.pathname.substring(1).split('/')[1];
	} else {
		numId = window.location.pathname.substring(1);
	}
	let streamSubscriber = true;
	let currentStream: ISlideStream | undefined;
	if (isStream) {
		streamSubscriber = Meteor.subscribe(publishNames.slideStream.streamById, numId).ready();
		currentStream = SlideStream.findOne({code: numId});
	}

	return {
		isStream,
		numId,
		currentStream,
		loading: !streamSubscriber,
	};
})(withContentRect('bounds')(AccessWrapper));
