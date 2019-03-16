import { cloneDeep } from 'lodash';
import { ICheckboxTemplateControl } from 'src/Models/prescription/controls/checkboxTemplateControl';
import { IDateTemplateControl } from 'src/Models/prescription/controls/dateControlTemplate';
import { IDoctorInformationTemplateControl } from 'src/Models/prescription/controls/doctorInformationTemplateControl';
import { IDropdownTemplateControl } from 'src/Models/prescription/controls/dropdownTemplateControl';
import { IMultilineTextControl } from 'src/Models/prescription/controls/multilineTextControlTemplate';
import { INonEditableTextField } from 'src/Models/prescription/controls/nonEditableTextField';
import { INumberTemplateControl } from 'src/Models/prescription/controls/numberTemplateControl';
import { IOption } from 'src/Models/prescription/controls/option';
import { IPrescriptionControlTemplate } from 'src/Models/prescription/controls/prescriptionControlTemplate';
import { IPrescriptionControlTemplateType } from 'src/Models/prescription/controls/prescriptionControlTemplateType';
import { ISingleLineTextControlTemplate } from 'src/Models/prescription/controls/singleLineTextControlTemplate';
import { ITitleTemplateControl } from 'src/Models/prescription/controls/titleTemplateControl';
import { IUnitSelectionControlTemplate } from 'src/Models/prescription/controls/unitSelectionControlTemplate';
import { IPrescriptionFormTemplate } from 'src/Models/prescription/prescriptionFormTemplate';
import { IPrescriptionSectionTemplate } from 'src/Models/prescription/sections/prescriptionSectionTemplate';
import { IPrescriptionSectionTemplateType } from 'src/Models/prescription/sections/prescriptionSectionTemplateType';
import { generateUniqueId } from 'src/Utils/generateUniqueId';
import {
    IAddNewSectionPrescriptionFormTemplateAction,
    IOnDropExistingSectionPrescriptionFormTemplateAction,
    IOnDropNewControlPrescriptionFormTemplateAction,
    IPrescriptionBuilderActions,
    ISetPrescriptionFormTemplateAction,
} from "../ActionCreators/prescriptionBuilderCreators";
import {
    ON_DROP_EXISTING_SECTION_PRESCRIPTION_FORM_TEMPLATE,
    ON_DROP_NEW_SECTION_PRESCRIPTION_FORM_TEMPLATE,
    SET_EDIT_MODE,
    SET_PRESCRIPTION_FORM_TEMPLATE,
    SET_VIEW_MODE,
} from "../Actions/prescriptionBuilderActions";
import { ON_DROP_NEW_CONTROL_PRESCRIPTION_FORM_TEMPLATE } from './../Actions/prescriptionBuilderActions';

export interface IPrescriptionBuilderSliceOfState {
    editMode: boolean;
    prescriptionFormTemplate: IPrescriptionFormTemplate;
}

const initialState = {
    editMode: true,
    prescriptionFormTemplate: {
        sectionOrder: [],
        sections: {},
        controls: {},
    },
}

export const prescriptionBuilderReducer = (state: IPrescriptionBuilderSliceOfState = initialState, action: IPrescriptionBuilderActions) => {
    switch (action.type) {
        case SET_VIEW_MODE:
            return {
                ...state,
                editMode: false,
            }
        case SET_EDIT_MODE:
            return {
                ...state,
                editMode: true,
            }
        case SET_PRESCRIPTION_FORM_TEMPLATE:
            const {
                prescriptionFormTemplate,
            } = action as ISetPrescriptionFormTemplateAction;
            return {
                ...state,
                prescriptionFormTemplate,
            }
        case ON_DROP_NEW_SECTION_PRESCRIPTION_FORM_TEMPLATE:
            return prescriptionFormTemplateFromNewSection(
                state,
                action as IAddNewSectionPrescriptionFormTemplateAction
            )
        case ON_DROP_EXISTING_SECTION_PRESCRIPTION_FORM_TEMPLATE:
            return prescriptionFromTemplateFromExistingSection(
                state,
                action as IOnDropExistingSectionPrescriptionFormTemplateAction,
            );
        case ON_DROP_NEW_CONTROL_PRESCRIPTION_FORM_TEMPLATE:
            return prescriptionFormTemplateFromNewControl(
                state,
                action as IOnDropNewControlPrescriptionFormTemplateAction,
            );
        default:
            return state;
    }
}

