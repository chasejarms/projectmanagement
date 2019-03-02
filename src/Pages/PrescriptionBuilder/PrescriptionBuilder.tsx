import {
    Button,
    Checkbox,
    Divider,
    Drawer,
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
    TextField,
    Typography,
    withTheme,
} from '@material-ui/core';
import TrashIcon from '@material-ui/icons/Delete';
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
import { IPrescriptionSectionTemplate } from 'src/Models/prescription/sections/prescriptionSectionTemplate';
import { IPrescriptionSectionTemplateType } from 'src/Models/prescription/sections/prescriptionSectionTemplateType';
import { SectionOrElement } from 'src/Models/sectionOrElement';
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
            prescriptionFormInnerContainer,
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
            drawerTitleContainer,
            noFieldsContainer,
            selectedControlContainerClass,
            fieldPaletteClass,
            // hrClass,
            editControlContainer,
            editModeButtonContainer,
        } = createPrescriptionBuilderClasses(this.props, this.state);

        const {
            prescriptionFormTemplate,
            selectedControl,
        } = this.state;

        const {
            sections,
            sectionOrder,
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
                        <div>
                            <div className={drawerTitleContainer}>
                                <Typography variant="title">Sections</Typography>
                            </div>
                            <div className={draggableIconsContainer}>
                                <DraggableFormElement sectionType={IPrescriptionSectionTemplateType.Regular}/>
                                <DraggableFormElement sectionType={IPrescriptionSectionTemplateType.Duplicatable}/>
                                <DraggableFormElement sectionType={IPrescriptionSectionTemplateType.Advanced}/>
                            </div>
                            <div className={drawerTitleContainer}>
                                <Typography variant="title">Elements</Typography>
                            </div>
                            <div className={draggableIconsContainer}>
                                <DraggableFormElement controlType={IPrescriptionControlTemplateType.Checkbox}/>
                                <DraggableFormElement controlType={IPrescriptionControlTemplateType.Date}/>
                                <DraggableFormElement controlType={IPrescriptionControlTemplateType.NonEditableText}/>
                                <DraggableFormElement controlType={IPrescriptionControlTemplateType.DoctorInformation}/>
                                <DraggableFormElement controlType={IPrescriptionControlTemplateType.Dropdown}/>
                                <DraggableFormElement controlType={IPrescriptionControlTemplateType.MultilineText}/>
                                <DraggableFormElement controlType={IPrescriptionControlTemplateType.Number}/>
                                <DraggableFormElement controlType={IPrescriptionControlTemplateType.SingleLineText}/>
                                <DraggableFormElement controlType={IPrescriptionControlTemplateType.Title}/>
                                <DraggableFormElement controlType={IPrescriptionControlTemplateType.UnitSelection}/>
                            </div>
                        </div>
                        <div className={editModeButtonContainer}>
                            <Button onClick={this.toggleEditMode} color="secondary">{this.state.editMode ? 'View Mode' : 'Edit Mode'}</Button>
                        </div>
                    </div>
                </Drawer>
                <Paper className={prescriptionFormContainer}>
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
                                                                            <Button color="secondary" onClick={this.unselectControl}>Exit Field Edit</Button>
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
                                                <Button color="secondary">Duplicate</Button>
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
                <div className={drawerReplacement}/>
            </div>
        )
    }

    private onDropSection = (insertPosition: number) => (item: any) => {
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

        const prescriptionFormTemplateCopy = cloneDeep(this.state.prescriptionFormTemplate);

        const before = prescriptionFormTemplateCopy.sectionOrder.slice(0, insertPosition);
        const after = prescriptionFormTemplateCopy.sectionOrder.slice(insertPosition);
        const sectionOrder = before.concat([id]).concat(after);

        prescriptionFormTemplateCopy.sections[id] = newSection!;
        prescriptionFormTemplateCopy.sectionOrder = sectionOrder;

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
        const currentControlOrder = prescriptionFormTemplateCopy.sections[sectionId].controlOrder;

        const before = currentControlOrder.slice(0, insertPosition);
        const after = currentControlOrder.slice(insertPosition);
        const updatedControlOrder = before.concat([id]).concat(after);

        prescriptionFormTemplateCopy.sections[sectionId].controlOrder = updatedControlOrder;

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

    private toggleEditMode = () => {
        this.setState({
            editMode: !this.state.editMode,
            controlValues: {},
            selectedControl: null,
        })
    }

    private selectSection = (sectionId: string) => () => {
        this.setState({
            selectedSection: sectionId,
            selectedControl: null,
        })
    }

    private correctControlDisplay = (controlId: string) => {
        const control = this.state.prescriptionFormTemplate.controls[controlId];
        const {
            cityStateZipContainer,
        } = createPrescriptionBuilderClasses(this.props, this.state);

        if (control.type === IPrescriptionControlTemplateType.Title) {
            return (
                <div>
                    <Typography variant="title">{control.title}</Typography>
                </div>
            )
        } else if (control.type === IPrescriptionControlTemplateType.Dropdown) {
            const value = this.state.controlValues[control.id] || '';

            return (
                <div>
                    <FormControl fullWidth={true} disabled={this.state.editMode}>
                        <InputLabel htmlFor={`${control.id}`}>{control.label}</InputLabel>
                        <Select
                            inputProps={{
                                name: control.id,
                                id: control.id,
                            }}
                            value={value}
                            onChange={this.handleControlValueChange(control.id)}
                        >
                            <MenuItem value={''}>No Selection</MenuItem>
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
                    <FormControl>
                        <FormGroup row={true}>
                            {control.options.map(({ text, id }) => {
                                const valueForControl = this.state.controlValues[control.id];
                                const valuesExistForControl = !!valueForControl;
                                const checked = valuesExistForControl && !!valueForControl[id];

                                return (
                                    <FormControlLabel
                                        key={id}
                                        label={text}
                                        onClick={this.handleCheckboxChange(control.id, id)}
                                        control={
                                            <Checkbox value={id} checked={checked} disabled={this.state.editMode}/>
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
                <FormControl fullWidth={true} disabled={this.state.editMode}>
                    <InputLabel htmlFor={`${control.id}-number`}>{control.label}</InputLabel>
                    <Input
                        type="number"
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
            const value = this.state.controlValues[control.id] || [];

            return (
                <FormControl fullWidth={true} disabled={this.state.editMode}>
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

    private correctControlEdit = (controlId: string) => {
        const {
            threeColumns,
            optionsContainer,
            inputAndTrashContainer,
            trashIcon,
            addOptionButtonContainer,
        } = createPrescriptionBuilderClasses(this.props, this.state);

        const control = this.state.prescriptionFormTemplate.controls[controlId];
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
                </div>
            )
        } else if (control.type === IPrescriptionControlTemplateType.DoctorInformation || control.type === IPrescriptionControlTemplateType.UnitSelection) {
            return (
                <Typography variant="body1">This field has no configurable options</Typography>
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
                    </div>
                    <div>
                        <FormControl fullWidth={true}>
                            <InputLabel>Suffix</InputLabel>
                            <Input
                                value={control.suffix}
                                onChange={this.handleSuffixChange}
                            />
                        </FormControl>
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
                </div>
            )
        }


        return <div>Editing this control: {controlId}</div>
    }

    private handleCheckboxChange = (controlId: string, optionId: string) => (event: any) => {
        if (this.state.editMode) {
            return;
        }

        const controlValuesCopy = cloneDeep(this.state.controlValues);
        const valuesExists = !!controlValuesCopy[controlId];

        if (valuesExists) {
            const currentValue = !!controlValuesCopy[controlId][optionId];
            controlValuesCopy[controlId][optionId] = !currentValue;
        } else {
            controlValuesCopy[controlId] = {
                [optionId]: true,
            }
        }

        this.setState({
            controlValues: controlValuesCopy,
        })
    }

    private handleDeadlineChange = (controlId: string) => (newDeadline: any) => {
        const controlValuesCopy = cloneDeep(this.state.controlValues);

        controlValuesCopy[controlId] = newDeadline;

        this.setState({
            controlValues: controlValuesCopy,
        })
    }

    private createUnits = (controlId: string) => {
        const units = [];
        for (let i = 1; i <= 32; i++) {
            units.push(i);
        }

        return units.map((unitNumber) => {
            const valuesExists = !!this.state.controlValues[controlId];
            const checked = valuesExists && this.state.controlValues[controlId].indexOf(unitNumber) > -1;

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
        const selectedControlId = this.state.selectedControl;

        const prescriptionFormTemplateCopy = cloneDeep(this.state.prescriptionFormTemplate);
        (prescriptionFormTemplateCopy.controls[selectedControlId!] as INumberTemplateControl).prefix = newPrefix;
        this.setState({
            prescriptionFormTemplate: prescriptionFormTemplateCopy,
        })
    }

    private handleControlTextChange = (event: any) => {
        const newText = event.target.value;
        const selectedControlId = this.state.selectedControl;

        const prescriptionFormTemplateCopy = cloneDeep(this.state.prescriptionFormTemplate);
        (prescriptionFormTemplateCopy.controls[selectedControlId!] as INonEditableTextField).text = newText;
        this.setState({
            prescriptionFormTemplate: prescriptionFormTemplateCopy,
        })
    }

    private handleSuffixChange = (event: any) => {
        const newSuffix = event.target.value;
        const selectedControlId = this.state.selectedControl;

        const prescriptionFormTemplateCopy = cloneDeep(this.state.prescriptionFormTemplate);
        (prescriptionFormTemplateCopy.controls[selectedControlId!] as INumberTemplateControl).suffix = newSuffix;
        this.setState({
            prescriptionFormTemplate: prescriptionFormTemplateCopy,
        })
    }

    private selectControl = (controlId: string) => (event: any) => {
        event.stopPropagation();
        event.preventDefault();

        if (!this.state.editMode) {
            return;
        }

        this.setState({
            selectedControl: controlId,
            selectedSection: null,
        })
    }

    private unselectControl = (event: any) => {
        event.stopPropagation();
        event.preventDefault();
        this.setState({
            selectedControl: null,
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

    private removeControl = (): void => {
        const selectedControlId = this.state.selectedControl!;

        const prescriptionFormTemplateCopy = this.copyPrescriptionFormTemplate();
        const control = prescriptionFormTemplateCopy.controls[selectedControlId];
        const sectionId = control.sectionId;
        const controlsWithoutSelectedSection = prescriptionFormTemplateCopy.sections[sectionId].controlOrder.filter((compareControlId) => {
            return compareControlId !== selectedControlId;
        });

        prescriptionFormTemplateCopy.sections[sectionId].controlOrder = controlsWithoutSelectedSection;

        delete prescriptionFormTemplateCopy.controls[selectedControlId];

        this.setState({
            prescriptionFormTemplate: prescriptionFormTemplateCopy,
            selectedControl: null,
        })
    }
}

export const PrescriptionBuilder = withTheme()(PrescriptionBuilderPresentation)