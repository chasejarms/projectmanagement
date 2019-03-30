import {
    Button,
    Checkbox,
    CircularProgress,
    Divider,
    FormControl,
    FormControlLabel,
    FormGroup,
    Input,
    InputAdornment,
    InputLabel,
    ListItemText,
    MenuItem,
    Paper,
    Select,
    Snackbar,
    TextField,
    Typography,
    withTheme,
} from '@material-ui/core';
import TrashIcon from '@material-ui/icons/Delete';
import { cloneDeep } from 'lodash';
import { DateFormatInput } from 'material-ui-next-pickers';
import * as React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { AsyncButton } from 'src/Components/AsyncButton/AsyncButton';
import { DraggableExistingFormElement } from 'src/Components/DraggableExistingFormElement/DraggableExistingFormElement';
import { FormElementDropZone } from 'src/Components/FormElementDropZone/FormElementDropZone';
import { PrescriptionBuilderDrawer } from 'src/Components/PrescriptionBuilderDrawer/PrescriptionBuilderDrawer';
import { DoctorInformationEdit } from 'src/Components/PrescriptionEdit/PrescriptionEditComponents/DoctorInformationEdit/DoctorInformation.ias';
import { DropdownEdit } from 'src/Components/PrescriptionEdit/PrescriptionEditComponents/DropdownEdit/DropdownEdit';
import { MultilineTextEdit } from 'src/Components/PrescriptionEdit/PrescriptionEditComponents/MultilineTextEdit/MultilineTextEdit';
import { SingleLineTextEdit } from 'src/Components/PrescriptionEdit/PrescriptionEditComponents/SingleLineTextEdit/SingleLineTextEdit';
import { TitleEdit } from 'src/Components/PrescriptionEdit/PrescriptionEditComponents/TitleEdit/TitleEdit';
import { IDropdownTemplateControl } from 'src/Models/prescription/controls/dropdownTemplateControl';
import { INonEditableTextField } from 'src/Models/prescription/controls/nonEditableTextField';
import { INumberTemplateControl } from 'src/Models/prescription/controls/numberTemplateControl';
import { IPrescriptionControlTemplateType } from 'src/Models/prescription/controls/prescriptionControlTemplateType';
import { ITitleTemplateControl } from 'src/Models/prescription/controls/titleTemplateControl';
import { IPrescriptionFormTemplate } from 'src/Models/prescription/prescriptionFormTemplate';
import { IPrescriptionSectionTemplateType } from 'src/Models/prescription/sections/prescriptionSectionTemplateType';
import { SectionOrElement } from 'src/Models/sectionOrElement';
import {
    addNewSectionToPrescriptionFormTemplate,
    onDropExistingControlPrescriptionFormTemplate,
    onDropExistingSectionPrescriptionFormTemplate,
    onDropNewControlPrescriptionFormTemplate,
    removeControlPrescriptionFormTemplate,
    removeSectionPrescriptionFormTemplate,
    setPrescriptionFormTemplate,
    setSelectedControl,
    setSelectedSection,
    updateControlValue,
} from 'src/Redux/ActionCreators/prescriptionBuilderCreators';
import { IAppState } from 'src/Redux/Reducers/rootReducer';
import { generateUniqueId } from 'src/Utils/generateUniqueId';
import Api from '../../Api/api';
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
        updatingPrescriptionTemplate: false,
        loadingPrescriptionTemplate: true,
        snackbarIsOpen: false,
        updatingPrescriptionTemplateSuccess: false,
    }

    public async componentWillMount(): Promise<void> {
        const companyId = this.props.match.path.split('/')[2];
        const prescriptionFormTemplate = await Api.prescriptionTemplateApi.getPrescriptionTemplate(companyId);
        this.props.setPrescriptionFormTemplate(prescriptionFormTemplate);
        this.setState({
            loadingPrescriptionTemplate: false,
        })
    }

    public render() {
        const {
            editMode,
            prescriptionFormTemplate,
            selectedControl,
        } = this.props.prescriptionBuilderState;

        const {
            prescriptionBuilderContainer,
            prescriptionFormInnerContainer,
            prescriptionFormContainer,
            drawerReplacement,
            sectionsContainer,
            sectionContainer,
            noControlForSectionClass,
            duplicateSectionButtonContainer,
            controlContainer,
            controlsContainer,
            noFieldsContainer,
            selectedControlContainerClass,
            fieldPaletteClass,
            editControlContainer,
            threeColumns,
            dragIconContainerClass,
            savePrescriptionTemplateContainer,
            circularProgressContainer,
        } = createPrescriptionBuilderClasses(this.props, this.state);

        const {
            sections,
            sectionOrder,
        } = prescriptionFormTemplate;

        const disableEdits = this.state.loadingPrescriptionTemplate || this.state.updatingPrescriptionTemplate;

        return (
            <div className={prescriptionBuilderContainer}>
                <PrescriptionBuilderDrawer disableEdits={disableEdits}/>
                <Snackbar
                    open={this.state.snackbarIsOpen}
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'center',
                    }}
                    autoHideDuration={5000}
                    message={
                        (
                            <span>
                                {this.state.updatingPrescriptionTemplateSuccess ? (
                                    'Success! The template has been saved.'
                                ): (
                                    'Oops! It looks like there was an error.'
                                )}
                            </span>
                        )
                    }
                    onClose={this.handleSnackbarClose}
                />

                {this.state.loadingPrescriptionTemplate ? (
                    <Paper className={prescriptionFormContainer}>
                        <div className={circularProgressContainer}>
                            <CircularProgress
                                color="primary"
                                size={64}
                                thickness={3}
                            />
                        </div>
                    </Paper>
                ) : (
                    <Paper className={prescriptionFormContainer}>
                        {editMode ? (
                            <div className={savePrescriptionTemplateContainer}>
                                <AsyncButton
                                    color="secondary"
                                    disabled={this.state.updatingPrescriptionTemplate}
                                    asyncActionInProgress={this.state.updatingPrescriptionTemplate}
                                    onClick={this.updatePrescriptionTemplate}>
                                    Save Prescription Template
                                </AsyncButton>
                            </div>
                        ) : undefined}
                        {sectionOrder.length === 0 ? (
                            <div>
                                <FormElementDropZone
                                    heightInPixels={100}
                                    showBorderWithNoDragInProgress={true}
                                    text={'Drag a section into this box to get started.'}
                                    onDrop={this.onDropSection(0)}
                                    allowSectionOrElement={SectionOrElement.Section}
                                />
                            </div>
                        ) : (
                            <div className={prescriptionFormInnerContainer}>
                                <div className={sectionsContainer}>
                                {sectionOrder.map((sectionId, sectionIndex) => {
                                    const currentSection = sections[sectionId];
                                    const controlOrderForSection = currentSection.controlOrder;
                                    const noControlForSection = controlOrderForSection.length === 0;

                                    return (
                                        <div key={sectionId}>
                                            {sectionIndex === 0 ? (
                                                <FormElementDropZone
                                                    heightInPixels={32}
                                                    onDrop={this.onDropSection(sectionIndex)}
                                                    allowSectionOrElement={SectionOrElement.Section}
                                                />
                                            ) : undefined}
                                            <div
                                                className={`${sectionContainer} ${noControlForSection ? noControlForSectionClass : ''}`}
                                                onClick={this.selectSection(sectionId)}
                                            >
                                                {noControlForSection ? (
                                                    <div className={noFieldsContainer}>
                                                        <FormElementDropZone
                                                            heightInPixels={80}
                                                            showBorderWithNoDragInProgress={true}
                                                            text={'Drag elements into this box.'}
                                                            onDrop={this.onDropControl(sectionId, 0)}
                                                            allowSectionOrElement={SectionOrElement.Element}
                                                        />
                                                    </div>
                                                ) : (
                                                    <div className={controlsContainer}>
                                                        {this.props.prescriptionBuilderState.selectedSection === sectionId ? (
                                                            <div className={selectedControlContainerClass}>
                                                                <div className={editControlContainer}>
                                                                    <div className={threeColumns}>
                                                                        <Typography variant="body1">This section has no configurable options</Typography>
                                                                        <div/>
                                                                        <div className={dragIconContainerClass}>
                                                                            <DraggableExistingFormElement sectionType={IPrescriptionSectionTemplateType.Regular} id={sectionId}/>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <Divider/>
                                                                <div className={fieldPaletteClass}>
                                                                    <Button color="secondary" onClick={this.unselectControl}>Exit</Button>
                                                                    <Button color="secondary" onClick={this.removeSection}>Delete Section</Button>
                                                                </div>
                                                            </div>
                                                        ) : undefined}
                                                        {controlOrderForSection.map((controlId, controlIndex) => {
                                                            const isSelectedControl = controlId === selectedControl;
                                                            return (
                                                                <div
                                                                    key={controlId}
                                                                    className={controlContainer}
                                                                    onClick={this.selectControl(controlId)}
                                                                >
                                                                    {controlIndex === 0 ? (
                                                                        <FormElementDropZone
                                                                            heightInPixels={16}
                                                                            onDrop={this.onDropControl(sectionId, controlIndex)}
                                                                            allowSectionOrElement={SectionOrElement.Element}
                                                                        />
                                                                    ) : undefined}
                                                                    {isSelectedControl ? (
                                                                        <div className={selectedControlContainerClass}>
                                                                            <div className={editControlContainer}>
                                                                                {this.correctControlEdit(controlId)}
                                                                            </div>
                                                                            <Divider/>
                                                                            <div className={fieldPaletteClass}>
                                                                                <Button color="secondary" onClick={this.unselectControl}>Exit</Button>
                                                                                <Button color="secondary" onClick={this.removeControl}>Delete Field</Button>
                                                                            </div>
                                                                        </div>
                                                                    ): (
                                                                        this.correctControlDisplay(controlId)
                                                                    )}
                                                                    <FormElementDropZone
                                                                        heightInPixels={16}
                                                                        onDrop={this.onDropControl(sectionId, controlIndex + 1)}
                                                                        allowSectionOrElement={SectionOrElement.Element}
                                                                    />
                                                                </div>
                                                            )
                                                        })}
                                                    </div>
                                                )}
                                            </div>
                                            {(currentSection.type === IPrescriptionSectionTemplateType.Duplicatable) ? (
                                                <div className={duplicateSectionButtonContainer}>
                                                    <Button color="secondary" disabled={editMode}>Duplicate</Button>
                                                </div>
                                            ) : undefined}
                                            <FormElementDropZone
                                                heightInPixels={32}
                                                onDrop={this.onDropSection(sectionIndex + 1)}
                                                allowSectionOrElement={SectionOrElement.Section}
                                            />
                                        </div>
                                    )
                                })}
                            </div>
                            </div>
                        )}
                    </Paper>
                )}
                <div className={drawerReplacement}/>
            </div>
        )
    }

    private onDropSection = (insertPosition: number) => (item: any) => {
        const isExistingSection = !!item.id;
        if (isExistingSection) {
            this.props.onDropExistingSection(item, insertPosition);
        } else {
            this.props.addNewSectionTemplate(item, insertPosition);
        }
    }

    private onDropControl = (sectionId: string, insertPosition: number) => (item: any) => {
        const isExistingControl = !!item.id;
        if (isExistingControl) {
            this.props.onDropExistingControl(sectionId, insertPosition, item);
        } else {
            this.props.onDropNewControl(sectionId, insertPosition, item);
        }
    }

    private handleControlValueChange = (controlId: string) => (event: any) => {
        this.props.updateControlValue(controlId, event.target.value);
    }

    private selectSection = (sectionId: string) => () => {
        this.props.setSelectedControl(null);
        this.props.setSelectedSection(sectionId);
    }

    private correctControlDisplay = (controlId: string) => {
        const { editMode } = this.props.prescriptionBuilderState;
        const control = this.props.prescriptionBuilderState.prescriptionFormTemplate.controls[controlId];
        const controlValue = this.props.prescriptionBuilderState.controlValues[control.id]

        if (control.type === IPrescriptionControlTemplateType.Title) {
            return <TitleEdit control={control}/>
        } else if (control.type === IPrescriptionControlTemplateType.Dropdown) {
            return (
                <DropdownEdit
                    control={control}
                    controlValue={controlValue}
                    disabled={editMode}
                    updateControlValueActionCreator={updateControlValue}
                />
            )
        } else if (control.type === IPrescriptionControlTemplateType.DoctorInformation) {
            return (
                <DoctorInformationEdit
                    disabled={editMode}
                />
            )
        } else if (control.type === IPrescriptionControlTemplateType.MultilineText) {
            return (
                <MultilineTextEdit
                    control={control}
                    controlValue={controlValue}
                    disabled={editMode}
                    updateControlValueActionCreator={updateControlValue}
                />
            )
        } else if (control.type === IPrescriptionControlTemplateType.SingleLineText) {
            return (
                <SingleLineTextEdit
                    control={control}
                    controlValue={controlValue}
                    disabled={editMode}
                    updateControlValueActionCreator={updateControlValue}
                />
            )
        } else if (control.type === IPrescriptionControlTemplateType.Checkbox) {
            return (
                <div>
                    <FormControl>
                        <FormGroup row={true}>
                            {control.options.map(({ text, id }) => {
                                const valueForControl = this.props.prescriptionBuilderState.controlValues[control.id];
                                const valuesExistForControl = !!valueForControl;
                                const checked = valuesExistForControl && !!valueForControl[id];

                                return (
                                    <FormControlLabel
                                        key={id}
                                        label={text}
                                        onClick={this.handleCheckboxChange(control.id, id)}
                                        control={
                                            <Checkbox value={id} checked={checked} disabled={editMode}/>
                                        }
                                    />
                                )
                            })}
                        </FormGroup>
                    </FormControl>
                </div>
            )
        } else if (control.type === IPrescriptionControlTemplateType.Number) {
            return (
                <FormControl fullWidth={true} disabled={editMode}>
                    <InputLabel htmlFor={`${control.id}-number`}>{control.label}</InputLabel>
                    <Input
                        type="number"
                        id={`${control.id}-number`}
                        value={this.props.prescriptionBuilderState.controlValues[control.id]}
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
            const value = this.props.prescriptionBuilderState.controlValues[control.id] || [];

            return (
                <FormControl fullWidth={true} disabled={editMode}>
                    <InputLabel>Select Units</InputLabel>
                    <Select
                        multiple={true}
                        onChange={this.handleControlValueChange(control.id)}
                        value={value}
                        native={false}
                        // tslint:disable-next-line:jsx-no-lambda
                        renderValue={selected => {
                            if (selected) {
                                return (selected as any[]).join(', ');
                            } else {
                                return '';
                            }
                        }}
                    >
                        {this.createUnits(control.id)}
                    </Select>
                </FormControl>
            )
        } else if (control.type === IPrescriptionControlTemplateType.Date) {
            return (
                <DateFormatInput
                    disabled={editMode}
                    fullWidth={true}
                    label={control.label}
                    name="date-input"
                    value={this.props.prescriptionBuilderState.controlValues[control.id]}
                    onChange={this.handleDeadlineChange(control.id)}
                    min={new Date()}
                />
            )
        }

        return <div/>
    }

    private correctControlEdit = (controlId: string) => {
        const {
            threeColumns,
            optionsContainer,
            inputAndTrashContainer,
            trashIcon,
            addOptionButtonContainer,
            dragIconContainerClass,
        } = createPrescriptionBuilderClasses(this.props, this.state);

        const control = this.props.prescriptionBuilderState.prescriptionFormTemplate.controls[controlId];
        if (control.type === IPrescriptionControlTemplateType.Title) {
            return (
                <div className={threeColumns}>
                    <div>
                        <TextField
                            fullWidth={true}
                            label='Title Text'
                            value={control.title}
                            onChange={this.handleControlTitleChange}
                        />
                    </div>
                    <div/>
                    <div className={dragIconContainerClass}>
                        <DraggableExistingFormElement controlType={IPrescriptionControlTemplateType.Title} id={control.id}/>
                    </div>
                </div>
            )
        } else if (control.type === IPrescriptionControlTemplateType.Checkbox) {
            return (
                <div className={threeColumns}>
                    <div className={optionsContainer}>
                        {
                            control.options.map((option, optionIndex) => {
                                return (
                                    <div key={option.id} className={inputAndTrashContainer}>
                                        <FormControl fullWidth={true}>
                                            <InputLabel>Option {optionIndex + 1}</InputLabel>
                                            <Input
                                                value={option.text}
                                                onChange={this.handleOptionTextChange(option.id)}
                                            />
                                        </FormControl>
                                        {control.options.length > 2 ? (
                                            <TrashIcon onClick={this.deleteOption(option.id)} className={trashIcon}/>
                                        ) : undefined}
                                    </div>
                                )
                            })
                        }
                        <div className={addOptionButtonContainer}>
                            <Button onClick={this.handleAddOptionToDropdown} color="secondary">Add Option</Button>
                        </div>
                    </div>
                    <div/>
                    <div className={dragIconContainerClass}>
                        <DraggableExistingFormElement controlType={IPrescriptionControlTemplateType.Checkbox} id={control.id}/>
                    </div>
                </div>
            )
        } else if (control.type === IPrescriptionControlTemplateType.Date) {
            return (
                <div className={threeColumns}>
                    <div>
                        <FormControl fullWidth={true}>
                            <InputLabel>Label</InputLabel>
                            <Input
                                value={control.label}
                                onChange={this.handleControlLabelChange}
                            />
                        </FormControl>
                    </div>
                    <div/>
                    <div className={dragIconContainerClass}>
                        <DraggableExistingFormElement controlType={IPrescriptionControlTemplateType.Date} id={control.id}/>
                    </div>
                </div>
            )
        } else if (control.type === IPrescriptionControlTemplateType.NonEditableText) {
            return (
                <div className={threeColumns}>
                    <div>
                        <FormControl fullWidth={true}>
                            <InputLabel>Text</InputLabel>
                            <Input
                                multiline={true}
                                value={control.text}
                                onChange={this.handleControlTextChange}
                            />
                        </FormControl>
                    </div>
                    <div/>
                    <div className={dragIconContainerClass}>
                        <DraggableExistingFormElement controlType={IPrescriptionControlTemplateType.NonEditableText} id={control.id}/>
                    </div>
                </div>
            )
        } else if (control.type === IPrescriptionControlTemplateType.DoctorInformation || control.type === IPrescriptionControlTemplateType.UnitSelection) {
            return (
                <div className={threeColumns}>
                    <div>
                        <Typography variant="body1">This field has no configurable options</Typography>
                    </div>
                    <div/>
                    <div className={dragIconContainerClass}>
                        <DraggableExistingFormElement controlType={IPrescriptionControlTemplateType.DoctorInformation} id={control.id}/>
                    </div>
                </div>
            )
        } else if (control.type === IPrescriptionControlTemplateType.Dropdown) {
            return (
                <div className={threeColumns}>
                    <div>
                        <FormControl fullWidth={true}>
                            <InputLabel>Label</InputLabel>
                            <Input
                                value={control.label}
                                onChange={this.handleControlLabelChange}
                            />
                        </FormControl>
                    </div>
                    <div className={optionsContainer}>
                        {
                            control.options.map((option, optionIndex) => {
                                return (
                                    <div key={option.id} className={inputAndTrashContainer}>
                                        <FormControl fullWidth={true}>
                                            <InputLabel>Option {optionIndex + 1}</InputLabel>
                                            <Input
                                                value={option.text}
                                                onChange={this.handleOptionTextChange(option.id)}
                                            />
                                        </FormControl>
                                        {control.options.length > 2 ? (
                                            <TrashIcon onClick={this.deleteOption(option.id)} className={trashIcon}/>
                                        ) : undefined}
                                    </div>
                                )
                            })
                        }
                        <div className={addOptionButtonContainer}>
                            <Button onClick={this.handleAddOptionToDropdown} color="secondary">Add Option</Button>
                        </div>
                    </div>
                    <div className={dragIconContainerClass}>
                        <DraggableExistingFormElement controlType={IPrescriptionControlTemplateType.Dropdown} id={control.id}/>
                    </div>
                </div>
            )
        } else if (control.type === IPrescriptionControlTemplateType.MultilineText) {
            return (
                <div className={threeColumns}>
                    <div>
                        <FormControl fullWidth={true}>
                            <InputLabel>Label</InputLabel>
                            <Input
                                value={control.label}
                                onChange={this.handleControlLabelChange}
                            />
                        </FormControl>
                    </div>
                    <div/>
                    <div className={dragIconContainerClass}>
                        <DraggableExistingFormElement controlType={IPrescriptionControlTemplateType.MultilineText} id={control.id}/>
                    </div>
                </div>
            )
        } else if (control.type === IPrescriptionControlTemplateType.Number) {
            return (
                <div className={threeColumns}>
                    <div>
                        <FormControl fullWidth={true}>
                            <InputLabel>Label</InputLabel>
                            <Input
                                value={control.label}
                                onChange={this.handleControlLabelChange}
                            />
                        </FormControl>
                    </div>
                    <div>
                        <FormControl fullWidth={true}>
                            <InputLabel>Prefix</InputLabel>
                            <Input
                                value={control.prefix}
                                onChange={this.handlePrefixChange}
                            />
                        </FormControl>
                        <FormControl fullWidth={true}>
                            <InputLabel>Suffix</InputLabel>
                            <Input
                                value={control.suffix}
                                onChange={this.handleSuffixChange}
                            />
                        </FormControl>
                    </div>
                    <div className={dragIconContainerClass}>
                        <DraggableExistingFormElement controlType={IPrescriptionControlTemplateType.Number} id={control.id}/>
                    </div>
                </div>
            )
        } else if (control.type === IPrescriptionControlTemplateType.SingleLineText) {
            return (
                <div className={threeColumns}>
                    <div>
                        <FormControl fullWidth={true}>
                            <InputLabel>Label</InputLabel>
                            <Input
                                value={control.label}
                                onChange={this.handleControlLabelChange}
                            />
                        </FormControl>
                    </div>
                    <div/>
                    <div className={dragIconContainerClass}>
                        <DraggableExistingFormElement controlType={IPrescriptionControlTemplateType.SingleLineText} id={control.id}/>
                    </div>
                </div>
            )
        }


        return <div>Editing this control: {controlId}</div>
    }

    private handleCheckboxChange = (controlId: string, optionId: string) => (event: any) => {
        const { editMode } = this.props.prescriptionBuilderState;
        if (editMode) {
            return;
        }

        const controlValuesCopy = cloneDeep(this.props.prescriptionBuilderState.controlValues);
        const valuesExists = !!controlValuesCopy[controlId];

        if (valuesExists) {
            const currentValue = !!controlValuesCopy[controlId][optionId];
            controlValuesCopy[controlId][optionId] = !currentValue;
        } else {
            controlValuesCopy[controlId] = {
                [optionId]: true,
            }
        }

        this.props.updateControlValue(controlId, controlValuesCopy[controlId]);
    }

    private handleDeadlineChange = (controlId: string) => (newDeadline: any) => {
        this.props.updateControlValue(controlId, newDeadline);
    }

    private createUnits = (controlId: string) => {
        const units = [];
        for (let i = 1; i <= 32; i++) {
            units.push(i);
        }

        return units.map((unitNumber) => {
            const valuesExists = !!this.props.prescriptionBuilderState.controlValues[controlId];
            const checked = valuesExists && this.props.prescriptionBuilderState.controlValues[controlId].indexOf(unitNumber) > -1;

            return (
                <MenuItem key={unitNumber} value={unitNumber}>
                    <Checkbox checked={checked}/>
                    <ListItemText primary={unitNumber}/>
                </MenuItem>
            )
        });
    }

    private handlePrefixChange = (event: any) => {
        const newPrefix = event.target.value;
        const selectedControlId = this.props.prescriptionBuilderState.selectedControl;

        const prescriptionFormTemplateCopy = cloneDeep(this.props.prescriptionBuilderState.prescriptionFormTemplate);
        (prescriptionFormTemplateCopy.controls[selectedControlId!] as INumberTemplateControl).prefix = newPrefix;
        this.props.setPrescriptionFormTemplate(prescriptionFormTemplateCopy);
    }

    private handleControlTextChange = (event: any) => {
        const newText = event.target.value;
        const selectedControlId = this.props.prescriptionBuilderState.selectedControl;

        const prescriptionFormTemplateCopy = cloneDeep(this.props.prescriptionBuilderState.prescriptionFormTemplate);
        (prescriptionFormTemplateCopy.controls[selectedControlId!] as INonEditableTextField).text = newText;
        this.props.setPrescriptionFormTemplate(prescriptionFormTemplateCopy);
    }

    private handleSuffixChange = (event: any) => {
        const newSuffix = event.target.value;
        const selectedControlId = this.props.prescriptionBuilderState.selectedControl;

        const prescriptionFormTemplateCopy = cloneDeep(this.props.prescriptionBuilderState.prescriptionFormTemplate);
        (prescriptionFormTemplateCopy.controls[selectedControlId!] as INumberTemplateControl).suffix = newSuffix;
        this.props.setPrescriptionFormTemplate(prescriptionFormTemplateCopy);
    }

    private selectControl = (controlId: string) => (event: any) => {
        const { editMode } = this.props.prescriptionBuilderState;

        event.stopPropagation();
        event.preventDefault();

        if (!editMode) {
            return;
        }

        const sectionId = this.props.prescriptionBuilderState.prescriptionFormTemplate.controls[controlId].sectionId;
        this.props.setSelectedControl(controlId);
        this.props.setSelectedSection(sectionId);
    }

    private unselectControl = (event: any) => {
        event.stopPropagation();
        event.preventDefault();
        this.props.setSelectedControl(null);
        this.props.setSelectedSection(null);
    }

    private handleControlTitleChange = (event: any) => {
        const newTitle = event.target.value;
        const selectedControlId = this.props.prescriptionBuilderState.selectedControl;

        const prescriptionFormTemplateCopy = cloneDeep(this.props.prescriptionBuilderState.prescriptionFormTemplate);
        (prescriptionFormTemplateCopy.controls[selectedControlId!] as ITitleTemplateControl).title = newTitle;
        this.props.setPrescriptionFormTemplate(prescriptionFormTemplateCopy);
    }

    private handleControlLabelChange = (event: any) => {
        const newLabel = event.target.value;
        const selectedControlId = this.props.prescriptionBuilderState.selectedControl;

        const prescriptionFormTemplateCopy = this.copyPrescriptionFormTemplate();
        (prescriptionFormTemplateCopy.controls[selectedControlId!] as IDropdownTemplateControl).label = newLabel;
        this.props.setPrescriptionFormTemplate(prescriptionFormTemplateCopy);
    }

    private handleOptionTextChange = (optionId: string) => (event: any) => {
        const newOptionText = event.target.value;
        const selectedControlId = this.props.prescriptionBuilderState.selectedControl!;

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
        this.props.setPrescriptionFormTemplate(prescriptionFormTemplateCopy);
    }

    private deleteOption = (optionId: string) => () => {
        const selectedControlId = this.props.prescriptionBuilderState.selectedControl!;

        const prescriptionFormTemplateCopy = this.copyPrescriptionFormTemplate();
        const currentOptions = (prescriptionFormTemplateCopy.controls[selectedControlId] as IDropdownTemplateControl).options;
        const optionsWithoutDeletedOption = currentOptions.filter((currentOption) => {
            return currentOption.id !== optionId;
        });

        (prescriptionFormTemplateCopy.controls[selectedControlId] as IDropdownTemplateControl).options = optionsWithoutDeletedOption;
        this.props.setPrescriptionFormTemplate(prescriptionFormTemplateCopy);
    }

    private copyPrescriptionFormTemplate = () => {
        return cloneDeep(this.props.prescriptionBuilderState.prescriptionFormTemplate);
    }

    private handleAddOptionToDropdown = () => {
        const selectedControlId = this.props.prescriptionBuilderState.selectedControl!;

        const prescriptionFormTemplateCopy = this.copyPrescriptionFormTemplate();
        const currentOptions = (prescriptionFormTemplateCopy.controls[selectedControlId] as IDropdownTemplateControl).options;
        const optionsWithNewOption = currentOptions.concat([{
            id: generateUniqueId(),
            text: 'Option Text',
        }]);

        (prescriptionFormTemplateCopy.controls[selectedControlId] as IDropdownTemplateControl).options = optionsWithNewOption;
        this.props.setPrescriptionFormTemplate(prescriptionFormTemplateCopy);
    }

    private removeSection = (event: any): void => {
        event.stopPropagation();
        event.preventDefault();

        this.props.removeSection();
    }

    private removeControl = (event: any): void => {
        event.stopPropagation();
        event.preventDefault();

        this.props.removeControl();
    }

    private updatePrescriptionTemplate = async (): Promise<void> => {
        const prescriptionTemplate = this.props.prescriptionBuilderState.prescriptionFormTemplate;
        this.setState({
            updatingPrescriptionTemplate: true,
        })

        const companyId = this.props.match.path.split('/')[2];
        await Api.prescriptionTemplateApi.updatePrescriptionTemplate(companyId, prescriptionTemplate);

        this.setState({
            snackbarIsOpen: true,
            updatingPrescriptionTemplateSuccess: true,
            updatingPrescriptionTemplate: false,
        })
    }

    private handleSnackbarClose = async(): Promise<void> => {
        this.setState({
            snackbarIsOpen: false,
        })
    }
}

