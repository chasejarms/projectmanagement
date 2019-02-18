import { ICheckboxTemplateControl } from './checkboxTemplateControl';
import { IDoctorInformationTemplateControl } from './doctorInformationTemplateControl';
import { IDropdownTemplateControl } from './dropdownTemplateControl';
import { IMultilineTextControl } from './multilineTextControlTemplate';
import { INumberTemplateControl } from './numberTemplateControl';
import { ISingleLineTextControlTemplate } from './singleLineTextControlTemplate';
import { ITitleTemplateControl } from './titleTemplateControl';

export type IPrescriptionControlTemplate = IDoctorInformationTemplateControl |
    ITitleTemplateControl |
    IDropdownTemplateControl |
    IMultilineTextControl |
    ISingleLineTextControlTemplate |
    ICheckboxTemplateControl |
    INumberTemplateControl;
