import {
    Button,
    Drawer,
    FormControl,
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
            id: '1',
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
            hoverArea,
            innerDrawerContainer,
            drawerVerticalSpacing,
            addSectionOrFieldContainer,
            buttonLeftMargin,
        } = createPrescriptionBuilderClasses(this.props, this.state);

        const {
            selectedSection,
            prescriptionFormTemplate,
            // selectedControl,
        } = this.state;

        const {
            sections,
            // controls,
            sectionOrder,
            // controlOrder,
        } = prescriptionFormTemplate;

        return (
            <div className={prescriptionBuilderContainer}>
                <Drawer
                    variant="permanent"
                    anchor="right"
                    classes={{
                        paper: drawerPaper,
                    }}
                >
                    <div className={innerDrawerContainer}>
                        {selectedSection ? (
                            <div className={drawerVerticalSpacing}>
                                <FormControl fullWidth={true}>
                                    <InputLabel>Section Title</InputLabel>
                                    <Input
                                        value={sections[selectedSection].title}
                                        onChange={this.handleSelectedSectionTitleChange}
                                    />
                                </FormControl>
                                <div className={addSectionOrFieldContainer}>
                                    <Typography variant="subheading">Add A Section:</Typography>
                                    <div>
                                        <Button color="secondary" onClick={this.addSectionBeforeSelected}>Before</Button>
                                        <Button color="secondary" className={buttonLeftMargin} onClick={this.addSectionAfterSelected}>After</Button>
                                    </div>
                                </div>
                                <div>
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
                    <Button onClick={this.addSection(0)}>Add A Section</Button>
                    <div className={sectionsContainer}>
                        {sectionOrder.map((sectionId) => {
                            const section = sections[sectionId];
                            let sectionClasses = sectionsContainer;

                            if (sectionId === this.state.hoveredSection) {
                                sectionClasses += ` ${hoverArea}`;
                            }

                            return (
                                <div
                                    key={sectionId}
                                    className={sectionClasses}
                                    onMouseEnter={this.setHoverSection(sectionId)}
                                    onMouseLeave={this.removeHoverSection}
                                    onClick={this.selectSection(sectionId)}
                                >
                                    <Typography variant="title">{section.title}</Typography>
                                </div>
                            )
                        })}
                    </div>
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

    private handleSelectedSectionTitleChange = (event: any) => {
        const newTitleValue = event.target.value;
        const selectedSection = this.state.prescriptionFormTemplate.sections[this.state.selectedSection!];
        const sectionClone = cloneDeep(selectedSection)!;
        sectionClone.title = newTitleValue;

        const prescriptionFormTemplateCopy = cloneDeep(this.state.prescriptionFormTemplate);
        prescriptionFormTemplateCopy.sections[sectionClone.id] = sectionClone;

        this.setState({
            prescriptionFormTemplate: prescriptionFormTemplateCopy,
        })
    }

    private addSection = (insertPosition: number) => () => {
        const id = generateUniqueId();
        const newSection: IPrescriptionSectionTemplate = {
            id,
            title: 'New Section',
            validators: [],
        }

        const prescriptionFormTemplateCopy = cloneDeep(this.state.prescriptionFormTemplate);

        const before = prescriptionFormTemplateCopy.sectionOrder.slice(0, insertPosition);
        const after = prescriptionFormTemplateCopy.sectionOrder.slice(insertPosition);
        const sectionOrder = before.concat([id]).concat(after);

        prescriptionFormTemplateCopy.sections[id] = newSection;
        prescriptionFormTemplateCopy.sectionOrder = sectionOrder;

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