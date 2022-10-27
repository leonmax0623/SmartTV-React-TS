export interface IPayKeeperConfig {
	serverUrl: string;
	user: string;
	password: string;
}
export enum IPayKeeperInvoiceStatus {
	created = 'created',
	sent = 'sent',
	paid = 'paid',
	expired = 'expired',
}
export interface IPayKeeperInvoice {
	id: number; // Уникальный номер счёта. Строка из символов 0-9
	status: IPayKeeperInvoiceStatus; // Статус заказа. Строковые значения created, sent, paid, expired
	pay_amount: number; // Сумма счёта. Число, разделитель дробной части – точка
	clientid: string; // Идентификатор клиента. Строка, любые буквы и цифры
	orderid: string; // Номер заказа. Строка, любые буквы и цифры
	paymentid: string | null; // Номер платежа. Номер платежа, которым был оплачен счёт. Если счёт не оплачен — null
	service_name: string; // Наименование услуги. Строка, любые буквы и цифры
	client_email: string; // E-mail клиента. Строка, корректно записанный e-mail
	client_phone: string; // Телефон клиента. Строка, любые буквы и цифры
	expiry_datetime: string; // Счёт действует до. Дата в формате YYYY-MM-DD HH:MM:SS
	created_datetime: string; // Дата создания счёта. Дата в формате YYYY-MM-DD HH:MM:SS
	paid_datetime: string | null; // Дата оплаты счёта. Дата в формате YYYY-MM-DD HH:MM:SS. Если счёт не оплачен — null
}

export interface IPayKeeperInvoiceData {
	pay_amount: number; // Сумма заказа к оплате
	clientid?: string; // Идентификатор клиента
	orderid: string; // Номер заказа
	service_name: string; // Наименование услуги
	client_email?: string; // e-mail адрес клиента
	client_phone?: string; // Телефон клиента
	// Эти 2 параметра добавляются в методе создания инвойса
	// expiry: string; // Срок действия счёта в формате YYYY-MM-DD (не включительно)
	// token: string; // Токен безопасности. https://docs.paykeeper.ru/dokumentatsiya-json-api/token-bezopasnosti/
}

export interface IPayKeeperInvoiceCreateResult {
	invoice_id: string; // ID инвойса
	invoice_url: string; // Ссылка на оплату
	invoice: string; // HTML строка формы оплаты
}

export interface IPayKeeperPostHookData {
	id: string; // Уникальный номер платежа
	sum: number; // Сумма платежа
	clientid: string; // Фамилия Имя Отчество
	orderid: string; // Номер заказа
	key: string; // Цифровая подпись запроса, строка из символов a-f и 0-9
	service_name?: string; // Наименование услуги
	client_email?: string; // Адрес электронной почты
	client_phone?: string; // Телефон
	ps_id?: string; // Идентификатор платежной системы
	batch_date?: string; // Дата списания авторизованного платежа
	fop_receipt_key?: string; // Код страницы чека 54-ФЗ
	bank_id?: string; // Идентификатор привязки карты
	card_number?: string; // Маскированный номер карты
	card_holder?: string; // Держатель карты
	card_expiry?: string; // Срок действия карты
}
