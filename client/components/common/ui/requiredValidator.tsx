import {required} from 'redux-form-validators';

export const requiredInput = () => required({msg: 'Обязательное поле'});
