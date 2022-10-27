import React, {useState} from 'react';
import {IPaidService, IPaidServiceOfferWithPackages} from 'shared/collections/PaidServices';
import {Box, FormControl, InputLabel, MenuItem, Select} from '@material-ui/core';
import ButtonCustom from 'client/components/common/ui/ButtonCustom';
import {IPlanListModel, IPlanPrices} from 'client/components/user/plan/PlansList';

interface IPlanItemProps {
	service: IPaidService;
	offersWithPackages: IPaidServiceOfferWithPackages[];
	onChangePlan: (payload: object) => void;
	onPay: () => void;
	formData: IPlanListModel;
	prices: IPlanPrices;
	readonly: boolean;
}

const PlanItemPremium: React.FC<IPlanItemProps> = ({
	service,
	offersWithPackages,
	onChangePlan,
	onPay,
	formData,
	prices,
	readonly,
}) => {
	const isReadOnly = readonly;
	function onChangeOffer(e: any) {
		if (!onChangePlan || isReadOnly) return;

		onChangePlan({
			serviceId: service._id,
			offerId: e.target.value,
		});
	}
	function handlePay() {
		if (onPay && !isReadOnly) {
			onPay();
		}
	}

	return (
		<Box border={3} borderColor="#3F51B5" borderRadius={12} height="100%" p={3}>
			<Box display="flex">
				<Box flexGrow={1}>
					<Box fontSize={24} lineHeight={1.5} mb={1}>
						{service.title}
					</Box>
					<Box fontSize={12} lineHeight={1.3} color="rgba(0, 0, 0, 0.6)" mb={2}>
						{service.description}
					</Box>
					{offersWithPackages && offersWithPackages.length ? (
						<FormControl variant="outlined" style={{width: '100%'}}>
							<InputLabel id="offer-select-label">Выберите срок</InputLabel>
							<Select
								label="Выберите срок"
								labelId="offer-select-label"
								name="offer"
								value={formData.offerId}
								onChange={onChangeOffer}
								style={{
									height: 56,
								}}
								MenuProps={{disableScrollLock: true}}
								disabled={isReadOnly}
							>
								{offersWithPackages.map((item) => {
									return (
										<MenuItem value={item._id} key={item._id}>
											{item.title}
										</MenuItem>
									);
								})}
							</Select>
						</FormControl>
					) : (
						''
					)}
				</Box>
				<Box flexShrink={0} display="flex">
					<Box
						ml={2}
						display="flex"
						flexDirection="column"
						alignItems="center"
						justifyContent="space-between"
					>
						{prices.priceDiscountMonthly ? (
							<ButtonCustom
								size="medium"
								onClick={handlePay}
								style={isReadOnly ? {pointerEvents: 'none'} : {}}
							>
								{prices.priceDiscountMonthly} ₽ в месяц
							</ButtonCustom>
						) : (
							''
						)}
						<Box flexGrow={0} textAlign="center" mb={1.5}>
							{prices.discount > 0 ? (
								<Box
									fontSize={12}
									lineHeight={1.3}
									color="rgba(0, 0, 0, 0.6)"
									mb={0.5}
								>
									Экономия {prices.discount}%
								</Box>
							) : (
								''
							)}
							{prices.priceDiscount > 0 ? (
								<Box
									color="#3F51B5"
									fontWeight={600}
									fontSize={14}
									lineHeight={1.4}
								>
									Итого {prices.priceDiscount} ₽
								</Box>
							) : (
								''
							)}
						</Box>
					</Box>
				</Box>
			</Box>
		</Box>
	);
};

export default PlanItemPremium;
