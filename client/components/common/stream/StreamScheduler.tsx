import React, {useEffect, useState} from 'react';
import {Meteor} from 'meteor/meteor';

import {
	ViewState,
	EditingState,
	IntegratedEditing,
	ChangeSet,
	AppointmentModel,
} from '@devexpress/dx-react-scheduler';
import {
	Scheduler,
	WeekView,
	Toolbar,
	TodayButton,
	Appointments,
	AppointmentTooltip,
	CurrentTimeIndicator,
	DateNavigator,
} from '@devexpress/dx-react-scheduler-material-ui';
import {AppointmentForm} from 'client/components/common/stream/AppointmentForm/AppointmentForm';
import {Box} from '@material-ui/core';
import messages from './messages-ru';
import {methodNames} from 'shared/constants/methodNames';
import {ISlideStream} from 'shared/collections/SlideStream';
import {isObject} from 'lodash';
import moment from 'moment-timezone';

interface IStreamScheduler {
	slideStream: ISlideStream | undefined;
	currentTimeZone: string;
}

const Appointment = ({onClick, onDoubleClick, isShaded, ...restProps}) => {
	const style = isShaded
		? {
				backgroundColor: '#8A91B7',
		  }
		: {
				backgroundColor: '#3F51B5',
		  };
	return <Appointments.Appointment onClick={onDoubleClick} {...restProps} style={style} />;
};

const dateConvertFormat = 'YYYY/MM/DD HH:mm:ss';