const prescriptionFormTemplateFromNewSection = (state: IPrescriptionBuilderSliceOfState, action: IAddNewSectionPrescriptionFormTemplateAction): IPrescriptionBuilderSliceOfState => {
    const {
        item,
        insertPosition,
    } = action as IAddNewSectionPrescriptionFormTemplateAction;

    const sectionType = item.type;
    const id = generateUniqueId();
    let newSection: IPrescriptionSectionTemplate;

    if (sectionType === IPrescriptionSectionTemplateType.Regular) {
        newSection = {
            id,
            type: IPrescriptionSectionTemplateType.Regular,
            controlOrder: [],
        }
    } else if (sectionType === IPrescriptionSectionTemplateType.Advanced) {
        newSection = {
            id,
            type: IPrescriptionSectionTemplateType.Advanced,
            controlOrder: [],
        }
    } else if (sectionType === IPrescriptionSectionTemplateType.Duplicatable) {
        newSection = {
            id,
            type: IPrescriptionSectionTemplateType.Duplicatable,
            controlOrder: [],
        }
    }

    const prescriptionFormTemplateCopy = cloneDeep(state.prescriptionFormTemplate);

    const before = prescriptionFormTemplateCopy.sectionOrder.slice(0, insertPosition);
    const after = prescriptionFormTemplateCopy.sectionOrder.slice(insertPosition);
    const sectionOrder = before.concat([id]).concat(after);

    prescriptionFormTemplateCopy.sections[id] = newSection!;
    prescriptionFormTemplateCopy.sectionOrder = sectionOrder;

    return {
        ...state,
        prescriptionFormTemplate: prescriptionFormTemplateCopy,
    }
}

const prescriptionFromTemplateFromExistingSection = (state: IPrescriptionBuilderSliceOfState, action: IOnDropExistingSectionPrescriptionFormTemplateAction): IPrescriptionBuilderSliceOfState => {
    const {
        item,
        insertPosition,
    } = action as IOnDropExistingSectionPrescriptionFormTemplateAction;

    const sectionId = item.id;
    const prescriptionFormTemplateCopy = cloneDeep(state.prescriptionFormTemplate);

    const currentIndexOfSection = prescriptionFormTemplateCopy.sectionOrder.findIndex((compareSectionId) => {
        return compareSectionId === sectionId;
    });

    // Insert the id at the new location

    const before = prescriptionFormTemplateCopy.sectionOrder.slice(0, insertPosition);
    const after = prescriptionFormTemplateCopy.sectionOrder.slice(insertPosition);
    const sectionOrderWithAddedId = before.concat([sectionId]).concat(after);

    // Remove the id from the old location

    const indexOfIdToRemove = insertPosition < currentIndexOfSection ? currentIndexOfSection + 1 : currentIndexOfSection;

    const beforeItemToRemove = sectionOrderWithAddedId.slice(0, indexOfIdToRemove);
    const afterItemToRemove = sectionOrderWithAddedId.slice(indexOfIdToRemove + 1);

    const updatedSectionOrder = beforeItemToRemove.concat(afterItemToRemove);

    prescriptionFormTemplateCopy.sectionOrder = updatedSectionOrder;

    return {
        ...state,
        prescriptionFormTemplate: prescriptionFormTemplateCopy,
    }
}

