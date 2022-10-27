import React, {ChangeEvent} from 'react';
import {Box, Checkbox, FormControlLabel} from '@material-ui/core';
import {IPaidServicePackagePaidServiceOfferFull} from 'shared/collections/PaidServices';

interface IPlanPackagesProps {
	packagesList: IPaidServicePackagePaidServiceOfferFull[];
	checkedPackagesIds: string[];
	onChange: (payload: string[]) => void;
	readonly: boolean;
}

const PlanPackages: React.FC<IPlanPackagesProps> = ({
	packagesList,
	checkedPackagesIds,
	onChange,
	readonly,
}) => {
	const isReadOnly = readonly;
	const onClickPackage = (event: ChangeEvent): void => {
		if (isReadOnly) return;
		const {checked, value} = event.target;
		const checkedItems = [...checkedPackagesIds];
		const foundItemPosition = checkedItems.indexOf(value);

		if (checked) {
			if (foundItemPosition === -1) {
				checkedItems.push(value);
			}
		} else if (foundItemPosition !== -1) {
			checkedItems.splice(foundItemPosition, 1);
		}

		onChange(checkedItems);
	};

	if (!packagesList || (packagesList && !packagesList.length)) return <Box mb={10} />;

	return (
		<Box
			borderRadius={12}
			p={3}
			mt={3}
			mb={5}
			boxShadow="0px 0.3px 0.5px rgba(0, 0, 0, 0.1), 0px 2px 4px rgba(0, 0, 0, 0.2)"
		>
			<Box fontSize={24} lineHeight={1.5} mb={2}>
				Платите только за то, чем пользуетесь.{' '}
			</Box>
			<Box fontSize={16} lineHeight={1.5} mb={3}>
				Выберите нужный функционал
			</Box>
			{packagesList.map((packageItem, index) => (
				<Box
					key={packageItem._id}
					pt={0.5}
					pr={2}
					pb={0.5}
					pl={2}
					mb={packagesList.length - 1 === index ? 0 : 1}
					borderRadius={10}
					boxShadow="0px 0.1px 0.3px rgba(0, 0, 0, 0.1), 0px 1px 2px rgba(0, 0, 0, 0.2)"
				>
					<FormControlLabel
						label={
							<Box display="flex" fontSize={14} lineHeight={1.7}>
								{packageItem.price ? (
									<>
										<Box
											color="#3F51B5"
											fontWeight={600}
											pl={1}
											ml={0.25}
											pr={2}
										>
											+{packageItem.price}
										</Box>
										<Box
											mr={2}
											borderRight={1}
											color="rgba(0, 0, 0, 0.12)"
										></Box>
									</>
								) : (
									''
								)}
								<Box>{packageItem.paidServicePackage?.title}</Box>
							</Box>
						}
						control={
							<Checkbox
								color="primary"
								value={packageItem._id}
								checked={
									checkedPackagesIds &&
									checkedPackagesIds.includes(packageItem._id)
								}
								onChange={onClickPackage}
								disabled={isReadOnly}
							/>
						}
						style={{width: '100%', marginBottom: 0}}
					/>
				</Box>
			))}
		</Box>
	);
};

export default PlanPackages;
