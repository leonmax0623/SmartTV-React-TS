import React, {useEffect, useState} from 'react';
import {withTracker} from 'react-meteor-data-with-tracker';
import {PaidServicePackage, IPaidServicePackage} from 'shared/collections/PaidServices';
import {publishNames} from 'shared/constants/publishNames';
import {Meteor} from 'meteor/meteor';
import {
	Box,
	Button,
	Typography,
	Table,
	TableRow,
	TableCell,
	TableHead,
	TableBody,
	Paper,
	IconButton,
} from '@material-ui/core';
import PackageDialog from 'client/components/admin/services/packages/PackageDialog';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import {methodNames} from 'shared/constants/methodNames';
import {IResponseError, IResponseSuccess} from 'shared/models/Response';

interface IServicePackagesListData {
	loading: boolean;
	packages: IPaidServicePackage[];
}

const ServicePackagesList: React.FC<IServicePackagesListData> = ({packages, loading}) => {
	const hasPackages = packages?.length > 0;

	const [packageDialogOpened, setPackageDialogOpened] = useState(false);
	const [selectedPackageId, setSelectedPackageId] = useState('');
	const onOpenPackageDialog = (packageId: string = '') => {
		setPackageDialogOpened(true);
		if (packageId) {
			setSelectedPackageId(packageId);
		}
	};
	const onClosePackageDialog = () => {
		setPackageDialogOpened(false);
		setSelectedPackageId('');
	};
	const getSelectedPackage = (): IPaidServicePackage | undefined => {
		if (!selectedPackageId || !hasPackages) return;

		return packages.find((item) => item && item._id === selectedPackageId);
	};

	return (
		<Box>
			<Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
				<Box mr={3}>
					<Typography className="pageTitle" variant="h5">
						Пакеты
					</Typography>
				</Box>
			</Box>

			<Paper>
				{hasPackages ? (
					<Table size="small">
						<TableHead>
							<TableRow style={{fontWeight: 700}}>
								<TableCell>Название</TableCell>
								<TableCell></TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{packages.map((item) => {
								return (
									<TableRow key={item._id}>
										<TableCell>{item.title}</TableCell>
										<TableCell>
											<IconButton
												onClick={() => onOpenPackageDialog(item._id)}
											>
												<EditIcon />
											</IconButton>
										</TableCell>
									</TableRow>
								);
							})}
						</TableBody>
					</Table>
				) : (
					<Box textAlign="center" p={3}>
						<Box fontSize={14} lineHeight={1.5} mb={1}>
							Нет пакетов
						</Box>
					</Box>
				)}
			</Paper>

			<PackageDialog
				paidServicePackage={getSelectedPackage()}
				isOpen={packageDialogOpened}
				onClose={onClosePackageDialog}
			/>
		</Box>
	);
};

export default withTracker(() => {
	const packagesSubscriber = Meteor.subscribe(publishNames.paidServices.packages);
	const loading = !packagesSubscriber;
	const packages = PaidServicePackage.find({}).fetch();

	return {
		loading,
		packages,
	};
})(ServicePackagesList);