const prescriptionFormTemplateFromNewControl = (state: IPrescriptionBuilderSliceOfState, action: IOnDropNewControlPrescriptionFormTemplateAction): IPrescriptionBuilderSliceOfState => {
    // tslint:disable-next-line:no-console
    console.log('action: ', action);
    const {
        item,
        sectionId,
        insertPosition,
    } = action;

    const type = item.type;
    const id = generateUniqueId();
    const prescriptionFormTemplateCopy = cloneDeep(state.prescriptionFormTemplate);

    let control: IPrescriptionControlTemplate;

    if (type === IPrescriptionControlTemplateType.Title) {

        const titleControl: ITitleTemplateControl = {
            id,
            type: IPrescriptionControlTemplateType.Title,
            title: 'New Title',
            sectionId,
        }
        control = titleControl;
    } else if (type === IPrescriptionControlTemplateType.Dropdown) {
        const options: IOption[] = [];
        for (let i = 0; i < 3; i++) {
            const uniqueOptionId = generateUniqueId();
            options.push({
                id: uniqueOptionId,
                text: `Option Text`,
            })
        }
        const dropdownControl: IDropdownTemplateControl = {
            id,
            label: 'Dropdown Label',
            type: IPrescriptionControlTemplateType.Dropdown,
            options,
            sectionId,
        }

        control = dropdownControl;
    } else if (type === IPrescriptionControlTemplateType.DoctorInformation) {
        const doctorControl: IDoctorInformationTemplateControl = {
            id,
            type: IPrescriptionControlTemplateType.DoctorInformation,
            sectionId,
        }

        control = doctorControl;
    } else if (type === IPrescriptionControlTemplateType.MultilineText) {
        const multilineTextControl: IMultilineTextControl = {
            id,
            type: IPrescriptionControlTemplateType.MultilineText,
            sectionId,
            label: 'Notepad Label',
        }

        control = multilineTextControl;
    } else if (type === IPrescriptionControlTemplateType.SingleLineText) {
        const singleLineText: ISingleLineTextControlTemplate = {
            id,
            type: IPrescriptionControlTemplateType.SingleLineText,
            sectionId,
            label: 'Single Line Text Label',
        }

        control = singleLineText;
    } else if (type === IPrescriptionControlTemplateType.Checkbox) {
        const options: IOption[] = [];
        for (let i = 0; i < 3; i++) {
            const uniqueOptionId = generateUniqueId();
            options.push({
                id: uniqueOptionId,
                text: `Option Text`,
            })
        }
        const checkboxControl: ICheckboxTemplateControl = {
            id,
            type: IPrescriptionControlTemplateType.Checkbox,
            options,
            sectionId,
        }

        control = checkboxControl;
    } else if (type === IPrescriptionControlTemplateType.Number) {
        const numberControl: INumberTemplateControl = {
            id,
            type: IPrescriptionControlTemplateType.Number,
            sectionId,
            label: 'Number Field Label',
            prefix: '',
            suffix: '',
        }

        control = numberControl;
    } else if (type === IPrescriptionControlTemplateType.NonEditableText) {
        const nonEditableTextControl: INonEditableTextField = {
            id,
            sectionId,
            text: 'Replace this text by clicking on this field',
            type: IPrescriptionControlTemplateType.NonEditableText,
        }

        control = nonEditableTextControl;
    } else if (type === IPrescriptionControlTemplateType.UnitSelection) {
        const unitSelectionControl: IUnitSelectionControlTemplate = {
            id,
            sectionId,
            type: IPrescriptionControlTemplateType.UnitSelection,
            units: [],
        }

        control = unitSelectionControl;
    } else if (type === IPrescriptionControlTemplateType.Date) {
        const dateControl: IDateTemplateControl = {
            id,
            sectionId,
            type: IPrescriptionControlTemplateType.Date,
            label: 'Date Control Label',
        }

        control = dateControl;
    }

    prescriptionFormTemplateCopy.controls[id] = control!;
    const currentControlOrder = prescriptionFormTemplateCopy.sections[sectionId].controlOrder;

    const before = currentControlOrder.slice(0, insertPosition);
    const after = currentControlOrder.slice(insertPosition);
    const updatedControlOrder = before.concat([id]).concat(after);

    prescriptionFormTemplateCopy.sections[sectionId].controlOrder = updatedControlOrder;

    return {
        ...state,
        prescriptionFormTemplate: prescriptionFormTemplateCopy,
    }
}