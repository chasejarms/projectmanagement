import { IFieldValidatorType } from "./fieldValidatorType";

export interface IBaseFieldValidator {
    type: IFieldValidatorType;
    value: any;
}