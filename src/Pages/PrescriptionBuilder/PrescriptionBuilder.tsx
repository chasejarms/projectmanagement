import {
    Button,
    Checkbox,
    Drawer,
    FormControl,
    FormControlLabel,
    Input,
    InputLabel,
    Paper,
    Typography,
    withTheme,
} from '@material-ui/core';
import { cloneDeep } from 'lodash';
import * as React from 'react';
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
        } = createPrescriptionBuilderClasses(this.props, this.state);

        const {
            selectedSection,
            prescriptionFormTemplate,
            selectedControl,
        } = this.state;

        const {
            sections,
            // controls,
            sectionOrder,
            controlOrder,
        } = prescriptionFormTemplate;

        const section = sections[this.state.selectedSection!];
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
                                    <Typography variant="subheading">Add A Field:</Typography>
                                    <div>
                                        <Button color="secondary">Beginning</Button>
                                        <Button color="secondary" className={buttonLeftMargin}>End</Button>
                                    </div>
                                </div>
                            </div>
                        ): undefined}
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

                                if (sectionId === this.state.hoveredSection) {
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
                                                <div/>
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
        });
    }

    private removeHoverSection = () => {
        this.setState({
            hoveredSection: null,
        })
    }

    private selectSection = (sectionId: string) => () => {
        this.setState({
            selectedSection: sectionId,
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

    // private addControlToSection = (): void => {
    //     //
    // }

    // private removeSection = (): void => {
    //     //
    // }

    // private removeControlFromSection =(): void => {
    //     //
    // }
}

export const PrescriptionBuilder = withTheme()(PrescriptionBuilderPresentation)