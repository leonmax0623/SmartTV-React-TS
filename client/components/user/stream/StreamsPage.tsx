import React, {useState} from 'react';
import {Meteor} from 'meteor/meteor';
import {publishNames} from 'shared/constants/publishNames';
import {withTracker} from 'react-meteor-data-with-tracker';
import {
	Box,
	Container,
	Table,
	TableHead,
	TableRow,
	TableCell,
	TableBody,
	IconButton,
	Button,
} from '@material-ui/core';
import {Edit as EditIcon, Delete as DeleteIcon} from '@material-ui/icons';
import ButtonCustom from 'client/components/common/ui/ButtonCustom';
import {makeStyles} from '@material-ui/core/styles';
import {Redirect, useHistory} from 'react-router-dom';
import routerUrls from 'client/constants/routerUrls';
import {ButtonProps} from '@material-ui/core/Button';
import {ISlideStream, SlideStream} from 'shared/collections/SlideStream';
import {methodNames} from 'shared/constants/methodNames';
import {IResponseError, IResponseSuccess} from 'shared/models/Response';
import ContentLoader from 'react-content-loader';
import ConfirmDialog from 'client/components/common/ui/ConfirmDialog';
import PlusIcon from 'client/components/common/icons/PlusIcon';
import TableContainerRoundedShadow from 'client/components/common/ui/table/TableContainerRoundedShadow';
import GrayTableRow from 'client/components/common/ui/table/GrayTableRow';
import copy from 'copy-to-clipboard';
import {PaidServiceOrder, PaidServicePackagesEnum} from 'shared/collections/PaidServices';

interface IStreamsPageProps {
	loading: boolean;
	slideStreams: ISlideStream[];
	permissions: PaidServicePackagesEnum[];
}

const AddButton: React.FC<ButtonProps> = (props = {}) => (
	<ButtonCustom {...props}>
		<Box display="flex" alignItems="center">
			<Box mr={1.5}>
				<PlusIcon
					style={{width: '11px', height: '11px'}}
					viewBox="0 0 10 10"
					fill="none"
					pathProps={{fill: 'white'}}
				/>
			</Box>
			<Box style={{textTransform: 'uppercase'}}>Добавить поток</Box>
		</Box>
	</ButtonCustom>
);

const useHeadCellStyles = makeStyles({
	head: {
		fontWeight: 600,
		fontSize: '14px',
		lineHeight: 1.42,
	},
});

