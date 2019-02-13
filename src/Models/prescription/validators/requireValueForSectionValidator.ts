import { IBaseSectionValidator } from './baseSectionValidator';
import { ISectionValidatorType } from './sectionValidatorType';

export interface IRequireValueForSectionValidator extends IBaseSectionValidator {
    type: ISectionValidatorType.RequireValueForSectionValidator;
}