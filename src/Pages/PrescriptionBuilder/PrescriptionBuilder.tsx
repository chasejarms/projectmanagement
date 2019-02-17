import {
    Button,
    Checkbox,
    Drawer,
    FormControl,
    FormControlLabel,
    Input,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    Typography,
    withTheme,
} from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import { cloneDeep } from 'lodash';
import * as React from 'react';
import { IBeforeOrAfter } from 'src/Models/beforeOrAfter';
import { IBeginningOrEnd } from 'src/Models/beginningOrEnd';
import { IDropdownTemplateControl } from 'src/Models/prescription/controls/dropdownTemplateControl';
import { IOption } from 'src/Models/prescription/controls/option';
import { IPrescriptionControlTemplate } from 'src/Models/prescription/controls/prescriptionControlTemplate';
import { IPrescriptionControlTemplateType } from 'src/Models/prescription/controls/prescriptionControlTemplateType';
import { ITitleTemplateControl } from 'src/Models/prescription/controls/titleTemplateControl';
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
        hoveredSection: null,
        hoveredControl: null,
        selectedSection: null,
        selectedControl: null,
    }

    public render() {
        const {
            drawerPaper,
            prescriptionBuilderContainer,
            prescriptionFormContainer,
            drawerReplacement,
            sectionsContainer,
            sectionContainer,
            hoverArea,
            innerDrawerContainer,
            drawerVerticalSpacing,
            addSectionOrFieldContainer,
            buttonLeftMargin,
            noSectionsInfoText,
            noSectionInnerContainer,
            noControlForSectionClass,
            drawerNoSelectedSectionOrControl,
            duplicateSectionButtonContainer,
            controlContainer,
            controlsContainer,
            drawerSplitSections,
        } = createPrescriptionBuilderClasses(this.props, this.state);

        const {
            selectedSection,
            prescriptionFormTemplate,
            selectedControl,
        } = this.state;

        const {
            sections,
            controls,
            sectionOrder,
            controlOrder,
        } = prescriptionFormTemplate;

        const section = sections[this.state.selectedSection!];
        const control = controls[this.state.selectedControl!];
        const noSelectedSectionOrControl = !selectedSection && !selectedControl;

        return (
            <div className={prescriptionBuilderContainer}>
                <Drawer
                    variant="permanent"
                    anchor="right"
                    classes={{
                        paper: drawerPaper,
                    }}
                >
                    <div className={`${innerDrawerContainer} ${noSelectedSectionOrControl ? drawerNoSelectedSectionOrControl : ''}`}>
                        {noSelectedSectionOrControl ? (
                            <Typography variant="body1">Select a control or section</Typography>
                        ) : undefined}
                        {selectedSection ? (
                            <div className={drawerSplitSections}>
                                <div className={drawerVerticalSpacing}>
                                    <Typography variant="title">Edit Section</Typography>
                                    <FormControlLabel control={
                                        <Checkbox
                                            checked={section.canDuplicate}
                                            onChange={this.handleSectionDuplicationChange}
                                            name="allowDuplication"
                                            color="primary"
                                        />
                                    } label="Allow Duplication"/>
                                    <FormControl required={section.canDuplicate} disabled={!section.canDuplicate}>
                                        <InputLabel>Section Duplication Text</InputLabel>
                                        <Input
                                            value={section.duplicateButtonText || ''}
                                            onChange={this.handleDuplicationButtonTextChange}
                                        />
                                        {/* <FormHelperText>{estimatedCompletionError}</FormHelperText> */}
                                    </FormControl>
                                    <div className={addSectionOrFieldContainer}>
                                        <Typography variant="subheading">Add A Section:</Typography>
                                        <div>
                                            <Button color="secondary" onClick={this.addSectionBeforeSelected}>Before</Button>
                                            <Button color="secondary" className={buttonLeftMargin} onClick={this.addSectionAfterSelected}>After</Button>
                                        </div>
                                    </div>
                                    <div className={addSectionOrFieldContainer}>
                                        {this.controlOptionsSelect(section.id, 'Add Field At Beginning Of Section', IBeginningOrEnd.Beginning)}
                                        {this.controlOptionsSelect(section.id, 'Add Field At End Of Section', IBeginningOrEnd.End)}
                                    </div>
                                </div>
                                <div>
                                    <Button onClick={this.removeSection} color="secondary">Delete Section</Button>
                                </div>
                            </div>
                        ): undefined}
                        {selectedControl ? (
                            <div className={drawerSplitSections}>
                                <div className={drawerVerticalSpacing}>
                                    <Typography variant="title">Edit Field</Typography>
                                    {this.correctControlDisplayForDropdown(this.state.selectedControl!)}
                                    <div className={addSectionOrFieldContainer}>
                                        {this.controlOptionsSelectForControl(control.id, 'Add Field Before Current Field', IBeforeOrAfter.Before)}
                                        {this.controlOptionsSelectForControl(control.id, 'Add Field After Current Field', IBeforeOrAfter.After)}
                                    </div>
                                </div>
                                <div>
                                    <Button onClick={this.removeControl} color="secondary">Delete Control</Button>
                                </div>
                            </div>
                        ) : undefined}
                    </div>
                </Drawer>
                <Paper className={prescriptionFormContainer}>
                    {sectionOrder.length === 0 ? (
                        <div className={noSectionsInfoText}>
                            <div className={noSectionInnerContainer}>
                                <Typography variant="body1">To get started, click the add section button</Typography>
                                <Button color="secondary" onClick={this.addSection(0)}>Add A Section</Button>
                            </div>
                        </div>
                    ) : (
                        <div className={sectionsContainer}>
                            {sectionOrder.map((sectionId) => {
                                let sectionClasses = sectionContainer;

                                if (sectionId === this.state.hoveredSection && !this.state.hoveredControl) {
                                    sectionClasses += ` ${hoverArea}`;
                                }

                                const currentSection = sections[sectionId];
                                const controlOrderForSection = controlOrder[sectionId];
                                const noControlForSection = controlOrderForSection.length === 0;

                                return (
                                    <div key={sectionId}>
                                        <div
                                            className={`${sectionClasses} ${noControlForSection ? noControlForSectionClass : ''}`}
                                            onMouseEnter={this.setHoverSection(sectionId)}
                                            onMouseLeave={this.removeHoverSection}
                                            onClick={this.selectSection(sectionId)}
                                        >
                                            {noControlForSection ? (
                                                <Typography>Click on this section to add fields or other sections</Typography>
                                            ) : (
                                                <div className={controlsContainer}>
                                                    {controlOrderForSection.map((controlId) => {
                                                        let controlClasses = controlContainer;

                                                        if (controlId === this.state.hoveredControl) {
                                                            controlClasses += ` ${hoverArea}`;
                                                        }

                                                        return (
                                                            <div
                                                                key={controlId}
                                                                className={controlClasses}
                                                                onMouseEnter={this.setHoverControl(controlId)}
                                                                onMouseLeave={this.removeHoverControl}
                                                                onClick={this.selectControl(controlId)}
                                                            >
                                                                {this.correctControlDisplay(controlId)}
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
                                    </div>
                                )
                            })}
                        </div>
                    )}
                </Paper>
                <div className={drawerReplacement}/>
            </div>
        )
    }

    private setHoverSection = (sectionId: string) => () => {
        this.setState({
            hoveredSection: sectionId,
            hoveredControl: null,
        });
    }

    private removeHoverSection = () => {
        this.setState({
            hoveredSection: null,
        })
    }

    private setHoverControl = (controlId: string) => () => {
        this.setState({
            hoveredControl: controlId,
        })
    }

    private removeHoverControl = () => {
        this.setState({
            hoveredControl: null,
        })
    }

    private selectSection = (sectionId: string) => () => {
        this.setState({
            selectedSection: sectionId,
            selectedControl: null,
        })
    }

    private addSection = (insertPosition: number) => () => {
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

    private addSectionBeforeSelected = () => {
        const index = this.indexOfSelectedSection();
        this.addSection(index)();
    }

    private addSectionAfterSelected = () => {
        const index = this.indexOfSelectedSection();
        this.addSection(index + 1)();
    }

    private indexOfSelectedSection = (): number => {
        return this.state.prescriptionFormTemplate.sectionOrder.findIndex((sectionId) => {
            return this.state.selectedSection === sectionId;
        });
    }

    private handleSectionDuplicationChange = (event: any) => {
        const isDuplicatable = event.target.checked;

        const prescriptionFormTemplateCopy = cloneDeep(this.state.prescriptionFormTemplate);
        const section = prescriptionFormTemplateCopy.sections[this.state.selectedSection!];
        section.canDuplicate = isDuplicatable;

        prescriptionFormTemplateCopy.sections[this.state.selectedSection!] = section;

        this.setState({
            prescriptionFormTemplate: prescriptionFormTemplateCopy,
        })
    }

    private handleDuplicationButtonTextChange = (event: any) => {
        const newText = event.target.value;

        const prescriptionFormTemplateCopy = cloneDeep(this.state.prescriptionFormTemplate);
        const section = prescriptionFormTemplateCopy.sections[this.state.selectedSection!];
        section.duplicateButtonText = newText;

        prescriptionFormTemplateCopy.sections[this.state.selectedSection!] = section;

        this.setState({
            prescriptionFormTemplate: prescriptionFormTemplateCopy,
        })
    }

    private controlOptionsSelect = (sectionId: string, label: string, beginningOrEnd: IBeginningOrEnd) => {
        const controlOptions = [];
        for (const templateType in IPrescriptionControlTemplateType) {
            if (true) {
                let displayName: string;
                switch (templateType) {
                    case IPrescriptionControlTemplateType.DoctorInformation:
                        displayName = 'Doctor Information';
                        break;
                    case IPrescriptionControlTemplateType.Title:
                        displayName = 'Title';
                        break;
                    case IPrescriptionControlTemplateType.Dropdown:
                        displayName = 'Dropdown';
                        break;
                    default:
                        break;
                }

                controlOptions.push({
                    value: templateType,
                    displayName: displayName!,
                });
            }
        }
        return (
            <FormControl>
                <InputLabel>{label}</InputLabel>
                <Select
                    value={''}
                    onChange={this.handleAddControlOption(sectionId, beginningOrEnd)}
                >
                    {controlOptions.map(({ value, displayName }) => {
                        return <MenuItem key={value} value={value}>{displayName}</MenuItem>
                    })}
                </Select>
            </FormControl>
        )
    }

    private handleAddControlOption = (sectionId: string, beginningOrEnd: IBeginningOrEnd) => (event: any) => {
        const value = event.target.value;
        const id = generateUniqueId();
        const prescriptionFormTemplateCopy = cloneDeep(this.state.prescriptionFormTemplate);

        let control: IPrescriptionControlTemplate;

        if (value === IPrescriptionControlTemplateType.Title) {

            const titleControl: ITitleTemplateControl = {
                id,
                type: IPrescriptionControlTemplateType.Title,
                title: 'New Title',
                sectionId,
            }
            control = titleControl;
        } else if (value === IPrescriptionControlTemplateType.Dropdown) {
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
        }

        prescriptionFormTemplateCopy.controls[id] = control!;
        const currentControlOrder = prescriptionFormTemplateCopy.controlOrder[sectionId];

        if (beginningOrEnd === IBeginningOrEnd.Beginning) {
            const newControlOrder = [id, ...currentControlOrder];
            prescriptionFormTemplateCopy.controlOrder[sectionId] = newControlOrder;
        } else {
            const newControlOrder = [...currentControlOrder, id];
            prescriptionFormTemplateCopy.controlOrder[sectionId] = newControlOrder;
        }

        this.setState({
            prescriptionFormTemplate: prescriptionFormTemplateCopy,
        })
    }

    private controlOptionsSelectForControl = (controlId: string, label: string, beforeOrAfter: IBeforeOrAfter) => {
        const controlOptions = [];
        for (const templateType in IPrescriptionControlTemplateType) {
            if (true) {
                let displayName: string;
                switch (templateType) {
                    case IPrescriptionControlTemplateType.DoctorInformation:
                        displayName = 'Doctor Information';
                        break;
                    case IPrescriptionControlTemplateType.Title:
                        displayName = 'Title';
                        break;
                    case IPrescriptionControlTemplateType.Dropdown:
                        displayName = 'Dropdown';
                        break;
                    default:
                        break;
                }

                controlOptions.push({
                    value: templateType,
                    displayName: displayName!,
                });
            }
        }
        return (
            <FormControl>
                <InputLabel>{label}</InputLabel>
                <Select
                    value={''}
                    onChange={this.handleAddControlOptionForControl(controlId, beforeOrAfter)}
                >
                    {controlOptions.map(({ value, displayName }) => {
                        return <MenuItem key={value} value={value}>{displayName}</MenuItem>
                    })}
                </Select>
            </FormControl>
        )
    }

    private handleAddControlOptionForControl = (controlId: string, beforeOrAfter: IBeforeOrAfter) => (event: any) => {
        const value = event.target.value;
        const id = generateUniqueId();
        const prescriptionFormTemplateCopy = cloneDeep(this.state.prescriptionFormTemplate);
        const selectedControlCopy = cloneDeep(this.state.prescriptionFormTemplate.controls[controlId]);
        const indexOfSelectedControl = prescriptionFormTemplateCopy.controlOrder[selectedControlCopy.sectionId].findIndex((compareControlId) => {
            return compareControlId === controlId;
        });

        if (value === IPrescriptionControlTemplateType.Title) {

            const titleControl: ITitleTemplateControl = {
                id,
                type: IPrescriptionControlTemplateType.Title,
                title: 'New Title',
                sectionId: selectedControlCopy.sectionId,
            }

            prescriptionFormTemplateCopy.controls[id] = titleControl;
            const currentControlOrder = prescriptionFormTemplateCopy.controlOrder[selectedControlCopy.sectionId];

            if (beforeOrAfter === IBeforeOrAfter.Before) {
                const before = currentControlOrder.slice(0, indexOfSelectedControl);
                const after = currentControlOrder.slice(indexOfSelectedControl);
                const newControlOrder = [...before, titleControl.id, ...after];
                prescriptionFormTemplateCopy.controlOrder[selectedControlCopy.sectionId] = newControlOrder;
            } else {
                const before = currentControlOrder.slice(0, indexOfSelectedControl + 1);
                const after = currentControlOrder.slice(indexOfSelectedControl + 1);
                const newControlOrder = [...before, titleControl.id, ...after];
                prescriptionFormTemplateCopy.controlOrder[selectedControlCopy.sectionId] = newControlOrder;
            }
        }

        this.setState({
            prescriptionFormTemplate: prescriptionFormTemplateCopy,
        })
    }

    private correctControlDisplay = (controlId: string) => {
        const control = this.state.prescriptionFormTemplate.controls[controlId];

        if (control.type === IPrescriptionControlTemplateType.Title) {
            return (
                <Typography variant="title">{control.title}</Typography>
            )
        } else if (control.type === IPrescriptionControlTemplateType.Dropdown) {
            return (
                <div>
                    <FormControl fullWidth={true}>
                        <InputLabel>{control.label}</InputLabel>
                        <Select
                            value={''}
                            // will need to handle the change and actually make the value change
                            // onChange={}
                        >
                            {control.options.map(({ text, id }) => {
                                return <MenuItem key={id} value={id}>{text}</MenuItem>
                            })}
                        </Select>
                    </FormControl>
                </div>
            )
        }

        return <div/>
    }

    private correctControlDisplayForDropdown = (controlId: string) => {
        const {
            fullWidthClass,
            optionsContainer,
            sixteenPixelSpacing,
            optionAndTrashContainer,
            trashIcon,
            optionName,
            addOptionButtonContainer,
        } = createPrescriptionBuilderClasses(this.props, this.state);

        const control = this.state.prescriptionFormTemplate.controls[controlId];

        if (control.type === IPrescriptionControlTemplateType.Dropdown) {
            return (
                <div className={`${fullWidthClass} ${sixteenPixelSpacing}`}>
                    <FormControl fullWidth={true}>
                        <InputLabel>Label</InputLabel>
                        <Input
                            value={control.label}
                            onChange={this.handleControlLabelChange}
                        />
                    </FormControl>
                    <div className={optionsContainer}>
                        <Typography variant="subheading">Options:</Typography>
                        { control.options.map(({ id, text }, index) => {
                            return (
                                <div key={id} className={optionAndTrashContainer}>
                                    <FormControl fullWidth={true} className={optionName}>
                                        <InputLabel>Option {index + 1}</InputLabel>
                                        <Input
                                            value={text}
                                            onChange={this.handleOptionTextChange(id)}
                                        />
                                    </FormControl>
                                    {control.options.length > 2 ? (
                                        <DeleteIcon className={trashIcon} onClick={this.deleteOption(id)}/>
                                    ) : undefined}
                                </div>
                            )
                        })}
                        <div className={addOptionButtonContainer}>
                            <Button onClick={this.handleAddOptionToDropdown} color="secondary">Add Option</Button>
                        </div>
                    </div>
                </div>
            )
        } else if (control.type === IPrescriptionControlTemplateType.Title) {
            return (
                <FormControl fullWidth={true}>
                    <InputLabel>Title</InputLabel>
                    <Input
                        value={control.title}
                        onChange={this.handleControlTitleChange}
                    />
                </FormControl>
            )
        }

        return <div/>
    }

    private selectControl = (controlId: string) => (event: any) => {
        event.stopPropagation();
        event.preventDefault();
        this.setState({
            selectedControl: controlId,
            selectedSection: null,
        })
    }

    private handleControlTitleChange = (event: any) => {
        const newTitle = event.target.value;
        const selectedControlId = this.state.selectedControl;

        const prescriptionFormTemplateCopy = cloneDeep(this.state.prescriptionFormTemplate);
        (prescriptionFormTemplateCopy.controls[selectedControlId!] as ITitleTemplateControl).title = newTitle;
        this.setState({
            prescriptionFormTemplate: prescriptionFormTemplateCopy,
        })
    }

    private handleControlLabelChange = (event: any) => {
        const newLabel = event.target.value;
        const selectedControlId = this.state.selectedControl;

        const prescriptionFormTemplateCopy = this.copyPrescriptionFormTemplate();
        (prescriptionFormTemplateCopy.controls[selectedControlId!] as IDropdownTemplateControl).label = newLabel;
        this.setState({
            prescriptionFormTemplate: prescriptionFormTemplateCopy,
        })
    }

    private handleOptionTextChange = (optionId: string) => (event: any) => {
        const newOptionText = event.target.value;
        const selectedControlId = this.state.selectedControl!;

        const prescriptionFormTemplateCopy = this.copyPrescriptionFormTemplate();
        const currentOptions = (prescriptionFormTemplateCopy.controls[selectedControlId] as IDropdownTemplateControl).options;
        const updatedOptions = currentOptions.map((currentOption) => {
            if (optionId === currentOption.id) {
                return {
                    id: currentOption.id,
                    text: newOptionText,
                }
            } else {
                return currentOption;
            }
        });

        (prescriptionFormTemplateCopy.controls[selectedControlId] as IDropdownTemplateControl).options = updatedOptions;
        this.setState({
            prescriptionFormTemplate: prescriptionFormTemplateCopy,
        })
    }

    private deleteOption = (optionId: string) => () => {
        const selectedControlId = this.state.selectedControl!;

        const prescriptionFormTemplateCopy = this.copyPrescriptionFormTemplate();
        const currentOptions = (prescriptionFormTemplateCopy.controls[selectedControlId] as IDropdownTemplateControl).options;
        const optionsWithoutDeletedOption = currentOptions.filter((currentOption) => {
            return currentOption.id !== optionId;
        });

        (prescriptionFormTemplateCopy.controls[selectedControlId] as IDropdownTemplateControl).options = optionsWithoutDeletedOption;
        this.setState({
            prescriptionFormTemplate: prescriptionFormTemplateCopy,
        })
    }

    private copyPrescriptionFormTemplate = () => {
        return cloneDeep(this.state.prescriptionFormTemplate);
    }

    private handleAddOptionToDropdown = () => {
        const selectedControlId = this.state.selectedControl!;

        const prescriptionFormTemplateCopy = this.copyPrescriptionFormTemplate();
        const currentOptions = (prescriptionFormTemplateCopy.controls[selectedControlId] as IDropdownTemplateControl).options;
        const optionsWithNewOption = currentOptions.concat([{
            id: generateUniqueId(),
            text: 'Option Text',
        }]);

        (prescriptionFormTemplateCopy.controls[selectedControlId] as IDropdownTemplateControl).options = optionsWithNewOption;
        this.setState({
            prescriptionFormTemplate: prescriptionFormTemplateCopy,
        })
    }

    private removeSection = (): void => {
        const selectedSectionId = this.state.selectedSection!;

        const prescriptionFormTemplateCopy = this.copyPrescriptionFormTemplate();
        const sectionsWithoutSelectedSection = prescriptionFormTemplateCopy.sectionOrder.filter((compareSectionId) => {
            return compareSectionId !== selectedSectionId;
        });

        delete prescriptionFormTemplateCopy.sections[selectedSectionId];
        prescriptionFormTemplateCopy.sectionOrder = sectionsWithoutSelectedSection;

        prescriptionFormTemplateCopy.controlOrder[selectedSectionId].forEach((controlId) => {
            delete prescriptionFormTemplateCopy.controls[controlId];
        });

        delete prescriptionFormTemplateCopy.controlOrder[selectedSectionId];

        this.setState({
            prescriptionFormTemplate: prescriptionFormTemplateCopy,
            selectedSection: null,
        })
    }

    private removeControl = (): void => {
        const selectedControlId = this.state.selectedControl!;

        const prescriptionFormTemplateCopy = this.copyPrescriptionFormTemplate();
        const control = prescriptionFormTemplateCopy.controls[selectedControlId];
        const sectionId = control.sectionId;
        const controlsWithoutSelectedSection = prescriptionFormTemplateCopy.controlOrder[sectionId].filter((compareControlId) => {
            return compareControlId !== selectedControlId;
        });

        prescriptionFormTemplateCopy.controlOrder[sectionId] = controlsWithoutSelectedSection;

        delete prescriptionFormTemplateCopy.controls[selectedControlId];

        this.setState({
            prescriptionFormTemplate: prescriptionFormTemplateCopy,
            selectedControl: null,
        })
    }

    // private removeControlFromSection =(): void => {
    //     //
    // }
}

export const PrescriptionBuilder = withTheme()(PrescriptionBuilderPresentation)