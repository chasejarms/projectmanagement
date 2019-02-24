import {
    Button,
    Checkbox,
    Drawer,
    FormControl,
    FormControlLabel,
    Input,
    InputAdornment,
    InputLabel,
    ListItemText,
    MenuItem,
    Paper,
    Select,
    TextField,
    Typography,
    withTheme,
} from '@material-ui/core';
import { cloneDeep } from 'lodash';
import { DateFormatInput } from 'material-ui-next-pickers';
import * as React from 'react';
import { DraggableFormElement } from 'src/Components/DraggableFormElement/DraggableFormElement';
import { FormElementDropZone } from 'src/Components/FormElementDropZone/FormElementDropZone';
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
import { IPrescriptionSectionTemplate } from 'src/Models/prescription/prescriptionSectionTemplate';
import { generateUniqueId } from 'src/Utils/generateUniqueId';
import {
    createPrescriptionBuilderClasses,
    IPrescriptionBuilderProps,
    IPrescriptionBuilderState,
} from './PrescriptionBuilder.ias';

export class PrescriptionBuilderPresentation extends React.Component<
    IPrescriptionBuilderProps,
    IPrescriptionBuilderState
> {
    public state: IPrescriptionBuilderState = {
        prescriptionFormTemplate: {
            sectionOrder: [],
            controlOrder: {},
            sections: {},
            controls: {},
        },
        selectedSection: null,
        selectedControl: null,
        editMode: true,
        controlValues: {},
    }

    public render() {
        const {
            drawerPaper,
            prescriptionBuilderContainer,
            prescriptionFormContainer,
            drawerReplacement,
            sectionsContainer,
            sectionContainer,
            noControlForSectionClass,
            duplicateSectionButtonContainer,
            controlContainer,
            controlsContainer,
            // editModeButtonContainer,
            draggableIconsContainer,
            drawerInnerContainer,
            topDrawerContainer,
        } = createPrescriptionBuilderClasses(this.props, this.state);

        const {
            prescriptionFormTemplate,
        } = this.state;

        const {
            sections,
            sectionOrder,
            controlOrder,
        } = prescriptionFormTemplate;

        return (
            <div className={prescriptionBuilderContainer}>
                <Drawer
                    open={true}
                    variant="persistent"
                    anchor="right"
                    classes={{
                        paper: drawerPaper,
                    }}
                >
                    <div className={drawerInnerContainer}>
                        <div className={topDrawerContainer}>
                            <Typography variant="title">Form Elements</Typography>
                            <Typography variant="caption">Drag an element to the left to get started</Typography>
                        </div>
                        <div className={draggableIconsContainer}>
                            <DraggableFormElement type={null}/>
                            <DraggableFormElement type={IPrescriptionControlTemplateType.Checkbox}/>
                            <DraggableFormElement type={IPrescriptionControlTemplateType.Date}/>
                            <DraggableFormElement type={IPrescriptionControlTemplateType.NonEditableText}/>
                            <DraggableFormElement type={IPrescriptionControlTemplateType.DoctorInformation}/>
                            <DraggableFormElement type={IPrescriptionControlTemplateType.Dropdown}/>
                            <DraggableFormElement type={IPrescriptionControlTemplateType.MultilineText}/>
                            <DraggableFormElement type={IPrescriptionControlTemplateType.Number}/>
                            <DraggableFormElement type={IPrescriptionControlTemplateType.SingleLineText}/>
                            <DraggableFormElement type={IPrescriptionControlTemplateType.Title}/>
                            <DraggableFormElement type={IPrescriptionControlTemplateType.UnitSelection}/>
                        </div>
                    </div>
                </Drawer>
                <Paper className={prescriptionFormContainer}>
                    {sectionOrder.length === 0 ? (
                        <div>
                            <FormElementDropZone
                                heightInPixels={100}
                                showBorderWithNoDragInProgress={true}
                                text={'Drag the section form element into this box to get started.'}
                                onDrop={this.onDropSection(0)}
                            />
                        </div>
                    ) : (
                        <div>
                            {/* <div className={editModeButtonContainer}>
                                <Button onClick={this.toggleEditMode} color="secondary">{this.state.editMode ? 'Switch To View Mode' : 'Switch To Edit Mode'}</Button>
                            </div> */}
                            <div className={sectionsContainer}>
                            {sectionOrder.map((sectionId, sectionIndex) => {
                                const currentSection = sections[sectionId];
                                const controlOrderForSection = controlOrder[sectionId];
                                const noControlForSection = controlOrderForSection.length === 0;

                                return (
                                    <div key={sectionId}>
                                        {sectionIndex === 0 ? (
                                            <FormElementDropZone
                                                heightInPixels={32}
                                                onDrop={this.onDropSection(sectionIndex)}
                                            />
                                        ) : undefined}
                                        <div
                                            className={`${sectionContainer} ${noControlForSection ? noControlForSectionClass : ''}`}
                                            onClick={this.selectSection(sectionId)}
                                        >
                                            {noControlForSection ? (
                                                <FormElementDropZone
                                                    heightInPixels={80}
                                                    showBorderWithNoDragInProgress={true}
                                                    text={'Drag any non-section form elements into this box to add a field.'}
                                                    onDrop={this.onDropControl(sectionId, 0)}
                                                />
                                            ) : (
                                                <div className={controlsContainer}>
                                                    {controlOrderForSection.map((controlId, controlIndex) => {
                                                        return (
                                                            <div
                                                                key={controlId}
                                                                className={controlContainer}
                                                                // onClick={this.selectControl(controlId)}
                                                            >
                                                                {controlIndex === 0 ? (
                                                                    <FormElementDropZone
                                                                        heightInPixels={16}
                                                                        onDrop={this.onDropControl(sectionId, controlIndex)}
                                                                    />
                                                                ) : undefined}
                                                                {this.correctControlDisplay(controlId)}
                                                                <FormElementDropZone
                                                                    heightInPixels={16}
                                                                    onDrop={this.onDropControl(sectionId, controlIndex + 1)}
                                                                />
                                                            </div>
                                                        )
                                                    })}
                                                </div>
                                            )}
                                        </div>
                                        {currentSection.canDuplicate && currentSection.duplicateButtonText ? (
                                            <div className={duplicateSectionButtonContainer}>
                                                <Button color="secondary">{currentSection.duplicateButtonText}</Button>
                                            </div>
                                        ) : undefined}
                                        <FormElementDropZone
                                            heightInPixels={32}
                                            onDrop={this.onDropSection(sectionIndex + 1)}
                                        />
                                    </div>
                                )
                            })}
                        </div>
                        </div>
                    )}
                </Paper>
                <div className={drawerReplacement}/>
            </div>
        )
    }

    private onDropSection = (insertPosition: number) => (item: any) => {
        const id = generateUniqueId();
        const newSection: IPrescriptionSectionTemplate = {
            id,
            validators: [],
            canDuplicate: false,
            duplicateButtonText: null,
        }

        const prescriptionFormTemplateCopy = cloneDeep(this.state.prescriptionFormTemplate);

        const before = prescriptionFormTemplateCopy.sectionOrder.slice(0, insertPosition);
        const after = prescriptionFormTemplateCopy.sectionOrder.slice(insertPosition);
        const sectionOrder = before.concat([id]).concat(after);

        prescriptionFormTemplateCopy.sections[id] = newSection;
        prescriptionFormTemplateCopy.sectionOrder = sectionOrder;
        prescriptionFormTemplateCopy.controlOrder[newSection.id] = [];

        this.setState({
            prescriptionFormTemplate: prescriptionFormTemplateCopy,
        })
    }

    private onDropControl = (sectionId: string, insertPosition: number) => (item: any) => {
        const type = item.type;
        const id = generateUniqueId();
        const prescriptionFormTemplateCopy = cloneDeep(this.state.prescriptionFormTemplate);

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
        const currentControlOrder = prescriptionFormTemplateCopy.controlOrder[sectionId];

        const before = currentControlOrder.slice(0, insertPosition);
        const after = currentControlOrder.slice(insertPosition);
        const updatedControlOrder = before.concat([id]).concat(after);

        prescriptionFormTemplateCopy.controlOrder[sectionId] = updatedControlOrder;

        this.setState({
            prescriptionFormTemplate: prescriptionFormTemplateCopy,
        })
    }

    private handleControlValueChange = (controlId: string) => (event: any) => {
        const value = event.target.value;
        const controlValuesCopy = cloneDeep(this.state.controlValues);

        controlValuesCopy[controlId] = value;

        this.setState({
            controlValues: controlValuesCopy,
        })
    }

    // private toggleEditMode = () => {
    //     this.setState({
    //         editMode: !this.state.editMode,
    //     })
    // }

    private selectSection = (sectionId: string) => () => {
        this.setState({
            selectedSection: sectionId,
            selectedControl: null,
        })
    }

    // private addSectionBeforeSelected = () => {
    //     const index = this.indexOfSelectedSection();
    //     this.addSection(index)();
    // }

    // private addSectionAfterSelected = () => {
    //     const index = this.indexOfSelectedSection();
    //     this.addSection(index + 1)();
    // }

    // private indexOfSelectedSection = (): number => {
    //     return this.state.prescriptionFormTemplate.sectionOrder.findIndex((sectionId) => {
    //         return this.state.selectedSection === sectionId;
    //     });
    // }

    // private handleSectionDuplicationChange = (event: any) => {
    //     const isDuplicatable = event.target.checked;

    //     const prescriptionFormTemplateCopy = cloneDeep(this.state.prescriptionFormTemplate);
    //     const section = prescriptionFormTemplateCopy.sections[this.state.selectedSection!];
    //     section.canDuplicate = isDuplicatable;

    //     prescriptionFormTemplateCopy.sections[this.state.selectedSection!] = section;

    //     this.setState({
    //         prescriptionFormTemplate: prescriptionFormTemplateCopy,
    //     })
    // }

    // private handleDuplicationButtonTextChange = (event: any) => {
    //     const newText = event.target.value;

    //     const prescriptionFormTemplateCopy = cloneDeep(this.state.prescriptionFormTemplate);
    //     const section = prescriptionFormTemplateCopy.sections[this.state.selectedSection!];
    //     section.duplicateButtonText = newText;

    //     prescriptionFormTemplateCopy.sections[this.state.selectedSection!] = section;

    //     this.setState({
    //         prescriptionFormTemplate: prescriptionFormTemplateCopy,
    //     })
    // }

    // private controlOptionsSelect = (sectionId: string, label: string, beginningOrEnd: IBeginningOrEnd) => {
    //     const controlOptions = [];
    //     for (const templateType in IPrescriptionControlTemplateType) {
    //         if (true) {
    //             let displayName: string;
    //             switch (templateType) {
    //                 case IPrescriptionControlTemplateType.DoctorInformation:
    //                     displayName = 'Doctor Information';
    //                     break;
    //                 case IPrescriptionControlTemplateType.Title:
    //                     displayName = 'Title';
    //                     break;
    //                 case IPrescriptionControlTemplateType.Dropdown:
    //                     displayName = 'Dropdown';
    //                     break;
    //                 case IPrescriptionControlTemplateType.MultilineText:
    //                     displayName = 'Notepad';
    //                     break;
    //                 case IPrescriptionControlTemplateType.SingleLineText:
    //                     displayName = 'Single Line Text';
    //                     break;
    //                 case IPrescriptionControlTemplateType.Checkbox:
    //                     displayName = 'Checkbox';
    //                     break;
    //                 case IPrescriptionControlTemplateType.Number:
    //                     displayName = 'Number';
    //                     break;
    //                 case IPrescriptionControlTemplateType.NonEditableText:
    //                     displayName = 'Description';
    //                     break;
    //                 case IPrescriptionControlTemplateType.UnitSelection:
    //                     displayName = 'Unit Selection';
    //                     break;
    //                 case IPrescriptionControlTemplateType.Date:
    //                     displayName = 'Date';
    //                     break;
    //                 default:
    //                     break;
    //             }

    //             controlOptions.push({
    //                 value: templateType,
    //                 displayName: displayName!,
    //             });
    //         }
    //     }
    //     return (
    //         <FormControl>
    //             <InputLabel>{label}</InputLabel>
    //             <Select
    //                 value={''}
    //                 onChange={this.handleAddControlOption(sectionId, beginningOrEnd)}
    //             >
    //                 {controlOptions.map(({ value, displayName }) => {
    //                     return <MenuItem key={value} value={value}>{displayName}</MenuItem>
    //                 })}
    //             </Select>
    //         </FormControl>
    //     )
    // }

    // private handleAddControlOption = (sectionId: string, beginningOrEnd: IBeginningOrEnd) => (event: any) => {
    //     const value = event.target.value;
    //     const id = generateUniqueId();
    //     const prescriptionFormTemplateCopy = cloneDeep(this.state.prescriptionFormTemplate);

    //     let control: IPrescriptionControlTemplate;

    //     if (value === IPrescriptionControlTemplateType.Title) {

    //         const titleControl: ITitleTemplateControl = {
    //             id,
    //             type: IPrescriptionControlTemplateType.Title,
    //             title: 'New Title',
    //             sectionId,
    //         }
    //         control = titleControl;
    //     } else if (value === IPrescriptionControlTemplateType.Dropdown) {
    //         const options: IOption[] = [];
    //         for (let i = 0; i < 3; i++) {
    //             const uniqueOptionId = generateUniqueId();
    //             options.push({
    //                 id: uniqueOptionId,
    //                 text: `Option Text`,
    //             })
    //         }
    //         const dropdownControl: IDropdownTemplateControl = {
    //             id,
    //             label: 'Dropdown Label',
    //             type: IPrescriptionControlTemplateType.Dropdown,
    //             options,
    //             sectionId,
    //         }

    //         control = dropdownControl;
    //     } else if (value === IPrescriptionControlTemplateType.DoctorInformation) {
    //         const doctorControl: IDoctorInformationTemplateControl = {
    //             id,
    //             type: IPrescriptionControlTemplateType.DoctorInformation,
    //             sectionId,
    //         }

    //         control = doctorControl;
    //     } else if (value === IPrescriptionControlTemplateType.MultilineText) {
    //         const multilineTextControl: IMultilineTextControl = {
    //             id,
    //             type: IPrescriptionControlTemplateType.MultilineText,
    //             sectionId,
    //             label: 'Notepad Label',
    //         }

    //         control = multilineTextControl;
    //     } else if (value === IPrescriptionControlTemplateType.SingleLineText) {
    //         const singleLineText: ISingleLineTextControlTemplate = {
    //             id,
    //             type: IPrescriptionControlTemplateType.SingleLineText,
    //             sectionId,
    //             label: 'Single Line Text Label',
    //         }

    //         control = singleLineText;
    //     } else if (value === IPrescriptionControlTemplateType.Checkbox) {
    //         const options: IOption[] = [];
    //         for (let i = 0; i < 3; i++) {
    //             const uniqueOptionId = generateUniqueId();
    //             options.push({
    //                 id: uniqueOptionId,
    //                 text: `Option Text`,
    //             })
    //         }
    //         const checkboxControl: ICheckboxTemplateControl = {
    //             id,
    //             type: IPrescriptionControlTemplateType.Checkbox,
    //             options,
    //             sectionId,
    //         }

    //         control = checkboxControl;
    //     } else if (value === IPrescriptionControlTemplateType.Number) {
    //         const numberControl: INumberTemplateControl = {
    //             id,
    //             type: IPrescriptionControlTemplateType.Number,
    //             sectionId,
    //             label: 'Number Field Label',
    //             prefix: '',
    //             suffix: '',
    //         }

    //         control = numberControl;
    //     } else if (value === IPrescriptionControlTemplateType.NonEditableText) {
    //         const nonEditableTextControl: INonEditableTextField = {
    //             id,
    //             sectionId,
    //             text: 'Replace this text by clicking on this field',
    //             type: IPrescriptionControlTemplateType.NonEditableText,
    //         }

    //         control = nonEditableTextControl;
    //     } else if (value === IPrescriptionControlTemplateType.UnitSelection) {
    //         const unitSelectionControl: IUnitSelectionControlTemplate = {
    //             id,
    //             sectionId,
    //             type: IPrescriptionControlTemplateType.UnitSelection,
    //             units: [],
    //         }

    //         control = unitSelectionControl;
    //     } else if (value === IPrescriptionControlTemplateType.Date) {
    //         const dateControl: IDateTemplateControl = {
    //             id,
    //             sectionId,
    //             type: IPrescriptionControlTemplateType.Date,
    //             label: 'Date Control Label',
    //         }

    //         control = dateControl;
    //     }

    //     prescriptionFormTemplateCopy.controls[id] = control!;
    //     const currentControlOrder = prescriptionFormTemplateCopy.controlOrder[sectionId];

    //     if (beginningOrEnd === IBeginningOrEnd.Beginning) {
    //         const newControlOrder = [id, ...currentControlOrder];
    //         prescriptionFormTemplateCopy.controlOrder[sectionId] = newControlOrder;
    //     } else {
    //         const newControlOrder = [...currentControlOrder, id];
    //         prescriptionFormTemplateCopy.controlOrder[sectionId] = newControlOrder;
    //     }

    //     this.setState({
    //         prescriptionFormTemplate: prescriptionFormTemplateCopy,
    //     })
    // }

    // private controlOptionsSelectForControl = (controlId: string, label: string, beforeOrAfter: IBeforeOrAfter) => {
    //     const controlOptions = [];
    //     for (const templateType in IPrescriptionControlTemplateType) {
    //         if (true) {
    //             let displayName: string;
    //             switch (templateType) {
    //                 case IPrescriptionControlTemplateType.DoctorInformation:
    //                     displayName = 'Doctor Information';
    //                     break;
    //                 case IPrescriptionControlTemplateType.Title:
    //                     displayName = 'Title';
    //                     break;
    //                 case IPrescriptionControlTemplateType.Dropdown:
    //                     displayName = 'Dropdown';
    //                     break;
    //                 case IPrescriptionControlTemplateType.MultilineText:
    //                     displayName = 'Notepad';
    //                     break;
    //                 case IPrescriptionControlTemplateType.SingleLineText:
    //                     displayName = 'Single Line Text';
    //                     break;
    //                 case IPrescriptionControlTemplateType.Checkbox:
    //                     displayName = 'Checkbox';
    //                     break;
    //                 case IPrescriptionControlTemplateType.Number:
    //                     displayName = 'Number';
    //                     break;
    //                 case IPrescriptionControlTemplateType.NonEditableText:
    //                     displayName = 'Description';
    //                     break;
    //                 case IPrescriptionControlTemplateType.UnitSelection:
    //                     displayName = 'Unit Selection';
    //                     break;
    //                 case IPrescriptionControlTemplateType.Date:
    //                     displayName = 'Date';
    //                     break;
    //                 default:
    //                     break;
    //             }

    //             controlOptions.push({
    //                 value: templateType,
    //                 displayName: displayName!,
    //             });
    //         }
    //     }
    //     return (
    //         <FormControl>
    //             <InputLabel>{label}</InputLabel>
    //             <Select
    //                 value={''}
    //                 onChange={this.handleAddControlOptionForControl(controlId, beforeOrAfter)}
    //             >
    //                 {controlOptions.map(({ value, displayName }) => {
    //                     return <MenuItem key={value} value={value}>{displayName}</MenuItem>
    //                 })}
    //             </Select>
    //         </FormControl>
    //     )
    // }

    // private handleAddControlOptionForControl = (controlId: string, beforeOrAfter: IBeforeOrAfter) => (event: any) => {
    //     const value = event.target.value;
    //     const id = generateUniqueId();
    //     const prescriptionFormTemplateCopy = cloneDeep(this.state.prescriptionFormTemplate);
    //     const selectedControlCopy = cloneDeep(this.state.prescriptionFormTemplate.controls[controlId]);
    //     const indexOfSelectedControl = prescriptionFormTemplateCopy.controlOrder[selectedControlCopy.sectionId].findIndex((compareControlId) => {
    //         return compareControlId === controlId;
    //     });

    //     if (value === IPrescriptionControlTemplateType.Title) {

    //         const titleControl: ITitleTemplateControl = {
    //             id,
    //             type: IPrescriptionControlTemplateType.Title,
    //             title: 'New Title',
    //             sectionId: selectedControlCopy.sectionId,
    //         }

    //         prescriptionFormTemplateCopy.controls[id] = titleControl;
    //         const currentControlOrder = prescriptionFormTemplateCopy.controlOrder[selectedControlCopy.sectionId];

    //         if (beforeOrAfter === IBeforeOrAfter.Before) {
    //             const before = currentControlOrder.slice(0, indexOfSelectedControl);
    //             const after = currentControlOrder.slice(indexOfSelectedControl);
    //             const newControlOrder = [...before, titleControl.id, ...after];
    //             prescriptionFormTemplateCopy.controlOrder[selectedControlCopy.sectionId] = newControlOrder;
    //         } else {
    //             const before = currentControlOrder.slice(0, indexOfSelectedControl + 1);
    //             const after = currentControlOrder.slice(indexOfSelectedControl + 1);
    //             const newControlOrder = [...before, titleControl.id, ...after];
    //             prescriptionFormTemplateCopy.controlOrder[selectedControlCopy.sectionId] = newControlOrder;
    //         }
    //     }

    //     this.setState({
    //         prescriptionFormTemplate: prescriptionFormTemplateCopy,
    //     })
    // }

    private correctControlDisplay = (controlId: string) => {
        const control = this.state.prescriptionFormTemplate.controls[controlId];
        const {
            titleControlContainer,
            cityStateZipContainer,
        } = createPrescriptionBuilderClasses(this.props, this.state);

        if (control.type === IPrescriptionControlTemplateType.Title) {
            return (
                <div className={titleControlContainer}>
                    <Typography variant="title">{control.title}</Typography>
                </div>
            )
        } else if (control.type === IPrescriptionControlTemplateType.Dropdown) {
            return (
                <div>
                    <FormControl fullWidth={true} disabled={this.state.editMode}>
                        <InputLabel>{control.label}</InputLabel>
                        <Select
                            value={this.state.controlValues[control.id]}
                            onChange={this.handleControlValueChange(control.id)}
                        >
                            {control.options.map(({ text, id }) => {
                                return <MenuItem key={id} value={id}>{text}</MenuItem>
                            })}
                        </Select>
                    </FormControl>
                </div>
            )
        } else if (control.type === IPrescriptionControlTemplateType.DoctorInformation) {
            return (
                <div>
                    <FormControl fullWidth={true} disabled={this.state.editMode}>
                        <InputLabel>Doctor</InputLabel>
                        <Input
                            value={''}
                        />
                    </FormControl>
                    <FormControl fullWidth={true} disabled={this.state.editMode}>
                        <InputLabel>Street</InputLabel>
                        <Input
                            value={''}
                        />
                    </FormControl>
                    <div className={cityStateZipContainer}>
                        <FormControl disabled={this.state.editMode}>
                            <InputLabel>City</InputLabel>
                            <Input
                                value={''}
                            />
                        </FormControl>
                        <FormControl disabled={this.state.editMode}>
                            <InputLabel>State</InputLabel>
                            <Input
                                value={''}
                            />
                        </FormControl>
                        <FormControl disabled={this.state.editMode}>
                            <InputLabel>Zip</InputLabel>
                            <Input
                                value={''}
                            />
                        </FormControl>
                    </div>
                    <FormControl fullWidth={true} disabled={this.state.editMode}>
                        <InputLabel>Telephone</InputLabel>
                        <Input
                            value={''}
                        />
                    </FormControl>
                </div>
            )
        } else if (control.type === IPrescriptionControlTemplateType.MultilineText) {
            return (
                <div>
                    <TextField
                        disabled={this.state.editMode}
                        fullWidth={true}
                        rows={5}
                        multiline={true}
                        label={control.label}
                        value={this.state.controlValues[control.id]}
                        onChange={this.handleControlValueChange(control.id)}
                    />
                </div>
            )
        } else if (control.type === IPrescriptionControlTemplateType.SingleLineText) {
            return (
                <div>
                    <TextField
                        disabled={this.state.editMode}
                        fullWidth={true}
                        label={control.label}
                        value={this.state.controlValues[control.id]}
                        onChange={this.handleControlValueChange(control.id)}
                    />
                </div>
            )
        } else if (control.type === IPrescriptionControlTemplateType.Checkbox) {
            return (
                <div>
                    <FormControl fullWidth={true} disabled={this.state.editMode}>
                        {control.options.map(({ text, id }) => {
                            return (
                                <FormControlLabel
                                    key={id}
                                    label={text}
                                    control={
                                        <Checkbox checked={false} value={''}/>
                                    }
                                />
                            )
                        })}
                    </FormControl>
                </div>
            )
        } else if (control.type === IPrescriptionControlTemplateType.Number) {
            return (
                <FormControl fullWidth={true} disabled={this.state.editMode}>
                    <InputLabel htmlFor={`${control.id}-number`}>{control.label}</InputLabel>
                    <Input
                        id={`${control.id}-number`}
                        value={this.state.controlValues[control.id]}
                        onChange={this.handleControlValueChange(control.id)}
                        startAdornment={control.prefix ? <InputAdornment position="start">{control.prefix}</InputAdornment> : undefined}
                        endAdornment={control.suffix ? <InputAdornment position="end">{control.suffix}</InputAdornment> : undefined}
                    />
                </FormControl>
            )
        } else if (control.type === IPrescriptionControlTemplateType.NonEditableText) {
            return (
                <Typography variant="body1">{control.text}</Typography>
            )
        } else if (control.type === IPrescriptionControlTemplateType.UnitSelection) {
            return (
                <FormControl fullWidth={true} disabled={this.state.editMode}>
                    <InputLabel>Select Units</InputLabel>
                    <Select
                        multiple={true}
                        onChange={this.handleControlValueChange(control.id)}
                        value={this.state.controlValues[control.id] || []}
                    >
                        {this.createUnits()}
                    </Select>
                </FormControl>
            )
        } else if (control.type === IPrescriptionControlTemplateType.Date) {
            return (
                <DateFormatInput
                    disabled={this.state.editMode}
                    fullWidth={true}
                    label={control.label}
                    name="date-input"
                    value={this.state.controlValues[control.id]}
                    onChange={this.handleDeadlineChange(control.id)}
                    min={new Date()}
                />
            )
        }

        return <div/>
    }

    private handleDeadlineChange = (controlId: string) => (newDeadline: any) => {
        const controlValuesCopy = cloneDeep(this.state.controlValues);

        controlValuesCopy[controlId] = newDeadline;

        this.setState({
            controlValues: controlValuesCopy,
        })
    }

    private createUnits = () => {
        const units = [];
        for (let i = 1; i <= 32; i++) {
            units.push(i);
        }

        return units.map((unitNumber) => {
            return (
                <MenuItem key={unitNumber}>
                    <Checkbox checked={false}/>
                    <ListItemText primary={unitNumber}/>
                </MenuItem>
            )
        });
    }

    // private correctControlDisplayForDropdown = (controlId: string) => {
    //     const {
    //         fullWidthClass,
    //         optionsContainer,
    //         sixteenPixelSpacing,
    //         optionAndTrashContainer,
    //         trashIcon,
    //         optionName,
    //         addOptionButtonContainer,
    //         addSectionOrFieldContainer,
    //     } = createPrescriptionBuilderClasses(this.props, this.state);

    //     const control = this.state.prescriptionFormTemplate.controls[controlId];

    //     if (control.type === IPrescriptionControlTemplateType.Dropdown || control.type === IPrescriptionControlTemplateType.Checkbox) {
    //         return (
    //             <div className={`${fullWidthClass} ${sixteenPixelSpacing}`}>
    //                 {control.type === IPrescriptionControlTemplateType.Dropdown ? (
    //                     <FormControl fullWidth={true}>
    //                         <InputLabel>Label</InputLabel>
    //                         <Input
    //                             value={control.label}
    //                             onChange={this.handleControlLabelChange}
    //                         />
    //                     </FormControl>
    //                 ) : undefined}
    //                 <div className={optionsContainer}>
    //                     <Typography variant="subheading">Options:</Typography>
    //                     { control.options.map(({ id, text }, index) => {
    //                         return (
    //                             <div key={id} className={optionAndTrashContainer}>
    //                                 <FormControl fullWidth={true} className={optionName}>
    //                                     <InputLabel>Option {index + 1}</InputLabel>
    //                                     <Input
    //                                         value={text}
    //                                         onChange={this.handleOptionTextChange(id)}
    //                                     />
    //                                 </FormControl>
    //                                 {control.options.length > 2 ? (
    //                                     <DeleteIcon className={trashIcon} onClick={this.deleteOption(id)}/>
    //                                 ) : undefined}
    //                             </div>
    //                         )
    //                     })}
    //                     <div className={addOptionButtonContainer}>
    //                         <Button onClick={this.handleAddOptionToDropdown} color="secondary">Add Option</Button>
    //                     </div>
    //                 </div>
    //             </div>
    //         )
    //     } else if (control.type === IPrescriptionControlTemplateType.Title) {
    //         return (
    //             <FormControl fullWidth={true}>
    //                 <InputLabel>Title</InputLabel>
    //                 <Input
    //                     value={control.title}
    //                     onChange={this.handleControlTitleChange}
    //                 />
    //             </FormControl>
    //         )
    //     } else if (control.type === IPrescriptionControlTemplateType.DoctorInformation) {
    //         return (
    //             <Typography variant="body1">*The doctor field has no configurable options*</Typography>
    //         )
    //     } else if (control.type === IPrescriptionControlTemplateType.MultilineText) {
    //         return (
    //             <FormControl fullWidth={true}>
    //                 <InputLabel>Label</InputLabel>
    //                 <Input
    //                     value={control.label}
    //                     onChange={this.handleControlLabelChange}
    //                 />
    //             </FormControl>
    //         )
    //     } else if (control.type === IPrescriptionControlTemplateType.SingleLineText) {
    //         return (
    //             <FormControl fullWidth={true}>
    //                 <InputLabel>Label</InputLabel>
    //                 <Input
    //                     value={control.label}
    //                     onChange={this.handleControlLabelChange}
    //                 />
    //             </FormControl>
    //         )
    //     } else if (control.type === IPrescriptionControlTemplateType.Number) {
    //         return (
    //             <div className={addSectionOrFieldContainer}>
    //                 <FormControl fullWidth={true}>
    //                     <InputLabel>Label</InputLabel>
    //                     <Input
    //                         value={control.label}
    //                         onChange={this.handleControlLabelChange}
    //                     />
    //                 </FormControl>
    //                 <FormControl fullWidth={true}>
    //                     <InputLabel>Prefix</InputLabel>
    //                     <Input
    //                         value={control.prefix}
    //                         onChange={this.handlePrefixChange}
    //                     />
    //                 </FormControl>
    //                 <FormControl fullWidth={true}>
    //                     <InputLabel>Suffix</InputLabel>
    //                     <Input
    //                         value={control.suffix}
    //                         onChange={this.handleSuffixChange}
    //                     />
    //                 </FormControl>
    //             </div>
    //         )
    //     } else if (control.type === IPrescriptionControlTemplateType.NonEditableText) {
    //         return (
    //             <FormControl fullWidth={true}>
    //                 <InputLabel>Text</InputLabel>
    //                 <Input
    //                     multiline={true}
    //                     value={control.text}
    //                     onChange={this.handleControlTextChange}
    //                 />
    //             </FormControl>
    //         )
    //     } else if (control.type === IPrescriptionControlTemplateType.Date) {
    //         return (
    //             <div>
    //                 <FormControl fullWidth={true}>
    //                     <InputLabel>Label</InputLabel>
    //                     <Input
    //                         value={control.label}
    //                         onChange={this.handleControlLabelChange}
    //                     />
    //                 </FormControl>
    //             </div>

    //         )
    //     }

    //     return <div/>
    // }

    // private handlePrefixChange = (event: any) => {
    //     const newPrefix = event.target.value;
    //     const selectedControlId = this.state.selectedControl;

    //     const prescriptionFormTemplateCopy = cloneDeep(this.state.prescriptionFormTemplate);
    //     (prescriptionFormTemplateCopy.controls[selectedControlId!] as INumberTemplateControl).prefix = newPrefix;
    //     this.setState({
    //         prescriptionFormTemplate: prescriptionFormTemplateCopy,
    //     })
    // }

    // private handleControlTextChange = (event: any) => {
    //     const newText = event.target.value;
    //     const selectedControlId = this.state.selectedControl;

    //     const prescriptionFormTemplateCopy = cloneDeep(this.state.prescriptionFormTemplate);
    //     (prescriptionFormTemplateCopy.controls[selectedControlId!] as INonEditableTextField).text = newText;
    //     this.setState({
    //         prescriptionFormTemplate: prescriptionFormTemplateCopy,
    //     })
    // }

    // private handleSuffixChange = (event: any) => {
    //     const newSuffix = event.target.value;
    //     const selectedControlId = this.state.selectedControl;

    //     const prescriptionFormTemplateCopy = cloneDeep(this.state.prescriptionFormTemplate);
    //     (prescriptionFormTemplateCopy.controls[selectedControlId!] as INumberTemplateControl).suffix = newSuffix;
    //     this.setState({
    //         prescriptionFormTemplate: prescriptionFormTemplateCopy,
    //     })
    // }

    // private selectControl = (controlId: string) => (event: any) => {
    //     event.stopPropagation();
    //     event.preventDefault();
    //     this.setState({
    //         selectedControl: controlId,
    //         selectedSection: null,
    //     })
    // }

    // private handleControlTitleChange = (event: any) => {
    //     const newTitle = event.target.value;
    //     const selectedControlId = this.state.selectedControl;

    //     const prescriptionFormTemplateCopy = cloneDeep(this.state.prescriptionFormTemplate);
    //     (prescriptionFormTemplateCopy.controls[selectedControlId!] as ITitleTemplateControl).title = newTitle;
    //     this.setState({
    //         prescriptionFormTemplate: prescriptionFormTemplateCopy,
    //     })
    // }

    // private handleControlLabelChange = (event: any) => {
    //     const newLabel = event.target.value;
    //     const selectedControlId = this.state.selectedControl;

    //     const prescriptionFormTemplateCopy = this.copyPrescriptionFormTemplate();
    //     (prescriptionFormTemplateCopy.controls[selectedControlId!] as IDropdownTemplateControl).label = newLabel;
    //     this.setState({
    //         prescriptionFormTemplate: prescriptionFormTemplateCopy,
    //     })
    // }

    // private handleOptionTextChange = (optionId: string) => (event: any) => {
    //     const newOptionText = event.target.value;
    //     const selectedControlId = this.state.selectedControl!;

    //     const prescriptionFormTemplateCopy = this.copyPrescriptionFormTemplate();
    //     const currentOptions = (prescriptionFormTemplateCopy.controls[selectedControlId] as IDropdownTemplateControl).options;
    //     const updatedOptions = currentOptions.map((currentOption) => {
    //         if (optionId === currentOption.id) {
    //             return {
    //                 id: currentOption.id,
    //                 text: newOptionText,
    //             }
    //         } else {
    //             return currentOption;
    //         }
    //     });

    //     (prescriptionFormTemplateCopy.controls[selectedControlId] as IDropdownTemplateControl).options = updatedOptions;
    //     this.setState({
    //         prescriptionFormTemplate: prescriptionFormTemplateCopy,
    //     })
    // }

    // private deleteOption = (optionId: string) => () => {
    //     const selectedControlId = this.state.selectedControl!;

    //     const prescriptionFormTemplateCopy = this.copyPrescriptionFormTemplate();
    //     const currentOptions = (prescriptionFormTemplateCopy.controls[selectedControlId] as IDropdownTemplateControl).options;
    //     const optionsWithoutDeletedOption = currentOptions.filter((currentOption) => {
    //         return currentOption.id !== optionId;
    //     });

    //     (prescriptionFormTemplateCopy.controls[selectedControlId] as IDropdownTemplateControl).options = optionsWithoutDeletedOption;
    //     this.setState({
    //         prescriptionFormTemplate: prescriptionFormTemplateCopy,
    //     })
    // }

    // private copyPrescriptionFormTemplate = () => {
    //     return cloneDeep(this.state.prescriptionFormTemplate);
    // }

    // private handleAddOptionToDropdown = () => {
    //     const selectedControlId = this.state.selectedControl!;

    //     const prescriptionFormTemplateCopy = this.copyPrescriptionFormTemplate();
    //     const currentOptions = (prescriptionFormTemplateCopy.controls[selectedControlId] as IDropdownTemplateControl).options;
    //     const optionsWithNewOption = currentOptions.concat([{
    //         id: generateUniqueId(),
    //         text: 'Option Text',
    //     }]);

    //     (prescriptionFormTemplateCopy.controls[selectedControlId] as IDropdownTemplateControl).options = optionsWithNewOption;
    //     this.setState({
    //         prescriptionFormTemplate: prescriptionFormTemplateCopy,
    //     })
    // }

    // private removeSection = (): void => {
    //     const selectedSectionId = this.state.selectedSection!;

    //     const prescriptionFormTemplateCopy = this.copyPrescriptionFormTemplate();
    //     const sectionsWithoutSelectedSection = prescriptionFormTemplateCopy.sectionOrder.filter((compareSectionId) => {
    //         return compareSectionId !== selectedSectionId;
    //     });

    //     delete prescriptionFormTemplateCopy.sections[selectedSectionId];
    //     prescriptionFormTemplateCopy.sectionOrder = sectionsWithoutSelectedSection;

    //     prescriptionFormTemplateCopy.controlOrder[selectedSectionId].forEach((controlId) => {
    //         delete prescriptionFormTemplateCopy.controls[controlId];
    //     });

    //     delete prescriptionFormTemplateCopy.controlOrder[selectedSectionId];

    //     this.setState({
    //         prescriptionFormTemplate: prescriptionFormTemplateCopy,
    //         selectedSection: null,
    //     })
    // }

    // private removeControl = (): void => {
    //     const selectedControlId = this.state.selectedControl!;

    //     const prescriptionFormTemplateCopy = this.copyPrescriptionFormTemplate();
    //     const control = prescriptionFormTemplateCopy.controls[selectedControlId];
    //     const sectionId = control.sectionId;
    //     const controlsWithoutSelectedSection = prescriptionFormTemplateCopy.controlOrder[sectionId].filter((compareControlId) => {
    //         return compareControlId !== selectedControlId;
    //     });

    //     prescriptionFormTemplateCopy.controlOrder[sectionId] = controlsWithoutSelectedSection;

    //     delete prescriptionFormTemplateCopy.controls[selectedControlId];

    //     this.setState({
    //         prescriptionFormTemplate: prescriptionFormTemplateCopy,
    //         selectedControl: null,
    //     })
    // }

    // private removeControlFromSection =(): void => {
    //     //
    // }
}

export const PrescriptionBuilder = withTheme()(PrescriptionBuilderPresentation)