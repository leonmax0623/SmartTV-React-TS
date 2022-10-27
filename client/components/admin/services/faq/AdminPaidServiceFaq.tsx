import {Meteor} from 'meteor/meteor';
import React, {useState} from 'react';
import {withTracker} from 'react-meteor-data-with-tracker';
import {publishNames} from 'shared/constants/publishNames';
import {
	AppBar,
	Box,
	Button,
	IconButton,
	Paper,
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableRow,
} from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import {Faq, FaqKeysEnum, IFaq, IFaqItem} from 'shared/collections/Faq';
import ContentLoader from 'react-content-loader';
import FaqDialog from 'client/components/admin/faq/FaqDialog';
import FaqItemDialog from 'client/components/admin/faq/FaqItemDialog';
import {methodNames} from 'shared/constants/methodNames';

interface IAdminPaidServiceFaqPageData {
	loading: boolean;
	faq: IFaq;
}
interface IItemDialogData {
	isOpened: false;
	data: IFaqItem | undefined;
}

const AdminPaidServiceFaq: React.FC<IAdminPaidServiceFaqPageData> = ({faq, loading}) => {
	if (loading) {
		return (
			<ContentLoader viewBox="0 0 720 650" height={1000} width="100%">
				<rect x="0" y="0" rx="12" ry="12" width="100%" height="60" />
				<rect x="0" y="62" rx="12" ry="12" width="100%" height="60" />
				<rect x="0" y="124" rx="12" ry="12" width="100%" height="60" />
				<rect x="0" y="186" rx="12" ry="12" width="100%" height="60" />
			</ContentLoader>
		);
	}

	if (!faq) {
		return <></>;
	}

	const [mainDialogOpened, setMainDialogOpened] = useState(false);
	const [itemDialogData, setItemDialogData] = useState<IItemDialogData>({
		isOpened: false,
		data: undefined,
	});

	const onOpenItemDialog = (faqItem?: IFaqItem) => {
		setItemDialogData({
			isOpened: true,
			data: faqItem,
		});
	};
	const onCloseItemDialog = () => {
		setItemDialogData({
			isOpened: false,
			data: undefined,
		});
	};
	const onDeleteItem = (itemId: string) => {
		if (!confirm('Удалить вопрос?')) return;
		Meteor.call(methodNames.faq.removeItem, {itemId, key: faq.key});
	};

	return (
		<Box mb={2}>
			<AppBar position="static" color="default">
				<Box display="flex" justifyContent="space-between" alignItems="center">
					<Box p={1.5} fontSize={15} fontWeight={700}>
						{faq.title}
					</Box>
					<Box>
						<IconButton
							onClick={() => {
								setMainDialogOpened(true);
							}}
						>
							<EditIcon />
						</IconButton>
					</Box>
				</Box>
			</AppBar>
			{faq.items?.length ? (
				<Paper>
					<Box display="flex" justifyContent="flex-end" pt={1} pb={1} pr={1}>
						<Button
							variant="outlined"
							color="primary"
							size="large"
							onClick={() => onOpenItemDialog()}
						>
							Добавить элемент
						</Button>
					</Box>
					<Table size="small">
						<TableHead>
							<TableRow style={{fontWeight: 700}}>
								<TableCell>Заголовок</TableCell>
								<TableCell></TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{faq.items.map((faqItem) => {
								return (
									<TableRow>
										<TableCell>{faqItem.title}</TableCell>
										<TableCell>
											<IconButton onClick={() => onOpenItemDialog(faqItem)}>
												<EditIcon />
											</IconButton>
											<IconButton onClick={() => onDeleteItem(faqItem.id)}>
												<DeleteIcon />
											</IconButton>
										</TableCell>
									</TableRow>
								);
							})}
						</TableBody>
					</Table>
				</Paper>
			) : (
				<Paper>
					<Box textAlign="center" p={3}>
						<Box fontSize={14} lineHeight={1.5} mb={1}>
							Нет данных для показа
						</Box>

						<Button
							variant="outlined"
							color="primary"
							size="large"
							onClick={() => onOpenItemDialog()}
						>
							Добавить элемент
						</Button>
					</Box>
				</Paper>
			)}
			<FaqDialog
				isOpen={mainDialogOpened}
				onClose={() => setMainDialogOpened(false)}
				faq={faq}
			/>
			<FaqItemDialog
				isOpen={itemDialogData.isOpened}
				onClose={onCloseItemDialog}
				faqItem={itemDialogData.data}
				parentKey={faq.key}
			/>
		</Box>
	);
};

export default withTracker(() => {
	const faqSubscriber = Meteor.subscribe(publishNames.faq.list).ready();
	const faq = Faq.findOne({key: FaqKeysEnum.PAID_SERVICES});
	const loading = !faqSubscriber;

	return {
		loading,
		faq,
	};
})(AdminPaidServiceFaq);
