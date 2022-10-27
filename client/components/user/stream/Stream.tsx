import React, {useEffect, useState} from 'react';
import {Meteor} from 'meteor/meteor';
import {withTracker} from 'react-meteor-data-with-tracker';
import {Box, Container, IconButton, Button, Select, MenuItem, Snackbar} from '@material-ui/core';
import Input from 'client/components/common/ui/Input';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import InputLined from 'client/components/common/ui/InputLined';
import StreamScheduler from 'client/components/common/stream/StreamScheduler';
import {Formik, FormikActions} from 'formik';
import {methodNames} from 'shared/constants/methodNames';
import {ISlideStream, SlideStream} from 'shared/collections/SlideStream';
import {IResponseError} from 'shared/models/Response';
import {publishNames} from 'shared/constants/publishNames';
import ConfirmDialog from 'client/components/common/ui/ConfirmDialog';
import SlideStreamLoading from 'client/components/user/stream/SlideStreamLoading';
import copy from 'copy-to-clipboard';
import {Close} from '@material-ui/icons';
import MuiAlert from '@material-ui/lab/Alert';

import timeZoneSelectData from 'client/components/common/timeZone/timeZoneSelectData.ts';
import {
	getCurrentTimezone,
	setCurrentTimezone,
} from 'client/components/common/timeZone/currentTimezone';

interface IStreamProps {
	onBack: () => void;
	onCreate?: (addedSlideshowStreamId: string) => void;
	slideStream?: ISlideStream;
	loading: boolean;
}

