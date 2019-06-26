import { ICaseDeadlineControl } from './caseDeadlineControl';
import { ICheckboxTemplateControl } from './checkboxTemplateControl';
import { IDateTemplateControl } from './dateControlTemplate';
import { IDoctorInformationTemplateControl } from './doctorInformationTemplateControl';
import { IDropdownTemplateControl } from './dropdownTemplateControl';
import { IFileControl } from './fileControl';
import { IMultilineTextControl } from './multilineTextControlTemplate';
import { INonEditableTextField } from './nonEditableTextField';
import { INumberTemplateControl } from './numberTemplateControl';
import { IPatientNameControl } from './patientNameControl';
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
    ICaseDeadlineControl |
    IFileControl |
    IPatientNameControl;