const mapStateToProps = ({ prescriptionBuilderState }: IAppState) => ({
    prescriptionBuilderState,
});

const mapDispatchToProps = (dispatch: React.Dispatch<any>) => ({
    setPrescriptionFormTemplate: (prescriptionFormTemplate: IPrescriptionFormTemplate) => {
        const setPrescriptionFormTemplateAction = setPrescriptionFormTemplate(prescriptionFormTemplate);
        dispatch(setPrescriptionFormTemplateAction);
    },
    addNewSectionTemplate: (item: any, insertPosition: number) => {
        const addNewSectionAction = addNewSectionToPrescriptionFormTemplate(item, insertPosition);
        dispatch(addNewSectionAction);
    },
    onDropExistingSection: (item: any, insertPosition: number) => {
        const onDropExistingSectionAction = onDropExistingSectionPrescriptionFormTemplate(item, insertPosition);
        dispatch(onDropExistingSectionAction);
    },
    onDropNewControl: (sectionId: string, insertPosition: number, item: any) => {
        const onDropNewControlAction = onDropNewControlPrescriptionFormTemplate(
            sectionId,
            insertPosition,
            item,
        );
        dispatch(onDropNewControlAction);
    },
    onDropExistingControl: (targetSectionId: string, insertPosition: number, item: any) => {
        const onDropExistingControlAction = onDropExistingControlPrescriptionFormTemplate(
            targetSectionId,
            insertPosition,
            item,
        );
        dispatch(onDropExistingControlAction);
    },
    removeControl: () => {
        const removeControlAction = removeControlPrescriptionFormTemplate();
        dispatch(removeControlAction);
    },
    removeSection: () => {
        const removeSectionAction = removeSectionPrescriptionFormTemplate();
        dispatch(removeSectionAction);
    },
    setSelectedControl: (controlId: string | null) => {
        const setSelectedControlAction = setSelectedControl(controlId);
        dispatch(setSelectedControlAction);
    },
    setSelectedSection: (sectionId: string | null) => {
        const setSelectedSectionAtion = setSelectedSection(sectionId);
        dispatch(setSelectedSectionAtion);
    },
    updateControlValue: (controlId: string, value: any) => {
        const updateControlValueAction = updateControlValue(controlId, value);
        dispatch(updateControlValueAction);
    }
})

const connectedComponent = connect(mapStateToProps, mapDispatchToProps)(PrescriptionBuilderPresentation);
const componentWithTheme = withTheme()(connectedComponent);
export const PrescriptionBuilder = withRouter(componentWithTheme);