const Stream: React.FC<IStreamProps> = ({slideStream, loading, onBack, onCreate}) => {
	const isEdit = slideStream && slideStream._id;
	const [error, setError] = useState('');
	interface ISnackMessageData {
		open: boolean;
		message: string;
		severity?: 'error' | 'success' | 'info' | 'warning' | undefined;
	}

	const [selectedTimeZone, setSelectedTimeZone] = useState(getCurrentTimezone());
	const onTimeZoneChange = (event: React.ChangeEvent) => {
		const value = event?.target?.value;

		setSelectedTimeZone(value);
		setCurrentTimezone(value);
	};

	const timeZoneSelect = timeZoneSelectData() || [];

	const snackMessageDefault = {
		open: false,
		message: '',
		severity: 'success',
	};
	const [snackMessage, setSnackMessage] = useState<ISnackMessageData>(snackMessageDefault);
	function openSnackMessage({message, open}: ISnackMessageData): void {
		setSnackMessage({...snackMessage, message, open});
	}
	function closeSnackMessage(event, reason: string): void {
		if (reason === 'clickaway') {
			return;
		}
		setSnackMessage(snackMessageDefault);
	}

	const onSubmitHandler = (
		{title, password}: ISlideStream,
		actions: FormikActions<{title: string; password: string}>,
	): void => {
		actions.setSubmitting(true);
		const methodName = isEdit ? methodNames.slideStream.update : methodNames.slideStream.create;
		Meteor.call(
			methodName,
			{
				title,
				password,
				_id: slideStream?._id,
			},
			(error: Error | Meteor.Error, response: IResponseError | string) => {
				actions.setSubmitting(false);
				if (error) {
					setError(error.message);
					return;
				}
				if (typeof response === 'string' && onCreate) {
					onCreate(response);
					return;
				}
				if (response?.error) {
					const err = response.error;
					if (err.message) {
						setError(err.message);
					}
					if (err.fields) {
						actions.setErrors(err.fields);
					}
				}
				if (isEdit && response.message) {
					openSnackMessage({
						open: true,
						message: response.message,
					});
				}
			},
		);
	};
	const formInitialValues = {
		title: slideStream?.title || '',
		password: slideStream?.password || '',
	};
	const [deleteDialogOpened, setDeleteDialogOpened] = useState(false);
	function onLinkCopy(link: string): void {
		if (!link) return;
		copy(link);
		openSnackMessage({
			open: true,
			message: 'Ссылка скопирована',
		});
	}

	function doDelete() {
		const _id = slideStream?._id;
		if (!_id) return;

		Meteor.call(
			methodNames.slideStream.remove,
			{_id},
			(error: Error | Meteor.Error, response: IResponseError | string) => {
				setDeleteDialogOpened(false);
				if (typeof onBack === 'function') {
					onBack();
				}
			},
		);
	}

	if (loading) {
		return (
			<Container style={{maxWidth: '896px'}}>
				{/*720px*/}
				<Box mt={10} mb={3} display="flex">
					<SlideStreamLoading />
				</Box>
			</Container>
		);
	}
	const itemUrl = `${`${window.location.origin}/stream` || 'https://prtv.su/stream'}/${
		slideStream?.code
	}`;

	return (
		<Container style={{maxWidth: '896px'}}>
			<Box mt={10} mb={3} display="flex">
				<Box color="rgba(0, 0, 0, 0.54)" flexGrow={0}>
					<IconButton onClick={onBack}>
						<ArrowBackIcon color="inherit" />
					</IconButton>
				</Box>
				<Box
					fontSize={34}
					lineHeight={1.4}
					textAlign="center"
					fontWeight={500}
					flexGrow={1}
					pr={7}
					pl={1}
				>
					{isEdit ? 'Редактировать поток' : 'Создать поток'}
				</Box>
			</Box>
			<Box borderRadius={12} border={1} borderColor="grey.300" mb={5} px={2} py={3}>
				{isEdit ? (
					<>
						<Box
							display="flex"
							alignItems="center"
							pb={2}
							mb={2}
							borderBottom={'1px solid rgba(0, 0, 0, 0.12)'}
						>
							<Box
								mr={3}
								flexBasis="156px"
								color="rgba(0, 0, 0, 0.6)"
								fontSize={14}
								lineHeight={1.7}
								fontWeight={500}
								style={{textTransform: 'uppercase'}}
								flexGrow={0}
							>
								URL потока
							</Box>
							<Box flexGrow={1} display="flex" alignItems="center">
								<Box flexGrow={1}>
									<Box display="inline-block">
										<a href={itemUrl} target="_blank">
											{itemUrl}
										</a>
									</Box>
								</Box>
								<Box flexGrow={0}>
									<IconButton onClick={() => onLinkCopy(itemUrl)}>
										<svg
											width="14"
											height="16"
											viewBox="0 0 14 16"
											fill="none"
											xmlns="http://www.w3.org/2000/svg"
										>
											<path
												fillRule="evenodd"
												clipRule="evenodd"
												d="M9.33341 0.666626H2.00008C1.26675 0.666626 0.666748 1.26663 0.666748 1.99996V10.6666C0.666748 11.0333 0.966748 11.3333 1.33341 11.3333C1.70008 11.3333 2.00008 11.0333 2.00008 10.6666V2.66663C2.00008 2.29996 2.30008 1.99996 2.66675 1.99996H9.33341C9.70008 1.99996 10.0001 1.69996 10.0001 1.33329C10.0001 0.966626 9.70008 0.666626 9.33341 0.666626ZM12.0001 3.33329H4.66675C3.93341 3.33329 3.33342 3.93329 3.33342 4.66663V14C3.33342 14.7333 3.93341 15.3333 4.66675 15.3333H12.0001C12.7334 15.3333 13.3334 14.7333 13.3334 14V4.66663C13.3334 3.93329 12.7334 3.33329 12.0001 3.33329ZM5.33341 14H11.3334C11.7001 14 12.0001 13.7 12.0001 13.3333V5.33329C12.0001 4.96663 11.7001 4.66663 11.3334 4.66663H5.33341C4.96675 4.66663 4.66675 4.96663 4.66675 5.33329V13.3333C4.66675 13.7 4.96675 14 5.33341 14Z"
												fill="#3F51B5"
												fillOpacity="0.38"
											/>
										</svg>
									</IconButton>
								</Box>
							</Box>
						</Box>
						<Box
							display="flex"
							alignItems="center"
							pb={2}
							mb={2}
							borderBottom={'1px solid rgba(0, 0, 0, 0.12)'}
						>
							<Box
								mr={3}
								flexBasis="156px"
								color="rgba(0, 0, 0, 0.6)"
								fontSize={14}
								lineHeight={1.7}
								fontWeight={500}
								style={{textTransform: 'uppercase'}}
								flexGrow={0}
							>
								Код потока
							</Box>
							<Box flexGrow={1}>{slideStream?.code}</Box>
						</Box>
					</>
				) : (
					''
				)}
				<Formik onSubmit={onSubmitHandler} initialValues={formInitialValues}>
					{({handleSubmit, isSubmitting, status, ...actions}) => (
						<form onSubmit={handleSubmit}>
							<Box
								display="flex"
								alignItems="center"
								pb={2}
								mb={2}
								borderBottom={'1px solid rgba(0, 0, 0, 0.12)'}
							>
								<Box
									mr={3}
									flexBasis="156px"
									color="rgba(0, 0, 0, 0.6)"
									fontSize={14}
									lineHeight={1.7}
									fontWeight={500}
									style={{textTransform: 'uppercase'}}
									flexGrow={0}
								>
									Название
								</Box>
								<Box flexGrow={1}>
									<Input name="title" label="" />
								</Box>
							</Box>
							<Box display="flex" alignItems="center" pb={2} mb={3}>
								<Box
									mr={3}
									flexBasis="156px"
									color="rgba(0, 0, 0, 0.6)"
									fontSize={14}
									lineHeight={1.7}
									fontWeight={500}
									style={{textTransform: 'uppercase'}}
									flexGrow={0}
								>
									Секретный код
								</Box>
								<Box flexGrow={1}>
									<Input
										name="password"
										label=""
										helperText="Без ввода секретного кода на экране устройства, показ потока недоступен"
									/>
								</Box>
							</Box>
							<Box textAlign="center">
								{isEdit ? (
									<Box display="inline-flex">
										<Box color="#3F51B5">
											<Button
												color="inherit"
												variant="outlined"
												type="submit"
											>
												Сохранить
											</Button>
										</Box>
										<Box color="red" ml={2}>
											<Button
												variant="outlined"
												color="inherit"
												onClick={() => setDeleteDialogOpened(true)}
											>
												Удалить
											</Button>
										</Box>
									</Box>
								) : (
									<Box color="#3F51B5">
										<Button color="inherit" variant="outlined" type="submit">
											Добавить
										</Button>
									</Box>
								)}
							</Box>
						</form>
					)}
				</Formik>
				{error ? (
					<Box pt={3} color="red">
						{error}
					</Box>
				) : (
					''
				)}
			</Box>
			{isEdit ? (
				<Box
					borderRadius={12}
					p={3}
					mt={3}
					mb={10}
					boxShadow="0px 0.3px 0.5px rgba(0, 0, 0, 0.1), 0px 2px 4px rgba(0, 0, 0, 0.2)"
				>
					<Box display="flex" pb={3}>
						<Box flexGrow={1}>
							<Box mb={1} fontSize={24} lineHeight={1.5}>
								График потока
							</Box>
							<Box fontSize={12} lineHeight={1.3} color="rgba(0, 0, 0, 0.6)">
								Настройте время показа ваших потоков слайдов
							</Box>
						</Box>
						<Box flexGrow={0}>
							<Button
								style={{fontSize: '14px'}}
								variant="outlined"
								color="primary"
								id="addSlideAppointment"
							>
								Добавить слайдшоу
							</Button>
						</Box>
					</Box>
					<Box
						display="flex"
						alignItems="center"
						pt={2}
						pb={2}
						mb={3}
						borderBottom={'1px solid rgba(0, 0, 0, 0.12)'}
					>
						<Box
							mr={3}
							flexBasis="156px"
							color="rgba(0, 0, 0, 0.6)"
							fontSize={14}
							lineHeight={1.7}
							fontWeight={500}
							style={{textTransform: 'uppercase'}}
							flexGrow={0}
						>
							Часовой пояс
						</Box>
						{timeZoneSelect && timeZoneSelect.length && (
							<Box flexGrow={1} flexBasis="auto">
								<Select
									variant="outlined"
									input={<InputLined />}
									value={selectedTimeZone}
									style={{
										width: '100%',
									}}
									MenuProps={{disableScrollLock: true}}
									onChange={onTimeZoneChange}
								>
									{timeZoneSelect.map((zone) => {
										return (
											<MenuItem value={zone.id} key={zone.id}>
												{zone.title}
											</MenuItem>
										);
									})}
								</Select>
							</Box>
						)}
					</Box>
					<Box>
						<StreamScheduler
							slideStream={slideStream}
							currentTimeZone={selectedTimeZone}
						/>
					</Box>
					<ConfirmDialog
						isOpen={deleteDialogOpened}
						title="Действительно хотите удалить поток?"
						onCancel={() => setDeleteDialogOpened(false)}
						onConfirm={doDelete}
					/>
				</Box>
			) : (
				''
			)}
			<Snackbar
				anchorOrigin={{
					vertical: 'top',
					horizontal: 'right',
				}}
				open={snackMessage.open}
				autoHideDuration={4000}
				onClose={closeSnackMessage}
			>
				<MuiAlert elevation={6} variant="filled" severity={snackMessage.severity}>
					<Box display="flex" alignItems="center">
						<Box>{snackMessage.message}</Box>
						<Box color="white" display="flex" ml={1}>
							<IconButton onClick={closeSnackMessage} color="inherit" size="small">
								<Close color="inherit" fontSize="small" />
							</IconButton>
						</Box>
					</Box>
				</MuiAlert>
			</Snackbar>
		</Container>
	);
};

export default withTracker<IStreamProps>((props) => {
	const {slideStreamId} = props;
	if (!slideStreamId) {
		return {
			...props,
			loading: false,
		};
	}

	const slideStreamsSubscriber = Meteor.subscribe(publishNames.slideStream.streams).ready();
	const loading = !slideStreamsSubscriber;
	const slideStream = SlideStream.findOne({_id: slideStreamId});

	if (!slideStream && typeof props.onBack === 'function' && !loading) {
		props.onBack();
	}

	return {
		...props,
		loading,
		slideStream,
	};
})(Stream);
