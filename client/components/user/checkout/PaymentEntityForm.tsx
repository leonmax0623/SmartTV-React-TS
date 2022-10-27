import React from 'react';
import {Box, TextField} from '@material-ui/core';

const PaymentEntityForm: React.FC = () => {
	const fields = [
		{
			id: 1,
			name: 'inn',
			title: 'ИНН',
			helperText: 'Введите ИНН',
		},
		{
			id: 2,
			name: 'companyName',
			title: 'Название компании',
		},
		{
			id: 3,
			name: 'kpp',
			title: 'КПП',
		},
		{
			id: 4,
			name: 'legalAddress',
			title: 'Юридический адрес',
		},
		{
			id: 5,
			name: 'bankName',
			title: 'Название банка',
		},
		{
			id: 6,
			name: 'bik',
			title: 'БИК',
		},
		{
			id: 7,
			name: 'corAccount',
			title: 'Кор. Счёт',
		},
		{
			id: 8,
			name: 'checkingAccount',
			title: 'Расчётный счёт',
		},
		{
			id: 9,
			name: 'phone',
			title: 'Телефон',
		},
	];

	return (
		<Box borderRadius={12} border={1} borderColor="grey.300" mb={5} p={3}>
			<Box fontSize={24} lineHeight={1.5} mb={1}>
				Реквизиты
			</Box>
			<Box color="rgba(0, 0, 0, 0.6)" mb={5} fontSize={12} lineHeight={1.3}>
				Введите ИНН вашей компании, остальные поля подгрузятся автоматически
			</Box>
			{fields.map((field, index) => {
				const isLast = fields.length - 1 === index;

				return (
					<Box
						key={field.id}
						display="flex"
						alignItems="center"
						pb={isLast ? 0 : 2}
						mb={isLast ? 0 : 2}
						borderBottom={isLast ? '' : '1px solid rgba(0, 0, 0, 0.12)'}
					>
						<Box
							mr={3}
							flexBasis="156px"
							color="rgba(0, 0, 0, 0.6)"
							fontSize={14}
							lineHeight={1.7}
							fontWeight={500}
							style={{textTransform: 'uppercase'}}
						>
							{field.title}
						</Box>
						<TextField fullWidth helperText={field.helperText} />
					</Box>
				);
			})}
		</Box>
	);
};

export default PaymentEntityForm;
