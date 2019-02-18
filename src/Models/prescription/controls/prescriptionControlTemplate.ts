import { IDoctorInformationTemplateControl } from "./doctorInformationTemplateControl";
import { IDropdownTemplateControl } from "./dropdownTemplateControl";
import { IMultilineTextControl } from "./multilineTextControlTemplate";
import { ITitleTemplateControl } from "./titleTemplateControl";

export type IPrescriptionControlTemplate = IDoctorInformationTemplateControl |
    ITitleTemplateControl |
    IDropdownTemplateControl |
    IMultilineTextControl;