const StreamScheduler: React.FC<IStreamScheduler> = ({slideStream, currentTimeZone}) => {
	if (!slideStream) {
		return <></>;
	}

	const nowWithTimeZone = new Date(
		moment()
			.tz(currentTimeZone)
			.format(dateConvertFormat),
	);
	const appointments = (slideStream?.schedules || []).map((appointment) => {
		return {
			...(appointment || {}),
			startDate: new Date(
				moment(appointment.startDate)
					.tz(currentTimeZone)
					.format(dateConvertFormat),
			),
			endDate: new Date(
				moment(appointment.endDate)
					.tz(currentTimeZone)
					.format(dateConvertFormat),
			),
		};
	});
	const [appointmentFormVisible, setAppointmentFormVisible] = useState(false);
	const [addedAppointment, setAddedAppointment] = useState({});
	const [appointmentChanges, setAppointmentChanges] = useState({});
	const [editingAppointment, setEditingAppointment] = useState({});
	const changeAddedAppointment = (data: object) => {
		setAddedAppointment(data);
	};
	const changeAppointmentChanges = (data: object) => {
		setAppointmentChanges(data);
	};
	const changeEditingAppointment = (data: object | undefined) => {
		setEditingAppointment(data);
	};
	const addItem = (newData: ChangeSet['added']) => {
		const data = newData || {};
		const slideStreamId = slideStream._id;
		if (!slideStreamId) return;

		Meteor.call(methodNames.slideStream.createSchedule, {
			slideStreamId,
			slideshowNumId: data.slideshowNumId,
			startDate: data.startDate,
			endDate: data.endDate,
			rRule: data.rRule,
		});
	};
	const changeItem = (data: ChangeSet['changed']) => {
		const slideStreamId = slideStream._id;
		if (!slideStreamId) return;
		if (!isObject(data)) return;
		const ids = Object.keys(data);
		const id = ids?.[0];
		const currentData = data[id] || {};

		if (currentData.exDate) {
			deleteItem(id);
			return;
		}
		if (!id) return;
		const payload = {
			...currentData,
			id,
			slideStreamId,
		};
		Meteor.call(methodNames.slideStream.updateSchedule, payload);
	};
	const deleteItem = (data: ChangeSet['deleted']) => {
		const slideStreamId = slideStream._id;
		if (!slideStreamId) return;
		Meteor.call(methodNames.slideStream.removeSchedule, {
			slideStreamId,
			id: data,
		});
	};
	const isItemExists = (itemId: string) => {
		if (!itemId) return false;
		return Boolean(appointments.find(({id}) => id === itemId));
	};
	const onCommitChanges = (data: ChangeSet): void => {
		if (data.changed && data.added) {
			const changedKey = Object.keys(data.changed)[0];
			if (changedKey && isItemExists(changedKey)) {
				const result = {};
				result[changedKey] = data.added;
				changeItem(result);
			} else {
				addItem(data.added);
			}

			return;
		}
		if (data.changed) {
			/**
			 * Изменение элемента.
			 * Иногда, при добавлении нового элемента,
			 * в data приходит changed с ключом undefined
			 * или вообще ключ, которого не существует в
			 * нашей коллекции, поэтому проверяем и если
			 * нет такого элемента, то добавим его
			 */
			const changedKey = Object.keys(data.changed)[0];
			const isChanged = changedKey && changedKey !== 'undefined';
			const isChangedExists = isChanged && isItemExists(changedKey);
			if (isChanged && isChangedExists) {
				changeItem(data.changed);
				return;
			}
			const changedData = {
				...addedAppointment,
				...appointmentChanges,
				...(editingAppointment || {}),
			};
			addItem(changedData);
		} else if (data.added) {
			addItem(data.added);
		} else if (data.deleted !== undefined) {
			deleteItem(data.deleted);
		}
	};

	const isFormDataValid = (data: AppointmentModel) => {
		const dateStartStamp = data?.startDate?.getTime();
		const dateEndStamp = data?.endDate?.getTime();

		return Boolean(
			data.slideshowNumId &&
				dateStartStamp &&
				dateEndStamp &&
				!(dateStartStamp >= dateEndStamp),
		);
	};

	const CommandButon = React.useCallback(
		(props) => {
			const {id} = props;
			if (id !== 'saveButton') {
				return <AppointmentForm.CommandButton {...props} />;
			}

			const nextData = {...addedAppointment, ...editingAppointment, ...appointmentChanges};
			const isValid = isFormDataValid(nextData);
			return <AppointmentForm.CommandButton {...{...props, disabled: !isValid}} />;
		},
		[addedAppointment, appointmentChanges, editingAppointment],
	);

	const onAddClick = () => {
		setAppointmentFormVisible(true);
		changeEditingAppointment(undefined);
		const startDate = new Date();
		const endDate = moment()
			.add(30, 'minutes')
			.toDate();
		changeAddedAppointment({
			startDate,
			endDate,
			slideshowNumId: null,
		});
	};

	const onAppointmentFormVisibilityChange = () => {
		setAppointmentFormVisible(!appointmentFormVisible);
	};
	useEffect(() => {
		const addButton = document.querySelector('#addSlideAppointment');
		if (!addButton) return;
		addButton.addEventListener('click', onAddClick);

		return () => {
			addButton.removeEventListener('click', onAddClick);
		};
	}, []);

	return (
		<Box border="1px solid rgba(0, 0, 0, 0.12)" borderRadius="12px" overflow="hidden">
			<Scheduler height={582} data={appointments} locale="ru-RU" firstDayOfWeek={1}>
				<ViewState defaultCurrentDate={nowWithTimeZone} />
				<EditingState
					onCommitChanges={onCommitChanges}
					addedAppointment={addedAppointment}
					onAddedAppointmentChange={changeAddedAppointment}
					appointmentChanges={appointmentChanges}
					onAppointmentChangesChange={changeAppointmentChanges}
					editingAppointment={editingAppointment}
					onEditingAppointmentChange={changeEditingAppointment}
				/>
				<IntegratedEditing />
				<WeekView />
				<Toolbar />
				<DateNavigator />
				<TodayButton messages={messages.todayButton} />
				<Appointments appointmentComponent={Appointment} />
				<AppointmentTooltip showOpenButton showDeleteButton />
				<AppointmentForm
					messages={messages.appointmentForm}
					visible={appointmentFormVisible}
					commandButtonComponent={CommandButon}
					onVisibilityChange={onAppointmentFormVisibilityChange}
				/>
				<CurrentTimeIndicator updateInterval={10000} shadePreviousAppointments={true} />
			</Scheduler>
		</Box>
	);
};

export default StreamScheduler;