const StreamsPage: React.FC<IStreamsPageProps> = ({slideStreams, loading, permissions}) => {
	const history = useHistory();
	const headCellStyles = useHeadCellStyles();
	const [error, setError] = useState<string>('');
	const [tableLoading, setTableLoading] = useState<boolean>(false);
	const [deleteData, setDeleteData] = useState({
		isOpened: false,
		slideStreamId: '',
	});

	function onAddClick(): void {
		history.push(routerUrls.userStreamsAdd);
	}
	function onEditItem(slideStreamId: string): void {
		if (!slideStreamId) return;
		history.push({
			pathname: routerUrls.userStreamsEdit.replace(':id', slideStreamId),
			state: {
				id: slideStreamId,
			},
		});
	}
	function onDeleteDialogClose(): void {
		setDeleteData({
			slideStreamId: '',
			isOpened: false,
		});
	}
	function onDeleteItem(slideStreamId: string): void {
		setDeleteData({
			slideStreamId,
			isOpened: true,
		});
	}
	function onDeleteConfirm() {
		deleteItem();
	}

	function deleteItem(): void {
		const {slideStreamId} = deleteData;
		if (!slideStreamId) return;
		setTableLoading(true);
		Meteor.call(
			methodNames.slideStream.remove,
			{_id: slideStreamId},
			(error: Error | Meteor.Error, response: IResponseError | IResponseSuccess) => {
				onDeleteDialogClose();
				setTableLoading(false);
				if (error) {
					setError(error.message);
					return;
				}
				if (response?.error) {
					const err = response.error;
					if (err.message) {
						setError(err.message);
					}
				}
			},
		);
	}

	const onUrlCopyToClipboard = (link: string) => {
		if (!link) return;
		copy(link);
	};

	if (loading) {
		return (
			<Container style={{maxWidth: '1440px'}}>
				<Box mt={1.5}>
					<ContentLoader viewBox="0 0 720 650" height={700} width="100%">
						<rect x="0" y="0" rx="5" ry="5" width="74%" height="36" />
						<rect x="78%" y="0" rx="5" ry="5" width="22%" height="36" />
						<rect x="0" y="56" rx="5" ry="5" width="100%" height="52" />
						<rect x="0" y="110" rx="5" ry="5" width="100%" height="72" />
						<rect x="0" y="184" rx="5" ry="5" width="100%" height="72" />
						<rect x="0" y="258" rx="5" ry="5" width="100%" height="72" />
						<rect x="0" y="332" rx="5" ry="5" width="100%" height="72" />
						<rect x="0" y="406" rx="5" ry="5" width="100%" height="72" />
						<rect x="0" y="480" rx="5" ry="5" width="100%" height="72" />
						<rect x="0" y="554" rx="5" ry="5" width="100%" height="72" />
						<rect x="0" y="628" rx="5" ry="5" width="100%" height="72" />
					</ContentLoader>
				</Box>
			</Container>
		);
	}

	if (
		!(Array.isArray(permissions) ? permissions : []).includes(
			PaidServicePackagesEnum.SLIDESHOW_STREAM,
		)
	) {
		return <Redirect to={routerUrls.userPlan} />;
	}

	return (
		<Container style={{maxWidth: '1440px'}}>
			{slideStreams.length ? (
				<Box>
					<Box display="flex" mt={2} mb={2.5}>
						<Box fontSize={20} lineHeight={1.4} flexGrow={1} fontWeight={600}>
							Потоки
						</Box>
						<Box flexGrow={0}>
							<AddButton onClick={onAddClick} />
						</Box>
					</Box>
					<TableContainerRoundedShadow
						style={tableLoading ? {opacity: 0.6, pointerEvents: 'none'} : {}}
					>
						<Table>
							<TableHead>
								<GrayTableRow>
									<TableCell classes={headCellStyles}>№</TableCell>
									<TableCell classes={headCellStyles}>Название</TableCell>
									<TableCell classes={headCellStyles}>Номер для ТВ</TableCell>
									<TableCell></TableCell>
								</GrayTableRow>
							</TableHead>
							<TableBody>
								{slideStreams.map((slideStream) => {
									const itemUrl = `${`${window.location.origin}/stream` ||
										'https://prtv.su/stream'}/${slideStream.code}`;
									return (
										<TableRow key={slideStream._id}>
											<TableCell>{slideStream.code}</TableCell>
											<TableCell>{slideStream.title}</TableCell>
											<TableCell>
												<Box display="flex" alignItems="center">
													<Box mr={1.5}>
														<a href={itemUrl} target="_blank">
															{itemUrl}
														</a>
													</Box>
													<IconButton
														onClick={() =>
															onUrlCopyToClipboard(itemUrl)
														}
													>
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
											</TableCell>
											<TableCell>
												<Box display="flex" justifyContent="flex-end">
													<Button
														variant="outlined"
														color="primary"
														onClick={() => onEditItem(slideStream._id)}
													>
														<Box
															component="span"
															display="flex"
															alignItems="center"
														>
															<Box
																component="span"
																mr={1}
																display="flex"
																alignItems="center"
															>
																<EditIcon style={{fontSize: 16}} />
															</Box>
															<Box
																component="span"
																style={{textTransform: 'uppercase'}}
																fontWeight={600}
															>
																Изменить
															</Box>
														</Box>
													</Button>
													<Box color="rgba(176, 0, 32, 0.24)" ml={2}>
														<Button
															style={{
																minWidth: 0,
																paddingLeft: '6px',
																paddingRight: '6px',
															}}
															variant="outlined"
															color="inherit"
															onClick={() =>
																onDeleteItem(slideStream._id)
															}
														>
															<Box
																component="span"
																display="flex"
																color="rgb(176, 0, 32)"
															>
																<DeleteIcon />
															</Box>
														</Button>
													</Box>
												</Box>
											</TableCell>
										</TableRow>
									);
								})}
							</TableBody>
						</Table>
					</TableContainerRoundedShadow>
				</Box>
			) : (
				<Box
					display="flex"
					flexDirection="column"
					justifyContent="center"
					alignItems="center"
					pt={16}
					pb={16}
				>
					<Box
						mb={3}
						color="rgba(0, 0, 0, 0.6)"
						fontSize={20}
						lineHeight={1.4}
						fontWeight={600}
					>
						Создайте свой первый поток
					</Box>
					<AddButton onClick={onAddClick} />
				</Box>
			)}
			<ConfirmDialog
				isOpen={deleteData.isOpened}
				title="Действительно хотите удалить поток?"
				onCancel={onDeleteDialogClose}
				onConfirm={onDeleteConfirm}
			/>
		</Container>
	);
};

export default withTracker(() => {
	const streamsSubscriber = Meteor.subscribe(publishNames.slideStream.streams).ready();
	const slideStreams = SlideStream.find({}, {sort: {}}).fetch();
	const psoSubscriber = Meteor.subscribe(publishNames.paidServices.orders).ready();
	const loading = !streamsSubscriber || !psoSubscriber;
	const pso = PaidServiceOrder.findOne();
	const permissions: string[] = pso?.permissions || [];

	return {
		loading,
		slideStreams,
		permissions,
	};
})(StreamsPage);
