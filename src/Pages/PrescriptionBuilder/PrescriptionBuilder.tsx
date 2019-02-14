import {
    Button,
    Drawer,
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
        }
    }

    public render() {
        const {
            drawerPaper,
            prescriptionBuilderContainer,
            prescriptionFormContainer,
            drawerReplacement,
            sectionsContainer,
        } = createPrescriptionBuilderClasses(this.props, this.state);

        const {
            sections,
            // controls,
            sectionOrder,
            // controlOrder,
        } = this.state.prescriptionFormTemplate;

        return (
            <div className={prescriptionBuilderContainer}>
                <Drawer
                    variant="permanent"
                    anchor="right"
                    classes={{
                        paper: drawerPaper,
                    }}
                >
                    <p>Nothing here</p>
                </Drawer>
                <Paper className={prescriptionFormContainer}>
                    <Button onClick={this.addSection(0)}>Add A Section</Button>
                    <div className={sectionsContainer}>
                        {sectionOrder.map((sectionId) => {
                            const section = sections[sectionId];
                            return (
                                <div key={sectionId} className={sectionsContainer}>
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