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
    IOnDropExistingControlPrescriptionFormTemplateAction,
    IOnDropExistingSectionPrescriptionFormTemplateAction,
    IOnDropNewControlPrescriptionFormTemplateAction,
    IPrescriptionBuilderActions,
    IRemoveControlPrescriptionFormTemplateAction,
    IRemoveSectionPrescriptionFormTemplateAction,
    ISetPrescriptionFormTemplateAction,
} from "../ActionCreators/prescriptionBuilderCreators";
import {
    ON_DROP_EXISTING_SECTION_PRESCRIPTION_FORM_TEMPLATE,
    ON_DROP_NEW_SECTION_PRESCRIPTION_FORM_TEMPLATE,
    REMOVE_CONTROL_PRESCRIPTION_FORM_TEMPLATE,
    REMOVE_SECTION_PRESCRIPTION_FORM_TEMPLATE,
    SET_EDIT_MODE,
    SET_PRESCRIPTION_FORM_TEMPLATE,
    SET_VIEW_MODE,
} from "../Actions/prescriptionBuilderActions";
import { ON_DROP_EXISTING_CONTROL_PRESCRIPTION_FORM_TEMPLATE, ON_DROP_NEW_CONTROL_PRESCRIPTION_FORM_TEMPLATE } from './../Actions/prescriptionBuilderActions';

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
        case ON_DROP_EXISTING_CONTROL_PRESCRIPTION_FORM_TEMPLATE:
            return prescriptionFormTemplateFormExistingControl(
                state,
                action as IOnDropExistingControlPrescriptionFormTemplateAction,
            );
        case REMOVE_CONTROL_PRESCRIPTION_FORM_TEMPLATE:
            return prescriptionFormTemplateAfterRemovingControl(
                state,
                action as IRemoveControlPrescriptionFormTemplateAction,
            );
        case REMOVE_SECTION_PRESCRIPTION_FORM_TEMPLATE:
            return prescriptionFormTemplateAfterRemovingSection(
                state,
                action as IRemoveSectionPrescriptionFormTemplateAction,
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

const prescriptionFormTemplateFormExistingControl = (state: IPrescriptionBuilderSliceOfState, action: IOnDropExistingControlPrescriptionFormTemplateAction): IPrescriptionBuilderSliceOfState => {
    const {
        item,
        targetSectionId,
        insertPosition,
    } = action;

    const controlId = item.id;
    const prescriptionFormTemplateCopy = cloneDeep(state.prescriptionFormTemplate);
    const currentSectionIdForControl = prescriptionFormTemplateCopy.controls[controlId].sectionId;

    const isSameSection = prescriptionFormTemplateCopy.sections[targetSectionId].controlOrder.some((compareControlId) => {
        return compareControlId === controlId;
    });

    const controlOrderOfCurrentSection = prescriptionFormTemplateCopy.sections[currentSectionIdForControl].controlOrder;

    if (isSameSection) {
        const currentIndexOfControl = prescriptionFormTemplateCopy.sections[targetSectionId].controlOrder.findIndex((compareControlId) => {
            return compareControlId === controlId;
        });

        // Insert the id at the new location

        const before = prescriptionFormTemplateCopy.sections[targetSectionId].controlOrder.slice(0, insertPosition);
        const after = prescriptionFormTemplateCopy.sections[targetSectionId].controlOrder.slice(insertPosition);
        const controlOrderAfterAddedId = before.concat([controlId]).concat(after);

        // Remove the id from the old location

        const indexOfIdToRemove = insertPosition < currentIndexOfControl ? currentIndexOfControl + 1 : currentIndexOfControl;

        const beforeItemToRemove = controlOrderAfterAddedId.slice(0, indexOfIdToRemove);
        const afterItemToRemove = controlOrderAfterAddedId.slice(indexOfIdToRemove + 1);

        const updatedControlOrder = beforeItemToRemove.concat(afterItemToRemove);

        prescriptionFormTemplateCopy.sections[targetSectionId].controlOrder= updatedControlOrder;

        return {
            ...state,
            prescriptionFormTemplate: prescriptionFormTemplateCopy,
        }
    } else {
        const updatedControlOrderForCurrentSection = controlOrderOfCurrentSection.filter((compareControlId) => {
            return compareControlId !== controlId;
        });
        prescriptionFormTemplateCopy.sections[currentSectionIdForControl].controlOrder = updatedControlOrderForCurrentSection;

        const controlOrderOfTargetSection = prescriptionFormTemplateCopy.sections[targetSectionId].controlOrder;

        const before = controlOrderOfTargetSection.slice(0, insertPosition);
        const after = controlOrderOfTargetSection.slice(insertPosition);
        const updatedControlOrder = before.concat([controlId]).concat(after);

        prescriptionFormTemplateCopy.sections[targetSectionId].controlOrder = updatedControlOrder;

        prescriptionFormTemplateCopy.controls[controlId].sectionId = targetSectionId;

        return {
            ...state,
            prescriptionFormTemplate: prescriptionFormTemplateCopy,
        }
    }
}

const prescriptionFormTemplateAfterRemovingControl = (state: IPrescriptionBuilderSliceOfState, action: IRemoveControlPrescriptionFormTemplateAction): IPrescriptionBuilderSliceOfState => {
    const prescriptionFormTemplateCopy = cloneDeep(state.prescriptionFormTemplate)
    const control = prescriptionFormTemplateCopy.controls[action.controlId];
    const sectionId = control.sectionId;
    const controlsWithoutSelectedSection = prescriptionFormTemplateCopy.sections[sectionId].controlOrder.filter((compareControlId) => {
        return compareControlId !== action.controlId;
    });

    prescriptionFormTemplateCopy.sections[sectionId].controlOrder = controlsWithoutSelectedSection;

    delete prescriptionFormTemplateCopy.controls[action.controlId];

    return {
        ...state,
        prescriptionFormTemplate: prescriptionFormTemplateCopy,
    }

    // may need to set the selected section and control to null
}

const prescriptionFormTemplateAfterRemovingSection = (state: IPrescriptionBuilderSliceOfState, action: IRemoveSectionPrescriptionFormTemplateAction): IPrescriptionBuilderSliceOfState => {
    const prescriptionFormTemplateCopy = cloneDeep(state.prescriptionFormTemplate);
    const sectionsWithoutSelectedSection = prescriptionFormTemplateCopy.sectionOrder.filter((compareSectionId) => {
        return compareSectionId !== action.sectionId;
    });

    const controlsToDelete = prescriptionFormTemplateCopy.sections[action.sectionId].controlOrder;
    controlsToDelete.forEach((controlIdToDelete) => {
        delete prescriptionFormTemplateCopy.controls[controlIdToDelete];
    });

    delete prescriptionFormTemplateCopy.sections[action.sectionId];
    prescriptionFormTemplateCopy.sectionOrder = sectionsWithoutSelectedSection;

    return {
        ...state,
        prescriptionFormTemplate: prescriptionFormTemplateCopy,
    }

    // may need to set the selected section and control to null
}