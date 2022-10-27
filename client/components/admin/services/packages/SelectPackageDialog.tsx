import React, {useState} from 'react';
import {Meteor} from 'meteor/meteor';
import {withTracker} from 'react-meteor-data-with-tracker';
import {IPaidServicePackage, PaidServicePackage} from 'shared/collections/PaidServices';
import {publishNames} from 'shared/constants/publishNames';

import Modal from 'client/components/common/ui/Modal';
import {
	Button,
	DialogActions,
	DialogContent,
	List,
	ListItem,
	ListItemText,
	Box,
} from '@material-ui/core';

interface ISelectPackageDialogData {
	loading: boolean;
	packageList: IPaidServicePackage[];
}
interface ISelectPackageDialogProps {
	isOpen: boolean;
	onClose: () => void;
	onSelect: (item: IPaidServicePackage) => void;
}

const SelectPackageDialog: React.FC<ISelectPackageDialogProps & ISelectPackageDialogData> = ({
	packageList,
	isOpen,
	onClose,
	onSelect,
}) => {
	const handleClose = (): void => {
		if (onClose) onClose();
		setSelectedItemIds([]);
	};
	const [selectedItemIds, setSelectedItemIds] = useState<string[]>([]);
	const onClickItem = (item: IPaidServicePackage): void => {
		if (!item || !onSelect) return;
		onSelect(item);
		handleClose();
	};

	return (
		<Modal title={'Выбор пакетов'} onClose={handleClose} isOpen={isOpen}>
			<DialogContent>
				<List component="nav" aria-label="secondary mailbox folders">
					{!packageList || (packageList && !packageList.length) ? (
						<Box color="red">Пакеты не найдены. Сначала добавьте их</Box>
					) : (
						''
					)}
					{packageList && packageList.length
						? packageList.map((item) => (
								<ListItem
									key={item._id}
									button
									onClick={() => onClickItem(item)}
									selected={selectedItemIds.includes(item._id)}
								>
									<ListItemText primary={item.title} />
								</ListItem>
						  ))
						: ''}
				</List>
			</DialogContent>
			<DialogActions>
				<Button variant="contained" color="primary" onClick={handleClose}>
					Отмена
				</Button>
			</DialogActions>
		</Modal>
	);
};

export default withTracker(({isOpen, onSelect}: ISelectPackageDialogProps) => {
	const packagesSubscriber = Meteor.subscribe(publishNames.paidServices.packages);
	const loading = !packagesSubscriber;
	const packageList = PaidServicePackage.find({}).fetch();

	return {
		isOpen,
		onSelect,
		loading,
		packageList,
	};
})(SelectPackageDialog);
