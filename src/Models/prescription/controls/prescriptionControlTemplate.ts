import { ICaseDeadlineControl } from './caseDeadlineControl';
import { ICheckboxTemplateControl } from './checkboxTemplateControl';
import { IDateTemplateControl } from './dateControlTemplate';
import { IDoctorInformationTemplateControl } from './doctorInformationTemplateControl';
import { IDropdownTemplateControl } from './dropdownTemplateControl';
import { IMultilineTextControl } from './multilineTextControlTemplate';
import { INonEditableTextField } from './nonEditableTextField';
import { INumberTemplateControl } from './numberTemplateControl';
import { ISingleLineTextControlTemplate } from './singleLineTextControlTemplate';
import { ITitleTemplateControl } from './titleTemplateControl';
import { IUnitSelectionControlTemplate } from './unitSelectionControlTemplate';

export type IPrescriptionControlTemplate = IDoctorInformationTemplateControl |
    ITitleTemplateControl |
    IDropdownTemplateControl |
    IMultilineTextControl |
    ISingleLineTextControlTemplate |
    ICheckboxTemplateControl |
    INumberTemplateControl |
    INonEditableTextField |
    IUnitSelectionControlTemplate |
    IDateTemplateControl |
    ICaseDeadlineControl;
