import { IBaseFieldValidator } from './baseFieldValidator';
import { IFieldValidatorType } from './fieldValidatorType';

export interface IRequireFieldValidator extends IBaseFieldValidator {
    type: IFieldValidatorType;
}